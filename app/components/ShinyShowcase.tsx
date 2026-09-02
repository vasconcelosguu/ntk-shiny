"use client";

import Image from "next/image";

type Shiny = {
  id: string;
  playerId: string;
  username: string;
  pokemon: string;
  displayName: string;
  pokemonId: number | null;
  encounters: number | null;
  caughtAt: string | null;
};

type Props = {
  shinies: Shiny[];
};

function getSpriteUrl(pokemonId: number | null) {
  if (!pokemonId) return null;

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`;
}

function formatDate(date: string | null) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ShinyShowcase({ shinies }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
      
      {/* HEADER */}

      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-lime-400">
          Showcase
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
          Shinies do time
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Todos os shinies capturados pelos membros do NeverTakeBan.
        </p>
      </div>


      {/* GRID */}

      {shinies.length > 0 ? (
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
          "
        >
          {shinies.map((shiny) => {
            const sprite = getSpriteUrl(shiny.pokemonId);

            return (
              <article
                key={shiny.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#080c08]
                  p-4
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-lime-400/30
                  hover:bg-[#0b100b]
                  hover:shadow-2xl
                  hover:shadow-lime-950/10
                "
              >

                {/* brilho */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    bg-lime-400/[0.05]
                    blur-2xl
                    transition
                    duration-300
                    group-hover:bg-lime-400/[0.12]
                  "
                />


                {/* PLAYER */}

                <div className="relative flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03]">
                    <span className="text-[9px]">
                      👤
                    </span>
                  </div>

                  <p className="min-w-0 truncate text-[10px] font-black uppercase tracking-wider text-gray-500 transition-colors group-hover:text-lime-400">
                    {shiny.username}
                  </p>
                </div>


                {/* SPRITE */}

                <div className="relative mt-3 flex h-36 items-center justify-center rounded-xl bg-black/30">

                  {sprite ? (
                    <Image
                      src={sprite}
                      alt={shiny.displayName}
                      width={150}
                      height={150}
                      className="
                        h-32
                        w-32
                        object-contain
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    />
                  ) : (
                    <div className="text-4xl text-gray-800">
                      ?
                    </div>
                  )}

                </div>


                {/* NOME */}

                <div className="mt-3">
                  <h3 className="truncate text-sm font-black text-white">
                    {shiny.displayName}
                  </h3>

                  {shiny.encounters !== null && (
                    <p className="mt-1 text-[10px] text-gray-600">
                      {shiny.encounters.toLocaleString("pt-BR")} encontros
                    </p>
                  )}
                </div>


                {/* FOOTER */}

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-between
                    border-t
                    border-white/[0.05]
                    pt-3
                  "
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-700">
                    Shiny
                  </span>

                  <span className="text-[10px] text-gray-700 transition-colors group-hover:text-lime-400">
                    ✨
                  </span>
                </div>


                {/* DATA */}

                {shiny.caughtAt && (
                  <p className="mt-2 text-[9px] text-gray-700">
                    {formatDate(shiny.caughtAt)}
                  </p>
                )}

              </article>
            );
          })}
        </div>
      ) : (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-white/[0.07]
            bg-white/[0.015]
            px-6
            py-16
            text-center
          "
        >
          <div className="text-4xl">
            ✨
          </div>

          <h3 className="mt-4 text-lg font-black text-white">
            Nenhum shiny encontrado
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Ainda não existem shinies registrados no banco de dados.
          </p>
        </div>
      )}

    </section>
  );
}