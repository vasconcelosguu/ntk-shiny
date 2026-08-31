"use client";

import { useRef } from "react";

type Shiny = {
  id: string;
  username: string;
  pokemon: string;
  display_name?: string | null;
  pokemon_id?: number | null;
  encounters?: number | null;
  caught_at?: string | null;
};

type Props = {
  shinies: Shiny[];
};

function getPokemonHomeSprite(shiny: Shiny) {
  /*
   * PokeAPI / Pokémon HOME
   *
   * Exemplo:
   * https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/319.png
   */

  if (!shiny.pokemon_id) {
    return null;
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${shiny.pokemon_id}.png`;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("pt-BR");
}

function formatEncounters(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "0";
  }

  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function LatestShiniesCarousel({
  shinies,
}: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const element = carouselRef.current;

    if (!element) return;

    const amount = element.clientWidth * 0.82;

    element.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (!shinies.length) {
    return (
      <section className="mx-auto w-full max-w-[1250px] px-4 py-16">
        <div className="rounded-2xl border border-lime-400/10 bg-black/40 p-10 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-lime-400">
            Atividade do time
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Últimos Shinies
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Nenhum shiny encontrado.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto w-full max-w-[1250px] px-4 pb-20">

      {/* HEADER */}

      <div className="mb-7 flex items-end justify-between gap-6">

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lime-400">
            Atividade do time
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
            Últimos Shinies
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            O shiny mais recente de cada player.
          </p>
        </div>

        <div className="hidden rounded-full border border-lime-400/15 bg-lime-400/[0.03] px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-lime-400/70 md:block">
          {shinies.length} players
        </div>

      </div>

      {/* CAROUSEL */}

      <div className="relative">

        {/* LEFT */}

        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Ver shinies anteriores"
          className="
            absolute
            left-[-18px]
            top-1/2
            z-20
            hidden
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-lime-400/25
            bg-black/80
            text-lg
            text-lime-400
            backdrop-blur-md
            transition
            hover:border-lime-400/60
            hover:bg-lime-400/10
            hover:shadow-[0_0_25px_rgba(163,230,53,0.15)]
            md:flex
          "
        >
          ←
        </button>

        {/* TRACK */}

        <div
          ref={carouselRef}
          className="
            flex
            snap-x
            snap-mandatory
            gap-4
            overflow-x-auto
            scroll-smooth
            px-1
            pb-5
            [scrollbar-width:none]
            [-ms-overflow-style:none]
          "
        >

          {shinies.map((shiny) => {
            const sprite = getPokemonHomeSprite(shiny);

            const pokemonName =
              shiny.display_name ||
              shiny.pokemon ||
              "Pokémon";

            return (
              <article
                key={shiny.id}
                className="
                  group
                  relative
                  min-w-[280px]
                  max-w-[280px]
                  snap-start
                  overflow-hidden
                  rounded-2xl
                  border
                  border-lime-400/15
                  bg-[#050b05]/90
                  shadow-[0_15px_50px_rgba(0,0,0,0.35)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-lime-400/35
                  hover:shadow-[0_20px_60px_rgba(100,180,0,0.12)]
                  sm:min-w-[310px]
                  sm:max-w-[310px]
                  lg:min-w-[320px]
                  lg:max-w-[320px]
                "
              >

                {/* PLAYER HEADER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-white/[0.05]
                    px-5
                    py-4
                  "
                >
                  <div className="min-w-0">

                    <p className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-600">
                      Player
                    </p>

                    <p className="mt-1 truncate text-sm font-black text-white">
                      {shiny.username}
                    </p>

                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-lime-400/20
                      bg-lime-400/[0.06]
                      px-2.5
                      py-1
                      text-[8px]
                      font-black
                      uppercase
                      tracking-wider
                      text-lime-400
                    "
                  >
                    New
                  </span>
                </div>

                {/* POKEMON */}

                <div
                  className="
                    relative
                    flex
                    h-[245px]
                    items-center
                    justify-center
                    overflow-hidden
                    bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.12),transparent_58%)]
                  "
                >

                  {/* glow */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      h-40
                      w-40
                      rounded-full
                      bg-lime-400/[0.08]
                      blur-3xl
                      transition
                      duration-500
                      group-hover:bg-lime-400/[0.14]
                    "
                  />

                  {sprite ? (
                    <img
                      src={sprite}
                      alt={`${pokemonName} shiny`}
                      draggable={false}
                      className="
                        relative
                        z-10
                        h-[190px]
                        w-[190px]
                        object-contain
                        drop-shadow-[0_15px_25px_rgba(0,0,0,0.55)]
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                    />
                  ) : (
                    <div className="relative z-10 text-5xl text-gray-700">
                      ?
                    </div>
                  )}

                </div>

                {/* INFO */}

                <div className="border-t border-white/[0.05] px-5 py-5">

                  <div className="flex items-end justify-between gap-4">

                    <div className="min-w-0">

                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                        Shiny capturado
                      </p>

                      <h3 className="mt-1 truncate text-xl font-black capitalize text-lime-400">
                        {pokemonName}
                      </h3>

                    </div>

                    <div className="shrink-0 text-right">

                      <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                        Encounters
                      </p>

                      <p className="mt-1 text-sm font-black text-gray-300">
                        {formatEncounters(shiny.encounters)}
                      </p>

                    </div>

                  </div>

                </div>

                {/* FOOTER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-white/[0.05]
                    px-5
                    py-3
                  "
                >

                  <span className="text-[9px] font-medium text-gray-600">
                    {formatDate(shiny.caught_at)}
                  </span>

                  <span className="text-sm text-gray-700 transition group-hover:translate-x-1 group-hover:text-lime-400">
                    →
                  </span>

                </div>

              </article>
            );
          })}

        </div>

        {/* RIGHT */}

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Ver próximos shinies"
          className="
            absolute
            right-[-18px]
            top-1/2
            z-20
            hidden
            h-11
            w-11
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-lime-400/25
            bg-black/80
            text-lg
            text-lime-400
            backdrop-blur-md
            transition
            hover:border-lime-400/60
            hover:bg-lime-400/10
            hover:shadow-[0_0_25px_rgba(163,230,53,0.15)]
            md:flex
          "
        >
          →
        </button>

      </div>

      {/* MOBILE HINT */}

      <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-[0.25em] text-gray-700 md:hidden">
        Arraste para os lados
      </p>

    </section>
  );
}