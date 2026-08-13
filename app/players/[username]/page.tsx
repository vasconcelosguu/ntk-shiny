import Link from "next/link";
import { notFound } from "next/navigation";
import { getShinyPlayer } from "../../../lib/players";
import { getShinyBoardProfile } from "../../../lib/shinyboard";
import { getPokemonShinySprite } from "../../../lib/pokemon";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const { shinyPlayers } = await import(
    "../../../lib/players"
  );

  return shinyPlayers.map((player) => ({
    username: player.shinyboardUsername,
  }));
}

export default async function ShinyPlayerPage({
  params,
}: Props) {
  const { username } = await params;

  const decodedUsername = decodeURIComponent(username);

  console.log(
    `[SHINY PAGE] URL username: ${username}`
  );

  console.log(
    `[SHINY PAGE] Decoded username: ${decodedUsername}`
  );

  const player = getShinyPlayer(decodedUsername);

  console.log(
    `[SHINY PAGE] Player encontrado:`,
    player
  );

  if (!player) {
    console.error(
      `[SHINY PAGE] Player não encontrado: ${decodedUsername}`
    );

    notFound();
  }

  console.log(
    `[SHINY PAGE] Carregando player: ${decodedUsername}`
  );

  console.log(
    `[SHINY PAGE] ShinyBoard username: ${player.shinyboardUsername}`
  );

  console.log(
    `[SHINY PAGE] Chamando getShinyBoardProfile...`
  );

  const profile = await getShinyBoardProfile(
    player.shinyboardUsername
  );

  console.log(
    `[SHINY PAGE] Perfil recebido`
  );

  console.log(
    `[SHINY PAGE] Total de shinies:`,
    profile.totalShinies
  );

  console.log(
    `[SHINY PAGE] Total de encounters:`,
    profile.totalEncounters
  );

  console.log(
    `[SHINY PAGE] Shinies recebidos:`,
    profile.shinies.length
  );

  /*
   * O ShinyBoard fornece o nome do Pokémon.
   *
   * A sprite é buscada separadamente na API.
   *
   * Isso evita depender de uma URL de imagem
   * fornecida pelo ShinyBoard.
   */

  console.log(
    `[SHINY PAGE] Iniciando busca das sprites...`
  );

  const shinies = await Promise.all(
    profile.shinies.map(async (shiny) => {
      let sprite: string | null = null;

      console.log(
        `[SPRITE] Buscando sprite para: ${shiny.pokemon}`
      );

      try {
        sprite = await getPokemonShinySprite(
          shiny.pokemon
        );

        console.log(
          `[SPRITE] Resultado para ${shiny.pokemon}:`,
          sprite
        );
      } catch (error) {
        console.error(
          `[SPRITE] Erro ao buscar sprite de ${shiny.pokemon}:`,
          error
        );
      }

      return {
        ...shiny,
        sprite,
      };
    })
  );

  console.log(
    `[SHINY PAGE] Busca de sprites finalizada`
  );

  console.log(
    `[SHINY PAGE] Total de cards:`,
    shinies.length
  );

  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="border-b border-white/[0.06] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16">
          <Link
            href="/hunt/shiny/players"
            className="text-sm font-semibold text-gray-500 transition hover:text-violet-400"
          >
            ← Voltar para Players
          </Link>

          <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Shiny Collection
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                {player.username}
              </h1>

              <p className="mt-3 text-gray-500">
                Coleção sincronizada com o ShinyBoard.
              </p>
            </div>

            <a
              href={`https://www.shinyboard.net/users/${encodeURIComponent(
                player.shinyboardUsername
              )}?tab=shinies`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm font-bold text-gray-400 transition hover:border-violet-500/30 hover:bg-violet-500/[0.05] hover:text-violet-400"
            >
              Abrir ShinyBoard
              <span>↗</span>
            </a>
          </div>

          {/* STATS */}

          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
              <span className="block text-3xl font-black">
                {profile.totalShinies}
              </span>

              <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-gray-600">
                Shinies
              </span>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
              <span className="block text-3xl font-black">
                {profile.totalEncounters.toLocaleString(
                  "pt-BR"
                )}
              </span>

              <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-gray-600">
                Encounters
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SHINY GRID
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12">
        {shinies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-10 text-center">
            <div className="text-4xl">✨</div>

            <h2 className="mt-4 font-bold text-white">
              Nenhum Shiny encontrado
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Não foi possível encontrar Shinies registrados
              para este player no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {shinies.map((shiny, index) => (
              <div
                key={`${shiny.displayName}-${index}`}
                className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d111c] transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-[#111625] hover:shadow-xl hover:shadow-violet-950/20"
              >
                {/* SPRITE */}

                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#080b14]">
                  {/* Glow */}

                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.10),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {shiny.sprite ? (
                    <img
                      src={shiny.sprite}
                      alt={`Shiny ${shiny.displayName}`}
                      width={160}
                      height={160}
                      className="relative h-32 w-32 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-3xl opacity-30">
                        ?
                      </span>

                      <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-700">
                        Sprite indisponível
                      </span>
                    </div>
                  )}
                </div>

                {/* INFO */}

                <div className="p-4">
                  <h2 className="truncate font-bold text-white">
                    {shiny.displayName}
                  </h2>

                  <p className="mt-1 truncate text-xs text-gray-600">
                    {shiny.pokemon}
                  </p>

                  <div className="mt-3 border-t border-white/[0.06] pt-3">
                    <span className="text-xs font-semibold text-gray-500">
                      {shiny.encounters.toLocaleString(
                        "pt-BR"
                      )}{" "}
                      encounters
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}