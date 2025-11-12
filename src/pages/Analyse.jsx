// src/pages/Analyse.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import useAnalyseData from "../hooks/useAnalyseData.js";
import Calendar from "../components/Calendar.jsx";
import { styles as S } from "../styles.js";
import { fmt, shiftDays, last } from "../utils/date.js";

export default function Analyse({ goHome }) {
  const { dataByDate, dates, errors } = useAnalyseData();

  // start op laatste beschikbare dag
  const [selectedDate, setSelectedDate] = useState(last(dates) || fmt(new Date()));

  // pijlen (altijd ±1 dag)
  const prevDate = () => setSelectedDate((d) => shiftDays(d || fmt(new Date()), -1));
  const nextDate = () => setSelectedDate((d) => shiftDays(d || fmt(new Date()), +1));

  // kalender popover
  const [openCal, setOpenCal] = useState(false);
  const popRef = useRef(null);
  useEffect(() => {
    const onClick = (e) => {
      if (openCal && popRef.current && !popRef.current.contains(e.target)) setOpenCal(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [openCal]);

  // toetsen
  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === "ArrowLeft") prevDate();
      if (ev.key === "ArrowRight") nextDate();
      if (ev.key === "Escape") setOpenCal(false);
      if (ev.key === "Home") goHome?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // dynamische titel
  useEffect(() => {
    document.title = `Spotify Blend — Laatste Blend (${selectedDate})`;
  }, [selectedDate]);

  // sorteer-state
  const [sort, setSort] = useState({ col: "#", dir: "asc" });
  const toggleSort = (col) =>
    setSort((s) =>
      s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: "asc" }
    );

  // sorteren + indexering
  const songs = useMemo(() => {
    const arr = (dataByDate[selectedDate] || []).map((t, i) => ({
      ...t,
      _idx: i + 1,
    }));
    const dir = sort.dir === "asc" ? 1 : -1;
    if (sort.col === "#") return arr.sort((a, b) => (a._idx - b._idx) * dir);
    if (sort.col === "Titel") {
      return arr.sort((a, b) => {
        const A = (a.title || "").toLowerCase();
        const B = (b.title || "").toLowerCase();
        if (A !== B) return (A < B ? -1 : 1) * dir;
        const Aa = (a.artist || "").toLowerCase();
        const Bb = (b.artist || "").toLowerCase();
        return Aa === Bb ? 0 : (Aa < Bb ? -1 : 1) * dir;
      });
    }
    if (sort.col === "Door") {
      return arr.sort((a, b) => {
        const A = (a.addedBy || "").toLowerCase();
        const B = (b.addedBy || "").toLowerCase();
        return A === B ? 0 : (A < B ? -1 : 1) * dir;
      });
    }
    return arr;
  }, [dataByDate, selectedDate, sort]);

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

      {/* Toolbar: pijlen + datumknop (opent kalender) */}
      <div style={S.toolbar}>
        <button onClick={prevDate} style={S.navBtn} title="Vorige dag">
          ⟵
        </button>

        <div style={{ position: "relative" }} ref={popRef}>
          <button
            style={S.dateBtn}
            onClick={() => setOpenCal((v) => !v)}
            aria-expanded={openCal}
            aria-haspopup="dialog"
            title="Kies datum"
          >
            {selectedDate}
          </button>
          {openCal && (
            <div style={S.popover}>
              <Calendar
                value={selectedDate}
                availableDates={dates}
                onChange={(val) => {
                  setSelectedDate(val);
                  setOpenCal(false);
                }}
              />
            </div>
          )}
        </div>

        <button onClick={nextDate} style={S.navBtn} title="Volgende dag">
          ⟶
        </button>
      </div>

      {/* Tabelkop met sorteerknoppen */}
      <div style={{ width: "100%", marginTop: 6 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                color: "#b3b3b3",
                fontSize: 12,
                textAlign: "left",
                borderBottom: "1px solid #222",
              }}
            >
              <th style={{ width: "6%", padding: "8px 0" }}>
                <button
                  onClick={() => toggleSort("#")}
                  style={thBtn}
                  title="Sorteer op positie"
                >
                  # {sort.col === "#" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th style={{ width: "64%", padding: "8px 0" }}>
                <button
                  onClick={() => toggleSort("Titel")}
                  style={{ ...thBtn, textAlign: "left" }}
                  title="Sorteer op titel"
                >
                  Titel {sort.col === "Titel" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
              <th style={{ width: "30%", padding: "8px 0" }}>
                <button
                  onClick={() => toggleSort("Door")}
                  style={{ ...thBtn, textAlign: "left" }}
                  title="Sorteer op toevoegers"
                >
                  Door wie toegevoegd {sort.col === "Door" ? (sort.dir === "asc" ? "▲" : "▼") : ""}
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {!(songs?.length > 0) ? (
              <tr>
                <td colSpan={3} style={{ color: "#b3b3b3", padding: "14px 0" }}>
                  Geen data voor deze dag.
                </td>
              </tr>
            ) : (
              songs.map((track, i) => (
                <tr
                  key={`${track.title}-${track.artist}-${i}`}
                  style={{
                    borderBottom: "1px solid #181818",
                    height: 78, // grotere rijhoogte
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1b1b1b")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* # */}
                  <td style={{ color: "#b3b3b3", fontSize: 13, textAlign: "center" }}>
                    {track._idx}
                  </td>

                  {/* Titel + artiest + cover (compact bij elkaar) */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <img
                        src={track.cover}
                        alt={track.title}
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 4,
                          objectFit: "cover",
                          flexShrink: 0,
                          background: "#222",
                        }}
                        onError={(e) => {
                          // laat oorspronkelijke (of fallback) staan als het laden faalt
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 18.5,
                            lineHeight: "1.3em",
                          }}
                          title={track.title}
                        >
                          {track.title}
                        </span>
                        <span
                          style={{ color: "#b3b3b3", fontSize: 15 }}
                          title={track.artist}
                        >
                          {track.artist}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Toevoeger (dichterbij kolom 2) */}
                  <td style={{ color: "#b3b3b3", fontSize: 16, whiteSpace: "nowrap" }}>
                    {track.addedBy || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* kleine inline stijlhelpers voor de kopknoppen */
const thBtn = {
  background: "transparent",
  color: "#b3b3b3",
  border: "none",
  cursor: "pointer",
  fontSize: 12,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
};
