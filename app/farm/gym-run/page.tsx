import Link from "next/link";

type Pokemon = {
  name: string;
  id: number;
};

type Action = {
  pokemon: string;
  move: string;
};

type Condition = {
  title: string;
  enemy?: string[];
  steps: string[];
};

type Gym = {
  city: string;
  leader: string;
  region: string;

  map?: string;

  lead: Pokemon[];

  mainActions: Action[];

  switches?: string[];

  conditions?: Condition[];

  healAfter?: boolean;
};

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

const sprites: Record<string, number> = {
  Blastoise: 9,
  Togekiss: 468,
  Typhlosion: 157,
  Garchomp: 445,
  Weezing: 110,
  Vanilluxe: 584,

  Houndoom: 229,
  Arcanine: 59,
  Swellow: 277,
  Zebstrika: 523,
  Politoed: 186,
  Flareon: 136,
  Moltres: 146,
  Blissey: 242,
  Victreebel: 71,
  Espeon: 196,
  Wobbuffet: 202,
  Golem: 76,
  Toxicroak: 454,
  Ludicolo: 272,
  Aerodactyl: 142,
  Swampert: 260,

  Ninetales: 38,
  Whimsicott: 547,
  Roserade: 407,
  Infernape: 392,
  Mienshao: 620,
  Probopass: 476,
  Tyranitar: 248,
  Excadrill: 530,
  Cradily: 346,
  Slowbro: 80,
  Sharpedo: 319,

  Metagross: 376,
  Zapdos: 145,
  Pelipper: 279,
  Articuno: 144,
  Walrein: 365,
  Froslass: 478,
  Glalie: 362,
  Mamoswine: 473,

  Pidgeot: 18,
  Skarmory: 227,
  Aerodactyl2: 142,

  Braviary: 628,
  Mandibuzz: 630,
  Swanna: 581,
  Unfezant: 521,

  Galvantula: 596,
  Emolga: 587,

  Emboar: 500,
  Lapras: 131,
  Samurott: 503,

  Sableye: 302,
  Torterra: 389,

  Stantler: 234,

  Leavanny: 542,
  Floatzel: 419,

  Piloswine: 221,
};

function sprite(name: string) {
  const id = sprites[name];

  if (!id) {
    return null;
  }

  return `${SPRITE_BASE}/${id}.png`;
}

function PokemonSprite({
  name,
  size = 78,
}: {
  name: string;
  size?: number;
}) {
  const src = sprite(name);

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className="object-contain"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}

function ActionPokemon({
  action,
}: {
  action: Action;
}) {
  return (
    <div className="flex min-w-[130px] flex-col items-center">
      <PokemonSprite
        name={action.pokemon}
        size={82}
      />

      <div className="mt-1 text-center">
        <div className="text-sm font-black text-white">
          {action.pokemon}
        </div>

        <div className="mt-1 rounded-lg border border-lime-400/20 bg-lime-400/[0.06] px-3 py-1 text-xs font-bold text-lime-400">
          {action.move}
        </div>
      </div>
    </div>
  );
}

