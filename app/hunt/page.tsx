import Link from "next/link";

const huntChannels = [
  {
    name: "Alfa",
    slug: "alfa",
    icon: "👑",
    description:
      "Estratégias, locais e informações para encontrar Pokémon Alfa.",
  },
  {
    name: "Honey Tree",
    slug: "honey-tree",
    icon: "🍯",
    description:
      "Locais, Pokémon disponíveis e estratégias para Honey Trees.",
  },
  {
    name: "Shiny",
    slug: "shiny",
    icon: "✨",
    description:
      "Central de caça Shiny, jogadores, coleção e tiers.",
  },
];

export default function HuntPage() {
  return (
    <main className="min-h-screen bg-[#080b08] text-white">
      {/* HERO */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-lime-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-500 transition hover:text-lime-400"
          >
            ← Voltar
          </Link>

          <div className="mt-8 flex items-start gap-5">
            {/* ÍCONE */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10 text-3xl">
              ✨
            </div>

            {/* TÍTULO */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
                PokeMMO • Hunt
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
                Hunt
              </h1>

              <p className="mt-3 max-w-2xl text-gray-400">
                Guias, estratégias e ferramentas para caça de Pokémon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CANAIS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {huntChannels.map((channel) => (
            <Link
              key={channel.slug}
              href={`/hunt/${channel.slug}`}
              className="group rounded-2xl border border-white/[0.07] bg-[#0d120d] p-6 transition duration-200 hover:-translate-y-1 hover:border-lime-400/30 hover:bg-[#111811] hover:shadow-2xl hover:shadow-lime-950/20"
            >
              {/* TOPO DO CARD */}
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-2xl">
                  {channel.icon}
                </div>

                <span className="text-lg text-gray-600 transition group-hover:translate-x-1 group-hover:text-lime-400">
                  →
                </span>
              </div>

              {/* NOME */}
              <h2 className="mt-6 text-xl font-bold">
                {channel.name}
              </h2>

              {/* DESCRIÇÃO */}
              <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                {channel.description}
              </p>

              {/* LINK */}
              <div className="mt-6 border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-wider text-gray-600 transition group-hover:text-lime-400">
                Acessar seção
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}