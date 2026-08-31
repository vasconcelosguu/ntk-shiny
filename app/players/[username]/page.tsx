import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  getPlayer,
  getPlayerShinies,
} from "../../../lib/players";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

function formatNumber(
  value: number | null | undefined
) {
  if (value === null || value === undefined) {
    return "0";
  }

  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("pt-BR");
}

function getSprite(
  pokemonId: number | null | undefined
) {
  if (!pokemonId) {
    return null;
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`;
}

export default async function PlayerPage({
  params,
}: PageProps) {
  const { username } = await params;

  const player = await getPlayer(username);

  if (!player) {
    notFound();
  }

  const shinies = await getPlayerShinies(
    player.username
  );

  const totalEncounters = shinies.reduce(
    (total, shiny) =>
      total + (shiny.encounters ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#030603] text-white">
      <section className="mx-auto w-full max-w-[1250px] px-4 pb-20 pt-10">

        {/* VOLTAR */}

        <Link
          href="/players"
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            font-black
            uppercase
            tracking-[0.15em]
            text-gray-500
            transition
            hover:text-lime-400
          "
        >
          ← Players
        </Link>

        {/* HEADER */}

        <div
          className="
            mt-8
            rounded-3xl
            border
            border-lime-400/10
            bg-[#080d08]
            p-6
            md:p-8
          "
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lime-400">
                Coleção do player
              </p>

              <h1 className="mt-2 text-4xl font-black md:text-5xl">
                {player.username}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Todos os Shinies registrados por este
                player.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl border border-white/[0.06] bg-black/40 px-5 py-3">
                <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                  Shinies
                </p>

                <p className="mt-1 text-xl font-black text-lime-400">
                  {shinies.length}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/40 px-5 py-3">
                <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                  Encounters
                </p>

                <p className="mt-1 text-xl font-black text-white">
                  {formatNumber(totalEncounters)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SHINIES */}

        <div className="mt-8">
          {shinies.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-[#080d08] p-10 text-center">
              <p className="text-sm text-gray-500">
                Este player ainda não possui Shinies
                registrados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shinies.map((shiny) => {
                const sprite = getSprite(
                  shiny.pokemon_id
                );

                const pokemonName =
                  shiny.display_name ||
                  shiny.pokemon ||
                  "Pokémon";

                return (
                  <article
                    key={shiny.id}
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/[0.06]
                      bg-[#080d08]
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-lime-400/25
                      hover:shadow-[0_20px_60px_rgba(100,180,0,0.08)]
                    "
                  >
                    {/* SPRITE */}

                    <div
                      className="
                        relative
                        flex
                        h-[230px]
                        items-center
                        justify-center
                        overflow-hidden
                        bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.10),transparent_60%)]
                      "
                    >
                      <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-lime-400/[0.06] blur-3xl transition group-hover:bg-lime-400/[0.12]" />

                      {sprite ? (
                        <Image
                          src={sprite}
                          alt={`${pokemonName} shiny`}
                          width={190}
                          height={190}
                          unoptimized
                          draggable={false}
                          className="
                            relative
                            z-10
                            object-contain
                            transition-transform
                            duration-500
                            group-hover:scale-110
                          "
                        />
                      ) : (
                        <span className="relative z-10 text-5xl text-gray-700">
                          ?
                        </span>
                      )}
                    </div>

                    {/* INFO */}

                    <div className="border-t border-white/[0.05] p-5">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                        Shiny
                      </p>

                      <h2 className="mt-1 truncate text-xl font-black capitalize text-lime-400">
                        {pokemonName}
                      </h2>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                            Encounters
                          </p>

                          <p className="mt-1 text-sm font-black text-gray-300">
                            {formatNumber(
                              shiny.encounters
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                            Data
                          </p>

                          <p className="mt-1 text-sm font-black text-gray-300">
                            {formatDate(
                              shiny.caught_at
                            )}
                          </p>
                        </div>
                      </div>

                      {(shiny.method ||
                        shiny.region ||
                        shiny.location) && (
                        <div className="mt-4 border-t border-white/[0.05] pt-4">
                          <p className="truncate text-[9px] font-bold uppercase tracking-wider text-gray-600">
                            {[
                              shiny.method,
                              shiny.region,
                              shiny.location,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* NAVEGAÇÃO */}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/players"
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
              hover:border-lime-400/30
              hover:text-lime-400
            "
          >
            ← Todos os Players
          </Link>

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
              hover:bg-lime-400/10
            "
          >
            Ver Shinies →
          </Link>
        </div>
      </section>
    </main>
  );
}