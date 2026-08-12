"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { createClient } from "../../../../../lib/supabase/client";

export default function EditShinyPage() {
  const supabase = createClient();

  const router = useRouter();

  const params = useParams<{
    username: string;
    id: string;
  }>();

  const [pokemon, setPokemon] = useState("");
  const [encounters, setEncounters] =
    useState("");
  const [method, setMethod] = useState("");
  const [region, setRegion] = useState("");
  const [location, setLocation] =
    useState("");
  const [nickname, setNickname] =
    useState("");
  const [caughtAt, setCaughtAt] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function loadShiny() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: shiny, error } =
        await supabase
          .from("shinies")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

      if (error || !shiny) {
        setMessage(
          "Shiny não encontrado."
        );

        setLoading(false);
        return;
      }

      setPokemon(shiny.pokemon ?? "");

      setEncounters(
        shiny.encounters !== null &&
          shiny.encounters !== undefined
          ? String(shiny.encounters)
          : ""
      );

      setMethod(shiny.method ?? "");
      setRegion(shiny.region ?? "");
      setLocation(shiny.location ?? "");
      setNickname(shiny.nickname ?? "");

      if (shiny.caught_at) {
        setCaughtAt(
          String(shiny.caught_at).slice(
            0,
            10
          )
        );
      }

      setLoading(false);
    }

    loadShiny();
  }, [params.id]);

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(
        "Você precisa estar logado."
      );

      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("shinies")
      .update({
        pokemon: pokemon.trim(),
        encounters: encounters
          ? Number(encounters)
          : null,
        method: method || null,
        region: region || null,
        location:
          location.trim() || null,
        nickname:
          nickname.trim() || null,
        caught_at: caughtAt || null,
      })
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Erro ao atualizar shiny:",
        error
      );

      setMessage(error.message);
      setSaving(false);

      return;
    }

    router.push(
      `/players/${params.username}`
    );

    router.refresh();
  }

  if (loading) {
    return (
      <main className="page">
        <section className="container">
          <p>Carregando shiny...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="container">
        <span className="eyebrow">
          COLEÇÃO
        </span>

        <h1>Editar Shiny</h1>

        <p>
          Atualize as informações do seu
          shiny.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="pokemon">
              Pokémon
            </label>

            <input
              id="pokemon"
              type="text"
              value={pokemon}
              onChange={(event) =>
                setPokemon(
                  event.target.value
                )
              }
              required
            />
          </div>

          <div>
            <label htmlFor="encounters">
              Encounters
            </label>

            <input
              id="encounters"
              type="number"
              min="0"
              value={encounters}
              onChange={(event) =>
                setEncounters(
                  event.target.value
                )
              }
            />
          </div>

          <div>
            <label htmlFor="method">
              Método
            </label>

            <select
              id="method"
              value={method}
              onChange={(event) =>
                setMethod(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecione
              </option>

              <option value="Horde">
                Horde
              </option>

              <option value="Single">
                Single
              </option>

              <option value="Fishing">
                Fishing
              </option>

              <option value="Egg">
                Egg
              </option>

              <option value="Other">
                Outro
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="region">
              Região
            </label>

            <select
              id="region"
              value={region}
              onChange={(event) =>
                setRegion(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecione
              </option>

              <option value="Kanto">
                Kanto
              </option>

              <option value="Johto">
                Johto
              </option>

              <option value="Hoenn">
                Hoenn
              </option>

              <option value="Sinnoh">
                Sinnoh
              </option>

              <option value="Unova">
                Unova
              </option>

              <option value="Kalos">
                Kalos
              </option>

              <option value="Alola">
                Alola
              </option>

              <option value="Galar">
                Galar
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="location">
              Local
            </label>

            <input
              id="location"
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
            />
          </div>

          <div>
            <label htmlFor="nickname">
              Nickname
            </label>

            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(event) =>
                setNickname(
                  event.target.value
                )
              }
            />
          </div>

          <div>
            <label htmlFor="caughtAt">
              Data da captura
            </label>

            <input
              id="caughtAt"
              type="date"
              value={caughtAt}
              onChange={(event) =>
                setCaughtAt(
                  event.target.value
                )
              }
            />
          </div>

          {message && (
            <p>{message}</p>
          )}

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Salvando..."
              : "Salvar alterações"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/players/${params.username}`
              )
            }
          >
            Cancelar
          </button>
        </form>
      </section>
    </main>
  );
}