import Link from "next/link";
import Image from "next/image";

import { getPlayers } from "../../lib/players";

export const revalidate = 60;

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <main className="min-h-screen bg-[#030603] text-white">
      {/* HEADER */}

      <section className="mx-auto w-full max-w-[1250px] px-4 pb-16 pt-12">
        <div className="mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lime-400">
            Never Take Ban
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            Players
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Veja os membros do time e acesse a coleção
            completa de Shinies de cada player.
          </p>
        </div>

        {/* GRID */}

        {players.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#080d08] p-10 text-center">
            <p className="text-sm text-gray-500">
              Nenhum player encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <Link
                key={player.id}
                href={`/players/${encodeURIComponent(
                  player.username
                )}`}
                className="
                  group
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#080d08]
                  p-5
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:border-lime-400/30
                  hover:bg-[#0b120b]
                  hover:shadow-[0_20px_60px_rgba(100,180,0,0.08)]
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                        border
                        border-lime-400/10
                        bg-black
                      "
                    >
                      <Image
                        src="/images/ntb-logo.png"
                        alt=""
                        width={38}
                        height={38}
                        className="object-contain opacity-80"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                        Player
                      </p>

                      <h2 className="mt-1 truncate text-lg font-black text-white transition group-hover:text-lime-400">
                        {player.username}
                      </h2>
                    </div>
                  </div>

                  <span className="ml-3 shrink-0 text-xl text-gray-700 transition group-hover:translate-x-1 group-hover:text-lime-400">
                    →
                  </span>
                </div>

                <div className="mt-5 border-t border-white/[0.05] pt-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Coleção
                  </span>

                  <p className="mt-1 text-xs font-bold text-gray-400 transition group-hover:text-gray-300">
                    Ver todos os Shinies →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* BOTÕES */}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/shiny"
            className="
              rounded-xl
              border
              border-lime-400/20
              bg-lime-400/[0.05]
              px-5
              py-3
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
              text-lime-400
              transition
              hover:border-lime-400/40
              hover:bg-lime-400/10
            "
          >
            ← Shinies
          </Link>

          <Link
            href="/"
            className="
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.02]
              px-5
              py-3
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
              text-gray-500
              transition
              hover:border-white/[0.15]
              hover:text-white
            "
          >
            ← Início
          </Link>
        </div>
      </section>
    </main>
  );
}