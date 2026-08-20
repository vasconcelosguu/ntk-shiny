"use client";

import { useMemo, useState } from "react";
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

/*
 * Compatibilidade com os dois formatos:
 *
 * camelCase:
 * isHorde3x
 * rarityMorning
 *
 * snake_case:
 * is_horde_3x
 * rarity_morning
 *
 * Assim a interface continua funcionando mesmo se o
 * parser de lib/maps.ts estiver retornando um ou outro.
 */

type EncounterExtra = {
  isHorde3x?: boolean;
  isHorde5x?: boolean;

  is_horde_3x?: boolean;
  is_horde_5x?: boolean;

  rarityMorning?: string;
  rarityDay?: string;
  rarityNight?: string;

  rarity_morning?: string;
  rarity_day?: string;
  rarity_night?: string;
};

type ExtendedEncounter = MapEncounter & EncounterExtra;

type EncounterMode =
  | "all"
  | "single"
  | "horde3"
  | "horde5"
  | "lure";

type TimeFilter =
  | "all"
  | "morning"
  | "day"
  | "night";

/* =========================================================
   HELPERS
========================================================= */

function getExtra(
  encounter: MapEncounter
): ExtendedEncounter {
  return encounter as ExtendedEncounter;
}

/* =========================================================
   METHOD ICON
========================================================= */

