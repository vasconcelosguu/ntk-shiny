import Link from "next/link";
import { tiers } from "../lib/data";

export default function Home() {
  const total = Object.values(tiers).reduce(
    (sum, tier) => sum + tier.pokemon.length,
    0
  );

  return (
    <div className="page">
      <section className="hero">
        <div className="container">
          <div className="eyebrow">POKEMMO • SHINY DATABASE</div>

          <h1>Shiny Tiers</h1>

          <p className="hero-description">
            Os shinies do <strong>neverTakeBan</strong> organizados por
            tier e pontuação.
          </p>

          <div className="stats">
            <div className="stat">
              <span className="stat-value">{total}</span>
              <span className="stat-label">ENTRADAS</span>
            </div>

            <div className="stat">
              <span className="stat-value">8</span>
              <span className="stat-label">TIERS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container tiers-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CLASSIFICAÇÃO</span>
            <h2>Todos os Tiers</h2>
          </div>

          <span className="section-count">{total} Pokémon</span>
        </div>

        <div className="tiers-grid">
          {Object.entries(tiers).map(([tier, data]) => (
            <Link
              key={tier}
              href={`/tiers/${tier}`}
              className={`tier-card tier-${tier}`}
            >
              <div className="tier-card-top">
                <div className="tier-badge">
                  TIER {tier}
                </div>

                <div className="tier-points">
                  {data.points} pts
                </div>
              </div>

              <div className="tier-card-middle">
                <span className="tier-number">
                  {String(tier).padStart(2, "0")}
                </span>

                <div>
                  <strong>
                    {data.pokemon.length} Pokémon
                  </strong>

                  <span>
                    Shinies disponíveis neste tier
                  </span>
                </div>
              </div>

              <div className="tier-card-bottom">
                <span>Ver tier</span>
                <span className="arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}