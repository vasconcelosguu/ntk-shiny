import os
import re
import sys
import html as html_lib
from pathlib import Path
from typing import Optional

import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client


# ============================================================
# CONFIGURAÇÃO
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

ENV_LOCAL = BASE_DIR / ".env.local"
ENV_FILE = BASE_DIR / ".env"


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


# ============================================================
# ENV
# ============================================================

def load_env_file(path: Path):
    """
    Carrega variáveis de um arquivo .env sem sobrescrever
    variáveis que já estejam no ambiente.
    """

    if not path.exists():
        return

    try:
        content = path.read_text(
            encoding="utf-8"
        )
    except Exception as error:
        print(
            f"Não foi possível ler {path}: {error}"
        )
        return

    for raw_line in content.splitlines():

        line = raw_line.strip()

        if not line:
            continue

        if line.startswith("#"):
            continue

        if "=" not in line:
            continue

        key, value = line.split(
            "=",
            1
        )

        key = key.strip()
        value = value.strip()

        # Remove aspas
        if (
            len(value) >= 2
            and value[0] == value[-1]
            and value[0] in ("'", '"')
        ):
            value = value[1:-1]

        if key not in os.environ:
            os.environ[key] = value


# Carrega .env e .env.local
load_env_file(ENV_FILE)
load_env_file(ENV_LOCAL)


# ============================================================
# SUPABASE
# ============================================================

SUPABASE_URL = os.getenv(
    "NEXT_PUBLIC_SUPABASE_URL"
)

SUPABASE_KEY = os.getenv(
    "SUPABASE_SERVICE_ROLE_KEY"
)


if not SUPABASE_URL:
    print(
        "ERRO: NEXT_PUBLIC_SUPABASE_URL não encontrada."
    )
    print()
    print(
        "Adicione ao .env.local:"
    )
    print(
        "NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co"
    )
    sys.exit(1)


if not SUPABASE_KEY:
    print(
        "ERRO: SUPABASE_SERVICE_ROLE_KEY não encontrada."
    )
    print()
    print(
        "Adicione ao .env.local:"
    )
    print(
        "SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key"
    )
    sys.exit(1)


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# ============================================================
# SHINYBOARD
# ============================================================

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 "
        "(Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/151.0.0.0 "
        "Safari/537.36"
    ),
    "Accept": (
        "text/html,"
        "application/xhtml+xml,"
        "application/xml;q=0.9,"
        "image/avif,"
        "image/webp,"
        "*/*;q=0.8"
    ),
    "Accept-Language": (
        "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
    ),
}


# ============================================================
# UTILITÁRIOS
# ============================================================

def normalize_pokemon_name(
    name: str
) -> str:
    """
    Converte o nome do Pokémon para um formato
    adequado para buscas futuras na PokeAPI.

    Exemplos:

    Mr. Mime     -> mr-mime
    Farfetch'd   -> farfetchd
    Nidoran♀     -> nidoran-f
    Nidoran♂     -> nidoran-m
    Ho-Oh        -> ho-oh
    """

    value = name.strip()

    value = value.replace(
        "♀",
        "-f"
    )

    value = value.replace(
        "♂",
        "-m"
    )

    value = value.replace(
        "’",
        ""
    )

    value = value.replace(
        "'",
        ""
    )

    value = value.lower()

    value = re.sub(
        r"[.:]",
        "",
        value
    )

    value = re.sub(
        r"\s+",
        "-",
        value
    )

    value = re.sub(
        r"-+",
        "-",
        value
    )

    return value.strip("-")


def parse_number(
    value: str
) -> int:
    """
    Converte valores como:

    8,986
    12,190
    66,535
    0

    para:

    8986
    12190
    66535
    0
    """

    if not value:
        return 0

    value = html_lib.unescape(
        value
    )

    # Remove espaços
    value = value.strip()

    # Mantém apenas números
    digits = re.sub(
        r"[^\d]",
        "",
        value
    )

    if not digits:
        return 0

    try:
        return int(digits)
    except ValueError:
        return 0


def clean_text(
    value: str
) -> str:
    """
    Limpa texto extraído do HTML.
    """

    value = html_lib.unescape(
        value
    )

    value = re.sub(
        r"\s+",
        " ",
        value
    )

    return value.strip()


# ============================================================
# BUSCAR SHINYBOARD
# ============================================================

