import Link from "next/link";
import { teamCategories } from "../../../lib/team";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-400">
              PokeMMO • Team Portal
            </div>

            <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">
              neverTakeBan
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
              Central de estratégias, guias, builds e informações
              utilizadas pelo time no PokeMMO.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="space-y-12">
          {teamCategories.map((category) => (
            <section key={category.slug}>
              {/* CATEGORY HEADER */}
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>

                    <h2 className="text-2xl font-black tracking-tight text-white">
                      {category.name}
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {category.description}
                  </p>
                </div>

                {category.channels.length > 0 && (
                  <span className="hidden rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-xs font-semibold text-gray-500 sm:block">
                    {category.channels.length}{" "}
                    {category.channels.length === 1
                      ? "seção"
                      : "seções"}
                  </span>
                )}
              </div>

              {/* CHANNELS */}
              {category.channels.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.channels.map((channel) => (
                    <Link
                      key={channel.slug}
                      href={`/${category.slug}/${channel.slug}`}
                      className="group rounded-2xl border border-white/[0.07] bg-[#0d111c] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#111625] hover:shadow-2xl hover:shadow-violet-950/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-xl">
                          {channel.icon}
                        </div>

                        <span className="text-sm text-gray-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                          →
                        </span>
                      </div>

                      <h3 className="mt-5 text-lg font-bold text-white">
                        {channel.name}
                      </h3>

                      <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500">
                        {channel.description}
                      </p>

                      <div className="mt-5 border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-wider text-gray-600 transition group-hover:text-violet-400">
                        Ver estratégias
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href={`/${category.slug}`}
                  className="group block rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-6 transition hover:border-violet-500/30 hover:bg-violet-500/[0.03]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">
                        Área em construção
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Novos conteúdos serão adicionados aqui.
                      </p>
                    </div>

                    <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                      →
                    </span>
                  </div>
                </Link>
              )}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}