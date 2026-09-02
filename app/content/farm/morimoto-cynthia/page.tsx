import Link from "next/link";

type Pokemon = {
  name: string;
  nature: string;
  item: string;
  itemImage: string;
  ivs: string[];
  evs: string[];
  moves: string[];
  ability?: string;
  sprite: string;
  accent: string;
};

const morimotoTeam: Pokemon[] = [
  {
    name: "Metagross",
    nature: "Jolly",
    item: "Choice Scarf",
    itemImage:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-scarf.png",
    ivs: [
      "HP: 25+",
      "Def: 25+",
      "Sp.Def: 25+",
      "Speed: 31",
    ],
    evs: [
      "Def: 54",
      "Sp.Def: 252",
      "Speed: 204",
    ],
    moves: [
      "Trick",
      "Stealth Rock",
      "Earthquake",
      "Explosion",
    ],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png",
    accent: "#60a5fa",
  },

  {
    name: "Salamence",
    nature: "Adamant",
    item: "Covert Cloak",
    itemImage:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/covert-cloak.png",
    ivs: [
      "HP: 25+",
      "Atk: 31",
      "Def: 25+",
      "Sp.Def: 25+",
      "Speed: 31",
    ],
    evs: [
      "Atk: 252",
      "Speed: 252",
    ],
    moves: [
      "Dragon Dance",
      "Dragon Claw",
      "Crunch",
      "Earthquake",
    ],
    ability: "Moxie",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/373.png",
    accent: "#ef4444",
  },

  {
    name: "Volcarona",
    nature: "Modest",
    item: "Wise Glasses",
    itemImage:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wise-glasses.png",
    ivs: [
      "HP: 20+",
      "Def: 20+",
      "Sp.Atk: 31",
      "Sp.Def: 20+",
      "Speed: 31",
    ],
    evs: [
      "Sp.Atk: 252",
      "Speed: 252",
    ],
    moves: [
      "Quiver Dance",
      "Fiery Dance",
      "Hidden Power Ice",
      "Bug Buzz",
    ],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/637.png",
    accent: "#f97316",
  },
];

const morimotoRngs = [
  {
    pokemon: "Mamoswine",
    accent: "#d4a574",
    text: "entra, sempre trocar para o Volcarona e continua o Swipe.",
  },

  {
    pokemon: "Liepard",
    accent: "#facc15",
    text: "Lead, trick, stealth rock, explosion, continua com o Salamence, se Vaporeon entrar, troque para Volcarona e use Bug Buzz, troque para Salamence e Swipe sem Dança do Dragão.",
  },

  {
    pokemon: "Flareon",
    accent: "#fb923c",
    text: "Lead, stealth rock, espera morrer e continua com o Salamence só 1x Dança do Dragão e Swipe.",
  },

  {
    pokemon: "Mew",
    accent: "#ec4899",
    text: "Lead, cuidado com o Jolteon após Mamoswine, ele é mais rápido do que o Salamence e a Volcarona sem buff, então fique atento à % de vida, e se necessário use uma cura.",
  },

  {
    pokemon: "Kangaskhan",
    accent: "#d4a574",
    text: "Lead, trick, stealth rock. Se ele trocar, use apenas 1x Dança do Dragão, e continue o swipe.",
  },

  {
    pokemon: "Jolteon",
    accent: "#facc15",
    text: "Lead, Trick, Stealth Rock, fique usando Stealth Rock até morrer, entre com Salamence 1x Dança do Dragão, e continue Swipe.",
  },
];

const cynthiaRngs = [
  {
    pokemon: "Garchomp",
    accent: "#3b82f6",
    text: "Lead, trick, tenta dar o stealth rock, se não conseguir apenas continue com o Salamence. (Apenas o Lucario tem focus sash, porém ele não tem dano suficiente para derrotar o Salamence).",
  },

  {
    pokemon: "Spiritomb",
    accent: "#c026d3",
    text: "Lead + foul play, trick, stealth rock, explosion, continua com o Salamence.",
  },

  {
    pokemon: "Glaceon",
    accent: "#22d3ee",
    text: "Lead, trick, stealth rock, troque para Volcarona 2x quiver dance e Swipe.",
  },
];

const pokemonSprites: Record<string, string> = {
  Mamoswine:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/473.png",

  Liepard:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/510.png",

  Flareon:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png",

  Mew:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",

  Kangaskhan:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png",

  Jolteon:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png",

  Garchomp:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png",

  Spiritomb:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/442.png",

  Glaceon:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/471.png",

  Salamence:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/373.png",

  Volcarona:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/637.png",
};

