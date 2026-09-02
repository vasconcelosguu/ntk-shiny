import { createClient } from "./supabase/server";

export type ShinyOwnership = {
  pokemon: string;
  players: string[];
  obtained: boolean;
};

export type ShowcaseShiny = {
  id: string;
  playerId: string;
  username: string;
  pokemon: string;
  displayName: string;
  pokemonId: number | null;
  encounters: number | null;
  caughtAt: string | null;
};

export function normalizePokemonName(value: string) {
  const normalized = String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/’/g, "'")
    .trim();

  const aliases: Record<string, string> = {
    "nidoran [m]": "nidoran-m",
    "nidoran [f]": "nidoran-f",
    "nidoran m": "nidoran-m",
    "nidoran f": "nidoran-f",
    "nidoran♂": "nidoran-m",
    "nidoran♀": "nidoran-f",

    "mr. mime": "mr-mime",
    "mr mime": "mr-mime",

    "farfetch'd": "farfetchd",
    "farfetch’d": "farfetchd",

    "mime jr.": "mime-jr",
    "mime jr": "mime-jr",

    "ho-oh": "ho-oh",

    "porygon-z": "porygon-z",

    "jangmo-o": "jangmo-o",
    "hakamo-o": "hakamo-o",
    "kommo-o": "kommo-o",
  };

  if (aliases[normalized]) {
    return aliases[normalized];
  }

  return normalized
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* =========================================================
   LINHAS EVOLUTIVAS
========================================================= */

/*
  Cada array representa uma linha evolutiva.

  Se um player possuir QUALQUER Pokémon de uma linha,
  todos os Pokémon daquela linha serão considerados obtidos.

  Linhas ramificadas ficam no mesmo array.

  Exemplo:

  Eevee -> Vaporeon
        -> Jolteon
        -> Flareon

  Se o player tiver Eevee, todas são marcadas.
*/

