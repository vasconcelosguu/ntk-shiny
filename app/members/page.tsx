import Image from "next/image";
import Link from "next/link";

import { getPlayers } from "../../lib/players";

export const revalidate = 60;

function getAvatar(username: string) {
  return `https://minotar.net/avatar/${encodeURIComponent(
    username
  )}/128`;
}

export default async function MembersPage() {
  const players = await getPlayers();

  const totalShinies = players.reduce(
    (total, player) => total + player.shinyCount,
    0
  );

  return (
    <main className="min-h-screen bg-[#030603] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-lime-400/10">

        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-lime-400/[0.05] blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1250px] px-4 py-16 md:py-20">

          <div className="max-w-3xl">

            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lime-400">
              Never Take Ban
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
              Members
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
              Conheça os membros do Never Take Ban,
              acompanhe seus Shinies e veja a coleção
              de cada player.
            </p>

          </div>

          {/* STATS */}

          <div className="mt-8 flex flex-wrap gap-3">

            <div className="rounded-xl border border-lime-400/15 bg-lime-400/[0.04] px-4 py-3">

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                Members
              </p>

              <p className="mt-1 text-xl font-black text-lime-400">
                {players.length}
              </p>

            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                Shinies
              </p>

              <p className="mt-1 text-xl font-black text-white">
                {totalShinies}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MEMBERS
      ===================================================== */}

      <section className="mx-auto w-full max-w-[1250px] px-4 py-12 md:py-16">

        <div className="mb-8 flex items-end justify-between gap-6">

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">
              Team
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
              Membros do time
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Selecione um membro para visualizar todos os
              Shinies registrados.
            </p>

          </div>

          <div className="hidden rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 md:block">
            {players.length} players
          </div>

        </div>

        {/* EMPTY */}

        {players.length === 0 ? (

          <div className="rounded-2xl border border-white/[0.06] bg-[#070b07] p-12 text-center">

            <div className="text-4xl">
              👥
            </div>

            <h2 className="mt-4 text-xl font-black text-white">
              Nenhum membro encontrado
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Não foi possível carregar os membros do time.
            </p>

          </div>

        ) : (

          /* GRID */

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {players.map((player) => (

              <article
                key={player.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-[#070b07]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-lime-400/25
                  hover:bg-[#090f09]
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                "
              >

                {/* GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-[-80px]
                    top-[-80px]
                    h-40
                    w-40
                    rounded-full
                    bg-lime-400/[0.05]
                    blur-3xl
                    transition
                    duration-500
                    group-hover:bg-lime-400/[0.10]
                  "
                />

                <div className="relative p-5">

                  {/* PLAYER */}

                  <div className="flex items-center gap-4">

                    {/* AVATAR */}

                    <div
                      className="
                        relative
                        h-16
                        w-16
                        shrink-0
                        overflow-hidden
                        rounded-2xl
                        border
                        border-lime-400/15
                        bg-black
                      "
                    >
                      <Image
                        src={getAvatar(player.username)}
                        alt={player.username}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* NAME */}

                    <div className="min-w-0">

                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                        Player
                      </p>

                      <h3 className="mt-1 truncate text-lg font-black text-white transition group-hover:text-lime-400">
                        {player.username}
                      </h3>

                    </div>

                  </div>

                  {/* STATS */}

                  <div className="mt-5 grid grid-cols-2 gap-2">

                    <div
                      className="
                        rounded-xl
                        border
                        border-white/[0.05]
                        bg-black/30
                        px-3
                        py-3
                      "
                    >

                      <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                        Shinies
                      </p>

                      <p className="mt-1 text-lg font-black text-lime-400">
                        {player.shinyCount}
                      </p>

                    </div>

                    <div
                      className="
                        rounded-xl
                        border
                        border-white/[0.05]
                        bg-black/30
                        px-3
                        py-3
                      "
                    >

                      <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                        Status
                      </p>

                      <p className="mt-1 text-[11px] font-black uppercase text-gray-400">
                        Active
                      </p>

                    </div>

                  </div>

                  {/* BUTTON */}

                  <Link
                    href={`/members/${encodeURIComponent(
                      player.username
                    )}`}
                    className="
                      mt-4
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-lime-400/15
                      bg-lime-400/[0.04]
                      px-4
                      py-3
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      text-lime-400
                      transition-all
                      hover:border-lime-400/35
                      hover:bg-lime-400/[0.08]
                    "
                  >

                    <span>
                      Ver Shinies
                    </span>

                    <span className="text-base transition-transform group-hover:translate-x-1">
                      →
                    </span>

                  </Link>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}