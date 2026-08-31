import { createClient } from "./supabase/server";

export type LatestShiny = {
  id: string;
  player_id: string;
  username: string;
  pokemon: string;
  display_name: string | null;
  pokemon_id: number | null;
  encounters: number | null;
  caught_at: string | null;
};

function parseCaughtAt(value: string | null): number {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);

  if (!Number.isNaN(timestamp)) {
    return timestamp;
  }

  /*
   * Alguns dados antigos podem estar em formatos diferentes.
   * Tentamos encontrar uma data dentro da string.
   */

  const match = value.match(
    /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/
  );

  if (match) {
    const [, year, month, day] = match;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return date.getTime();
  }

  return 0;
}

export async function getLatestShinies(): Promise<LatestShiny[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shiny_entries")
    .select(
      `
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
      `
    );

  if (error) {
    console.error(
      "[HOME] Erro ao buscar últimos shinies:",
      error
    );

    return [];
  }

  if (!data) {
    return [];
  }

  /*
   * Ordena TODOS os shinies pela data de captura.
   * O mais recente fica primeiro.
   */

  const sorted = [...data].sort((a, b) => {
    const dateA = parseCaughtAt(a.caught_at);
    const dateB = parseCaughtAt(b.caught_at);

    return dateB - dateA;
  });

  /*
   * Mantém somente o primeiro shiny de cada player.
   */

  const players = new Set<string>();

  const latest = [];

  for (const shiny of sorted) {
    if (players.has(shiny.player_id)) {
      continue;
    }

    players.add(shiny.player_id);

    const player = Array.isArray(shiny.shiny_players)
      ? shiny.shiny_players[0]
      : shiny.shiny_players;

    latest.push({
      id: shiny.id,
      player_id: shiny.player_id,
      username: player?.username ?? "Unknown",
      pokemon: shiny.pokemon,
      display_name: shiny.display_name,
      pokemon_id: shiny.pokemon_id,
      encounters: shiny.encounters,
      caught_at: shiny.caught_at,
    });
  }

  return latest;
}