import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getShinyPlayer,
  shinyPlayers,
} from "../../../../../lib/players";

import { getShinyBoardProfile } from "../../../../../lib/shinyboard";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export const revalidate = 3600;

export function generateStaticParams() {
  return shinyPlayers.map((player) => ({
    username: player.shinyboardUsername,
  }));
}

export default async function ShinyPlayerPage({
  params,
}: Props) {
  const { username } = await params;

  const decodedUsername = decodeURIComponent(username);

  const player = getShinyPlayer(decodedUsername);

  if (!player) {
    notFound();
  }

  const profile = await getShinyBoardProfile(
    player.shinyboardUsername
  );

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      {/* HEADER */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">
          <Link
            href="/hunt/shiny/players"
            className="inline-flex items-center text-sm font-semibold text-gray-500 transition hover:text-violet-400"
          >
            ← Voltar para Players
          </Link>

          <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-400">
                ✨ Shiny Collection
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                {player.username}
              </h1>

              <p className="mt-3 max-w-xl text-gray-500">
                Coleção de Shinies sincronizada com o
                ShinyBoard.
              </p>
            </div>

            <a
              href={`https://www.shinyboard.net/users/${encodeURIComponent(
                player.shinyboardUsername
              )}?tab=shinies`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm font-bold text-gray-400 transition hover:border-violet-500/30 hover:bg-violet-500/[0.04] hover:text-violet-400"
            >
              Abrir ShinyBoard
              <span className="ml-2">↗</span>
            </a>
          </div>

          {/* STATS */}
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d111c] p-5">
              <span className="block text-3xl font-black text-white">
                {profile.totalShinies}
              </span>

              <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-gray-600">
                Shinies
              </span>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#0d111c] p-5">
              <span className="block text-3xl font-black text-white">
                {profile.totalEncounters.toLocaleString(
                  "pt-BR"
                )}
              </span>

              <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-gray-600">
                Encounters
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white">
            Coleção
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Shinies registrados para este player.
          </p>
        </div>

        {profile.shinies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-12 text-center">
            <div className="text-5xl">✨</div>

            <h2 className="mt-5 text-lg font-bold text-white">
              Nenhum Shiny encontrado
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Não foi possível encontrar Shinies registrados
              para este player no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {profile.shinies.map((shiny, index) => (
              <div
                key={`${shiny.displayName}-${index}`}
                className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d111c] transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#111625] hover:shadow-xl hover:shadow-violet-950/10"
              >
                {/* SPRITE */}
                <div className="flex aspect-square items-center justify-center bg-[#080b14]">
                  {shiny.sprite ? (
                    <img
                      src={shiny.sprite}
                      alt={`Shiny ${shiny.pokemon}`}
                      width={140}
                      height={140}
                      loading="lazy"
                      className="h-32 w-32 object-contain transition duration-200 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-4xl text-gray-700">
                      ?
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="p-4">
                  <h3 className="truncate font-bold text-white">
                    {shiny.displayName}
                  </h3>

                  <p className="mt-1 truncate text-xs capitalize text-gray-600">
                    {shiny.pokemon}
                  </p>

                  <div className="mt-4 border-t border-white/[0.06] pt-3">
                    <span className="text-xs font-semibold text-gray-500">
                      {shiny.encounters.toLocaleString(
                        "pt-BR"
                      )}{" "}
                      encounters
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}