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

  rarity_morning?: string;
  rarity_day?: string;
  rarity_night?: string;

  is_horde_3x?: boolean;
  is_horde_5x?: boolean;
};

/* =========================================================
   DATA HELPERS
========================================================= */

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
   ENCOUNTER FILTER MATCHING
========================================================= */

/**
 * Os filtros dentro do mesmo grupo usam OU.
 *
 * Exemplo:
 *
 * Horde ×3 + Horde ×5
 *
 * retorna:
 *
 * Horde ×3 OU Horde ×5
 *
 * Já grupos diferentes usam E:
 *
 * Horde ×3 + Lure
 *
 * retorna:
 *
 * Horde ×3 E Lure
 */
function matchesEncounterTypeFilters(
  encounter: MapEncounter,
  selected: EncounterFilter[]
) {
  if (selected.length === 0) {
    return true;
  }

  return selected.some((filter) => {
    switch (filter) {
      case "single":
        return isSingle(encounter);

      case "horde3":
        return isHorde3(encounter);

      case "horde5":
        return isHorde5(encounter);

      default:
        return false;
    }
  });
}

function matchesMethodFilters(
  encounter: MapEncounter,
  selectedMethods: string[]
) {
  if (selectedMethods.length === 0) {
    return true;
  }

  return selectedMethods.some(
    (method) =>
      method.toLowerCase().trim() ===
      encounter.method.toLowerCase().trim()
  );
}

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

  /*
   * Any / All significa que o Pokémon
   * aparece durante todas as estações.
   *
   * Portanto:
   *
   * Any + Primavera = válido
   * Any + Verão = válido
   * Any + Outono = válido
   * Any + Inverno = válido
   */

  if (
    encounterNormalized === "any" ||
    encounterNormalized === "all"
  ) {
    return true;
  }

  return (
    encounterNormalized ===
    selectedNormalized
  );
}

function matchesFilters(
  encounter: MapEncounter,
  season: string,
  selectedMethods: string[],
  selectedEncounters: EncounterFilter[]
) {
  /*
   * GRUPOS DIFERENTES = E
   */

  if (
    !matchesSeason(
      encounter.season,
      season
    )
  ) {
    return false;
  }

  if (
    !matchesMethodFilters(
      encounter,
      selectedMethods
    )
  ) {
    return false;
  }

  if (
    !matchesEncounterTypeFilters(
      encounter,
      selectedEncounters
    )
  ) {
    return false;
  }

  return true;
}

/* =========================================================
   METHOD
========================================================= */

