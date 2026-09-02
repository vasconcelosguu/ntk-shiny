"use client";

import { useMemo } from "react";

type Shiny = {
  id: string;
  playerId: string;
  username: string;
  pokemon: string;
  displayName: string;
  pokemonId: number | null;
  encounters: number | null;
  caughtAt: string | null;
};

type Props = {
  shinies: Shiny[];
};

function getSpriteUrl(pokemonId: number | null) {
  if (!pokemonId) return null;

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`;
}

function formatEncounters(value: number | null) {
  if (value === null || value === undefined) {
    return null;
  }

  return value.toLocaleString("pt-BR");
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("pt-BR");
}

export default function ShinyShowcase({
  shinies,
}: Props) {
  /*
   * =========================================================
   * AGRUPAR POR PLAYER
   * =========================================================
   */

  const players = useMemo(() => {
    const groups = shinies.reduce<Record<string, Shiny[]>>(
      (acc, shiny) => {
        if (!acc[shiny.username]) {
          acc[shiny.username] = [];
        }

        acc[shiny.username].push(shiny);

        return acc;
      },
      {}
    );

    return Object.entries(groups)
      .map(([username, playerShinies]) => ({
        username,

        shinies: [...playerShinies].sort((a, b) =>
          a.displayName.localeCompare(
            b.displayName,
            "pt-BR",
            {
              sensitivity: "base",
            }
          )
        ),
      }))
      .sort((a, b) => {
        /*
         * Primeiro:
         * maior quantidade de shinies.
         */

        const countDifference =
          b.shinies.length - a.shinies.length;

        if (countDifference !== 0) {
          return countDifference;
        }

        /*
         * Empate:
         * ordem alfabética.
         */

        return a.username.localeCompare(
          b.username,
          "pt-BR",
          {
            sensitivity: "base",
          }
        );
      });
  }, [shinies]);

  return (
    <section className="shiny-showcase">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="shiny-showcase-header">

        <p className="shiny-showcase-kicker">
          Showcase
        </p>

        <h1>
          Shinies do time
        </h1>

        <p>
          Coleção de shinies capturados pelos membros
          do NeverTakeBan.
        </p>

      </header>


      {/* =====================================================
          PLAYERS
      ===================================================== */}

      {players.length > 0 ? (

        <div className="shiny-showcase-players">

          {players.map((player, playerIndex) => (

            <section
              key={player.username}
              className="showcase-player"
            >

              {/* =============================================
                  PLAYER HEADER
              ============================================= */}

              <div className="showcase-player-header">

                <div className="showcase-player-title">

                  <span className="showcase-player-number">
                    {String(
                      playerIndex + 1
                    ).padStart(2, "0")}
                  </span>

                  <span className="showcase-player-line" />

                  <h2>
                    {player.username}
                  </h2>

                  <span className="showcase-player-count">
                    {player.shinies.length} shiny
                    {player.shinies.length !== 1
                      ? "s"
                      : ""}
                  </span>

                </div>

              </div>


              {/* =============================================
                  SPRITES
              ============================================= */}

              <div className="showcase-sprite-area">

                <div className="showcase-sprite-track">

                  {player.shinies.map(
                    (shiny, shinyIndex) => {

                      const sprite =
                        getSpriteUrl(
                          shiny.pokemonId
                        );

                      const encounters =
                        formatEncounters(
                          shiny.encounters
                        );

                      const caughtAt =
                        formatDate(
                          shiny.caughtAt
                        );

                      /*
                       * Últimos dois da linha:
                       * card aparece para a esquerda.
                       */

                      const positionFromEnd =
                        player.shinies.length -
                        shinyIndex;

                      const cardSide =
                        positionFromEnd <= 2
                          ? "showcase-card-left"
                          : "";

                      return (
                        <article
                          key={shiny.id}
                          className={[
                            "showcase-pokemon",
                            cardSide,
                          ].join(" ")}
                        >

                          {/* =================================
                              SHINY EFFECT
                          ================================= */}

                          <span
                            className="shiny-aura"
                            aria-hidden="true"
                          />

                          <span
                            className="shiny-flash"
                            aria-hidden="true"
                          />

                          <span
                            className="shiny-ring"
                            aria-hidden="true"
                          />


                          {/* =================================
                              PARTICLES
                          ================================= */}

                          <div
                            className="shiny-particles"
                            aria-hidden="true"
                          >

                            <span className="shiny-spark spark-1" />
                            <span className="shiny-spark spark-2" />
                            <span className="shiny-spark spark-3" />
                            <span className="shiny-spark spark-4" />
                            <span className="shiny-spark spark-5" />
                            <span className="shiny-spark spark-6" />
                            <span className="shiny-spark spark-7" />
                            <span className="shiny-spark spark-8" />
                            <span className="shiny-spark spark-9" />
                            <span className="shiny-spark spark-10" />
                            <span className="shiny-spark spark-11" />
                            <span className="shiny-spark spark-12" />

                          </div>


                          {/* =================================
                              SPRITE
                          ================================= */}

                          <div className="showcase-sprite-container">

                            {sprite ? (

                              <img
                                src={sprite}
                                alt={shiny.displayName}
                                className="showcase-pokemon-sprite"
                                loading="lazy"
                                draggable={false}
                              />

                            ) : (

                              <span className="showcase-missing-sprite">
                                ?
                              </span>

                            )}

                          </div>


                          {/* =================================
                              HOVER CARD
                          ================================= */}

                          <div className="showcase-hover-card">

                            <div className="showcase-hover-card-header">

                              {sprite ? (

                                <img
                                  src={sprite}
                                  alt=""
                                  className="showcase-hover-mini"
                                  draggable={false}
                                />

                              ) : (

                                <div className="showcase-hover-mini-placeholder">
                                  ?
                                </div>

                              )}

                              <div className="showcase-hover-title">

                                <strong>
                                  {shiny.displayName}
                                </strong>

                                <span>
                                  ✦ SHINY
                                </span>

                              </div>

                            </div>


                            {(encounters || caughtAt) && (
                              <div className="showcase-hover-separator" />
                            )}


                            {encounters && (

                              <div className="showcase-hover-stat">

                                <span>
                                  Encontros
                                </span>

                                <strong>
                                  {encounters}
                                </strong>

                              </div>

                            )}


                            {caughtAt && (

                              <div className="showcase-hover-stat">

                                <span>
                                  Capturado
                                </span>

                                <strong>
                                  {caughtAt}
                                </strong>

                              </div>

                            )}

                          </div>

                        </article>
                      );
                    }
                  )}

                </div>

              </div>

            </section>

          ))}

        </div>

      ) : (

        <div className="showcase-empty">

          <div className="showcase-empty-icon">
            ✨
          </div>

          <strong>
            Nenhum shiny encontrado
          </strong>

          <p>
            Ainda não existem shinies registrados.
          </p>

        </div>

      )}

    </section>
  );
}