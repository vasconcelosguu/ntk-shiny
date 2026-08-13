import Link from "next/link";
import { notFound } from "next/navigation";

import { tiers, dex } from "../../../lib/data";
import TierPokemonGrid from "../../components/TierPokemonGrid";

export const revalidate = 86400;

export function generateStaticParams() {
  return Object.keys(tiers).map((tier) => ({
    tier,
  }));
}

export default async function TierPage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier } = await params;

  const data = tiers[tier as keyof typeof tiers];

  if (!data) {
    notFound();
  }

  const pokemon = data.pokemon
    .map((name) => ({
      name,
      id: dex[name],
    }))
    .filter((pokemon) => pokemon.id);

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      {/* HEADER */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-12">
          <Link
            href="/hunt/shiny/tiers"
            className="text-sm font-semibold text-gray-500 transition hover:text-violet-400"
          >
            ← Voltar para Shiny Tiers
          </Link>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
              Shiny • Tier
            </p>

            <div className="mt-2 flex flex-wrap items-end gap-4">
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                TIER {tier}
              </h1>

              <span className="mb-1 rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-bold text-violet-400">
                {data.points} pts
              </span>
            </div>

            <p className="mt-3 text-gray-400">
              Pokémon disponíveis neste tier.
            </p>
          </div>

          {/* STATS */}
          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3">
              <span className="text-2xl font-black">
                {pokemon.length}
              </span>

              <span className="ml-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                Pokémon
              </span>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3">
              <span className="text-2xl font-black text-violet-400">
                {data.points}
              </span>

              <span className="ml-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                Pontos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* POKÉMON */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <TierPokemonGrid
          pokemon={pokemon}
          tier={tier}
          points={data.points}
        />
      </section>
    </main>
  );
}