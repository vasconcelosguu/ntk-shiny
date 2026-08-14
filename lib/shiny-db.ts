import { createClient } from "@/lib/supabase/server";

export type ShinyPreview = {
  id: string;
  pokemon: string;
  display_name: string;
  encounters: number;
};

export type ShinyPlayer = {
  id: string;
  username: string;
  shinyboard_username: string;

  total_shinies: number;
  total_encounters: number;

  previews: ShinyPreview[];
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
 * Busca todos os players e alguns shinies
 * para serem utilizados como preview.
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
      display_name,
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
      id: player.id,
      username: player.username,
      shinyboard_username:
        player.shinyboard_username,

      total_shinies: 0,
      total_encounters: 0,

      previews: [],
    }));
  }

  const entriesByPlayer = new Map<
    string,
    ShinyPreview[]
  >();

  const statsByPlayer = new Map<
    string,
    {
      shinies: number;
      encounters: number;
    }
  >();

  for (const entry of entries ?? []) {
    /*
     * Estatísticas
     */
    const stats =
      statsByPlayer.get(entry.player_id) ?? {
        shinies: 0,
        encounters: 0,
      };

    stats.shinies += 1;
    stats.encounters +=
      entry.encounters ?? 0;

    statsByPlayer.set(
      entry.player_id,
      stats
    );

    /*
     * Preview.
     *
     * Pegamos no máximo 5 Pokémon por player.
     */
    const previews =
      entriesByPlayer.get(
        entry.player_id
      ) ?? [];

    if (previews.length < 5) {
      previews.push({
        id: entry.id,
        pokemon: entry.pokemon,
        display_name:
          entry.display_name,
        encounters:
          entry.encounters ?? 0,
      });

      entriesByPlayer.set(
        entry.player_id,
        previews
      );
    }
  }

  return players.map((player) => {
    const stats =
      statsByPlayer.get(player.id) ?? {
        shinies: 0,
        encounters: 0,
      };

    return {
      id: player.id,
      username: player.username,
      shinyboard_username:
        player.shinyboard_username,

      total_shinies: stats.shinies,

      total_encounters:
        stats.encounters,

      previews:
        entriesByPlayer.get(
          player.id
        ) ?? [],
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
    players.find((player) => {
      return (
        player.username
          .trim()
          .toLowerCase() ===
          normalized ||
        player.shinyboard_username
          .trim()
          .toLowerCase() ===
          normalized
      );
    }) ?? null
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
 * Busca player + seus shinies.
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
    await getShinyEntries(player.id);

  return {
    player,
    entries,
  };
}