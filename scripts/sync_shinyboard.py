import os
import re
import sys
import time
import unicodedata

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


SUPABASE_URL = os.getenv(
    "NEXT_PUBLIC_SUPABASE_URL"
)

SUPABASE_KEY = os.getenv(
    "SUPABASE_SERVICE_ROLE_KEY"
)


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


SHINYBOARD_BASE = (
    "https://www.shinyboard.net/users"
)

POKEAPI_BASE = (
    "https://pokeapi.co/api/v2/pokemon"
)


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
    "Accept-Language": (
        "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
    ),
}


# ============================================================
# CONFIGURAÇÃO DE UTF-8 NO WINDOWS
# ============================================================

try:
    sys.stdout.reconfigure(
        encoding="utf-8"
    )

    sys.stderr.reconfigure(
        encoding="utf-8"
    )

except AttributeError:
    pass


# ============================================================
# VALIDAÇÃO
# ============================================================

if not SUPABASE_URL:

    print(
        "ERRO: NEXT_PUBLIC_SUPABASE_URL "
        "não encontrada."
    )

    sys.exit(1)


if not SUPABASE_KEY:

    print(
        "ERRO: SUPABASE_SERVICE_ROLE_KEY "
        "não encontrada."
    )

    print()

    print(
        "Adicione SUPABASE_SERVICE_ROLE_KEY "
        "ao .env.local"
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

http.headers.update(
    HEADERS
)


# ============================================================
# CACHE POKEAPI
# ============================================================

pokemon_id_cache: dict[
    str,
    int | None
] = {}


# ============================================================
# NORMALIZAÇÃO DE TEXTO
# ============================================================

def normalize_text(
    value: str,
) -> str:

    """
    Normaliza texto para comparação.

    Exemplo:

    "Capturado Em"
    ->
    "capturado em"

    "Nome"
    ->
    "nome"

    Também remove acentos.
    """

    value = value.strip().lower()

    value = unicodedata.normalize(
        "NFKD",
        value,
    )

    value = "".join(
        char
        for char in value
        if not unicodedata.combining(char)
    )

    value = re.sub(
        r"\s+",
        " ",
        value,
    )

    return value


# ============================================================
# NORMALIZAÇÃO DE POKÉMON
# ============================================================

def normalize_pokemon_name(
    name: str,
) -> str:

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

    value = value.replace(
        "’",
        "",
    )

    value = value.replace(
        "'",
        "",
    )

    value = value.replace(
        ".",
        "",
    )

    value = re.sub(
        r"\s+",
        "-",
        value,
    )

    return value


# ============================================================
# POKEAPI
# ============================================================

def get_pokemon_id(
    name: str,
) -> int | None:

    normalized = normalize_pokemon_name(
        name
    )

    if normalized in pokemon_id_cache:
        return pokemon_id_cache[
            normalized
        ]

    url = (
        f"{POKEAPI_BASE}/"
        f"{normalized}"
    )

    try:

        response = http.get(
            url,
            timeout=15,
        )

        if response.status_code == 200:

            data = response.json()

            pokemon_id = data.get(
                "id"
            )

            if isinstance(
                pokemon_id,
                int,
            ):

                pokemon_id_cache[
                    normalized
                ] = pokemon_id

                print(
                    f"  PokeAPI: {name} -> "
                    f"ID {pokemon_id}"
                )

                return pokemon_id

        print(
            f"  AVISO: PokeAPI não "
            f"encontrou {name}"
        )

    except requests.RequestException as error:

        print(
            f"  AVISO: erro PokeAPI "
            f"para {name}: {error}"
        )

    pokemon_id_cache[
        normalized
    ] = None

    return None


# ============================================================
# ENCOUNTERS
# ============================================================

def parse_encounters(
    value: str,
) -> int:

    if not value:
        return 0

    value = value.strip()

    value = value.replace(
        ",",
        "",
    )

    value = value.replace(
        ".",
        "",
    )

    numbers = re.sub(
        r"[^\d]",
        "",
        value,
    )

    if not numbers:
        return 0

    return int(numbers)


# ============================================================
# IDENTIFICAÇÃO DE COLUNAS
# ============================================================

def find_column_index(
    headers: list[str],
    possible_names: set[str],
) -> int | None:

    for index, header in enumerate(
        headers
    ):

        normalized = normalize_text(
            header
        )

        if normalized in possible_names:
            return index

    return None


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

    print(
        f"Buscando: "
        f"{shinyboard_username}"
    )

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

    # --------------------------------------------------------
    # 404
    # --------------------------------------------------------

    if response.status_code == 404:

        raise RuntimeError(
            "ShinyBoard retornou 404."
        )

    response.raise_for_status()

    # --------------------------------------------------------
    # HTML
    # --------------------------------------------------------

    soup = BeautifulSoup(
        response.text,
        "html.parser",
    )

    tables = soup.find_all(
        "table"
    )

    print(
        f"Tabelas encontradas: "
        f"{len(tables)}"
    )

    # --------------------------------------------------------
    # Nenhuma tabela
    # --------------------------------------------------------

    if not tables:

        print(
            "Nenhuma tabela de Shinies "
            "foi encontrada."
        )

        print(
            "O perfil pode estar sem "
            "dados carregados ou o "
            "ShinyBoard pode ter retornado "
            "uma página diferente."
        )

        return []

    # --------------------------------------------------------
    # Procurar tabela correta
    # --------------------------------------------------------

    shiny_table = None
    shiny_headers = None

    for table_number, table in enumerate(
        tables,
        start=1,
    ):

        rows = table.find_all(
            "tr"
        )

        if not rows:
            continue

        header_row = rows[0]

        headers = []

        for cell in header_row.find_all(
            ["th", "td"]
        ):

            headers.append(
                cell.get_text(
                    " ",
                    strip=True,
                )
            )

        normalized_headers = [
            normalize_text(
                header
            )
            for header in headers
        ]

        print(
            f"Tabela {table_number}: "
            f"{normalized_headers}"
        )

        has_name = any(
            header in {
                "name",
                "nome",
            }
            for header
            in normalized_headers
        )

        has_encounters = any(
            header in {
                "encounters",
                "encontros",
            }
            for header
            in normalized_headers
        )

        if (
            has_name
            and has_encounters
        ):

            shiny_table = table
            shiny_headers = headers

            print(
                f"Tabela de shinies "
                f"encontrada: #{table_number}"
            )

            break

    # --------------------------------------------------------
    # Nenhuma tabela compatível
    # --------------------------------------------------------

    if shiny_table is None:

        raise RuntimeError(
            "Não foi possível encontrar "
            "a tabela de Shinies."
        )

    headers = shiny_headers

    # --------------------------------------------------------
    # Índices
    # --------------------------------------------------------

    name_index = find_column_index(
        headers,
        {
            "name",
            "nome",
        },
    )

    encounters_index = find_column_index(
        headers,
        {
            "encounters",
            "encontros",
        },
    )

    caught_at_index = find_column_index(
        headers,
        {
            "caught at",
            "capturado em",
            "caught_at",
        },
    )

    print(
        f"Headers: {headers}"
    )

    print(
        f"Name index: {name_index}"
    )

    print(
        f"Encounters index: "
        f"{encounters_index}"
    )

    print(
        f"Caught At index: "
        f"{caught_at_index}"
    )

    if name_index is None:

        raise RuntimeError(
            "Coluna de nome não encontrada."
        )

    if encounters_index is None:

        raise RuntimeError(
            "Coluna de encontros não encontrada."
        )

    # --------------------------------------------------------
    # Linhas
    # --------------------------------------------------------

    rows = shiny_table.find_all(
        "tr"
    )

    print(
        f"Linhas encontradas na tabela: "
        f"{len(rows)}"
    )

    shinies = []

    seen = set()

    for row in rows[1:]:

        cells = row.find_all(
            ["td", "th"]
        )

        required_index = max(
            name_index,
            encounters_index,
        )

        if len(cells) <= required_index:
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

        caught_at = None

        if (
            caught_at_index is not None
            and len(cells)
            > caught_at_index
        ):

            caught_at = cells[
                caught_at_index
            ].get_text(
                " ",
                strip=True,
            )

        if not pokemon:
            continue

        encounters = parse_encounters(
            encounters_text
        )

        # ----------------------------------------------------
        # Duplicação
        # ----------------------------------------------------

        signature = (
            pokemon.lower(),
            encounters,
            caught_at,
        )

        if signature in seen:
            continue

        seen.add(signature)

        shinies.append(
            {
                "pokemon": pokemon,
                "encounters": encounters,
                "caught_at": caught_at,
            }
        )

    # --------------------------------------------------------
    # Resultado
    # --------------------------------------------------------

    print()
    print(
        f"SHINIES ENCONTRADOS: "
        f"{len(shinies)}"
    )

    for shiny in shinies:

        print(
            f"  {shiny['pokemon']} "
            f"- "
            f"{shiny['encounters']:,} "
            f"encounters"
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
        f"Salvando player: "
        f"{username}"
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
            on_conflict=(
                "shinyboard_username"
            ),
        )
        .execute()
    )

    if not result.data:

        raise RuntimeError(
            "Supabase não retornou "
            "o player."
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

    (
        supabase
        .table("shiny_entries")
        .delete()
        .eq(
            "player_id",
            player_id,
        )
        .execute()
    )

    time.sleep(
        0.2
    )

    # --------------------------------------------------------
    # Nenhum shiny
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Preparar registros
    # --------------------------------------------------------

    for shiny in shinies:

        pokemon = shiny[
            "pokemon"
        ]

        encounters = shiny[
            "encounters"
        ]

        caught_at = shiny.get(
            "caught_at"
        )

        pokemon_id = get_pokemon_id(
            pokemon
        )

        rows.append(
            {
                "player_id":
                    player_id,

                "pokemon":
                    normalize_pokemon_name(
                        pokemon
                    ),

                "display_name":
                    pokemon,

                "pokemon_id":
                    pokemon_id,

                "encounters":
                    encounters,

                "method":
                    None,

                "region":
                    None,

                "location":
                    None,

                "nickname":
                    None,

                "caught_at":
                    caught_at,

                "source_url":
                    source_url,

                "created_at":
                    now,

                "updated_at":
                    now,
            }
        )

        time.sleep(
            0.05
        )

    # --------------------------------------------------------
    # Inserção
    # --------------------------------------------------------

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
            "Supabase não retornou "
            "os shinies inseridos."
        )

    print(
        f"{len(result.data)} "
        f"shinies salvos."
    )


