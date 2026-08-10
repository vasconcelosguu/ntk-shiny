import Link from "next/link";
import { tiers } from "../lib/data";

export default function Home() {
  const total = Object.values(tiers).reduce((a,t)=>a+t.pokemon.length,0);
  return <main className="container">
    <section className="hero">
      <div><p className="eyebrow">POKEMMO • SHINY DATABASE</p><h1>Shiny Tiers</h1><p>Os shinies do neverTakeBan organizados por tier e pontuação.</p></div>
      <div className="bigScore">{total}<small>ENTRADAS</small></div>
    </section>
    <div className="tierIndex">
      {Object.entries(tiers).map(([tier,data])=><Link className="tierBox" href={`/tiers/${tier}`} key={tier}>
        <div className="tierNo">TIER {tier}</div><div className="tierPoints">{data.points} pts</div><div className="tierCount">{data.pokemon.length} Pokémon</div>
      </Link>)}
    </div>
  </main>
}
