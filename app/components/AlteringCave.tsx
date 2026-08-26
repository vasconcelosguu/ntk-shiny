"use client";

import { useEffect, useState } from "react";

type CaveEntry = {
  pokemon: string;
  tier: string;
};

type CaveData = {
  title: string;
  singles: CaveEntry[];
  rareSingles: CaveEntry[];
  hordes: CaveEntry[];
  updatedAt: string;
};

export default function AlteringCave() {
  const [data, setData] = useState<CaveData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/altering-cave", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar Altering Cave");
        }

        const result: CaveData = await response.json();

        setData(result);
      } catch (error) {
        console.error("[ALTERING CAVE]", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-lime-400/15 bg-[#0b0f0b] p-5">
        <p className="text-sm text-gray-500">
          Carregando Altering Cave...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-500/15 bg-[#0b0f0b] p-5">
        <p className="text-sm text-red-400">
          Não foi possível carregar os dados do Altering Cave.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-lime-400/15 bg-[#0b0f0b] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400">
            Dados em tempo real
          </p>

          <h2 className="mt-1 text-xl font-black text-white">
            {data.title}
          </h2>
        </div>

        <span className="rounded-lg border border-lime-400/10 bg-lime-400/5 px-3 py-1 text-xs text-gray-500">
          Google Sheets
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <CaveSection
          title="Singles"
          entries={data.singles}
        />

        <CaveSection
          title="Rare Singles"
          entries={data.rareSingles}
        />

        <CaveSection
          title="Hordes"
          entries={data.hordes}
        />
      </div>
    </div>
  );
}

function CaveSection({
  title,
  entries,
}: {
  title: string;
  entries: CaveEntry[];
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#070a07] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">
          {title}
        </h3>

        <span className="text-xs text-gray-600">
          {entries.length}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {entries.length === 0 ? (
          <p className="text-xs text-gray-600">
            Nenhum Pokémon encontrado.
          </p>
        ) : (
          entries.map((entry, index) => (
            <div
              key={`${entry.pokemon}-${index}`}
              className="
                flex
                items-center
                justify-between
                rounded-lg
                border
                border-white/[0.04]
                bg-white/[0.02]
                px-3
                py-2
              "
            >
              <span className="text-sm text-gray-300">
                {entry.pokemon}
              </span>

              <span className="text-xs font-bold text-lime-400">
                {entry.tier}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}