"use client";

import Link from "next/link";
import { useState } from "react";
import { teamCategories } from "../lib/team";

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  function toggleCategory(slug: string) {
    setOpenCategory((current) =>
      current === slug ? null : slug
    );
  }

  return (
    <main className="min-h-screen">

      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(124,58,237,0.14),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              PokeMMO • Team Portal
            </div>

            <h1 className="text-5xl font-black tracking-[-0.045em] text-white md:text-6xl">
              neverTakeBan
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
              Central de estratégias, guias, builds e informações
              utilizadas pelo time no PokeMMO.
            </p>

          </div>

        </div>
      </section>

      {/* =========================
          CATEGORIAS
      ========================= */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">

        <div className="mb-7">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
            Conteúdo
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
            Áreas do time
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Clique em uma categoria para visualizar suas áreas.
          </p>

        </div>

        <div className="space-y-3">

          {teamCategories.map((category) => {
            const isOpen =
              openCategory === category.slug;

            return (
              <section
                key={category.slug}
                className={[
                  "overflow-hidden rounded-2xl border bg-[#0d111c]",
                  "transition-all duration-300 ease-out",
                  isOpen
                    ? "border-violet-500/25 shadow-2xl shadow-violet-950/10"
                    : "border-white/[0.07] hover:border-white/[0.12]",
                ].join(" ")}
              >

                {/* =========================
                    CATEGORY BUTTON
                ========================= */}

                <div className="flex items-center">

                  <button
                    type="button"
                    onClick={() =>
                      toggleCategory(category.slug)
                    }
                    className="group flex min-w-0 flex-1 items-center gap-4 p-5 text-left"
                  >

                    {/* ICON */}

                    <div
                      className={[
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-2xl",
                        "transition-all duration-300",
                        isOpen
                          ? "border-violet-500/30 bg-violet-500/10 scale-105"
                          : "border-white/[0.07] bg-white/[0.035] group-hover:border-violet-500/20",
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
                            ? "text-violet-400"
                            : "text-white",
                        ].join(" ")}
                      >
                        {category.name}
                      </h3>

                      <p className="mt-1 truncate text-sm text-gray-500">
                        {category.description}
                      </p>

                    </div>

                  </button>

                  {/* =========================
                      RIGHT SIDE
                  ========================= */}

                  <div className="flex items-center gap-2 pr-5">

                    {/* ABRIR PÁGINA */}

                    <Link
                      href={`/${category.slug}`}
                      className="hidden rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs font-bold text-gray-500 transition hover:border-violet-500/30 hover:text-violet-400 sm:block"
                    >
                      Abrir
                    </Link>

                    {/* ARROW */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleCategory(category.slug)
                      }
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-lg border",
                        "border-white/[0.07] bg-white/[0.025]",
                        "text-gray-500 transition-all duration-300",
                        "hover:border-violet-500/30 hover:text-violet-400",
                        isOpen
                          ? "rotate-180"
                          : "rotate-0",
                      ].join(" ")}
                    >
                      ↓
                    </button>

                  </div>

                </div>

                {/* =========================
                    ANIMATED POPUP
                ========================= */}

                <div
                  className={[
                    "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
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

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                          {category.channels.map(
                            (channel) => (
                              <Link
                                key={channel.slug}
                                href={`/${category.slug}/${channel.slug}`}
                                className="group rounded-xl border border-white/[0.06] bg-[#080b14] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/25 hover:bg-[#0b0f1a] hover:shadow-xl hover:shadow-violet-950/10"
                              >

                                <div className="flex items-start justify-between">

                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-lg">
                                    {channel.icon}
                                  </div>

                                  <span className="text-sm text-gray-700 transition-all duration-200 group-hover:translate-x-1 group-hover:text-violet-400">
                                    →
                                  </span>

                                </div>

                                <h4 className="mt-4 font-bold text-white">
                                  {channel.name}
                                </h4>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                  {channel.description}
                                </p>

                                <div className="mt-4 border-t border-white/[0.05] pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-700 transition-colors group-hover:text-violet-400">
                                  Ver estratégia
                                </div>

                              </Link>
                            )
                          )}

                        </div>

                      ) : (

                        <div className="rounded-xl border border-dashed border-white/[0.07] bg-white/[0.015] p-7 text-center">

                          <div className="text-2xl">
                            🚧
                          </div>

                          <h4 className="mt-3 font-bold text-white">
                            Área em construção
                          </h4>

                          <p className="mt-1 text-sm text-gray-500">
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

        </div>

      </section>

    </main>
  );
}