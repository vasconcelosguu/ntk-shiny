"use client";

import { useState } from "react";
import PokemonCardModal from "./PokemonCardModal";

type Pokemon = {
  name: string;
  id: number;
};

type TierPokemonGridProps = {
  pokemon: Pokemon[];
  tier: string;
  points: number;
};

export default function TierPokemonGrid({
  pokemon,
  tier,
  points,
}: TierPokemonGridProps) {
  const [selectedPokemon, setSelectedPokemon] =
    useState<Pokemon | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {pokemon.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setSelectedPokemon(item)}
            className="group rounded-2xl border border-white/[0.07] bg-[#0d111c] p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#111625] hover:shadow-xl hover:shadow-violet-950/20"
          >
            {/* SPRITE */}
            <div className="flex h-36 items-center justify-center">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${item.id}.png`}
                alt={`Shiny ${item.name}`}
                className="h-28 w-28 object-contain transition-transform duration-200 group-hover:scale-110"
              />
            </div>

            {/* INFO */}
            <div className="text-center">
              <p className="text-[11px] font-bold text-gray-600">
                #{String(item.id).padStart(3, "0")}
              </p>

              <h3 className="mt-1 font-bold capitalize text-white">
                {item.name}
              </h3>

              <p className="mt-2 text-xs font-bold text-violet-400">
                {points} pts
              </p>
            </div>
          </button>
        ))}
      </div>

      {selectedPokemon && (
        <PokemonCardModal
          name={selectedPokemon.name}
          id={selectedPokemon.id}
          tier={tier}
          points={points}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </>
  );
}