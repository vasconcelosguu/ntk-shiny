import Link from "next/link";
import { notFound } from "next/navigation";
import { tiers, dex } from "../../../lib/data";

export const revalidate = 86400;

type PokemonInfo = {
  name: string;
  tier: string;
  points: number;
};

function findPokemon(rawName: string): PokemonInfo | null {
  const wanted = decodeURIComponent(rawName).toLowerCase();

  for (const [tier, data] of Object.entries(tiers)) {
    const found = data.pokemon.find(
      (pokemon) => pokemon.toLowerCase() === wanted
    );

    if (found) {
      return {
        name: found,
        tier,
        points: data.points,
      };
    }
  }

  return null;
}

async function getPokemonData(name: string, id: number) {
  const fallbackSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
      {
        next: {
          revalidate: 86400,
        },
      }
    );

    if (!response.ok) {
      return {
        sprite: fallbackSprite,
        types: [],
        height: null,
        weight: null,
        abilities: [],
      };
    }

    const data = await response.json();

    return {
      sprite:
        data.sprites?.front_shiny ??
        fallbackSprite,

      types:
        data.types?.map(
          (item: any) => item.type.name
        ) ?? [],

      height: data.height
        ? data.height / 10
        : null,

      weight: data.weight
        ? data.weight / 10
        : null,

      abilities:
        data.abilities?.map(
          (item: any) => item.ability.name
        ) ?? [],
    };
  } catch {
    return {
      sprite: fallbackSprite,
      types: [],
      height: null,
      weight: null,
      abilities: [],
    };
  }
}

