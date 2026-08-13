export async function getPokemonShinySprite(
  name: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`,
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

    // Sprite animada shiny da Gen V
    return (
      data.sprites?.versions?.["generation-v"]?.[
        "black-white"
      ]?.animated?.front_shiny ??
      // fallback para sprite shiny normal
      data.sprites?.front_shiny ??
      null
    );
  } catch (error) {
    console.error(
      `Erro ao buscar sprite de ${name}:`,
      error
    );

    return null;
  }
}