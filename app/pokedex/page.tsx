import Image from "next/image";

import {
  getShinyOwnership,
  getOwnershipForPokemon,
} from "../../lib/shiny-ownership";

import PokedexClient from "../components/PokedexClient";

type Pokemon = {
  id: number;
  name: string;
};

async function getPokedex(): Promise<Pokemon[]> {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=649&offset=0",
    {
      next: {
        revalidate: 86400,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar a Pokédex."
    );
  }

  const data = await response.json();

  return data.results.map(
    (
      pokemon: {
        name: string;
        url: string;
      },
      index: number
    ) => ({
      id: index + 1,
      name: formatPokemonName(
        pokemon.name
      ),
    })
  );
}

function formatPokemonName(
  value: string
) {
  return value
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

export const revalidate = 86400;

export default async function PokedexPage() {
  const [pokemon, ownership] =
    await Promise.all([
      getPokedex(),
      getShinyOwnership(),
    ]);

  const entries = pokemon.map((item) => {
    const data =
      getOwnershipForPokemon(
        ownership,
        item.name
      );

    return {
      ...item,
      players: data.players,
      obtained: data.obtained,
    };
  });

  return (
    <main className="min-h-screen bg-[#030603] text-white">
      {/* HERO */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-lime-400/10
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[-180px]
            h-[500px]
            w-[900px]
            -translate-x-1/2
            rounded-full
            bg-lime-400/[0.05]
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1250px]
            px-4
            py-14
            md:py-18
          "
        >
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lime-400">
            NeverTakeBan
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Pokédex Shiny
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
            Todos os Pokémon da Pokédex do
            PokeMMO e o progresso de Shinies do
            NeverTakeBan.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <div
              className="
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.02]
                px-4
                py-3
              "
            >
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-700">
                Pokémon
              </p>

              <p className="mt-1 text-xl font-black text-white">
                {entries.length}
              </p>
            </div>

            <div
              className="
                rounded-xl
                border
                border-lime-400/15
                bg-lime-400/[0.04]
                px-4
                py-3
              "
            >
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-700">
                Obtidos
              </p>

              <p className="mt-1 text-xl font-black text-lime-400">
                {
                  entries.filter(
                    (item) =>
                      item.obtained
                  ).length
                }
              </p>
            </div>

            <div
              className="
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.02]
                px-4
                py-3
              "
            >
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-700">
                Restantes
              </p>

              <p className="mt-1 text-xl font-black text-white">
                {
                  entries.filter(
                    (item) =>
                      !item.obtained
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      <PokedexClient pokemon={entries} />
    </main>
  );
}