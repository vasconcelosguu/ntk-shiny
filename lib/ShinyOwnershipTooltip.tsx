"use client";

import Image from "next/image";

type Props = {
  pokemon: string;
  pokemonId: number;
  tier?: string;
  points?: number;
  players: string[];
};

function getSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${id}.png`;
}

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
        group-hover:pointer-events-auto
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
          bg-[#080b08]
          shadow-2xl
          shadow-black/70
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-white/[0.06]
            bg-[#0c110c]
            px-4
            py-3
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-lime-400/15
              bg-black/40
            "
          >
            <Image
              src={getSpriteUrl(pokemonId)}
              alt={`Shiny ${pokemon}`}
              width={52}
              height={52}
              className="object-contain"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">
              {pokemon}
            </p>

            <div className="mt-1 flex gap-2">
              {tier && (
                <span className="text-[9px] font-black uppercase tracking-wider text-lime-400">
                  Tier {tier}
                </span>
              )}

              {points !== undefined && (
                <span className="text-[9px] font-bold text-gray-600">
                  {points} pts
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-3">
          {obtained ? (
            <>
              <div className="flex items-center gap-2">
                <span
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-lime-400/10
                    text-[10px]
                    text-lime-400
                  "
                >
                  ✓
                </span>

                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-lime-400">
                  Obtido
                </p>
              </div>

              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                Players que já pegaram
              </p>

              <div className="mt-2 space-y-1.5">
                {players.map((player) => (
                  <div
                    key={player}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-white/[0.05]
                      bg-white/[0.02]
                      px-3
                      py-2
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />

                    <span className="text-xs font-bold text-gray-300">
                      {player}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-[9px] font-bold text-gray-700">
                {players.length}{" "}
                {players.length === 1
                  ? "membro possui"
                  : "membros possuem"}{" "}
                este shiny
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-400/10
                    text-[10px]
                    text-red-400
                  "
                >
                  ×
                </span>

                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-red-400">
                  Ainda não obtido
                </p>
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-600">
                Nenhum membro do NeverTakeBan
                possui este shiny atualmente.
              </p>
            </>
          )}
        </div>
      </div>

      <div
        className="
          absolute
          bottom-[-5px]
          left-1/2
          h-3
          w-3
          -translate-x-1/2
          rotate-45
          border-b
          border-r
          border-white/[0.08]
          bg-[#080b08]
        "
      />
    </div>
  );
}