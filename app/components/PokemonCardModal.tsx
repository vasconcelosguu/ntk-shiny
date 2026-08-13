"use client";

import { useEffect } from "react";

type PokemonCardModalProps = {
  name: string;
  id: number;
  tier: string;
  points: number;
  onClose: () => void;
};

export default function PokemonCardModal({
  name,
  id,
  tier,
  points,
  onClose,
}: PokemonCardModalProps) {
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d111c] shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        {/* BOTÃO FECHAR */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-black/30 text-xl text-gray-400 transition hover:bg-white/[0.08] hover:text-white"
          aria-label="Fechar"
        >
          ×
        </button>

        {/* ÁREA DO SHINY */}
        <div className="flex h-72 items-center justify-center bg-gradient-to-br from-violet-950/30 via-[#0d111c] to-[#080b14]">
          <img
            src={sprite}
            alt={`Shiny ${name}`}
            className="h-56 w-56 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-110"
          />
        </div>

        {/* INFORMAÇÕES */}
        <div className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Shiny Pokémon
              </p>

              <h2 className="mt-2 text-3xl font-black capitalize text-white">
                {name}
              </h2>
            </div>

            <span className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs font-bold text-gray-500">
              #{String(id).padStart(3, "0")}
            </span>
          </div>

          {/* STATUS */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Tier
              </p>

              <p className="mt-2 text-2xl font-black text-violet-400">
                T{tier}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Pontuação
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {points} pts
              </p>
            </div>
          </div>

          {/* PLAYER */}
          <div className="mt-3 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
              Player
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-400">
              Nenhum player registrado
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-600">
              Futuramente será exibido aqui o jogador que possui este shiny.
            </p>
          </div>

          {/* FECHAR */}
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-bold text-gray-400 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}