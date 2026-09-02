import ShinyShowcase from "../components/ShinyShowcase";
import {
  getShowcaseShinies,
} from "../../lib/shiny-ownership";

export const revalidate = 60;

export default async function ShinyPage() {
  const shinies =
    await getShowcaseShinies();

  return (
    <main className="min-h-screen bg-[#030603] text-white">
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[-200px]
            h-[500px]
            w-[900px]
            -translate-x-1/2
            rounded-full
            bg-lime-400/[0.05]
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-5
            py-16
          "
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">
            NeverTakeBan
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            Shiny Showcase
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">
            Confira todos os shinies capturados
            pelos membros do NeverTakeBan.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div
              className="
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                px-5
                py-4
              "
            >
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-600">
                Registros
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                {shinies.length}
              </p>
            </div>

            <div
              className="
                rounded-xl
                border
                border-lime-400/15
                bg-lime-400/[0.04]
                px-5
                py-4
              "
            >
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-600">
                Último shiny
              </p>

              <p className="mt-1 text-sm font-black text-lime-400">
                {shinies[0]?.displayName ??
                  "Nenhum"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ShinyShowcase
        shinies={shinies}
      />
    </main>
  );
}