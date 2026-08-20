"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";

import type {
  MapEncounter,
  MapRegion,
  MapLocation,
} from "../../lib/maps";

/* =========================================================
   TYPES
========================================================= */

type Statistics = {
  regions: number;
  locations: number;
  encounters: number;
  pokemon: number;
};

type Props = {
  regions: MapRegion[];
  statistics: Statistics;
};

type EncounterFilter =
  | "single"
  | "horde3"
  | "horde5";

type ExtendedEncounter = MapEncounter & {
  rarityMorning?: string;
  rarityDay?: string;
  rarityNight?: string;

  isHorde3x?: boolean;
  isHorde5x?: boolean;

  // Compatibilidade caso o lib/maps ainda entregue
  // os nomes originais do JSON.
  rarity_morning?: string;
  rarity_day?: string;
  rarity_night?: string;

  is_horde_3x?: boolean;
  is_horde_5x?: boolean;
};

/* =========================================================
   DATA HELPERS
========================================================= */

/**
 * Converte MapEncounter para a estrutura de dados que
 * precisamos sem depender exclusivamente da nomenclatura
 * usada no lib/maps.ts.
 */
function asExtendedEncounter(
  encounter: MapEncounter
): ExtendedEncounter {
  return encounter as ExtendedEncounter;
}

function getRarity(
  encounter: MapEncounter,
  period: "morning" | "day" | "night"
) {
  const data = asExtendedEncounter(encounter);

  if (period === "morning") {
    return (
      data.rarityMorning ??
      data.rarity_morning ??
      "--"
    );
  }

  if (period === "day") {
    return (
      data.rarityDay ??
      data.rarity_day ??
      "--"
    );
  }

  return (
    data.rarityNight ??
    data.rarity_night ??
    "--"
  );
}

function isHorde3(encounter: MapEncounter) {
  const data = asExtendedEncounter(encounter);

  return (
    data.isHorde3x === true ||
    data.is_horde_3x === true
  );
}

function isHorde5(encounter: MapEncounter) {
  const data = asExtendedEncounter(encounter);

  return (
    data.isHorde5x === true ||
    data.is_horde_5x === true
  );
}

function isSingle(encounter: MapEncounter) {
  return (
    !isHorde3(encounter) &&
    !isHorde5(encounter)
  );
}

/* =========================================================
   METHOD
========================================================= */

function getMethodIcon(method: string) {
  const normalized = method
    .toLowerCase()
    .trim();

  if (
    normalized.includes("sweet scent") ||
    normalized.includes("sweet_scent")
  ) {
    return "🌿";
  }

  if (normalized.includes("lure")) {
    return "🪝";
  }

  if (
    normalized.includes("grass") ||
    normalized.includes("route") ||
    normalized.includes("campo")
  ) {
    return "🌿";
  }

  if (
    normalized.includes("surf") ||
    normalized.includes("water")
  ) {
    return "🌊";
  }

  if (
    normalized.includes("fish") ||
    normalized.includes("fishing")
  ) {
    return "🎣";
  }

  if (
    normalized.includes("cave") ||
    normalized.includes("rock")
  ) {
    return "🪨";
  }

  if (normalized.includes("honey")) {
    return "🍯";
  }

  if (normalized.includes("headbutt")) {
    return "🌳";
  }

  return "✨";
}

function getMethodDescription(method: string) {
  const normalized = method
    .toLowerCase()
    .trim();

  if (
    normalized.includes("sweet scent") ||
    normalized.includes("sweet_scent")
  ) {
    return "Encontros utilizando Sweet Scent";
  }

  if (normalized.includes("lure")) {
    return "Encontros utilizando Lure";
  }

  if (
    normalized.includes("grass") ||
    normalized.includes("route") ||
    normalized.includes("campo")
  ) {
    return "Encontros em áreas de grama";
  }

  if (
    normalized.includes("surf") ||
    normalized.includes("water")
  ) {
    return "Pokémon encontrados surfando";
  }

  if (
    normalized.includes("fish") ||
    normalized.includes("fishing")
  ) {
    return "Encontros através da pesca";
  }

  if (
    normalized.includes("cave") ||
    normalized.includes("rock")
  ) {
    return "Encontros em cavernas e áreas rochosas";
  }

  if (normalized.includes("honey")) {
    return "Encontros através de Honey";
  }

  if (normalized.includes("headbutt")) {
    return "Encontros usando Headbutt";
  }

  return "Método de encontro";
}