const evolutionLines: string[][] = [
  // Gen 1
  ["bulbasaur", "ivysaur", "venusaur"],
  ["charmander", "charmeleon", "charizard"],
  ["squirtle", "wartortle", "blastoise"],

  ["caterpie", "metapod", "butterfree"],
  ["weedle", "kakuna", "beedrill"],

  ["pidgey", "pidgeotto", "pidgeot"],

  ["rattata", "raticate"],

  ["spearow", "fearow"],

  ["ekans", "arbok"],

  ["pikachu", "raichu"],

  ["sandshrew", "sandslash"],

  ["nidoran-f", "nidorina", "nidoqueen"],
  ["nidoran-m", "nidorino", "nidoking"],

  ["clefairy", "clefable"],

  ["vulpix", "ninetales"],

  ["jigglypuff", "wigglytuff"],

  ["zubat", "golbat"],

  ["oddish", "gloom", "vileplume"],
  ["oddish", "gloom", "bellossom"],

  ["paras", "parasect"],

  ["venonat", "venomoth"],

  ["diglett", "dugtrio"],

  ["meowth", "persian"],

  ["psyduck", "golduck"],

  ["mankey", "primeape"],

  ["growlithe", "arcanine"],

  ["poliwag", "poliwhirl", "poliwrath"],
  ["poliwag", "poliwhirl", "politoed"],

  ["abra", "kadabra", "alakazam"],

  ["machop", "machoke", "machamp"],

  ["bellsprout", "weepinbell", "victreebel"],

  ["tentacool", "tentacruel"],

  ["geodude", "graveler", "golem"],

  ["ponyta", "rapidash"],

  ["slowpoke", "slowbro"],
  ["slowpoke", "slowking"],

  ["magnemite", "magneton"],

  ["farfetchd"],

  ["doduo", "dodrio"],

  ["seel", "dewgong"],

  ["grimer", "muk"],

  ["shellder", "cloyster"],

  ["gastly", "haunter", "gengar"],

  ["drowzee", "hypno"],

  ["krabby", "kingler"],

  ["voltorb", "electrode"],

  ["exeggcute", "exeggutor"],

  ["cubone", "marowak"],

  ["koffing", "weezing"],

  ["rhyhorn", "rhydon"],

  ["chansey"],

  ["tangela"],

  ["kangaskhan"],

  ["horsea", "seadra"],

  ["goldeen", "seaking"],

  ["staryu", "starmie"],

  ["mr-mime"],

  ["scyther"],

  ["jynx"],

  ["electabuzz"],

  ["magmar"],

  ["pinsir"],

  ["tauros"],

  ["magikarp", "gyarados"],

  ["lapras"],

  ["ditto"],

  ["eevee", "vaporeon"],
  ["eevee", "jolteon"],
  ["eevee", "flareon"],

  ["porygon"],

  ["omanyte", "omastar"],

  ["kabuto", "kabutops"],

  ["aerodactyl"],

  ["snorlax"],

  ["articuno"],
  ["zapdos"],
  ["moltres"],

  ["dratini", "dragonair", "dragonite"],

  ["mewtwo"],
  ["mew"],

  // Gen 2
  ["chikorita", "bayleef", "meganium"],
  ["cyndaquil", "quilava", "typhlosion"],
  ["totodile", "croconaw", "feraligatr"],

  ["sentret", "furret"],
  ["hoothoot", "noctowl"],
  ["ledyba", "ledian"],
  ["spinarak", "ariados"],
  ["crobat"],

  ["chinchou", "lanturn"],

  ["pichu", "pikachu", "raichu"],

  ["togepi", "togetic"],
  ["natu", "xatu"],

  ["mareep", "flaaffy", "ampharos"],

  ["bellossom"],
  ["marill", "azumarill"],

  ["sudowoodo"],

  ["politoed"],

  ["hoppip", "skiploom", "jumpluff"],

  ["aipom"],

  ["sunkern", "sunflora"],

  ["yanma"],

  ["wooper", "quagsire"],

  ["murkrow"],

  ["misdreavus"],

  ["unown"],

  ["wobbuffet"],

  ["girafarig"],

  ["pineco", "forretress"],

  ["dunsparce"],

  ["gligar"],

  ["snubbull", "granbull"],

  ["qwilfish"],

  ["shuckle"],

  ["heracross"],

  ["sneasel"],

  ["teddiursa", "ursaring"],

  ["slugma", "magcargo"],

  ["swinub", "piloswine"],

  ["corsola"],

  ["remoraid", "octillery"],

  ["delibird"],

  ["mantine"],

  ["skarmory"],

  ["houndour", "houndoom"],

  ["kingdra"],

  ["phanpy", "donphan"],

  ["stantler"],

  ["smeargle"],

  ["tyrogue", "hitmonlee"],
  ["tyrogue", "hitmonchan"],
  ["tyrogue", "hitmontop"],

  ["smoochum", "jynx"],
  ["elekid", "electabuzz"],
  ["magby", "magmar"],

  ["miltank"],

  ["blissey"],

  ["raikou"],
  ["entei"],
  ["suicune"],

  ["larvitar", "pupitar", "tyranitar"],

  ["lugia"],
  ["ho-oh"],
  ["celebi"],

  // Gen 3
  ["treecko", "grovyle", "sceptile"],
  ["torchic", "combusken", "blaziken"],
  ["mudkip", "marshtomp", "swampert"],

  ["poochyena", "mightyena"],
  ["zigzagoon", "linoone"],

  ["wurmple", "silcoon", "beautifly"],
  ["wurmple", "cascoon", "dustox"],

  ["lotad", "lombre", "ludicolo"],
  ["seedot", "nuzleaf", "shiftry"],

  ["taillow", "swellow"],

  ["wingull", "pelipper"],

  ["ralts", "kirlia", "gardevoir"],
  ["ralts", "kirlia", "gallade"],

  ["surskit", "masquerain"],

  ["shroomish", "breloom"],

  ["slakoth", "vigoroth", "slaking"],

  ["nincada", "ninjask"],
  ["nincada", "shedinja"],

  ["whismur", "loudred", "exploud"],

  ["makuhita", "hariyama"],

  ["azurill", "marill", "azumarill"],

  ["nosepass"],

  ["skitty", "delcatty"],

  ["sableye"],

  ["mawile"],

  ["aron", "lairon", "aggron"],

  ["meditite", "medicham"],

  ["electrike", "manectric"],

  ["plusle"],
  ["minun"],

  ["volbeat"],
  ["illumise"],

  ["budew", "roselia"],
  ["roselia", "roserade"],

  ["gulpin", "swalot"],

  ["carvanha", "sharpedo"],

  ["wailmer", "wailord"],

  ["numel", "camerupt"],

  ["torkoal"],

  ["spoink", "grumpig"],

  ["spinda"],

  ["trapinch", "vibrava", "flygon"],

  ["cacnea", "cacturne"],

  ["swablu", "altaria"],

  ["zangoose"],
  ["seviper"],

  ["lunatone"],
  ["solrock"],

  ["barboach", "whiscash"],

  ["corphish", "crawdaunt"],

  ["baltoy", "claydol"],

  ["lileep", "cradily"],

  ["anorith", "armaldo"],

  ["feebas", "milotic"],

  ["castform"],

  ["kecleon"],

  ["shuppet", "banette"],

  ["duskull", "dusclops", "dusknoir"],

  ["tropius"],

  ["chimecho"],

  ["absol"],

  ["snorunt", "glalie"],
  ["snorunt", "froslass"],

  ["spheal", "sealeo", "walrein"],

  ["clamperl", "huntail"],
  ["clamperl", "gorebyss"],

  ["relicanth"],

  ["luvdisc"],

  ["bagon", "shelgon", "salamence"],

  ["beldum", "metang", "metagross"],

  ["regirock"],
  ["regice"],
  ["registeel"],

  ["latias"],
  ["latios"],

  ["kyogre"],
  ["groudon"],
  ["rayquaza"],

  ["jirachi"],
  ["deoxys"],

  // Gen 4
  ["turtwig", "grotle", "torterra"],
  ["chimchar", "monferno", "infernape"],
  ["piplup", "prinplup", "empoleon"],

  ["starly", "staravia", "staraptor"],

  ["bidoof", "bibarel"],

  ["kricketot", "kricketune"],

  ["shinx", "luxio", "luxray"],

  ["cranidos", "rampardos"],
  ["shieldon", "bastiodon"],

  ["burmy", "wormadam"],
  ["burmy", "mothim"],

  ["combee", "vespiquen"],

  ["buizel", "floatzel"],

  ["cherubi", "cherrim"],

  ["shellos", "gastrodon"],

  ["drifloon", "drifblim"],

  ["buneary", "lopunny"],

  ["glameow", "purugly"],

  ["stunky", "skuntank"],

  ["bronzor", "bronzong"],

  ["bonsly", "sudowoodo"],

  ["mime-jr", "mr-mime"],

  ["happiny", "chansey", "blissey"],

  ["chatot"],

  ["spiritomb"],

  ["gible", "gabite", "garchomp"],

  ["munchlax", "snorlax"],

  ["riolu", "lucario"],

  ["hippopotas", "hippowdon"],

  ["skorupi", "drapion"],

  ["croagunk", "toxicroak"],

  ["carnivine"],

  ["finneon", "lumineon"],

  ["snover", "abomasnow"],

  ["weavile"],

  ["magnezone"],

  ["lickilicky"],

  ["rhyperior"],

  ["tangrowth"],

  ["electivire"],

  ["magmortar"],

  ["togekiss"],

  ["yanmega"],

  ["leafeon"],
  ["glaceon"],

  ["gliscor"],

  ["mamoswine"],

  ["porygon2", "porygon-z"],

  ["gallade"],

  ["probopass"],

  ["dusknoir"],

  ["froslass"],

  ["rotom"],

  ["uxie"],
  ["mesprit"],
  ["azelf"],

  ["dialga"],
  ["palkia"],
  ["heatran"],
  ["regigigas"],
  ["giratina"],
  ["cresselia"],

  ["phione"],
  ["manaphy"],

  ["darkrai"],
  ["shaymin"],
  ["arceus"],

  // Gen 5
  ["snivy", "servine", "serperior"],
  ["tepig", "pignite", "emboar"],
  ["oshawott", "dewott", "samurott"],

  ["patrat", "watchog"],
  ["lillipup", "herdier", "stoutland"],

  ["purrloin", "liepard"],

  ["pansear", "simisear"],
  ["panpour", "simipour"],
  ["panpour", "simisage"],

  ["munna", "musharna"],

  ["pidove", "tranquill", "unfezant"],

  ["blitzle", "zebstrika"],

  ["roggenrola", "boldore", "gigalith"],

  ["woobat", "swoobat"],

  ["drilbur", "excadrill"],

  ["audino"],

  ["timburr", "gurdurr", "conkeldurr"],

  ["tympole", "palpitoad", "seismitoad"],

  ["throh"],
  ["sawk"],

  ["sewaddle", "swadloon", "leavanny"],

  ["venipede", "whirlipede", "scolipede"],

  ["cottonee", "whimsicott"],

  ["petilil", "lilligant"],

  ["basculin"],

  ["sandile", "krokorok", "krookodile"],

  ["darumaka", "darmanitan"],

  ["maractus"],

  ["dwebble", "crustle"],

  ["scraggy", "scrafty"],

  ["sigilyph"],

  ["yamask", "cofagrigus"],

  ["tirtouga", "carracosta"],

  ["archen", "archeops"],

  ["trubbish", "garbodor"],

  ["zorua", "zoroark"],

  ["minccino", "cinccino"],

  ["gothita", "gothorita", "gothitelle"],

  ["solosis", "duosion", "reuniclus"],

  ["ducklett", "swanna"],

  ["vanillite", "vanillish", "vanilluxe"],

  ["deerling", "sawsbuck"],

  ["emolga"],

  ["karrablast", "escavalier"],
  ["shelmet", "accelgor"],

  ["foongus", "amoonguss"],

  ["frillish", "jellicent"],

  ["alomomola"],

  ["joltik", "galvantula"],

  ["ferroseed", "ferrothorn"],

  ["klink", "klang", "klinklang"],

  ["tynamo", "eelektrik", "eelektross"],

  ["elgyem", "beheeyem"],

  ["litwick", "lampent", "chandelure"],

  ["axew", "fraxure", "haxorus"],

  ["cubchoo", "beartic"],

  ["cryogonal"],

  ["shelmet", "accelgor"],

  ["stunfisk"],

  ["mienfoo", "mienshao"],

  ["golett", "golurk"],

  ["pawniard", "bisharp"],

  ["bouffalant"],

  ["rufflet", "braviary"],
  ["vullaby", "mandibuzz"],

  ["heatmor"],
  ["durant"],

  ["deino", "zweilous", "hydreigon"],

  ["larvesta", "volcarona"],

  ["cobalion"],
  ["terrakion"],
  ["virizion"],

  ["tornadus"],
  ["thundurus"],
  ["reshiram"],
  ["zekrom"],
  ["landorus"],
  ["kyurem"],
  ["keldeo"],
  ["meloetta"],
  ["genesect"],
];