function GymHeader({
  gym,
}: {
  gym: Gym;
}) {
  return (
    <div className="mb-5 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b0e0b]">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">

        {gym.map && (
          <div className="flex h-[150px] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-lime-400/20 bg-black sm:w-[235px]">
            <img
              src={gym.map}
              alt={`Mapa de ${gym.city}`}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex-1">

          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-lime-400">
            {gym.region}
          </div>

          <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {gym.city}
          </h3>

          <div className="mt-3 flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/[0.07] bg-black/40">
              <div className="text-center">
                <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-600">
                  Líder
                </span>

                <span className="mt-1 block text-xs font-black text-gray-300">
                  {gym.leader}
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-gray-600">
                Gym Leader
              </div>

              <div className="mt-1 text-lg font-black text-white">
                {gym.leader}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function LeadBox({
  gym,
}: {
  gym: Gym;
}) {
  return (
    <div className="rounded-3xl border border-lime-400/20 bg-[#0b100c] p-5 sm:p-6">

      <div className="mb-5">

        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
          Abertura
        </div>

        <h4 className="mt-1 text-xl font-black text-white">
          Comece com
        </h4>

      </div>

      <div className="flex flex-wrap items-center justify-center gap-8">

        {gym.lead.map((pokemon) => (
          <div
            key={pokemon.name}
            className="flex min-w-[120px] flex-col items-center"
          >
            <div className="flex h-[105px] w-[105px] items-center justify-center rounded-2xl border border-white/[0.06] bg-black/30">
              <PokemonSprite
                name={pokemon.name}
                size={92}
              />
            </div>

            <div className="mt-3 text-sm font-black text-white">
              {pokemon.name}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

function MainActionBox({
  actions,
}: {
  actions: Action[];
}) {
  return (
    <div className="mt-4 rounded-3xl border border-lime-400/20 bg-[#0b100c] p-5 sm:p-6">

      <div className="text-center">

        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-400">
          Faça isso
        </div>

        <div className="mt-2 text-lg font-black text-white">
          Ataques
        </div>

      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-8">

        {actions.map((action, index) => (
          <div
            key={`${action.pokemon}-${action.move}-${index}`}
            className="flex items-center"
          >

            <ActionPokemon action={action} />

            {index < actions.length - 1 && (
              <span className="mx-3 text-2xl font-black text-gray-700">
                +
              </span>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

function ConditionBox({
  condition,
}: {
  condition: Condition;
}) {
  return (
    <div className="mt-4 rounded-3xl border border-red-500/25 bg-red-500/[0.035] p-5 sm:p-6">

      <div className="text-center">

        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
          Atenção
        </div>

        <h4 className="mt-2 text-lg font-black text-red-400">
          {condition.title}
        </h4>

      </div>

      {condition.enemy && condition.enemy.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-5">

          {condition.enemy.map((enemy) => (
            <div
              key={enemy}
              className="flex flex-col items-center"
            >
              <div className="flex h-[85px] w-[85px] items-center justify-center rounded-2xl border border-red-500/15 bg-black/30">
                <PokemonSprite
                  name={enemy}
                  size={72}
                />
              </div>

              <span className="mt-2 text-xs font-bold text-gray-400">
                {enemy}
              </span>
            </div>
          ))}

        </div>
      )}

      <div className="mt-5 space-y-2">

        {condition.steps.map((step, index) => (
          <div
            key={`${step}-${index}`}
            className="rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3 text-sm font-semibold leading-6 text-gray-300"
          >
            {step}
          </div>
        ))}

      </div>

    </div>
  );
}

function GymCard({
  gym,
}: {
  gym: Gym;
}) {
  return (
    <article className="mb-12">

      <GymHeader gym={gym} />

      <div className="mx-auto max-w-4xl">

        <LeadBox gym={gym} />

        <MainActionBox
          actions={gym.mainActions}
        />

        {gym.switches &&
          gym.switches.length > 0 && (
            <div className="mt-4 rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.035] p-5 sm:p-6">

              <div className="text-center">

                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">
                  Troca
                </div>

              </div>

              <div className="mt-4 space-y-2">

                {gym.switches.map(
                  (text, index) => (
                    <div
                      key={`${text}-${index}`}
                      className="rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3 text-sm font-semibold leading-6 text-gray-300"
                    >
                      {text}
                    </div>
                  )
                )}

              </div>

            </div>
          )}

        {gym.conditions?.map(
          (condition, index) => (
            <ConditionBox
              key={`${condition.title}-${index}`}
              condition={condition}
            />
          )
        )}

        {gym.healAfter && (
          <div className="mt-4 rounded-2xl border border-lime-400/25 bg-lime-400/[0.05] px-5 py-4 text-center">

            <span className="text-sm font-black uppercase tracking-[0.16em] text-lime-400">
              HEAL
            </span>

          </div>
        )}

      </div>
    </article>
  );
}

/*
 * ============================================================
 * MAPAS
 * ============================================================
 *
 * Caso você já tenha as imagens dos mapas no /public,
 * substitua estas URLs por:
 *
 * /images/gym-run/hoenn/lavaridge.png
 *
 * etc.
 *
 * A página continua funcionando mesmo sem mapa.
 */

const MAP_HOENN =
  "https://crescentschaos.github.io/pokemmo-resources/tools/gymrerun/";

const gyms: Gym[] = [

  // ==========================================================
  // HOENN
  // ==========================================================

  {
    region: "HOENN",
    city: "Lavaridge Town",
    leader: "Flannery",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Togekiss", id: 468 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Togekiss",
        move: "Helping Hand",
      },
    ],

    conditions: [
      {
        title: "Se aparecer Houndoom / Lv.85 Arcanine",
        enemy: ["Houndoom", "Arcanine"],
        steps: [
          "Water Spout + Hyper Voice",
          "Baixa chance de terminar em 4 turnos.",
          "Cure se o Blastoise estiver danificado.",
        ],
      },
    ],
  },

  {
    region: "HOENN",
    city: "Dewford Town",
    leader: "Brawly",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Vanilluxe", id: 584 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Vanilluxe",
        move: "Blizzard",
      },
    ],

    conditions: [
      {
        title: "Se Vanilluxe cair",
        steps: [
          "Cure antes de continuar.",
        ],
      },
    ],
  },

  {
    region: "HOENN",
    city: "Fortree City",
    leader: "Winona",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Weezing",
        move: "Explosion",
      },
    ],

    switches: [
      "Depois da Explosion, envie Typhlosion + Togekiss.",
    ],

    conditions: [
      {
        title: "Resultado normal",
        steps: [
          "Typhlosion: Eruption",
          "Togekiss: Hyper Voice",
        ],
      },

      {
        title: "Se aparecer Swellow",
        enemy: ["Swellow"],
        steps: [
          "T1: Fake Out em Swellow + Explosion.",
          "Depois envie Vanilluxe + Togekiss.",
          "T2: Blizzard + Hyper Voice.",
        ],
      },
    ],
  },

  {
    region: "HOENN",
    city: "Mauville City",
    leader: "Wattson",

    lead: [
      { name: "Typhlosion", id: 157 },
      { name: "Garchomp", id: 445 },
    ],

    mainActions: [
      {
        pokemon: "Typhlosion",
        move: "Eruption",
      },
      {
        pokemon: "Garchomp",
        move: "Dragon Claw",
      },
    ],

    conditions: [
      {
        title: "Se aparecer Zebstrika com Air Balloon",
        enemy: ["Zebstrika"],
        steps: [
          "Troque Garchomp.",
          "Envie Togekiss.",
          "Typhlosion: Eruption.",
          "Togekiss: Hyper Voice.",
        ],
      },
    ],

    healAfter: true,
  },

  {
    region: "HOENN",
    city: "Rustboro City",
    leader: "Roxanne",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Weezing",
        move: "Assurance",
      },
    ],
  },

  // ==========================================================
  // KANTO
  // ==========================================================

  {
    region: "KANTO",
    city: "Vermilion City",
    leader: "Lt. Surge",

    lead: [
      { name: "Typhlosion", id: 157 },
      { name: "Garchomp", id: 445 },
    ],

    mainActions: [
      {
        pokemon: "Typhlosion",
        move: "Eruption",
      },
      {
        pokemon: "Garchomp",
        move: "Dragon Claw",
      },
    ],

    conditions: [
      {
        title: "Se aparecer Politoed",
        enemy: ["Politoed"],
        steps: [
          "T1: Swift + Earthquake.",
          "Envie Vanilluxe.",
          "T2: Blizzard + Earthquake.",
          "Se Vanilluxe morrer para Earthquake crítico, envie Togekiss.",
          "Togekiss: Hyper Voice.",
          "Cure Typhlosion e Vanilluxe.",
        ],
      },
    ],
  },

  {
    region: "KANTO",
    city: "Cinnabar Island",
    leader: "Blaine",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
    ],

    conditions: [
      {
        title: "Se aparecer Arcanine / Charizard / Typhlosion",
        enemy: ["Arcanine"],
        steps: [
          "T1: Water Spout.",
          "Troque Weezing.",
          "Envie Vanilluxe.",
          "T2: Water Spout + Blizzard.",
        ],
      },

      {
        title: "Se aparecer Flareon",
        enemy: ["Flareon"],
        steps: [
          "Water Spout + Rain Dance.",
        ],
      },

      {
        title: "Se aparecer Moltres com Blissey",
        enemy: ["Moltres", "Blissey"],
        steps: [
          "Water Spout + Assurance.",
          "Dê prioridade ao Assurance em Blissey.",
        ],
      },
    ],
  },

  {
    region: "KANTO",
    city: "Celadon City",
    leader: "Erika",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Weezing",
        move: "Explosion",
      },
    ],

    switches: [
      "Depois da Explosion, envie Typhlosion + Togekiss.",
      "Typhlosion: Eruption.",
      "Togekiss: Hyper Voice.",
    ],

    conditions: [
      {
        title: "Se Victreebel estiver no início",
        enemy: ["Victreebel"],
        steps: [
          "Envie Typhlosion + Garchomp.",
          "T2: Eruption + Dragon Claw.",
        ],
      },
    ],
  },

  {
    region: "KANTO",
    city: "Saffron City",
    leader: "Sabrina",

    lead: [
      { name: "Typhlosion", id: 157 },
      { name: "Garchomp", id: 445 },
    ],

    mainActions: [
      {
        pokemon: "Typhlosion",
        move: "Eruption",
      },
      {
        pokemon: "Garchomp",
        move: "Dragon Claw",
      },
    ],

    switches: [
      "Puzzle: Left → Down → Left → Left.",
    ],

    conditions: [
      {
        title: "Se aparecer Espeon / Wobbuffet",
        enemy: ["Espeon", "Wobbuffet"],
        steps: [
          "T1: Eruption + Earthquake.",
          "Envie Togekiss.",
          "T2: Hyper Voice + Earthquake.",
        ],
      },
    ],

    healAfter: true,
  },

  {
    region: "KANTO",
    city: "Pewter City",
    leader: "Brock",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Weezing",
        move: "Assurance",
      },
    ],

    conditions: [
      {
        title: "Se Golem / Toxicroak",
        enemy: ["Golem", "Toxicroak"],
        steps: [
          "Water Spout + Assurance.",
        ],
      },

      {
        title: "Se Ludicolo / Aerodactyl",
        enemy: ["Ludicolo", "Aerodactyl"],
        steps: [
          "T1: Water Spout + Explosion.",
          "Envie Togekiss + Garchomp.",
          "T2: Hyper Voice + Earthquake.",
        ],
      },

      {
        title: "Se Swampert",
        enemy: ["Swampert"],
        steps: [
          "T1: Water Spout + Explosion.",
          "Envie Typhlosion + Togekiss.",
          "T2: Eruption + Hyper Voice.",
          "Cure se necessário.",
        ],
      },
    ],
  },

  // ==========================================================
  // SINNOH
  // ==========================================================

  {
    region: "SINNOH",
    city: "Eterna City",
    leader: "Gardenia",

    lead: [
      { name: "Typhlosion", id: 157 },
      { name: "Togekiss", id: 468 },
    ],

    mainActions: [
      {
        pokemon: "Typhlosion",
        move: "Swift",
      },
      {
        pokemon: "Togekiss",
        move: "Hyper Voice",
      },
    ],

    conditions: [
      {
        title: "Se aparecer Ninetales",
        enemy: ["Ninetales"],
        steps: [
          "T1: Incinerate + Hyper Voice.",
          "T2: Incinerate.",
          "Troque Togekiss.",
          "Envie Weezing.",
          "T3: Incinerate + Assurance.",
          "Pode precisar curar Typhlosion.",
        ],
      },

      {
        title: "Se aparecer Whimsicott",
        enemy: ["Whimsicott"],
        steps: [
          "T1: Eruption.",
          "Troque Togekiss.",
          "Envie Weezing.",
          "T2: Eruption + Incinerate.",
        ],
      },

      {
        title: "Se aparecer Roserade",
        enemy: ["Roserade"],
        steps: [
          "Eruption + Hyper Voice.",
        ],
      },
    ],
  },

  {
    region: "SINNOH",
    city: "Veilstone City",
    leader: "Maylene",

    lead: [
      { name: "Typhlosion", id: 157 },
      { name: "Togekiss", id: 468 },
    ],

    mainActions: [
      {
        pokemon: "Typhlosion",
        move: "Eruption",
      },
      {
        pokemon: "Togekiss",
        move: "Helping Hand",
      },
    ],

    conditions: [
      {
        title: "Se aparecer Infernape",
        enemy: ["Infernape"],
        steps: [
          "T1: Eruption + Hyper Voice.",
        ],
      },

      {
        title: "Se aparecer Mienshao",
        enemy: ["Mienshao"],
        steps: [
          "T1: Incinerate + Hyper Voice.",
          "Pode precisar curar se Typhlosion estiver danificado.",
        ],
      },
    ],
  },

  {
    region: "SINNOH",
    city: "Oreburgh City",
    leader: "Roark",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Weezing",
        move: "Assurance",
      },
    ],

    conditions: [
      {
        title: "Se aparecer Probopass",
        enemy: ["Probopass"],
        steps: [
          "T1: Water Spout.",
          "Troque Weezing.",
          "Envie Vanilluxe.",
          "T2: Water Spout + Blizzard.",
        ],
      },

      {
        title: "Se aparecer Tyranitar + Excadrill",
        enemy: ["Tyranitar", "Excadrill"],
        steps: [
          "T1: Water Spout + Assurance.",
          "Dê prioridade ao Assurance em Cradily quando necessário.",
        ],
      },

      {
        title: "Se Cradily + Slowbro aparecerem juntos no T2",
        enemy: ["Cradily", "Slowbro"],
        steps: [
          "Se Weezing morrer para Psychic crítico, envie Vanilluxe.",
          "Water Spout + Blizzard.",
        ],
      },
    ],
  },

  {
    region: "SINNOH",
    city: "Pastoria City",
    leader: "Crasher Wake",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Fake Out",
      },
      {
        pokemon: "Weezing",
        move: "Explosion",
      },
    ],

    switches: [
      "Fake Out deve ser usado em Sharpedo.",
      "Depois envie Togekiss + Garchomp.",
      "T2: Hyper Voice + Earthquake.",
    ],

    conditions: [
      {
        title: "Atenção ao Garchomp",
        steps: [
          "Pode precisar curar se Garchomp estiver danificado.",
        ],
      },
    ],
  },

  // ==========================================================
  // JOHTO
  // ==========================================================

  {
    region: "JOHTO",
    city: "Cianwood City",
    leader: "Chuck",

    lead: [
      { name: "Togekiss", id: 468 },
      { name: "Garchomp", id: 445 },
    ],

    mainActions: [
      {
        pokemon: "Togekiss",
        move: "Hyper Voice",
      },
      {
        pokemon: "Garchomp",
        move: "Earthquake",
      },
    ],
  },

  {
    region: "JOHTO",
    city: "Goldenrod City",
    leader: "Whitney",

    lead: [
      { name: "Garchomp", id: 445 },
      { name: "Togekiss", id: 468 },
    ],

    mainActions: [
      {
        pokemon: "Garchomp",
        move: "Earthquake",
      },
      {
        pokemon: "Togekiss",
        move: "Hyper Voice",
      },
    ],

    conditions: [
      {
        title: "Se Garchomp morrer",
        steps: [
          "Envie Typhlosion.",
        ],
      },
    ],

    healAfter: true,
  },

  {
    region: "JOHTO",
    city: "Olivine City",
    leader: "Jasmine",

    lead: [
      { name: "Typhlosion", id: 157 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Typhlosion",
        move: "Eruption",
      },
      {
        pokemon: "Weezing",
        move: "Assurance",
      },
    ],

    conditions: [
      {
        title: "Se aparecer Metagross",
        enemy: ["Metagross"],
        steps: [
          "T1: Eruption + Explosion.",
          "Envie Togekiss + Garchomp.",
          "T2: Hyper Voice + Earthquake.",
        ],
      },
    ],
  },

  {
    region: "JOHTO",
    city: "Violet City",
    leader: "Falkner",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Vanilluxe", id: 584 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Vanilluxe",
        move: "Blizzard",
      },
    ],

    conditions: [
      {
        title: "Se aparecer Zapdos / Pelipper",
        enemy: ["Zapdos", "Pelipper"],
        steps: [
          "Water Spout + Hyper Voice.",
        ],
      },
    ],
  },

  {
    region: "JOHTO",
    city: "Blackthorn City",
    leader: "Clair",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Weezing",
        move: "Explosion",
      },
    ],

    switches: [
      "Depois da Explosion, envie Togekiss + Vanilluxe.",
      "T2: Hyper Voice + Blizzard.",
    ],

    conditions: [
      {
        title: "Se aparecer Blastoise",
        enemy: ["Blastoise"],
        steps: [
          "T1: Fake Out em Blastoise + Explosion.",
        ],
      },
    ],

    healAfter: true,
  },

  {
    region: "JOHTO",
    city: "Mahogany Town",
    leader: "Pryce",

    lead: [
      { name: "Weezing", id: 110 },
      { name: "Garchomp", id: 445 },
    ],

    mainActions: [
      {
        pokemon: "Weezing",
        move: "Explosion",
      },
      {
        pokemon: "Garchomp",
        move: "Dragon Claw",
      },
    ],

    conditions: [
      {
        title: "Se Articuno / Walrein",
        enemy: ["Articuno", "Walrein"],
        steps: [
          "T1: Explosion + Dragon Claw.",
          "Envie Typhlosion + Togekiss.",
          "T2: Eruption + Hyper Voice.",
        ],
      },

      {
        title: "Se Froslass",
        enemy: ["Froslass"],
        steps: [
          "T1: Explosion + Sunny Day.",
          "Envie Typhlosion + Blastoise.",
          "T2: Eruption + Water Spout.",
          "Restaure o PP de Eruption do Typhlosion depois.",
        ],
      },

      {
        title: "Se Glalie",
        enemy: ["Glalie"],
        steps: [
          "T1: Explosion.",
          "Troque para Blastoise para servir de sacrifício.",
          "Envie Typhlosion + Garchomp.",
          "T2: Eruption + Earthquake.",
          "Envie Togekiss.",
          "T3: Hyper Voice + Earthquake.",
        ],
      },

      {
        title: "Se Mamoswine",
        enemy: ["Mamoswine"],
        steps: [
          "T1: Explosion + Dragon Claw em Mamoswine.",
          "Envie Blastoise + Typhlosion.",
          "T2: Water Spout + Eruption.",
        ],
      },
    ],
  },

  // ==========================================================
  // UNOVA
  // ==========================================================

  {
    region: "UNOVA",
    city: "Castelia City",
    leader: "Burgh",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Vanilluxe", id: 584 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Vanilluxe",
        move: "Blizzard",
      },
    ],
  },

  {
    region: "UNOVA",
    city: "Striaton City",
    leader: "Chili / Cilan / Cress",

    lead: [
      { name: "Typhlosion", id: 157 },
      { name: "Togekiss", id: 468 },
    ],

    mainActions: [
      {
        pokemon: "Typhlosion",
        move: "Eruption",
      },
      {
        pokemon: "Togekiss",
        move: "Hyper Voice",
      },
    ],

    conditions: [
      {
        title: "Chili",
        steps: [
          "Lead: Garchomp + Togekiss.",
          "Earthquake + Hyper Voice.",
        ],
      },

      {
        title: "Chili — Ninetales / Stoutland",
        enemy: ["Ninetales"],
        steps: [
          "Helping Hand + Hyper Voice.",
        ],
      },

      {
        title: "Cilan",
        enemy: ["Leavanny"],
        steps: [
          "Incinerate + Hyper Voice.",
          "Se Leavanny: Eruption + Hyper Voice.",
        ],
      },

      {
        title: "Cress",
        enemy: ["Floatzel"],
        steps: [
          "Eruption + Hyper Voice.",
          "Se Floatzel: troque Typhlosion.",
          "Envie Vanilluxe.",
          "Hyper Voice + Hyper Voice.",
        ],
      },
    ],
  },

  {
    region: "UNOVA",
    city: "Mistralton City",
    leader: "Skyla",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Vanilluxe", id: 584 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Vanilluxe",
        move: "Blizzard",
      },
    ],

    conditions: [
      {
        title: "Braviary / Mandibuzz",
        enemy: ["Braviary", "Mandibuzz"],
        steps: [
          "Water Spout + Blizzard.",
        ],
      },

      {
        title: "Swanna / Whimsicott",
        enemy: ["Swanna", "Whimsicott"],
        steps: [
          "Blizzard + Blizzard.",
        ],
      },

      {
        title: "Unfezant",
        enemy: ["Unfezant"],
        steps: [
          "T1: Blizzard.",
          "Troque Blastoise.",
          "Envie Weezing.",
          "T2: Assurance + Blizzard.",
        ],
      },
    ],
  },

  {
    region: "UNOVA",
    city: "Nimbasa City",
    leader: "Elesa",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Weezing",
        move: "Explosion",
      },
    ],

    conditions: [
      {
        title: "Se Galvantula",
        enemy: ["Galvantula"],
        steps: [
          "Fake Out em Emolga ou Galvantula quando necessário.",
          "T2: Swift + Hyper Voice.",
        ],
      },
    ],

    switches: [
      "Depois da Explosion, envie Typhlosion + Togekiss.",
      "T2: Eruption + Hyper Voice.",
    ],

    healAfter: true,
  },

  {
    region: "UNOVA",
    city: "Opelucid City",
    leader: "Iris",

    lead: [
      { name: "Typhlosion", id: 157 },
      { name: "Vanilluxe", id: 584 },
    ],

    mainActions: [
      {
        pokemon: "Typhlosion",
        move: "Eruption",
      },
      {
        pokemon: "Vanilluxe",
        move: "Blizzard",
      },
    ],

    conditions: [
      {
        title: "Emboar sobrevive e derrota Vanilluxe",
        enemy: ["Emboar"],
        steps: [
          "Envie Blastoise.",
          "Blizzard.",
        ],
      },

      {
        title: "Lapras sobrevive e derrota Typhlosion",
        enemy: ["Lapras"],
        steps: [
          "Envie Garchomp.",
          "Earthquake.",
        ],
      },

      {
        title: "Samurott sobrevive e derrota Typhlosion",
        enemy: ["Samurott"],
        steps: [
          "Envie Togekiss.",
          "Hyper Voice.",
        ],
      },
    ],

    healAfter: true,
  },

  {
    region: "UNOVA",
    city: "Driftveil City",
    leader: "Clay",

    lead: [
      { name: "Blastoise", id: 9 },
      { name: "Weezing", id: 110 },
    ],

    mainActions: [
      {
        pokemon: "Blastoise",
        move: "Water Spout",
      },
      {
        pokemon: "Weezing",
        move: "Rain Dance",
      },
    ],

    conditions: [
      {
        title: "Se Sableye",
        enemy: ["Sableye"],
        steps: [
          "T1: Water Spout + Explosion.",
          "Envie Togekiss + outro Pokémon disponível.",
          "T2: Hyper Voice + Blizzard / Eruption / Earthquake.",
        ],
      },

      {
        title: "Se Torterra",
        enemy: ["Torterra"],
        steps: [
          "Water Spout + Assurance.",
        ],
      },
    ],
  },

  {
    region: "UNOVA",
    city: "Nacrene City",
    leader: "Lenora",

    lead: [
      { name: "Weezing", id: 110 },
      { name: "Garchomp", id: 445 },
    ],

    mainActions: [
      {
        pokemon: "Weezing",
        move: "Explosion",
      },
      {
        pokemon: "Garchomp",
        move: "Sunny Day",
      },
    ],

    switches: [
      "Depois da Explosion + Sunny Day, envie Typhlosion + Togekiss.",
      "T2: Eruption + Hyper Voice.",
    ],

    conditions: [
      {
        title: "Se Stantler",
        enemy: ["Stantler"],
        steps: [
          "T1: Explosion.",
          "Troque Garchomp.",
          "Envie Typhlosion como sacrifício.",
          "Depois envie Togekiss + Garchomp.",
          "T2: Hyper Voice + Earthquake.",
        ],
      },

      {
        title: "Requisito",
        steps: [
          "Use esta rota somente se houver aproximadamente 2:45 restantes.",
          "Garchomp precisa morrer.",
          "Weezing e Typhlosion precisam estar vivos.",
        ],
      },
    ],
  },
];