function StrategyPokemon({
  pokemon,
}: {
  pokemon: string;
}) {
  const sprite = pokemonSprites[pokemon];

  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      {sprite && (
        <img
          src={sprite}
          alt={pokemon}
          width={34}
          height={34}
          loading="lazy"
          className="inline-block h-8 w-8 object-contain"
        />
      )}

      <strong className="font-black text-white">
        {pokemon}
      </strong>
    </span>
  );
}

function TeamCard({
  pokemon,
  index,
  backup = false,
}: {
  pokemon: Pokemon;
  index: number;
  backup?: boolean;
}) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-white/[0.07]
        bg-[#090d09]
        transition-all
        duration-300
        hover:border-lime-400/20
        hover:shadow-2xl
        hover:shadow-lime-950/10
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/[0.06]
          px-5
          py-4
        "
      >
        <div className="flex items-center gap-3">

          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-white/[0.07]
              bg-white/[0.03]
              text-xs
              font-black
              text-gray-500
            "
          >
            {index}
          </span>

          <div>
            <span
              className="
                block
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-gray-600
              "
            >
              {backup ? "Backup" : "Pokémon"}
            </span>

            <span className="text-sm font-black text-white">
              {pokemon.name}
            </span>
          </div>

        </div>

        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: pokemon.accent,
            boxShadow: `0 0 12px ${pokemon.accent}`,
          }}
        />

      </div>

      {/* CONTENT */}

      <div className="p-5">

        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-[190px_1fr_1fr_1fr]
          "
        >

          {/* SPRITE */}

          <div
            className="
              flex
              min-h-[190px]
              items-center
              justify-center
              rounded-2xl
              border
              border-white/[0.05]
              bg-black/30
            "
          >

            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              width={190}
              height={190}
              loading="lazy"
              className="
                h-[190px]
                w-[190px]
                object-contain
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />

          </div>

          {/* NATURE / ITEM */}

          <div className="space-y-6">

            <div>
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-lime-400
                "
              >
                Nature
              </span>

              <p className="mt-2 text-lg font-black text-white">
                {pokemon.nature}
              </p>
            </div>

            <div>

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-lime-400
                "
              >
                Item
              </span>

              <div className="mt-2 flex items-center gap-3">

                <img
                  src={pokemon.itemImage}
                  alt={pokemon.item}
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />

                <span className="font-black text-white">
                  {pokemon.item}
                </span>

              </div>

            </div>

          </div>

          {/* IV / EV */}

          <div className="grid grid-cols-2 gap-6">

            <div>

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-lime-400
                "
              >
                IVs
              </span>

              <div className="mt-2 space-y-1">

                {pokemon.ivs.map((iv) => (
                  <p
                    key={iv}
                    className="text-sm font-semibold text-gray-300"
                  >
                    {iv}
                  </p>
                ))}

              </div>

            </div>

            <div>

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-lime-400
                "
              >
                EVs
              </span>

              <div className="mt-2 space-y-1">

                {pokemon.evs.map((ev) => (
                  <p
                    key={ev}
                    className="text-sm font-semibold text-gray-300"
                  >
                    {ev}
                  </p>
                ))}

              </div>

            </div>

          </div>

          {/* MOVES */}

          <div>

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-lime-400
              "
            >
              Moves
            </span>

            <div className="mt-2 space-y-1.5">

              {pokemon.moves.map((move) => (
                <p
                  key={move}
                  className="
                    text-sm
                    font-semibold
                    text-gray-300
                  "
                >
                  <span className="mr-2 text-lime-400">
                    –
                  </span>

                  {move}
                </p>
              ))}

            </div>

            {pokemon.ability && (
              <div className="mt-5">

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-lime-400
                  "
                >
                  Habilidade
                </span>

                <p className="mt-2 text-sm font-black text-white">
                  {pokemon.ability}
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </article>
  );
}

function RngCard({
  pokemon,
  accent,
  text,
}: {
  pokemon: string;
  accent: string;
  text: string;
}) {
  return (
    <article
      className="
        rounded-2xl
        border
        border-white/[0.07]
        bg-[#090d09]
        p-5
        transition-all
        duration-300
        hover:border-lime-400/15
      "
    >

      <div className="flex items-start gap-4">

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.06]
            bg-black/30
          "
        >

          <img
            src={pokemonSprites[pokemon]}
            alt={pokemon}
            width={48}
            height={48}
            loading="lazy"
            className="h-12 w-12 object-contain"
          />

        </div>

        <div className="min-w-0">

          <h3
            className="text-lg font-black"
            style={{ color: accent }}
          >
            {pokemon}
          </h3>

          <p className="mt-2 text-sm leading-7 text-gray-300">
            {text}
          </p>

        </div>

      </div>

    </article>
  );
}