def fetch_shinyboard(
    username: str
) -> Optional[str]:

    url = (
        "https://www.shinyboard.net/users/"
        f"{username}?tab=shinies"
    )

    print(
        url
    )

    try:

        response = requests.get(
            url,
            headers=HEADERS,
            timeout=30
        )

    except requests.RequestException as error:

        print(
            f"ERRO HTTP: {error}"
        )

        return None

    print(
        f"HTTP {response.status_code}"
    )

    if response.status_code == 404:

        print(
            "ERRO: ShinyBoard retornou 404"
        )

        return None

    if not response.ok:

        print(
            "ERRO: ShinyBoard retornou "
            f"{response.status_code}"
        )

        return None

    return response.text


# ============================================================
# PARSER
# ============================================================

def is_valid_pokemon_name(
    name: str
) -> bool:

    if not name:
        return False

    if len(name) < 2:
        return False

    if len(name) > 40:
        return False

    # Não aceita apenas números
    if re.fullmatch(
        r"\d+",
        name
    ):
        return False

    # Cabeçalhos que não queremos
    ignored = {
        "name",
        "pokemon",
        "pokémon",
        "ivs",
        "encounters",
        "caught on",
    }

    if name.lower() in ignored:
        return False

    return True


def parse_shinies(
    html: str
) -> list[dict]:

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    tables = soup.find_all(
        "table"
    )

    print(
        f"Tabelas encontradas: {len(tables)}"
    )

    if not tables:
        return []

    all_results = []

    for table in tables:

        rows = table.find_all(
            "tr"
        )

        if not rows:
            continue

        # ----------------------------------------------------
        # Encontrar cabeçalho
        # ----------------------------------------------------

        header_cells = rows[0].find_all(
            ["th", "td"]
        )

        headers = [
            clean_text(
                cell.get_text(
                    " ",
                    strip=True
                )
            ).lower()
            for cell in header_cells
        ]

        print(
            "Headers:",
            headers
        )

        # ----------------------------------------------------
        # Descobrir coluna Name
        # ----------------------------------------------------

        name_index = None
        encounters_index = None

        for index, header in enumerate(
            headers
        ):

            if header in (
                "name",
                "pokemon",
                "pokémon",
            ):
                name_index = index

            if header == "encounters":
                encounters_index = index

        # Se não encontrou pelo cabeçalho,
        # usamos a estrutura conhecida do ShinyBoard.
        if name_index is None:
            name_index = 1

        if encounters_index is None:

            # Normalmente encounters é
            # a quarta coluna.
            encounters_index = 3

        # ----------------------------------------------------
        # Processar linhas
        # ----------------------------------------------------

        for row in rows[1:]:

            cells = row.find_all(
                ["td", "th"]
            )

            if not cells:
                continue

            values = [
                clean_text(
                    cell.get_text(
                        " ",
                        strip=True
                    )
                )
                for cell in cells
            ]

            # ------------------------------------------------
            # Nome
            # ------------------------------------------------

            if name_index >= len(values):
                continue

            pokemon_name = values[
                name_index
            ]

            if not is_valid_pokemon_name(
                pokemon_name
            ):
                continue

            # ------------------------------------------------
            # Encounters
            # ------------------------------------------------

            if encounters_index < len(values):

                encounters_text = values[
                    encounters_index
                ]

            else:

                # Fallback:
                # procura o último campo numérico.
                encounters_text = ""

                for value in reversed(values):

                    if re.search(
                        r"\d",
                        value
                    ):
                        encounters_text = value
                        break

            encounters = parse_number(
                encounters_text
            )

            all_results.append(
                {
                    "pokemon": normalize_pokemon_name(
                        pokemon_name
                    ),
                    "display_name": pokemon_name,
                    "encounters": encounters,
                }
            )

    # --------------------------------------------------------
    # Remover duplicatas
    # --------------------------------------------------------

    unique = {}

    for shiny in all_results:

        key = shiny[
            "pokemon"
        ].lower()

        if key not in unique:

            unique[key] = shiny

            continue

        existing = unique[key]

        # Se uma das linhas possui encounters
        # maiores, mantém essa.
        if (
            shiny["encounters"]
            >
            existing["encounters"]
        ):

            unique[key] = shiny

    results = list(
        unique.values()
    )

    return results


# ============================================================
# PLAYER
# ============================================================

