import { createClient } from "./supabase/server";

export type Player = {
  id: string;
  username: string;
};

export type PlayerShiny = {
  id: string;
  player_id: string;
  username: string;
  pokemon: string;
  display_name: string | null;
  pokemon_id: number | null;
  encounters: number | null;
  method: string | null;
  region: string | null;
  location: string | null;
  caught_at: string | null;
};

export type LatestShiny = PlayerShiny;

/* ============================================================
   PLAYERS
============================================================ */

export async function getPlayers(): Promise<Player[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shiny_players")
    .select("id, username")
    .order("username", { ascending: true });

  if (error) {
    console.error("[PLAYERS]", error);
    return [];
  }

  return (data ?? []) as Player[];
}

/* ============================================================
   PLAYER INDIVIDUAL
============================================================ */

export async function getPlayer(
  username: string
): Promise<Player | null> {
  const supabase = await createClient();

  const normalized = username.trim();

  const { data, error } = await supabase
    .from("shiny_players")
    .select("id, username")
    .ilike("username", normalized)
    .maybeSingle();

  if (error) {
    console.error("[PLAYER]", username, error);
    return null;
  }

  return data ? (data as Player) : null;
}

/* ============================================================
   SHINIES DO PLAYER
============================================================ */

export async function getPlayerShinies(
  username: string
): Promise<PlayerShiny[]> {
  const supabase = await createClient();

  const player = await getPlayer(username);

  if (!player) {
    return [];
  }

  const { data, error } = await supabase
    .from("shiny_entries")
    .select(`
      id,
      player_id,
      pokemon,
      display_name,
      pokemon_id,
      encounters,
      method,
      region,
      location,
      caught_at,
      shiny_players!inner (
        username
      )
    `)
    .eq("player_id", player.id)
    .order("caught_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      `[PLAYER SHINIES] ${username}`,
      error
    );

    return [];
  }

  return (data ?? []).map((entry: any) => {
    const playerData = Array.isArray(entry.shiny_players)
      ? entry.shiny_players[0]
      : entry.shiny_players;

    return {
      id: entry.id,
      player_id: entry.player_id,
      username: playerData?.username ?? player.username,
      pokemon: entry.pokemon,
      display_name: entry.display_name,
      pokemon_id: entry.pokemon_id,
      encounters: entry.encounters,
      method: entry.method,
      region: entry.region,
      location: entry.location,
      caught_at: entry.caught_at,
    };
  });
}

/* ============================================================
   TODOS OS SHINIES
============================================================ */

export async function getAllShinies(): Promise<PlayerShiny[]> {
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
      method,
      region,
      location,
      caught_at,
      shiny_players!inner (
        username
      )
    `)
    .order("caught_at", {
      ascending: false,
    });

  if (error) {
    console.error("[ALL SHINIES]", error);
    return [];
  }

  return (data ?? []).map((entry: any) => {
    const playerData = Array.isArray(entry.shiny_players)
      ? entry.shiny_players[0]
      : entry.shiny_players;

    return {
      id: entry.id,
      player_id: entry.player_id,
      username: playerData?.username ?? "Unknown",
      pokemon: entry.pokemon,
      display_name: entry.display_name,
      pokemon_id: entry.pokemon_id,
      encounters: entry.encounters,
      method: entry.method,
      region: entry.region,
      location: entry.location,
      caught_at: entry.caught_at,
    };
  });
}

/* ============================================================
   ÚLTIMO SHINY DE CADA PLAYER
============================================================ */

export async function getLatestShinies(): Promise<LatestShiny[]> {
  const shinies = await getAllShinies();

  const players = new Set<string>();

  const latest: LatestShiny[] = [];

  for (const shiny of shinies) {
    if (players.has(shiny.player_id)) {
      continue;
    }

    players.add(shiny.player_id);
    latest.push(shiny);
  }

  return latest;
}