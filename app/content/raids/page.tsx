import Link from "next/link";

const raids = [
  {
    slug: "builds",
    name: "Builds",
    description: "Builds utilizadas nos raids.",
  },
  {
    slug: "cresselia",
    name: "Cresselia",
    description: "Estratégias para Cresselia.",
  },
  {
    slug: "heatran",
    name: "Heatran",
    description: "Estratégias para Heatran.",
  },
];

export default function RaidsPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6">

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400">
          Content
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          Raids
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          Builds e estratégias para os Raids.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {raids.map((raid) => (
            <Link
              key={raid.slug}
              href={`/content/raids/${raid.slug}`}
              className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-[#0b0f0b]
                p-6
                transition
                hover:-translate-y-1
                hover:border-lime-400/25
              "
            >
              <h2 className="font-black text-white">
                {raid.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {raid.description}
              </p>

              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-gray-700">
                Abrir →
              </p>
            </Link>
          ))}
        </div>

      </section>
    </main>
  );
}