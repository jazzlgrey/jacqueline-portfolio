// The booklog reads the published Google Sheet directly, so edits to the
// sheet appear on the page without a redeploy (same source as the old page).
const SHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSxJBvFdixvcf-BeDk5gX8LPfbBX5XDm9pzoNbHQJRX9pIldt6BFnb7GUfh2AJdCqRWVj1IRHMACrYb';
const CSV_URL = `${SHEET}/pub?gid=0&single=true&output=csv`;
export const SHEET_URL = `${SHEET}/pubhtml`;

export type Book = {
  title: string;
  author: string;
  pub: string;
  /** Year the book was started ("undated" if blank). */
  started: string;
  /** 0–100, or null if unknown. */
  pct: number | null;
  mode: string;
};

/** Minimal RFC 4180 CSV parser (quoted fields, doubled quotes, CRLF). */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim()));
}

export function toBooks(rows: string[][]): Book[] {
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  return rows
    .slice(1)
    .map((r) => {
      const get = (name: string) => {
        const i = head.indexOf(name);
        return i >= 0 ? (r[i] ?? '').trim() : '';
      };
      const pct = parseFloat(get('progress'));
      return {
        title: get('title'),
        author: get('author').replace(/\s+,/g, ','),
        pub: get('published'),
        started: get('started') || 'undated',
        pct: Number.isNaN(pct) ? null : Math.max(0, Math.min(100, pct)),
        mode: get('mode').toLowerCase(),
      };
    })
    .filter((b) => b.title);
}

/** Groups by the year each book was started, keeping the sheet's order. */
export function groupByYear(books: Book[]) {
  const groups = new Map<string, Book[]>();
  for (const b of books) {
    if (!groups.has(b.started)) groups.set(b.started, []);
    groups.get(b.started)!.push(b);
  }
  return [...groups].map(([year, list]) => ({ year, books: list }));
}

export async function fetchBooks(signal?: AbortSignal): Promise<Book[]> {
  const res = await fetch(CSV_URL, { signal });
  if (!res.ok) throw new Error(`sheet responded ${res.status}`);
  return toBooks(parseCSV(await res.text()));
}