/*
  Remove duplicidades e transforma as linhas em Sets.
*/
const normalizedEvolutionLines = evolutionLines.map((line) => [
  ...new Set(line.map(normalizePokemonName)),
]);

/*
  Retorna todos os Pokémon considerados pertencentes à mesma
  linha evolutiva de determinado Pokémon.
*/
function getEvolutionFamily(pokemon: string): string[] {
  const key = normalizePokemonName(pokemon);

  if (!key) {
    return [];
  }

  const families = normalizedEvolutionLines.filter((line) =>
    line.includes(key)
  );

  if (families.length === 0) {
    return [key];
  }

  const result = new Set<string>();

  for (const family of families) {
    for (const member of family) {
      result.add(member);
    }
  }

  return [...result];
}

/*
  Expande o ownership de um Pokémon para toda a linha evolutiva.

  Exemplo:

  Charizard -> PomboY

  passa a gerar:

  charmander -> PomboY
  charmeleon -> PomboY
  charizard -> PomboY
*/
function addEvolutionOwnership(
  ownership: Record<string, ShinyOwnership>,
  pokemon: string,
  username: string
) {
  const family = getEvolutionFamily(pokemon);

  for (const familyPokemon of family) {
    if (!ownership[familyPokemon]) {
      ownership[familyPokemon] = {
        pokemon: familyPokemon,
        players: [],
        obtained: false,
      };
    }

    if (
      username &&
      !ownership[familyPokemon].players.includes(username)
    ) {
      ownership[familyPokemon].players.push(username);
    }
  }
}

