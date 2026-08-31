import Image from "next/image";

import { getLatestShinies } from "../lib/home";

import LatestShiniesCarousel from "./components/LatestShiniesCarousel";
import { AlteringCave } from "./components/AlteringCave";

export const revalidate = 60;

export default async function Home() {
  const latestShinies = await getLatestShinies();

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#050805]">
      {/* =====================================================
          BACKGROUND
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
            object-center
            opacity-[0.30]
          "
        />

        {/* Escurece a imagem */}
        <div className="absolute inset-0 bg-[#030603]/70" />

        {/* Glow verde central */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(
              circle_at_50%_20%,
              rgba(132,204,22,0.12),
              transparent_45%
            )]
          "
        />

        {/* Fade inferior */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[55%]
            bg-gradient-to-t
            from-[#050805]
            via-[#050805]/90
            to-transparent
          "
        />

        {/* Vinheta lateral */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(
              ellipse_at_center,
              transparent_20%,
              rgba(0,0,0,0.45)_100%
            )]
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1400px]
          px-5
          sm:px-8
          lg:px-10
        "
      >
        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            flex
            min-h-[390px]
            flex-col
            items-center
            justify-center
            text-center
            pt-8
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
              drop-shadow-[0_0_14px_rgba(163,230,53,0.3)]
            "
          >
            NEVER TAKE BAN
          </p>

          <h1
            className="
              text-5xl
              font-black
              tracking-[-0.04em]
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

          {/* Linha decorativa */}

          <div className="mt-8 flex items-center gap-3">
            <span
              className="
                h-px
                w-14
                bg-gradient-to-r
                from-transparent
                to-lime-400/60
              "
            />

            <span
              className="
                h-1.5
                w-1.5
                rotate-45
                bg-lime-400
                shadow-[0_0_14px_rgba(163,230,53,0.9)]
              "
            />

            <span
              className="
                h-px
                w-14
                bg-gradient-to-l
                from-transparent
                to-lime-400/60
              "
            />
          </div>
        </section>

        {/* =================================================
            POKEMMO INFORMATION
        ================================================= */}

        <section className="pb-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.32em]
                  text-lime-400
                "
              >
                PokeMMO
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-3xl
                "
              >
                Informações do jogo
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Dados e horários atualizados em tempo real.
              </p>
            </div>

            <div
              className="
                hidden
                rounded-full
                border
                border-lime-400/15
                bg-black/30
                px-4
                py-2
                text-[10px]
                font-black
                uppercase
                tracking-[0.15em]
                text-gray-500
                sm:block
              "
            >
              LIVE
            </div>
          </div>

          <AlteringCave />
        </section>

        {/* =================================================
            LATEST SHINIES
        ================================================= */}

        <section className="pb-24">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.32em]
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
                  sm:text-4xl
                "
              >
                Últimos Shinies
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                O shiny mais recente de cada player.
              </p>
            </div>

            <div
              className="
                hidden
                rounded-full
                border
                border-lime-400/15
                bg-black/30
                px-4
                py-2
                text-[10px]
                font-black
                uppercase
                tracking-[0.15em]
                text-gray-500
                sm:block
              "
            >
              {latestShinies.length} PLAYERS
            </div>
          </div>

          <LatestShiniesCarousel shinies={latestShinies} />
        </section>
      </div>
    </main>
  );
}