import Link from "next/link";
import { notFound } from "next/navigation";

import { dex, tiers } from "../../../../lib/data";
import { getShinyOwnership } from "../../../../lib/shiny-ownership";

import ShinyOwnershipTooltip from "../../../components/ShinyOwnershipTooltip";

type PageProps = {
  params: Promise<{
    tier: string;
  }>;
};

export const revalidate = 60;

const tierNames: Record<string, string> = {
  "0": "Tier 0",
  "1": "Tier 1",
  "2": "Tier 2",
  "3": "Tier 3",
  "4": "Tier 4",
  "5": "Tier 5",
  "6": "Tier 6",
  "7": "Tier 7",
};

export default async function TierPage({ params }: PageProps) {
  const { tier } = await params;

  // Converte "tier-1" -> "1"
  const tierNumber = tier.replace("tier-", "");

  const tierData = tiers[tierNumber as keyof typeof tiers];

  if (!tierData) {
    notFound();
  }

  const ownership = await getShinyOwnership();

  return (
    <main className="min-h-screen bg-[#030603]">
      <div className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8">

        {/* BACK */}
        <Link
          href="/shiny/tiers"
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            font-bold
            text-gray-500
            transition
            hover:text-lime-400
          "
        >
          ← Voltar para Shiny Tiers
        </Link>

        {/* TITLE */}
        <section className="mb-10 mt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-lime-400
                "
              >
                NeverTakeBan • Shiny Tiers
              </div>

              <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">
                {tierNames[tierNumber]}
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                Pokémon disponíveis neste tier.
              </p>
            </div>

            {/* POINTS */}
            <div
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-lime-400/15
                bg-lime-400/[0.04]
                px-5
                py-4
              "
            >
              <span className="text-3xl font-black text-lime-400">
                {tierData.points}
              </span>

              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Pontos
                </div>

                <div className="text-xs font-bold text-gray-400">
                  por shiny
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COUNT */}
        <div className="mb-6">
          <span className="text-sm font-black text-white">
            {tierData.pokemon.length}
          </span>

          <span className="ml-2 text-xs text-gray-600">
            Pokémon neste tier
          </span>
        </div>

        {/* GRID */}
        <section
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
          {tierData.pokemon.map((name) => {
            const pokemonId = dex[name];

            const key = normalizePokemonKey(name);

            const entry = ownership[key];

            const players = entry?.players ?? [];

            return (
              <div
                key={name}
                className="
                  group
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
                  {players.length > 0 ? (
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
                  {pokemonId ? (
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`}
                      alt={`Shiny ${name}`}
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
                  ) : (
                    <span className="text-xs text-red-400">
                      Sprite não encontrado
                    </span>
                  )}
                </div>

                {/* NAME */}
                <div className="mt-2 text-center">
                  <p className="truncate text-sm font-black text-white">
                    {name}
                  </p>

                  {pokemonId && (
                    <p className="mt-1 text-[9px] font-bold tracking-[0.15em] text-gray-700">
                      #{String(pokemonId).padStart(3, "0")}
                    </p>
                  )}
                </div>

                {/* TOOLTIP */}
                <ShinyOwnershipTooltip
                  pokemon={name}
                  pokemonId={pokemonId}
                  tier={tierNumber}
                  points={tierData.points}
                  players={players}
                />
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function normalizePokemonKey(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .replace(/[\[\]]/g, "")
    .replace(/-+/g, "-");
}