import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategory,
  getChannel,
  teamCategories,
} from "../../../lib/team";

type ChannelPageProps = {
  params: Promise<{
    category: string;
    channel: string;
  }>;
};

export function generateStaticParams() {
  return teamCategories.flatMap((category) =>
    category.channels.map((channel) => ({
      category: category.slug,
      channel: channel.slug,
    }))
  );
}

export default async function ChannelPage({
  params,
}: ChannelPageProps) {
  const { category: categorySlug, channel: channelSlug } = await params;

  const category = getCategory(categorySlug);
  const channel = getChannel(categorySlug, channelSlug);

  if (!category || !channel) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-5xl px-6 pb-14 pt-16">
          <Link
            href={`/${category.slug}`}
            className="text-sm font-medium text-gray-500 transition hover:text-violet-400"
          >
            ← Voltar para {category.name}
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-3xl">
              {channel.icon}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                {category.name}
              </p>

              <h1 className="mt-1 text-4xl font-black tracking-tight md:text-5xl">
                {channel.name}
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400">
            {channel.description}
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d111c] p-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
              Estratégias
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Conteúdo
            </h2>
          </div>

          <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015] p-8 text-center">
            <p className="text-gray-400">
              Nenhuma estratégia adicionada ainda.
            </p>

            <p className="mt-2 text-sm text-gray-600">
              O conteúdo desta seção será adicionado posteriormente.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}