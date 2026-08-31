import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    tier: string;
  }>;
};

type Pokemon = {
  name: string;
  id: number;
};

const tiers: Record<
  string,
  {
    name: string;
    description: string;
    points: number;
    pokemon: Pokemon[];
  }
> = {
  "tier-0": {
    name: "Tier 0",
    description: "Pokémon Shiny de maior valor e raridade.",
    points: 50,
    pokemon: [],
  },

  "tier-1": {
    name: "Tier 1",
    description: "Pokémon Shiny extremamente raros.",
    points: 40,
    pokemon: [],
  },

  "tier-2": {
    name: "Tier 2",
    description: "Pokémon Shiny de alta raridade.",
    points: 30,
    pokemon: [],
  },

  "tier-3": {
    name: "Tier 3",
    description: "Pokémon Shiny de boa raridade.",
    points: 25,
    pokemon: [],
  },

  "tier-4": {
    name: "Tier 4",
    description: "Pokémon Shiny de raridade intermediária.",
    points: 20,
    pokemon: [],
  },

  "tier-5": {
    name: "Tier 5",
    description: "Pokémon Shiny comuns.",
    points: 15,
    pokemon: [],
  },

  "tier-6": {
    name: "Tier 6",
    description: "Pokémon Shiny de menor raridade.",
    points: 10,
    pokemon: [],
  },

  "tier-7": {
    name: "Tier 7",
    description: "Pokémon Shiny de entrada.",
    points: 3,
    pokemon: [],
  },
};

export async function generateStaticParams() {
  return Object.keys(tiers).map((tier) => ({
    tier,
  }));
}

function getSprite(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${id}.png`;
}

export default async function ShinyTierPage({
  params,
}: PageProps) {
  const { tier } = await params;

  const tierData = tiers[tier.toLowerCase()];

  if (!tierData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#030603] text-white">
      <section className="mx-auto w-full max-w-[1250px] px-4 pb-20 pt-10">
        {/* VOLTAR */}

        <Link
          href="/shiny"
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
          ← Shiny
        </Link>

        {/* HEADER */}

        <div className="mt-8 overflow-hidden rounded-3xl border border-lime-400/10 bg-[#080d08]">
          <div className="relative p-6 md:p-8">
            <div
              className="
                pointer-events-none
                absolute
                right-[-120px]
                top-[-120px]
                h-80
                w-80
                rounded-full
                bg-lime-400/[0.06]
                blur-3xl
              "
            />

            <div className="relative">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lime-400">
                Shiny Tiers
              </p>

              <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                    {tierData.name}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                    {tierData.description}
                  </p>
                </div>

                <div
                  className="
                    shrink-0
                    rounded-2xl
                    border
                    border-lime-400/15
                    bg-lime-400/[0.04]
                    px-6
                    py-4
                  "
                >
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
                    Valor
                  </p>

                  <p className="mt-1 text-3xl font-black text-lime-400">
                    {tierData.points}
                  </p>

                  <p className="text-[8px] font-black uppercase tracking-wider text-gray-600">
                    pontos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POKÉMON */}

        <div className="mt-8">
          {tierData.pokemon.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-[#080d08] p-12 text-center">
              <div className="text-4xl">✨</div>

              <h2 className="mt-4 text-xl font-black text-white">
                Nenhum Pokémon cadastrado
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Os Pokémon deste tier ainda não foram
                configurados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {tierData.pokemon.map((pokemon) => (
                <article
                  key={pokemon.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-[#080d08]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-lime-400/25
                    hover:bg-[#0a100a]
                  "
                >
                  <div
                    className="
                      relative
                      flex
                      h-[210px]
                      items-center
                      justify-center
                      bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.10),transparent_60%)]
                    "
                  >
                    <Image
                      src={getSprite(pokemon.id)}
                      alt={`${pokemon.name} shiny`}
                      width={170}
                      height={170}
                      unoptimized
                      className="
                        object-contain
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                    />
                  </div>

                  <div className="border-t border-white/[0.05] p-4">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
                      Shiny
                    </p>

                    <h2 className="mt-1 truncate text-lg font-black capitalize text-lime-400">
                      {pokemon.name}
                    </h2>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* NAVEGAÇÃO ENTRE TIERS */}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/shiny"
            className="
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              px-5
              py-3
              text-center
              text-[10px]
              font-black
              uppercase
              tracking-[0.15em]
              text-gray-500
              transition
              hover:border-lime-400/20
              hover:text-lime-400
            "
          >
            ← Todos os Tiers
          </Link>

          <div className="flex gap-3">
            {tier !== "tier-0" && (
              <Link
                href={`/shiny/tier-${Math.max(
                  0,
                  Number(tier.replace("tier-", "")) - 1
                )}`}
                className="
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  px-5
                  py-3
                  text-center
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-gray-500
                  transition
                  hover:border-lime-400/20
                  hover:text-lime-400
                "
              >
                ← Tier anterior
              </Link>
            )}

            {tier !== "tier-7" && (
              <Link
                href={`/shiny/tier-${Math.min(
                  7,
                  Number(tier.replace("tier-", "")) + 1
                )}`}
                className="
                  rounded-xl
                  border
                  border-lime-400/15
                  bg-lime-400/[0.04]
                  px-5
                  py-3
                  text-center
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-lime-400
                  transition
                  hover:border-lime-400/35
                  hover:bg-lime-400/[0.08]
                "
              >
                Próximo Tier →
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}