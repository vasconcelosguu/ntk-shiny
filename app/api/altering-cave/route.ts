import { NextResponse } from "next/server";

const SHEET_ID =
  "12lZupylxLAKUVQQJZIC8GJmvQiUwpbAAQ3BduAu_rig";

const SHEET_GID = "1031347870";

type CaveEntry = {
  pokemon: string;
  tier: string;
};

type CaveData = {
  title: string;
  singles: CaveEntry[];
  rareSingles: CaveEntry[];
  hordes: CaveEntry[];
  updatedAt: string;
};

function clean(value: string) {
  return value
    .replace(/^"|"$/g, "")
    .replace(/""/g, '"')
    .trim();
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];

  let row: string[] = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const next = csv[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(clean(cell));
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(clean(cell));
      cell = "";

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    cell += char;
  }

  if (cell || row.length > 0) {
    row.push(clean(cell));

    if (row.some((value) => value !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function parseSection(
  rows: string[][],
  sectionName: string,
): CaveEntry[] {
  const entries: CaveEntry[] = [];

  const sectionIndex = rows.findIndex((row) =>
    row.some(
      (cell) =>
        cell.trim().toLowerCase() ===
        sectionName.toLowerCase(),
    ),
  );

  if (sectionIndex === -1) {
    return entries;
  }

  for (
    let i = sectionIndex + 1;
    i < rows.length;
    i++
  ) {
    const row = rows[i] ?? [];

    const first = (row[0] ?? "").trim();
    const second = (row[1] ?? "").trim();

    if (!first && !second) {
      continue;
    }

    /*
     * Se encontrarmos outra seção, paramos.
     */
    const normalized = first.toLowerCase();

    if (
      normalized === "singles" ||
      normalized === "rare singles" ||
      normalized === "hordes" ||
      normalized === "current"
    ) {
      if (normalized !== sectionName.toLowerCase()) {
        break;
      }
    }

    /*
     * Ignora cabeçalhos.
     */
    if (
      normalized === "current" ||
      normalized === "tier" ||
      normalized === "name" ||
      normalized === "pokemon"
    ) {
      continue;
    }

    /*
     * Tier normalmente está na coluna B.
     */
    if (first && second) {
      entries.push({
        pokemon: first,
        tier: second,
      });
    }
  }

  return entries;
}

export async function GET() {
  try {
    const url =
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}` +
      `/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Google Sheets retornou HTTP ${response.status}`,
      );
    }

    const csv = await response.text();

    const rows = parseCSV(csv);

    const data: CaveData = {
      title: "Altering Cave",
      singles: parseSection(rows, "Singles"),
      rareSingles: parseSection(rows, "Rare Singles"),
      hordes: parseSection(rows, "Hordes"),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error(
      "[ALTERING CAVE] Erro:",
      error,
    );

    return NextResponse.json(
      {
        error: "Não foi possível carregar os dados.",
      },
      {
        status: 500,
      },
    );
  }
}