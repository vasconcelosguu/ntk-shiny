import Link from "next/link";

import {
  getShinyPlayers,
  getShinyPlayerWithEntries,
} from "@/lib/shiny-db";

import {
  getPokemonShinyAnimatedSprite,
} from "@/lib/pokemon";

export const revalidate = 3600;

export default async function LeaderboardPage() {
  const players = await getShinyPlayers();

  const playersWithEntries = await Promise.all(
    players.map(async (player) => {
      const result = await getShinyPlayerWithEntries(
        player.username
      );

      if (!result) {
        return {
          ...player,
          entries: [],
        };
      }

      const entries = await Promise.all(
        result.entries.map(async (entry) => ({
          ...entry,
          sprite: await getPokemonShinyAnimatedSprite(
            entry.pokemon
          ),
        }))
      );

      return {
        ...player,
        entries,
      };
    })
  );

  return (
    <main className="min-h-screen">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-6">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-400">
              SHINY HUNT
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              Leaderboard
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-400">
              Shinies registrados por todos os membros
              do neverTakeBan.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          PLAYERS
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
        {playersWithEntries.length === 0 ? (
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
          <div className="space-y-5">
            {playersWithEntries.map((player) => (
              <section
                key={player.id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#0d111c]
                  transition
                  duration-200
                  hover:border-violet-500/20
                "
              >
                {/* =================================================
                    PLAYER HEADER
                ================================================= */}
                <div className="flex flex-col gap-4 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-lg">
                      ✦
                    </div>

                    <div>
                      <Link
                        href={`/hunt/shiny/players/${encodeURIComponent(
                          player.username
                        )}`}
                        className="
                          text-lg
                          font-black
                          text-white
                          transition
                          hover:text-violet-400
                        "
                      >
                        {player.username}
                      </Link>

                      <p className="mt-0.5 text-xs text-gray-600">
                        {player.total_shinies} shinies
                        {" · "}
                        {player.total_encounters.toLocaleString(
                          "pt-BR"
                        )}{" "}
                        encontros
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/hunt/shiny/players/${encodeURIComponent(
                      player.username
                    )}`}
                    className="
                      hidden
                      rounded-lg
                      border
                      border-white/[0.07]
                      bg-white/[0.02]
                      px-3
                      py-2
                      text-xs
                      font-bold
                      text-gray-500
                      transition
                      hover:border-violet-500/30
                      hover:text-violet-400
                      sm:block
                    "
                  >
                    Ver perfil →
                  </Link>
                </div>

                {/* =================================================
                    SHINIES
                ================================================= */}
                <div className="p-4 sm:p-5">
                  {player.entries.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.015] p-6 text-center">
                      <p className="text-sm text-gray-600">
                        Nenhum shiny registrado.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-3
                        md:grid-cols-4
                        lg:grid-cols-6
                        xl:grid-cols-8
                      "
                    >
                      {player.entries.map((entry) => (
                        <article
                          key={entry.id}
                          className="
                            group
                            min-w-0
                            overflow-hidden
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-[#090d16]
                            transition
                            duration-200
                            hover:-translate-y-0.5
                            hover:border-violet-500/25
                            hover:bg-[#101522]
                          "
                        >
                          {/* SPRITE */}
                          <div className="flex h-28 items-center justify-center">
                            {entry.sprite ? (
                              <img
                                src={entry.sprite}
                                alt={`Shiny ${entry.display_name}`}
                                className="
                                  h-24
                                  w-24
                                  object-contain
                                  pixelated
                                  transition
                                  duration-300
                                  group-hover:scale-110
                                "
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="flex h-20 w-20 items-center justify-center text-2xl text-gray-700">
                                ?
                              </div>
                            )}
                          </div>

                          {/* INFO */}
                          <div className="border-t border-white/[0.05] px-3 py-3">
                            <h3 className="truncate text-sm font-black text-white">
                              {entry.display_name}
                            </h3>

                            {entry.nickname && (
                              <p className="mt-0.5 truncate text-[10px] italic text-gray-600">
                                "{entry.nickname}"
                              </p>
                            )}

                            <div className="mt-2 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] text-gray-600">
                                  Enc.
                                </span>

                                <span className="text-[10px] font-bold text-gray-400">
                                  {entry.encounters.toLocaleString(
                                    "pt-BR"
                                  )}
                                </span>
                              </div>

                              {entry.method && (
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] text-gray-600">
                                    Método
                                  </span>

                                  <span className="max-w-[70%] truncate text-right text-[10px] font-bold text-gray-400">
                                    {entry.method}
                                  </span>
                                </div>
                              )}

                              {entry.region && (
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] text-gray-600">
                                    Região
                                  </span>

                                  <span className="max-w-[70%] truncate text-right text-[10px] font-bold text-gray-400">
                                    {entry.region}
                                  </span>
                                </div>
                              )}

                              {entry.location && (
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] text-gray-600">
                                    Local
                                  </span>

                                  <span className="max-w-[70%] truncate text-right text-[10px] font-bold text-gray-400">
                                    {entry.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

