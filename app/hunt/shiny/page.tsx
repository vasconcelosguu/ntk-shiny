import Link from "next/link";

export default function ShinyPage() {
  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">
          <Link
            href="/hunt"
            className="text-sm font-semibold text-gray-500 transition hover:text-violet-400"
          >
            ← Voltar para Hunt
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
              Hunt • Shiny
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Shiny Hunt
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-400 md:text-lg">
              Coleções, rankings, tiers e informações utilizadas
              pelo neverTakeBan para Shiny Hunting.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Link
            href="/hunt/shiny/players"
            className="group rounded-2xl border border-white/[0.07] bg-[#0d111c] p-7 transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#111625] hover:shadow-2xl hover:shadow-violet-950/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-2xl">
                👥
              </div>

              <span className="text-xl text-gray-700 transition group-hover:translate-x-1 group-hover:text-violet-400">
                →
              </span>
            </div>

            <h2 className="mt-7 text-2xl font-black">
              Coleções dos Players
            </h2>

            <p className="mt-3 leading-6 text-gray-500">
              Veja os Shinies registrados pelos membros do
              neverTakeBan diretamente através do ShinyBoard.
            </p>

            <div className="mt-7 border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-widest text-gray-600 transition group-hover:text-violet-400">
              Ver coleções
            </div>
          </Link>

          <Link
            href="/hunt/shiny/tiers"
            className="group rounded-2xl border border-white/[0.07] bg-[#0d111c] p-7 transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#111625] hover:shadow-2xl hover:shadow-violet-950/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10 text-2xl">
                ✨
              </div>

              <span className="text-xl text-gray-700 transition group-hover:translate-x-1 group-hover:text-violet-400">
                →
              </span>
            </div>

            <h2 className="mt-7 text-2xl font-black">
              Shiny Tiers
            </h2>

            <p className="mt-3 leading-6 text-gray-500">
              Consulte a classificação dos Shinies e a
              pontuação utilizada pelo time.
            </p>

            <div className="mt-7 border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-widest text-gray-600 transition group-hover:text-violet-400">
              Ver tiers
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}