// src/utils/parse.js

// Simpele placeholder-cover als er geen URL is
const PLACEHOLDER_COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
       <rect width="100%" height="100%" fill="#111" />
       <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
             fill="#b3b3b3" font-family="Arial" font-size="22">
         Geen cover
       </text>
     </svg>`
  );

/**
 * Parseert het blok "ALLE NUMMERS" uit jouw analyse-txt.
 *
 * Verwachte structuur per track:
 *
 *  1. Titel
 *     Artiest: ...
 *     Toegevoegd door: ...
 *     Genre: ...
 *     Album Cover: ...
 */
export function parseTracks(raw) {
  if (typeof raw !== "string") return [];

  const lines = raw.replace(/\r\n/g, "\n").split("\n");

  // spring naar "ALLE NUMMERS:"
  let start = lines.findIndex((l) => /^ALLE NUMMERS:/i.test((l || "").trim()));
  if (start === -1) start = 0;

  // alles ná de header
  const L = lines.slice(start + 1).map((l) => (l || "").trim());
  const out = [];

  for (let i = 0; i < L.length; i++) {
    const m = L[i].match(/^\d+\.\s+(.*)$/);
    if (!m) continue;

    const title = (m[1] || "").trim();
    const artist = (L[i + 1] || "").replace(/^Artiest:\s*/i, "").trim();
    const addedBy = (L[i + 2] || "").replace(/^Toegevoegd door:\s*/i, "").trim();
    const genre = (L[i + 3] || "").replace(/^Genre:\s*/i, "").trim();
    const coverLine = L[i + 4] || "";
    const cover = coverLine.replace(/^Album Cover:\s*/i, "").trim();

    if (title && artist) {
      out.push({
        title,
        artist,
        addedBy,
        genre,
        cover: cover || PLACEHOLDER_COVER,
      });
    }

    // we hebben 5 regels verbruikt (titel + 4 details)
    i += 4;
  }

  return out;
}

/**
 * Parseert de datum + "SAMENVATTING PER PERSOON" uit het tekstbestand.
 */
export function parseSummary(raw) {
  if (typeof raw !== "string") return { date: null, perUser: {} };

  const text = raw.replace(/\r\n/g, "\n");
  const lines = text.split("\n");

  // Datum: 2025-11-14
  const dateMatch = text.match(/^Datum:\s*(\d{4}-\d{2}-\d{2})/m);
  const date = dateMatch ? dateMatch[1] : null;

  const perUser = {};
  let inSummary = false;

  for (let line of lines) {
    const trimmed = (line || "").trim();

    if (/^SAMENVATTING PER PERSOON:/i.test(trimmed)) {
      inSummary = true;
      continue;
    }
    if (/^ALLE NUMMERS:/i.test(trimmed)) {
      // daarna begint het track-blok
      inSummary = false;
      continue;
    }

    if (!inSummary || !trimmed) continue;

    // voorbeeld: "tomasog.05: 18 nummers"
    const m = trimmed.match(/^(.+?):\s*(\d+)\s+nummers?/i);
    if (m) {
      const user = m[1].trim();
      const count = parseInt(m[2], 10) || 0;
      perUser[user] = count;
    }
  }

  return { date, perUser };
}

// Bestandsnaam: blend_analyse_2025-11-14.txt
export const DATE_RE = /blend_analyse_(\d{4}-\d{2}-\d{2})\.txt$/;
