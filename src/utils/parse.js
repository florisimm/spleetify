const PLACEHOLDER_COVER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="#222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#b3b3b3" font-family="Arial" font-size="22">Geen cover</text></svg>`
  );

export function parseTracks(raw) {
  const lines = raw.replace(/\r\n/g, "\n").split("\n").map((l) => l.trim());
  let start = lines.findIndex((l) => /^ALLE NUMMERS:/i.test(l));
  if (start === -1) start = 0;
  const L = lines.slice(start + 1);
  const out = [];
  for (let i = 0; i < L.length; i++) {
    const m = L[i].match(/^(?:\d+\.\s|-\s)(.+)$/);
    if (m) {
      const title = (m[1] || "").trim();
      const artist = (L[i + 1] || "").replace(/^Artiest:\s*/i, "").trim();
      const addedBy = (L[i + 2] || "").replace(/^Toegevoegd door:\s*/i, "").trim();
      const cover = (L[i + 3] || "").replace(/^Album Cover:\s*/i, "").trim();
      if (title && artist) out.push({ title, artist, addedBy, cover: cover || PLACEHOLDER_COVER });
      i += 3;
    }
  }
  return out;
}

export function parseSummary(raw) {
  const text = raw.replace(/\r\n/g, "\n");
  const dateMatch = text.match(/^Datum:\s*(\d{4}-\d{2}-\d{2})/m);
  const date = dateMatch ? dateMatch[1] : null;

  const start = text.indexOf("SAMENVATTING:");
  if (start === -1) return { date, perUser: {} };
  const rest = text.slice(start).split("\n");
  const beginIdx = rest.findIndex((l) => l.trim().startsWith("-"));
  const after = beginIdx === -1 ? [] : rest.slice(beginIdx + 1);
  const endIdx = after.findIndex((l) => l.trim().startsWith("-"));
  const block = after.slice(0, endIdx === -1 ? undefined : endIdx).join("\n");

  const perUser = {};
  block.split("\n").forEach((line) => {
    const m = line.trim().match(/^(.+?):\s*(\d+)\s+nummers?/i);
    if (m) perUser[m[1].trim()] = parseInt(m[2], 10) || 0;
  });

  return { date, perUser };
}

export const DATE_RE = /blend[_-]analyse[_-](\d{4}-\d{2}-\d{2})\.txt$/i;
