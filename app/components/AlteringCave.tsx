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

  const realDayDuration =
    6 * 60 * 60 * 1000;

  const utcMilliseconds =
    now.getTime();

  const timeIntoGameDay =
    ((utcMilliseconds % realDayDuration) +
      realDayDuration) %
    realDayDuration;

  // 6 horas reais = 24 horas do jogo
  const gameMilliseconds =
    timeIntoGameDay * 4;

  const totalGameMinutes =
    Math.floor(
      gameMilliseconds /
        (60 * 1000)
    );

  const hour =
    Math.floor(
      totalGameMinutes / 60
    ) % 24;

  const minute =
    totalGameMinutes % 60;

  // ----------------------------------------------------------
  // PERÍODO
  // ----------------------------------------------------------

  let period:
    | "Morning"
    | "Day"
    | "Night";

  if (hour >= 4 && hour < 10) {
    period = "Morning";
  } else if (
    hour >= 10 &&
    hour < 21
  ) {
    period = "Day";
  } else {
    period = "Night";
  }

  // ----------------------------------------------------------
  // ESTAÇÃO / ROTAÇÃO SEMANAL
  // ----------------------------------------------------------

  const seasons = [
    "Summer",
    "Autumn",
    "Winter",
    "Spring",
  ] as const;

  // 01/08/2026 00:00 UTC = Summer
  const seasonStart = Date.UTC(
    2026,
    7,
    1,
    0,
    0,
    0
  );

  const millisecondsPerWeek =
    7 * 24 * 60 * 60 * 1000;

  const elapsed =
    now.getTime() - seasonStart;

  const weekIndex = Math.floor(
    elapsed / millisecondsPerWeek
  );

  const season =
    seasons[
      ((weekIndex % seasons.length) +
        seasons.length) %
        seasons.length
    ];

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

  const dayName =
    days[now.getUTCDay()];

  return {
    hour,
    minute,
    dayName,
    season,
    period,
  };
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
          ? "h-24 w-24 object-contain"
          : "h-12 w-12 object-contain"
      }
    />
  );
}

// ============================================================
// ALTERING CAVE CARD
// ============================================================

function AlteringCaveCard({
  entries,
}: {
  entries: CaveEntry[];
}) {
  const visiblePokemon = entries.slice(0, 3);

  return (
    <div
      className="
        relative
        flex
        min-h-[245px]
        flex-col
        items-center
        overflow-hidden
        rounded-[24px]
        border-2
        border-lime-400/80
        bg-black
        px-4
        py-3
      "
    >
      <h3
        className="
          text-[20px]
          font-black
          uppercase
          leading-tight
          text-white
        "
      >
        Altering
        <br />
        Cave
      </h3>

      <div
        className="
          mt-2
          flex
          flex-1
          items-center
          justify-center
          gap-1
        "
      >
        {visiblePokemon.map((pokemon, index) => (
          <div
            key={`${pokemon.pokemon}-${index}`}
            className="
              flex
              flex-col
              items-center
            "
          >
            <PokemonSprite
              name={pokemon.pokemon}
              size="large"
            />

            <span
              className="
                max-w-[90px]
                truncate
                text-[10px]
                font-bold
                text-gray-300
              "
            >
              {pokemon.pokemon}
            </span>
          </div>
        ))}
      </div>

      <div
        className="
          mt-2
          text-[16px]
          font-black
          uppercase
          text-white
        "
      >
        HORDA {entries.length}X
      </div>
    </div>
  );
}

// ============================================================
// SEASON CARD
// ============================================================