export function generateStaticParams() {
  const names = [
    ...new Set(
      Object.values(tiers).flatMap(
        (tier) => tier.pokemon
      )
    ),
  ];

  return names.map((name) => ({
    name: name.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const pokemon = findPokemon(name);

  if (!pokemon) {
    return {
      title: "Pokémon não encontrado — neverTakeBan",
    };
  }

  return {
    title: `${pokemon.name} Shiny — neverTakeBan`,
    description: `Informações do Shiny ${pokemon.name} no neverTakeBan.`,
  };
}

function formatType(type: string) {
  const types: Record<string, string> = {
    normal: "Normal",
    fire: "Fire",
    water: "Water",
    electric: "Electric",
    grass: "Grass",
    ice: "Ice",
    fighting: "Fighting",
    poison: "Poison",
    ground: "Ground",
    flying: "Flying",
    psychic: "Psychic",
    bug: "Bug",
    rock: "Rock",
    ghost: "Ghost",
    dragon: "Dragon",
    dark: "Dark",
    steel: "Steel",
    fairy: "Fairy",
  };

  return types[type] ?? type;
}

function formatAbility(ability: string) {
  return ability
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const pokemon = findPokemon(name);

  if (!pokemon) {
    notFound();
  }

  const id = dex[pokemon.name];

  if (!id) {
    notFound();
  }

  const api = await getPokemonData(
    pokemon.name,
    id
  );

  const previousTier =
    Number(pokemon.tier) > 0
      ? Number(pokemon.tier) - 1
      : null;

  const nextTier =
    Number(pokemon.tier) < 7
      ? Number(pokemon.tier) + 1
      : null;

  return (
    <main className="container">

      {/* VOLTAR */}
      <Link
        href={`/tiers/${pokemon.tier}`}
        className="back"
      >
        ← Voltar para Tier {pokemon.tier}
      </Link>

      {/* HEADER */}
      <section className="pokePanel">

        <div className="eyebrow">
          SHINY POKÉMON
        </div>

        <h1>{pokemon.name}</h1>

        <p
          style={{
            color: "#687386",
            marginTop: "8px",
            fontSize: "14px",
          }}
        >
          #{String(id).padStart(3, "0")}
        </p>

        {/* SPRITE */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "390px",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124,92,255,0.18), transparent 70%)",
              filter: "blur(10px)",
            }}
          />

          <img
            className="bigSprite"
            src={api.sprite}
            alt={`Shiny ${pokemon.name}`}
            width={360}
            height={360}
            style={{
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>

        {/* TIER / PONTOS */}
        <div className="chips">

          <span className="chip">
            TIER {pokemon.tier}
          </span>

          <span className="chip">
            {pokemon.points} POINTS
          </span>

          <span className="chip">
            #{String(id).padStart(3, "0")}
          </span>

        </div>

      </section>

      {/* INFORMAÇÕES */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "22px",
        }}
      >

        {/* TIER */}
        <div className="status">

          <strong>Tier</strong>

          <span>
            Este Pokémon pertence ao Tier{" "}
            <b
              style={{
                color: "#a38cff",
              }}
            >
              {pokemon.tier}
            </b>
            .
          </span>

        </div>

        {/* PONTOS */}
        <div className="status">

          <strong>Valor</strong>

          <span>
            Este shiny vale{" "}
            <b
              style={{
                color: "#a38cff",
              }}
            >
              {pokemon.points} pontos
            </b>
            .
          </span>

        </div>

        {/* STATUS */}
        <div className="status">

          <strong>Registro</strong>

          <span>
            Este Pokémon ainda não possui
            um player registrado.
          </span>

        </div>

      </section>

      {/* DADOS DA POKEAPI */}
      <section
        style={{
          marginTop: "22px",
        }}
      >

        <div className="status">

          <strong>
            Informações do Pokémon
          </strong>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "18px",
              marginTop: "12px",
            }}
          >

            {/* TIPOS */}
            <div>
              <span
                style={{
                  display: "block",
                  color: "#596477",
                  fontSize: "11px",
                  marginBottom: "7px",
                }}
              >
                TIPO
              </span>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                {api.types.length > 0 ? (
                  api.types.map((type: string) => (
                    <span
                      key={type}
                      className="chip"
                    >
                      {formatType(type)}
                    </span>
                  ))
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>

            {/* ALTURA */}
            <div>
              <span
                style={{
                  display: "block",
                  color: "#596477",
                  fontSize: "11px",
                  marginBottom: "7px",
                }}
              >
                ALTURA
              </span>

              <span>
                {api.height !== null
                  ? `${api.height} m`
                  : "—"}
              </span>
            </div>

            {/* PESO */}
            <div>
              <span
                style={{
                  display: "block",
                  color: "#596477",
                  fontSize: "11px",
                  marginBottom: "7px",
                }}
              >
                PESO
              </span>

              <span>
                {api.weight !== null
                  ? `${api.weight} kg`
                  : "—"}
              </span>
            </div>

            {/* HABILIDADES */}
            <div>
              <span
                style={{
                  display: "block",
                  color: "#596477",
                  fontSize: "11px",
                  marginBottom: "7px",
                }}
              >
                HABILIDADES
              </span>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {api.abilities.length > 0 ? (
                  api.abilities.map(
                    (ability: string) => (
                      <span key={ability}>
                        {formatAbility(ability)}
                      </span>
                    )
                  )
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* PLAYER */}
      <section
        style={{
          marginTop: "22px",
        }}
      >

        <div
          className="status"
          style={{
            padding: "28px",
          }}
        >

          <strong>
            Player registrado
          </strong>

          <span>
            Este shiny ainda não possui
            um player registrado no
            neverTakeBan.
          </span>

          <span
            style={{
              marginTop: "5px",
              color: "#596477",
            }}
          >
            Quando o sistema de registro
            estiver disponível, esta área
            mostrará o jogador responsável,
            data de obtenção e outras
            informações.
          </span>

        </div>

      </section>

      {/* NAVEGAÇÃO ENTRE TIERS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "35px",
          gap: "15px",
        }}
      >

        {previousTier !== null ? (
          <Link
            href={`/tiers/${previousTier}`}
            className="back"
            style={{
              margin: 0,
            }}
          >
            ← Tier {previousTier}
          </Link>
        ) : (
          <span />
        )}

        <Link
          href="/"
          className="back"
          style={{
            margin: 0,
          }}
        >
          Todos os Tiers
        </Link>

        {nextTier !== null ? (
          <Link
            href={`/tiers/${nextTier}`}
            className="back"
            style={{
              margin: 0,
            }}
          >
            Tier {nextTier} →
          </Link>
        ) : (
          <span />
        )}

      </div>

    </main>
  );
}