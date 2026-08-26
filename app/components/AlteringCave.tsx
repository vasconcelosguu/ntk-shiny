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

type GameTime = {
  hour: number;
  minute: number;
  dayName: string;
  season: string;
  period: "Morning" | "Day" | "Night";
};

// ============================================================
// POKEMMO TIME
// ============================================================

function getPokeMMOTime(): GameTime {
  const now = new Date();

  const realDayDuration = 6 * 60 * 60 * 1000;

  const utcMilliseconds = now.getTime();

  const timeIntoGameDay =
    ((utcMilliseconds % realDayDuration) + realDayDuration) %
    realDayDuration;

  // 6 horas reais = 24 horas do jogo
  const gameMilliseconds = timeIntoGameDay * 4;

  const totalGameMinutes = Math.floor(
    gameMilliseconds / (60 * 1000)
  );

  const hour =
    Math.floor(totalGameMinutes / 60) % 24;

  const minute =
    totalGameMinutes % 60;

  // ----------------------------------------------------------
  // PERÍODO
  // ----------------------------------------------------------

  let period: "Morning" | "Day" | "Night";

  if (hour >= 4 && hour < 10) {
    period = "Morning";
  } else if (hour >= 10 && hour < 21) {
    period = "Day";
  } else {
    period = "Night";
  }

  // ----------------------------------------------------------
  // ESTAÇÃO
  // ----------------------------------------------------------

  const month = now.getUTCMonth();

  const seasons = [
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
  ];

  const season = seasons[month % 4];

  // ----------------------------------------------------------
  // DIA
  // ----------------------------------------------------------

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = days[now.getUTCDay()];

  return {
    hour,
    minute,
    dayName,
    season,
    period,
  };
}

// ============================================================
// GAME CLOCK
// ============================================================

