import Link from "next/link";
import { shinyPlayers } from "../../../../lib/players";
import { getShinyBoardProfile } from "../../../../lib/shinyboard";

export const revalidate = 3600;

export default async function ShinyPlayersPage() {
  const players = await Promise.all(
    shinyPlayers.map(async (player) => {
      const profile = await getShinyBoardProfile(
        player.shinyboardUsername
      );

      return {
        ...player,
        profile,
      };
    })
  );

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">
          <Link
            href="/hunt/shiny"
            className="text-sm font-semibold text-gray-500 transition hover:text-violet-400"
          >
            ← Voltar para Shiny
          </Link>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
              Shiny • Players
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Coleções dos Players
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
              Shinies registrados pelos membros do
              neverTakeBan.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {players.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-10 text-center">
            <p className="font-bold text-white">
              Nenhum player cadastrado.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Adicione jogadores em lib/players.ts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => {
              const profile = player.profile;

              return (
                <Link
                  key={player.shinyboardUsername}
                  href={`/hunt/shiny/players/${encodeURIComponent(
                    player.shinyboardUsername
                  )}`}
                  className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d111c] transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#111625] hover:shadow-2xl hover:shadow-violet-950/20"
                >
                  <div className="border-b border-white/[0.06] bg-gradient-to-r from-violet-500/[0.08] to-transparent p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
                          Shiny Hunter
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-white">
                          {player.username}
                        </h2>
                      </div>

                      <span className="text-xl text-gray-700 transition group-hover:translate-x-1 group-hover:text-violet-400">
                        →
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                        <span className="block text-2xl font-black">
                          {profile.totalShinies}
                        </span>

                        <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-gray-600">
                          Shinies
                        </span>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                        <span className="block text-2xl font-black">
                          {profile.totalEncounters.toLocaleString(
                            "pt-BR"
                          )}
                        </span>

                        <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-gray-600">
                          Encounters
                        </span>
                      </div>
                    </div>

                    {profile.shinies.length > 0 && (
                      <div className="mt-6">
                        <div className="flex -space-x-3 overflow-hidden">
                          {profile.shinies
                            .slice(0, 6)
                            .map((shiny, index) =>
                              shiny.sprite ? (
                                <div
                                  key={`${shiny.displayName}-${index}`}
                                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#0d111c] bg-[#151b2a]"
                                >
                                  <img
                                    src={shiny.sprite}
                                    alt={shiny.pokemon}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 object-contain"
                                  />
                                </div>
                              ) : null
                            )}
                        </div>

                        {profile.shinies.length > 6 && (
                          <p className="mt-4 text-xs text-gray-600">
                            + {profile.shinies.length - 6} outros
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-6 border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-widest text-gray-600 transition group-hover:text-violet-400">
                      Ver coleção completa
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}