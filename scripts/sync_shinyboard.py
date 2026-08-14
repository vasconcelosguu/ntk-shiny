import os
import re
import sys
import time
from pathlib import Path
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from supabase import create_client


# ============================================================
# CONFIGURAÇÃO
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

ENV_LOCAL = BASE_DIR / ".env.local"
ENV_FILE = BASE_DIR / ".env"

if ENV_LOCAL.exists():
    load_dotenv(ENV_LOCAL)

if ENV_FILE.exists():
    load_dotenv(ENV_FILE, override=False)


SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")

SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


PLAYERS = [
    {
        "username": "Frowwk",
        "shinyboard_username": "Frowwk",
    },
    {
        "username": "Nvok",
        "shinyboard_username": "Nvok",
    },
    {
        "username": "Katonlol",
        "shinyboard_username": "Katonlol",
    },
    {
        "username": "AsunaY",
        "shinyboard_username": "AsunaY",
    },
    {
        "username": "OtwiIight",
        "shinyboard_username": "OtwiIight",
    },
    {
        "username": "Gabmaruxl",
        "shinyboard_username": "Gabmaruxl",
    },
    {
        "username": "Deino",
        "shinyboard_username": "Deino",
    },
]


SHINYBOARD_BASE = "https://www.shinyboard.net/users"

POKEAPI_BASE = "https://pokeapi.co/api/v2/pokemon"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/151.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,"
        "application/xml;q=0.9,image/avif,"
        "image/webp,*/*;q=0.8"
    ),
}


# ============================================================
# VALIDAÇÃO
# ============================================================

if not SUPABASE_URL:
    print("ERRO: NEXT_PUBLIC_SUPABASE_URL não encontrada.")
    sys.exit(1)

if not SUPABASE_KEY:
    print(
        "ERRO: SUPABASE_SERVICE_ROLE_KEY não encontrada."
    )
    print()
    print(
        "Adicione SUPABASE_SERVICE_ROLE_KEY ao .env.local"
    )
    sys.exit(1)


# ============================================================
# CLIENTES
# ============================================================

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY,
)

http = requests.Session()
http.headers.update(HEADERS)


# ============================================================
# CACHE POKEAPI
# ============================================================

pokemon_id_cache: dict[str, int | None] = {}


# ============================================================
# NORMALIZAÇÃO
# ============================================================

def normalize_pokemon_name(name: str) -> str:
    """
    Converte nomes vindos do ShinyBoard para o formato
    utilizado pela PokeAPI.
    """

    value = name.strip().lower()

    replacements = {
        "♀": "-f",
        "♂": "-m",

        "mr. mime": "mr-mime",
        "mr mime": "mr-mime",

        "mr. rime": "mr-rime",
        "mr rime": "mr-rime",

        "mime jr.": "mime-jr",
        "mime jr": "mime-jr",

        "farfetch'd": "farfetchd",
        "farfetch’d": "farfetchd",

        "sirfetch'd": "sirfetchd",
        "sirfetch’d": "sirfetchd",

        "nidoran♀": "nidoran-f",
        "nidoran♂": "nidoran-m",

        "flabébé": "flabebe",
        "flabebe": "flabebe",

        "type: null": "type-null",

        "jangmo-o": "jangmo-o",
        "hakamo-o": "hakamo-o",
        "kommo-o": "kommo-o",

        "ho-oh": "ho-oh",

        "porygon-z": "porygon-z",
    }

    if value in replacements:
        return replacements[value]

    value = value.replace("’", "")
    value = value.replace("'", "")

    value = value.replace(".", "")

    value = re.sub(r"\s+", "-", value)

    return value


# ============================================================
# POKEAPI
# ============================================================

def get_pokemon_id(name: str) -> int | None:
    """
    Busca o ID do Pokémon na PokeAPI.

    O resultado fica em cache durante a execução do script.
    """

    normalized = normalize_pokemon_name(name)

    if normalized in pokemon_id_cache:
        return pokemon_id_cache[normalized]

    url = f"{POKEAPI_BASE}/{normalized}"

    try:
        response = http.get(
            url,
            timeout=15,
        )

        if response.status_code == 200:
            data = response.json()

            pokemon_id = data.get("id")

            if isinstance(pokemon_id, int):
                pokemon_id_cache[normalized] = pokemon_id

                print(
                    f"  PokeAPI: {name} → ID {pokemon_id}"
                )

                return pokemon_id

        print(
            f"  AVISO: PokeAPI não encontrou {name}"
        )

    except requests.RequestException as error:
        print(
            f"  AVISO: erro PokeAPI para {name}: "
            f"{error}"
        )

    pokemon_id_cache[normalized] = None

    return None


# ============================================================
# ENCOUNTERS
# ============================================================

def parse_encounters(value: str) -> int:
    """
    Converte:

    66,535
    12,190
    0

    para inteiro.
    """

    if not value:
        return 0

    value = value.strip()

    value = value.replace(",", "")
    value = value.replace(".", "")

    numbers = re.sub(
        r"[^\d]",
        "",
        value,
    )

    if not numbers:
        return 0

    return int(numbers)


# ============================================================
# SHINYBOARD
# ============================================================

