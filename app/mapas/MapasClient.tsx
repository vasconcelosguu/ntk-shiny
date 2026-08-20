"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import type {
  MapEncounter,
  MapRegion,
  MapLocation,
} from "../../lib/maps";

import {
  encounterMatchesSeason,
} from "../../lib/maps";

/* =========================================================
   TYPES
========================================================= */

type Statistics = {
  regions: number;
  locations: number;
  encounters: number;
  pokemon: number;
  horde3x?: number;
  horde5x?: number;
};

type Props = {
  regions: MapRegion[];
  statistics: Statistics;
};

/* =========================================================
   CONSTANTS
========================================================= */

const SEASONS = [
  {
    id: "all",
    label: "Todas",
    icon: "🌎",
  },
  {
    id: "Spring",
    label: "Primavera",
    icon: "🌸",
  },
  {
    id: "Summer",
    label: "Verão",
    icon: "☀️",
  },
  {
    id: "Autumn",
    label: "Outono",
    icon: "🍂",
  },
  {
    id: "Winter",
    label: "Inverno",
    icon: "❄️",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function methodIcon(
  method: string
) {
  const value =
    method.toLowerCase();

  if (
    value.includes("grass")
  ) {
    return "🌿";
  }

  if (
    value.includes("water") ||
    value.includes("surf")
  ) {
    return "🌊";
  }

  if (
    value.includes("rod") ||
    value.includes("fish")
  ) {
    return "🎣";
  }

  if (
    value.includes("cave") ||
    value.includes("inside")
  ) {
    return "🪨";
  }

  if (
    value.includes("honey")
  ) {
    return "🍯";
  }

  if (
    value.includes("headbutt")
  ) {
    return "🌳";
  }

  if (
    value.includes("sweet")
  ) {
    return "🍯";
  }

  return "✨";
}

function methodDescription(
  method: string
) {
  const value =
    method.toLowerCase();

  if (
    value.includes("grass")
  ) {
    return "Encontros na grama";
  }

  if (
    value.includes("water") ||
    value.includes("surf")
  ) {
    return "Encontros através de Surf";
  }

  if (
    value.includes("rod") ||
    value.includes("fish")
  ) {
    return "Encontros através de pesca";
  }

  if (
    value.includes("cave") ||
    value.includes("inside")
  ) {
    return "Encontros em áreas internas";
  }

  if (
    value.includes("honey")
  ) {
    return "Encontros através de Honey";
  }

  if (
    value.includes("headbutt")
  ) {
    return "Encontros através de Headbutt";
  }

  if (
    value.includes("sweet")
  ) {
    return "Encontros através de Sweet Scent";
  }

  return "Método de encontro";
}

function seasonData(
  season: string
) {
  const normalized =
    season.toLowerCase();

  if (
    normalized === "spring"
  ) {
    return {
      label: "Primavera",
      icon: "🌸",
    };
  }

  if (
    normalized === "summer"
  ) {
    return {
      label: "Verão",
      icon: "☀️",
    };
  }

  if (
    normalized === "autumn"
  ) {
    return {
      label: "Outono",
      icon: "🍂",
    };
  }

  if (
    normalized === "winter"
  ) {
    return {
      label: "Inverno",
      icon: "❄️",
    };
  }

  return {
    label: "Todas",
    icon: "🌎",
  };
}

function formatLevel(
  encounter: MapEncounter
) {
  const min =
    encounter.minLevel;

  const max =
    encounter.maxLevel;

  if (
    min !== null &&
    max !== null
  ) {
    if (min === max) {
      return `Lv. ${min}`;
    }

    return `Lv. ${min}–${max}`;
  }

  if (min !== null) {
    return `Lv. ${min}+`;
  }

  if (max !== null) {
    return `Até Lv. ${max}`;
  }

  return "Nível ?";
}

function spriteUrl(
  pokemonId: number
) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
}

/* =========================================================
   HORDE
========================================================= */

function HordeBadge({
  encounter,
}: {
  encounter: MapEncounter;
}) {
  if (
    encounter.isHorde5x
  ) {
    return (
      <span
        className="
          rounded-lg
          border
          border-red-400/20
          bg-red-400/10
          px-2
          py-1
          text-[9px]
          font-black
          uppercase
          tracking-wider
          text-red-400
        "
      >
        5× Horde
      </span>
    );
  }

  if (
    encounter.isHorde3x
  ) {
    return (
      <span
        className="
          rounded-lg
          border
          border-orange-400/20
          bg-orange-400/10
          px-2
          py-1
          text-[9px]
          font-black
          uppercase
          tracking-wider
          text-orange-400
        "
      >
        3× Horde
      </span>
    );
  }

  return (
    <span
      className="
        rounded-lg
        border
        border-white/[0.06]
        bg-white/[0.025]
        px-2
        py-1
        text-[9px]
        font-black
        uppercase
        tracking-wider
        text-gray-600
      "
    >
      Normal
    </span>
  );
}

/* =========================================================
   RARITY
========================================================= */

function RarityBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const unavailable =
    value === "--" ||
    value === "???";

  return (
    <div
      className="
        min-w-0
        rounded-lg
        border
        border-white/[0.05]
        bg-white/[0.02]
        px-2.5
        py-2
      "
    >
      <p
        className="
          text-[8px]
          font-black
          uppercase
          tracking-[0.14em]
          text-gray-700
        "
      >
        {label}
      </p>

      <p
        className={[
          "mt-0.5 text-xs font-black",
          unavailable
            ? "text-gray-700"
            : "text-lime-400",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   POKEMON CARD
========================================================= */

function PokemonCard({
  encounter,
}: {
  encounter: MapEncounter;
}) {
  const season =
    seasonData(
      encounter.season
    );

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-white/[0.06]
        bg-[#0b0f0b]
        p-4
        transition
        duration-200
        hover:border-lime-400/20
        hover:bg-[#0d120d]
      "
    >
      {/* TOP */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            min-w-0
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
              bg-white/[0.025]
            "
          >
            <img
              src={spriteUrl(
                encounter.pokemonId
              )}
              alt={encounter.pokemon}
              width={48}
              height={48}
              loading="lazy"
              className="
                h-12
                w-12
                object-contain
                [image-rendering:auto]
              "
            />
          </div>

          <div
            className="
              min-w-0
            "
          >
            <h4
              className="
                truncate
                text-sm
                font-black
                text-white
              "
            >
              {encounter.pokemon}
            </h4>

            <p
              className="
                mt-0.5
                text-[10px]
                text-gray-600
              "
            >
              {formatLevel(
                encounter
              )}
            </p>
          </div>
        </div>

        <HordeBadge
          encounter={encounter}
        />
      </div>

      {/* DETAILS */}

      <div
        className="
          mt-4
          flex
          flex-wrap
          gap-1.5
        "
      >
        <span
          className="
            rounded-lg
            border
            border-lime-400/10
            bg-lime-400/[0.045]
            px-2
            py-1
            text-[9px]
            font-bold
            text-lime-400
          "
        >
          {methodIcon(
            encounter.method
          )}{" "}
          {encounter.method}
        </span>

        <span
          className="
            rounded-lg
            border
            border-white/[0.05]
            bg-white/[0.02]
            px-2
            py-1
            text-[9px]
            font-bold
            text-gray-500
          "
        >
          {season.icon}{" "}
          {season.label}
        </span>
      </div>

      {/* RARITIES */}

      <div
        className="
          mt-3
          grid
          grid-cols-3
          gap-1.5
        "
      >
        <RarityBox
          label="Manhã"
          value={
            encounter.rarityMorning
          }
        />

        <RarityBox
          label="Dia"
          value={
            encounter.rarityDay
          }
        />

        <RarityBox
          label="Noite"
          value={
            encounter.rarityNight
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   METHOD SECTION
========================================================= */

function MethodSection({
  method,
  encounters,
}: {
  method: string;
  encounters: MapEncounter[];
}) {
  return (
    <section>
      {/* HEADER */}

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          border-b
          border-white/[0.05]
          pb-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-lime-400/10
              bg-lime-400/[0.04]
            "
          >
            {methodIcon(
              method
            )}
          </div>

          <div>
            <p
              className="
                text-[11px]
                font-black
                uppercase
                tracking-[0.15em]
                text-white
              "
            >
              {method}
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                text-gray-700
              "
            >
              {methodDescription(
                method
              )}
            </p>
          </div>
        </div>

        <span
          className="
            rounded-full
            border
            border-white/[0.05]
            bg-white/[0.02]
            px-2.5
            py-1
            text-[9px]
            font-black
            text-gray-600
          "
        >
          {encounters.length}
        </span>
      </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          gap-2
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {encounters.map(
          (encounter, index) => (
            <PokemonCard
              key={[
                encounter.pokemonId,
                encounter.form,
                encounter.locationId,
                encounter.method,
                encounter.season,
                encounter.minLevel,
                encounter.maxLevel,
                encounter.isHorde3x,
                encounter.isHorde5x,
                index,
              ].join("-")}
              encounter={
                encounter
              }
            />
          )
        )}
      </div>
    </section>
  );
}

/* =========================================================
   LOCATION DROPDOWN
========================================================= */

function LocationDropdown({
  location,
  season,
}: {
  location: MapLocation;
  season: string;
}) {
  const [open, setOpen] =
    useState(false);

  const filteredEncounters =
    useMemo(() => {
      return location.encounters.filter(
        (encounter) =>
          encounterMatchesSeason(
            encounter,
            season
          )
      );
    }, [
      location.encounters,
      season,
    ]);

  const methods =
    useMemo(() => {
      const grouped =
        new Map<
          string,
          MapEncounter[]
        >();

      for (
        const encounter of
          filteredEncounters
      ) {
        const existing =
          grouped.get(
            encounter.method
          ) ?? [];

        existing.push(
          encounter
        );

        grouped.set(
          encounter.method,
          existing
        );
      }

      return Array.from(
        grouped.entries()
      );
    }, [
      filteredEncounters,
    ]);

  const uniquePokemon =
    new Set(
      filteredEncounters.map(
        (encounter) =>
          encounter.pokemonId
      )
    ).size;

  const horde3x =
    filteredEncounters.filter(
      (encounter) =>
        encounter.isHorde3x
    ).length;

  const horde5x =
    filteredEncounters.filter(
      (encounter) =>
        encounter.isHorde5x
    ).length;

  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.07]
        bg-[#0a0e0a]
        shadow-[0_10px_40px_rgba(0,0,0,0.12)]
      "
    >
      {/* HEADER */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) =>
              !value
          )
        }
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          px-5
          py-4
          text-left
          transition
          hover:bg-white/[0.02]
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-4
          "
        >
          {/* PLUS */}

          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition",
              open
                ? "border-lime-400/20 bg-lime-400/10 text-lime-400"
                : "border-white/[0.06] bg-white/[0.025] text-gray-500",
            ].join(" ")}
          >
            {open
              ? "−"
              : "+"}
          </div>

          {/* NAME */}

          <div
            className="
              min-w-0
            "
          >
            <h3
              className="
                truncate
                text-base
                font-black
                text-white
                sm:text-lg
              "
            >
              {location.name}
            </h3>

            <div
              className="
                mt-1
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-gray-600
                "
              >
                {uniquePokemon} Pokémon
              </span>

              <span className="text-gray-800">
                •
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-gray-600
                "
              >
                {methods.length} métodos
              </span>

              {horde3x >
                0 && (
                <>
                  <span className="text-gray-800">
                    •
                  </span>

                  <span
                    className="
                      text-[9px]
                      font-bold
                      text-orange-400
                    "
                  >
                    {horde3x} 3×
                  </span>
                </>
              )}

              {horde5x >
                0 && (
                <>
                  <span className="text-gray-800">
                    •
                  </span>

                  <span
                    className="
                      text-[9px]
                      font-bold
                      text-red-400
                    "
                  >
                    {horde5x} 5×
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FULL NAME */}

        <span
          className="
            hidden
            max-w-[260px]
            truncate
            rounded-lg
            border
            border-white/[0.05]
            bg-white/[0.02]
            px-3
            py-1.5
            text-[9px]
            font-black
            uppercase
            tracking-wider
            text-gray-700
            lg:block
          "
        >
          {location.fullName}
        </span>
      </button>

      {/* CONTENT */}

      {open && (
        <div
          className="
            border-t
            border-white/[0.05]
            bg-[#080c08]
            px-4
            py-5
            sm:px-5
          "
        >
          {methods.length ===
          0 ? (
            <div
              className="
                rounded-xl
                border
                border-dashed
                border-white/[0.06]
                py-10
                text-center
              "
            >
              <p
                className="
                  text-sm
                  font-bold
                  text-gray-500
                "
              >
                Nenhum Pokémon
                encontrado.
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-700
                "
              >
                Não existem
                encontros registrados
                para esta estação.
              </p>
            </div>
          ) : (
            <div
              className="
                space-y-8
              "
            >
              {methods.map(
                ([
                  method,
                  encounters,
                ]) => (
                  <MethodSection
                    key={
                      method
                    }
                    method={
                      method
                    }
                    encounters={
                      encounters
                    }
                  />
                )
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* =========================================================
   PAGE CONTENT
========================================================= */

function RegionContent({
  region,
  season,
}: {
  region: MapRegion;
  season: string;
}) {
  return (
    <div
      className="
        space-y-3
      "
    >
      {region.locations.map(
        (location) => (
          <LocationDropdown
            key={
              String(
                location.id
              )
            }
            location={
              location
            }
            season={
              season
            }
          />
        )
      )}
    </div>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/[0.06]
        bg-white/[0.02]
        px-4
        py-3
      "
    >
      <p
        className="
          text-[9px]
          font-bold
          uppercase
          tracking-[0.14em]
          text-gray-600
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-2xl
          font-black
          text-white
        "
      >
        {value.toLocaleString(
          "pt-BR"
        )}
      </p>
    </div>
  );
}

/* =========================================================
   SEASON BUTTON
========================================================= */

function SeasonButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={[
        "rounded-xl border px-3.5 py-2 text-[10px] font-black transition-all",

        active
          ? "border-lime-400/25 bg-lime-400/10 text-lime-400"
          : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-lime-400/15 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function MapasClient({
  regions,
  statistics,
}: Props) {
  const [
    activeRegion,
    setActiveRegion,
  ] = useState(
    regions.length > 0
      ? String(
          regions[0].id
        )
      : ""
  );

  const [
    selectedSeason,
    setSelectedSeason,
  ] = useState("all");

  const activeRegionData =
    regions.find(
      (region) =>
        String(region.id) ===
        activeRegion
    ) ?? regions[0];

  function changeRegion(
    id: string
  ) {
    setActiveRegion(id);
    setSelectedSeason(
      "all"
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#070a07]
        text-white
      "
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          border-b
          border-white/[0.06]
          bg-gradient-to-b
          from-lime-950/20
          via-[#080b08]
          to-[#070a07]
        "
      >
        <div
          className="
            mx-auto
            max-w-[1400px]
            px-5
            pb-10
            pt-10
            sm:px-6
            lg:px-8
            lg:pb-12
            lg:pt-14
          "
        >
          <Link
            href="/"
            className="
              text-sm
              font-medium
              text-gray-600
              transition
              hover:text-lime-400
            "
          >
            ← Voltar para início
          </Link>

          <div
            className="
              mt-8
              flex
              flex-col
              gap-6
              xl:flex-row
              xl:items-end
              xl:justify-between
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.25em]
                  text-lime-400
                "
              >
                PokeMMO Database
              </p>

              <h1
                className="
                  mt-2
                  text-4xl
                  font-black
                  tracking-[-0.03em]
                  text-white
                  sm:text-5xl
                "
              >
                Mapas
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Consulte rotas,
                cidades,
                cavernas e
                todos os Pokémon
                encontrados em
                cada região.
              </p>
            </div>

            {/* STATS */}

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-4
              "
            >
              <Stat
                label="Regiões"
                value={
                  statistics.regions
                }
              />

              <Stat
                label="Locais"
                value={
                  statistics.locations
                }
              />

              <Stat
                label="Pokémon"
                value={
                  statistics.pokemon
                }
              />

              <Stat
                label="Encontros"
                value={
                  statistics.encounters
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          REGIONS
      ===================================================== */}

      <div
        className="
          sticky
          top-0
          z-30
          border-b
          border-white/[0.06]
          bg-[#070a07]/95
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            max-w-[1400px]
            overflow-x-auto
            px-5
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              flex
              min-w-max
              gap-1
              py-2
            "
          >
            {regions.map(
              (region) => {
                const active =
                  String(
                    region.id
                  ) ===
                  activeRegion;

                return (
                  <button
                    key={String(
                      region.id
                    )}
                    type="button"
                    onClick={() =>
                      changeRegion(
                        String(
                          region.id
                        )
                      )
                    }
                    className={[
                      "rounded-xl px-5 py-3 text-[11px] font-black transition-all",

                      active
                        ? "bg-lime-400 text-black shadow-[0_0_20px_rgba(163,230,53,0.12)]"
                        : "text-gray-600 hover:bg-white/[0.035] hover:text-white",
                    ].join(" ")}
                  >
                    {region.name}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section
        className="
          mx-auto
          max-w-[1400px]
          px-5
          py-8
          sm:px-6
          lg:px-8
          lg:py-10
        "
      >
        {!activeRegionData ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-white/[0.08]
              px-6
              py-16
              text-center
            "
          >
            <p className="font-bold">
              Nenhum mapa encontrado.
            </p>
          </div>
        ) : (
          <>
            {/* REGION HEADER */}

            <div
              className="
                mb-7
                flex
                flex-col
                gap-5
                border-b
                border-white/[0.06]
                pb-6
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.22em]
                    text-lime-400
                  "
                >
                  Região selecionada
                </p>

                <h2
                  className="
                    mt-1
                    text-3xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  {
                    activeRegionData.name
                  }
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-600
                  "
                >
                  {
                    activeRegionData
                      .locations
                      .length
                  }{" "}
                  locais disponíveis
                </p>
              </div>

              {/* SEASON */}

              <div>
                <p
                  className="
                    mb-2
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-gray-600
                  "
                >
                  Filtrar por estação
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-1.5
                  "
                >
                  {SEASONS.map(
                    (season) => (
                      <SeasonButton
                        key={
                          season.id
                        }
                        active={
                          selectedSeason ===
                          season.id
                        }
                        onClick={() =>
                          setSelectedSeason(
                            season.id
                          )
                        }
                      >
                        {
                          season.icon
                        }{" "}
                        {
                          season.label
                        }
                      </SeasonButton>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* LOCATIONS */}

            <RegionContent
              region={
                activeRegionData
              }
              season={
                selectedSeason
              }
            />
          </>
        )}
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          mt-10
          border-t
          border-white/[0.06]
          bg-[#060806]
        "
      >
        <div
          className="
            mx-auto
            max-w-[1400px]
            px-5
            py-8
            sm:px-6
            lg:px-8
          "
        >
          <p
            className="
              text-sm
              font-bold
              text-white
            "
          >
            neverTakeBan
          </p>

          <p
            className="
              mt-1
              text-xs
              text-gray-600
            "
          >
            Banco de mapas e
            encontros do
            PokeMMO.
          </p>
        </div>
      </footer>
    </main>
  );
}