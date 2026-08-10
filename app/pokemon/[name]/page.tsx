import Link from "next/link";
import { notFound } from "next/navigation";
import { tiers, dex } from "../../../lib/data";

export const revalidate = 86400;

type PokemonInfo = {
  name: string;
  id: number;
  tier: string;
  points: number;
  sprite: string;
};

function findPokemon(name: string): PokemonInfo | null {
  const normalized = name.toLowerCase();

  for (const [tier, data] of Object.entries(tiers)) {
    const pokemon = data.pokemon.find(
      (pokemonName) =>
        pokemonName.toLowerCase() === normalized
    );

    if (pokemon) {
      const id = dex[pokemon];

      return {
        name: pokemon,
        id,
        tier,
        points: data.points,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`,
      };
    }
  }

  return null;
}

export function generateStaticParams() {
  const params: { name: string }[] = [];

  Object.values(tiers).forEach((tier) => {
    tier.pokemon.forEach((pokemon) => {
      params.push({
        name: pokemon.toLowerCase(),
      });
    });
  });

  return params;
}

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const pokemon = findPokemon(name);

  if (!pokemon) {
    notFound();
  }

  return (
    <div className="page">
      <section className="pokemon-detail">
        <div className="container">
          <Link
            href={`/tiers/${pokemon.tier}`}
            className="back-link"
          >
            ← Voltar para Tier {pokemon.tier}
          </Link>

          <div className="pokemon-detail-card">
            <div className="pokemon-detail-image">
              <img
                src={pokemon.sprite}
                alt={`Shiny ${pokemon.name}`}
              />
            </div>

            <div className="pokemon-detail-content">
              <span className="eyebrow">
                SHINY POKÉMON
              </span>

              <h1>{pokemon.name}</h1>

              <span className="pokedex-number">
                #{String(pokemon.id).padStart(3, "0")}
              </span>

              <div className="pokemon-detail-stats">
                <div>
                  <span>Tier</span>
                  <strong>T{pokemon.tier}</strong>
                </div>

                <div>
                  <span>Pontuação</span>
                  <strong>
                    {pokemon.points} pts
                  </strong>
                </div>
              </div>

              <div className="pokemon-status">
                <span className="status-dot" />

                <div>
                  <strong>
                    Shiny cadastrado
                  </strong>

                  <p>
                    Este Pokémon faz parte da tabela
                    oficial de shinies do neverTakeBan.
                  </p>
                </div>
              </div>

              <Link
                href={`/tiers/${pokemon.tier}`}
                className="primary-button"
              >
                Ver Tier {pokemon.tier}
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}