/* =========================================================
   SEASON
========================================================= */

function formatSeason(season: string) {
  const normalized = season
    .toLowerCase()
    .trim();

  if (
    normalized.includes("spring") ||
    normalized.includes("primavera")
  ) {
    return {
      label: "Primavera",
      icon: "🌸",
    };
  }

  if (
    normalized.includes("summer") ||
    normalized.includes("verão") ||
    normalized.includes("verao")
  ) {
    return {
      label: "Verão",
      icon: "☀️",
    };
  }

  if (
    normalized.includes("autumn") ||
    normalized.includes("fall") ||
    normalized.includes("outono")
  ) {
    return {
      label: "Outono",
      icon: "🍂",
    };
  }

  if (
    normalized.includes("winter") ||
    normalized.includes("inverno")
  ) {
    return {
      label: "Inverno",
      icon: "❄️",
    };
  }

  if (
    normalized === "all" ||
    normalized === "any"
  ) {
    return {
      label: "Todas",
      icon: "◉",
    };
  }

  return {
    label: season,
    icon: "◉",
  };
}

/**
 * Importante:
 *
 * Alguns registros usam "All" / "Any".
 * Esses registros devem aparecer quando uma
 * estação específica estiver selecionada.
 */
function matchesSeason(
  encounterSeason: string | undefined,
  selectedSeason: string
) {
  if (selectedSeason === "all") {
    return true;
  }

  if (!encounterSeason) {
    return false;
  }

  const encounterNormalized =
    encounterSeason
      .toLowerCase()
      .trim();

  const selectedNormalized =
    selectedSeason
      .toLowerCase()
      .trim();

  if (
    encounterNormalized === "all" ||
    encounterNormalized === "any"
  ) {
    return true;
  }

  return (
    encounterNormalized ===
    selectedNormalized
  );
}

function getSeasons(
  locations: MapLocation[]
) {
  const seasons = new Map<
    string,
    string
  >();

  for (const location of locations) {
    for (const encounter of location.encounters) {
      const season = encounter.season;

      if (!season) {
        continue;
      }

      const normalized =
        season.toLowerCase().trim();

      if (
        normalized === "all" ||
        normalized === "any"
      ) {
        continue;
      }

      if (!seasons.has(normalized)) {
        seasons.set(
          normalized,
          season
        );
      }
    }
  }

  const preferredOrder = [
    "spring",
    "summer",
    "autumn",
    "fall",
    "winter",
  ];

  return Array.from(
    seasons.entries()
  )
    .sort((a, b) => {
      const aIndex =
        preferredOrder.indexOf(a[0]);

      const bIndex =
        preferredOrder.indexOf(b[0]);

      if (
        aIndex === -1 &&
        bIndex === -1
      ) {
        return a[1].localeCompare(
          b[1]
        );
      }

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    })
    .map(
      ([, original]) => original
    );
}

/* =========================================================
   POKEMON SPRITE
========================================================= */

