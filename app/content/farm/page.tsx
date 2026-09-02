import Link from "next/link";

const farmChannels = [
  {
    name: "Gym Run",
    slug: "gym-run",
    icon: "💰",
    description:
      "Estratégias e informações para realizar Gym Runs de forma eficiente.",
  },
  {
    name: "Morimoto / Cynthia",
    slug: "morimoto-cynthia",
    icon: "👤",
    description:
      "Informações, estratégias e recompensas dos NPCs Morimoto e Cynthia.",
  },
  {
    name: "Ho-Oh",
    slug: "ho-oh",
    icon: "🔥",
    description:
      "Guia para o confronto contra Ho-Oh e informações sobre suas recompensas.",
  },
  {
    name: "Apricorn",
    slug: "apricorn",
    icon: "🌱",
    description:
      "Locais, métodos e informações para farmar Apricorns.",
  },
  {
    name: "Elite 4",
    slug: "elite-4",
    icon: "⚔️",
    description:
      "Rotas e estratégias para farmar a Elite 4 com eficiência.",
  },
  {
    name: "Red",
    slug: "red",
    icon: "👑",
    description:
      "Estratégias e informações para o farm do Red.",
  },
];

export default function FarmPage() {
  return (
    <main className="min-h-screen bg-[#050605] text-white">

      {/* =====================================================
          HEADER DA PÁGINA
      ===================================================== */}

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-lime-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">

          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-gray-500
              transition-colors
              hover:text-lime-400
            "
          >
            ← Voltar
          </Link>

          <div className="mt-8 flex items-start gap-5">

            {/* ÍCONE */}

            <div
              className="
                flex
                h-16
                w-16
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-lime-400/20
                bg-lime-400/10
                text-3xl
              "
            >
              💰
            </div>

            {/* TEXTO */}

            <div>

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-lime-400
                "
              >
                PokeMMO • Farm
              </p>

              <h1
                className="
                  mt-2
                  text-4xl
                  font-black
                  tracking-tight
                  text-white
                  md:text-5xl
                "
              >
                Farm
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-gray-400
                "
              >
                Métodos, estratégias e informações para
                farmar recursos, dinheiro e recompensas
                no PokeMMO.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            lg:grid-cols-3
          "
        >

          {farmChannels.map((channel) => (

            <Link
              key={channel.slug}
              href={`/farm/${channel.slug}`}
              className="
                group
                rounded-2xl
                border
                border-white/[0.07]
                bg-[#0b100c]
                p-6

                transition-all
                duration-200

                hover:-translate-y-1
                hover:border-lime-400/30
                hover:bg-[#101610]

                hover:shadow-2xl
                hover:shadow-lime-950/20
              "
            >

              {/* TOP */}

              <div className="flex items-start justify-between">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.035]
                    text-2xl

                    transition-all
                    duration-200

                    group-hover:border-lime-400/20
                    group-hover:bg-lime-400/10
                  "
                >
                  {channel.icon}
                </div>

                <span
                  className="
                    text-lg
                    text-gray-600

                    transition-all
                    duration-200

                    group-hover:translate-x-1
                    group-hover:text-lime-400
                  "
                >
                  →
                </span>

              </div>

              {/* NOME */}

              <h2
                className="
                  mt-6
                  text-xl
                  font-black
                  text-white
                  transition-colors
                  group-hover:text-lime-400
                "
              >
                {channel.name}
              </h2>

              {/* DESCRIÇÃO */}

              <p
                className="
                  mt-2
                  min-h-12
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                {channel.description}
              </p>

              {/* FOOTER */}

              <div
                className="
                  mt-6
                  border-t
                  border-white/[0.06]
                  pt-4
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-gray-600

                  transition-colors
                  group-hover:text-lime-400
                "
              >
                Acessar seção
              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}