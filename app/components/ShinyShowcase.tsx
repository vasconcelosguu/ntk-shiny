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

  // Se não existir no banco, fica false automaticamente.
  isSecretShiny?: boolean;
};

type Props = {
  shinies: Shiny[];
};


/* =========================================================
   SPRITE ANIMADA
   ========================================================= */

function getAnimatedSpriteUrl(pokemonId: number | null) {
  if (!pokemonId) return null;

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${pokemonId}.gif`;
}


/* =========================================================
   DATA
   ========================================================= */

function formatEncounters(value: number | null) {
  if (value === null || value === undefined) {
    return null;
  }

  return value.toLocaleString("pt-BR");
}


function formatDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("pt-BR");
}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function ShinyShowcase({
  shinies,
}: Props) {
  /*
   * Agrupa por player.
   *
   * Depois:
   * 1. maior quantidade de shinies primeiro;
   * 2. empate = ordem alfabética.
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
        const countDifference =
          b.shinies.length - a.shinies.length;

        if (countDifference !== 0) {
          return countDifference;
        }

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

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="shiny-showcase-header">

        <p className="shiny-showcase-kicker">
          Showcase
        </p>

        <h2>
          Shinies do time
        </h2>

        <span>
          Coleção de shinies capturados pelos membros do
          NeverTakeBan.
        </span>

      </header>


      {/* ===================================================
          PLAYERS
      =================================================== */}

      {players.length > 0 ? (

        <div className="shiny-showcase-players">

          {players.map((player, playerIndex) => (

            <section
              key={player.username}
              className="showcase-player"
            >

              {/* =========================================
                  PLAYER HEADER
              ========================================= */}

              <div className="showcase-player-header">

                <div className="showcase-player-title">

                  <span className="showcase-player-number">
                    {String(playerIndex + 1).padStart(2, "0")}
                  </span>

                  <span className="showcase-player-line" />

                  <h3>
                    {player.username}
                  </h3>

                  <span className="showcase-player-count">
                    ({player.shinies.length})
                  </span>

                </div>

              </div>


              {/* =========================================
                  SPRITES
              ========================================= */}

              <div className="showcase-sprite-area">

                <div className="showcase-sprite-track">

                  {player.shinies.map(
                    (shiny, shinyIndex) => {

                      const sprite =
                        getAnimatedSpriteUrl(
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

                      const isSecret =
                        shiny.isSecretShiny === true;


                      /*
                       * Os últimos Pokémon da linha
                       * abrem o card para a esquerda.
                       *
                       * Isso evita que o card saia
                       * da tela.
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

                            isSecret
                              ? "showcase-pokemon-secret"
                              : "",

                            cardSide,
                          ].join(" ")}
                        >

                          {/* =================================
                              AURA
                          ================================= */}

                          <div className="pokemon-hover-light" />


                          {/* =================================
                              PARTÍCULAS
                          ================================= */}

                          <span
                            className="pokemon-spark spark-a"
                          >
                            ✦
                          </span>

                          <span
                            className="pokemon-spark spark-b"
                          >
                            ✧
                          </span>

                          <span
                            className="pokemon-spark spark-c"
                          >
                            ✦
                          </span>

                          <span
                            className="pokemon-spark spark-d"
                          >
                            ✧
                          </span>

                          <span
                            className="pokemon-spark spark-e"
                          >
                            ✦
                          </span>

                          <span
                            className="pokemon-spark spark-f"
                          >
                            ✧
                          </span>


                          {/* =================================
                              ESTRELAS
                          ================================= */}

                          <span className="shiny-star star-1">
                            ✦
                          </span>

                          <span className="shiny-star star-2">
                            ✧
                          </span>

                          <span className="shiny-star star-3">
                            ✦
                          </span>

                          <span className="shiny-star star-4">
                            ✧
                          </span>


                          {/* =================================
                              SECRET SHINY
                          ================================= */}

                          {isSecret && (
                            <div className="secret-shiny-star">

                              <span className="secret-star-glow" />

                              <span className="secret-star-symbol">
                                ★
                              </span>

                            </div>
                          )}


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
                              CARD
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

                                {isSecret ? (

                                  <span className="secret-label">
                                    ★ SECRET SHINY
                                  </span>

                                ) : (

                                  <span>
                                    ✦ SHINY
                                  </span>

                                )}

                              </div>

                            </div>


                            <div className="showcase-hover-separator" />


                            {encounters !== null && (

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


                            {isSecret && (

                              <div className="showcase-secret-message">
                                <span>✦</span>

                                <p>
                                  Secret Shiny
                                </p>
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

        /* ===============================================
           EMPTY
        =============================================== */

        <div className="showcase-empty">

          <span>
            ✨
          </span>

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