def fetch_shinyboard(
    shinyboard_username: str,
) -> list[dict]:

    url = (
        f"{SHINYBOARD_BASE}/"
        f"{shinyboard_username}"
        f"?tab=shinies"
    )

    print()
    print("=" * 60)
    print(f"Buscando: {shinyboard_username}")
    print(url)
    print("=" * 60)

    try:
        response = http.get(
            url,
            timeout=30,
        )
    except requests.RequestException as error:
        raise RuntimeError(
            f"Erro HTTP: {error}"
        )

    print(
        f"HTTP {response.status_code}"
    )

    if response.status_code == 404:
        raise RuntimeError(
            "ShinyBoard retornou 404"
        )

    response.raise_for_status()

    soup = BeautifulSoup(
        response.text,
        "html.parser",
    )

    tables = soup.find_all("table")

    print(
        f"Tabelas encontradas: {len(tables)}"
    )

    if not tables:
        return []

    table = tables[0]

    rows = table.find_all("tr")

    if not rows:
        return []

    headers = []

    header_row = rows[0]

    for cell in header_row.find_all(
        ["th", "td"]
    ):
        headers.append(
            cell.get_text(
                " ",
                strip=True,
            ).lower()
        )

    print(
        f"Headers: {headers}"
    )

    name_index = None
    encounters_index = None

    for index, header in enumerate(headers):

        if header == "name":
            name_index = index

        if header == "encounters":
            encounters_index = index

    if name_index is None:
        raise RuntimeError(
            "Coluna 'name' não encontrada."
        )

    if encounters_index is None:
        raise RuntimeError(
            "Coluna 'encounters' não encontrada."
        )

    shinies = []

    seen = set()

    for row in rows[1:]:

        cells = row.find_all(
            ["td", "th"]
        )

        if len(cells) <= max(
            name_index,
            encounters_index,
        ):
            continue

        pokemon = cells[
            name_index
        ].get_text(
            " ",
            strip=True,
        )

        encounters_text = cells[
            encounters_index
        ].get_text(
            " ",
            strip=True,
        )

        if not pokemon:
            continue

        encounters = parse_encounters(
            encounters_text
        )

        # Evita duplicação causada por
        # elementos duplicados no HTML.
        signature = (
            pokemon.lower(),
            encounters,
        )

        if signature in seen:
            continue

        seen.add(signature)

        shinies.append(
            {
                "pokemon": pokemon,
                "encounters": encounters,
            }
        )

    print(
        f"Shinies encontrados: "
        f"{len(shinies)}"
    )

    for shiny in shinies:
        print(
            f"  {shiny['pokemon']} "
            f"→ "
            f"{shiny['encounters']:,}"
        )

    return shinies


# ============================================================
# SALVAR PLAYER
# ============================================================

def get_or_create_player(
    username: str,
    shinyboard_username: str,
) -> str:

    print(
        f"Salvando player: {username}"
    )

    result = (
        supabase
        .table("shiny_players")
        .upsert(
            {
                "username": username,
                "shinyboard_username":
                    shinyboard_username,
                "updated_at":
                    datetime.now(
                        timezone.utc
                    ).isoformat(),
            },
            on_conflict="shinyboard_username",
        )
        .execute()
    )

    if not result.data:
        raise RuntimeError(
            "Supabase não retornou o player."
        )

    return result.data[0]["id"]


# ============================================================
# SALVAR SHINIES
# ============================================================

def save_player_shinies(
    player_id: str,
    shinyboard_username: str,
    shinies: list[dict],
):

    print(
        "Removendo shinies antigos..."
    )

    delete_result = (
        supabase
        .table("shiny_entries")
        .delete()
        .eq(
            "player_id",
            player_id,
        )
        .execute()
    )

    # Pequena pausa para evitar excesso
    # de requests.
    time.sleep(0.2)

    if not shinies:
        print(
            "Nenhum shiny para salvar."
        )
        return

    rows = []

    source_url = (
        f"{SHINYBOARD_BASE}/"
        f"{shinyboard_username}"
        f"?tab=shinies"
    )

    now = datetime.now(
        timezone.utc
    ).isoformat()

    for shiny in shinies:

        pokemon = shiny["pokemon"]

        encounters = shiny[
            "encounters"
        ]

        pokemon_id = get_pokemon_id(
            pokemon
        )

        rows.append(
            {
                "player_id": player_id,

                "pokemon": normalize_pokemon_name(
                    pokemon
                ),

                "display_name": pokemon,

                "pokemon_id": pokemon_id,

                "encounters": encounters,

                "method": None,

                "region": None,

                "location": None,

                "nickname": None,

                "caught_at": None,

                "source_url": source_url,

                "created_at": now,

                "updated_at": now,
            }
        )

        time.sleep(0.05)

    print(
        f"Salvando {len(rows)} shinies..."
    )

    result = (
        supabase
        .table("shiny_entries")
        .insert(rows)
        .execute()
    )

    if not result.data:
        raise RuntimeError(
            "Supabase não retornou os shinies inseridos."
        )

    print(
        f"{len(result.data)} shinies salvos."
    )


# ============================================================
# SINCRONIZAR PLAYER
# ============================================================

def sync_player(player: dict):

    username = player["username"]

    shinyboard_username = (
        player["shinyboard_username"]
    )

    shinies = fetch_shinyboard(
        shinyboard_username
    )

    player_id = get_or_create_player(
        username,
        shinyboard_username,
    )

    save_player_shinies(
        player_id,
        shinyboard_username,
        shinies,
    )

    print()
    print(
        f"SUCESSO: {username}"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 60)
    print(
        " neverTakeBan - ShinyBoard Sync"
    )
    print("=" * 60)
    print()

    print(
        f"Supabase:\n{SUPABASE_URL}"
    )

    print()
    print(
        "Cliente Supabase criado."
    )

    success = 0
    failures = 0

    for player in PLAYERS:

        try:

            sync_player(player)

            success += 1

        except Exception as error:

            failures += 1

            print()
            print(
                f"ERRO em "
                f"{player['username']}:"
            )

            print(error)

        print()

    print("=" * 60)
    print(
        " SINCRONIZAÇÃO FINALIZADA"
    )
    print("=" * 60)

    print(
        f"Sucesso: {success}"
    )

    print(
        f"Falhas: {failures}"
    )


if __name__ == "__main__":
    main()