function getMethodIcon(method: string) {
  const normalized =
    method.toLowerCase().trim();

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
  const normalized =
    method.toLowerCase().trim();

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
  const normalized =
    season.toLowerCase().trim();

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

  return {
    label: "Todas",
    icon: "◉",
  };
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

function getEncounterTypes(
  encounter: MapEncounter
) {
  const types: {
    label: string;
    icon: string;
  }[] = [];

  if (isHorde3(encounter)) {
    types.push({
      label: "Horde ×3",
      icon: "👥",
    });
  }

  if (isHorde5(encounter)) {
    types.push({
      label: "Horde ×5",
      icon: "👥",
    });
  }

  if (types.length === 0) {
    types.push({
      label: "Single",
      icon: "●",
    });
  }

  return types;
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

  const encounterTypes =
    getEncounterTypes(encounter);

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-white/[0.055]
        bg-[#0d120d]
        p-2.5
        transition-all
        duration-200
        hover:border-lime-400/20
        hover:bg-[#101610]
      "
    >
      <div className="flex gap-2.5">
        {/* SPRITE */}

        <div
          className="
            flex
            h-[62px]
            w-[62px]
            shrink-0
            items-center
            justify-center
            rounded-lg
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
                h-[56px]
                w-[56px]
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
          <div
            className="
              flex
              items-start
              justify-between
              gap-2
            "
          >
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
          </div>

          <div
            className="
              mt-1
              flex
              flex-wrap
              gap-1
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
                text-[8px]
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
                  border
                  border-white/[0.04]
                  bg-white/[0.02]
                  px-1.5
                  py-0.5
                  text-[8px]
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

          <div
            className="
              mt-1
              flex
              flex-wrap
              gap-1
            "
          >
            {encounterTypes.map(
              (type) => (
                <span
                  key={type.label}
                  className="
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
                  {type.icon}{" "}
                  {type.label}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* RARITIES */}

      <div
        className="
          mt-2.5
          grid
          grid-cols-3
          gap-1
          border-t
          border-white/[0.05]
          pt-2
        "
      >
        <Rarity
          icon="🌅"
          label="Manhã"
          value={getRarity(
            encounter,
            "morning"
          )}
        />

        <Rarity
          icon="☀️"
          label="Dia"
          value={getRarity(
            encounter,
            "day"
          )}
        />

        <Rarity
          icon="🌙"
          label="Noite"
          value={getRarity(
            encounter,
            "night"
          )}
        />
      </div>
    </article>
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
    <div>
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <div className="flex items-center gap-2">
          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              border
              border-lime-400/10
              bg-lime-400/[0.045]
              text-sm
            "
          >
            {getMethodIcon(method)}
          </span>

          <div>
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.14em]
                text-white
              "
            >
              {method}
            </p>

            <p className="text-[8px] text-gray-600">
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
            px-2
            py-0.5
            text-[8px]
            font-black
            text-gray-500
          "
        >
          {encounters.length}
        </span>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-2
          md:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-4
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
        (encounter) =>
          matchesFilters(
            encounter,
            season,
            selectedMethods,
            selectedEncounters
          )
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

      for (const encounter of filteredEncounters) {
        const existing =
          grouped.get(
            encounter.method
          ) ?? [];

        existing.push(encounter);

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

  /*
   * Se o filtro deixou o local sem
   * nenhum resultado, não precisamos
   * mostrar a caixa.
   */

  if (filteredEncounters.length === 0) {
    return null;
  }

  return (
    <article
      className="
        overflow-hidden
        rounded-xl
        border
        border-white/[0.07]
        bg-[#0a0e0a]
        transition
        hover:border-white/[0.1]
      "
    >
      {/* HEADER */}

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
          gap-3
          px-3.5
          py-3
          text-left
          transition
          hover:bg-white/[0.02]
        "
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              text-sm
              font-black
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
              "
            >
              {location.name}
            </h3>

            <div
              className="
                mt-0.5
                flex
                flex-wrap
                items-center
                gap-1.5
              "
            >
              <span className="text-[8px] font-bold uppercase tracking-wider text-gray-600">
                {uniquePokemon} Pokémon
              </span>

              <span className="text-gray-800">
                •
              </span>

              <span className="text-[8px] font-bold uppercase tracking-wider text-lime-400/70">
                {filteredEncounters.length} encontros
              </span>
            </div>
          </div>
        </div>

        <span
          className="
            hidden
            shrink-0
            rounded-md
            border
            border-white/[0.05]
            bg-white/[0.02]
            px-2
            py-1
            text-[8px]
            font-black
            uppercase
            tracking-wider
            text-gray-700
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
            px-3.5
            py-4
          "
        >
          <div className="space-y-5">
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

          return location.encounters.some(
            (encounter) =>
              matchesFilters(
                encounter,
                season,
                selectedMethods,
                selectedEncounters
              )
          );
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
          py-14
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
          Tente remover algum filtro ou
          alterar a busca.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-2.5
        lg:grid-cols-2
      "
    >
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
        px-3
        py-2.5
      "
    >
      <p
        className="
          text-[8px]
          font-bold
          uppercase
          tracking-[0.14em]
          text-gray-600
        "
      >
        {label}
      </p>

      <p className="mt-0.5 text-xl font-black text-white">
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
        gap-1
        rounded-lg
        border
        px-2.5
        py-1.5
        text-[9px]
        font-black
        transition-all
        ${
          active
            ? "border-lime-400/30 bg-lime-400/10 text-lime-400"
            : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.11] hover:bg-white/[0.035] hover:text-white"
        }
      `}
    >
      {active && (
        <span className="text-[8px]">
          ✓
        </span>
      )}

      {children}
    </button>
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
        p-3
        shadow-2xl
        shadow-black/20
        backdrop-blur-xl
        sm:p-4
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-3
          xl:flex-row
          xl:items-center
        "
      >
        <div className="shrink-0">
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

          <p className="mt-0.5 text-[9px] text-gray-600">
            Combine múltiplas opções.
          </p>
        </div>

        {/* SEARCH */}

        <div className="relative min-w-0 flex-1">
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
            placeholder="Procurar rota, cidade, caverna..."
            className="
              w-full
              rounded-lg
              border
              border-white/[0.06]
              bg-[#070a07]
              py-2
              pl-8
              pr-3
              text-[10px]
              text-white
              outline-none
              placeholder:text-gray-700
              focus:border-lime-400/25
              focus:ring-1
              focus:ring-lime-400/10
            "
          />
        </div>

        {/* CLEAR */}

        <div className="flex items-center gap-2">
          {activeFilters > 0 && (
            <span
              className="
                rounded-full
                border
                border-lime-400/15
                bg-lime-400/[0.05]
                px-2
                py-1
                text-[8px]
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
              px-2.5
              py-1.5
              text-[8px]
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

      {/* FILTER GRID */}

      <div
        className="
          mt-3
          grid
          grid-cols-1
          gap-3
          border-t
          border-white/[0.05]
          pt-3
          lg:grid-cols-[auto_auto_1fr]
        "
      >
        {/* SEASON */}

        {seasons.length > 0 && (
          <div>
            <p
              className="
                mb-1.5
                text-[8px]
                font-black
                uppercase
                tracking-[0.16em]
                text-gray-600
              "
            >
              Estação
            </p>

            <div className="flex flex-wrap gap-1">
              <FilterButton
                active={
                  selectedSeason === "all"
                }
                onClick={() =>
                  setSelectedSeason(
                    "all"
                  )
                }
              >
                ◉ Todas
              </FilterButton>

              {seasons.map(
                (season) => {
                  const data =
                    formatSeason(
                      season
                    );

                  return (
                    <FilterButton
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
                    </FilterButton>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* ENCOUNTER TYPE */}

        <div>
          <p
            className="
              mb-1.5
              text-[8px]
              font-black
              uppercase
              tracking-[0.16em]
              text-gray-600
            "
          >
            Encontro
          </p>

          <div className="flex flex-wrap gap-1">
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
              👥 ×3
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
              👥 ×5
            </FilterButton>
          </div>
        </div>

        {/* METHODS */}

        {methods.length > 0 && (
          <div className="min-w-0">
            <div
              className="
                mb-1.5
                flex
                items-center
                justify-between
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-gray-600
                "
              >
                Método
              </p>

              <span className="text-[8px] text-gray-700">
                {methods.length}
              </span>
            </div>

            <div
              className="
                flex
                max-h-16
                flex-wrap
                gap-1
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
      </div>

      {/* ACTIVE FILTER INFO */}

      {(selectedMethods.length > 0 ||
        selectedEncounters.length >
          0) && (
        <div
          className="
            mt-3
            flex
            flex-wrap
            items-center
            gap-2
            rounded-lg
            border
            border-lime-400/10
            bg-lime-400/[0.025]
            px-2.5
            py-2
          "
        >
          <span
            className="
              text-[8px]
              font-black
              uppercase
              tracking-wider
              text-lime-400
            "
          >
            Filtros combinados
          </span>

          <span className="text-[8px] text-gray-600">
            Métodos = OU
          </span>

          <span className="text-gray-800">
            •
          </span>

          <span className="text-[8px] text-gray-600">
            Encontros = OU
          </span>

          <span className="text-gray-800">
            •
          </span>

          <span className="text-[8px] text-gray-600">
            Grupos = E
          </span>
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

    for (const location of activeRegionData.locations) {
      for (const encounter of location.encounters) {
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
    ).sort((a, b) =>
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
     RESULTS
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

      for (const location of activeRegionData.locations) {
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
            (encounter) =>
              matchesFilters(
                encounter,
                selectedSeason,
                selectedMethods,
                selectedEncounters
              )
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

  function changeRegion(id: string) {
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
            pb-7
            pt-9
            sm:px-6
            lg:px-8
            lg:pb-8
            lg:pt-11
          "
        >
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-xs
              font-medium
              text-gray-600
              transition
              hover:text-lime-400
            "
          >
            ← Voltar para início
          </Link>

          <div className="mt-6">
            <p
              className="
                text-[9px]
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
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  Explore Pokémon,
                  locais, níveis,
                  métodos, hordas,
                  estações e
                  probabilidades de
                  encontro.
                </p>
              </div>

              <div
                className="
                  grid
                  grid-cols-4
                  gap-1.5
                  lg:min-w-[480px]
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
              py-1.5
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
                      rounded-lg
                      px-4
                      py-2
                      text-[10px]
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
          py-5
          sm:px-6
          lg:px-8
          lg:py-6
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
                mb-4
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.22em]
                    text-lime-400
                  "
                >
                  Região
                </p>

                <h2
                  className="
                    mt-0.5
                    text-2xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  {activeRegionData.name}
                </h2>
              </div>

              <div
                className="
                  rounded-lg
                  border
                  border-white/[0.06]
                  bg-white/[0.02]
                  px-2.5
                  py-1.5
                  text-[8px]
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
                top-[45px]
                z-30
                mb-4
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
          mt-8
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
            py-7
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