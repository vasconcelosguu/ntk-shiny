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
 * para o formato utilizado pela PokeAPI.
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

/**
 * Normaliza o nome recebido do ShinyBoard
 * para o formato aceito pela PokeAPI.
 */
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
 * Cria URLs alternativas para a sprite.
 *
 * A primeira é a sprite retornada diretamente
 * pela PokeAPI.
 *
 * As demais servem como fallback.
 */
function createSpriteUrls(
  data: PokemonApiResponse
): string[] {
  const urls: string[] = [];

  /*
   * 1. Sprite shiny retornada pela PokeAPI.
   */
  if (data.sprites.front_shiny) {
    urls.push(data.sprites.front_shiny);
  }

  /*
   * 2. Sprite shiny do repositório oficial
   * de sprites utilizado pela PokeAPI.
   */
  if (data.id) {
    urls.push(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${data.id}.png`
    );
  }

  /*
   * 3. Artwork oficial shiny.
   */
  const artwork =
    data.sprites.other?.["official-artwork"]
      ?.front_shiny;

  if (artwork) {
    urls.push(artwork);
  }

  /*
   * 4. Showdown shiny.
   */
  const showdown =
    data.sprites.other?.showdown?.front_shiny;

  if (showdown) {
    urls.push(showdown);
  }

  /*
   * Remove URLs duplicadas.
   */
  return [...new Set(urls)];
}

/**
 * Busca as informações do Pokémon na PokeAPI
 * e retorna as URLs possíveis da sprite shiny.
 *
 * A primeira URL será usada normalmente.
 */
export async function getPokemonShinySprite(
  name: string
): Promise<string | null> {
  const normalized = normalizeName(name);

  const apiUrl =
    `https://pokeapi.co/api/v2/pokemon/` +
    `${encodeURIComponent(normalized)}`;

  try {
    const response = await fetch(apiUrl, {
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      console.warn(
        `[POKEAPI] Pokémon não encontrado: ${name} -> ${normalized} (${response.status})`
      );

      return null;
    }

    const data =
      (await response.json()) as PokemonApiResponse;

    const spriteUrls =
      createSpriteUrls(data);

    if (spriteUrls.length === 0) {
      console.warn(
        `[POKEAPI] Nenhuma sprite encontrada: ${name}`
      );

      return null;
    }

    console.log(
      `[POKEAPI] ${name} -> ${normalized} -> ID ${data.id}`
    );

    console.log(
      `[POKEAPI] Sprite: ${spriteUrls[0]}`
    );

    return spriteUrls[0];
  } catch (error) {
    console.error(
      `[POKEAPI] Erro ao buscar ${name}:`,
      error
    );

    return null;
  }
}

/**
 * Retorna todas as URLs possíveis da sprite.
 *
 * Isso será usado pelo componente de imagem
 * para tentar uma alternativa caso a primeira
 * URL não carregue.
 */
export async function getPokemonShinySprites(
  name: string
): Promise<string[]> {
  const normalized = normalizeName(name);

  const apiUrl =
    `https://pokeapi.co/api/v2/pokemon/` +
    `${encodeURIComponent(normalized)}`;

  try {
    const response = await fetch(apiUrl, {
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      console.warn(
        `[POKEAPI] Pokémon não encontrado: ${name} -> ${normalized}`
      );

      return [];
    }

    const data =
      (await response.json()) as PokemonApiResponse;

    return createSpriteUrls(data);
  } catch (error) {
    console.error(
      `[POKEAPI] Erro ao buscar sprites de ${name}:`,
      error
    );

    return [];
  }
}