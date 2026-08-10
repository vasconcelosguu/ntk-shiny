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

  if (!id) {
    return null;
  }

  const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;

  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
      {
        next: {
          revalidate: 86400,
        },
      }
    );

    if (!res.ok) {
      return fallback;
    }

    const data = await res.json();

    return data.sprites?.front_shiny ?? fallback;
  } catch {
    return fallback;
  }
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

  const points = data.points;
  const pokemon = data.pokemon;

  const sprites = await Promise.all(
    pokemon.map(async (name) => {
      const sprite = await getShinySprite(name);

      return {
        name,
        sprite,
      };
    })
  );

  return (
    <main className="container">
      <Link className="back" href="/">
        ← Voltar para tiers
      </Link>

      <section className="hero">
        <div>
          <p className="eyebrow">SHINY TIER</p>

          <h1>Tier {tier}</h1>

          <p>{points} pontos por shiny.</p>
        </div>

        <div className="bigScore">
          {points}

          <small>POINTS</small>
        </div>
      </section>

      <div className="tierHeader">
        <span className="badge">
          TIER {tier}
        </span>

        <span className="muted">
          {points} pontos
        </span>

        <span className="count">
          {pokemon.length} Pokémon
        </span>
      </div>

      <div className="grid">
        {sprites.map(({ name, sprite }) => (
          <Link
            className="card"
            href={`/pokemon/${encodeURIComponent(
              name.toLowerCase()
            )}`}
            key={name}
          >
            <div className="num">
              #{String(dex[name]).padStart(3, "0")}
            </div>

            <div className="name">
              {name}
            </div>

            <div className="pts">
              {points} pts
            </div>

            {sprite && (
              <img
                className="sprite"
                src={sprite}
                alt={`Shiny ${name}`}
                width={82}
                height={82}
              />
            )}
          </Link>
        ))}
      </div>

      <p className="note">
        As sprites shiny são obtidas através da PokeAPI.
      </p>
    </main>
  );
}