function getPokemonSprite(
  pokemonId?: number
) {
  if (
    typeof pokemonId !== "number" ||
    pokemonId <= 0
  ) {
    return null;
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
}

/* =========================================================
   LEVEL
========================================================= */

function formatLevel(
  encounter: MapEncounter
) {
  const min = encounter.minLevel;
  const max = encounter.maxLevel;

  if (
    typeof min === "number" &&
    typeof max === "number"
  ) {
    if (min === max) {
      return `Lv. ${min}`;
    }

    return `Lv. ${min}–${max}`;
  }

  if (typeof min === "number") {
    return `Lv. ${min}+`;
  }

  if (typeof max === "number") {
    return `Até Lv. ${max}`;
  }

  return "Nível desconhecido";
}

/* =========================================================
   ENCOUNTER TYPE
========================================================= */

function getEncounterType(
  encounter: MapEncounter
) {
  if (isHorde3(encounter)) {
    return {
      label: "Horde ×3",
      icon: "👥",
    };
  }

  if (isHorde5(encounter)) {
    return {
      label: "Horde ×5",
      icon: "👥",
    };
  }

  return {
    label: "Single",
    icon: "●",
  };
}

/* =========================================================
   POKEMON CARD
========================================================= */

function PokemonCard({
  encounter,
}: {
  encounter: MapEncounter;
}) {
  const sprite = getPokemonSprite(
    encounter.pokemonId
  );

  const type =
    getEncounterType(encounter);

  const rarityMorning =
    getRarity(
      encounter,
      "morning"
    );

  const rarityDay =
    getRarity(
      encounter,
      "day"
    );

  const rarityNight =
    getRarity(
      encounter,
      "night"
    );

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.055]
        bg-[#0d120d]
        p-3
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:border-lime-400/20
        hover:bg-[#101610]
      "
    >
      <div className="flex gap-3">

        {/* SPRITE */}

        <div
          className="
            flex
            h-[72px]
            w-[72px]
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#080c08]
            ring-1
            ring-white/[0.04]
          "
        >
          {sprite ? (
            <img
              src={sprite}
              alt={encounter.pokemon}
              className="
                h-[64px]
                w-[64px]
                object-contain
                [image-rendering:pixelated]
                transition-transform
                duration-200
                group-hover:scale-110
              "
            />
          ) : (
            <span className="text-xl text-gray-700">
              ?
            </span>
          )}
        </div>

        {/* INFO */}

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-2">

            <p
              className="
                truncate
                text-sm
                font-black
                capitalize
                text-white
              "
            >
              {encounter.pokemon}
            </p>

            <span
              className="
                shrink-0
                rounded-md
                border
                border-lime-400/10
                bg-lime-400/[0.04]
                px-1.5
                py-0.5
                text-[8px]
                font-black
                text-lime-400
              "
            >
              {type.icon} {type.label}
            </span>

          </div>

          {/* LEVEL + SEASON */}

          <div
            className="
              mt-1.5
              flex
              flex-wrap
              gap-1.5
            "
          >

            <span
              className="
                rounded-md
                border
                border-white/[0.06]
                bg-white/[0.025]
                px-1.5
                py-0.5
                text-[9px]
                font-bold
                text-gray-500
              "
            >
              {formatLevel(encounter)}
            </span>

            {encounter.season && (
              <span
                className="
                  rounded-md
                  bg-white/[0.025]
                  px-1.5
                  py-0.5
                  text-[9px]
                  font-bold
                  text-gray-500
                "
              >
                {
                  formatSeason(
                    encounter.season
                  ).icon
                }{" "}
                {
                  formatSeason(
                    encounter.season
                  ).label
                }
              </span>
            )}

          </div>

        </div>

      </div>

      {/* RARITIES */}

      <div
        className="
          mt-3
          grid
          grid-cols-3
          gap-1.5
          border-t
          border-white/[0.05]
          pt-2.5
        "
      >

        <Rarity
          icon="🌅"
          label="Manhã"
          value={rarityMorning}
        />

        <Rarity
          icon="☀️"
          label="Dia"
          value={rarityDay}
        />

        <Rarity
          icon="🌙"
          label="Noite"
          value={rarityNight}
        />

      </div>

    </article>
  );
}

/* =========================================================
   RARITY
========================================================= */

function Rarity({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const available =
    value !== "--" &&
    value !== "" &&
    value !== "0%";

  return (
    <div
      className={`
        rounded-lg
        border
        px-2
        py-1.5
        ${
          available
            ? "border-white/[0.055] bg-white/[0.02]"
            : "border-white/[0.025] bg-white/[0.01] opacity-40"
        }
      `}
    >
      <p
        className="
          text-[8px]
          font-bold
          uppercase
          tracking-wider
          text-gray-600
        "
      >
        {icon} {label}
      </p>

      <p
        className={`
          mt-0.5
          text-[10px]
          font-black
          ${
            available
              ? "text-lime-400"
              : "text-gray-700"
          }
        `}
      >
        {value}
      </p>
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
    <div className="overflow-hidden">

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-white/[0.045]
          pb-3
        "
      >

        <div className="flex items-center gap-3">

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
              bg-lime-400/[0.045]
              text-base
            "
          >
            {getMethodIcon(method)}
          </div>

          <div>

            <p
              className="
                text-[11px]
                font-black
                uppercase
                tracking-[0.16em]
                text-white
              "
            >
              {method}
            </p>

            <p className="mt-0.5 text-[10px] text-gray-600">
              {getMethodDescription(method)}
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
            text-gray-500
          "
        >
          {encounters.length}
        </span>

      </div>

      <div
        className="
          mt-3
          grid
          grid-cols-1
          gap-2
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {encounters.map(
          (encounter, index) => (
            <PokemonCard
              key={[
                encounter.pokemon,
                encounter.method,
                encounter.form,
                encounter.minLevel,
                encounter.maxLevel,
                encounter.season,
                index,
              ].join("-")}
              encounter={encounter}
            />
          )
        )}
      </div>

    </div>
  );
}

/* =========================================================
   LOCATION
========================================================= */

function LocationDropdown({
  location,
  season,
  selectedMethods,
  selectedEncounters,
}: {
  location: MapLocation;
  season: string;
  selectedMethods: string[];
  selectedEncounters: EncounterFilter[];
}) {
  const [open, setOpen] =
    useState(false);

  const filteredEncounters =
    useMemo(() => {

      return location.encounters.filter(
        (encounter) => {

          /* =========================
             SEASON
          ========================= */

          if (
            !matchesSeason(
              encounter.season,
              season
            )
          ) {
            return false;
          }

          /* =========================
             METHOD
          ========================= */

          if (
            selectedMethods.length > 0 &&
            !selectedMethods.includes(
              encounter.method
            )
          ) {
            return false;
          }

          /* =========================
             ENCOUNTER TYPE
          ========================= */

          if (
            selectedEncounters.length > 0
          ) {

            const matchesType =
              selectedEncounters.some(
                (filter) => {

                  if (
                    filter === "single"
                  ) {
                    return isSingle(
                      encounter
                    );
                  }

                  if (
                    filter === "horde3"
                  ) {
                    return isHorde3(
                      encounter
                    );
                  }

                  if (
                    filter === "horde5"
                  ) {
                    return isHorde5(
                      encounter
                    );
                  }

                  return false;
                }
              );

            if (!matchesType) {
              return false;
            }
          }

          return true;
        }
      );

    }, [
      location.encounters,
      season,
      selectedMethods,
      selectedEncounters,
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

    }, [filteredEncounters]);

  const uniquePokemon =
    new Set(
      filteredEncounters.map(
        (encounter) =>
          encounter.pokemon
      )
    ).size;

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

      {/* LOCATION HEADER */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) => !value
          )
        }
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          px-4
          py-3.5
          text-left
          transition
          hover:bg-white/[0.02]
          sm:px-5
        "
      >

        <div className="flex min-w-0 items-center gap-3">

          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              text-sm
              font-black
              transition
              ${
                open
                  ? "border-lime-400/20 bg-lime-400/10 text-lime-400"
                  : "border-white/[0.06] bg-white/[0.025] text-gray-500"
              }
            `}
          >
            {open ? "−" : "+"}
          </div>

          <div className="min-w-0">

            <h3
              className="
                truncate
                text-sm
                font-black
                text-white
                sm:text-base
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

              <span className="text-gray-800">
                •
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-lime-400/70
                "
              >
                {filteredEncounters.length} encontros
              </span>

            </div>

          </div>

        </div>

        <span
          className="
            hidden
            shrink-0
            rounded-lg
            border
            border-white/[0.06]
            bg-white/[0.02]
            px-3
            py-1.5
            text-[9px]
            font-black
            uppercase
            tracking-wider
            text-gray-600
            sm:block
          "
        >
          MAP
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

          {methods.length === 0 ? (
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

              <p className="text-sm font-bold text-gray-500">
                Nenhum Pokémon encontrado.
              </p>

              <p className="mt-1 text-xs text-gray-700">
                Os filtros atuais não possuem resultados
                neste local.
              </p>

            </div>
          ) : (
            <div className="space-y-7">

              {methods.map(
                ([method, encounters]) => (
                  <MethodSection
                    key={method}
                    method={method}
                    encounters={encounters}
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
   REGION CONTENT
========================================================= */

function RegionContent({
  region,
  season,
  selectedMethods,
  selectedEncounters,
  locationSearch,
}: {
  region: MapRegion;
  season: string;
  selectedMethods: string[];
  selectedEncounters: EncounterFilter[];
  locationSearch: string;
}) {

  const locations =
    useMemo(() => {

      const search =
        locationSearch
          .trim()
          .toLowerCase();

      return region.locations.filter(
        (location) => {

          if (
            search &&
            !location.name
              .toLowerCase()
              .includes(search)
          ) {
            return false;
          }

          const hasResult =
            location.encounters.some(
              (encounter) => {

                if (
                  !matchesSeason(
                    encounter.season,
                    season
                  )
                ) {
                  return false;
                }

                if (
                  selectedMethods.length >
                    0 &&
                  !selectedMethods.includes(
                    encounter.method
                  )
                ) {
                  return false;
                }

                if (
                  selectedEncounters.length >
                    0
                ) {

                  const matchesType =
                    selectedEncounters.some(
                      (filter) => {

                        if (
                          filter ===
                          "single"
                        ) {
                          return isSingle(
                            encounter
                          );
                        }

                        if (
                          filter ===
                          "horde3"
                        ) {
                          return isHorde3(
                            encounter
                          );
                        }

                        if (
                          filter ===
                          "horde5"
                        ) {
                          return isHorde5(
                            encounter
                          );
                        }

                        return false;
                      }
                    );

                  if (!matchesType) {
                    return false;
                  }
                }

                return true;
              }
            );

          return hasResult;
        }
      );

    }, [
      region.locations,
      season,
      selectedMethods,
      selectedEncounters,
      locationSearch,
    ]);

  if (locations.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-white/[0.07]
          bg-white/[0.01]
          px-6
          py-16
          text-center
        "
      >

        <div className="text-3xl">
          🔎
        </div>

        <p className="mt-3 font-bold text-gray-400">
          Nenhum local encontrado
        </p>

        <p className="mt-1 text-xs text-gray-700">
          Tente remover algum filtro ou alterar a busca.
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-2.5">

      {locations.map(
        (location) => (
          <LocationDropdown
            key={String(location.id)}
            location={location}
            season={season}
            selectedMethods={
              selectedMethods
            }
            selectedEncounters={
              selectedEncounters
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

      <p className="mt-1 text-2xl font-black text-white">
        {value.toLocaleString("pt-BR")}
      </p>

    </div>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-xl
        border
        px-3
        py-2
        text-[10px]
        font-black
        transition-all
        ${
          active
            ? "border-lime-400/30 bg-lime-400/10 text-lime-400 shadow-[0_0_18px_rgba(163,230,53,0.04)]"
            : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.11] hover:bg-white/[0.035] hover:text-white"
        }
      `}
    >
      {active && (
        <span className="text-[9px]">
          ✓
        </span>
      )}

      {children}
    </button>
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
  children: ReactNode;
}) {
  return (
    <FilterButton
      active={active}
      onClick={onClick}
    >
      {children}
    </FilterButton>
  );
}