function SeasonCard() {
  const [gameTime, setGameTime] =
    useState<GameTime>(getPokeMMOTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(getPokeMMOTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const seasonIcon =
    gameTime.season === "Spring"
      ? "🌸"
      : gameTime.season === "Summer"
        ? "☀️"
        : gameTime.season === "Autumn"
          ? "🍂"
          : "❄️";

  return (
    <div
      className="
        relative
        flex
        min-h-[245px]
        flex-col
        items-center
        justify-between
        overflow-hidden
        rounded-[24px]
        border-2
        border-lime-400/80
        bg-black
        px-4
        py-4
        text-center
      "
    >
      <h3
        className="
          text-[18px]
          font-black
          uppercase
          leading-tight
          text-white
        "
      >
        Estação /
        <br />
        Rotação
      </h3>

      <div className="flex flex-col items-center">
        <div className="text-6xl">
          {seasonIcon}
        </div>

        <div
          className="
            mt-2
            text-[22px]
            font-black
            uppercase
            text-white
          "
        >
          {gameTime.season}
        </div>
      </div>

      <div
        className="
          text-[13px]
          font-bold
          uppercase
          text-gray-400
        "
      >
        Altering Cave
      </div>
    </div>
  );
}

// ============================================================
// ALPHA CARD
// ============================================================

function AlphaCard() {
  return (
    <div
      className="
        relative
        flex
        min-h-[245px]
        flex-col
        items-center
        justify-between
        overflow-hidden
        rounded-[24px]
        border-2
        border-lime-400/80
        bg-black
        px-4
        py-4
        text-center
      "
    >
      <h3
        className="
          text-[19px]
          font-black
          uppercase
          leading-tight
          text-white
        "
      >
        Horários
        <br />
        de Alfa
      </h3>

      <div
        className="
          flex
          flex-1
          flex-col
          items-center
          justify-center
        "
      >
        <div className="text-6xl">
          👑
        </div>

        <div
          className="
            mt-4
            text-[20px]
            font-black
            text-white
          "
        >
          EM BREVE
        </div>
      </div>

      <div
        className="
          text-[12px]
          font-bold
          uppercase
          text-gray-500
        "
      >
        Horários dos Alfas
      </div>
    </div>
  );
}

// ============================================================
// POKEMMO CLOCK CARD
// ============================================================

function PokeMMOClockCard() {
  const [gameTime, setGameTime] =
    useState<GameTime>(getPokeMMOTime());

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
    <div
      className="
        relative
        flex
        min-h-[245px]
        flex-col
        items-center
        justify-between
        overflow-hidden
        rounded-[24px]
        border-2
        border-lime-400/80
        bg-black
        px-5
        py-4
        text-center
      "
    >
      <h3
        className="
          text-[20px]
          font-black
          uppercase
          leading-tight
          text-white
        "
      >
        Horário no
        <br />
        PokeMMO
      </h3>

      <div className="text-4xl">
        {icon}
      </div>

      <div
        className="
          text-[27px]
          font-black
          tracking-tight
          text-white
        "
      >
        {hour}:{minute}
      </div>

      <div
        className="
          text-[13px]
          font-bold
          uppercase
          text-gray-300
        "
      >
        {gameTime.dayName}

        <span className="mx-1 text-lime-400">
          •
        </span>

        {gameTime.season}
      </div>

      <div
        className="
          text-[11px]
          font-black
          uppercase
          tracking-widest
          text-lime-400
        "
      >
        {gameTime.period}
      </div>
    </div>
  );
}

// ============================================================
// BUSCAR DADOS
// ============================================================

async function getCaveData(): Promise<CaveData> {
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

  return response.json();
}

// ============================================================
// COMPONENTE DO TOPO
// ============================================================

export function AlteringCave() {
  const [data, setData] =
    useState<CaveData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await getCaveData();

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

  if (loading) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-lime-400/15
          bg-[#0b0f0b]
          p-5
        "
      >
        <p className="text-sm text-gray-500">
          Carregando Altering Cave...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-500/15
          bg-[#0b0f0b]
          p-5
        "
      >
        <p className="text-sm text-red-400">
          Não foi possível carregar os
          dados do Altering Cave.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        rounded-2xl
        border
        border-lime-400/15
        bg-[#0b0f0b]
        p-5
      "
    >
      {/* HEADER */}

      <div
        className="
          mb-5
          flex
          items-center
          justify-between
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-lime-400
            "
          >
            Dados em tempo real
          </p>

          <h2
            className="
              mt-1
              text-2xl
              font-black
              text-white
            "
          >
            Atualizaçoes mais recentes
          </h2>
        </div>

        <a
          href="https://docs.google.com/spreadsheets/d/12lZupylxLAKUVQQJZIC8GJmvQiUwpbAAQ3BduAu_rig/htmlview?gid=1031347870"
          target="_blank"
          rel="noopener noreferrer"
          className="
            rounded-lg
            border
            border-lime-400/20
            bg-lime-400/5
            px-3
            py-1
            text-xs
            text-gray-400
            transition
            hover:border-lime-400/40
            hover:text-lime-400
          "
        >
          Google Sheets
        </a>
      </div>

      {/* =====================================================
          4 CARDS DO TOPO
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <AlteringCaveCard
          entries={data.hordes}
        />

        <SeasonCard />

        <AlphaCard />

        <PokeMMOClockCard />
      </div>
    </div>
  );
}

// ============================================================
// ENCONTROS ATUAIS
// ============================================================

export function AlteringCaveEncounters() {
  const [data, setData] =
    useState<CaveData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await getCaveData();

        setData(result);
      } catch (error) {
        console.error(
          "[ALTERING CAVE ENCOUNTERS]",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-white/[0.07]
          bg-[#0b0f0b]
          p-5
        "
      >
        <p className="text-sm text-gray-500">
          Carregando encontros...
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-lime-400/15
        bg-[#0b0f0b]
        transition-all
        duration-300
        hover:border-lime-400/30
        hover:shadow-2xl
        hover:shadow-lime-950/10
      "
    >
      {/* HEADER */}

      <div
        className="
          border-b
          border-white/[0.06]
          px-5
          py-4
        "
      >
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-lime-400
          "
        >
          Encontros atuais
        </p>

        <h3
          className="
            mt-1
            text-xl
            font-black
            text-white
          "
        >
          Altering Cave
        </h3>
      </div>

      {/* =====================================================
          3 CATEGORIAS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          divide-y
          divide-white/[0.06]
          md:grid-cols-3
          md:divide-x
          md:divide-y-0
        "
      >
        {/* HORDA */}

        <div className="p-5">
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >
            <h4
              className="
                text-base
                font-black
                text-white
              "
            >
              Hordes
            </h4>

            <span
              className="
                rounded-md
                bg-lime-400/10
                px-2
                py-1
                text-[10px]
                font-black
                text-lime-400
              "
            >
              {data.hordes.length}
            </span>
          </div>

          <div className="space-y-2">
            {data.hordes.length === 0 ? (
              <p className="text-sm text-gray-600">
                Nenhum Pokémon.
              </p>
            ) : (
              data.hordes.map((entry, index) => (
                <div
                  key={`${entry.pokemon}-horde-${index}`}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-white/[0.05]
                    bg-black/30
                    px-3
                    py-2
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <PokemonSprite
                      name={entry.pokemon}
                      size="small"
                    />

                    <span
                      className="
                        text-sm
                        font-bold
                        text-gray-300
                      "
                    >
                      {entry.pokemon}
                    </span>
                  </div>

                  <span
                    className="
                      text-sm
                      font-black
                      text-lime-400
                    "
                  >
                    {entry.tier}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SINGLES */}

        <div className="p-5">
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >
            <h4
              className="
                text-base
                font-black
                text-white
              "
            >
              Singles
            </h4>

            <span
              className="
                rounded-md
                bg-white/[0.05]
                px-2
                py-1
                text-[10px]
                font-black
                text-gray-500
              "
            >
              {data.singles.length}
            </span>
          </div>

          <div className="space-y-2">
            {data.singles.length === 0 ? (
              <p className="text-sm text-gray-600">
                Nenhum Pokémon.
              </p>
            ) : (
              data.singles.map((entry, index) => (
                <div
                  key={`${entry.pokemon}-single-${index}`}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-white/[0.05]
                    bg-black/30
                    px-3
                    py-2
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <PokemonSprite
                      name={entry.pokemon}
                      size="small"
                    />

                    <span
                      className="
                        text-sm
                        font-bold
                        text-gray-300
                      "
                    >
                      {entry.pokemon}
                    </span>
                  </div>

                  <span
                    className="
                      text-sm
                      font-black
                      text-lime-400
                    "
                  >
                    {entry.tier}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RARE SINGLES */}

        <div className="p-5">
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >
            <h4
              className="
                text-base
                font-black
                text-white
              "
            >
              Rare Singles
            </h4>

            <span
              className="
                rounded-md
                bg-white/[0.05]
                px-2
                py-1
                text-[10px]
                font-black
                text-gray-500
              "
            >
              {data.rareSingles.length}
            </span>
          </div>

          <div className="space-y-2">
            {data.rareSingles.length === 0 ? (
              <p className="text-sm text-gray-600">
                Nenhum Pokémon.
              </p>
            ) : (
              data.rareSingles.map(
                (entry, index) => (
                  <div
                    key={`${entry.pokemon}-rare-${index}`}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-white/[0.05]
                      bg-black/30
                      px-3
                      py-2
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <PokemonSprite
                        name={entry.pokemon}
                        size="small"
                      />

                      <span
                        className="
                          text-sm
                          font-bold
                          text-gray-300
                        "
                      >
                        {entry.pokemon}
                      </span>
                    </div>

                    <span
                      className="
                        text-sm
                        font-black
                        text-lime-400
                      "
                    >
                      {entry.tier}
                    </span>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}