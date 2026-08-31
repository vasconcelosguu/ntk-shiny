import Image from "next/image";

import { getLatestShinies } from "../lib/home";
import LatestShiniesCarousel from "./components/LatestShiniesCarousel";
import { AlteringCave } from "./components/AlteringCave";

export const revalidate = 60;

export default async function Home() {
  const latestShinies = await getLatestShinies();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030603]">

      {/* =====================================================
          BACKGROUND / BANNER
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <Image
          src="/images/home-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-top
            opacity-[0.38]
          "
        />

        {/* Dark overlay */}

        <div className="absolute inset-0 bg-[#030603]/65" />

        {/* Green atmosphere */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_15%,rgba(132,204,22,0.18),transparent_45%)]
          "
        />

        {/* Bottom fade */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[60%]
            bg-gradient-to-t
            from-[#030603]
            via-[#030603]/90
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 lg:px-8">

        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            flex
            min-h-[430px]
            flex-col
            items-center
            justify-center
            text-center
          "
        >

          <p
            className="
              mb-4
              text-[10px]
              font-black
              uppercase
              tracking-[0.45em]
              text-lime-400
              drop-shadow-[0_0_12px_rgba(163,230,53,0.4)]
            "
          >
            Never Take Ban
          </p>

          <h1
            className="
              text-5xl
              font-black
              tracking-tight
              text-white
              drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]
              sm:text-6xl
              md:text-7xl
            "
          >
            PokeMMO Team
          </h1>

          <p
            className="
              mt-5
              max-w-xl
              text-sm
              leading-6
              text-gray-400
              sm:text-base
            "
          >
            Shinies, eventos, raids, ferramentas e informações do time.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-lime-400/50" />

            <span
              className="
                h-1.5
                w-1.5
                rotate-45
                bg-lime-400
                shadow-[0_0_12px_rgba(163,230,53,0.9)]
              "
            />

            <span className="h-px w-20 bg-gradient-to-l from-transparent to-lime-400/50" />
          </div>
        </section>

        {/* =================================================
            POKEMMO INFORMATION
        ================================================= */}

        <section className="mb-16">

          <div className="mb-6 flex items-end justify-between">

            <div>
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-lime-400
                "
              >
                PokeMMO
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                Informações do jogo
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Dados e horários atualizados em tempo real.
              </p>
            </div>

            <span
              className="
                hidden
                rounded-full
                border
                border-lime-400/15
                bg-lime-400/[0.03]
                px-4
                py-2
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]
                text-lime-400
                sm:block
              "
            >
              LIVE
            </span>
          </div>

          <AlteringCave />
        </section>

        {/* =================================================
            SHINIES
        ================================================= */}

        <section className="pb-24">

          <div className="mb-7 flex items-end justify-between gap-4">

            <div>
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.35em]
                  text-lime-400
                "
              >
                Atividade do time
              </p>

              <h2
                className="
                  mt-2
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  md:text-4xl
                "
              >
                Últimos Shinies
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                O shiny mais recente de cada player.
              </p>
            </div>

            <div
              className="
                hidden
                rounded-full
                border
                border-lime-400/15
                bg-lime-400/[0.03]
                px-4
                py-2
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]
                text-lime-400/70
                sm:block
              "
            >
              {latestShinies.length} Players
            </div>
          </div>

          <LatestShiniesCarousel shinies={latestShinies} />

        </section>

      </div>
    </main>
  );
}