export default function MorimotoCynthiaPage() {
  return (
    <main className="min-h-screen bg-[#050605] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_20%_0%,rgba(198,255,0,0.10),transparent_42%)]
          "
        />

        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-12">

          <Link
            href="/farm"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-gray-500
              transition-colors
              hover:text-lime-400
            "
          >
            ← Voltar para Farm
          </Link>

          <div className="mt-9 max-w-4xl">

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-lime-400/20
                bg-lime-400/[0.07]
                px-3
                py-1.5
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-lime-400
              "
            >
              PokeMMO • Farm
            </div>

            <h1
              className="
                mt-5
                text-4xl
                font-black
                tracking-tight
                md:text-6xl
              "
            >
              Morimoto & Cynthia
            </h1>

            <p
              className="
                mt-4
                max-w-3xl
                text-base
                leading-7
                text-gray-400
                md:text-lg
              "
            >
              Guia de RNGs e configuração dos Pokémon para
              realizar as lutas de Morimoto e Cynthia.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          MORIMOTO
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-8">

          <p
            className="
              text-[10px]
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
              text-3xl
              font-black
              tracking-tight
              md:text-4xl
            "
          >
            Morimoto
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Configuração principal e Pokémon de backup utilizados
            para a estratégia.
          </p>

        </div>

        {/* TEAM */}

        <div className="space-y-5">

          {morimotoTeam.slice(0, 2).map((pokemon, index) => (
            <TeamCard
              key={pokemon.name}
              pokemon={pokemon}
              index={index + 1}
            />
          ))}

        </div>

        {/* BACKUP */}

        <div className="mt-12">

          <div className="mb-5 flex items-center gap-4">

            <div className="h-px flex-1 bg-white/[0.06]" />

            <h3
              className="
                text-xl
                font-black
                uppercase
                tracking-[0.12em]
                text-white
              "
            >
              Backup
            </h3>

            <div className="h-px flex-1 bg-white/[0.06]" />

          </div>

          <TeamCard
            pokemon={morimotoTeam[2]}
            index={3}
            backup
          />

        </div>

        {/* RNG */}

        <div className="mt-14">

          <div className="mb-7">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-lime-400
              "
            >
              Estratégia
            </p>

            <h3
              className="
                mt-2
                text-2xl
                font-black
                md:text-3xl
              "
            >
              Morimoto RNG's
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Situações específicas e sequência recomendada.
            </p>

          </div>

          <div className="space-y-3">

            {morimotoRngs.map((rng) => (
              <RngCard
                key={rng.pokemon}
                pokemon={rng.pokemon}
                accent={rng.accent}
                text={rng.text}
              />
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          DIVISOR
      ===================================================== */}

      <section className="border-y border-white/[0.06] bg-[#080c08]">

        <div className="mx-auto max-w-7xl px-6 py-10">

          <div className="flex items-center gap-5">

            <div className="h-px flex-1 bg-white/[0.07]" />

            <span
              className="
                rounded-full
                border
                border-lime-400/20
                bg-lime-400/[0.06]
                px-4
                py-2
                text-xs
                font-black
                uppercase
                tracking-[0.15em]
                text-lime-400
              "
            >
              Próxima estratégia
            </span>

            <div className="h-px flex-1 bg-white/[0.07]" />

          </div>

        </div>

      </section>

      {/* =====================================================
          CYNTHIA
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-14">

        <div className="mb-8">

          <p
            className="
              text-[10px]
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
              text-3xl
              font-black
              tracking-tight
              md:text-4xl
            "
          >
            Cynthia
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            RNGs principais para a luta contra Cynthia.
            Siga a sequência apresentada sem precisar navegar
            entre páginas.
          </p>

        </div>

        <div className="space-y-3">

          {cynthiaRngs.map((rng) => (
            <RngCard
              key={rng.pokemon}
              pokemon={rng.pokemon}
              accent={rng.accent}
              text={rng.text}
            />
          ))}

        </div>

        {/* OBSERVAÇÃO */}

        <div
          className="
            mt-10
            rounded-2xl
            border
            border-white/[0.07]
            bg-[#090d09]
            p-6
          "
        >

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-gray-600
            "
          >
            Observação
          </p>

          <p
            className="
              mt-3
              text-sm
              leading-7
              text-gray-400
            "
          >
            Tudo que está destacado neste guia vem de experiência
            em jogo. Não trate as informações como verdade absoluta:
            adapte a estratégia conforme necessário, utilize itens
            quando puder e observe as porcentagens durante a execução.
          </p>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <section className="border-t border-white/[0.06] bg-[#080c08]">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <p className="text-sm font-bold text-white">
                Morimoto & Cynthia
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Guia de RNGs para Farm.
              </p>

            </div>

            <Link
              href="/farm"
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                px-4
                py-2.5
                text-xs
                font-bold
                text-gray-500
                transition-all
                hover:border-lime-400/30
                hover:bg-lime-400/[0.06]
                hover:text-lime-400
              "
            >
              ← Todos os Farms
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}