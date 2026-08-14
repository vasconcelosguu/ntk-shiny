import Link from "next/link";

import {
  getShinyPlayers,
} from "@/lib/shiny-db";

import {
  getPokemonShinySprite,
} from "@/lib/pokemon";

export const revalidate = 3600;

export default async function ShinyPlayersPage() {
  const players =
    await getShinyPlayers();

  /*
   * Busca as sprites dos previews
   * de todos os jogadores em paralelo.
   */
  const playersWithSprites =
    await Promise.all(
      players.map(async (player) => {
        const previews =
          await Promise.all(
            player.previews.map(
              async (pokemon) => ({
                ...pokemon,

                sprite:
                  await getPokemonShinySprite(
                    pokemon.pokemon
                  ),
              })
            )
          );

        return {
          ...player,
          previews,
        };
      })
    );

  return (
    <main className="min-h-screen">

      {/* HERO */}

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">

        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">

          <div className="max-w-3xl">

            <div className="mb-4 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-400">
              SHINY HUNT
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              Players
            </h1>

            <p className="mt-4 text-lg leading-8 text-gray-400">
              Coleção de Shinies dos membros
              do neverTakeBan.
            </p>

          </div>

        </div>

      </section>


      {/* PLAYERS */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        {playersWithSprites.length === 0 ? (

          <div className="rounded-2xl border border-white/[0.07] bg-[#0d111c] p-10 text-center">

            <h2 className="text-xl font-bold text-white">
              Nenhum player encontrado
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Execute o sincronizador do
              ShinyBoard para importar os
              dados.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {playersWithSprites.map(
              (player) => (

                <Link
                  key={player.id}
                  href={`/hunt/shiny/players/${encodeURIComponent(
                    player.username
                  )}`}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#0d111c]
                    p-6
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-violet-500/30
                    hover:bg-[#111625]
                    hover:shadow-2xl
                    hover:shadow-violet-950/20
                  "
                >

                  {/* brilho de fundo */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-16
                      -top-16
                      h-40
                      w-40
                      rounded-full
                      bg-violet-600/10
                      blur-3xl
                      transition
                      duration-500
                      group-hover:bg-violet-500/20
                    "
                  />


                  {/* HEADER */}

                  <div className="relative flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-xl">
                      ✦
                    </div>

                    <span className="text-sm text-gray-600 transition duration-200 group-hover:translate-x-1 group-hover:text-violet-400">
                      →
                    </span>

                  </div>


                  {/* SPRITES */}

                  <div className="relative mt-4 flex h-36 items-end justify-center">

                    {player.previews.length > 0 ? (

                      <div className="flex h-full items-end justify-center">

                        {player.previews.map(
                          (pokemon, index) => {

                            /*
                             * Quanto mais Pokémon,
                             * menor cada sprite.
                             */
                            const size =
                              player.previews.length >= 5
                                ? "h-24 w-24"
                                : player.previews.length >= 4
                                ? "h-28 w-28"
                                : "h-32 w-32";

                            return (
                              <div
                                key={pokemon.id}
                                className={`
                                  relative
                                  -mx-2
                                  ${size}
                                  transition
                                  duration-300
                                  group-hover:-translate-y-2
                                `}
                                style={{
                                  zIndex:
                                    player.previews.length -
                                    index,
                                  animationDelay: `${index * 80}ms`,
                                }}
                              >

                                {pokemon.sprite ? (

                                  <img
                                    src={
                                      pokemon.sprite
                                    }
                                    alt={
                                      `Shiny ${pokemon.display_name}`
                                    }
                                    loading="lazy"
                                    className="
                                      h-full
                                      w-full
                                      object-contain
                                      drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]
                                      transition
                                      duration-300
                                      group-hover:scale-110
                                    "
                                  />

                                ) : (

                                  <div className="flex h-full w-full items-center justify-center text-gray-700">
                                    ?
                                  </div>

                                )}

                              </div>
                            );
                          }
                        )}

                      </div>

                    ) : (

                      <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-4xl text-gray-700">
                        ✦
                      </div>

                    )}

                  </div>


                  {/* PLAYER */}

                  <div className="relative mt-3">

                    <h2 className="text-xl font-black text-white">
                      {player.username}
                    </h2>

                  </div>


                  {/* STATS */}

                  <div className="relative mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

                      <span className="block text-xs uppercase tracking-wider text-gray-600">
                        Shinies
                      </span>

                      <strong className="mt-1 block text-lg text-violet-400">
                        {player.total_shinies}
                      </strong>

                    </div>


                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">

                      <span className="block text-xs uppercase tracking-wider text-gray-600">
                        Encontros
                      </span>

                      <strong className="mt-1 block text-lg text-white">
                        {player.total_encounters.toLocaleString(
                          "pt-BR"
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* FOOTER */}

                  <div className="relative mt-5 border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-wider text-gray-600 transition group-hover:text-violet-400">
                    Ver shinies →
                  </div>

                </Link>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}