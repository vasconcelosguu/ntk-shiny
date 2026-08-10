import Link from "next/link";
import { notFound } from "next/navigation";
import { tiers, dex } from "../../../lib/data";

export const revalidate = 86400;

export function generateStaticParams() {
  return Object.keys(tiers).map((tier) => ({
    tier,
  }));
}

async function getShinySprite(name: string) {
  const id = dex[name];

  if (!id) return null;

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
      {
        next: {
          revalidate: 86400,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      if (data.sprites?.front_shiny) {
        return data.sprites.front_shiny;
      }
    }
  } catch {
    // fallback abaixo
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
}

export default async function TierPage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier } = await params;

  const data = tiers[tier as keyof typeof tiers];

  if (!data) {
    notFound();
  }

  const sprites = await Promise.all(
    data.pokemon.map(async (name) => {
      const sprite = await getShinySprite(name);

      return {
        name,
        sprite,
      };
    })
  );

  return (
    <div className="page">
      <section className="tier-hero">
        <div className="container">
          <Link href="/" className="back-link">
            ← Voltar para tiers
          </Link>

          <div className="eyebrow">SHINY TIER</div>

          <div className="tier-title-row">
            <div>
              <h1>
                Tier {tier}
              </h1>

              <p>
                {data.points} pontos por shiny.
              </p>
            </div>

            <div className={`big-tier-badge tier-color-${tier}`}>
              <strong>{data.points}</strong>
              <span>POINTS</span>
            </div>
          </div>

          <div className="tier-summary">
            <div>
              <strong>TIER {tier}</strong>
              <span>{data.points} pontos</span>
            </div>

            <div>
              <strong>{data.pokemon.length}</strong>
              <span>Pokémon</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container pokemon-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              POKÉMON
            </span>

            <h2>
              Shinies do Tier {tier}
            </h2>
          </div>

          <span className="section-count">
            {data.pokemon.length} entradas
          </span>
        </div>

        <div className="pokemon-grid">
          {sprites.map(({ name, sprite }) => (
            <Link
              key={name}
              href={`/pokemon/${encodeURIComponent(
                name.toLowerCase()
              )}`}
              className="pokemon-card"
            >
              <div className="pokemon-image">
                {sprite ? (
                  <img
                    src={sprite}
                    alt={`Shiny ${name}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="sprite-placeholder">
                    ?
                  </div>
                )}
              </div>

              <div className="pokemon-info">
                <span className="pokemon-number">
                  #{String(dex[name]).padStart(3, "0")}
                </span>

                <strong>{name}</strong>

                <span className="pokemon-points">
                  {data.points} pts
                </span>
              </div>

              <div className="pokemon-arrow">
                →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}