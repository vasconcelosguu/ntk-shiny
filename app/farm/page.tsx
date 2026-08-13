import Link from "next/link";
import { getCategory } from "../../lib/team";

export default function FarmPage() {
  const category = getCategory("farm");

  if (!category) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-500 transition hover:text-violet-400"
          >
            ← Voltar
          </Link>

          <div className="mt-8">
            <div className="text-3xl">
              {category.icon}
            </div>

            <h1 className="mt-3 text-4xl font-black tracking-tight">
              {category.name}
            </h1>

            <p className="mt-3 max-w-2xl text-gray-500">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.channels.map((channel) => (
            <Link
              key={channel.slug}
              href={`/farm/${channel.slug}`}
              className="group rounded-2xl border border-white/[0.07] bg-[#0d111c] p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#111625]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-2xl">
                  {channel.icon}
                </div>

                <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                  →
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold">
                {channel.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {channel.description}
              </p>

              <div className="mt-5 border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-wider text-gray-600 group-hover:text-violet-400">
                Ver estratégia
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}