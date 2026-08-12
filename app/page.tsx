import Link from "next/link";
import Image from "next/image";

import { createClient } from "../lib/supabase/server";
import { getPokemonShinySprite } from "../lib/pokemon";
import { tiers } from "../lib/data";

export default async function Home() {
  const supabase = await createClient();

  const totalPokemon = Object.values(tiers).reduce(
    (sum, tier) => sum + tier.pokemon.length,
    0
  );

  // Busca os shinies cadastrados pelos jogadores
  const { data: shinyData, error: shinyError } = await supabase
    .from("shinies")
    .select(`
      id,
      pokemon,
      profile_id,
      profiles (
        username
      )
    `)
    .order("id", { ascending: false })
    .limit(24);

  if (shinyError) {
    console.error("Erro ao buscar shinies:", shinyError);
  }

  const shinies = shinyData ?? [];

  // Busca automaticamente a sprite shiny de cada Pokémon
  const gallery = await Promise.all(
    shinies.map(async (shiny) => {
      const sprite = await getPokemonShinySprite(shiny.pokemon);

      return {
        id: shiny.id,
        pokemon: shiny.pokemon,
        profile_id: shiny.profile_id,

        // profiles é retornado como array pelo Supabase
        username:
          shiny.profiles?.[0]?.username ?? "Player",

        sprite,
      };
    })
  );

  return (
    <div className="home">

      {/* =========================
          BANNER
      ========================= */}

      <section className="home-banner">

        <Image
          src="/images/banner.png"
          alt="NeverTakeBan"
          fill
          priority
          sizes="100vw"
          className="home-banner-image"
        />

        <div className="home-banner-overlay" />

        <div className="home-banner-content">

          <span className="eyebrow">
            POKEMMO • SHINY DATABASE
          </span>

          <h1>
            NeverTakeBan
          </h1>

          <p>
            A coleção de shinies do nosso time,
            organizada em um único lugar.
          </p>

          <div className="hero-actions">

            <Link
              href="/players"
              className="button button-primary"
            >
              Ver Players
            </Link>

            <Link
              href="/guia"
              className="button button-secondary"
            >
              Como funciona
            </Link>

          </div>

        </div>

      </section>


      {/* =========================
          SHINY TIERS
      ========================= */}

      <section className="container tiers-section">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              CLASSIFICAÇÃO
            </span>

            <h2>
              Shiny Tiers
            </h2>

          </div>

          <span className="section-count">
            {totalPokemon} Pokémon
          </span>

        </div>


        <div className="tiers-grid">

          {Object.entries(tiers).map(([tier, data]) => (

            <Link
              key={tier}
              href={`/tiers/${tier}`}
              className="tier-card"
            >

              <div className="tier-badge">
                T{tier}
              </div>

              <div className="tier-info">

                <h3>
                  Tier {tier}
                </h3>

                <span>
                  {data.pokemon.length} Pokémon
                </span>

              </div>

              <span className="tier-arrow">
                →
              </span>

            </Link>

          ))}

        </div>

      </section>


      {/* =========================
          SHINY GALLERY
      ========================= */}

      <section className="container gallery-section">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              COLEÇÃO
            </span>

            <h2>
              Shiny Gallery
            </h2>

          </div>

          <Link
            href="/players"
            className="section-link"
          >
            Ver jogadores →
          </Link>

        </div>


        {shinyError ? (

          <div className="empty-state">

            <h3>
              Não foi possível carregar os shinies
            </h3>

            <p>
              Verifique a configuração da tabela de shinies
              e dos jogadores.
            </p>

          </div>

        ) : gallery.length === 0 ? (

          <div className="empty-state">

            <h3>
              Nenhum shiny cadastrado
            </h3>

            <p>
              Os shinies cadastrados pelos jogadores
              aparecerão aqui.
            </p>

          </div>

        ) : (

          <div className="shiny-gallery">

            {gallery.map((shiny) => (

              <Link
                key={shiny.id}
                href={`/players/${encodeURIComponent(
                  shiny.username
                )}`}
                className="shiny-card"
              >

                <div className="shiny-image">

                  {shiny.sprite ? (

                    <img
                      src={shiny.sprite}
                      alt={`${shiny.pokemon} shiny`}
                    />

                  ) : (

                    <div className="sprite-placeholder">
                      ?
                    </div>

                  )}

                </div>


                <div className="shiny-card-info">

                  <strong>
                    {shiny.pokemon}
                  </strong>

                  <span>
                    @{shiny.username}
                  </span>

                </div>

              </Link>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}