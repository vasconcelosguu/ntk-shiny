import monstersData from "../data/monsters.json";

/* =========================================================
   TIPOS DO JSON ORIGINAL
========================================================= */

type RawLocation = {
  form: number;
  type: string;

  region_id: number;
  region_name: string;

  location_id: number;
  location_name: string;
  location_name_full: string;

  min_level: number;
  max_level: number;

  season: string;

  is_horde_3x: boolean;
  is_horde_5x: boolean;

  rarity_flags: number;

  rarity_morning: string;
  rarity_day: string;
  rarity_night: string;
};

type RawPokemon = {
  id: number;
  name: string;

  locations?: RawLocation[];
};

/* =========================================================
   TIPOS USADOS PELA PÁGINA
========================================================= */

export type MapEncounter = {
  pokemonId: number;
  pokemon: string;

  form: number;

  method: string;

  regionId: number;
  regionName: string;

  locationId: number;
  locationName: string;
  locationFullName: string;

  minLevel: number | null;
  maxLevel: number | null;

  season: string;

  isHorde3x: boolean;
  isHorde5x: boolean;

  rarityFlags: number;

  rarityMorning: string;
  rarityDay: string;
  rarityNight: string;
};

export type MapLocation = {
  id: number;
  name: string;
  fullName: string;

  regionId: number;
  regionName: string;

  encounters: MapEncounter[];
};

export type MapRegion = {
  id: number;
  name: string;

  locations: MapLocation[];
};

/* =========================================================
   REGIÕES
========================================================= */

const REGION_ORDER = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
];

/* =========================================================
   ESTAÇÕES
========================================================= */

export const MAP_SEASONS = [
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
] as const;

export type MapSeason =
  | "Spring"
  | "Summer"
  | "Autumn"
  | "Winter"
  | "Any"
  | "all";

/**
 * "Any" significa que o encontro existe em todas
 * as estações.
 */
export function encounterMatchesSeason(
  encounter: MapEncounter,
  season: string
) {
  if (season === "all") {
    return true;
  }

  if (encounter.season === "Any") {
    return true;
  }

  return (
    encounter.season.toLowerCase() ===
    season.toLowerCase()
  );
}

/* =========================================================
   NORMALIZAÇÃO
========================================================= */

function normalizeLevel(
  value: unknown
): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  /*
   * Alguns dados especiais podem utilizar valores
   * negativos para representar níveis inexistentes.
   */
  if (value < 0) {
    return null;
  }

  return value;
}

function normalizeSeason(
  value: unknown
): string {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return "Any";
  }

  const normalized = value.trim();

  if (
    normalized.toLowerCase() === "any"
  ) {
    return "Any";
  }

  return normalized;
}

function normalizeRarity(
  value: unknown
): string {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return "--";
  }

  return value.trim();
}

/* =========================================================
   CONVERSÃO DE ENCOUNTER
========================================================= */

function createEncounter(
  pokemon: RawPokemon,
  location: RawLocation
): MapEncounter {
  return {
    pokemonId: pokemon.id,

    pokemon: pokemon.name,

    form:
      typeof location.form === "number"
        ? location.form
        : -1,

    method:
      location.type || "Unknown",

    regionId:
      location.region_id,

    regionName:
      location.region_name,

    locationId:
      location.location_id,

    locationName:
      location.location_name,

    locationFullName:
      location.location_name_full ||
      location.location_name,

    minLevel:
      normalizeLevel(
        location.min_level
      ),

    maxLevel:
      normalizeLevel(
        location.max_level
      ),

    season:
      normalizeSeason(
        location.season
      ),

    isHorde3x:
      Boolean(
        location.is_horde_3x
      ),

    isHorde5x:
      Boolean(
        location.is_horde_5x
      ),

    rarityFlags:
      typeof location.rarity_flags ===
      "number"
        ? location.rarity_flags
        : 0,

    rarityMorning:
      normalizeRarity(
        location.rarity_morning
      ),

    rarityDay:
      normalizeRarity(
        location.rarity_day
      ),

    rarityNight:
      normalizeRarity(
        location.rarity_night
      ),
  };
}

/* =========================================================
   DEDUPLICAÇÃO
========================================================= */

function encounterKey(
  encounter: MapEncounter
) {
  return [
    encounter.pokemonId,
    encounter.form,

    encounter.method,

    encounter.regionId,
    encounter.locationId,

    encounter.minLevel,
    encounter.maxLevel,

    encounter.season,

    encounter.isHorde3x ? "3x" : "",
    encounter.isHorde5x ? "5x" : "",

    encounter.rarityFlags,

    encounter.rarityMorning,
    encounter.rarityDay,
    encounter.rarityNight,
  ].join("|");
}

/* =========================================================
   BUILD DOS MAPAS
========================================================= */

