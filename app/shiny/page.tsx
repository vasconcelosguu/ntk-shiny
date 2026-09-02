import ShinyShowcase from "../components/ShinyShowcase";
import { getShowcaseShinies } from "../../lib/shiny-ownership";

export const revalidate = 60;

export default async function ShinyPage() {
  const shinies = await getShowcaseShinies();

  return (
    <main className="min-h-screen bg-[#030603]">

      <ShinyShowcase
        shinies={shinies}
      />

    </main>
  );
}