/* =========================================================
   SHINY SHOWCASE
========================================================= */

/**
 * SHINY SHOWCASE
 *
 * Retorna TODOS os shinies registrados.
 *
 * Não faz:
 * - deduplicação por Pokémon
 * - deduplicação por player
 * - expansão de evolução
 *
 * Cada registro de shiny_entries é um item.
 */
export async function getShowcaseShinies(): Promise<
  ShowcaseShiny[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shiny_entries")
    .select(`
      id,
      player_id,
      pokemon,
      display_name,
      pokemon_id,
      encounters,
      caught_at,
      shiny_players!inner (
        username
      )
    `)
    .order("caught_at", {
      ascending: false,
      nullsFirst: false,
    });

  if (error) {
    console.error(
      "[SHINY SHOWCASE]",
      error
    );

    return [];
  }

  return (data ?? []).map(
    (entry: any) => {
      const player = Array.isArray(
        entry.shiny_players
      )
        ? entry.shiny_players[0]
        : entry.shiny_players;

      return {
        id: String(entry.id),

        playerId: String(
          entry.player_id
        ),

        username:
          player?.username ??
          "Desconhecido",

        pokemon:
          entry.pokemon ?? "",

        displayName:
          entry.display_name ||
          entry.pokemon ||
          "Pokémon",

        pokemonId:
          entry.pokemon_id != null
            ? Number(entry.pokemon_id)
            : null,

        encounters:
          entry.encounters != null
            ? Number(entry.encounters)
            : null,

        caughtAt:
          entry.caught_at ?? null,
      };
    }
  );
}

