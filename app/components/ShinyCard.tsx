import ShinyActions from "./ShinyActions";

type ShinyCardProps = {
  id: string;
  username: string;
  pokemon: string;
  nickname?: string | null;
  encounters?: number | null;
  method?: string | null;
  region?: string | null;
  location?: string | null;
  canManage?: boolean;
};

type PokemonResponse = {
  sprites: {
    front_shiny: string | null;
  };
};

export default async function ShinyCard({
  id,
  username,
  pokemon,
  nickname,
  encounters,
  method,
  region,
  location,
  canManage = false,
}: ShinyCardProps) {
  const pokemonName = pokemon
    .toLowerCase()
    .trim()
    .replaceAll(" ", "-");

  let shinySprite: string | null = null;

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
      {
        next: {
          revalidate: 86400,
        },
      }
    );

    if (response.ok) {
      const data: PokemonResponse =
        await response.json();

      shinySprite =
        data.sprites.front_shiny;
    }
  } catch (error) {
    console.error(
      `Erro ao buscar sprite shiny de ${pokemon}:`,
      error
    );
  }

  return (
    <article className="shiny-card">
      <div className="shiny-card-top">
        <span className="shiny-badge">
          ✦ SHINY
        </span>

        {encounters !== null &&
          encounters !== undefined && (
            <span className="encounter-badge">
              {encounters.toLocaleString(
                "pt-BR"
              )} enc.
            </span>
          )}
      </div>

      <div className="shiny-card-image">
        {shinySprite ? (
          <img
            src={shinySprite}
            alt={`Shiny ${pokemon}`}
            width={180}
            height={180}
          />
        ) : (
          <div className="shiny-card-placeholder">
            ?
          </div>
        )}
      </div>

      <div className="shiny-card-content">
        <h3>{pokemon}</h3>

        {nickname && (
          <p className="shiny-nickname">
            "{nickname}"
          </p>
        )}

        <div className="shiny-details">
          {method && (
            <div>
              <span>MÉTODO</span>
              <strong>{method}</strong>
            </div>
          )}

          {region && (
            <div>
              <span>REGIÃO</span>
              <strong>{region}</strong>
            </div>
          )}

          {location && (
            <div>
              <span>LOCAL</span>
              <strong>{location}</strong>
            </div>
          )}
        </div>

        {canManage && (
          <ShinyActions
            shinyId={id}
            username={username}
          />
        )}
      </div>
    </article>
  );
}