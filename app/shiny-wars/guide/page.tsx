import Link from "next/link";

export default function ShinyHuntGuidePage() {
  return (
    <div className="page">
      <section className="hero">
        <div className="container">
          <Link href="/shiny-wars" className="back-link">
            ← Voltar para Shiny Wars
          </Link>

          <div className="eyebrow">
            NEVERTAKEBAN • SHINY WARS
          </div>

          <h1>Guia de Hunt</h1>

          <p className="hero-description">
            Guia da NeverTakeBan para caça de Shinies no PokeMMO.
            Métodos, preparação, locais e dicas para aumentar sua
            eficiência durante as hunts.
          </p>
        </div>
      </section>

      <main className="container guide-content">
        <section className="guide-card">
          <span className="feature-label">
            INTRODUÇÃO
          </span>

          <h2>Como começar uma Hunt?</h2>

          <p>
            Antes de iniciar uma Hunt, prepare seu Pokémon,
            estoque de recursos e defina o método que será utilizado.
          </p>
        </section>

        <section className="guide-grid">
          <article className="guide-card">
            <span className="guide-number">01</span>

            <h2>Escolha o Pokémon</h2>

            <p>
              Defina qual Shiny você deseja encontrar e consulte
              a Shiny Board para verificar seu tier e pontuação.
            </p>
          </article>

          <article className="guide-card">
            <span className="guide-number">02</span>

            <h2>Escolha o método</h2>

            <p>
              Existem diferentes métodos de Hunt. Escolha aquele
              que melhor se adapta ao Pokémon procurado.
            </p>
          </article>

          <article className="guide-card">
            <span className="guide-number">03</span>

            <h2>Prepare os recursos</h2>

            <p>
              Tenha Poké Balls, PP, dinheiro e Pokémon adequados
              antes de começar sua sessão.
            </p>
          </article>

          <article className="guide-card">
            <span className="guide-number">04</span>

            <h2>Comece a Hunt</h2>

            <p>
              Organize sua sessão e acompanhe seu progresso
              durante a busca pelo Shiny.
            </p>
          </article>
        </section>

        <section className="guide-card hunt-warning">
          <span className="feature-label">
            NEVERTAKEBAN
          </span>

          <h2>Em breve</h2>

          <p>
            Aqui vamos adicionar os guias completos de Hunt da
            NeverTakeBan, incluindo hordas, locais, métodos,
            Pokémon recomendados e outras informações.
          </p>
        </section>
      </main>
    </div>
  );
}