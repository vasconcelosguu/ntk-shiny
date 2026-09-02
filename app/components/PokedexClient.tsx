"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import ShinyOwnershipTooltip from "./ShinyOwnershipTooltip";

type Pokemon = {
  id: number;
  name: string;
  obtained: boolean;
  players: string[];
};

type Props = {
  pokemon: Pokemon[];
};

type Filter = "all" | "obtained" | "missing";

function getSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${id}.png`;
}

export default function PokedexClient({ pokemon }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredPokemon = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pokemon.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        String(item.id).includes(query);

      if (!matchesSearch) {
        return false;
      }

      if (filter === "obtained" && !item.obtained) {
        return false;
      }

      if (filter === "missing" && item.obtained) {
        return false;
      }

      return true;
    });
  }, [pokemon, search, filter]);

  return (
    <section
      className="
        mx-auto
        w-full
        max-w-[1250px]
        px-4
        py-10
        md:py-16
      "
    >
      {/* CONTROLS */}
      <div
        className="
          mb-8
          flex
          flex-col
          gap-3
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* SEARCH */}
        <div className="relative w-full lg:max-w-md">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar Pokémon..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-white/[0.07]
              bg-[#080c08]
              px-4
              text-sm
              font-medium
              text-white
              outline-none
              placeholder:text-gray-700
              focus:border-lime-400/30
            "
          />
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Todos
          </FilterButton>

          <FilterButton
            active={filter === "obtained"}
            onClick={() => setFilter("obtained")}
          >
            Obtidos
          </FilterButton>

          <FilterButton
            active={filter === "missing"}
            onClick={() => setFilter("missing")}
          >
            Não obtidos
          </FilterButton>
        </div>
      </div>

      {/* RESULT COUNT */}
      <div className="mb-5 flex items-center justify-between">
        <p
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.2em]
            text-gray-700
          "
        >
          {filteredPokemon.length} Pokémon
        </p>

        {search && (
          <p className="text-xs text-gray-700">
            Busca:{" "}
            <span className="text-gray-400">
              {search}
            </span>
          </p>
        )}
      </div>

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
        "
      >
        {filteredPokemon.map((item) => (
          <div
            key={item.id}
            className="group relative"
          >
            <div
              className="
                relative
                overflow-visible
                rounded-2xl
                border
                border-white/[0.07]
                bg-[#090d09]
                p-4
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-lime-400/25
                hover:bg-[#0c110c]
              "
            >
              {/* STATUS */}
              <div className="absolute right-3 top-3 z-10">
                {item.obtained ? (
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
                      font-black
                      text-lime-400
                    "
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    className="
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-white/[0.02]
                      text-[10px]
                      font-black
                      text-gray-700
                    "
                  >
                    —
                  </span>
                )}
              </div>

              {/* SPRITE */}
              <div className="flex h-32 items-center justify-center">
                <Image
                  src={getSpriteUrl(item.id)}
                  alt={`Shiny ${item.name}`}
                  width={120}
                  height={120}
                  className="
                    h-28
                    w-28
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </div>

              {/* NAME */}
              <div className="mt-2 text-center">
                <p
                  className="
                    truncate
                    text-sm
                    font-black
                    text-white
                  "
                >
                  {item.name}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-bold
                    tracking-[0.15em]
                    text-gray-700
                  "
                >
                  #{String(item.id).padStart(3, "0")}
                </p>
              </div>

              {/* TOOLTIP */}
              <ShinyOwnershipTooltip
                pokemon={item.name}
                pokemonId={item.id}
                players={item.players}
              />
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {filteredPokemon.length === 0 && (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-white/[0.07]
            bg-[#080c08]
            px-6
            py-16
            text-center
          "
        >
          <p className="text-sm font-bold text-gray-500">
            Nenhum Pokémon encontrado.
          </p>

          <p className="mt-1 text-xs text-gray-700">
            Tente outro nome ou altere o filtro.
          </p>
        </div>
      )}
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-4 py-2.5",
        "text-xs font-black transition",
        active
          ? "border-lime-400/25 bg-lime-400/10 text-lime-400"
          : "border-white/[0.07] bg-white/[0.02] text-gray-600 hover:border-lime-400/20 hover:text-gray-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}