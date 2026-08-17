"use client";

import Link from "next/link";
import { useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type Pokemon = {
  name: string;
  item: string;
  ability: string;
  nature: string;
  ivs: string;
  evs: string;
  moves: string[];
  sprite: string;
};

type Step = {
  title?: string;
  text?: string;
  lead?: string[];
  actions?: string[];
  condition?: string;
  note?: string;
  heal?: boolean;
};

type Gym = {
  city: string;
  leader: string;
  image?: string;
  optional?: boolean;
  requirement?: string;
  steps: Step[];
};

type Region = {
  name: string;
  gyms: Gym[];
};

/* =========================================================
   TEAM
========================================================= */

const team: Pokemon[] = [
  {
    name: "Typhlosion",
    item: "Choice Specs",
    ability: "Blaze",
    nature: "Modest",
    ivs: "10-31 HP / 10-31 Def / 31 SpA / 31 Spe",
    evs: "252 SpA / 6 SpD / 252 Spe",
    moves: [
      "Eruption",
      "Swift",
      "Incinerate",
      "Cut",
    ],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png",
  },

  {
    name: "Blastoise",
    item: "Choice Scarf",
    ability: "Torrent",
    nature: "Mild",
    ivs: "0-25 HP / 0-25 Def / 31 SpA / 31 Spe",
    evs: "252 SpA / 6 SpD / 252 Spe",
    moves: [
      "Water Spout",
      "Blizzard",
      "Fake Out",
      "Helping Hand",
    ],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
  },

  {
    name: "Vanilluxe",
    item: "Choice Scarf",
    ability: "Snow Warning",
    nature: "Modest",
    ivs: "28-31 HP* / 28-31 Def* / 31 SpA / 31 Spe",
    evs: "6 Def / 252 SpA / 252 Spe",
    moves: [
      "Ice Beam",
      "Blizzard",
      "Hyper Voice",
    ],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/584.png",
  },

  {
    name: "Garchomp",
    item: "Choice Band",
    ability: "Sand Veil / Rough Skin*",
    nature: "Lonely",
    ivs: "0-8 HP* / 0-8 Def* / 31 Atk / 25-31 SpD / 31 Spe",
    evs: "252 Atk / 26 SpD / 232 Spe",
    moves: [
      "Earthquake",
      "Dragon Claw",
      "Sunny Day",
      "Helping Hand",
    ],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png",
  },

  {
    name: "Weezing",
    item: "Choice Band",
    ability: "Reactive Gas",
    nature: "Adamant",
    ivs: "31 Atk / 31 Spe",
    evs: "252 Atk / 6 Def / 252 Spe",
    moves: [
      "Assurance",
      "Explosion",
      "Incinerate",
      "Rain Dance",
    ],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/110.png",
  },

  {
    name: "Togekiss",
    item: "Choice Specs",
    ability: "Hustle",
    nature: "Modest",
    ivs: "31 SpA / 31 Spe",
    evs: "252 SpA / 6 SpD / 252 Spe",
    moves: [
      "Hyper Voice",
      "Helping Hand",
      "Shock Wave",
      "Fly",
    ],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/468.png",
  },
];

/* =========================================================
   ROUTE
========================================================= */

const regions: Region[] = [
  {
    name: "Hoenn",

    gyms: [
      {
        city: "Lavaridge Town",
        leader: "Flannery",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Togekiss"],
            actions: [
              "Water Spout + Helping Hand",
            ],
          },

          {
            condition:
              "Se aparecer Houndoom ou Arcanine nível 85",
            actions: [
              "Water Spout + Hyper Voice",
            ],
            note:
              "Baixa chance de terminar em 4 turnos. Cure se o Blastoise estiver danificado.",
          },
        ],
      },

      {
        city: "Dewford Town",
        leader: "Brawly",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Vanilluxe"],
            actions: [
              "Water Spout + Blizzard",
            ],
            note:
              "Cure se o Vanilluxe for derrotado.",
          },
        ],
      },

      {
        city: "Fortree City",
        leader: "Winona",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
            actions: [
              "T1: Water Spout + Explosion",
            ],
          },

          {
            title: "Depois da Explosion",
            lead: ["Typhlosion", "Togekiss"],
            actions: [
              "T2: Eruption + Hyper Voice",
            ],
          },

          {
            condition: "Se aparecer Swellow",
            actions: [
              "T1: Fake Out em Swellow + Explosion",
            ],
          },

          {
            title: "Contra Swellow",
            lead: ["Vanilluxe", "Togekiss"],
            actions: [
              "T2: Blizzard + Hyper Voice",
            ],
          },
        ],
      },

      {
        city: "Mauville City",
        leader: "Wattson",
        steps: [
          {
            title: "Lead",
            lead: ["Typhlosion", "Garchomp"],
            actions: [
              "Eruption + Dragon Claw",
            ],
          },

          {
            condition:
              "Se aparecer Zebstrika com Air Balloon",
            actions: [
              "Retire Garchomp.",
              "Envie Togekiss.",
              "Eruption + Hyper Voice",
            ],
            heal: true,
          },
        ],
      },

      {
        city: "Rustboro City",
        leader: "Roxanne",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
            actions: [
              "Water Spout + Assurance",
            ],
          },
        ],
      },
    ],
  },

  {
    name: "Kanto",

    gyms: [
      {
        city: "Vermilion City",
        leader: "Lt. Surge",
        steps: [
          {
            title: "Lead",
            lead: ["Typhlosion", "Garchomp"],
            actions: [
              "Eruption + Dragon Claw",
            ],
          },

          {
            condition: "Se aparecer Politoed",
            actions: [
              "T1: Swift + Earthquake",
              "Envie Vanilluxe.",
              "T2: Blizzard + Earthquake",
            ],
            note:
              "Se Vanilluxe morrer para um Earthquake crítico, envie Togekiss e use Hyper Voice.",
          },

          {
            note:
              "Requer cura de Typhlosion e Vanilluxe.",
          },
        ],
      },

      {
        city: "Cinnabar Island",
        leader: "Blaine",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
          },

          {
            condition:
              "Se aparecer Arcanine, Charizard ou Typhlosion",
            actions: [
              "T1: Water Spout.",
              "Retire Weezing.",
              "Envie Vanilluxe.",
              "T2: Water Spout + Blizzard",
            ],
          },

          {
            condition: "Se aparecer Flareon",
            actions: [
              "Water Spout + Rain Dance",
            ],
          },

          {
            condition:
              "Se aparecer Moltres com Blissey",
            actions: [
              "Water Spout + Assurance",
              "Priorize Assurance em Blissey.",
            ],
          },
        ],
      },

      {
        city: "Celadon City",
        leader: "Erika",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
            actions: [
              "T1: Water Spout + Explosion",
              "Envie Typhlosion e Togekiss.",
              "T2: Eruption + Hyper Voice",
            ],
          },

          {
            condition:
              "Se Victreebel estiver no início",
            actions: [
              "Envie Typhlosion e Garchomp.",
              "T2: Eruption + Dragon Claw",
            ],
          },
        ],
      },

      {
        city: "Saffron City",
        leader: "Sabrina",
        steps: [
          {
            title: "Puzzle",
            actions: [
              "Left → Down → Left → Left",
            ],
          },

          {
            title: "Lead",
            lead: ["Typhlosion", "Garchomp"],
            actions: [
              "Eruption + Dragon Claw",
            ],
          },

          {
            condition:
              "Se aparecer Espeon ou Wobbuffet",
            actions: [
              "T1: Eruption + Earthquake",
              "Envie Togekiss.",
              "T2: Hyper Voice + Earthquake",
            ],
            heal: true,
          },
        ],
      },

      {
        city: "Pewter City",
        leader: "Brock",
        optional: true,
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
          },

          {
            condition:
              "Se aparecer Golem ou Toxicroak",
            actions: [
              "Water Spout + Assurance",
            ],
          },

          {
            condition:
              "Se aparecer Ludicolo ou Aerodactyl",
            actions: [
              "T1: Water Spout + Explosion",
              "Envie Togekiss e Garchomp.",
              "T2: Hyper Voice + Earthquake",
            ],
          },

          {
            condition: "Se aparecer Swampert",
            actions: [
              "T1: Water Spout + Explosion",
              "Envie Typhlosion e Togekiss.",
              "T2: Eruption + Hyper Voice",
            ],
            heal: true,
          },
        ],
      },
    ],
  },

  {
    name: "Sinnoh",

    gyms: [
      {
        city: "Eterna City",
        leader: "Gardenia",
        steps: [
          {
            title: "Lead",
            lead: ["Typhlosion", "Togekiss"],
            actions: [
              "Swift + Hyper Voice",
            ],
          },

          {
            condition: "Se aparecer Ninetales",
            actions: [
              "T1: Incinerate + Hyper Voice",
              "T2: Incinerate",
              "Retire Togekiss.",
              "Envie Weezing.",
              "T3: Incinerate + Assurance",
            ],
            note:
              "Pode ser necessário curar caso Typhlosion esteja com pouco HP.",
          },

          {
            condition: "Se aparecer Whimsicott",
            actions: [
              "T1: Eruption",
              "Retire Togekiss.",
              "Envie Weezing.",
              "T2: Eruption + Incinerate",
            ],
          },

          {
            condition: "Se aparecer Roserade",
            actions: [
              "Eruption + Hyper Voice",
            ],
          },
        ],
      },

      {
        city: "Veilstone City",
        leader: "Maylene",
        steps: [
          {
            title: "Lead",
            lead: ["Typhlosion", "Togekiss"],
            actions: [
              "Eruption + Helping Hand",
            ],
          },

          {
            condition: "Se aparecer Infernape",
            actions: [
              "T1: Eruption + Hyper Voice",
            ],
          },

          {
            condition: "Se aparecer Mienshao",
            actions: [
              "T1: Incinerate + Hyper Voice",
            ],
            note:
              "Pode ser necessário curar caso Typhlosion esteja com pouco HP.",
          },
        ],
      },

      {
        city: "Oreburgh City",
        leader: "Roark",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
            actions: [
              "Water Spout + Assurance",
            ],
          },

          {
            condition: "Se aparecer Probopass",
            actions: [
              "T1: Water Spout",
              "Retire Weezing.",
              "Envie Vanilluxe.",
              "T2: Water Spout + Blizzard",
            ],
          },

          {
            condition:
              "Se aparecer Tyranitar e Excadrill",
            actions: [
              "T1: Water Spout + Assurance",
              "Priorize Assurance em Cradily.",
            ],
          },

          {
            condition:
              "Se Cradily e Slowbro aparecerem juntos no turno 2",
            actions: [
              "Se Weezing for derrotado por Psychic crítico, envie Vanilluxe.",
              "Water Spout + Blizzard",
            ],
          },
        ],
      },

      {
        city: "Pastoria City",
        leader: "Crasher Wake",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
            actions: [
              "T1: Fake Out em Sharpedo + Explosion",
              "Envie Togekiss e Garchomp.",
              "T2: Hyper Voice + Earthquake",
            ],
            note:
              "Pode ser necessário curar se Garchomp estiver danificado.",
          },
        ],
      },
    ],
  },

  {
    name: "Johto",

    gyms: [
      {
        city: "Cianwood City",
        leader: "Chuck",
        steps: [
          {
            title: "Lead",
            lead: ["Togekiss", "Garchomp"],
            actions: [
              "T1: Hyper Voice + Earthquake",
            ],
          },
        ],
      },

      {
        city: "Goldenrod City",
        leader: "Whitney",
        steps: [
          {
            title: "Lead",
            lead: ["Garchomp", "Togekiss"],
            actions: [
              "T1: Earthquake + Hyper Voice",
            ],
            note:
              "Garchomp deve estar no Slot 1 e Togekiss no Slot 2.",
          },

          {
            note:
              "Envie Typhlosion caso Garchomp seja derrotado.",
            heal: true,
          },
        ],
      },

      {
        city: "Olivine City",
        leader: "Jasmine",
        steps: [
          {
            title: "Lead",
            lead: ["Typhlosion", "Weezing"],
            actions: [
              "T1: Eruption + Assurance",
            ],
          },

          {
            condition: "Se aparecer Metagross",
            actions: [
              "T1: Eruption + Explosion",
              "Envie Togekiss e Garchomp.",
              "T2: Hyper Voice + Earthquake",
            ],
          },
        ],
      },

      {
        city: "Violet City",
        leader: "Falkner",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Vanilluxe"],
            actions: [
              "T1: Water Spout + Blizzard",
            ],
          },

          {
            condition:
              "Se aparecer Zapdos ou Pelipper",
            actions: [
              "T1: Water Spout + Hyper Voice",
            ],
          },

          {
            note:
              "A chance de Pidgeot ser lead é 20%. A chance de sofrer hit + flinch de Rock Slide do Choice Scarf Aerodactyl é 30%. Assumindo entrada no turno 2 com Skarmory, a chance de limpar o lead em mais de 3 turnos é 24,3%. A chance geral de uma run de 4 turnos nesse Gym é 4,86%.",
          },

          {
            note:
              "Pode ser necessário curar caso o solve de Olivine tenha usado Explosion.",
          },
        ],
      },

      {
        city: "Blackthorn City",
        leader: "Clair",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
            actions: [
              "T1: Water Spout + Explosion",
              "Envie Togekiss e Vanilluxe.",
              "T2: Hyper Voice + Blizzard",
            ],
          },

          {
            condition: "Se aparecer Blastoise",
            actions: [
              "T1: Fake Out em Blastoise + Explosion",
            ],
            heal: true,
          },
        ],
      },

      {
        city: "Mahogany Town",
        leader: "Pryce",
        optional: true,
        requirement:
          "Requer Garchomp morto. Pule caso Garchomp ainda esteja vivo.",
        steps: [
          {
            title: "Lead",
            lead: ["Weezing", "Garchomp"],
          },

          {
            condition:
              "Se aparecer Articuno ou Walrein",
            actions: [
              "T1: Explosion + Dragon Claw em Articuno/Walrein.",
              "Envie Typhlosion e Togekiss.",
              "T2: Eruption + Hyper Voice",
            ],
          },

          {
            condition: "Se aparecer Froslass",
            actions: [
              "T1: Explosion + Sunny Day",
              "Envie Typhlosion e Blastoise.",
              "T2: Eruption + Water Spout",
            ],
            note:
              "É necessário restaurar o PP de Eruption do Typhlosion depois.",
          },

          {
            condition: "Se aparecer Glalie",
            actions: [
              "T1: Explosion",
              "Troque para Blastoise para servir de sacrifício.",
              "Envie Typhlosion e Garchomp.",
              "T2: Eruption + Earthquake",
              "Envie Togekiss.",
              "T3: Hyper Voice + Earthquake",
            ],
          },

          {
            condition: "Se aparecer Mamoswine",
            actions: [
              "T1: Explosion + Dragon Claw em Mamoswine.",
              "Envie Blastoise e Typhlosion.",
              "T2: Water Spout + Eruption",
            ],
          },
        ],
      },
    ],
  },

  {
    name: "Unova",

    gyms: [
      {
        city: "Castelia City",
        leader: "Burgh",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Vanilluxe"],
            actions: [
              "Water Spout + Blizzard",
            ],
          },
        ],
      },

      {
        city: "Striaton City",
        leader: "Chili / Cilan / Cress",
        steps: [
          {
            condition: "Vs. Chili",
            actions: [
              "Lead: Garchomp + Togekiss",
              "Earthquake + Hyper Voice",
            ],
          },

          {
            condition:
              "Vs. Chili — Ninetales ou Stoutland",
            actions: [
              "Helping Hand + Hyper Voice",
            ],
          },

          {
            condition: "Vs. Cilan",
            actions: [
              "Lead: Typhlosion + Togekiss",
              "Incinerate + Hyper Voice",
            ],
          },

          {
            condition:
              "Vs. Cilan — Leavanny",
            actions: [
              "Eruption + Hyper Voice",
            ],
          },

          {
            condition: "Vs. Cress",
            actions: [
              "Lead: Typhlosion + Togekiss",
              "Eruption + Hyper Voice",
            ],
          },

          {
            condition:
              "Vs. Cress — Floatzel",
            actions: [
              "Retire Typhlosion.",
              "Envie Vanilluxe.",
              "Hyper Voice + Hyper Voice",
            ],
          },
        ],
      },

      {
        city: "Mistralton City",
        leader: "Skyla",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Vanilluxe"],
          },

          {
            condition:
              "Se aparecer Braviary ou Mandibuzz",
            actions: [
              "Water Spout + Blizzard",
            ],
          },

          {
            condition:
              "Se aparecer Swanna ou Whimsicott",
            actions: [
              "Blizzard + Blizzard",
            ],
          },

          {
            condition: "Se aparecer Unfezant",
            actions: [
              "T1: Blizzard",
              "Retire Blastoise.",
              "Envie Weezing.",
              "T2: Assurance + Blizzard",
            ],
          },
        ],
      },

      {
        city: "Nimbasa City",
        leader: "Elesa",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
            actions: [
              "T1: Water Spout + Explosion",
            ],
            note:
              "Use Fake Out em Emolga ou Galvantula quando necessário.",
          },

          {
            title: "Depois da Explosion",
            lead: ["Typhlosion", "Togekiss"],
            actions: [
              "T2: Eruption + Hyper Voice",
            ],
          },

          {
            condition: "Se aparecer Galvantula",
            actions: [
              "T2: Swift + Hyper Voice",
            ],
            heal: true,
          },
        ],
      },

      {
        city: "Opelucid City",
        leader: "Iris",
        steps: [
          {
            title: "Lead",
            lead: ["Typhlosion", "Vanilluxe"],
            actions: [
              "Eruption + Blizzard",
            ],
          },

          {
            condition:
              "Se Emboar sobreviver e derrotar Vanilluxe",
            actions: [
              "Envie Blastoise.",
              "Blizzard",
            ],
          },

          {
            condition:
              "Se Lapras sobreviver e derrotar Typhlosion",
            actions: [
              "Envie Garchomp.",
              "Earthquake",
            ],
          },

          {
            condition:
              "Se Samurott sobreviver e derrotar Typhlosion",
            actions: [
              "Envie Togekiss.",
              "Hyper Voice",
            ],
            heal: true,
          },
        ],
      },

      {
        city: "Driftveil City",
        leader: "Clay",
        steps: [
          {
            title: "Lead",
            lead: ["Blastoise", "Weezing"],
            actions: [
              "Water Spout + Rain Dance",
            ],
          },

          {
            condition: "Se aparecer Sableye",
            actions: [
              "T1: Water Spout + Explosion",
              "Envie Togekiss + qualquer Pokémon disponível.",
              "T2: Hyper Voice + Blizzard/Eruption/Earthquake",
            ],
          },

          {
            condition: "Se aparecer Torterra",
            actions: [
              "Water Spout + Assurance",
            ],
          },
        ],
      },

      {
        city: "Nacrene City",
        leader: "Lenora",
        requirement:
          "Fazer apenas se houver 2:45 minutos restantes. Requer Garchomp morto e Weezing + Typhlosion vivos.",
        steps: [
          {
            title: "Lead",
            lead: ["Weezing", "Garchomp"],
            actions: [
              "T1: Explosion + Sunny Day",
              "Envie Typhlosion e Togekiss.",
              "T2: Eruption + Hyper Voice",
            ],
          },

          {
            condition: "Se aparecer Stantler",
            actions: [
              "T1: Explosion",
              "Troque Garchomp.",
              "Envie Typhlosion como sacrifício.",
              "Envie Togekiss e Garchomp.",
              "T2: Hyper Voice + Earthquake",
            ],
          },
        ],
      },
    ],
  },
];

