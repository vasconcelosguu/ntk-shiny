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

    const amount = Math.min(
      element.clientWidth * 0.85,
      1000
    );

    element.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (!shinies.length) {
    return (
      <div className="rounded-2xl border border-lime-400/10 bg-black/40 p-10 text-center">
        <p className="text-sm text-gray-500">
          Nenhum shiny encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* =====================================================
          SETA ESQUERDA
      ===================================================== */}

      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Ver shinies anteriores"
        className="
          absolute
          left-[-18px]
          top-1/2
          z-30
          hidden
          h-12
          w-12
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-lime-400/30
          bg-[#050805]/95
          text-xl
          font-bold
          text-lime-400
          shadow-xl
          backdrop-blur-md
          transition-all
          duration-200
          hover:scale-105
          hover:border-lime-400/70
          hover:bg-lime-400/10
          hover:shadow-[0_0_30px_rgba(163,230,53,0.18)]
          md:flex
        "
      >
        ←
      </button>

      {/* =====================================================
          CARROSSEL
      ===================================================== */}

      <div
        ref={carouselRef}
        className="
          flex
          snap-x
          snap-mandatory
          gap-5
          overflow-x-auto
          scroll-smooth
          px-1
          pb-5
          pt-1
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
                min-w-[275px]
                max-w-[275px]
                snap-start
                overflow-hidden
                rounded-[20px]
                border
                border-lime-400/15
                bg-[#070b07]
                shadow-[0_15px_50px_rgba(0,0,0,0.45)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-lime-400/40
                hover:shadow-[0_20px_60px_rgba(100,180,0,0.14)]
                sm:min-w-[300px]
                sm:max-w-[300px]
                lg:min-w-[315px]
                lg:max-w-[315px]
              "
            >
              {/* =================================================
                  PLAYER
              ================================================= */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-white/[0.06]
                  bg-black/20
                  px-5
                  py-4
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      text-gray-600
                    "
                  >
                    Player
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-sm
                      font-black
                      text-white
                    "
                  >
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

              {/* =================================================
                  POKÉMON
              ================================================= */}

              <div
                className="
                  relative
                  flex
                  h-[230px]
                  items-center
                  justify-center
                  overflow-hidden
                  bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.13),transparent_60%)]
                "
              >
                {/* brilho central */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    h-44
                    w-44
                    rounded-full
                    bg-lime-400/[0.07]
                    blur-3xl
                    transition-all
                    duration-500
                    group-hover:scale-125
                    group-hover:bg-lime-400/[0.13]
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
                      h-[185px]
                      w-[185px]
                      object-contain
                      drop-shadow-[0_18px_30px_rgba(0,0,0,0.65)]
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="
                      relative
                      z-10
                      text-5xl
                      font-black
                      text-gray-700
                    "
                  >
                    ?
                  </div>
                )}
              </div>

              {/* =================================================
                  INFORMAÇÕES
              ================================================= */}

              <div
                className="
                  border-t
                  border-white/[0.06]
                  px-5
                  py-5
                "
              >
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className="
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.2em]
                        text-gray-600
                      "
                    >
                      Shiny capturado
                    </p>

                    <h3
                      className="
                        mt-1
                        truncate
                        text-xl
                        font-black
                        capitalize
                        text-lime-400
                      "
                    >
                      {pokemonName}
                    </h3>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className="
                        text-[8px]
                        font-black
                        uppercase
                        tracking-wider
                        text-gray-600
                      "
                    >
                      Encounters
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-black
                        text-gray-300
                      "
                    >
                      {formatEncounters(shiny.encounters)}
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

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
                <span
                  className="
                    text-[9px]
                    font-medium
                    text-gray-600
                  "
                >
                  {formatDate(shiny.caught_at)}
                </span>

                <span
                  className="
                    text-sm
                    text-gray-700
                    transition-all
                    duration-200
                    group-hover:translate-x-1
                    group-hover:text-lime-400
                  "
                >
                  →
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* =====================================================
          SETA DIREITA
      ===================================================== */}

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Ver próximos shinies"
        className="
          absolute
          right-[-18px]
          top-1/2
          z-30
          hidden
          h-12
          w-12
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-lime-400/30
          bg-[#050805]/95
          text-xl
          font-bold
          text-lime-400
          shadow-xl
          backdrop-blur-md
          transition-all
          duration-200
          hover:scale-105
          hover:border-lime-400/70
          hover:bg-lime-400/10
          hover:shadow-[0_0_30px_rgba(163,230,53,0.18)]
          md:flex
        "
      >
        →
      </button>

      {/* =====================================================
          INDICADOR MOBILE
      ===================================================== */}

      <p
        className="
          mt-1
          text-center
          text-[9px]
          font-bold
          uppercase
          tracking-[0.25em]
          text-gray-700
          md:hidden
        "
      >
        Arraste para os lados
      </p>
    </div>
  );
}