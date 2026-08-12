"use client";
import Link from "next/link";

import {
  FormEvent,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { createClient } from "../../../../lib/supabase/client";

export default function AddShinyPage() {
  const supabase = createClient();
  const router = useRouter();

  const params = useParams<{
    username: string;
  }>();

  const [pokemon, setPokemon] =
    useState("");

  const [encounters, setEncounters] =
    useState("");

  const [method, setMethod] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [nickname, setNickname] =
    useState("");

  const [caughtAt, setCaughtAt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(
        "Você precisa estar logado para cadastrar um shiny."
      );

      setLoading(false);
      return;
    }

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (!profile) {
      setMessage(
        "Perfil do usuário não encontrado."
      );

      setLoading(false);
      return;
    }

    const { error } =
      await supabase
        .from("shinies")
        .insert({
          user_id: user.id,
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
          caught_at:
            caughtAt || null,
        });

    if (error) {
      console.error(error);

      setMessage(
        "Não foi possível cadastrar o shiny."
      );

      setLoading(false);
      return;
    }

    router.push(
      `/players/${params.username}`
    );

    router.refresh();
  }

  return (
    <main className="page form-page">
      <section className="container narrow-container">
        <div className="form-header">
          <Link
            href={`/players/${params.username}`}
            className="back-link"
          >
            ← Voltar para coleção
          </Link>

          <span className="eyebrow">
            COLEÇÃO
          </span>

          <h1>
            Adicionar Shiny
          </h1>

          <p>
            Registre um novo Pokémon shiny
            na sua coleção.
          </p>
        </div>

        <form
          className="shiny-form"
          onSubmit={handleSubmit}
        >
          <div className="form-section">
            <div className="form-section-title">
              <span>01</span>
              Pokémon
            </div>

            <div className="form-field">
              <label htmlFor="pokemon">
                Pokémon
              </label>

              <input
                id="pokemon"
                value={pokemon}
                onChange={(event) =>
                  setPokemon(
                    event.target.value
                  )
                }
                placeholder="Ex: Gengar"
                required
              />

              <small>
                O sprite shiny será buscado
                automaticamente.
              </small>
            </div>

            <div className="form-field">
              <label htmlFor="nickname">
                Apelido
              </label>

              <input
                id="nickname"
                value={nickname}
                onChange={(event) =>
                  setNickname(
                    event.target.value
                  )
                }
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <span>02</span>
              Hunt
            </div>

            <div className="form-row">
              <div className="form-field">
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
                  placeholder="Ex: 52381"
                />
              </div>

              <div className="form-field">
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
            </div>

            <div className="form-row">
              <div className="form-field">
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

              <div className="form-field">
                <label htmlFor="caughtAt">
                  Data
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
            </div>

            <div className="form-field">
              <label htmlFor="location">
                Local da captura
              </label>

              <input
                id="location"
                value={location}
                onChange={(event) =>
                  setLocation(
                    event.target.value
                  )
                }
                placeholder="Ex: Pokémon Tower"
              />
            </div>
          </div>

          {message && (
            <div className="form-error">
              {message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button large"
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : "Cadastrar Shiny"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                router.push(
                  `/players/${params.username}`
                )
              }
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}