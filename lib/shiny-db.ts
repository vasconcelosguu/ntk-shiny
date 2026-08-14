import { createClient } from "@/lib/supabase/server";

export type ShinyPlayer = {
  id: string;
  username: string;
  shinyboard_username: string;

  total_shinies: number;
  total_encounters: number;

  preview_pokemon: string[];
};

export type ShinyEntry = {
  id: string;
  player_id: string;

  pokemon: string;
  display_name: string;

  encounters: number;

  method: string | null;
  region: string | null;
  location: string | null;
  nickname: string | null;

  caught_at: string | null;
  source_url: string | null;
};

/**
 * Busca todos os players.
 *
 * Os dados vêm exclusivamente do Supabase.
 */
export async function getShinyPlayers(): Promise<
  ShinyPlayer[]
> {
  const supabase = await createClient();

  const {
    data: players,
    error: playersError,
  } = await supabase
    .from("shiny_players")
    .select(`
      id,
      username,
      shinyboard_username
    `)
    .order("username", {
      ascending: true,
    });

  if (playersError) {
    console.error(
      "Erro ao buscar shiny_players:",
      playersError
    );

    return [];
  }

  if (!players || players.length === 0) {
    return [];
  }

  const playerIds = players.map(
    (player) => player.id
  );

  const {
    data: entries,
    error: entriesError,
  } = await supabase
    .from("shiny_entries")
    .select(`
      id,
      player_id,
      pokemon,
      encounters
    `)
    .in("player_id", playerIds)
    .order("encounters", {
      ascending: false,
    });

  if (entriesError) {
    console.error(
      "Erro ao buscar shiny_entries:",
      entriesError
    );

    return players.map((player) => ({
      ...player,
      total_shinies: 0,
      total_encounters: 0,
      preview_pokemon: [],
    }));
  }

  const entriesByPlayer = new Map<
    string,
    {
      shinies: number;
      encounters: number;
      pokemon: string[];
    }
  >();

  for (const entry of entries ?? []) {
    const current =
      entriesByPlayer.get(entry.player_id) ?? {
        shinies: 0,
        encounters: 0,
        pokemon: [],
      };

    current.shinies += 1;

    current.encounters +=
      entry.encounters ?? 0;

    /*
     * Guardamos até 5 Pokémon para o card.
     */
    if (
      current.pokemon.length < 5 &&
      entry.pokemon
    ) {
      current.pokemon.push(
        entry.pokemon
      );
    }

    entriesByPlayer.set(
      entry.player_id,
      current
    );
  }

  return players.map((player) => {
    const stats =
      entriesByPlayer.get(player.id) ?? {
        shinies: 0,
        encounters: 0,
        pokemon: [],
      };

    return {
      ...player,

      total_shinies:
        stats.shinies,

      total_encounters:
        stats.encounters,

      preview_pokemon:
        stats.pokemon,
    };
  });
}

/**
 * Busca um player específico.
 */
export async function getShinyPlayer(
  username: string
): Promise<ShinyPlayer | null> {
  const players =
    await getShinyPlayers();

  const normalized =
    username
      .trim()
      .toLowerCase();

  return (
    players.find(
      (player) =>
        player.username
          .trim()
          .toLowerCase() ===
          normalized ||
        player.shinyboard_username
          .trim()
          .toLowerCase() ===
          normalized
    ) ?? null
  );
}

/**
 * Busca todos os shinies de um player.
 */
export async function getShinyEntries(
  playerId: string
): Promise<ShinyEntry[]> {
  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("shiny_entries")
    .select(`
      id,
      player_id,
      pokemon,
      display_name,
      encounters,
      method,
      region,
      location,
      nickname,
      caught_at,
      source_url
    `)
    .eq("player_id", playerId)
    .order("encounters", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Erro ao buscar shiny_entries:",
      error
    );

    return [];
  }

  return data ?? [];
}

/**
 * Busca player + shinies.
 */
export async function getShinyPlayerWithEntries(
  username: string
): Promise<{
  player: ShinyPlayer;
  entries: ShinyEntry[];
} | null> {
  const player =
    await getShinyPlayer(username);

  if (!player) {
    return null;
  }

  const entries =
    await getShinyEntries(
      player.id
    );

  return {
    player,
    entries,
  };
}