/* =========================================================
   SHINY OWNERSHIP
========================================================= */

/**
 * SHINY OWNERSHIP
 *
 * Cria:
 *
 * Pokémon -> players que possuem
 *
 * REGRA ESPECIAL:
 *
 * Se um player possui qualquer Pokémon de uma linha evolutiva,
 * ele passa a possuir todos os Pokémon daquela linha para fins
 * de exibição do site.
 */
export async function getShinyOwnership(): Promise<
  Record<string, ShinyOwnership>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shiny_entries")
    .select(`
      pokemon,
      display_name,
      shiny_players!inner (
        username
      )
    `);

  if (error) {
    console.error(
      "[SHINY OWNERSHIP]",
      error
    );

    return {};
  }

  const ownership: Record<
    string,
    ShinyOwnership
  > = {};

  /*
    Primeiro pegamos os registros reais do banco.
  */
  for (const entry of data ?? []) {
    const pokemon =
      entry.display_name ||
      entry.pokemon ||
      "";

    const key =
      normalizePokemonName(pokemon);

    if (!key) {
      continue;
    }

    const player = Array.isArray(
      entry.shiny_players
    )
      ? entry.shiny_players[0]
      : entry.shiny_players;

    const username =
      player?.username?.trim();

    if (!username) {
      continue;
    }

    /*
      Aqui está a nova lógica:

      Em vez de adicionar somente:

      charizard -> PomboY

      adicionamos:

      charmander -> PomboY
      charmeleon -> PomboY
      charizard -> PomboY
    */
    addEvolutionOwnership(
      ownership,
      key,
      username
    );
  }

  /*
    Ordena os players e atualiza obtained.
  */
  for (const item of Object.values(
    ownership
  )) {
    item.players.sort(
      (a, b) =>
        a.localeCompare(b)
    );

    item.obtained =
      item.players.length > 0;
  }

  return ownership;
}

/* =========================================================
   OWNERSHIP FOR POKÉMON
========================================================= */

export function getOwnershipForPokemon(
  ownership: Record<
    string,
    ShinyOwnership
  >,
  pokemon: string
) {
  const key =
    normalizePokemonName(pokemon);

  return (
    ownership[key] ?? {
      pokemon,
      players: [],
      obtained: false,
    }
  );
}