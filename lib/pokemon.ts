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

/**
 * Converte nomes vindos do ShinyBoard/Supabase
 * para o formato utilizado pela PokeAPI.
 */
function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/[’']/g, "")
    .replace(/[.:]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Busca o Pokémon na PokeAPI.
 */
async function getPokemonData(
  name: string
): Promise<PokemonApiResponse | null> {
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
        `PokeAPI retornou ${response.status} para ${name}`
      );

      return null;
    }

    return (await response.json()) as PokemonApiResponse;
  } catch (error) {
    console.warn(
      `Erro ao buscar Pokémon ${name}:`,
      error
    );

    return null;
  }
}

/**
 * Sprite shiny ANIMADO.
 *
 * Prioridade:
 *
 * 1. PokeAPI Showdown shiny
 * 2. CDN do repositório PokeAPI
 * 3. Sprite shiny normal
 * 4. Official Artwork shiny
 */
export async function getPokemonShinyAnimatedSprite(
  name: string
): Promise<string | null> {
  const normalized = normalizeName(name);

  const data = await getPokemonData(name);

  /*
   * 1. Sprite animado da PokeAPI.
   */
  const showdown =
    data?.sprites?.other?.showdown?.front_shiny;

  if (showdown) {
    return showdown;
  }

  /*
   * 2. Fallback usando o ID.
   *
   * Esse caminho contém os GIFs animados
   * do repositório oficial de sprites da PokeAPI.
   */
  if (data?.id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${data.id}.gif`;
  }

  /*
   * 3. Fallback para sprite shiny normal.
   */
  const shiny =
    data?.sprites?.front_shiny;

  if (shiny) {
    return shiny;
  }

  /*
   * 4. Fallback para artwork.
   */
  const artwork =
    data?.sprites?.other?.[
      "official-artwork"
    ]?.front_shiny;

  if (artwork) {
    return artwork;
  }

  /*
   * Último fallback.
   */
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${normalized}.png`;
}

/**
 * Mantido para outras páginas do projeto.
 */
export async function getPokemonShinySprite(
  name: string
): Promise<string | null> {
  const data = await getPokemonData(name);

  if (data?.sprites?.front_shiny) {
    return data.sprites.front_shiny;
  }

  const artwork =
    data?.sprites?.other?.[
      "official-artwork"
    ]?.front_shiny;

  if (artwork) {
    return artwork;
  }

  if (data?.id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${data.id}.png`;
  }

  return null;
}