def get_or_create_player(
    username: str,
    shinyboard_username: str
) -> str:

    print(
        f"Salvando player: {username}"
    )

    # --------------------------------------------------------
    # Procurar player
    # --------------------------------------------------------

    response = (
        supabase
        .table("shiny_players")
        .select("id")
        .eq(
            "shinyboard_username",
            shinyboard_username
        )
        .limit(1)
        .execute()
    )

    if response.data:

        return response.data[0]["id"]

    # --------------------------------------------------------
    # Criar player
    # --------------------------------------------------------

    insert_response = (
        supabase
        .table("shiny_players")
        .insert(
            {
                "username": username,
                "shinyboard_username":
                    shinyboard_username,
            }
        )
        .execute()
    )

    if not insert_response.data:

        raise RuntimeError(
            "Supabase não retornou o player criado."
        )

    return insert_response.data[0]["id"]


# ============================================================
# SALVAR SHINIES
# ============================================================

def save_shinies(
    player_id: str,
    shinies: list[dict]
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
            player_id
        )
        .execute()
    )

    if not shinies:

        print(
            "Nenhum shiny para salvar."
        )

        return

    rows = []

    for shiny in shinies:

        rows.append(
            {
                "player_id": player_id,

                # Nome normalizado
                # para PokeAPI
                "pokemon": shiny[
                    "pokemon"
                ],

                # Nome original
                # para exibição
                "display_name": shiny[
                    "display_name"
                ],

                # Encontros
                "encounters": shiny[
                    "encounters"
                ],
            }
        )

    # --------------------------------------------------------
    # Inserir em lotes
    # --------------------------------------------------------

    batch_size = 100

    total_saved = 0

    for start in range(
        0,
        len(rows),
        batch_size
    ):

        batch = rows[
            start:start + batch_size
        ]

        response = (
            supabase
            .table("shiny_entries")
            .insert(batch)
            .execute()
        )

        if response.data:

            total_saved += len(
                response.data
            )

    print(
        f"{total_saved} shinies salvos."
    )


# ============================================================
# SINCRONIZAR PLAYER
# ============================================================

def sync_player(
    player: dict
) -> bool:

    username = player[
        "username"
    ]

    shinyboard_username = player[
        "shinyboard_username"
    ]

    print()
    print(
        "=" * 60
    )

    print(
        f"Buscando: {username}"
    )

    url = (
        "https://www.shinyboard.net/users/"
        f"{shinyboard_username}?tab=shinies"
    )

    print(
        url
    )

    print(
        "=" * 60
    )

    html = fetch_shinyboard(
        shinyboard_username
    )

    if html is None:
        return False

    shinies = parse_shinies(
        html
    )

    print(
        f"Shinies encontrados: {len(shinies)}"
    )

    for shiny in shinies:

        print(
            f"  {shiny['display_name']}"
            f" → "
            f"{shiny['encounters']:,}"
        )

    try:

        player_id = get_or_create_player(
            username,
            shinyboard_username
        )

        save_shinies(
            player_id,
            shinies
        )

        print()
        print(
            f"SUCESSO: {username}"
        )

        return True

    except Exception as error:

        print()
        print(
            f"ERRO em {username}:"
        )

        print(
            error
        )

        return False


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print(
        "=" * 60
    )
    print(
        " neverTakeBan - ShinyBoard Sync"
    )
    print(
        "=" * 60
    )

    print()
    print(
        "Supabase:"
    )
    print(
        SUPABASE_URL
    )

    print()
    print(
        "Cliente Supabase criado."
    )

    success = 0
    failures = 0

    for player in PLAYERS:

        try:

            result = sync_player(
                player
            )

            if result:

                success += 1

            else:

                failures += 1

        except KeyboardInterrupt:

            print()
            print(
                "Sincronização cancelada."
            )

            sys.exit(1)

        except Exception as error:

            failures += 1

            print()
            print(
                f"ERRO inesperado em "
                f"{player['username']}:"
            )

            print(
                error
            )

    print()
    print(
        "=" * 40
    )
    print(
        " SINCRONIZAÇÃO FINALIZADA"
    )
    print(
        "=" * 40
    )

    print(
        f"Sucesso: {success}"
    )

    print(
        f"Falhas: {failures}"
    )

    print()


if __name__ == "__main__":
    main()