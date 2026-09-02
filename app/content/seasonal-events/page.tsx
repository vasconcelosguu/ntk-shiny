export default function SeasonalEventsPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6">

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400">
          Content
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          Seasonal Events
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          Eventos sazonais e conteúdos temporários.
        </p>

        <div className="mt-10 rounded-2xl border border-white/[0.07] bg-[#0b0f0b] p-8">
          <h2 className="font-black text-white">
            Halloween
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Conteúdo do evento de Halloween.
          </p>
        </div>

      </section>
    </main>
  );
}