import { createClient } from "./supabase/server";

export type Player = {
  id: string;
  username: string;
  shinyboardUsername: string | null;
  shinyCount: number;
};

export type PlayerShiny = {
  id: string;
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

/**
 * Busca todos os players.
 *
 * IMPORTANTE:
 * A tabela usada aqui é "shiny_players",
 * não "players".
 */
export async function getPlayers(): Promise<Player[]> {
  const supabase = await createClient();

  const { data: players, error } = await supabase
    .from("shiny_players")
    .select("*")
    .order("username", { ascending: true });

  if (error) {
    console.error("[PLAYERS]", error);
    return [];
  }

  if (!players) {
    return [];
  }

  /*
   * Busca a quantidade de shinies de cada player.
   *
   * A relação é:
   * shiny_entries.player_id -> shiny_players.id
   */
  const { data: shinies, error: shiniesError } = await supabase
    .from("shiny_entries")
    .select("player_id");

  if (shiniesError) {
    console.error("[PLAYER SHINIES COUNT]", shiniesError);
  }

  const shinyCounts = new Map<string, number>();

  for (const shiny of shinies ?? []) {
    if (!shiny.player_id) continue;

    shinyCounts.set(
      shiny.player_id,
      (shinyCounts.get(shiny.player_id) ?? 0) + 1
    );
  }

  return players.map((player) => ({
    id: String(player.id),
    username: String(player.username),
    shinyboardUsername:
      player.shinyboard_username ??
      player.shinyboardUsername ??
      null,
    shinyCount: shinyCounts.get(player.id) ?? 0,
  }));
}

/**
 * Busca um player pelo username.
 */
export async function getPlayer(
  username: string
): Promise<Player | null> {
  const players = await getPlayers();

  const normalized = username.trim().toLowerCase();

  return (
    players.find(
      (player) =>
        player.username.trim().toLowerCase() === normalized
    ) ?? null
  );
}

/**
 * Busca todos os shinies de um player.
 */
export async function getPlayerShinies(
  username: string
): Promise<PlayerShiny[]> {
  const supabase = await createClient();

  const normalized = username.trim();

  /*
   * Primeiro encontramos o player.
   */
  const { data: player, error: playerError } = await supabase
    .from("shiny_players")
    .select("id, username")
    .ilike("username", normalized)
    .maybeSingle();

  if (playerError) {
    console.error("[PLAYER]", playerError);
    return [];
  }

  if (!player) {
    return [];
  }

  /*
   * Depois buscamos os shinies ligados ao player_id.
   */
  const { data, error } = await supabase
    .from("shiny_entries")
    .select(`
      id,
      player_id,
      pokemon,
      display_name,
      pokemon_id,
      encounters,
      caught_at
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

  return (data ?? []).map((shiny) => ({
    id: String(shiny.id),
    username: player.username,
    pokemon: shiny.pokemon,
    display_name: shiny.display_name ?? null,
    pokemon_id: shiny.pokemon_id ?? null,
    encounters: shiny.encounters ?? null,
    method: null,
    region: null,
    location: null,
    caught_at: shiny.caught_at ?? null,
  }));
}