"use client";

import { useEffect, useMemo, useState } from "react";

type BonusType = "charm" | "donator" | "wars";

const BASE_RATE = 30000;

const BONUS_LABELS: Record<BonusType, string> = {
  charm: "Shiny Charm",
  donator: "Donator Status",
  wars: "Shiny Wars",
};

const BONUS_PERCENT: Record<BonusType, number> = {
  charm: 10,
  donator: 10,
  wars: 10,
};

export default function ShinyHuntPage() {
  const [pokemon, setPokemon] = useState("");
  const [pokemonName, setPokemonName] = useState("");
  const [sprite, setSprite] = useState<string | null>(null);

  const [bonuses, setBonuses] = useState<Record<BonusType, boolean>>({
    charm: false,
    donator: false,
    wars: false,
  });

  const [encounters, setEncounters] = useState(0);
  const [running, setRunning] = useState(false);
  const [found, setFound] = useState(false);

  const [status, setStatus] = useState(
    "Escolha um Pokémon e comece sua caça."
  );

  const totalBonus = useMemo(() => {
    return (Object.keys(bonuses) as BonusType[])
      .filter((bonus) => bonuses[bonus])
      .reduce((total, bonus) => total + BONUS_PERCENT[bonus], 0);
  }, [bonuses]);

  /*
   * PokeMMO melhora a taxa em 10% por bônus.
   *
   * Exemplo:
   *
   * 0 bônus  = 1/30000
   * 1 bônus  = 1/27000
   * 2 bônus  = ~1/24300
   *
   * Aqui usamos multiplicação de 0.9 por bônus.
   */
  const activeBonusCount = useMemo(() => {
    return Object.values(bonuses).filter(Boolean).length;
  }, [bonuses]);

  const shinyRate = useMemo(() => {
    return Math.round(
      BASE_RATE * Math.pow(0.9, activeBonusCount)
    );
  }, [activeBonusCount]);

  const chancePercent = useMemo(() => {
    return (100 / shinyRate).toFixed(5);
  }, [shinyRate]);

  function toggleBonus(bonus: BonusType) {
    if (running) return;

    setBonuses((current) => ({
      ...current,
      [bonus]: !current[bonus],
    }));
  }

  async function loadPokemon(name: string) {
    const normalized = name.trim().toLowerCase();

    if (!normalized) {
      setSprite(null);
      setPokemonName("");
      return false;
    }

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
          normalized
        )}`
      );

      if (!response.ok) {
        setSprite(null);
        setPokemonName("");
        setStatus("Pokémon não encontrado.");
        return false;
      }

      const data = await response.json();

      const displayName =
        data.name.charAt(0).toUpperCase() +
        data.name.slice(1);

      const shinySprite =
        data.sprites?.other?.["official-artwork"]?.front_shiny ??
        data.sprites?.front_shiny ??
        null;

      setPokemonName(displayName);
      setSprite(shinySprite);
      setStatus(`Pronto para caçar ${displayName}.`);

      return true;
    } catch {
      setSprite(null);
      setPokemonName("");
      setStatus("Não foi possível carregar esse Pokémon.");
      return false;
    }
  }

  /*
   * Simula a caça.
   *
   * Não usamos um while infinito bloqueando o navegador.
   * O loop funciona em pequenos intervalos para que a interface
   * continue responsiva e o contador possa ser atualizado.
   */
  async function startHunt() {
    if (running) return;

    const validPokemon = await loadPokemon(pokemon);

    if (!validPokemon) return;

    setRunning(true);
    setFound(false);
    setEncounters(0);
    setStatus("Caçando...");

    let count = 0;

    while (true) {
      count++;

      /*
       * Chance individual do encontro.
       *
       * Exemplo:
       * 1 / 30000
       * 1 / 27000
       * 1 / 24300
       */
      const shiny = Math.random() < 1 / shinyRate;

      /*
       * Atualiza a interface periodicamente.
       * Isso evita renderizar milhares de vezes por segundo.
       */
      if (count % 50 === 0 || shiny) {
        setEncounters(count);
      }

      if (shiny) {
        setEncounters(count);
        setFound(true);
        setRunning(false);
        setStatus("✨ SHINY ENCONTRADO!");
        break;
      }

      /*
       * Dá tempo para o navegador atualizar a tela.
       *
       * A caça continua automaticamente.
       */
      if (count % 100 === 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, 0)
        );
      }
    }
  }

  function stopHunt() {
    setRunning(false);
    setStatus("Caça interrompida.");
  }

  function resetHunt() {
    setRunning(false);
    setFound(false);
    setEncounters(0);
    setStatus(
      pokemonName
        ? `Pronto para caçar ${pokemonName}.`
        : "Escolha um Pokémon e comece sua caça."
    );
  }

  useEffect(() => {
    if (!pokemon) {
      setPokemonName("");
      setSprite(null);
      setStatus("Escolha um Pokémon e comece sua caça.");
    }
  }, [pokemon]);

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      {/* HEADER */}

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-lime-950/20 to-transparent">
        <div className="mx-auto max-w-5xl px-5 pb-12 pt-12 sm:px-6">
          <a
            href="/"
            className="text-sm font-medium text-gray-500 transition hover:text-lime-400"
          >
            ← Voltar para início
          </a>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
              Jogos
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
              Tente pegar seu Shiny
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500 md:text-base">
              Escolha um Pokémon e veja quantos encontros seriam
              necessários até encontrar um Shiny.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          {/* CONFIGURAÇÃO */}

          <div className="rounded-2xl border border-white/[0.07] bg-[#0d111c] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
              Configuração
            </p>

            <h2 className="mt-2 text-xl font-black">
              Escolha seu Pokémon
            </h2>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Pokémon
              </label>

              <input
                value={pokemon}
                onChange={(event) =>
                  setPokemon(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !running) {
                    startHunt();
                  }
                }}
                disabled={running}
                placeholder="Ex.: Gardevoir"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-[#080b14]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-700
                  transition
                  focus:border-lime-400/40
                  focus:ring-2
                  focus:ring-lime-400/10
                  disabled:opacity-50
                "
              />
            </div>

            {/* BÔNUS */}

            <div className="mt-7">
              <label className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
                Bônus ativos
              </label>

              <div className="mt-3 space-y-2">
                {(Object.keys(bonuses) as BonusType[]).map(
                  (bonus) => {
                    const active = bonuses[bonus];

                    return (
                      <button
                        key={bonus}
                        type="button"
                        disabled={running}
                        onClick={() => toggleBonus(bonus)}
                        className={[
                          "flex w-full items-center justify-between rounded-xl border p-4 text-left transition",
                          active
                            ? "border-lime-400/30 bg-lime-400/[0.07]"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]",
                          running
                            ? "cursor-not-allowed opacity-50"
                            : "",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={[
                              "flex h-5 w-5 items-center justify-center rounded-md border text-xs font-black",
                              active
                                ? "border-lime-400 bg-lime-400 text-black"
                                : "border-white/[0.15] bg-transparent",
                            ].join(" ")}
                          >
                            {active ? "✓" : ""}
                          </div>

                          <span
                            className={
                              active
                                ? "text-sm font-bold text-white"
                                : "text-sm text-gray-400"
                            }
                          >
                            {BONUS_LABELS[bonus]}
                          </span>
                        </div>

                        <span
                          className={
                            active
                              ? "text-xs font-bold text-lime-400"
                              : "text-xs text-gray-600"
                          }
                        >
                          +10%
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* TAXA */}

            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Taxa atual
                </span>

                <span className="font-black text-lime-400">
                  1/{shinyRate.toLocaleString("pt-BR")}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Chance por encontro
                </span>

                <span className="text-xs text-gray-500">
                  {chancePercent}%
                </span>
              </div>

              {totalBonus > 0 && (
                <p className="mt-3 text-xs text-lime-400/70">
                  Bônus total selecionado: +{totalBonus}%
                </p>
              )}
            </div>

            {/* BOTÃO */}

            <div className="mt-6 flex gap-2">
              {!running ? (
                <button
                  type="button"
                  onClick={startHunt}
                  disabled={!pokemon.trim()}
                  className="
                    flex-1
                    rounded-xl
                    bg-lime-400
                    px-5
                    py-3
                    text-sm
                    font-black
                    text-black
                    transition
                    hover:bg-lime-300
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  ✨ Buscar Pokémon
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopHunt}
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/[0.07]
                    px-5
                    py-3
                    text-sm
                    font-black
                    text-red-400
                    transition
                    hover:bg-red-500/[0.12]
                  "
                >
                  Parar caça
                </button>
              )}

              {found && !running && (
                <button
                  type="button"
                  onClick={resetHunt}
                  className="
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-gray-400
                    transition
                    hover:border-lime-400/20
                    hover:text-lime-400
                  "
                >
                  Nova caça
                </button>
              )}
            </div>
          </div>

          {/* RESULTADO */}

          <div
            className={[
              "relative overflow-hidden rounded-2xl border bg-[#0d111c] p-6 transition",
              found
                ? "border-lime-400/30 shadow-2xl shadow-lime-950/20"
                : "border-white/[0.07]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
                  Caçada
                </p>

                <h2 className="mt-2 text-xl font-black">
                  {pokemonName || "Seu próximo Shiny"}
                </h2>
              </div>

              {running && (
                <div className="flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/[0.06] px-3 py-1.5 text-xs font-bold text-lime-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
                  Caçando
                </div>
              )}
            </div>

            <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center text-center">
              {sprite && (
                <div
                  className={[
                    "mb-5 transition",
                    running ? "animate-pulse" : "",
                    found ? "scale-110" : "",
                  ].join(" ")}
                >
                  <img
                    src={sprite}
                    alt={
                      pokemonName
                        ? `Shiny ${pokemonName}`
                        : "Pokémon"
                    }
                    className="h-40 w-40 object-contain"
                  />
                </div>
              )}

              <p
                className={[
                  "text-sm font-bold",
                  found
                    ? "text-lime-400"
                    : "text-gray-500",
                ].join(" ")}
              >
                {status}
              </p>

              <div className="mt-4">
                <div
                  className={[
                    "text-5xl font-black tracking-tight md:text-6xl",
                    found
                      ? "text-lime-400"
                      : "text-white",
                  ].join(" ")}
                >
                  {encounters.toLocaleString("pt-BR")}
                </div>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                  encontros
                </p>
              </div>

              {found && (
                <div className="mt-6 rounded-xl border border-lime-400/20 bg-lime-400/[0.06] px-6 py-4">
                  <p className="text-xs uppercase tracking-wider text-lime-400/60">
                    Resultado
                  </p>

                  <p className="mt-1 text-lg font-black text-white">
                    ✨ O Shiny veio com{" "}
                    {encounters.toLocaleString("pt-BR")}{" "}
                    encontros!
                  </p>
                </div>
              )}

              {running && (
                <p className="mt-6 text-xs text-gray-700">
                  Os encontros continuam automaticamente até
                  encontrar o Shiny.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}