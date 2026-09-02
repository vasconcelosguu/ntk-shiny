"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ShowcaseShiny = {
  id: string;
  playerId: string;
  username: string;
  pokemon: string;
  displayName: string;
  pokemonId: number | null;
  encounters: number | null;
  caughtAt: string | null;
};

type Props = {
  shinies: ShowcaseShiny[];
};

function getSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${id}.png`;
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "Data não registrada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data não registrada";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function formatEncounters(
  value: number | null
) {
  if (value == null) {
    return "—";
  }

  return new Intl.NumberFormat(
    "pt-BR"
  ).format(value);
}

export default function ShinyShowcase({
  shinies,
}: Props) {
  const [player, setPlayer] =
    useState("Todos");

  const players = useMemo(() => {
    return Array.from(
      new Set(
        shinies.map(
          (shiny) =>
            shiny.username
        )
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [shinies]);

  const filtered = useMemo(() => {
    if (player === "Todos") {
      return shinies;
    }

    return shinies.filter(
      (shiny) =>
        shiny.username === player
    );
  }, [shinies, player]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:py-16">
      {/* FILTER */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-700">
            Coleção
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Shinies capturados
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Os registros mais recentes aparecem
            primeiro.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              setPlayer("Todos")
            }
            className={[
              "rounded-xl border px-4 py-2.5 text-xs font-black transition",
              player === "Todos"
                ? "border-lime-400/30 bg-lime-400/10 text-lime-400"
                : "border-white/[0.07] bg-white/[0.02] text-gray-600 hover:text-white",
            ].join(" ")}
          >
            Todos
          </button>

          {players.map(
            (username) => (
              <button
                key={username}
                onClick={() =>
                  setPlayer(username)
                }
                className={[
                  "rounded-xl border px-4 py-2.5 text-xs font-black transition",
                  player === username
                    ? "border-lime-400/30 bg-lime-400/10 text-lime-400"
                    : "border-white/[0.07] bg-white/[0.02] text-gray-600 hover:text-white",
                ].join(" ")}
              >
                {username}
              </button>
            )
          )}
        </div>
      </div>

      {/* LIST */}

      <div className="space-y-3">
        {filtered.map(
          (shiny, index) => (
            <article
              key={shiny.id}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.07]
                bg-[#080c08]
                transition
                hover:border-lime-400/25
                hover:bg-[#0a0f0a]
              "
            >
              <div
                className="
                  absolute
                  left-0
                  top-0
                  h-full
                  w-[2px]
                  bg-lime-400
                  opacity-0
                  transition
                  group-hover:opacity-100
                "
              />

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  p-5
                  sm:flex-row
                  sm:items-center
                "
              >
                {/* NUMBER */}

                <div className="hidden w-8 shrink-0 text-center sm:block">
                  <span className="text-[10px] font-black text-gray-700">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </span>
                </div>

                {/* SPRITE */}

                <div
                  className="
                    flex
                    h-28
                    w-28
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-lime-400/10
                    bg-black/30
                  "
                >
                  {shiny.pokemonId ? (
                    <Image
                      src={getSpriteUrl(
                        shiny.pokemonId
                      )}
                      alt={shiny.displayName}
                      width={105}
                      height={105}
                      className="
                        h-24
                        w-24
                        object-contain
                        transition
                        group-hover:scale-110
                      "
                    />
                  ) : (
                    <span className="text-4xl">
                      ✨
                    </span>
                  )}
                </div>

                {/* INFO */}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black text-white">
                      {shiny.displayName}
                    </h3>

                    <span
                      className="
                        rounded-md
                        border
                        border-lime-400/20
                        bg-lime-400/[0.06]
                        px-2
                        py-1
                        text-[8px]
                        font-black
                        uppercase
                        tracking-wider
                        text-lime-400
                      "
                    >
                      SHINY
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-gray-700">
                        Player
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-300">
                        {shiny.username}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-gray-700">
                        Capturado
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-300">
                        {formatDate(
                          shiny.caughtAt
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] font-black uppercase tracking-wider text-gray-700">
                        Encounters
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-300">
                        {formatEncounters(
                          shiny.encounters
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        )}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/[0.08] px-6 py-16 text-center">
          <p className="text-sm font-bold text-gray-600">
            Nenhum shiny encontrado.
          </p>
        </div>
      )}
    </section>
  );
}