import { createClient } from "./supabase/server";

export type ShinyOwnership = {
  pokemon: string;
  players: string[];
  obtained: boolean;
};

export type ShowcaseShiny = {
  id: string;
  playerId: string;
  username: string;
  pokemon: string;
  displayName: string;
  pokemonId: number | null;
  encounters: number | null;
  caughtAt: string | null;
};

export function normalizePokemonName(
  value: string
) {
  const normalized = String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/’/g, "'")
    .trim();

  const aliases: Record<string, string> = {
    "nidoran [m]": "nidoran-m",
    "nidoran [f]": "nidoran-f",

    "nidoran m": "nidoran-m",
    "nidoran f": "nidoran-f",

    "nidoran♂": "nidoran-m",
    "nidoran♀": "nidoran-f",

    "mr. mime": "mr-mime",
    "mr mime": "mr-mime",

    "farfetch'd": "farfetchd",
    "farfetch’d": "farfetchd",

    "mime jr.": "mime-jr",
    "mime jr": "mime-jr",

    "ho-oh": "ho-oh",
    "porygon-z": "porygon-z",
    "jangmo-o": "jangmo-o",
    "hakamo-o": "hakamo-o",
    "kommo-o": "kommo-o",
  };

  if (aliases[normalized]) {
    return aliases[normalized];
  }

  return normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * SHINY SHOWCASE
 *
 * Retorna TODOS os shinies registrados.
 *
 * Não faz:
 * - deduplicação por Pokémon
 * - deduplicação por player
 *
 * Cada registro de shiny_entries é um item.
 */
export async function getShowcaseShinies(): Promise<
  ShowcaseShiny[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shiny_entries")
    .select(`
      id,
      player_id,
      pokemon,
      display_name,
      pokemon_id,
      encounters,
      caught_at,
      shiny_players!inner (
        username
      )
    `)
    .order("caught_at", {
      ascending: false,
      nullsFirst: false,
    });

  if (error) {
    console.error(
      "[SHINY SHOWCASE]",
      error
    );

    return [];
  }

  return (data ?? []).map(
    (entry: any) => {
      const player = Array.isArray(
        entry.shiny_players
      )
        ? entry.shiny_players[0]
        : entry.shiny_players;

      return {
        id: String(entry.id),

        playerId: String(
          entry.player_id
        ),

        username:
          player?.username ??
          "Desconhecido",

        pokemon:
          entry.pokemon ?? "",

        displayName:
          entry.display_name ||
          entry.pokemon ||
          "Pokémon",

        pokemonId:
          entry.pokemon_id != null
            ? Number(entry.pokemon_id)
            : null,

        encounters:
          entry.encounters != null
            ? Number(entry.encounters)
            : null,

        caughtAt:
          entry.caught_at ?? null,
      };
    }
  );
}

/**
 * SHINY OWNERSHIP
 *
 * Cria:
 *
 * Pokémon -> players que possuem
 */
export async function getShinyOwnership(): Promise<
  Record<string, ShinyOwnership>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shiny_entries")
    .select(`
      pokemon,
      display_name,
      shiny_players!inner (
        username
      )
    `);

  if (error) {
    console.error(
      "[SHINY OWNERSHIP]",
      error
    );

    return {};
  }

  const ownership: Record<
    string,
    ShinyOwnership
  > = {};

  for (const entry of data ?? []) {
    const pokemon =
      entry.display_name ||
      entry.pokemon ||
      "";

    const key =
      normalizePokemonName(
        pokemon
      );

    if (!key) {
      continue;
    }

    const player = Array.isArray(
      entry.shiny_players
    )
      ? entry.shiny_players[0]
      : entry.shiny_players;

    const username =
      player?.username?.trim();

    if (!ownership[key]) {
      ownership[key] = {
        pokemon,
        players: [],
        obtained: false,
      };
    }

    if (
      username &&
      !ownership[key].players.includes(
        username
      )
    ) {
      ownership[key].players.push(
        username
      );
    }
  }

  for (const item of Object.values(
    ownership
  )) {
    item.players.sort((a, b) =>
      a.localeCompare(b)
    );

    item.obtained =
      item.players.length > 0;
  }

  return ownership;
}

export function getOwnershipForPokemon(
  ownership: Record<
    string,
    ShinyOwnership
  >,
  pokemon: string
) {
  const key =
    normalizePokemonName(pokemon);

  return (
    ownership[key] ?? {
      pokemon,
      players: [],
      obtained: false,
    }
  );
}