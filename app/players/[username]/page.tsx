import { createClient } from "../../../lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShinyCard from "../../components/ShinyCard";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PlayerPage({
  params,
}: Props) {
  const { username } = await params;

  const supabase = await createClient();

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, created_at"
    )
    .eq("username", username)
    .maybeSingle();

  if (profileError) {
    console.error(profileError);
  }

  if (!profile) {
    notFound();
  }

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  const isOwner =
    user?.id === profile.id;

  const {
    data: shinies,
    error: shiniesError,
  } = await supabase
    .from("shinies")
    .select("*")
    .eq("user_id", profile.id)
    .order("caught_at", {
      ascending: false,
    });

  if (shiniesError) {
    console.error(shiniesError);
  }

  const shinyList = shinies ?? [];

  return (
    <main className="page">
      <section className="player-hero">
        <div className="container">
          <Link
            href="/"
            className="back-link"
          >
            ← Voltar para Home
          </Link>

          <div className="player-profile">
            <div className="player-avatar">
              {(
                profile.display_name ||
                profile.username
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="player-info">
              <span className="eyebrow">
                PLAYER
              </span>

              <h1>
                {profile.display_name ||
                  profile.username}
              </h1>

              <p>
                @{profile.username}
              </p>
            </div>

            <div className="player-stat">
              <strong>
                {shinyList.length}
              </strong>

              <span>
                SHINIES
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container player-content">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              COLEÇÃO
            </span>

            <h2>
              Shinies
            </h2>
          </div>

          {isOwner && (
            <Link
              href={`/players/${profile.username}/add-shiny`}
              className="primary-button"
            >
              <span>+</span>
              Adicionar Shiny
            </Link>
          )}
        </div>

        {shinyList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              ✦
            </div>

            <h3>
              Nenhum shiny cadastrado
            </h3>

            <p>
              {isOwner
                ? "Comece sua coleção adicionando seu primeiro shiny."
                : "Este jogador ainda não cadastrou nenhum shiny."}
            </p>

            {isOwner && (
              <Link
                href={`/players/${profile.username}/add-shiny`}
                className="primary-button"
              >
                + Adicionar primeiro shiny
              </Link>
            )}
          </div>
        ) : (
          <div className="shiny-grid">
            {shinyList.map((shiny) => (
              <ShinyCard
                key={shiny.id}
                id={shiny.id}
                username={profile.username}
                pokemon={shiny.pokemon}
                nickname={shiny.nickname}
                encounters={shiny.encounters}
                method={shiny.method}
                region={shiny.region}
                location={shiny.location}
                canManage={isOwner}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}