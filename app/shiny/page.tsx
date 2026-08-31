import Link from "next/link";
import LatestShiniesCarousel from "../components/LatestShiniesCarousel";
import { getLatestShinies } from "../../lib/home";

export const revalidate = 60;

export default async function ShinyPage() {
  const latestShinies = await getLatestShinies();

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#050805] text-white">
      {/* =====================================================
          HEADER DA PÁGINA
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Glow verde */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-180px] h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-lime-400/[0.08] blur-[120px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(163,230,53,0.08),transparent_45%)]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-lime-400">
              NeverTakeBan
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">
              Shiny
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Central de shinies do time. Acompanhe as capturas mais recentes,
              consulte os players e veja os tiers disponíveis.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:py-14">
        {/* =================================================
            ATALHOS
        ================================================= */}

        <section className="mb-12">
          <div className="mb-5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">
              Navegação
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Central Shiny
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* TIERS */}

            <Link
              href="/shiny/tiers"
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-lime-400/15
                bg-[#0b0f0b]
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-lime-400/40
                hover:bg-[#0d130d]
                hover:shadow-[0_20px_60px_rgba(100,180,0,0.10)]
              "
            >
              <div
                className="
                  absolute
                  right-[-50px]
                  top-[-50px]
                  h-32
                  w-32
                  rounded-full
                  bg-lime-400/[0.06]
                  blur-3xl
                  transition
                  duration-500
                  group-hover:bg-lime-400/[0.12]
                "
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-lime-400/20
                      bg-lime-400/[0.06]
                      text-xl
                    "
                  >
                    ✨
                  </div>

                  <span className="text-xl text-gray-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-lime-400">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black text-white">
                  Ver Tiers
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Consulte a classificação dos Pokémon por tier e seus valores
                  dentro do sistema do time.
                </p>
              </div>
            </Link>

            {/* PLAYERS */}

            <Link
              href="/players"
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-lime-400/15
                bg-[#0b0f0b]
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-lime-400/40
                hover:bg-[#0d130d]
                hover:shadow-[0_20px_60px_rgba(100,180,0,0.10)]
              "
            >
              <div
                className="
                  absolute
                  right-[-50px]
                  top-[-50px]
                  h-32
                  w-32
                  rounded-full
                  bg-lime-400/[0.06]
                  blur-3xl
                  transition
                  duration-500
                  group-hover:bg-lime-400/[0.12]
                "
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-lime-400/20
                      bg-lime-400/[0.06]
                      text-xl
                    "
                  >
                    👥
                  </div>

                  <span className="text-xl text-gray-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-lime-400">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black text-white">
                  Ver Players
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Veja os membros do time e acompanhe os shinies registrados
                  por cada player.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* =================================================
            ÚLTIMOS SHINIES
        ================================================= */}

        <section>
          <LatestShiniesCarousel shinies={latestShinies} />
        </section>
      </div>
    </main>
  );
}