function RegionHeader({
  region,
}: {
  region: string;
}) {
  return (
    <div className="mb-8 mt-16 first:mt-0">

      <div className="flex items-center gap-4">

        <div className="h-px flex-1 bg-white/[0.07]" />

        <div className="rounded-full border border-lime-400/20 bg-lime-400/[0.05] px-5 py-2">

          <span className="text-xs font-black uppercase tracking-[0.25em] text-lime-400">
            {region}
          </span>

        </div>

        <div className="h-px flex-1 bg-white/[0.07]" />

      </div>

    </div>
  );
}

export default function GymRunPage() {
  let currentRegion = "";

  return (
    <main className="min-h-screen bg-[#050605] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-white/[0.06] bg-[#070907]">

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">

          <Link
            href="/farm"
            className="text-sm font-bold text-gray-600 transition-colors hover:text-lime-400"
          >
            ← Voltar para Farms
          </Link>

          <div className="mt-8 max-w-3xl">

            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-lime-400">
              PokeMMO • Gym Run
            </div>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              6 Pillars Gym Rerun
            </h1>

            <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
              Rota contínua. Comece no topo e apenas role para baixo.
              Não é necessário trocar de página durante a run.
            </p>

          </div>

          {/* REQUIREMENTS */}

          <div className="mt-7 flex flex-wrap gap-3">

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">

              <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-gray-600">
                Pokémon
              </span>

              <strong className="mt-1 block text-sm text-white">
                6 Gym Run Pokémon
              </strong>

            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">

              <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-gray-600">
                Requisito
              </span>

              <strong className="mt-1 block text-sm text-white">
                5 regiões finalizadas
              </strong>

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          TEAM SUMMARY
      ===================================================== */}

      <section className="border-b border-white/[0.06] bg-[#080b08]">

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">

          <div className="mb-5">

            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              Equipe
            </div>

            <h2 className="mt-1 text-xl font-black text-white">
              Six Pillars
            </h2>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {[
              "Typhlosion",
              "Blastoise",
              "Vanilluxe",
              "Garchomp",
              "Weezing",
              "Togekiss",
            ].map((name) => (

              <div
                key={name}
                className="rounded-2xl border border-white/[0.06] bg-black/20 p-4 text-center"
              >

                <div className="flex h-24 items-center justify-center">

                  <PokemonSprite
                    name={name}
                    size={90}
                  />

                </div>

                <div className="mt-2 text-xs font-black text-gray-300">
                  {name}
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTINUOUS ROUTE
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-6">

        {gyms.map((gym, index) => {

          const showRegion =
            currentRegion !== gym.region;

          currentRegion = gym.region;

          return (
            <div key={`${gym.region}-${gym.city}`}>

              {showRegion && (
                <RegionHeader
                  region={gym.region}
                />
              )}

              <div className="relative">

                {/* vertical route line */}

                {index < gyms.length - 1 && (
                  <div className="absolute left-1/2 top-full hidden h-12 w-px -translate-x-1/2 bg-gradient-to-b from-lime-400/20 to-transparent lg:block" />
                )}

                <GymCard gym={gym} />

              </div>

            </div>
          );
        })}

      </div>

      {/* =====================================================
          END
      ===================================================== */}

      <section className="border-t border-white/[0.06] bg-[#080b08]">

        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6">

          <div className="rounded-3xl border border-lime-400/20 bg-lime-400/[0.035] p-7 text-center">

            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-lime-400">
              Rota concluída
            </div>

            <h2 className="mt-3 text-2xl font-black text-white">
              6 Pillars Gym Rerun
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Todas as instruções da rota foram apresentadas em sequência.
              Basta voltar ao topo da página na próxima run.
            </p>

            <Link
              href="/farm"
              className="mt-6 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-xs font-black text-gray-400 transition-colors hover:border-lime-400/20 hover:text-lime-400"
            >
              ← Voltar para Farms
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}