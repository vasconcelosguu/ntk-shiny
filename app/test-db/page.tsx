import { createClient } from "../../lib/supabase/server";

export default async function TestDB() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pokemon")
    .select("*");

  return (
    <main style={{ padding: 40 }}>
      <h1>Teste Supabase</h1>

      <pre>
        {JSON.stringify(
          {
            data,
            error,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}