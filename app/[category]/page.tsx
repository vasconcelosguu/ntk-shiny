import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, teamCategories } from "../../lib/team";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return teamCategories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category: categorySlug } = await params;

  const category = getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      {/* HEADER */}
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 transition hover:text-violet-400"
          >
            ← Voltar para início
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-3xl">
              {category.icon}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Categoria
              </p>

              <h1 className="mt-1 text-4xl font-black tracking-tight md:text-5xl">
                {category.name}
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400">
            {category.description}
          </p>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {category.channels.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.channels.map((channel) => (
              <Link
                key={channel.slug}
                href={`/${category.slug}/${channel.slug}`}
                className="group rounded-2xl border border-white/[0.07] bg-[#0d111c] p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#111625] hover:shadow-2xl hover:shadow-violet-950/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-2xl">
                    {channel.icon}
                  </div>

                  <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                    →
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-bold text-white">
                  {channel.name}
                </h2>

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                  {channel.description}
                </p>

                <div className="mt-6 border-t border-white/[0.06] pt-4 text-xs font-bold uppercase tracking-wider text-gray-600 transition group-hover:text-violet-400">
                  Ver estratégias →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-8">
            <h2 className="font-bold text-white">
              Conteúdo em construção
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Novos conteúdos serão adicionados nesta categoria.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}