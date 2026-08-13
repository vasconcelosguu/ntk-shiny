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

function parseNumber(value: string): number {
  const normalized = value
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/[^\d]/g, "");

  return Number(normalized) || 0;
}

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
          "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      console.error(
        `ShinyBoard retornou ${response.status} para ${username}`
      );

      return emptyProfile(username);
    }

    const html = await response.text();

    const parsedShinies = parseShinies(html);

    const shinies = await Promise.all(
      parsedShinies.map(async (shiny) => {
        const sprite =
          await getPokemonShinySprite(
            shiny.displayName
          );

        console.log(
          `Sprite ${shiny.displayName}:`,
          sprite
        );

        return {
          ...shiny,
          sprite,
        };
      })
    );

    const totalEncounters = shinies.reduce(
      (sum, shiny) =>
        sum + shiny.encounters,
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

function parseShinies(
  html: string
): ShinyEntry[] {
  const results: ShinyEntry[] = [];

  const rowRegex =
    /<tr[^>]*>([\s\S]*?)<\/tr>/gi;

  const cellRegex =
    /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

  let rowMatch: RegExpExecArray | null;

  while (
    (rowMatch = rowRegex.exec(html)) !== null
  ) {
    const rowHtml = rowMatch[1];

    const cells: string[] = [];

    let cellMatch: RegExpExecArray | null;

    while (
      (cellMatch = cellRegex.exec(rowHtml)) !== null
    ) {
      const text = stripHtml(
        cellMatch[1]
      );

      if (text) {
        cells.push(text);
      }
    }

    if (cells.length < 2) {
      continue;
    }

    const pokemonName = cells[0];

    const encountersText =
      cells[cells.length - 1];

    const lowerName =
      pokemonName.toLowerCase();

    if (
      lowerName === "name" ||
      lowerName === "pokemon"
    ) {
      continue;
    }

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
    });
  }

  return deduplicateShinies(
    results
  );
}

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

function isLikelyPokemonName(
  name: string
): boolean {
  return (
    name.length >= 2 &&
    name.length <= 30 &&
    !/^\d+$/.test(name)
  );
}

function deduplicateShinies(
  shinies: ShinyEntry[]
): ShinyEntry[] {
  const map =
    new Map<string, ShinyEntry>();

  for (const shiny of shinies) {
    const key =
      shiny.displayName
        .toLowerCase();

    if (!map.has(key)) {
      map.set(key, shiny);
    }
  }

  return Array.from(
    map.values()
  );
}