function getMethodIcon(method: string) {
  const normalized = method.toLowerCase();

  if (
    normalized.includes("grass") ||
    normalized.includes("route") ||
    normalized.includes("campo")
  ) {
    return "🌿";
  }

  if (
    normalized === "water" ||
    normalized.includes("surf")
  ) {
    return "🌊";
  }

  if (
    normalized.includes("rod") ||
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

  if (normalized.includes("lure")) {
    return "🪱";
  }

  return "✨";
}

/* =========================================================
   METHOD LABEL
========================================================= */

function getMethodLabel(method: string) {
  const normalized = method.toLowerCase();

  if (normalized.includes("super rod")) {
    return "Super Rod";
  }

  if (normalized.includes("good rod")) {
    return "Good Rod";
  }

  if (normalized.includes("old rod")) {
    return "Old Rod";
  }

  if (normalized.includes("fishing")) {
    return "Fishing";
  }

  if (normalized.includes("grass")) {
    return "Grass";
  }

  if (normalized.includes("surf")) {
    return "Surf";
  }

  if (normalized.includes("water")) {
    return "Water";
  }

  if (normalized.includes("honey")) {
    return "Honey";
  }

  if (normalized.includes("headbutt")) {
    return "Headbutt";
  }

  return method;
}

/* =========================================================
   SPRITE
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

  return "Nível ?";
}

/* =========================================================
   SEASON
========================================================= */

function formatSeason(season?: string) {
  const normalized =
    String(season ?? "")
      .toLowerCase()
      .trim();

  if (
    normalized === "spring" ||
    normalized.includes("primavera")
  ) {
    return {
      label: "Primavera",
      icon: "🌸",
    };
  }

  if (
    normalized === "summer" ||
    normalized.includes("verão") ||
    normalized.includes("verao")
  ) {
    return {
      label: "Verão",
      icon: "☀️",
    };
  }

  if (
    normalized === "autumn" ||
    normalized === "fall" ||
    normalized.includes("outono")
  ) {
    return {
      label: "Outono",
      icon: "🍂",
    };
  }

  if (
    normalized === "winter" ||
    normalized.includes("inverno")
  ) {
    return {
      label: "Inverno",
      icon: "❄️",
    };
  }

  if (
    normalized === "any" ||
    normalized === "all"
  ) {
    return {
      label: "Todas",
      icon: "◉",
    };
  }

  return {
    label: season || "—",
    icon: "◉",
  };
}

/* =========================================================
   HORDE
========================================================= */

function isHorde3(
  encounter: MapEncounter
) {
  const extra = getExtra(encounter);

  return (
    extra.isHorde3x === true ||
    extra.is_horde_3x === true
  );
}

function isHorde5(
  encounter: MapEncounter
) {
  const extra = getExtra(encounter);

  return (
    extra.isHorde5x === true ||
    extra.is_horde_5x === true
  );
}

/* =========================================================
   RARITY / PERCENTAGES
========================================================= */

function getRarity(
  encounter: MapEncounter,
  time: TimeFilter
) {
  const extra = getExtra(encounter);

  const morning =
    extra.rarityMorning ??
    extra.rarity_morning ??
    "";

  const day =
    extra.rarityDay ??
    extra.rarity_day ??
    "";

  const night =
    extra.rarityNight ??
    extra.rarity_night ??
    "";

  if (time === "morning") {
    return morning;
  }

  if (time === "day") {
    return day;
  }

  if (time === "night") {
    return night;
  }

  return "";
}

function getRarities(
  encounter: MapEncounter
) {
  const extra = getExtra(encounter);

  return {
    morning:
      extra.rarityMorning ??
      extra.rarity_morning ??
      "—",

    day:
      extra.rarityDay ??
      extra.rarity_day ??
      "—",

    night:
      extra.rarityNight ??
      extra.rarity_night ??
      "—",
  };
}

function isLure(
  encounter: MapEncounter
) {
  const rarities = getRarities(encounter);

  return (
    rarities.morning
      .toLowerCase()
      .includes("lure") ||
    rarities.day
      .toLowerCase()
      .includes("lure") ||
    rarities.night
      .toLowerCase()
      .includes("lure")
  );
}

/* =========================================================
   MODE
========================================================= */

function getEncounterMode(
  encounter: MapEncounter
): EncounterMode {
  if (isHorde5(encounter)) {
    return "horde5";
  }

  if (isHorde3(encounter)) {
    return "horde3";
  }

  if (isLure(encounter)) {
    return "lure";
  }

  return "single";
}

function getModeLabel(
  encounter: MapEncounter
) {
  const mode = getEncounterMode(encounter);

  if (mode === "horde3") {
    return "Horda 3×";
  }

  if (mode === "horde5") {
    return "Horda 5×";
  }

  if (mode === "lure") {
    return "Lure";
  }

  return "Single";
}

/* =========================================================
   SEASONS
========================================================= */

function getSeasons(
  locations: MapLocation[]
) {
  const seasons = new Set<string>();

  for (const location of locations) {
    for (const encounter of location.encounters) {
      if (encounter.season) {
        seasons.add(encounter.season);
      }
    }
  }

  const order = [
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
    "Any",
  ];

  return Array.from(seasons).sort(
    (a, b) => {
      const ai = order.findIndex(
        (item) =>
          item.toLowerCase() ===
          a.toLowerCase()
      );

      const bi = order.findIndex(
        (item) =>
          item.toLowerCase() ===
          b.toLowerCase()
      );

      if (ai === -1 && bi === -1) {
        return a.localeCompare(b);
      }

      if (ai === -1) {
        return 1;
      }

      if (bi === -1) {
        return -1;
      }

      return ai - bi;
    }
  );
}

/* =========================================================
   METHOD LIST
========================================================= */

function getMethods(
  locations: MapLocation[]
) {
  const methods = new Set<string>();

  for (const location of locations) {
    for (const encounter of location.encounters) {
      if (encounter.method) {
        methods.add(encounter.method);
      }
    }
  }

  return Array.from(methods).sort(
    (a, b) =>
      a.localeCompare(b)
  );
}

/* =========================================================
   SEASON MATCH
========================================================= */

function matchesSeason(
  encounter: MapEncounter,
  selectedSeason: string
) {
  if (selectedSeason === "all") {
    return true;
  }

  const encounterSeason =
    String(encounter.season ?? "")
      .toLowerCase();

  const selected =
    selectedSeason.toLowerCase();

  /*
   * IMPORTANTE:
   *
   * Any significa que o Pokémon aparece
   * independentemente da estação.
   *
   * Portanto:
   *
   * Spring selecionado
   * ↓
   * Spring + Any
   */

  return (
    encounterSeason === selected ||
    encounterSeason === "any"
  );
}

/* =========================================================
   TIME MATCH
========================================================= */

function matchesTime(
  encounter: MapEncounter,
  selectedTime: TimeFilter
) {
  if (selectedTime === "all") {
    return true;
  }

  /*
   * Lure não possui porcentagem normal.
   * Mantemos Lure visível independentemente
   * do horário quando o filtro Lure estiver ativo.
   */

  if (isLure(encounter)) {
    return true;
  }

  const rarity =
    getRarity(
      encounter,
      selectedTime
    );

  return Boolean(rarity);
}

/* =========================================================
   MODE FILTER
========================================================= */

function matchesMode(
  encounter: MapEncounter,
  mode: EncounterMode
) {
  if (mode === "all") {
    return true;
  }

  return (
    getEncounterMode(encounter) ===
    mode
  );
}

/* =========================================================
   METHOD FILTER
========================================================= */

function matchesMethod(
  encounter: MapEncounter,
  method: string
) {
  if (method === "all") {
    return true;
  }

  return (
    encounter.method === method
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
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 rounded-lg border px-3 py-2",
        "text-[10px] font-black transition-all",
        active
          ? "border-lime-400/30 bg-lime-400 text-black shadow-[0_0_18px_rgba(163,230,53,0.08)]"
          : "border-white/[0.06] bg-white/[0.025] text-gray-500 hover:border-lime-400/20 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
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
          text-[8px]
          font-black
          uppercase
          tracking-[0.15em]
          text-gray-600
        "
      >
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-white">
        {value.toLocaleString("pt-BR")}
      </p>
    </div>
  );
}

/* =========================================================
   POKEMON ROW
========================================================= */

function PokemonRow({
  encounter,
}: {
  encounter: MapEncounter;
}) {
  const [open, setOpen] =
    useState(false);

  const sprite =
    getPokemonSprite(
      encounter.pokemonId
    );

  const rarities =
    getRarities(encounter);

  const season =
    formatSeason(
      encounter.season
    );

  const horde3 =
    isHorde3(encounter);

  const horde5 =
    isHorde5(encounter);

  const lure =
    isLure(encounter);

  return (
    <article
      className={[
        "overflow-hidden rounded-xl border",
        "bg-[#0b100b]",
        "transition-all duration-200",
        open
          ? "border-lime-400/20"
          : "border-white/[0.045] hover:border-white/[0.09]",
      ].join(" ")}
    >

      {/* =================================================
          COMPACT ROW
      ================================================= */}

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
          gap-3
          px-3
          py-2
          text-left
          transition
          hover:bg-white/[0.018]
        "
      >

        {/* PLUS */}

        <div
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
            "text-xs font-black transition",
            open
              ? "border-lime-400/25 bg-lime-400/10 text-lime-400"
              : "border-white/[0.06] bg-white/[0.02] text-gray-600",
          ].join(" ")}
        >
          {open ? "−" : "+"}
        </div>

        {/* SPRITE */}

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[#070b07]
            ring-1
            ring-white/[0.035]
          "
        >
          {sprite ? (
            <img
              src={sprite}
              alt={encounter.pokemon}
              className="
                h-11
                w-11
                object-contain
                [image-rendering:pixelated]
              "
            />
          ) : (
            <span className="text-gray-700">
              ?
            </span>
          )}
        </div>

        {/* NAME */}

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">

            <p
              className="
                truncate
                text-xs
                font-black
                capitalize
                text-white
                sm:text-sm
              "
            >
              {encounter.pokemon}
            </p>

            {horde3 && (
              <span
                className="
                  hidden
                  rounded-md
                  border
                  border-amber-400/15
                  bg-amber-400/5
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-black
                  text-amber-300
                  sm:inline-flex
                "
              >
                H3
              </span>
            )}

            {horde5 && (
              <span
                className="
                  hidden
                  rounded-md
                  border
                  border-orange-400/15
                  bg-orange-400/5
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-black
                  text-orange-300
                  sm:inline-flex
                "
              >
                H5
              </span>
            )}

            {lure && (
              <span
                className="
                  hidden
                  rounded-md
                  border
                  border-cyan-400/15
                  bg-cyan-400/5
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-black
                  text-cyan-300
                  sm:inline-flex
                "
              >
                LURE
              </span>
            )}

          </div>

          <div
            className="
              mt-1
              flex
              flex-wrap
              items-center
              gap-1.5
            "
          >

            <span className="text-[9px] font-bold text-gray-600">
              {formatLevel(encounter)}
            </span>

            <span className="text-gray-800">
              •
            </span>

            <span className="text-[9px] text-gray-600">
              {season.icon}{" "}
              {season.label}
            </span>

          </div>

        </div>

        {/* METHOD */}

        <div
          className="
            hidden
            items-center
            gap-1.5
            rounded-lg
            border
            border-white/[0.05]
            bg-white/[0.018]
            px-2
            py-1.5
            sm:flex
          "
        >
          <span className="text-xs">
            {getMethodIcon(
              encounter.method
            )}
          </span>

          <span
            className="
              max-w-[100px]
              truncate
              text-[9px]
              font-bold
              text-gray-500
            "
          >
            {getMethodLabel(
              encounter.method
            )}
          </span>
        </div>

        {/* RARITY */}

        <div
          className="
            hidden
            min-w-[110px]
            text-right
            sm:block
          "
        >

          {lure ? (
            <span
              className="
                text-[9px]
                font-black
                uppercase
                tracking-wider
                text-cyan-300
              "
            >
              Lure
            </span>
          ) : (
            <div
              className="
                grid
                grid-cols-3
                gap-1
                text-[8px]
                font-bold
              "
            >
              <span className="text-gray-600">
                {rarities.morning}
              </span>

              <span className="text-gray-500">
                {rarities.day}
              </span>

              <span className="text-gray-600">
                {rarities.night}
              </span>
            </div>
          )}

        </div>

        {/* ARROW */}

        <span
          className={[
            "text-xs text-gray-700 transition",
            open
              ? "rotate-180 text-lime-400"
              : "",
          ].join(" ")}
        >
          ↓
        </span>

      </button>


      {/* =================================================
          EXPANDED
      ================================================= */}

      {open && (
        <div
          className="
            border-t
            border-white/[0.045]
            bg-[#080c08]
            px-3
            py-3
          "
        >

          <div
            className="
              grid
              grid-cols-1
              gap-2
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            {/* METHOD */}

            <div
              className="
                rounded-lg
                border
                border-white/[0.05]
                bg-white/[0.015]
                p-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-gray-600
                "
              >
                Método
              </p>

              <p className="mt-1 text-xs font-bold text-white">
                {getMethodIcon(
                  encounter.method
                )}{" "}
                {getMethodLabel(
                  encounter.method
                )}
              </p>
            </div>


            {/* LEVEL */}

            <div
              className="
                rounded-lg
                border
                border-white/[0.05]
                bg-white/[0.015]
                p-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-gray-600
                "
              >
                Nível
              </p>

              <p className="mt-1 text-xs font-bold text-white">
                {formatLevel(
                  encounter
                )}
              </p>
            </div>


            {/* SEASON */}

            <div
              className="
                rounded-lg
                border
                border-white/[0.05]
                bg-white/[0.015]
                p-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-gray-600
                "
              >
                Estação
              </p>

              <p className="mt-1 text-xs font-bold text-white">
                {season.icon}{" "}
                {season.label}
              </p>
            </div>


            {/* MODE */}

            <div
              className="
                rounded-lg
                border
                border-white/[0.05]
                bg-white/[0.015]
                p-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-gray-600
                "
              >
                Encontro
              </p>

              <p className="mt-1 text-xs font-bold text-white">
                {getModeLabel(
                  encounter
                )}
              </p>
            </div>

          </div>


          {/* =================================================
              RARITY
          ================================================= */}

          <div
            className="
              mt-2
              rounded-lg
              border
              border-white/[0.05]
              bg-white/[0.012]
              p-3
            "
          >

            <p
              className="
                mb-2
                text-[8px]
                font-black
                uppercase
                tracking-[0.15em]
                text-gray-600
              "
            >
              Chance de encontro
            </p>

            {lure ? (

              <div
                className="
                  rounded-lg
                  border
                  border-cyan-400/10
                  bg-cyan-400/[0.025]
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-cyan-300
                "
              >
                🪱 Lure
              </div>

            ) : (

              <div
                className="
                  grid
                  grid-cols-3
                  gap-2
                "
              >

                <RarityBox
                  icon="🌅"
                  label="Manhã"
                  value={
                    rarities.morning
                  }
                />

                <RarityBox
                  icon="☀️"
                  label="Dia"
                  value={
                    rarities.day
                  }
                />

                <RarityBox
                  icon="🌙"
                  label="Noite"
                  value={
                    rarities.night
                  }
                />

              </div>

            )}

          </div>


          {/* =================================================
              HORDE
          ================================================= */}

          <div
            className="
              mt-2
              flex
              flex-wrap
              gap-2
            "
          >

            <DetailBadge
              active={horde3}
              label="Horda 3×"
            />

            <DetailBadge
              active={horde5}
              label="Horda 5×"
            />

            {!horde3 &&
              !horde5 && (
                <span
                  className="
                    rounded-md
                    border
                    border-white/[0.05]
                    bg-white/[0.015]
                    px-2
                    py-1
                    text-[9px]
                    font-bold
                    text-gray-600
                  "
                >
                  Encontro individual
                </span>
              )}

          </div>

        </div>
      )}

    </article>
  );
}

/* =========================================================
   RARITY BOX
========================================================= */

function RarityBox({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-white/[0.05]
        bg-[#0b100b]
        px-3
        py-2
      "
    >
      <div className="flex items-center justify-between">

        <span className="text-[10px]">
          {icon}
        </span>

        <span className="text-[8px] font-bold text-gray-600">
          {label}
        </span>

      </div>

      <p className="mt-1 text-sm font-black text-white">
        {value || "—"}
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL BADGE
========================================================= */

function DetailBadge({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
  return (
    <span
      className={[
        "rounded-md border px-2 py-1",
        "text-[9px] font-black",
        active
          ? "border-lime-400/20 bg-lime-400/5 text-lime-400"
          : "border-white/[0.05] bg-white/[0.015] text-gray-700",
      ].join(" ")}
    >
      {active ? "✓ " : "— "}
      {label}
    </span>
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

      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          border-b
          border-white/[0.04]
          pb-2
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
              bg-lime-400/[0.04]
              text-sm
            "
          >
            {getMethodIcon(
              method
            )}
          </span>

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white">
              {getMethodLabel(
                method
              )}
            </p>

            <p className="text-[8px] text-gray-700">
              {encounters.length}{" "}
              encontros
            </p>

          </div>

        </div>

        <span className="text-[8px] font-bold text-gray-700">
          {method}
        </span>

      </div>


      <div className="space-y-1.5">

        {encounters.map(
          (encounter, index) => (
            <PokemonRow
              key={[
                encounter.pokemon,
                encounter.method,
                encounter.form,
                encounter.minLevel,
                encounter.maxLevel,
                encounter.season,
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
   LOCATION
========================================================= */

function LocationDropdown({
  location,
  season,
  mode,
  method,
  time,
  search,
}: {
  location: MapLocation;
  season: string;
  mode: EncounterMode;
  method: string;
  time: TimeFilter;
  search: string;
}) {
  const [open, setOpen] =
    useState(false);

  const filteredEncounters =
    useMemo(() => {

      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return location.encounters.filter(
        (encounter) => {

          if (
            !matchesSeason(
              encounter,
              season
            )
          ) {
            return false;
          }

          if (
            !matchesMode(
              encounter,
              mode
            )
          ) {
            return false;
          }

          if (
            !matchesMethod(
              encounter,
              method
            )
          ) {
            return false;
          }

          if (
            !matchesTime(
              encounter,
              time
            )
          ) {
            return false;
          }

          if (
            normalizedSearch &&
            !encounter.pokemon
              .toLowerCase()
              .includes(
                normalizedSearch
              )
          ) {
            return false;
          }

          return true;
        }
      );

    }, [
      location.encounters,
      season,
      mode,
      method,
      time,
      search,
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

  /*
   * Se o filtro remove tudo,
   * não mostramos a localização.
   */

  if (
    filteredEncounters.length === 0
  ) {
    return null;
  }

  return (
    <article
      className={[
        "overflow-hidden rounded-2xl border",
        "bg-[#0a0e0a]",
        "transition-all duration-200",
        open
          ? "border-lime-400/15"
          : "border-white/[0.06] hover:border-white/[0.10]",
      ].join(" ")}
    >

      {/* =================================================
          LOCATION HEADER
      ================================================= */}

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
          px-4
          py-3
          text-left
          transition
          hover:bg-white/[0.018]
        "
      >

        <div className="flex min-w-0 items-center gap-3">

          <div
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
              "text-xs font-black transition",
              open
                ? "border-lime-400/20 bg-lime-400/10 text-lime-400"
                : "border-white/[0.06] bg-white/[0.02] text-gray-600",
            ].join(" ")}
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

            <div className="mt-0.5 flex items-center gap-2">

              <span className="text-[8px] font-bold uppercase tracking-wider text-gray-700">
                {uniquePokemon} Pokémon
              </span>

              <span className="text-gray-800">
                •
              </span>

              <span className="text-[8px] font-bold uppercase tracking-wider text-gray-700">
                {filteredEncounters.length} encontros
              </span>

            </div>

          </div>

        </div>


        <span
          className={[
            "text-xs text-gray-700 transition",
            open
              ? "rotate-180 text-lime-400"
              : "",
          ].join(" ")}
        >
          ↓
        </span>

      </button>


      {/* =================================================
          CONTENT
      ================================================= */}

      {open && (
        <div
          className="
            border-t
            border-white/[0.045]
            bg-[#080c08]
            px-3
            py-4
          "
        >

          <div className="space-y-5">

            {methods.map(
              ([method, encounters]) => (
                <MethodSection
                  key={method}
                  method={method}
                  encounters={
                    encounters
                  }
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
  mode,
  method,
  time,
  search,
}: {
  region: MapRegion;
  season: string;
  mode: EncounterMode;
  method: string;
  time: TimeFilter;
  search: string;
}) {
  const locations = region.locations.filter(
    (location) => {

      const hasResults =
        location.encounters.some(
          (encounter) => {

            if (
              !matchesSeason(
                encounter,
                season
              )
            ) {
              return false;
            }

            if (
              !matchesMode(
                encounter,
                mode
              )
            ) {
              return false;
            }

            if (
              !matchesMethod(
                encounter,
                method
              )
            ) {
              return false;
            }

            if (
              !matchesTime(
                encounter,
                time
              )
            ) {
              return false;
            }

            if (
              search.trim() &&
              !encounter.pokemon
                .toLowerCase()
                .includes(
                  search
                    .trim()
                    .toLowerCase()
                )
            ) {
              return false;
            }

            return true;
          }
        );

      return hasResults;
    }
  );

  if (locations.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-white/[0.07]
          bg-white/[0.012]
          px-6
          py-16
          text-center
        "
      >

        <div className="text-3xl">
          🔎
        </div>

        <p className="mt-3 text-sm font-black text-white">
          Nenhum encontro encontrado
        </p>

        <p className="mt-1 text-xs text-gray-600">
          Tente remover algum filtro ou alterar a busca.
        </p>

      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-3
        xl:grid-cols-2
      "
    >

      {locations.map(
        (location) => (
          <LocationDropdown
            key={String(
              location.id
            )}
            location={
              location
            }
            season={
              season
            }
            mode={
              mode
            }
            method={
              method
            }
            time={
              time
            }
            search={
              search
            }
          />
        )
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
      ? String(
          regions[0].id
        )
      : ""
  );

  const [
    selectedSeason,
    setSelectedSeason,
  ] = useState("all");

  const [
    selectedMode,
    setSelectedMode,
  ] =
    useState<EncounterMode>(
      "all"
    );

  const [
    selectedMethod,
    setSelectedMethod,
  ] = useState("all");

  const [
    selectedTime,
    setSelectedTime,
  ] =
    useState<TimeFilter>(
      "all"
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const activeRegionData =
    regions.find(
      (region) =>
        String(region.id) ===
        activeRegion
    ) ?? regions[0];

  /* =======================================================
     FILTER DATA
  ======================================================= */

  const seasons = useMemo(() => {

    if (!activeRegionData) {
      return [];
    }

    return getSeasons(
      activeRegionData.locations
    );

  }, [activeRegionData]);

  const methods = useMemo(() => {

    if (!activeRegionData) {
      return [];
    }

    return getMethods(
      activeRegionData.locations
    );

  }, [activeRegionData]);

  /* =======================================================
     RESULT COUNT
  ======================================================= */

  const resultCount =
    useMemo(() => {

      if (!activeRegionData) {
        return 0;
      }

      return activeRegionData.locations.reduce(
        (total, location) => {

          const count =
            location.encounters.filter(
              (encounter) => {

                if (
                  !matchesSeason(
                    encounter,
                    selectedSeason
                  )
                ) {
                  return false;
                }

                if (
                  !matchesMode(
                    encounter,
                    selectedMode
                  )
                ) {
                  return false;
                }

                if (
                  !matchesMethod(
                    encounter,
                    selectedMethod
                  )
                ) {
                  return false;
                }

                if (
                  !matchesTime(
                    encounter,
                    selectedTime
                  )
                ) {
                  return false;
                }

                if (
                  search.trim() &&
                  !encounter.pokemon
                    .toLowerCase()
                    .includes(
                      search
                        .trim()
                        .toLowerCase()
                    )
                ) {
                  return false;
                }

                return true;
              }
            ).length;

          return total + count;

        },
        0
      );

    }, [
      activeRegionData,
      selectedSeason,
      selectedMode,
      selectedMethod,
      selectedTime,
      search,
    ]);

  /* =======================================================
     REGION CHANGE
  ======================================================= */

  function changeRegion(
    id: string
  ) {
    setActiveRegion(id);

    setSelectedSeason(
      "all"
    );

    setSelectedMode(
      "all"
    );

    setSelectedMethod(
      "all"
    );

    setSelectedTime(
      "all"
    );

    setSearch("");
  }

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  function clearFilters() {
    setSelectedSeason(
      "all"
    );

    setSelectedMode(
      "all"
    );

    setSelectedMethod(
      "all"
    );

    setSelectedTime(
      "all"
    );

    setSearch("");
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
            lg:pb-9
            lg:pt-12
          "
        >

          <Link
            href="/"
            className="
              text-xs
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
              mt-6
              flex
              flex-col
              gap-5
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
                  tracking-[0.25em]
                  text-lime-400
                "
              >
                PokeMMO Database
              </p>

              <h1
                className="
                  mt-1
                  text-4xl
                  font-black
                  tracking-[-0.04em]
                  text-white
                  sm:text-5xl
                "
              >
                Mapas
              </h1>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-xs
                  leading-6
                  text-gray-600
                  sm:text-sm
                "
              >
                Consulte Pokémon, rotas, métodos,
                níveis, estações, probabilidades e
                encontros especiais.
              </p>

            </div>


            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-4
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
                      "rounded-lg px-4 py-2.5 text-[10px] font-black transition",
                      active
                        ? "bg-lime-400 text-black"
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

          <div className="py-20 text-center">
            Nenhum mapa encontrado.
          </div>

        ) : (

          <>

            {/* =============================================
                REGION HEADER
            ============================================= */}

            <div
              className="
                mb-4
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-lime-400
                  "
                >
                  Região
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-black
                    tracking-tight
                  "
                >
                  {activeRegionData.name}
                </h2>

              </div>

              <div
                className="
                  rounded-lg
                  border
                  border-white/[0.05]
                  bg-white/[0.015]
                  px-3
                  py-2
                  text-[9px]
                  font-bold
                  text-gray-600
                "
              >
                {resultCount.toLocaleString(
                  "pt-BR"
                )}{" "}
                encontros encontrados
              </div>

            </div>


            {/* =============================================
                FILTER PANEL
            ============================================= */}

            <div
              className="
                sticky
                top-[49px]
                z-30
                mb-5
                rounded-2xl
                border
                border-white/[0.06]
                bg-[#0a0e0a]/95
                p-3
                shadow-2xl
                shadow-black/20
                backdrop-blur-xl
              "
            >

              {/* SEARCH */}

              <div className="flex flex-col gap-3 lg:flex-row">

                <div className="relative flex-1">

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
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target
                          .value
                      )
                    }
                    placeholder="Buscar Pokémon..."
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-white/[0.06]
                      bg-[#070a07]
                      pl-9
                      pr-3
                      text-xs
                      text-white
                      outline-none
                      placeholder:text-gray-700
                      focus:border-lime-400/25
                    "
                  />

                </div>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="
                    h-9
                    rounded-lg
                    border
                    border-white/[0.06]
                    bg-white/[0.02]
                    px-3
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wider
                    text-gray-600
                    transition
                    hover:border-lime-400/20
                    hover:text-lime-400
                  "
                >
                  Limpar
                </button>

              </div>


              {/* MODE */}

              <div className="mt-3">

                <p
                  className="
                    mb-1.5
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-gray-700
                  "
                >
                  Tipo de encontro
                </p>

                <div
                  className="
                    flex
                    gap-1.5
                    overflow-x-auto
                    pb-1
                  "
                >

                  <FilterButton
                    active={
                      selectedMode ===
                      "all"
                    }
                    onClick={() =>
                      setSelectedMode(
                        "all"
                      )
                    }
                  >
                    Todos
                  </FilterButton>

                  <FilterButton
                    active={
                      selectedMode ===
                      "single"
                    }
                    onClick={() =>
                      setSelectedMode(
                        "single"
                      )
                    }
                  >
                    Single
                  </FilterButton>

                  <FilterButton
                    active={
                      selectedMode ===
                      "horde3"
                    }
                    onClick={() =>
                      setSelectedMode(
                        "horde3"
                      )
                    }
                  >
                    Horda 3×
                  </FilterButton>

                  <FilterButton
                    active={
                      selectedMode ===
                      "horde5"
                    }
                    onClick={() =>
                      setSelectedMode(
                        "horde5"
                      )
                    }
                  >
                    Horda 5×
                  </FilterButton>

                  <FilterButton
                    active={
                      selectedMode ===
                      "lure"
                    }
                    onClick={() =>
                      setSelectedMode(
                        "lure"
                      )
                    }
                  >
                    🪱 Lure
                  </FilterButton>

                </div>

              </div>


              {/* SECOND ROW */}

              <div
                className="
                  mt-3
                  grid
                  grid-cols-1
                  gap-3
                  lg:grid-cols-3
                "
              >

                {/* SEASON */}

                <div>

                  <p
                    className="
                      mb-1.5
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      text-gray-700
                    "
                  >
                    Estação
                  </p>

                  <div
                    className="
                      flex
                      gap-1.5
                      overflow-x-auto
                      pb-1
                    "
                  >

                    <FilterButton
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
                      Todas
                    </FilterButton>

                    {seasons.map(
                      (season) => {

                        const data =
                          formatSeason(
                            season
                          );

                        return (
                          <FilterButton
                            key={
                              season
                            }
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


                {/* TIME */}

                <div>

                  <p
                    className="
                      mb-1.5
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      text-gray-700
                    "
                  >
                    Horário
                  </p>

                  <div className="flex gap-1.5">

                    <FilterButton
                      active={
                        selectedTime ===
                        "all"
                      }
                      onClick={() =>
                        setSelectedTime(
                          "all"
                        )
                      }
                    >
                      Todos
                    </FilterButton>

                    <FilterButton
                      active={
                        selectedTime ===
                        "morning"
                      }
                      onClick={() =>
                        setSelectedTime(
                          "morning"
                        )
                      }
                    >
                      🌅 Manhã
                    </FilterButton>

                    <FilterButton
                      active={
                        selectedTime ===
                        "day"
                      }
                      onClick={() =>
                        setSelectedTime(
                          "day"
                        )
                      }
                    >
                      ☀️ Dia
                    </FilterButton>

                    <FilterButton
                      active={
                        selectedTime ===
                        "night"
                      }
                      onClick={() =>
                        setSelectedTime(
                          "night"
                        )
                      }
                    >
                      🌙 Noite
                    </FilterButton>

                  </div>

                </div>


                {/* METHOD */}

                <div>

                  <p
                    className="
                      mb-1.5
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      text-gray-700
                    "
                  >
                    Método
                  </p>

                  <div
                    className="
                      flex
                      gap-1.5
                      overflow-x-auto
                      pb-1
                    "
                  >

                    <FilterButton
                      active={
                        selectedMethod ===
                        "all"
                      }
                      onClick={() =>
                        setSelectedMethod(
                          "all"
                        )
                      }
                    >
                      Todos
                    </FilterButton>

                    {methods.map(
                      (method) => (
                        <FilterButton
                          key={
                            method
                          }
                          active={
                            selectedMethod ===
                            method
                          }
                          onClick={() =>
                            setSelectedMethod(
                              method
                            )
                          }
                        >
                          {
                            getMethodIcon(
                              method
                            )
                          }{" "}
                          {
                            getMethodLabel(
                              method
                            )
                          }
                        </FilterButton>
                      )
                    )}

                  </div>

                </div>

              </div>

            </div>


            {/* =============================================
                MAP LIST
            ============================================= */}

            <RegionContent
              region={
                activeRegionData
              }
              season={
                selectedSeason
              }
              mode={
                selectedMode
              }
              method={
                selectedMethod
              }
              time={
                selectedTime
              }
              search={
                search
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

          <p className="mt-1 text-xs text-gray-700">
            Banco de mapas e encontros do PokeMMO.
          </p>

        </div>

      </footer>

    </main>
  );
}