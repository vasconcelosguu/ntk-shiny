import { createClient } from "./supabase/server";
import { getPokemonShinySprite } from "./pokemon";

export type ShinyEntry = {
  pokemon: string;
  displayName: string;
  encounters: number;
  sprite: string | null;
  spriteUrls: string[];
};

export type ShinyBoardProfile = {
  username: string;
  totalShinies: number;
  totalEncounters: number;
  shinies: ShinyEntry[];
};

/**
 * Shiny registrado no banco.
 */
export type LatestShiny = {
  id: string;
  pokemon: string;
  displayName: string;
  pokemonId: number | null;
  encounters: number;
  caughtAt: string | null;
  username: string;
  sprite: string | null;
};

/**
 * Converte números vindos do HTML
 * do ShinyBoard.
 */
function parseNumber(value: string): number {
  const normalized = value
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/[^\d]/g, "");

  return Number(normalized) || 0;
}

/**
 * Normaliza o nome do Pokémon.
 */
function normalizePokemonName(name: string): string {
  return name
    .trim()
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/[’']/g, "")
    .replace(/[.:]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/**
 * Busca o perfil do ShinyBoard.
 */
export async function getShinyBoardProfile(
  username: string
): Promise<ShinyBoardProfile> {
  const url =
    `https://www.shinyboard.net/users/` +
    `${encodeURIComponent(username)}` +
    `?tab=shinies`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      console.error(
        `[SHINYBOARD] Status ${response.status} para ${username}`
      );

      return emptyProfile(username);
    }

    const html = await response.text();

    console.log(
      `[SHINYBOARD] ${username} status:`,
      response.status
    );

    console.log(
      `[SHINYBOARD] ${username} HTML length:`,
      html.length
    );

    const parsedShinies = parseShinies(html);

    console.log(
      `[SHINYBOARD] ${username} parsed shinies:`,
      parsedShinies.length
    );

    console.log(
      `[SHINYBOARD] ${username} Pokémon:`,
      parsedShinies.map(
        (x) => x.displayName
      )
    );

    /**
     * Busca as sprites em paralelo.
     */
    const shinies = await Promise.all(
      parsedShinies.map(
        async (shiny) => {
          const spriteUrls =
            await getPokemonShinySprite(
              shiny.displayName
            );

          const resolvedSpriteUrls =
            Array.isArray(spriteUrls)
              ? spriteUrls
              : spriteUrls
              ? [spriteUrls]
              : [];

          const sprite =
            resolvedSpriteUrls[0] ?? null;

          console.log(
            `[SHINY] ${shiny.displayName}`
          );

          console.log(
            `[SHINY] Sprite principal:`,
            sprite
          );

          console.log(
            `[SHINY] Fallbacks:`,
            resolvedSpriteUrls
          );

          return {
            ...shiny,
            sprite,
            spriteUrls:
              resolvedSpriteUrls,
          };
        }
      )
    );

    const totalEncounters =
      shinies.reduce(
        (sum, shiny) =>
          sum + shiny.encounters,
        0
      );

    return {
      username,
      totalShinies:
        shinies.length,
      totalEncounters,
      shinies,
    };
  } catch (error) {
    console.error(
      `[SHINYBOARD] Erro para ${username}:`,
      error
    );

    return emptyProfile(username);
  }
}

/**
 * Busca os últimos shinys registrados
 * no banco de dados.
 *
 * IMPORTANTE:
 * Aqui NÃO fazemos deduplicação.
 * Cada shiny_entry é um registro independente.
 */
export async function getLatestShinies(
  limit = 10
): Promise<LatestShiny[]> {
  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } = await supabase
      .from("shiny_entries")
      .select(
        `
          id,
          pokemon,
          display_name,
          pokemon_id,
          encounters,
          caught_at,
          shiny_players!inner (
            username
          )
        `
      )
      .order(
        "caught_at",
        {
          ascending: false,
        }
      )
      .limit(limit);

    if (error) {
      console.error(
        "[SHINYBOARD] Erro buscando últimos shinys:",
        error
      );

      return [];
    }

    return (data ?? []).map(
      (entry: any) => {
        const player =
          Array.isArray(
            entry.shiny_players
          )
            ? entry.shiny_players[0]
            : entry.shiny_players;

        const pokemonId =
          entry.pokemon_id
            ? Number(entry.pokemon_id)
            : null;

        return {
          id: String(entry.id),

          pokemon:
            entry.pokemon ?? "",

          displayName:
            entry.display_name ??
            entry.pokemon ??
            "Unknown",

          pokemonId,

          encounters:
            Number(
              entry.encounters ?? 0
            ),

          caughtAt:
            entry.caught_at ?? null,

          username:
            player?.username ??
            "Unknown",

          sprite: pokemonId
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`
            : null,
        };
      }
    );
  } catch (error) {
    console.error(
      "[SHINYBOARD] Erro inesperado buscando últimos shinys:",
      error
    );

    return [];
  }
}

/**
 * Perfil vazio em caso de erro.
 */
function emptyProfile(
  username: string
): ShinyBoardProfile {
  return {
    username,
    totalShinies: 0,
    totalEncounters: 0,
    shinies: [],
  };
}

/**
 * Extrai os Shinies do HTML.
 */
function parseShinies(
  html: string
): ShinyEntry[] {
  const results: ShinyEntry[] = [];

  const rowRegex =
    /<tr[^>]*>([\s\S]*?)<\/tr>/gi;

  const cellRegex =
    /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

  let rowMatch:
    | RegExpExecArray
    | null;

  while (
    (rowMatch =
      rowRegex.exec(html)) !== null
  ) {
    const rowHtml =
      rowMatch[1];

    const cells: string[] = [];

    let cellMatch:
      | RegExpExecArray
      | null;

    while (
      (cellMatch =
        cellRegex.exec(
          rowHtml
        )) !== null
    ) {
      const text =
        stripHtml(
          cellMatch[1]
        );

      if (text) {
        cells.push(text);
      }
    }

    /**
     * Precisamos de pelo menos
     * nome + encounters.
     */
    if (cells.length < 2) {
      continue;
    }

    const pokemonName =
      cells[0];

    const encountersText =
      cells[cells.length - 1];

    /**
     * Ignorar cabeçalhos.
     */
    const lowerName =
      pokemonName.toLowerCase();

    if (
      lowerName === "name" ||
      lowerName === "pokemon"
    ) {
      continue;
    }

    /**
     * Evita pegar linhas que claramente
     * não são Pokémon.
     */
    if (
      !isLikelyPokemonName(
        pokemonName
      )
    ) {
      continue;
    }

    const encounters =
      parseNumber(
        encountersText
      );

    results.push({
      pokemon:
        normalizePokemonName(
          pokemonName
        ),

      displayName:
        pokemonName,

      encounters,

      sprite: null,

      spriteUrls: [],
    });
  }

  return deduplicateShinies(
    results
  );
}

/**
 * Remove HTML e entidades básicas.
 */
function stripHtml(
  value: string
): string {
  return value
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      ""
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      ""
    )
    .replace(
      /<[^>]+>/g,
      " "
    )
    .replace(
      /&nbsp;/gi,
      " "
    )
    .replace(
      /&amp;/gi,
      "&"
    )
    .replace(
      /&#39;/gi,
      "'"
    )
    .replace(
      /&quot;/gi,
      '"'
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

/**
 * Verifica se o texto pode ser
 * um nome de Pokémon.
 */
function isLikelyPokemonName(
  name: string
): boolean {
  return (
    name.length >= 2 &&
    name.length <= 30 &&
    !/^\d+$/.test(name)
  );
}

/**
 * Remove Pokémon duplicados
 * dentro do HTML de UM perfil.
 */
function deduplicateShinies(
  shinies: ShinyEntry[]
): ShinyEntry[] {
  const map =
    new Map<
      string,
      ShinyEntry
    >();

  for (
    const shiny of shinies
  ) {
    const key =
      shiny.displayName
        .toLowerCase();

    if (
      !map.has(key)
    ) {
      map.set(
        key,
        shiny
      );
    }
  }

  return Array.from(
    map.values()
  );
}