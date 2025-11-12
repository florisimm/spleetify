// src/pages/SongLeaderboard.jsx
import React, { useMemo, useState } from "react";
import useAnalyseData from "../hooks/useAnalyseData.js";
import { styles as S } from "../styles.js";
import { fmt, parse, last } from "../utils/date.js";

export default function SongLeaderboard() {
  const { dataByDate, dates, errors } = useAnalyseData();

  const [range, setRange] = useState("30");
  const allDates = Array.isArray(dates) ? dates : [];
  const lastDate = last(allDates) || fmt(new Date());
  const cutoff =
    range === "all"
      ? "0000-01-01"
      : fmt(new Date(parse(lastDate).getTime() - Number(range) * 86400000));
  const shownDates = allDates.filter((d) => d >= cutoff);

  // Aggregatie per titel + artiest
  const rows = useMemo(() => {
    const map = new Map();
    for (const d of shownDates) {
      const tracks = dataByDate[d] || [];
      const seenToday = new Set();
      for (const t of tracks) {
        const key = `${(t.title || "").toLowerCase()}|||${(t.artist || "").toLowerCase()}`;
        let cur = map.get(key);
        if (!cur) {
          cur = {
            key,
            title: t.title || "",
            artist: t.artist || "",
            cover: t.cover || "",
            count: 0,
            dates: [],
            lastSeen: d,
          };
          map.set(key, cur);
        }
        cur.count += 1;
        if (!seenToday.has(key)) {
          cur.dates.push(d);
          seenToday.add(key);
        }
        if (!cur.lastSeen || d > cur.lastSeen) cur.lastSeen = d;
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.title.localeCompare(b.title, "nl");
    });
  }, [shownDates, dataByDate]);

  const [openKey, setOpenKey] = useState(null);
  const toggleRow = (key) => setOpenKey((k) => (k === key ? null : key));

  return (
    <section>
      {!!errors.length && (
        <div style={S.errorBox}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Fouten</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 style={{ margin: "6px 12px 10px", color: "#fff" }}>Leaderboard (liedjes)</h2>

      {/* Tijdvenster */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "0 12px 12px" }}>
        <span style={{ color: "#b3b3b3" }}>Periode</span>
        {["30", "90", "all"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{ ...S.chip, ...(range === r ? S.chipActive : null) }}
          >
            {r === "all" ? "All-time" : `${r} dagen`}
          </button>
        ))}
      </div>

      {/* Tabel */}
      <div style={{ border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "56px 1fr 120px 140px",
            gap: 12,
            padding: "8px 12px",
            background: "#181818",
            color: "#b3b3b3",
            fontSize: 13,
          }}
        >
          <div style={{ textAlign: "right" }}>#</div>
          <div>Titel</div>
          <div style={{ textAlign: "right" }}>Totaal</div>
          <div style={{ textAlign: "right" }}>Laatst gezien</div>
        </div>

        <div style={S.divider} />

        {/* Rijen */}
        {rows.length === 0 ? (
          <div style={{ color: "#b3b3b3", padding: "10px 12px" }}>
            Geen data in dit tijdvenster.
          </div>
        ) : (
          rows.map((r, idx) => {
            const isOpen = openKey === r.key;
            return (
              <div key={r.key} style={{ borderBottom: "1px solid #1b1b1b" }}>
                {/* hoofd-rij */}
                <button
                  onClick={() => toggleRow(r.key)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr 120px 140px",
                    gap: 12,
                    padding: "8px 12px",
                    alignItems: "center",
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1f1f1f")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ textAlign: "right", color: "#b3b3b3" }}>{idx + 1}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      src={r.cover}
                      alt={r.title}
                      style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          lineHeight: 1.25,
                          color: "#fff",
                          transition: "color 0.2s",
                        }}
                      >
                        {r.title}
                        <span
                          style={{
                            marginLeft: 8,
                            color: "#b3b3b3",
                            fontWeight: 400,
                            fontSize: 12,
                          }}
                        >
                          {isOpen ? "▾" : "▸"}
                        </span>
                      </div>
                      <div style={{ color: "#b3b3b3", fontSize: 13 }}>{r.artist}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", color: "#b3b3b3" }}>{r.count}</div>
                  <div style={{ textAlign: "right", color: "#b3b3b3" }}>{r.lastSeen}</div>
                </button>

                {/* datumdetails */}
                {isOpen && (
                  <div
                    style={{
                      padding: "8px 12px 14px 68px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {r.dates
                      .slice()
                      .sort()
                      .map((d) => (
                        <span
                          key={d}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 999,
                            background: "#181818",
                            border: "1px solid #333",
                            color: "#b3b3b3",
                            fontSize: 12,
                          }}
                          title={`Datum: ${d}`}
                        >
                          {d}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
