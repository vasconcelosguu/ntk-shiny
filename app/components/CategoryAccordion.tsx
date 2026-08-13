"use client";

import Link from "next/link";
import { useState } from "react";

type TeamChannel = {
  name: string;
  slug: string;
  description: string;
  icon: string;
};

type TeamCategory = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  channels: TeamChannel[];
};

type Props = {
  category: TeamCategory;
};

export default function CategoryAccordion({
  category,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        open
          ? "border-violet-500/25 bg-[#0b0f1a]"
          : "border-white/[0.07] bg-[#0d111c]"
      }`}
    >
      {/* =========================
          CATEGORY HEADER
      ========================= */}

      <div className="flex items-center gap-4 p-5">
        {/* ÁREA CLICÁVEL */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group flex min-w-0 flex-1 items-center gap-4 text-left"
          aria-expanded={open}
        >
          {/* ÍCONE */}
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-2xl transition ${
              open
                ? "border-violet-500/30 bg-violet-500/10"
                : "border-white/[0.07] bg-white/[0.035]"
            }`}
          >
            {category.icon}
          </div>

          {/* TEXTO */}
          <div className="min-w-0">
            <h2
              className={`text-xl font-black tracking-tight transition ${
                open
                  ? "text-violet-400"
                  : "text-white group-hover:text-violet-400"
              }`}
            >
              {category.name}
            </h2>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              {category.description}
            </p>
          </div>
        </button>

        {/* INFORMAÇÕES / SETA */}
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-xs font-semibold text-gray-500 sm:block">
            {category.channels.length}{" "}
            {category.channels.length === 1
              ? "seção"
              : "seções"}
          </span>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={
              open
                ? `Fechar ${category.name}`
                : `Abrir ${category.name}`
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              open
                ? "border-violet-500/20 bg-violet-500/10 text-violet-400"
                : "border-white/[0.06] bg-white/[0.025] text-gray-500 hover:border-violet-500/20 hover:text-violet-400"
            }`}
          >
            <span
              className={`text-lg transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            >
              ↓
            </span>
          </button>
        </div>
      </div>

      {/* =========================
          CONTEÚDO EXPANDIDO
      ========================= */}

      <div
        className={`grid transition-all duration-300 ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-white/[0.06] px-5 pb-5 pt-4">
            {category.channels.length > 0 ? (
              <>
                {/* SUB-BLOCOS */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {category.channels.map((channel) => (
                    <Link
                      key={channel.slug}
                      href={`/${category.slug}/${channel.slug}`}
                      className="group rounded-xl border border-white/[0.06] bg-[#080b14] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-500/30 hover:bg-[#0d111c]"
                    >
                      <div className="flex items-start gap-3">
                        {/* ÍCONE */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-lg">
                          {channel.icon}
                        </div>

                        {/* TEXTO */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate font-bold text-white transition group-hover:text-violet-400">
                              {channel.name}
                            </h3>

                            <span className="shrink-0 text-gray-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                              →
                            </span>
                          </div>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {channel.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-white/[0.05] pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600 transition group-hover:text-violet-400">
                        Ver estratégias
                      </div>
                    </Link>
                  ))}
                </div>

                {/* BOTÃO PARA A PÁGINA PRINCIPAL DA CATEGORIA */}
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/${category.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2.5 text-xs font-bold text-violet-400 transition hover:border-violet-500/30 hover:bg-violet-500/15"
                  >
                    Abrir {category.name}
                    <span>→</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015] p-6 text-center">
                <div className="text-2xl">
                  {category.icon}
                </div>

                <h3 className="mt-3 font-bold text-white">
                  Área em construção
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Novos conteúdos serão adicionados aqui.
                </p>

                <Link
                  href={`/${category.slug}`}
                  className="mt-4 inline-flex rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2.5 text-xs font-bold text-violet-400 transition hover:bg-violet-500/15"
                >
                  Abrir página →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}