# ============================================================
# SINCRONIZAR PLAYER
# ============================================================

def sync_player(
    player: dict,
):

    username = player[
        "username"
    ]

    shinyboard_username = player[
        "shinyboard_username"
    ]

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
        " neverTakeBan"
    )

    print(
        " ShinyBoard Sync"
    )

    print("=" * 60)

    print()

    print(
        f"Supabase:\n"
        f"{SUPABASE_URL}"
    )

    print()

    print(
        "Cliente Supabase criado."
    )

    print()

    print(
        f"Players para sincronizar: "
        f"{len(PLAYERS)}"
    )

    success = 0
    failures = 0

    for player in PLAYERS:

        try:

            sync_player(
                player
            )

            success += 1

        except Exception as error:

            failures += 1

            print()

            print(
                f"ERRO em "
                f"{player['username']}:"
            )

            print(
                str(error)
            )

        print()

    # ========================================================
    # RESULTADO FINAL
    # ========================================================

    print("=" * 60)

    print(
        " SINCRONIZAÇÃO FINALIZADA"
    )

    print("=" * 60)

    print()

    print(
        f"Sucesso: {success}"
    )

    print(
        f"Falhas: {failures}"
    )

    print()


# ============================================================
# EXECUÇÃO
# ============================================================

if __name__ == "__main__":
    main()