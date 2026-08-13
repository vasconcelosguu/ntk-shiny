import { getPokemonShinySprite } from "./pokemon";

export type ShinyEntry = {
  pokemon: string;
  displayName: string;
  encounters: number;
  sprite: string | null;
};

export type ShinyBoardProfile = {
  username: string;
  totalShinies: number;
  totalEncounters: number;
  shinies: ShinyEntry[];
};

/**
 * Converte números encontrados no HTML.
 *
 * Exemplos:
 * 1,234       -> 1234
 * 1.234       -> 1234
 * 123.456     -> 123456
 * 123456      -> 123456
 */
function parseNumber(value: string): number {
  const normalized = value
    .replace(/[^\d.,]/g, "")
    .replace(/[.,]/g, "");

  return Number(normalized) || 0;
}

/**
 * Normaliza o nome para ser utilizado pela PokeAPI/Pokémon sprite.
 */
function normalizePokemonName(name: string): string {
  return name
    .trim()
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/[’']/g, "")
    .replace(/\./g, "")
    .replace(/:/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/**
 * Busca o perfil público do jogador no ShinyBoard.
 */
export async function getShinyBoardProfile(
  username: string
): Promise<ShinyBoardProfile> {
  const url =
    `https://www.shinyboard.net/users/` +
    `${encodeURIComponent(username)}?tab=shinies`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",

        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

        "Accept-Language":
          "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!response.ok) {
      console.error(
        `ShinyBoard retornou ${response.status} para ${username}`
      );

      return emptyProfile(username);
    }

    const html = await response.text();

    /*
     * Primeiro encontramos os shinies.
     */
    const parsedShinies = parseShinies(html);

    /*
     * Agora buscamos as sprites.
     *
     * O código antigo nunca fazia isso.
     *
     * Promise.all permite buscar várias sprites
     * simultaneamente.
     */
    const shinies = await Promise.all(
      parsedShinies.map(async (shiny) => {
        try {
          const sprite = await getPokemonShinySprite(
            shiny.pokemon
          );

          return {
            ...shiny,
            sprite,
          };
        } catch (error) {
          console.error(
            `Erro ao buscar sprite de ${shiny.pokemon}:`,
            error
          );

          return {
            ...shiny,
            sprite: null,
          };
        }
      })
    );

    const totalEncounters = shinies.reduce(
      (sum, shiny) => sum + shiny.encounters,
      0
    );

    return {
      username,
      totalShinies: shinies.length,
      totalEncounters,
      shinies,
    };
  } catch (error) {
    console.error(
      `Erro ao buscar ShinyBoard de ${username}:`,
      error
    );

    return emptyProfile(username);
  }
}

/**
 * Perfil vazio utilizado quando o ShinyBoard não responde.
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
 * Procura possíveis linhas de tabela contendo Pokémon.
 */
function parseShinies(html: string): ShinyEntry[] {
  const results: ShinyEntry[] = [];

  /*
   * Procuramos todas as linhas <tr>.
   */
  const rowRegex =
    /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;

  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];

    /*
     * Procuramos células <td> e <th>.
     */
    const cellRegex =
      /<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;

    const cells: string[] = [];

    let cellMatch: RegExpExecArray | null;

    while (
      (cellMatch = cellRegex.exec(rowHtml)) !== null
    ) {
      const text = stripHtml(cellMatch[1]);

      if (text) {
        cells.push(text);
      }
    }

    /*
     * Precisamos de pelo menos duas células:
     *
     * Pokémon | Encounters
     */
    if (cells.length < 2) {
      continue;
    }

    const pokemonName = cells[0];

    /*
     * A última célula normalmente representa
     * os encounters.
     */
    const encountersText =
      cells[cells.length - 1];

    /*
     * Ignora cabeçalhos.
     */
    const lowerName =
      pokemonName.toLowerCase();

    if (
      lowerName === "name" ||
      lowerName === "pokemon" ||
      lowerName === "pokémon"
    ) {
      continue;
    }

    /*
     * Verifica se parece ser um Pokémon.
     */
    if (!isLikelyPokemonName(pokemonName)) {
      continue;
    }

    /*
     * Verifica se a última célula realmente possui
     * algum número.
     */
    const encounters =
      parseNumber(encountersText);

    /*
     * Caso não exista número algum, provavelmente
     * não é uma linha de shiny.
     */
    if (
      encounters === 0 &&
      !/\d/.test(encountersText)
    ) {
      continue;
    }

    results.push({
      pokemon: normalizePokemonName(
        pokemonName
      ),

      displayName: pokemonName,

      encounters,

      sprite: null,
    });
  }

  return deduplicateShinies(results);
}

/**
 * Remove HTML e normaliza entidades.
 */
function stripHtml(value: string): string {
  return value
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      ""
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      ""
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"')
    .replace(/&rsquo;/gi, "'")
    .replace(/&ndash;/gi, "-")
    .replace(/&mdash;/gi, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validação básica do nome.
 */
function isLikelyPokemonName(
  name: string
): boolean {
  if (!name) {
    return false;
  }

  if (name.length < 2) {
    return false;
  }

  if (name.length > 40) {
    return false;
  }

  if (/^\d+$/.test(name)) {
    return false;
  }

  /*
   * Evita textos obviamente relacionados
   * a estatísticas do site.
   */
  const ignored = [
    "encounters",
    "points",
    "views",
    "shinies",
    "total",
    "ranking",
    "trainer",
    "metric",
    "actions",
  ];

  const lower = name.toLowerCase();

  if (ignored.includes(lower)) {
    return false;
  }

  return true;
}

/**
 * Remove Pokémon duplicados.
 */
function deduplicateShinies(
  shinies: ShinyEntry[]
): ShinyEntry[] {
  const map =
    new Map<string, ShinyEntry>();

  for (const shiny of shinies) {
    const key =
      shiny.displayName
        .trim()
        .toLowerCase();

    if (!map.has(key)) {
      map.set(key, shiny);
    }
  }

  return Array.from(map.values());
}