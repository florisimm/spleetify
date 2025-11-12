import { DATE_RE, parseTracks, parseSummary } from "../utils/parse.js";

export default function useAnalyseData() {
  const modules = import.meta.glob("../analyse/*.txt", { as: "raw", eager: true });
  const dataByDate = {};
  const perDayUserCounts = {};
  const errors = [];

  for (const path in modules) {
    const name = path.split("/").pop() || "";
    const m = name.match(DATE_RE);
    if (!m) { errors.push(`Bestandsnaam past niet: ${name}`); continue; }

    const dateFromName = m[1];
    const raw = modules[path];

    const tracks = parseTracks(raw);
    if (!tracks.length) errors.push(`Geen tracks geparsed in ${name}`);
    dataByDate[dateFromName] = tracks;

    const { date, perUser } = parseSummary(raw);
    const key = date || dateFromName;
    perDayUserCounts[key] = perUser || {};
  }

  const dates = Object.keys({ ...dataByDate, ...perDayUserCounts }).sort();
  return { dataByDate, perDayUserCounts, dates, errors };
}