/* =========================================================
   FILTER PANEL
========================================================= */

function FilterPanel({
  seasons,
  selectedSeason,
  setSelectedSeason,
  methods,
  selectedMethods,
  toggleMethod,
  selectedEncounters,
  toggleEncounter,
  locationSearch,
  setLocationSearch,
  clearFilters,
  activeFilters,
}: {
  seasons: string[];
  selectedSeason: string;
  setSelectedSeason: (
    value: string
  ) => void;

  methods: string[];
  selectedMethods: string[];
  toggleMethod: (
    method: string
  ) => void;

  selectedEncounters: EncounterFilter[];
  toggleEncounter: (
    filter: EncounterFilter
  ) => void;

  locationSearch: string;
  setLocationSearch: (
    value: string
  ) => void;

  clearFilters: () => void;
  activeFilters: number;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/[0.07]
        bg-[#0a0e0a]/95
        p-4
        shadow-2xl
        shadow-black/20
        backdrop-blur-xl
        sm:p-5
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-3
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.2em]
              text-lime-400
            "
          >
            Filtros
          </p>

          <p className="mt-1 text-xs text-gray-600">
            Combine várias opções ao mesmo tempo.
          </p>

        </div>

        <div className="flex items-center gap-2">

          {activeFilters > 0 && (
            <span
              className="
                rounded-full
                border
                border-lime-400/15
                bg-lime-400/[0.05]
                px-2.5
                py-1
                text-[9px]
                font-black
                text-lime-400
              "
            >
              {activeFilters} ativos
            </span>
          )}

          <button
            type="button"
            onClick={clearFilters}
            disabled={
              activeFilters === 0 &&
              locationSearch === ""
            }
            className="
              rounded-lg
              border
              border-white/[0.06]
              bg-white/[0.02]
              px-3
              py-1.5
              text-[9px]
              font-black
              uppercase
              tracking-wider
              text-gray-600
              transition
              hover:border-red-400/20
              hover:text-red-400
              disabled:cursor-default
              disabled:opacity-30
            "
          >
            Limpar
          </button>

        </div>

      </div>

      {/* SEARCH */}

      <div className="mt-4">

        <label
          className="
            mb-1.5
            block
            text-[9px]
            font-black
            uppercase
            tracking-[0.16em]
            text-gray-600
          "
        >
          Procurar local
        </label>

        <div className="relative">

          <span
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-xs
              text-gray-700
            "
          >
            🔎
          </span>

          <input
            value={locationSearch}
            onChange={(event) =>
              setLocationSearch(
                event.target.value
              )
            }
            placeholder="Ex.: Route 102, Rota 216..."
            className="
              w-full
              rounded-xl
              border
              border-white/[0.06]
              bg-[#070a07]
              py-2.5
              pl-9
              pr-3
              text-xs
              text-white
              outline-none
              placeholder:text-gray-700
              focus:border-lime-400/25
              focus:ring-1
              focus:ring-lime-400/10
            "
          />

        </div>

      </div>

      {/* SEASON */}

      {seasons.length > 0 && (
        <div className="mt-5">

          <p
            className="
              mb-2
              text-[9px]
              font-black
              uppercase
              tracking-[0.16em]
              text-gray-600
            "
          >
            Estação
          </p>

          <div className="flex flex-wrap gap-1.5">

            <SeasonButton
              active={
                selectedSeason ===
                "all"
              }
              onClick={() =>
                setSelectedSeason(
                  "all"
                )
              }
            >
              ◉ Todas
            </SeasonButton>

            {seasons.map(
              (season) => {

                const data =
                  formatSeason(
                    season
                  );

                return (
                  <SeasonButton
                    key={season}
                    active={
                      selectedSeason ===
                      season
                    }
                    onClick={() =>
                      setSelectedSeason(
                        season
                      )
                    }
                  >
                    {data.icon}{" "}
                    {data.label}
                  </SeasonButton>
                );
              }
            )}

          </div>

        </div>
      )}

      {/* ENCOUNTER TYPE */}

      <div className="mt-5">

        <p
          className="
            mb-2
            text-[9px]
            font-black
            uppercase
            tracking-[0.16em]
            text-gray-600
          "
        >
          Tipo de encontro
        </p>

        <div className="flex flex-wrap gap-1.5">

          <FilterButton
            active={selectedEncounters.includes(
              "single"
            )}
            onClick={() =>
              toggleEncounter(
                "single"
              )
            }
          >
            ● Single
          </FilterButton>

          <FilterButton
            active={selectedEncounters.includes(
              "horde3"
            )}
            onClick={() =>
              toggleEncounter(
                "horde3"
              )
            }
          >
            👥 Horde ×3
          </FilterButton>

          <FilterButton
            active={selectedEncounters.includes(
              "horde5"
            )}
            onClick={() =>
              toggleEncounter(
                "horde5"
              )
            }
          >
            👥 Horde ×5
          </FilterButton>

        </div>

      </div>

      {/* METHODS */}

      {methods.length > 0 && (
        <div className="mt-5">

          <div
            className="
              mb-2
              flex
              items-center
              justify-between
              gap-3
            "
          >

            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.16em]
                text-gray-600
              "
            >
              Método
            </p>

            <span className="text-[9px] text-gray-700">
              {methods.length} disponíveis
            </span>

          </div>

          <div
            className="
              flex
              max-h-32
              flex-wrap
              gap-1.5
              overflow-y-auto
              pr-1
            "
          >

            {methods.map(
              (method) => (
                <FilterButton
                  key={method}
                  active={selectedMethods.includes(
                    method
                  )}
                  onClick={() =>
                    toggleMethod(
                      method
                    )
                  }
                >
                  {getMethodIcon(
                    method
                  )}{" "}
                  {method}
                </FilterButton>
              )
            )}

          </div>

        </div>
      )}

      {/* ACTIVE FILTER EXPLANATION */}

      {(
        selectedMethods.length >
          0 ||
        selectedEncounters.length >
          0
      ) && (
        <div
          className="
            mt-5
            rounded-xl
            border
            border-lime-400/10
            bg-lime-400/[0.025]
            px-3
            py-2.5
          "
        >

          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-wider
              text-lime-400
            "
          >
            Combinação atual
          </p>

          <p className="mt-1 text-[10px] leading-5 text-gray-600">
            Métodos selecionados funcionam como
            <strong className="text-gray-400">
              {" "}OU{" "}
            </strong>
            entre si. Os tipos de encontro também.
            Os dois grupos são combinados com
            <strong className="text-gray-400">
              {" "}E
            </strong>.
          </p>

        </div>
      )}

    </div>
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
      ? String(regions[0].id)
      : ""
  );

  const [
    selectedSeason,
    setSelectedSeason,
  ] = useState("all");

  const [
    selectedMethods,
    setSelectedMethods,
  ] = useState<string[]>([]);

  const [
    selectedEncounters,
    setSelectedEncounters,
  ] = useState<
    EncounterFilter[]
  >([]);

  const [
    locationSearch,
    setLocationSearch,
  ] = useState("");

  const activeRegionData =
    regions.find(
      (region) =>
        String(region.id) ===
        activeRegion
    ) ?? regions[0];

  /* =======================================================
     SEASONS
  ======================================================= */

  const seasons = useMemo(() => {

    if (!activeRegionData) {
      return [];
    }

    return getSeasons(
      activeRegionData.locations
    );

  }, [activeRegionData]);

  /* =======================================================
     METHODS
  ======================================================= */

  const methods = useMemo(() => {

    if (!activeRegionData) {
      return [];
    }

    const methodSet =
      new Set<string>();

    for (
      const location of
        activeRegionData.locations
    ) {

      for (
        const encounter of
          location.encounters
      ) {

        if (
          matchesSeason(
            encounter.season,
            selectedSeason
          )
        ) {
          methodSet.add(
            encounter.method
          );
        }

      }

    }

    return Array.from(
      methodSet
    ).sort(
      (a, b) =>
        a.localeCompare(
          b,
          "pt-BR"
        )
    );

  }, [
    activeRegionData,
    selectedSeason,
  ]);

  /* =======================================================
     FILTER COUNT
  ======================================================= */

  const activeFilters =
    selectedMethods.length +
    selectedEncounters.length +
    (selectedSeason !== "all"
      ? 1
      : 0);

  /* =======================================================
     RESULTS COUNT
  ======================================================= */

  const resultStatistics =
    useMemo(() => {

      if (!activeRegionData) {
        return {
          locations: 0,
          encounters: 0,
          pokemon: 0,
        };
      }

      const search =
        locationSearch
          .trim()
          .toLowerCase();

      const encounters: MapEncounter[] =
        [];

      let locations = 0;

      for (
        const location of
          activeRegionData.locations
      ) {

        if (
          search &&
          !location.name
            .toLowerCase()
            .includes(search)
        ) {
          continue;
        }

        const matching =
          location.encounters.filter(
            (encounter) => {

              if (
                !matchesSeason(
                  encounter.season,
                  selectedSeason
                )
              ) {
                return false;
              }

              if (
                selectedMethods.length >
                  0 &&
                !selectedMethods.includes(
                  encounter.method
                )
              ) {
                return false;
              }

              if (
                selectedEncounters.length >
                  0
              ) {

                const matchesType =
                  selectedEncounters.some(
                    (filter) => {

                      if (
                        filter ===
                        "single"
                      ) {
                        return isSingle(
                          encounter
                        );
                      }

                      if (
                        filter ===
                        "horde3"
                      ) {
                        return isHorde3(
                          encounter
                        );
                      }

                      if (
                        filter ===
                        "horde5"
                      ) {
                        return isHorde5(
                          encounter
                        );
                      }

                      return false;
                    }
                  );

                if (!matchesType) {
                  return false;
                }
              }

              return true;
            }
          );

        if (matching.length > 0) {
          locations += 1;
          encounters.push(
            ...matching
          );
        }

      }

      return {
        locations,
        encounters:
          encounters.length,
        pokemon:
          new Set(
            encounters.map(
              (encounter) =>
                encounter.pokemon
            )
          ).size,
      };

    }, [
      activeRegionData,
      selectedSeason,
      selectedMethods,
      selectedEncounters,
      locationSearch,
    ]);

  /* =======================================================
     CHANGE REGION
  ======================================================= */

  function changeRegion(
    id: string
  ) {
    setActiveRegion(id);
    setSelectedSeason("all");
    setSelectedMethods([]);
    setSelectedEncounters([]);
    setLocationSearch("");
  }

  /* =======================================================
     METHOD FILTER
  ======================================================= */

  function toggleMethod(
    method: string
  ) {
    setSelectedMethods(
      (current) =>
        current.includes(method)
          ? current.filter(
              (item) =>
                item !== method
            )
          : [
              ...current,
              method,
            ]
    );
  }

  /* =======================================================
     ENCOUNTER FILTER
  ======================================================= */

  function toggleEncounter(
    filter: EncounterFilter
  ) {
    setSelectedEncounters(
      (current) =>
        current.includes(filter)
          ? current.filter(
              (item) =>
                item !== filter
            )
          : [
              ...current,
              filter,
            ]
    );
  }

  /* =======================================================
     CLEAR
  ======================================================= */

  function clearFilters() {
    setSelectedSeason("all");
    setSelectedMethods([]);
    setSelectedEncounters([]);
    setLocationSearch("");
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-[#070a07]
        text-white
      "
    >

      {/* ===================================================
          HERO
      =================================================== */}

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
            pb-8
            pt-10
            sm:px-6
            lg:px-8
            lg:pb-10
            lg:pt-14
          "
        >

          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-gray-600
              transition
              hover:text-lime-400
            "
          >
            ← Voltar para início
          </Link>

          <div className="mt-8">

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

            <div
              className="
                mt-2
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >

              <div>

                <h1
                  className="
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
                  Explore os Pokémon encontrados
                  em cada rota, cidade, caverna e
                  área do PokeMMO.
                </p>

              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  sm:grid-cols-4
                  lg:min-w-[500px]
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
                    resultStatistics.locations
                  }
                />

                <Stat
                  label="Pokémon"
                  value={
                    resultStatistics.pokemon
                  }
                />

                <Stat
                  label="Encontros"
                  value={
                    resultStatistics.encounters
                  }
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          REGION NAVIGATION
      =================================================== */}

      <div
        className="
          sticky
          top-0
          z-40
          border-b
          border-white/[0.06]
          bg-[#070a07]/90
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
                    className={`
                      relative
                      rounded-xl
                      px-5
                      py-3
                      text-[11px]
                      font-black
                      transition-all
                      ${
                        active
                          ? "bg-lime-400 text-black"
                          : "text-gray-600 hover:bg-white/[0.035] hover:text-white"
                      }
                    `}
                  >
                    {region.name}

                    {active && (
                      <span
                        className="
                          absolute
                          bottom-0
                          left-1/2
                          h-0.5
                          w-5
                          -translate-x-1/2
                          rounded-full
                          bg-black/40
                        "
                      />
                    )}

                  </button>
                );
              }
            )}

          </div>

        </div>

      </div>

      {/* ===================================================
          MAIN
      =================================================== */}

      <section
        className="
          mx-auto
          max-w-[1400px]
          px-5
          py-6
          sm:px-6
          lg:px-8
          lg:py-8
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
            <p className="font-bold text-white">
              Nenhum mapa encontrado.
            </p>
          </div>
        ) : (
          <>

            {/* REGION HEADER */}

            <div
              className="
                mb-5
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-end
                sm:justify-between
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
                    text-2xl
                    font-black
                    tracking-tight
                    text-white
                    sm:text-3xl
                  "
                >
                  {activeRegionData.name}
                </h2>

              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  px-3
                  py-2
                  text-[9px]
                  font-black
                  uppercase
                  tracking-wider
                  text-gray-600
                "
              >
                {resultStatistics.locations} locais
                {" · "}
                {resultStatistics.encounters} encontros
              </div>

            </div>

            {/* FILTERS */}

            <div
              className="
                sticky
                top-[57px]
                z-30
                mb-6
              "
            >

              <FilterPanel
                seasons={seasons}
                selectedSeason={
                  selectedSeason
                }
                setSelectedSeason={
                  setSelectedSeason
                }
                methods={methods}
                selectedMethods={
                  selectedMethods
                }
                toggleMethod={
                  toggleMethod
                }
                selectedEncounters={
                  selectedEncounters
                }
                toggleEncounter={
                  toggleEncounter
                }
                locationSearch={
                  locationSearch
                }
                setLocationSearch={
                  setLocationSearch
                }
                clearFilters={
                  clearFilters
                }
                activeFilters={
                  activeFilters
                }
              />

            </div>

            {/* MAPS */}

            <RegionContent
              region={
                activeRegionData
              }
              season={
                selectedSeason
              }
              selectedMethods={
                selectedMethods
              }
              selectedEncounters={
                selectedEncounters
              }
              locationSearch={
                locationSearch
              }
            />

          </>
        )}

      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}

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

          <p className="text-sm font-bold text-white">
            neverTakeBan
          </p>

          <p className="mt-1 text-xs text-gray-600">
            Banco de mapas e encontros do PokeMMO.
          </p>

        </div>

      </footer>

    </main>
  );
}