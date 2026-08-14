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
 * Busca a sprite shiny do Pokémon.
 *
 * Prioridade:
 *
 * 1. PokeAPI Showdown shiny animada
 * 2. CDN Showdown shiny animada
 * 3. Sprite shiny normal
 * 4. Official Artwork shiny
 *
 * O resultado é uma URL que pode ser utilizada
 * diretamente em <img src="..." />.
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
        `PokeAPI retornou ${response.status} para ${name}`
      );

      return null;
    }

    const data =
      (await response.json()) as PokemonApiResponse;

    /*
     * ==========================================
     * 1. SHOWDOWN SHINY ANIMADA
     * ==========================================
     *
     * Essa é a opção que queremos usar.
     *
     * Normalmente é um GIF animado.
     */
    const animatedShiny =
      data.sprites.other?.showdown?.front_shiny;

    if (animatedShiny) {
      return animatedShiny;
    }

    /*
     * ==========================================
     * 2. FALLBACK DIRETO PARA O CDN SHOWDOWN
     * ==========================================
     *
     * Usamos o ID do Pokémon, não o nome.
     */
    if (data.id) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${data.id}.gif`;
    }

    /*
     * ==========================================
     * 3. SPRITE SHINY NORMAL
     * ==========================================
     */
    if (data.sprites.front_shiny) {
      return data.sprites.front_shiny;
    }

    /*
     * ==========================================
     * 4. OFFICIAL ARTWORK SHINY
     * ==========================================
     */
    const artwork =
      data.sprites.other?.[
        "official-artwork"
      ]?.front_shiny;

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