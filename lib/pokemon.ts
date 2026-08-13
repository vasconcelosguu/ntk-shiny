type PokemonApiResponse = {
  id: number;
  name: string;

  sprites: {
    front_default: string | null;
    front_shiny: string | null;

    other?: {
      "official-artwork"?: {
        front_default: string | null;
        front_shiny: string | null;
      };

      showdown?: {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
};

/*
 * Nomes especiais que podem aparecer
 * no ShinyBoard e precisam ser convertidos
 * para o formato da PokeAPI.
 */
const pokemonAliases: Record<string, string> = {
  "mr. mime": "mr-mime",
  "mr mime": "mr-mime",

  "mr. rime": "mr-rime",
  "mr rime": "mr-rime",

  "mime jr.": "mime-jr",
  "mime jr": "mime-jr",

  "farfetch'd": "farfetchd",
  "farfetch’d": "farfetchd",

  "sirfetch'd": "sirfetchd",
  "sirfetch’d": "sirfetchd",

  "flabébé": "flabebe",
  flabebe: "flabebe",

  "nidoran♀": "nidoran-f",
  "nidoran♂": "nidoran-m",

  "nidoran-f": "nidoran-f",
  "nidoran-m": "nidoran-m",

  deoxys: "deoxys-normal",
  wormadam: "wormadam-plant",
  giratina: "giratina-altered",
  shaymin: "shaymin-land",

  basculin: "basculin-red-striped",
  darmanitan: "darmanitan-standard",

  tornadus: "tornadus-incarnate",
  thundurus: "thundurus-incarnate",
  landorus: "landorus-incarnate",

  keldeo: "keldeo-ordinary",
  meloetta: "meloetta-aria",

  meowstic: "meowstic-male",
  aegislash: "aegislash-shield",

  pumpkaboo: "pumpkaboo-average",
  gourgeist: "gourgeist-average",

  oricorio: "oricorio-baile",
  lycanroc: "lycanroc-midday",

  wishiwashi: "wishiwashi-solo",
  toxtricity: "toxtricity-amped",

  eiscue: "eiscue-ice",
  indeedee: "indeedee-male",

  morpeko: "morpeko-full-belly",
  urshifu: "urshifu-single-strike",

  basculegion: "basculegion-male",
  oinkologne: "oinkologne-male",
};

function normalizeName(name: string): string {
  const clean = name
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");

  if (pokemonAliases[clean]) {
    return pokemonAliases[clean];
  }

  return clean
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/'/g, "")
    .replace(/[.:]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Busca a sprite shiny pela PokeAPI.
 */
export async function getPokemonShinySprite(
  name: string
): Promise<string | null> {
  const normalized = normalizeName(name);

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
        normalized
      )}`,
      {
        next: {
          revalidate: 86400,
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `Pokémon não encontrado na PokeAPI: ${name} -> ${normalized}`
      );

      return null;
    }

    const data =
      (await response.json()) as PokemonApiResponse;

    /*
     * Primeiro: sprite shiny normal.
     */
    if (data.sprites.front_shiny) {
      return data.sprites.front_shiny;
    }

    /*
     * Segundo: sprite do Showdown.
     * Normalmente é animada.
     */
    const showdown =
      data.sprites.other?.showdown?.front_shiny;

    if (showdown) {
      return showdown;
    }

    /*
     * Terceiro: artwork oficial.
     */
    const artwork =
      data.sprites.other?.["official-artwork"]
        ?.front_shiny;

    if (artwork) {
      return artwork;
    }

    return null;
  } catch (error) {
    console.error(
      `Erro ao buscar sprite de ${name}:`,
      error
    );

    return null;
  }
}