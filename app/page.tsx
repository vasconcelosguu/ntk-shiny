"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { teamCategories } from "../lib/team";
import AlteringCave from "./components/AlteringCave";

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  function toggleCategory(slug: string) {
    setOpenCategory((current) =>
      current === slug ? null : slug
    );
  }

  return (
    <main className="min-h-screen">

      {/* =====================================================
          BANNER
      ===================================================== */}

      <section className="home-banner-section">
        <div className="home-banner">

          <Image
            src="/images/home-banner.jpg"
            alt="neverTakeBan"
            fill
            priority
            sizes="100vw"
            className="home-banner-image"
          />

          <div className="home-banner-overlay" />

        </div>
      </section>

      {/* =====================================================
          ALTERING CAVE
      ===================================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          pt-8
          sm:px-6
        "
      >
        <AlteringCave />
      </section>


      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-12
          sm:px-6
        "
      >

        {/* HEADER */}

        <div className="mb-7">

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-lime-400
            "
          >
            Conteúdo
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-black
              tracking-tight
              text-white
            "
          >
            Áreas do time
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Guias, ferramentas e informações para o PokeMMO.
          </p>

        </div>


        {/* ===================================================
            CATEGORIAS
        =================================================== */}

        <div className="space-y-3">

          {teamCategories.map((category) => {

            const isOpen =
              openCategory === category.slug;

            return (
              <section
                key={category.slug}
                className={[
                  "overflow-hidden rounded-2xl border bg-[#0b0f0b]",
                  "transition-all duration-300 ease-out",

                  isOpen
                    ? "border-lime-400/25 shadow-2xl shadow-lime-950/10"
                    : "border-white/[0.07] hover:border-white/[0.12]",
                ].join(" ")}
              >

                {/* CATEGORY HEADER */}

                <div className="flex items-center">

                  <button
                    type="button"
                    onClick={() =>
                      toggleCategory(category.slug)
                    }
                    className="
                      group
                      flex
                      min-w-0
                      flex-1
                      items-center
                      gap-4
                      p-5
                      text-left
                    "
                  >

                    {/* ICON */}

                    <div
                      className={[
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-2xl",
                        "transition-all duration-300",

                        isOpen
                          ? "scale-105 border-lime-400/30 bg-lime-400/10"
                          : "border-white/[0.07] bg-white/[0.035] group-hover:border-lime-400/20",
                      ].join(" ")}
                    >
                      {category.icon}
                    </div>


                    {/* TEXT */}

                    <div className="min-w-0">

                      <h3
                        className={[
                          "text-lg font-black transition-colors duration-200",

                          isOpen
                            ? "text-lime-400"
                            : "text-white",
                        ].join(" ")}
                      >
                        {category.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          truncate
                          text-sm
                          text-gray-500
                        "
                      >
                        {category.description}
                      </p>

                    </div>

                  </button>


                  {/* RIGHT SIDE */}

                  <div className="flex items-center gap-2 pr-5">

                    {/* OPEN PAGE */}

                    <Link
                      href={`/${category.slug}`}
                      className="
                        hidden
                        rounded-lg
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-gray-500
                        transition
                        hover:border-lime-400/30
                        hover:text-lime-400
                        sm:block
                      "
                    >
                      Abrir
                    </Link>


                    {/* TOGGLE */}

                    <button
                      type="button"
                      aria-label={
                        isOpen
                          ? `Fechar ${category.name}`
                          : `Abrir ${category.name}`
                      }
                      onClick={() =>
                        toggleCategory(category.slug)
                      }
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-lg border",
                        "border-white/[0.07]",
                        "bg-white/[0.025]",
                        "text-gray-500",
                        "transition-all duration-300",
                        "hover:border-lime-400/30",
                        "hover:text-lime-400",

                        isOpen
                          ? "rotate-180"
                          : "rotate-0",
                      ].join(" ")}
                    >
                      ↓
                    </button>

                  </div>

                </div>


                {/* =================================================
                    CHANNELS
                ================================================= */}

                <div
                  className={[
                    "grid transition-[grid-template-rows,opacity]",
                    "duration-500",
                    "ease-[cubic-bezier(0.22,1,0.36,1)]",

                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >

                  <div className="min-h-0 overflow-hidden">

                    <div
                      className={[
                        "border-t border-white/[0.06] p-5",
                        "transition-transform duration-500",
                        "ease-[cubic-bezier(0.22,1,0.36,1)]",

                        isOpen
                          ? "translate-y-0"
                          : "-translate-y-3",
                      ].join(" ")}
                    >

                      {category.channels.length > 0 ? (

                        <div
                          className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-2
                            lg:grid-cols-3
                          "
                        >

                          {category.channels.map((channel) => (

                            <Link
                              key={channel.slug}
                              href={`/${category.slug}/${channel.slug}`}
                              className="
                                group
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-[#070a07]
                                p-4
                                transition-all
                                duration-200
                                hover:-translate-y-1
                                hover:border-lime-400/25
                                hover:bg-[#0b100b]
                                hover:shadow-xl
                                hover:shadow-lime-950/10
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-start
                                  justify-between
                                "
                              >

                                <div
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.025]
                                    text-lg
                                  "
                                >
                                  {channel.icon}
                                </div>

                                <span
                                  className="
                                    text-sm
                                    text-gray-700
                                    transition-all
                                    duration-200
                                    group-hover:translate-x-1
                                    group-hover:text-lime-400
                                  "
                                >
                                  →
                                </span>

                              </div>


                              <h4
                                className="
                                  mt-4
                                  font-bold
                                  text-white
                                "
                              >
                                {channel.name}
                              </h4>


                              <p
                                className="
                                  mt-1
                                  text-xs
                                  leading-5
                                  text-gray-500
                                "
                              >
                                {channel.description}
                              </p>


                              <div
                                className="
                                  mt-4
                                  border-t
                                  border-white/[0.05]
                                  pt-3
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  tracking-[0.15em]
                                  text-gray-700
                                  transition-colors
                                  group-hover:text-lime-400
                                "
                              >
                                Ver conteúdo
                              </div>

                            </Link>

                          ))}

                        </div>

                      ) : (

                        <div
                          className="
                            rounded-xl
                            border
                            border-dashed
                            border-white/[0.07]
                            bg-white/[0.015]
                            p-7
                            text-center
                          "
                        >

                          <div className="text-2xl">
                            🚧
                          </div>

                          <h4
                            className="
                              mt-3
                              font-bold
                              text-white
                            "
                          >
                            Área em construção
                          </h4>

                          <p
                            className="
                              mt-1
                              text-sm
                              text-gray-500
                            "
                          >
                            Novos conteúdos serão adicionados aqui.
                          </p>

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              </section>
            );
          })}


          {/* ===================================================
              MAPAS
              ÁREA INDEPENDENTE
          =================================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-lime-400/15
              bg-[#0b0f0b]
              transition-all
              duration-300
              hover:border-lime-400/30
              hover:shadow-2xl
              hover:shadow-lime-950/10
            "
          >

            <div className="flex items-center">

              <div
                className="
                  flex
                  min-w-0
                  flex-1
                  items-center
                  gap-4
                  p-5
                "
              >

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-lime-400/20
                    bg-lime-400/10
                    text-2xl
                  "
                >
                  🗺️
                </div>

                <div className="min-w-0">

                  <h3 className="text-lg font-black text-white">
                    Mapas
                  </h3>

                  <p
                    className="
                      mt-1
                      truncate
                      text-sm
                      text-gray-500
                    "
                  >
                    Rotas, Pokémon, encontros, métodos, níveis e
                    informações dos mapas do PokeMMO.
                  </p>

                </div>

              </div>


              <div className="pr-5">

                <Link
                  href="/mapas"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-lime-400/20
                    bg-lime-400/[0.06]
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-gray-400
                    transition
                    hover:border-lime-400/40
                    hover:bg-lime-400/10
                    hover:text-lime-400
                  "
                >
                  Abrir
                  <span>→</span>
                </Link>

              </div>

            </div>

          </section>


          {/* ===================================================
              RAIDS
              ÁREA INDEPENDENTE
          =================================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-lime-400/15
              bg-[#0b0f0b]
              transition-all
              duration-300
              hover:border-lime-400/30
              hover:shadow-2xl
              hover:shadow-lime-950/10
            "
          >

            <div className="flex items-center">

              <div
                className="
                  flex
                  min-w-0
                  flex-1
                  items-center
                  gap-4
                  p-5
                "
              >

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-lime-400/20
                    bg-lime-400/10
                    text-2xl
                  "
                >
                  ⚔️
                </div>

                <div className="min-w-0">

                  <h3 className="text-lg font-black text-white">
                    Raids
                  </h3>

                  <p
                    className="
                      mt-1
                      truncate
                      text-sm
                      text-gray-500
                    "
                  >
                    Builds e estratégias para os Raids do PokeMMO.
                  </p>

                </div>

              </div>


              <div className="pr-5">

                <Link
                  href="/raid"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-lime-400/20
                    bg-lime-400/[0.06]
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-gray-400
                    transition
                    hover:border-lime-400/40
                    hover:bg-lime-400/10
                    hover:text-lime-400
                  "
                >
                  Abrir
                  <span>→</span>
                </Link>

              </div>

            </div>

          </section>


          {/* ===================================================
              JOGOS
              SHINY HUNT
              ÁREA INDEPENDENTE
          =================================================== */}

          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-lime-400/15
              bg-[#0b0f0b]
              transition-all
              duration-300
              hover:border-lime-400/30
              hover:shadow-2xl
              hover:shadow-lime-950/10
            "
          >

            <div className="flex items-center">

              <div
                className="
                  flex
                  min-w-0
                  flex-1
                  items-center
                  gap-4
                  p-5
                "
              >

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-lime-400/20
                    bg-lime-400/10
                    text-2xl
                  "
                >
                  🎮
                </div>

                <div className="min-w-0">

                  <h3 className="text-lg font-black text-white">
                    Jogos
                  </h3>

                  <p
                    className="
                      mt-1
                      truncate
                      text-sm
                      text-gray-500
                    "
                  >
                    Pequenos jogos e ferramentas interativas
                    para o time.
                  </p>

                </div>

              </div>


              <div className="pr-5">

                <Link
                  href="/jogos/shiny_hunt"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-lime-400/20
                    bg-lime-400/[0.06]
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-gray-400
                    transition
                    hover:border-lime-400/40
                    hover:bg-lime-400/10
                    hover:text-lime-400
                  "
                >
                  Abrir
                  <span>→</span>
                </Link>

              </div>

            </div>

          </section>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <section
        className="
          border-t
          border-white/[0.06]
          bg-[#080c08]
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-8
            sm:px-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <p className="text-sm font-bold text-white">
                neverTakeBan
              </p>

              <p className="mt-1 text-xs text-gray-600">
                PokeMMO Team
              </p>

            </div>

            <p className="text-xs text-gray-700">
              Guias, estratégias, mapas e informações do time.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}