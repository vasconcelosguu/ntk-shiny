import Link from "next/link";

const games = [
  {
    name: "Shiny Hunt",
    slug: "shiny_hunt",
    icon: "✨",
    description:
      "Simule uma caça Shiny contínua e veja com quantos encontros o Pokémon aparece.",
    status: "Disponível",
    accent:
      "border-lime-400/20 hover:border-lime-400/40 hover:shadow-lime-950/20",
    iconStyle:
      "border-lime-400/20 bg-lime-400/10",
    statusStyle:
      "border-lime-400/20 bg-lime-400/[0.06] text-lime-400",
  },
];

export default function JogosPage() {
  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      {/* HEADER */}

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-lime-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 transition hover:text-lime-400"
          >
            ← Voltar para início
          </Link>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
              neverTakeBan
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
              Jogos
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500 md:text-base">
              Pequenos jogos e ferramentas interativas para o time.
            </p>
          </div>
        </div>
      </section>

      {/* JOGOS */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <div className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400">
            Disponíveis
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            Escolha um jogo
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Ferramentas rápidas para usar enquanto joga.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/jogos/${game.slug}`}
              className={[
                "group rounded-2xl border bg-[#0d111c] p-5",
                "transition-all duration-200",
                "hover:-translate-y-1 hover:bg-[#111625]",
                "hover:shadow-2xl",
                game.accent,
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div
                  className={[
                    "flex h-12 w-12 items-center justify-center",
                    "rounded-xl border text-2xl",
                    game.iconStyle,
                  ].join(" ")}
                >
                  {game.icon}
                </div>

                <span
                  className={[
                    "rounded-full border px-2.5 py-1",
                    "text-[10px] font-bold uppercase tracking-wider",
                    game.statusStyle,
                  ].join(" ")}
                >
                  {game.status}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                {game.name}
              </h3>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                {game.description}
              </p>

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/[0.06]
                  pt-4
                "
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600 transition group-hover:text-lime-400">
                  Jogar agora
                </span>

                <span className="text-gray-700 transition group-hover:translate-x-1 group-hover:text-lime-400">
                  →
                </span>
              </div>
            </Link>
          ))}

          {/* FUTUROS JOGOS */}

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-white/[0.07]
              bg-white/[0.01]
              p-5
            "
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-xl">
              🎮
            </div>

            <h3 className="mt-5 text-lg font-black text-gray-400">
              Mais jogos em breve
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Novas ferramentas e jogos poderão ser adicionados aqui.
            </p>

            <div className="mt-5 border-t border-white/[0.05] pt-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-700">
                Em desenvolvimento
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

