// src/hooks/useAnalyseData.js
import { DATE_RE, parseTracks, parseSummary } from "../utils/parse.js";

export default function useAnalyseData() {
  // Lees alle .txt-bestanden uit src/analyse als ruwe tekst
  const modules = import.meta.glob("../analyse/*.txt", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const dataByDate = {};
  const perDayUserCounts = {};
  const errors = [];

  for (const path in modules) {
    const raw = modules[path];            // hele .txt inhoud als string
    const name = path.split("/").pop() || "";

    const m = name.match(DATE_RE);
    if (!m) {
      errors.push(`Bestandsnaam past niet: ${name}`);
      continue;
    }

    const dateFromName = m[1];           // datum uit bestandsnaam (bv. 2025-11-13)

    // Tracks parsen
    const tracks = parseTracks(raw);
    if (!tracks.length) {
      errors.push(`Geen tracks geparsed in ${name}`);
    }
    dataByDate[dateFromName] = tracks;

    // Samenvatting per user parsen
    const { date, perUser } = parseSummary(raw);
    const key = date || dateFromName;
    perDayUserCounts[key] = perUser || {};
  }

  const dates = Object.keys({ ...dataByDate, ...perDayUserCounts }).sort();

  // Handige logs om te zien wat er gebeurt (ook op GitHub Pages)
  console.log("[useAnalyseData] gevonden bestanden:", Object.keys(modules));
  console.log("[useAnalyseData] dates:", dates);
  console.log("[useAnalyseData] errors:", errors);

  return { dataByDate, perDayUserCounts, dates, errors };
}
