import ShinyActions from "./ShinyActions";

import {
  getPokemonShinySprite,
} from "../../lib/pokemon";

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
  /*
   * Busca a sprite usando a mesma lógica
   * utilizada no restante do site.
   */
  const shinySprite =
    await getPokemonShinySprite(
      pokemon
    );

  return (
    <article className="shiny-card">

      {/* TOP */}

      <div className="shiny-card-top">

        <span className="shiny-badge">
          ✦ SHINY
        </span>

        {encounters !== null &&
          encounters !== undefined && (
            <span className="encounter-badge">
              {encounters.toLocaleString(
                "pt-BR"
              )}{" "}
              enc.
            </span>
          )}

      </div>

      {/* IMAGE */}

      <div className="shiny-card-image">

        {shinySprite ? (

          <img
            src={shinySprite}
            alt={`Shiny ${pokemon}`}
            width={180}
            height={180}
            loading="lazy"
          />

        ) : (

          <div className="shiny-card-placeholder">
            ?
          </div>

        )}

      </div>

      {/* CONTENT */}

      <div className="shiny-card-content">

        <h3>
          {pokemon}
        </h3>

        {nickname && (
          <p className="shiny-nickname">
            "{nickname}"
          </p>
        )}

        <div className="shiny-details">

          {method && (
            <div>
              <span>
                MÉTODO
              </span>

              <strong>
                {method}
              </strong>
            </div>
          )}

          {region && (
            <div>
              <span>
                REGIÃO
              </span>

              <strong>
                {region}
              </strong>
            </div>
          )}

          {location && (
            <div>
              <span>
                LOCAL
              </span>

              <strong>
                {location}
              </strong>
            </div>
          )}

        </div>

        {canManage && (
          <ShinyActions
            id={id}
            username={username}
            pokemon={pokemon}
          />
        )}

      </div>

    </article>
  );
}