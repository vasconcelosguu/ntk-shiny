export type ShinyPlayer = {
  username: string;
  shinyboardUsername: string;
};

export const shinyPlayers: ShinyPlayer[] = [
  {
    username: "Frowwk",
    shinyboardUsername: "Frowwk",
  },

  {
    username: "Nvok",
    shinyboardUsername: "Nvok",
  },

  {
    username: "Katonlol",
    shinyboardUsername: "Katonlol",
  },

  {
    username: "AsunaY",
    shinyboardUsername: "AsunaY",
  },

  {
    username: "OtwiIight",
    shinyboardUsername: "OtwiIight",
  },

  {
    username: "Gabmaruxl",
    shinyboardUsername: "Gabmaruxl",
  },

  {
    username: "Deino",
    shinyboardUsername: "Deino",
  },

  // Adicione outros players aqui:
  //
  // {
  //   username: "Player2",
  //   shinyboardUsername: "Player2",
  // },
];

/**
 * Busca um player pelo nome.
 */
export function getShinyPlayer(
  username: string
): ShinyPlayer | undefined {
  const normalizedUsername = username
    .trim()
    .toLowerCase();

  return shinyPlayers.find(
    (player) =>
      player.username.trim().toLowerCase() ===
        normalizedUsername ||
      player.shinyboardUsername.trim().toLowerCase() ===
        normalizedUsername
  );
}