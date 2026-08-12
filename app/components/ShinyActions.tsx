"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  shinyId: string;
  username: string;
};

export default function ShinyActions({
  shinyId,
  username,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [deleting, setDeleting] =
    useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja apagar este shiny?\n\nEssa ação não pode ser desfeita."
    );

    if (!confirmed) return;

    setDeleting(true);

    const { error } = await supabase
      .from("shinies")
      .delete()
      .eq("id", shinyId);

    if (error) {
      console.error(error);

      window.alert(
        "Não foi possível apagar o shiny."
      );

      setDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="shiny-actions">
      <Link
        href={`/players/${username}/edit-shiny/${shinyId}`}
        className="shiny-action edit"
      >
        <span>✎</span>
        Editar
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="shiny-action delete"
      >
        <span>×</span>

        {deleting
          ? "Apagando..."
          : "Apagar"}
      </button>
    </div>
  );
}