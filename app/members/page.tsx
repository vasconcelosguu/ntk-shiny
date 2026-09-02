import Image from "next/image";
import Link from "next/link";

import { getPlayers } from "../../lib/players";

function getAvatar(username: string) {
  return `https://minotar.net/avatar/${encodeURIComponent(username)}/128`;
}

export default async function MembersPage() {
  const players = await getPlayers();

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6">

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400">
          NeverTakeBan
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          Members
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          Membros e coleção de shinies.
        </p>

        <div
          className="
            mt-10
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {players.map((player) => (
            <article
              key={player.id}
              className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-[#0b0f0b]
                p-5
              "
            >
              <div className="flex items-center gap-4">

                <Image
                  src={getAvatar(player.username)}
                  alt={player.username}
                  width={64}
                  height={64}
                  className="rounded-xl"
                  unoptimized
                />

                <div className="min-w-0">
                  <h2 className="font-black text-white">
                    {player.username}
                  </h2>

                  <p className="mt-1 text-xs text-gray-600">
                    {player.shinyCount} shinies
                  </p>
                </div>

              </div>

              <Link
                href={`/members/${encodeURIComponent(player.username)}`}
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-lime-400/20
                  bg-lime-400/[0.06]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-lime-400
                  transition
                  hover:bg-lime-400/10
                "
              >
                Ver Shinies
              </Link>
            </article>
          ))}
        </div>

      </section>
    </main>
  );
}