import LatestShiniesCarousel from "./components/LatestShiniesCarousel";
import { AlteringCave } from "./components/AlteringCave";
import { getLatestShinies } from "../lib/shinyboard";

export const revalidate = 60;

export default async function Home() {
  const latestShinies = await getLatestShinies(10);

  const shinies = latestShinies.map((shiny) => ({
    id: shiny.id,
    username: shiny.username,
    pokemon: shiny.pokemon,
    display_name: shiny.displayName,
    pokemon_id: shiny.pokemonId,
    encounters: shiny.encounters,
    caught_at: shiny.caughtAt,
  }));

  return (
    <main className="min-h-screen bg-[#030603]">

      {/* BANNER PRINCIPAL */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/images/home-banner.jpg"
          alt="NeverTakeBan"
          className="
            h-[260px]
            w-full
            object-cover
            object-center
            sm:h-[340px]
            lg:h-[420px]
          "
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030603] via-black/20 to-black/10" />

        {/* glow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full bg-lime-400/10 blur-3xl" />
      </section>

      {/* ÚLTIMOS SHINYS */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14">
        <LatestShiniesCarousel shinies={shinies} />
      </section>

      {/* ALTERING CAVE */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6">
        <AlteringCave />
      </section>

    </main>
  );
}