import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="page home-page">
      <section className="guild-hero">
        <div className="container guild-hero-content">
          <Image
            src="/images/ntb-logo.png"
            alt="NeverTakeBan"
            width={700}
            height={700}
            className="guild-logo"
            priority
          />

          <p className="guild-subtitle">
            NEVER TAKE BAN
          </p>

          <p className="guild-description">
            Comunidade NeverTakeBan no PokeMMO.
            <br />
            Hunts, eventos, guias e sistemas da nossa guilda.
          </p>
        </div>
      </section>

      <main className="container home-content">
        <section className="team-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">NOSSO TIME</span>
              <h2>NeverTakeBan</h2>
            </div>
          </div>

          <div className="team-image-card">
            <Image
              src="/images/team.png"
              alt="Membros da NeverTakeBan no PokeMMO"
              width={404}
              height={100}
              className="team-image"
            />
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SISTEMAS</span>
              <h2>NeverTakeBan</h2>
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-card shiny-wars-card">
              <div className="feature-card-header">
                <div>
                  <span className="feature-label">
                    SISTEMA DA GUILDA
                  </span>

                  <h3>SHINY WARS</h3>
                </div>

                <span className="feature-icon">✦</span>
              </div>

              <p>
                Nosso sistema de caça de Shinies, com
                classificação, pontuação e guias para os membros
                da guilda.
              </p>

              <div className="feature-actions">
                <Link
                  href="/shiny-wars"
                  className="feature-button primary"
                >
                  Shiny Board
                  <span>→</span>
                </Link>

                <Link
                  href="/shiny-wars/guide"
                  className="feature-button"
                >
                  Guia de Hunt
                  <span>→</span>
                </Link>
              </div>
            </div>

            <Link
              href="/members"
              className="feature-card"
            >
              <span className="feature-label">
                GUILDA
              </span>

              <h3>Membros</h3>

              <p>
                Conheça os integrantes da NeverTakeBan.
              </p>

              <span className="feature-link">
                Ver membros →
              </span>
            </Link>

            <Link
              href="/guides"
              className="feature-card"
            >
              <span className="feature-label">
                CONHECIMENTO
              </span>

              <h3>Guias</h3>

              <p>
                Informações e guias úteis para PokeMMO.
              </p>

              <span className="feature-link">
                Ver guias →
              </span>
            </Link>

            <Link
              href="/events"
              className="feature-card"
            >
              <span className="feature-label">
                COMUNIDADE
              </span>

              <h3>Eventos</h3>

              <p>
                Eventos e atividades organizadas pela guilda.
              </p>

              <span className="feature-link">
                Ver eventos →
              </span>
            </Link>

            <Link
              href="/about"
              className="feature-card"
            >
              <span className="feature-label">
                NEVERTAKEBAN
              </span>

              <h3>Sobre a Guilda</h3>

              <p>
                Conheça nossa história, objetivos e comunidade.
              </p>

              <span className="feature-link">
                Conhecer →
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}