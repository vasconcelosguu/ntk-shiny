import { createClient } from "./supabase/server";

export type Player = {
  id: string;
  username: string;
  shinyboardUsername: string | null;
  shinyCount: number;
};

export type PlayerShiny = {
  id: string;
  player_id: string;
  pokemon: string;
  display_name: string;
  pokemon_id: number | null;
  encounters: number | null;
  method: string | null;
  region: string | null;
  location: string | null;
  caught_at: string | null;
};

export async function getPlayers(): Promise<Player[]> {
  const supabase = await createClient();

  const { data: players, error } = await supabase
    .from("shiny_players")
    .select(`
      id,
      username,
      shinyboard_username
    `)
    .order("username");

  if (error) {
    console.error(
      "[PLAYERS]",
      error
    );

    return [];
  }

  if (!players) {
    return [];
  }

  const result: Player[] = [];

  for (const player of players) {
    const { count } = await supabase
      .from("shiny_entries")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("player_id", player.id);

    result.push({
      id: player.id,
      username: player.username,
      shinyboardUsername:
        player.shinyboard_username,
      shinyCount: count ?? 0,
    });
  }

  return result;
}

export async function getPlayer(
  username: string
): Promise<Player | null> {
  const supabase = await createClient();

  const { data: player, error } = await supabase
    .from("shiny_players")
    .select(`
      id,
      username,
      shinyboard_username
    `)
    .ilike("username", username)
    .maybeSingle();

  if (error || !player) {
    return null;
  }

  const { count } = await supabase
    .from("shiny_entries")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("player_id", player.id);

  return {
    id: player.id,
    username: player.username,
    shinyboardUsername:
      player.shinyboard_username,
    shinyCount: count ?? 0,
  };
}

export async function getPlayerShinies(
  username: string
): Promise<PlayerShiny[]> {
  const supabase = await createClient();

  const { data: player } = await supabase
    .from("shiny_players")
    .select("id")
    .ilike("username", username)
    .maybeSingle();

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
      caught_at
    `)
    .eq("player_id", player.id)
    .order("caught_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[PLAYER SHINIES]",
      error
    );

    return [];
  }

  return data ?? [];
}