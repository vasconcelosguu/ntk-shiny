import Link from "next/link";

export default function ShinyHuntPage() {
  return (
    <main className="min-h-screen">
      {/* =========================
          HERO
      ========================= */}

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20">
          <div className="max-w-3xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-400">
              PokeMMO • SHINY HUNT
            </div>

            <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">
              Shiny Hunt
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
              Acompanhe os shinies dos membros do
              neverTakeBan, estatísticas de encontros
              e informações das nossas hunts.
            </p>

          </div>
        </div>
      </section>

      {/* =========================
          NAVEGAÇÃO
      ========================= */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* PLAYERS */}

          <Link
            href="/hunt/shiny/players"
            className="
              group
              rounded-2xl
              border
              border-white/[0.07]
              bg-[#0d111c]
              p-6
              transition
              duration-200
              hover:-translate-y-1
              hover:border-violet-500/30
              hover:bg-[#111625]
              hover:shadow-2xl
              hover:shadow-violet-950/20
            "
          >

            <div className="flex items-start justify-between">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-violet-500/20
                  bg-violet-500/10
                  text-2xl
                "
              >
                ✦
              </div>

              <span
                className="
                  text-sm
                  text-gray-600
                  transition
                  group-hover:translate-x-1
                  group-hover:text-violet-400
                "
              >
                →
              </span>

            </div>

            <h2 className="mt-6 text-2xl font-black text-white">
              Players
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Veja os shinies registrados por cada
              membro do neverTakeBan e acompanhe
              seus encontros.
            </p>

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
                transition
                group-hover:text-violet-400
              "
            >
              Ver players
            </div>

          </Link>

          {/* TIERS */}

          <Link
            href="/hunt/shiny/tiers"
            className="
              group
              rounded-2xl
              border
              border-white/[0.07]
              bg-[#0d111c]
              p-6
              transition
              duration-200
              hover:-translate-y-1
              hover:border-violet-500/30
              hover:bg-[#111625]
              hover:shadow-2xl
              hover:shadow-violet-950/20
            "
          >

            <div className="flex items-start justify-between">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-violet-500/20
                  bg-violet-500/10
                  text-2xl
                "
              >
                🏆
              </div>

              <span
                className="
                  text-sm
                  text-gray-600
                  transition
                  group-hover:translate-x-1
                  group-hover:text-violet-400
                "
              >
                →
              </span>

            </div>

            <h2 className="mt-6 text-2xl font-black text-white">
              Tiers
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Consulte os Pokémon organizados por
              tier e veja quais shinies fazem parte
              de cada categoria.
            </p>

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
                transition
                group-hover:text-violet-400
              "
            >
              Ver tiers
            </div>

          </Link>

        </div>

      </section>

      {/* =========================
          INFO
      ========================= */}

      <section className="mx-auto max-w-7xl px-6 pb-16">

        <div
          className="
            rounded-2xl
            border
            border-white/[0.07]
            bg-white/[0.015]
            p-6
          "
        >

          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-violet-500/20
                bg-violet-500/10
                text-lg
              "
            >
              ✨
            </div>

            <div>

              <h2 className="font-bold text-white">
                Banco de dados de Shinies
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Os dados dos players são sincronizados
                manualmente a partir do ShinyBoard e
                armazenados no banco de dados do
                neverTakeBan.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}