export function getMapRegions(): MapRegion[] {
  const pokemonList =
    monstersData as RawPokemon[];

  const regionMap =
    new Map<
      number,
      MapRegion
    >();

  for (const pokemon of pokemonList) {
    if (
      !pokemon ||
      typeof pokemon.id !== "number" ||
      !pokemon.name
    ) {
      continue;
    }

    if (
      !Array.isArray(
        pokemon.locations
      )
    ) {
      continue;
    }

    for (const rawLocation of pokemon.locations) {
      if (
        !rawLocation ||
        typeof rawLocation.location_id !==
          "number"
      ) {
        continue;
      }

      const encounter =
        createEncounter(
          pokemon,
          rawLocation
        );

      /* =========================================
         REGION
      ========================================= */

      let region =
        regionMap.get(
          encounter.regionId
        );

      if (!region) {
        region = {
          id: encounter.regionId,
          name: encounter.regionName,
          locations: [],
        };

        regionMap.set(
          encounter.regionId,
          region
        );
      }

      /* =========================================
         LOCATION
      ========================================= */

      let location =
        region.locations.find(
          (item) =>
            item.id ===
              encounter.locationId
        );

      if (!location) {
        location = {
          id:
            encounter.locationId,

          name:
            encounter.locationName,

          fullName:
            encounter.locationFullName,

          regionId:
            encounter.regionId,

          regionName:
            encounter.regionName,

          encounters: [],
        };

        region.locations.push(
          location
        );
      }

      /* =========================================
         ENCOUNTER
      ========================================= */

      location.encounters.push(
        encounter
      );
    }
  }

  /* =======================================================
     DEDUPLICAÇÃO + ORDENAÇÃO
  ======================================================= */

  for (const region of regionMap.values()) {
    for (const location of region.locations) {
      const unique =
        new Map<
          string,
          MapEncounter
        >();

      for (const encounter of location.encounters) {
        const key =
          encounterKey(
            encounter
          );

        if (!unique.has(key)) {
          unique.set(
            key,
            encounter
          );
        }
      }

      location.encounters =
        Array.from(
          unique.values()
        );

      location.encounters.sort(
        compareEncounters
      );
    }

    region.locations.sort(
      (a, b) =>
        a.name.localeCompare(
          b.name,
          "pt-BR"
        )
    );
  }

  const regions =
    Array.from(
      regionMap.values()
    );

  regions.sort(
    (a, b) => {
      const ai =
        REGION_ORDER.indexOf(
          a.name
        );

      const bi =
        REGION_ORDER.indexOf(
          b.name
        );

      if (
        ai !== -1 &&
        bi !== -1
      ) {
        return ai - bi;
      }

      if (ai !== -1) {
        return -1;
      }

      if (bi !== -1) {
        return 1;
      }

      return a.name.localeCompare(
        b.name,
        "pt-BR"
      );
    }
  );

  return regions;
}

/* =========================================================
   ORDENAÇÃO DE ENCOUNTERS
========================================================= */

function compareEncounters(
  a: MapEncounter,
  b: MapEncounter
) {
  /*
   * Normal primeiro,
   * depois 3x,
   * depois 5x.
   */
  const hordeRank = (
    encounter: MapEncounter
  ) => {
    if (encounter.isHorde5x) {
      return 2;
    }

    if (encounter.isHorde3x) {
      return 1;
    }

    return 0;
  };

  const hordeDifference =
    hordeRank(a) -
    hordeRank(b);

  if (
    hordeDifference !== 0
  ) {
    return hordeDifference;
  }

  /*
   * Depois por método.
   */
  const methodDifference =
    a.method.localeCompare(
      b.method,
      "pt-BR"
    );

  if (
    methodDifference !== 0
  ) {
    return methodDifference;
  }

  /*
   * Depois por nível.
   */
  const aLevel =
    a.minLevel ?? 999;

  const bLevel =
    b.minLevel ?? 999;

  if (
    aLevel !== bLevel
  ) {
    return aLevel - bLevel;
  }

  return a.pokemon.localeCompare(
    b.pokemon,
    "pt-BR"
  );
}

/* =========================================================
   ESTATÍSTICAS
========================================================= */

export function getMapStatistics(
  regions: MapRegion[]
) {
  const locations =
    regions.flatMap(
      (region) =>
        region.locations
    );

  const encounters =
    locations.flatMap(
      (location) =>
        location.encounters
    );

  const pokemon =
    new Set(
      encounters.map(
        (encounter) =>
          encounter.pokemonId
      )
    );

  const horde3x =
    encounters.filter(
      (encounter) =>
        encounter.isHorde3x
    ).length;

  const horde5x =
    encounters.filter(
      (encounter) =>
        encounter.isHorde5x
    ).length;

  return {
    regions:
      regions.length,

    locations:
      locations.length,

    encounters:
      encounters.length,

    pokemon:
      pokemon.size,

    horde3x,

    horde5x,
  };
}

/* =========================================================
   BUSCA
========================================================= */

export function findMapLocation(
  regions: MapRegion[],
  locationId: number
) {
  for (const region of regions) {
    const location =
      region.locations.find(
        (item) =>
          item.id ===
          locationId
      );

    if (location) {
      return location;
    }
  }

  return undefined;
}

export function findPokemonLocations(
  regions: MapRegion[],
  pokemonId: number
) {
  const results: Array<{
    region: MapRegion;
    location: MapLocation;
    encounters: MapEncounter[];
  }> = [];

  for (const region of regions) {
    for (const location of region.locations) {
      const encounters =
        location.encounters.filter(
          (encounter) =>
            encounter.pokemonId ===
            pokemonId
        );

      if (
        encounters.length > 0
      ) {
        results.push({
          region,
          location,
          encounters,
        });
      }
    }
  }

  return results;
}