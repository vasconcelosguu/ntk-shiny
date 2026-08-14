import Link from "next/link";

import {
  getShinyPlayers,
} from "@/lib/shiny-db";

import {
  getPokemonShinyAnimatedSprite,
} from "@/lib/pokemon";

export const revalidate = 3600;

export default async function ShinyPlayersPage() {
  const players =
    await getShinyPlayers();

  /*
   * Busca os sprites ANTES de renderizar a página.
   *
   * Isso é importante:
   * a página não depende de o usuário
   * abrir /[username] primeiro.
   */
  const playersWithSprites =
    await Promise.all(
      players.map(
        async (player) => {
          const sprites =
            await Promise.all(
              player.preview_pokemon.map(
                async (pokemon) => ({
                  pokemon,
                  sprite:
                    await getPokemonShinyAnimatedSprite(
                      pokemon
                    ),
                })
              )
            );

          return {
            ...player,
            sprites,
          };
        }
      )
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
              Shinies registrados pelos membros
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
              Execute o sincronizador do ShinyBoard
              para importar os dados.
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
                  className="group rounded-2xl border border-white/[0.07] bg-[#0d111c] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#111625] hover:shadow-2xl hover:shadow-violet-950/20"
                >

                  {/* TOPO */}

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-xl">
                      ✦
                    </div>

                    <span className="text-sm text-gray-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                      →
                    </span>

                  </div>

                  {/* POKÉMON */}

                  {player.sprites.length > 0 && (

                    <div className="mt-3 flex h-28 items-end gap-1 overflow-hidden">

                      {player.sprites.map(
                        ({
                          pokemon,
                          sprite,
                        }) => (

                          <div
                            key={pokemon}
                            className="relative flex h-24 flex-1 items-end justify-center overflow-hidden"
                          >

                            {sprite ? (

                              <img
                                src={sprite}
                                alt={`Shiny ${pokemon}`}
                                className="h-24 w-24 object-contain pixelated transition duration-300 group-hover:scale-110"
                                loading="eager"
                                decoding="async"
                              />

                            ) : (

                              <div className="flex h-20 w-20 items-center justify-center text-xs text-gray-700">
                                ?
                              </div>

                            )}

                          </div>

                        )
                      )}

                    </div>

                  )}

                  {/* PLAYER */}

                  <h2 className="mt-3 text-xl font-black text-white">
                    {player.username}
                  </h2>

                  {/* ESTATÍSTICAS */}

                  <div className="mt-4 grid grid-cols-2 gap-3">

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

                  <div className="mt-4 border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-wider text-gray-600 transition group-hover:text-violet-400">
                    Ver shinies
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