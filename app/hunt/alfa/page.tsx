import Link from "next/link";

export default function AlfaPage() {
  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/hunt"
          className="text-sm font-semibold text-gray-500 hover:text-violet-400"
        >
          ← Voltar para Hunt
        </Link>

        <div className="mt-10 rounded-2xl border border-white/[0.07] bg-[#0d111c] p-8">
          <div className="text-4xl">👑</div>

          <h1 className="mt-4 text-4xl font-black">
            Alfa
          </h1>

          <p className="mt-3 text-gray-500">
            Estratégias para caça de Pokémon Alfa.
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015] p-6">
            <h2 className="font-bold">
              Estratégias
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Conteúdo será adicionado aqui.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}