import Link from "next/link";
import { notFound } from "next/navigation";
import { tiers, dex } from "../../../lib/data";

export const revalidate = 86400;

export function generateStaticParams() {
  return Object.keys(tiers).map((tier) => ({
    tier,
  }));
}

function getShinySprite(name: string) {
  const id = dex[name];

  if (!id) return null;

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
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

  return (
    <main className="min-h-screen bg-[#070a12] text-white">
      {/* HERO */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/30 via-[#080b14] to-[#070a12]">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-12">
          <Link
            href="/hunt/shiny/tiers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-violet-400"
          >
            <span>←</span>
            Voltar para Shiny Tiers
          </Link>

          <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-400">
                ✨ Shiny Ranking
              </div>

              <h1 className="mt-5 text-5xl font-black tracking-tight">
                TIER {tier}
              </h1>

              <p className="mt-3 max-w-xl text-gray-400">
                Pokémon classificados neste tier de acordo com a
                pontuação do neverTakeBan.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-4 text-center">
                <div className="text-2xl font-black text-violet-400">
                  {data.points}
                </div>

                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Pontos
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-4 text-center">
                <div className="text-2xl font-black">
                  {data.pokemon.length}
                </div>

                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Pokémon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POKÉMON */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-7">
          <h2 className="text-xl font-black">
            Pokémon do Tier {tier}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Clique em um Pokémon para visualizar sua página.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data.pokemon.map((name) => {
            const id = dex[name];
            const sprite = getShinySprite(name);

            return (
              <Link
                key={name}
                href={`/pokemon/${encodeURIComponent(
                  name.toLowerCase()
                )}`}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d111c] p-4 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#111625] hover:shadow-xl hover:shadow-violet-950/20"
              >
                {/* TIER */}
                <div className="absolute right-3 top-3 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[10px] font-black text-violet-400">
                  {data.points} pts
                </div>

                {/* SPRITE */}
                <div className="mt-4 flex h-32 items-center justify-center">
                  {sprite ? (
                    <img
                      src={sprite}
                      alt={`Shiny ${name}`}
                      width={120}
                      height={120}
                      loading="lazy"
                      className="h-28 w-28 object-contain pixelated transition duration-200 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-xs text-gray-600">
                      Sprite indisponível
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="mt-3">
                  <div className="text-[10px] font-bold tracking-widest text-gray-600">
                    #{String(id ?? 0).padStart(3, "0")}
                  </div>

                  <h3 className="mt-1 truncate text-sm font-black capitalize text-white">
                    {name}
                  </h3>
                </div>

                {/* FOOTER */}
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                    Ver Pokémon
                  </span>

                  <span className="text-xs text-gray-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}