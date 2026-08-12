"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Link from "next/link";

export default function AuthButton() {
  const supabase = createClient();

  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        setUsername(profile?.username ?? null);
      }

      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUsername(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return null;
  }

  if (!username) {
    return (
      <div className="auth-nav">
        <Link href="/login">Entrar</Link>
        <Link href="/register">Criar conta</Link>
      </div>
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="auth-nav">
      <Link href={`/players/${username}`}>
        {username}
      </Link>

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}