"use client";

import Image from "next/image";

type Props = {
  pokemon: string;
  pokemonId: number;
  tier?: string;
  points?: number;
  players: string[];
};

export default function ShinyOwnershipTooltip({
  pokemon,
  pokemonId,
  tier,
  points,
  players,
}: Props) {
  const obtained = players.length > 0;

  return (
    <div
      className="
        pointer-events-none
        absolute
        bottom-full
        left-1/2
        z-[100]
        mb-3
        w-[250px]
        -translate-x-1/2
        translate-y-2
        opacity-0
        transition-all
        duration-200
        group-hover:translate-y-0
        group-hover:opacity-100
      "
    >
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#070b07]
          shadow-2xl
          shadow-black/70
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-white/[0.06]
            px-4
            py-3
          "
        >
          {/* SPRITE */}
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-black/40
            "
          >
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`}
              alt={pokemon}
              width={46}
              height={46}
              className="object-contain"
            />
          </div>

          {/* NAME */}
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">
              {pokemon}
            </p>

            {/* TIER INFO */}
            {tier && points !== undefined && (
              <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-600">
                Tier {tier} · {points} pts
              </p>
            )}

            {/* POKEDEX INFO */}
            {(!tier || points === undefined) && (
              <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-gray-600">
                Shiny Pokémon
              </p>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4">
          {obtained ? (
            <>
              {/* OBTAINED */}
              <div className="flex items-center gap-2">
                <span className="text-lime-400">✓</span>

                <span
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-lime-400
                  "
                >
                  Obtido
                </span>
              </div>

              {/* PLAYERS */}
              <p
                className="
                  mt-4
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-gray-700
                "
              >
                Players
              </p>

              <div className="mt-2 space-y-1.5">
                {players.map((player) => (
                  <div
                    key={player}
                    className="
                      rounded-lg
                      border
                      border-white/[0.05]
                      bg-white/[0.02]
                      px-3
                      py-2
                    "
                  >
                    <span className="text-xs font-bold text-gray-300">
                      {player}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* NOT OBTAINED */}
              <div className="flex items-center gap-2">
                <span className="text-red-400">×</span>

                <span
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-red-400
                  "
                >
                  Ainda não obtido
                </span>
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-600">
                Nenhum membro registrado possui este shiny.
              </p>
            </>
          )}
        </div>
      </div>

      {/* TOOLTIP ARROW */}
      <div
        className="
          absolute
          bottom-[-5px]
          left-1/2
          h-3
          w-3
          -translate-x-1/2
          rotate-45
          bg-[#070b07]
        "
      />
    </div>
  );
}