function PokeMMOClockCard() {
  const [gameTime, setGameTime] = useState<GameTime>(
    getPokeMMOTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(getPokeMMOTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hour = String(gameTime.hour).padStart(2, "0");
  const minute = String(gameTime.minute).padStart(2, "0");

  let icon = "🌙";

  if (gameTime.period === "Morning") {
    icon = "🌅";
  }

  if (gameTime.period === "Day") {
    icon = "☀️";
  }

  return (
    <div className="relative flex min-h-[245px] flex-col items-center justify-between overflow-hidden rounded-[24px] border-2 border-lime-400/80 bg-black px-5 py-4 text-center">

      {/* TÍTULO */}

      <h3 className="text-[20px] font-black uppercase leading-tight text-white">
        Horário no
        <br />
        PokeMMO
      </h3>

      {/* ÍCONE */}

      <div className="text-4xl">
        {icon}
      </div>

      {/* HORÁRIO */}

      <div className="text-[27px] font-black tracking-tight text-white">
        {hour}:{minute}
      </div>

      {/* DIA / ESTAÇÃO */}

      <div className="text-[13px] font-bold uppercase text-gray-300">
        {gameTime.dayName}
        <span className="mx-1 text-lime-400">
          •
        </span>
        {gameTime.season}
      </div>

      {/* PERÍODO */}

      <div className="text-[11px] font-black uppercase tracking-widest text-lime-400">
        {gameTime.period}
      </div>
    </div>
  );
}

// ============================================================
// SPRITE
// ============================================================

function PokemonSprite({
  name,
  size = "large",
}: {
  name: string;
  size?: "small" | "large";
}) {
  const [spriteUrl, setSpriteUrl] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSprite() {
      try {
        const formattedName = name
          .toLowerCase()
          .trim()
          .replace(/\./g, "")
          .replace(/\s+/g, "-");

        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${formattedName}`
        );

        if (!response.ok) {
          throw new Error(
            `Pokémon não encontrado: ${formattedName}`
          );
        }

        const data = await response.json();

        if (
          !cancelled &&
          data?.sprites?.front_default
        ) {
          setSpriteUrl(
            data.sprites.front_default
          );
        }
      } catch (error) {
        console.error(
          `Erro ao buscar sprite de ${name}:`,
          error
        );
      }
    }

    if (name) {
      fetchSprite();
    }

    return () => {
      cancelled = true;
    };
  }, [name]);

  if (!spriteUrl) {
    return (
      <div
        className={
          size === "large"
            ? "h-24 w-24 rounded-xl bg-white/[0.04]"
            : "h-12 w-12 rounded-lg bg-white/[0.04]"
        }
      />
    );
  }

  return (
    <img
      src={spriteUrl}
      alt={name}
      loading="lazy"
      className={
        size === "large"
          ? "h-24 w-24 object-contain pixelated"
          : "h-12 w-12 object-contain pixelated"
      }
    />
  );
}

// ============================================================
// CARD PRINCIPAL - ALTERING CAVE
// ============================================================

function AlteringCaveCard({
  entries,
}: {
  entries: CaveEntry[];
}) {
  const visiblePokemon = entries.slice(0, 3);

  return (
    <div className="relative flex min-h-[245px] flex-col items-center overflow-hidden rounded-[24px] border-2 border-lime-400/80 bg-black px-4 py-3">

      <h3 className="text-[20px] font-black uppercase leading-tight text-white">
        Altering
        <br />
        Cave
      </h3>

      <div className="mt-2 flex flex-1 items-center justify-center gap-1">
        {visiblePokemon.map(
          (pokemon, index) => (
            <div
              key={`${pokemon.pokemon}-${index}`}
              className="flex flex-col items-center"
            >
              <PokemonSprite
                name={pokemon.pokemon}
                size="large"
              />

              <span className="max-w-[90px] truncate text-[10px] font-bold text-gray-300">
                {pokemon.pokemon}
              </span>
            </div>
          )
        )}
      </div>

      <div className="mt-2 text-[16px] font-black uppercase text-white">
        HORDA {entries.length}X
      </div>
    </div>
  );
}

// ============================================================
// CARD ESTAÇÃO
// ============================================================

function SeasonCard() {
  const [gameTime, setGameTime] = useState<GameTime>(
    getPokeMMOTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(getPokeMMOTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-[245px] flex-col items-center justify-between overflow-hidden rounded-[24px] border-2 border-lime-400/80 bg-black px-4 py-4 text-center">

      <h3 className="text-[18px] font-black uppercase leading-tight text-white">
        Estação /
        <br />
        Rotação
      </h3>

      <div className="flex flex-col items-center">
        <div className="text-6xl">
          {gameTime.season === "Spring"
            ? "🌸"
            : gameTime.season === "Summer"
              ? "☀️"
              : gameTime.season === "Autumn"
                ? "🍂"
                : "❄️"}
        </div>

        <div className="mt-2 text-[22px] font-black uppercase text-white">
          {gameTime.season}
        </div>
      </div>

      <div className="text-[13px] font-bold uppercase text-gray-400">
        Altering Cave
      </div>
    </div>
  );
}

// ============================================================
// CARD ALPHA
// ============================================================

function AlphaCard() {
  return (
    <div className="relative flex min-h-[245px] flex-col items-center justify-between overflow-hidden rounded-[24px] border-2 border-lime-400/80 bg-black px-4 py-4 text-center">

      <h3 className="text-[19px] font-black uppercase leading-tight text-white">
        Horários
        <br />
        de Alfa
      </h3>

      <div className="flex flex-1 flex-col items-center justify-center">

        <div className="text-6xl">
          👑
        </div>

        <div className="mt-4 text-[20px] font-black text-white">
          EM BREVE
        </div>

      </div>

      <div className="text-[12px] font-bold uppercase text-gray-500">
        Horários dos Alfas
      </div>
    </div>
  );
}

// ============================================================
// DROPDOWN
// ============================================================

function CaveDropdown({
  title,
  entries,
}: {
  title: string;
  entries: CaveEntry[];
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070a07]">

      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className="
          flex
          w-full
          items-center
          justify-between
          px-5
          py-4
          text-left
          transition
          hover:bg-white/[0.03]
        "
      >
        <div className="flex items-center gap-3">

          <span className="text-base font-black text-white">
            {title}
          </span>

          <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] font-bold text-gray-500">
            {entries.length}
          </span>

        </div>

        <svg
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>

      </button>

      {open && (
        <div className="border-t border-white/[0.05] p-4">

          {entries.length === 0 ? (
            <p className="text-sm text-gray-600">
              Nenhum Pokémon encontrado.
            </p>
          ) : (
            <div className="space-y-2">
              {entries.map(
                (entry, index) => (
                  <div
                    key={`${entry.pokemon}-${index}`}
                    className="
                      flex
                      min-h-[65px]
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-white/[0.04]
                      bg-white/[0.02]
                      px-4
                    "
                  >

                    <div className="flex items-center gap-3">
                      <PokemonSprite
                        name={entry.pokemon}
                        size="small"
                      />

                      <span className="text-sm font-medium text-gray-300">
                        {entry.pokemon}
                      </span>
                    </div>

                    <span className="text-sm font-black text-lime-400">
                      {entry.tier}
                    </span>

                  </div>
                )
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AlteringCave() {
  const [data, setData] =
    useState<CaveData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "/api/altering-cave",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Erro ao carregar Altering Cave"
          );
        }

        const result: CaveData =
          await response.json();

        setData(result);
      } catch (error) {
        console.error(
          "[ALTERING CAVE]",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-lime-400/15 bg-[#0b0f0b] p-5">
        <p className="text-sm text-gray-500">
          Carregando Altering Cave...
        </p>
      </div>
    );
  }

  // ==========================================================
  // ERRO
  // ==========================================================

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-500/15 bg-[#0b0f0b] p-5">
        <p className="text-sm text-red-400">
          Não foi possível carregar os dados
          do Altering Cave.
        </p>
      </div>
    );
  }

  // ==========================================================
  // CONTEÚDO
  // ==========================================================

  return (
    <div className="rounded-2xl border border-lime-400/15 bg-[#0b0f0b] p-5">

      {/* HEADER */}

      <div className="mb-5 flex items-center justify-between">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400">
            Dados em tempo real
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            {data.title}
          </h2>
        </div>

        <span className="rounded-lg border border-lime-400/10 bg-lime-400/5 px-3 py-1 text-xs text-gray-500">
          Google Sheets
        </span>

      </div>

      {/* =====================================================
          CARDS
      ====================================================== */}

      <div className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        <AlteringCaveCard
          entries={data.hordes}
        />

        <SeasonCard />

        <AlphaCard />

        <PokeMMOClockCard />

      </div>

      {/* =====================================================
          HORDES
      ====================================================== */}

      <div className="mt-5 rounded-2xl border border-lime-400/10 bg-black/20 p-4">

        <div className="mb-3 flex items-center justify-between">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-lime-400">
              Encontros atuais
            </p>

            <h3 className="text-lg font-black text-white">
              Hordes
            </h3>
          </div>

          <span className="text-xs font-bold text-gray-600">
            {data.hordes.length} Pokémon
          </span>

        </div>

        <div className="
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
        ">

          {data.hordes.map(
            (entry, index) => (
              <div
                key={`${entry.pokemon}-${index}`}
                className="
                  flex
                  flex-col
                  items-center
                  rounded-xl
                  border
                  border-white/[0.05]
                  bg-white/[0.02]
                  px-3
                  py-3
                "
              >

                <PokemonSprite
                  name={entry.pokemon}
                  size="large"
                />

                <span className="mt-1 max-w-full truncate text-xs font-bold text-gray-300">
                  {entry.pokemon}
                </span>

                <span className="mt-1 text-[10px] font-black text-lime-400">
                  {entry.tier}
                </span>

              </div>
            )
          )}

        </div>

      </div>

      {/* =====================================================
          DROPDOWNS
      ====================================================== */}

      <div className="mt-4 space-y-2">

        <CaveDropdown
          title="Singles"
          entries={data.singles}
        />

        <CaveDropdown
          title="Rare Singles"
          entries={data.rareSingles}
        />

      </div>

    </div>
  );
}