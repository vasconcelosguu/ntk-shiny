export async function getPokemonShinySprite(name: string) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
        name.toLowerCase()
      )}`,
      {
        next: {
          revalidate: 86400,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.sprites?.front_shiny ?? null;
  } catch {
    return null;
  }
}