/* =========================================================
   COMPONENTS
========================================================= */

function TeamCard({
  pokemon,
  index,
}: {
  pokemon: Pokemon;
  index: number;
}) {
  return (
    <article
      className="
        group overflow-hidden rounded-3xl
        border border-white/[0.07]
        bg-[#090d09]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-lime-400/20
        hover:shadow-2xl
        hover:shadow-lime-950/10
      "
    >
      <div
        className="
          flex items-center justify-between
          border-b border-white/[0.06]
          px-5 py-4
        "
      >
        <div className="flex items-center gap-3">
          <span
            className="
              flex h-7 w-7 items-center justify-center
              rounded-lg border border-white/[0.07]
              bg-white/[0.03]
              text-xs font-black text-gray-500
            "
          >
            {index + 1}
          </span>

          <span
            className="
              text-xs font-bold uppercase
              tracking-[0.15em] text-gray-600
            "
          >
            Pokémon
          </span>
        </div>

        <span
          className="
            h-2 w-2 rounded-full
            bg-lime-400
            shadow-[0_0_10px_rgba(198,255,0,0.65)]
          "
        />
      </div>

      <div
        className="
          grid grid-cols-1 gap-5 p-5
          sm:grid-cols-[160px_1fr]
        "
      >
        <div
          className="
            flex min-h-[160px]
            items-center justify-center
            rounded-2xl
            border border-white/[0.05]
            bg-black/30
          "
        >
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            width={160}
            height={160}
            loading="lazy"
            className="
              h-[160px] w-[160px]
              object-contain
              transition-transform duration-300
              group-hover:scale-105
            "
          />
        </div>

        <div className="min-w-0">
          <div
            className="
              flex flex-col gap-1
              sm:flex-row sm:items-center sm:justify-between
            "
          >
            <h3
              className="
                text-2xl font-black
                tracking-tight text-white
              "
            >
              {pokemon.name}
            </h3>

            <span
              className="
                w-fit rounded-lg
                border border-lime-400/20
                bg-lime-400/[0.06]
                px-2.5 py-1
                text-[10px] font-bold
                uppercase tracking-wider
                text-lime-400
              "
            >
              {pokemon.item}
            </span>
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <InfoRow
              label="Ability"
              value={pokemon.ability}
            />

            <InfoRow
              label="Nature"
              value={pokemon.nature}
            />

            <InfoRow
              label="IVs"
              value={pokemon.ivs}
            />

            <InfoRow
              label="EVs"
              value={pokemon.evs}
            />
          </div>

          <div className="mt-5">
            <span
              className="
                text-[10px] font-bold uppercase
                tracking-[0.18em] text-gray-600
              "
            >
              Moves
            </span>

            <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {pokemon.moves.map((move) => (
                <div
                  key={move}
                  className="
                    flex items-center gap-2
                    text-sm text-gray-300
                  "
                >
                  <span className="text-lime-400">
                    –
                  </span>

                  {move}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-wrap gap-x-2">
      <span className="text-gray-600">
        {label}:
      </span>

      <span className="font-semibold text-gray-300">
        {value}
      </span>
    </div>
  );
}

function GymCard({
  gym,
  index,
}: {
  gym: Gym;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={[
        "overflow-hidden rounded-2xl border",
        "bg-[#090d09]",
        "transition-all duration-300",
        open
          ? "border-lime-400/20 shadow-xl shadow-lime-950/10"
          : "border-white/[0.07]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          flex w-full items-center
          gap-4 px-5 py-5
          text-left
          transition-colors
          hover:bg-white/[0.015]
        "
      >
        <span
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-xl
            border border-white/[0.07]
            bg-white/[0.025]
            text-xs font-black
            text-gray-500
          "
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={[
                "text-lg font-black",
                open
                  ? "text-lime-400"
                  : "text-white",
              ].join(" ")}
            >
              {gym.city}
            </h3>

            {gym.optional && (
              <span
                className="
                  rounded-full
                  border border-yellow-400/20
                  bg-yellow-400/[0.06]
                  px-2 py-0.5
                  text-[9px] font-bold
                  uppercase tracking-wider
                  text-yellow-400
                "
              >
                Opcional
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-600">
            Gym Leader:{" "}
            <span className="text-gray-400">
              {gym.leader}
            </span>
          </p>
        </div>

        <span
          className={[
            "flex h-9 w-9 shrink-0",
            "items-center justify-center",
            "rounded-lg border border-white/[0.07]",
            "bg-white/[0.025]",
            "text-gray-500",
            "transition-transform duration-300",
            open ? "rotate-180 text-lime-400" : "",
          ].join(" ")}
        >
          ↓
        </span>
      </button>

      <div
        className={[
          "grid transition-[grid-template-rows,opacity]",
          "duration-300",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="
              border-t border-white/[0.06]
              p-5
            "
          >
            {gym.requirement && (
              <div
                className="
                  mb-5 rounded-xl
                  border border-yellow-400/15
                  bg-yellow-400/[0.04]
                  p-4
                "
              >
                <span
                  className="
                    text-[10px] font-bold
                    uppercase tracking-[0.18em]
                    text-yellow-400
                  "
                >
                  Requisito
                </span>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {gym.requirement}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {gym.steps.map((step, stepIndex) => (
                <div
                  key={stepIndex}
                  className="
                    rounded-xl
                    border border-white/[0.06]
                    bg-black/20
                    p-4
                  "
                >
                  {step.title && (
                    <p
                      className="
                        text-xs font-black
                        uppercase tracking-[0.16em]
                        text-lime-400
                      "
                    >
                      {step.title}
                    </p>
                  )}

                  {step.condition && (
                    <div
                      className="
                        flex items-start gap-2
                        text-sm font-bold
                        text-white
                      "
                    >
                      <span className="text-lime-400">
                        →
                      </span>

                      <span>
                        {step.condition}
                      </span>
                    </div>
                  )}

                  {step.lead && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {step.lead.map((pokemon) => (
                        <span
                          key={pokemon}
                          className="
                            rounded-lg
                            border border-lime-400/15
                            bg-lime-400/[0.06]
                            px-3 py-1.5
                            text-xs font-bold
                            text-lime-400
                          "
                        >
                          {pokemon}
                        </span>
                      ))}
                    </div>
                  )}

                  {step.actions && (
                    <div className="mt-3 space-y-2">
                      {step.actions.map(
                        (action, actionIndex) => (
                          <div
                            key={actionIndex}
                            className="
                              flex items-start gap-2
                              text-sm leading-6
                              text-gray-300
                            "
                          >
                            <span className="mt-1 text-lime-400">
                              •
                            </span>

                            <span>
                              {action}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {step.text && (
                    <p className="text-sm leading-6 text-gray-400">
                      {step.text}
                    </p>
                  )}

                  {step.note && (
                    <div
                      className="
                        mt-4
                        border-t border-white/[0.05]
                        pt-3
                        text-xs leading-5
                        text-gray-500
                      "
                    >
                      <span className="font-bold text-gray-400">
                        Nota:
                      </span>{" "}
                      {step.note}
                    </div>
                  )}

                  {step.heal && (
                    <div
                      className="
                        mt-4 flex items-center gap-2
                        rounded-lg
                        border border-lime-400/15
                        bg-lime-400/[0.05]
                        px-3 py-2
                      "
                    >
                      <span
                        className="
                          h-2 w-2 rounded-full
                          bg-lime-400
                          shadow-[0_0_8px_rgba(198,255,0,0.6)]
                        "
                      />

                      <span
                        className="
                          text-[10px]
                          font-black uppercase
                          tracking-[0.16em]
                          text-lime-400
                        "
                      >
                        HEAL
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function GymRunPage() {
  const [activeRegion, setActiveRegion] =
    useState("Hoenn");

  const region =
    regions.find(
      (item) => item.name === activeRegion
    ) ?? regions[0];

  return (
    <main className="min-h-screen bg-[#050605] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          className="
            pointer-events-none absolute inset-0
            bg-[radial-gradient(circle_at_20%_0%,rgba(198,255,0,0.10),transparent_42%)]
          "
        />

        <div
          className="
            relative mx-auto max-w-7xl
            px-5 pb-12 pt-10
            sm:px-6 md:pb-14 md:pt-12
          "
        >
          <Link
            href="/farm"
            className="
              inline-flex items-center gap-2
              text-sm font-semibold
              text-gray-500
              transition-colors
              hover:text-lime-400
            "
          >
            ← Voltar para Farm
          </Link>

          <div className="mt-8 max-w-4xl">
            <div
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-lime-400/20
                bg-lime-400/[0.07]
                px-3 py-1.5
                text-xs font-bold
                uppercase tracking-[0.18em]
                text-lime-400
              "
            >
              PokeMMO • Farm • Gym Run
            </div>

            <h1
              className="
                mt-5 text-4xl font-black
                tracking-tight
                md:text-6xl
              "
            >
              6 Pillar Gym Run
            </h1>

            <p
              className="
                mt-4 max-w-3xl
                text-base leading-7
                text-gray-400
                md:text-lg
              "
            >
              Estratégia completa de{" "}
              <strong className="text-white">
                6 Pillar Normal
              </strong>{" "}
              para realizar Gym Runs no PokeMMO.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span
                className="
                  rounded-xl
                  border border-white/[0.07]
                  bg-white/[0.025]
                  px-3 py-2
                  text-xs font-bold
                  text-gray-400
                "
              >
                6 Pokémon
              </span>

              <span
                className="
                  rounded-xl
                  border border-white/[0.07]
                  bg-white/[0.025]
                  px-3 py-2
                  text-xs font-bold
                  text-gray-400
                "
              >
                5 regiões
              </span>

              <span
                className="
                  rounded-xl
                  border border-lime-400/20
                  bg-lime-400/[0.06]
                  px-3 py-2
                  text-xs font-bold
                  text-lime-400
                "
              >
                Estratégia do time
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          REQUIREMENTS
      ===================================================== */}

      <section className="border-b border-white/[0.06] bg-[#080c08]">
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div
              className="
                rounded-2xl
                border border-white/[0.07]
                bg-[#0b100c]
                p-5
              "
            >
              <span
                className="
                  text-[10px] font-bold uppercase
                  tracking-[0.18em]
                  text-gray-600
                "
              >
                Requisito
              </span>

              <strong className="mt-2 block text-lg font-black">
                6 Gym Run Pokémon
              </strong>
            </div>

            <div
              className="
                rounded-2xl
                border border-white/[0.07]
                bg-[#0b100c]
                p-5
              "
            >
              <span
                className="
                  text-[10px] font-bold uppercase
                  tracking-[0.18em]
                  text-gray-600
                "
              >
                Progresso
              </span>

              <strong className="mt-2 block text-lg font-black text-lime-400">
                Todas as 5 regiões finalizadas
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TEAM
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <div className="mb-7">
          <p
            className="
              text-[10px] font-bold uppercase
              tracking-[0.2em]
              text-lime-400
            "
          >
            Build
          </p>

          <h2
            className="
              mt-2 text-2xl font-black
              tracking-tight text-white
              md:text-3xl
            "
          >
            Equipe 6 Pillar
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Configuração recomendada para executar a rota.
          </p>
        </div>

        <div
          className="
            grid grid-cols-1 gap-5
            lg:grid-cols-2
          "
        >
          {team.map((pokemon, index) => (
            <TeamCard
              key={pokemon.name}
              pokemon={pokemon}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* =====================================================
          ROUTE
      ===================================================== */}

      <section
        id="rota"
        className="
          border-t border-white/[0.06]
          bg-[#080c08]
        "
      >
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">

          <div className="mb-8">
            <p
              className="
                text-[10px] font-bold uppercase
                tracking-[0.2em]
                text-lime-400
              "
            >
              Basic Route
            </p>

            <h2
              className="
                mt-2 text-2xl font-black
                tracking-tight text-white
                md:text-3xl
              "
            >
              Rota dos Gyms
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Selecione uma região para visualizar a ordem dos
              Gyms e as decisões necessárias em cada batalha.
            </p>
          </div>

          {/* REGION NAV */}

          <div
            className="
              mb-7 flex gap-2
              overflow-x-auto pb-1
            "
          >
            {regions.map((item) => {
              const active =
                item.name === activeRegion;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setActiveRegion(item.name)
                  }
                  className={[
                    "shrink-0 rounded-xl border",
                    "px-4 py-2.5 text-sm font-bold",
                    "transition-all duration-200",
                    active
                      ? "border-lime-400/25 bg-lime-400/10 text-lime-400"
                      : "border-white/[0.07] bg-white/[0.025] text-gray-500 hover:border-lime-400/20 hover:text-lime-400",
                  ].join(" ")}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* REGION HEADER */}

          <div
            className="
              mb-5 flex items-end
              justify-between gap-4
            "
          >
            <div>
              <span
                className="
                  text-[10px] font-bold uppercase
                  tracking-[0.18em]
                  text-gray-600
                "
              >
                Região atual
              </span>

              <h3 className="mt-1 text-2xl font-black text-white">
                {region.name}
              </h3>
            </div>

            <span
              className="
                rounded-lg
                border border-white/[0.07]
                bg-white/[0.025]
                px-3 py-1.5
                text-xs font-bold
                text-gray-500
              "
            >
              {region.gyms.length} Gyms
            </span>
          </div>

          {/* GYMS */}

          <div className="space-y-3">
            {region.gyms.map((gym, index) => (
              <GymCard
                key={`${region.name}-${gym.city}`}
                gym={gym}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK NOTES
      ===================================================== */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
          <div
            className="
              rounded-2xl
              border border-lime-400/15
              bg-lime-400/[0.035]
              p-5
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  border border-lime-400/20
                  bg-lime-400/[0.07]
                  text-lime-400
                "
              >
                !
              </div>

              <div>
                <h3 className="font-black text-white">
                  Atenção durante a rota
                </h3>

                <p
                  className="
                    mt-1 text-sm leading-6
                    text-gray-500
                  "
                >
                  Algumas batalhas possuem variações
                  dependendo dos Pokémon encontrados.
                  Sempre confira a condição específica do
                  Gym antes de executar a jogada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <section
        className="
          border-t border-white/[0.06]
          bg-[#080c08]
        "
      >
        <div
          className="
            mx-auto max-w-7xl
            px-5 py-8 sm:px-6
          "
        >
          <div
            className="
              flex flex-col gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-sm font-bold text-white">
                6 Pillar Normal
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Estratégia de Gym Run utilizada pelo time
                neverTakeBan.
              </p>
            </div>

            <Link
              href="/farm"
              className="
                inline-flex w-fit
                items-center gap-2
                rounded-xl
                border border-white/[0.07]
                bg-white/[0.025]
                px-4 py-2.5
                text-xs font-bold
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