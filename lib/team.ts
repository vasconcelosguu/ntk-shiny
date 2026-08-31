export type TeamChannel = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  href?: string;
};

export type TeamCategory = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  channels: TeamChannel[];
};

export const teamCategories: TeamCategory[] = [
  {
    name: "Farm",
    slug: "farm",
    description:
      "Métodos, rotas e estratégias para farmar no PokeMMO.",
    icon: "✨",
    channels: [
      {
        name: "Gym Run",
        slug: "gym-run",
        description:
          "Rotas e estratégias para farm de Gyms.",
        icon: "🎯",
        href: "/farm/gym-run",
      },
      {
        name: "Morimoto & Cynthia",
        slug: "morimoto-cynthia",
        description:
          "Estratégias para enfrentar Morimoto e Cynthia.",
        icon: "⚔️",
        href: "/farm/morimoto-cynthia",
      },
      {
        name: "Ho-Oh",
        slug: "ho-oh",
        description:
          "Informações e preparação para Ho-Oh.",
        icon: "🔥",
        href: "/farm/ho-oh",
      },
      {
        name: "Apricorn",
        slug: "apricorn",
        description:
          "Rotas e métodos para farm de Apricorns.",
        icon: "🌱",
        href: "/farm/apricorn",
      },
      {
        name: "Elite 4",
        slug: "elite-4",
        description:
          "Estratégias para farmar a Elite 4.",
        icon: "🏆",
        href: "/farm/elite-4",
      },
      {
        name: "Red",
        slug: "red",
        description:
          "Estratégias para o Red.",
        icon: "🔴",
        href: "/farm/red",
      },
    ],
  },

  {
    name: "Hunt",
    slug: "hunt",
    description:
      "Guias, métodos e estratégias para caça de Pokémon.",
    icon: "✨",
    channels: [
      {
        name: "Alfa",
        slug: "alfa",
        description:
          "Estratégias para encontrar e capturar Pokémon Alfa.",
        icon: "👑",
        href: "/hunt/alfa",
      },
      {
        name: "Honey Tree",
        slug: "honey-tree",
        description:
          "Locais, Pokémon e estratégias para Honey Trees.",
        icon: "🍯",
        href: "/hunt/honey-tree",
      },

      // SHINY AGORA É UMA PÁGINA PRINCIPAL
      {
        name: "Shiny",
        slug: "shiny",
        description:
          "Central de caça Shiny, coleção e informações do time.",
        icon: "✨",
        href: "/shiny",
      },
    ],
  },

  {
    name: "RAID",
    slug: "raid",
    description:
      "Builds e estratégias para os Raids do PokeMMO.",
    icon: "⚔️",
    channels: [
      {
        name: "Builds",
        slug: "builds",
        description:
          "Builds recomendadas para Raids.",
        icon: "🛡️",
        href: "/raid/builds",
      },
      {
        name: "Cresselia",
        slug: "cresselia",
        description:
          "Estratégias para o Raid de Cresselia.",
        icon: "🌙",
        href: "/raid/cresselia",
      },
      {
        name: "Heatran",
        slug: "heatran",
        description:
          "Estratégias para o Raid de Heatran.",
        icon: "🔥",
        href: "/raid/heatran",
      },
    ],
  },

  {
    name: "Eventos Sazonais",
    slug: "eventos",
    description:
      "Conteúdo e estratégias dos eventos temporários.",
    icon: "🎯",
    channels: [
      {
        name: "Halloween",
        slug: "halloween",
        description:
          "Guias e estratégias do evento de Halloween.",
        icon: "🎃",
        href: "/eventos/halloween",
      },
    ],
  },

  {
    name: "Ajuda",
    slug: "ajuda",
    description:
      "Informações gerais para ajudar os membros do time.",
    icon: "❓",
    channels: [
      {
        name: "Conteúdo Geral",
        slug: "conteudo-geral",
        description:
          "Informações gerais sobre o PokeMMO.",
        icon: "📚",
      },
      {
        name: "Upgrades",
        slug: "upgrades",
        description:
          "Melhorias, progressão e upgrades.",
        icon: "⬆️",
      },
    ],
  },

  {
    name: "Upgrades PokeMMO",
    slug: "upgrades-pokemmo",
    description:
      "Guias para progressão e melhorias dentro do PokeMMO.",
    icon: "🚀",
    channels: [],
  },
];

export function getCategory(slug: string) {
  return teamCategories.find(
    (category) => category.slug === slug
  );
}

export function getChannel(
  categorySlug: string,
  channelSlug: string
) {
  const category = getCategory(categorySlug);

  return category?.channels.find(
    (channel) => channel.slug === channelSlug
  );
}