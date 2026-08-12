import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

export default async function PlayersPage() {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, username")
    .order("username", { ascending: true });

  if (error) {
    console.error(error);
  }

  const players = profiles ?? [];

  const playerIds = players.map((player) => player.id);

  let shinies: { profile_id: string }[] = [];

  if (playerIds.length > 0) {
    const { data } = await supabase
      .from("shinies")
      .select("profile_id")
      .in("profile_id", playerIds);

    shinies = data ?? [];
  }

  const shinyCount = new Map<string, number>();

  for (const shiny of shinies) {
    shinyCount.set(
      shiny.profile_id,
      (shinyCount.get(shiny.profile_id) ?? 0) + 1
    );
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">COMMUNITY</span>

          <h1>Players</h1>

          <p>
            Conheça os jogadores e veja a coleção de shinies
            cadastrada por cada um.
          </p>
        </div>
      </section>

      <section className="container players-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">JOGADORES</span>
            <h2>Todos os Players</h2>
          </div>

          <span className="section-count">
            {players.length} jogadores
          </span>
        </div>

        {players.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum jogador cadastrado</h3>
            <p>
              Ainda não existem jogadores registrados na database.
            </p>
          </div>
        ) : (
          <div className="players-grid">
            {players.map((player) => (
              <Link
                key={player.id}
                href={`/players/${encodeURIComponent(player.username)}`}
                className="player-card"
              >
                <div className="player-avatar">
                  {player.username.charAt(0).toUpperCase()}
                </div>

                <div className="player-info">
                  <h3>{player.username}</h3>

                  <span>
                    {shinyCount.get(player.id) ?? 0} shinies
                  </span>
                </div>

                <span className="player-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}