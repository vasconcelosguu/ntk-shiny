"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: username,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Conta criada. Verifique seu e-mail para confirmar o cadastro."
    );

    setLoading(false);
  }

  return (
    <main className="page">
      <section className="container">
        <h1>Criar conta</h1>

        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="username">Usuário</label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        {message && <p>{message}</p>}

        <p>
          Já possui uma conta?{" "}
          <Link href="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}