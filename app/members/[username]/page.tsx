import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPlayer,
  getPlayerShinies,
} from "../../../lib/players";

function getAvatar(username: string) {
  return `https://minotar.net/avatar/${encodeURIComponent(username)}/128`;
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{
    username: string;
  }>;
}) {
  const { username } = await params;

  const decodedUsername = decodeURIComponent(username);

  const player = await getPlayer(decodedUsername);

  if (!player) {
    notFound();
  }

  const shinies =
    await getPlayerShinies(decodedUsername);

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">

        <Link
          href="/members"
          className="
            text-xs
            font-bold
            text-gray-600
            transition
            hover:text-lime-400
          "
        >
          ← Members
        </Link>

        <div
          className="
            mt-8
            flex
            flex-col
            gap-5
            rounded-2xl
            border
            border-white/[0.07]
            bg-[#0b0f0b]
            p-6
            sm:flex-row
            sm:items-center
          "
        >
          <Image
            src={getAvatar(player.username)}
            alt={player.username}
            width={96}
            height={96}
            className="rounded-2xl"
            unoptimized
          />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400">
              Member
            </p>

            <h1 className="mt-2 text-3xl font-black text-white">
              {player.username}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {shinies.length} shinies registrados.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-black text-white">
            Shinies
          </h2>

          {shinies.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0b0f0b] p-8">
              <p className="text-sm text-gray-600">
                Nenhum shiny encontrado.
              </p>
            </div>
          ) : (
            <div
              className="
                mt-5
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
              "
            >
              {shinies.map((shiny) => (
                <div
                  key={shiny.id}
                  className="
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#0b0f0b]
                    p-5
                    text-center
                  "
                >
                  {shiny.pokemon_id ? (
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${shiny.pokemon_id}.png`}
                      alt={shiny.display_name}
                      className="mx-auto h-32 w-32 object-contain"
                    />
                  ) : (
                    <div className="h-32" />
                  )}

                  <h3 className="mt-3 font-bold text-white">
                    {shiny.display_name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-600">
                    {shiny.encounters?.toLocaleString("pt-BR") ?? "—"} encounters
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>
    </main>
  );
}