import Link from "next/link";

import {
  getShinyPlayerWithEntries,
} from "@/lib/shiny-db";

import {
  getPokemonShinySprite,
} from "@/lib/pokemon";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export const revalidate = 3600;

export default async function ShinyPlayerPage({
  params,
}: PageProps) {
  const { username } = await params;

  const data =
    await getShinyPlayerWithEntries(
      decodeURIComponent(username)
    );

  if (!data) {
    return (
      <main className="min-h-screen px-6 py-20">

        <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.07] bg-[#0d111c] p-10 text-center">

          <h1 className="text-2xl font-black text-white">
            Player não encontrado
          </h1>

          <p className="mt-3 text-gray-500">
            Não encontramos esse player no
            banco de dados.
          </p>

          <Link
            href="/hunt/shiny/players"
            className="mt-6 inline-flex rounded-xl border border-violet-500/20 bg-violet-500/10 px-5 py-3 text-sm font-bold text-violet-400 transition hover:bg-violet-500/20"
          >
            Voltar para players
          </Link>

        </div>

      </main>
    );
  }

  const {
    player,
    entries,
  } = data;

  /*
   * Busca todas as sprites em paralelo.
   *
   * Isso evita fazer uma requisição por vez.
   */
  const entriesWithSprites =
    await Promise.all(
      entries.map(async (entry) => {
        const sprite =
          await getPokemonShinySprite(
            entry.pokemon
          );

        return {
          ...entry,
          sprite,
        };
      })
    );

  return (
    <main className="min-h-screen">

      {/* HERO */}

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">

        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">

          <Link
            href="/hunt/shiny/players"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-violet-400"
          >
            ← Players
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>

              <div className="mb-4 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-400">
                SHINY HUNT
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                {player.username}
              </h1>

              <p className="mt-3 text-gray-500">
                Shinies registrados no
                ShinyBoard.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-white/[0.07] bg-[#0d111c] px-5 py-4">

                <span className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Shinies
                </span>

                <strong className="mt-1 block text-2xl font-black text-violet-400">
                  {player.total_shinies}
                </strong>

              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#0d111c] px-5 py-4">

                <span className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Encontros
                </span>

                <strong className="mt-1 block text-2xl font-black text-white">
                  {player.total_encounters.toLocaleString(
                    "pt-BR"
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* SHINIES */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        {entriesWithSprites.length === 0 ? (

          <div className="rounded-2xl border border-white/[0.07] bg-[#0d111c] p-10 text-center">

            <h2 className="text-xl font-bold text-white">
              Nenhum shiny registrado
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              O ShinyBoard não possui shinies
              registrados para este player.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {entriesWithSprites.map(
              (entry) => (

                <article
                  key={entry.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border border-white/[0.07]
                    bg-[#0d111c]
                    transition
                    duration-200
                    hover:-translate-y-1
                    hover:border-violet-500/30
                    hover:bg-[#111625]
                    hover:shadow-2xl
                    hover:shadow-violet-950/20
                  "
                >

                  {/* TOP */}

                  <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">

                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-violet-400">
                      ✦ SHINY
                    </span>

                    <span className="text-xs font-semibold text-gray-600">
                      {entry.encounters.toLocaleString(
                        "pt-BR"
                      )}{" "}
                      enc.
                    </span>

                  </div>

                  {/* SPRITE */}

                  <div className="flex h-52 items-center justify-center overflow-hidden">

                    {entry.sprite ? (

                      <img
                        src={entry.sprite}
                        alt={`Shiny ${entry.display_name}`}
                        width={160}
                        height={160}
                        loading="lazy"
                        className="
                          h-40
                          w-40
                          object-contain
                          transition
                          duration-300
                          group-hover:scale-110
                        "
                      />

                    ) : (

                      <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-3xl font-black text-gray-700">
                        ?
                      </div>

                    )}

                  </div>

                  {/* INFO */}

                  <div className="border-t border-white/[0.06] p-5">

                    <h2 className="text-lg font-black text-white">
                      {entry.display_name}
                    </h2>

                    {entry.nickname && (
                      <p className="mt-1 text-sm italic text-gray-500">
                        "{entry.nickname}"
                      </p>
                    )}

                    <div className="mt-4 space-y-2">

                      {entry.method && (
                        <div className="flex justify-between gap-3 text-xs">

                          <span className="text-gray-600">
                            Método
                          </span>

                          <strong className="text-gray-400">
                            {entry.method}
                          </strong>

                        </div>
                      )}

                      {entry.region && (
                        <div className="flex justify-between gap-3 text-xs">

                          <span className="text-gray-600">
                            Região
                          </span>

                          <strong className="text-gray-400">
                            {entry.region}
                          </strong>

                        </div>
                      )}

                      {entry.location && (
                        <div className="flex justify-between gap-3 text-xs">

                          <span className="text-gray-600">
                            Local
                          </span>

                          <strong className="max-w-[60%] text-right text-gray-400">
                            {entry.location}
                          </strong>

                        </div>
                      )}

                    </div>

                    {entry.source_url && (
                      <a
                        href={entry.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 block border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-wider text-gray-600 transition hover:text-violet-400"
                      >
                        Ver no ShinyBoard →
                      </a>
                    )}

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}