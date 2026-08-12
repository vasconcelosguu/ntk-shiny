"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="page">
      <section className="container">
        <h1>Entrar</h1>

        <form onSubmit={handleLogin}>
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
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {message && <p>{message}</p>}

        <p>
          Ainda não possui uma conta?{" "}
          <Link href="/register">Criar conta</Link>
        </p>
      </section>
    </main>
  );
}