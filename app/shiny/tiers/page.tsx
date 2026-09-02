import Link from "next/link";
import { tiers } from "../../../lib/data";

const tierColors: Record<string, string> = {
  "0": "from-red-500/20 to-orange-500/5 border-red-400/20",
  "1": "from-orange-500/20 to-yellow-500/5 border-orange-400/20",
  "2": "from-yellow-500/20 to-lime-500/5 border-yellow-400/20",
  "3": "from-lime-500/20 to-green-500/5 border-lime-400/20",
  "4": "from-green-500/20 to-emerald-500/5 border-green-400/20",
  "5": "from-cyan-500/20 to-blue-500/5 border-cyan-400/20",
  "6": "from-blue-500/20 to-indigo-500/5 border-blue-400/20",
  "7": "from-gray-500/20 to-gray-800/5 border-gray-400/20",
};

const tierLabels: Record<string, string> = {
  "0": "Tier 0",
  "1": "Tier 1",
  "2": "Tier 2",
  "3": "Tier 3",
  "4": "Tier 4",
  "5": "Tier 5",
  "6": "Tier 6",
  "7": "Tier 7",
};

export default function ShinyTiersPage() {
  const tierEntries = Object.entries(tiers);

  return (
    <main className="min-h-screen bg-[#030603]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8">

        {/* HEADER */}
        <section className="mb-12">
          <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">
            NeverTakeBan
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Shiny Tiers
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">
            Consulte a classificação dos Pokémon shiny do NeverTakeBan,
            separados por tier e quantidade de pontos.
          </p>
        </section>

        {/* TIERS */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tierEntries.map(([tier, data]) => (
            <Link
              key={tier}
              href={`/shiny/tiers/tier-${tier}`}
              className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                bg-gradient-to-br
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-lime-400/40
                hover:shadow-[0_20px_50px_rgba(100,180,0,0.10)]
                ${tierColors[tier]}
              `}
            >
              {/* GLOW */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-32
                  w-32
                  rounded-full
                  bg-lime-400/[0.05]
                  blur-3xl
                  transition
                  group-hover:bg-lime-400/[0.10]
                "
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
                      Shiny War
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-white">
                      {tierLabels[tier]}
                    </h2>
                  </div>

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-black/20
                      text-lg
                      font-black
                      text-lime-400
                    "
                  >
                    {data.points}
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black text-white">
                      {data.pokemon.length}
                    </div>

                    <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      Pokémon
                    </div>
                  </div>

                  <span
                    className="
                      text-xs
                      font-black
                      text-gray-500
                      transition
                      group-hover:text-lime-400
                    "
                  >
                    Ver tier →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* INFO */}
        <section
          className="
            mt-10
            rounded-2xl
            border
            border-lime-400/10
            bg-lime-400/[0.025]
            p-6
          "
        >
          <div className="flex gap-4">
            <div className="text-xl">💡</div>

            <div>
              <h3 className="text-sm font-black text-white">
                Como funciona?
              </h3>

              <p className="mt-2 text-xs leading-6 text-gray-500">
                Cada Pokémon possui uma pontuação de acordo com seu tier.
                Dentro de cada tier você poderá visualizar todos os Pokémon
                e verificar quais já foram obtidos pelos membros do time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}