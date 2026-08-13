import Link from "next/link";
import { tiers } from "../../../../lib/data";

export default function ShinyTiersPage() {
  const total = Object.values(tiers).reduce(
    (sum, tier) => sum + tier.pokemon.length,
    0
  );

  return (
    <main className="min-h-screen bg-[#070a12] text-white">
      {/* HERO */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/30 via-[#080b14] to-[#070a12]">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12">
          <Link
            href="/hunt/shiny"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-violet-400"
          >
            <span>←</span>
            Voltar para Shiny
          </Link>

          <div className="mt-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-400">
              ✨ Shiny Hunt
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Shiny Tiers
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
              Classificação dos Pokémon Shiny do neverTakeBan,
              organizados por raridade e pontuação.
            </p>

            {/* STATS */}
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-4">
                <div className="text-2xl font-black text-white">
                  {total}
                </div>

                <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Pokémon
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-4">
                <div className="text-2xl font-black text-white">
                  {Object.keys(tiers).length}
                </div>

                <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Tiers
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-7">
          <h2 className="text-xl font-black text-white">
            Classificação
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Escolha um tier para visualizar os Pokémon disponíveis.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(tiers).map(([tier, data]) => (
            <Link
              key={tier}
              href={`/tiers/${tier}`}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d111c] p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#111625] hover:shadow-2xl hover:shadow-violet-950/20"
            >
              {/* Glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl transition group-hover:bg-violet-500/20" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-black text-violet-400">
                      T{tier}
                    </span>

                    <div>
                      <div className="text-sm font-black text-white">
                        TIER {tier}
                      </div>

                      <div className="text-xs text-gray-600">
                        Raridade
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-400">
                    {data.points} pts
                  </span>
                </div>

                <div className="mt-8 flex items-end gap-2">
                  <span className="text-4xl font-black text-white">
                    {data.pokemon.length}
                  </span>

                  <span className="mb-1 text-sm text-gray-500">
                    Pokémon
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600 transition group-hover:text-violet-400">
                    Ver Pokémon
                  </span>

                  <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}