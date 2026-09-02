import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getCategory,
  getChannel,
} from "../../../../lib/team";

type RaidChannelPageProps = {
  params: Promise<{
    channel: string;
  }>;
};

export function generateStaticParams() {
  const category = getCategory("raid");

  if (!category) {
    return [];
  }

  return category.channels.map((channel) => ({
    channel: channel.slug,
  }));
}

export default async function RaidChannelPage({
  params,
}: RaidChannelPageProps) {
  const { channel: channelSlug } = await params;

  const category = getCategory("raid");

  const channel = getChannel(
    "raid",
    channelSlug
  );

  if (!category || !channel) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#080b14] text-white">

      {/* HEADER */}

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-lime-950/20 to-transparent">

        <div className="mx-auto max-w-5xl px-6 pb-14 pt-16">

          <Link
            href="/raid"
            className="
              text-sm
              font-medium
              text-gray-500
              transition
              hover:text-lime-400
            "
          >
            ← Voltar para Raids
          </Link>


          <div className="mt-8 flex items-center gap-4">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-lime-400/20
                bg-lime-400/10
                text-3xl
              "
            >
              {channel.icon}
            </div>


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
                RAID
              </p>

              <h1
                className="
                  mt-1
                  text-4xl
                  font-black
                  tracking-tight
                  md:text-5xl
                "
              >
                {channel.name}
              </h1>

            </div>

          </div>


          <p
            className="
              mt-5
              max-w-2xl
              text-base
              leading-7
              text-gray-400
            "
          >
            {channel.description}
          </p>

        </div>

      </section>


      {/* CONTENT */}

      <section className="mx-auto max-w-5xl px-6 py-12">

        <div
          className="
            rounded-2xl
            border
            border-white/[0.07]
            bg-[#0d111c]
            p-8
          "
        >

          <div className="mb-8">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-lime-400
              "
            >
              Estratégia
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
              "
            >
              {channel.name}
            </h2>

          </div>


          <div
            className="
              rounded-xl
              border
              border-dashed
              border-white/[0.08]
              bg-white/[0.015]
              p-8
              text-center
            "
          >

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