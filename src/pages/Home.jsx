// src/pages/Home.jsx
import React, { useMemo } from "react";
import useAnalyseData from "../hooks/useAnalyseData.js";
import { styles as S } from "../styles.js";

// Kleine helper
const plural = (n, sgl, pl) => `${n} ${n === 1 ? sgl : pl}`;

export default function Home({ goAnalyse, goLeaderboard, goSongLeaderboard }) {
  const { dataByDate, perDayUserCounts, dates } = useAnalyseData();

  // 1) Laatste dag
  const lastDate = dates.length ? dates[dates.length - 1] : null;
  const lastTracks = lastDate ? dataByDate[lastDate] || [] : [];
  const lastCount = lastTracks.length;

  // 2) All-time totals per gebruiker
  const contributorTotals = useMemo(() => {
    const acc = {};
    for (const d of Object.keys(perDayUserCounts)) {
      const row = perDayUserCounts[d] || {};
      for (const u of Object.keys(row)) {
        acc[u] = (acc[u] || 0) + (row[u] || 0);
      }
    }
    return Object.entries(acc).sort((a, b) => b[1] - a[1]);
  }, [perDayUserCounts]);

  // 3) Meest voorkomende track all-time
  const topSong = useMemo(() => {
    const map = new Map();
    for (const d of Object.keys(dataByDate)) {
      for (const t of dataByDate[d] || []) {
        const key = `${(t.title || "").toLowerCase()}|||${(
          t.artist || ""
        ).toLowerCase()}`;
        const cur =
          map.get(key) || {
            title: t.title || "",
            artist: t.artist || "",
            cover: t.cover || "",
            count: 0,
          };
        cur.count += 1;
        if (!cur.cover && t.cover) cur.cover = t.cover;
        map.set(key, cur);
      }
    }
    const arr = Array.from(map.values()).sort((a, b) => b.count - a.count);
    return arr[0] || null;
  }, [dataByDate]);

  return (
    <section>
      {/* HERO */}
      <div style={{ ...S.hero, textAlign: "left" }}>
        <h2 style={{ fontSize: 34, margin: 0, color: "#fff" }}>
          Jullie Blend-analyses
        </h2>
        <p style={{ color: "#b3b3b3", marginTop: 8 }}>
          Voor jou en je vrienden. Bekijk per dag de blend,
          volg trends en ontdek jullie meest iconische tracks.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={S.cta} onClick={goAnalyse}>
            Naar Analyse
          </button>
          <button
            style={{
              ...S.cta,
              background: "#181818",
              color: "#fff",
              border: "1px solid #333",
            }}
            onClick={goLeaderboard}
          >
            Top bijdragers
          </button>
          <button
            style={{
              ...S.cta,
              background: "#181818",
              color: "#fff",
              border: "1px solid #333",
            }}
            onClick={goSongLeaderboard}
          >
            Top liedjes
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Laatste analyse */}
        <div style={cardStyle}>
          <div style={cardHead}>Laatste Blend</div>
          <div style={cardValue}>{lastDate || "—"}</div>
          <div style={cardSub}>
            {lastDate
              ? plural(lastCount, "nummer", "nummers")
              : "Nog geen bestanden gevonden"}
          </div>
          <div style={cardActions}>
            <button style={miniBtn} onClick={goAnalyse}>
              Open laatste blend
            </button>
          </div>
        </div>

        {/* Top bijdragers */}
        <div style={cardStyle}>
          <div style={cardHead}>Top bijdragers (all-time)</div>
          {contributorTotals.length ? (
            <>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "10px 0 0",
                  display: "grid",
                  gap: 8,
                }}
              >
                {contributorTotals.slice(0, 3).map(([u, c], i) => (
                  <li
                    key={u}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          ...rankDot,
                          background: rankColors[i] || "#90A4AE",
                        }}
                      />
                      <span style={{ color: "#fff" }}>{u}</span>
                    </div>
                    <span style={{ color: "#b3b3b3" }}>{c}</span>
                  </li>
                ))}
              </ul>
              <div style={cardActions}>
                <button style={miniBtn} onClick={goLeaderboard}>
                  Volledige ranglijst
                </button>
              </div>
            </>
          ) : (
            <div style={cardSub}>Nog geen bijdragers gevonden.</div>
          )}
        </div>

        {/* Meest voorkomende track */}
        <div style={cardStyle}>
          <div style={cardHead}>Meest voorkomende track</div>
          {topSong ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 10,
              }}
            >
              <img
                src={topSong.cover}
                alt={topSong.title}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 6,
                  objectFit: "cover",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ color: "#fff", fontWeight: 700 }}>
                  {topSong.title}
                </div>
                <div style={{ color: "#b3b3b3", fontSize: 13 }}>
                  {topSong.artist}
                </div>
                <div
                  style={{
                    color: "#1DB954",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {plural(topSong.count, "keer", "keer")}
                </div>
              </div>
            </div>
          ) : (
            <div style={cardSub}>Nog geen tracks geparsed.</div>
          )}
          <div style={cardActions}>
            <button style={miniBtn} onClick={goSongLeaderboard}>
              Bekijk liedjes
            </button>
          </div>
        </div>
      </div>

      {/* Vrienden & bijdragers */}
      <div style={{ marginTop: 8 }}>
        <div
          style={{
            color: "#fff",
            fontWeight: 700,
            margin: "0 0 10px 2px",
          }}
        >
          Vrienden & bijdragers
        </div>
        {contributorTotals.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: 12,
            }}
          >
            {contributorTotals.map(([u, c]) => (
              <div key={u} style={friendCard}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div style={avatar}>
                    {(u || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ color: "#fff", fontWeight: 700 }}>
                      {u}
                    </div>
                    <div
                      style={{
                        color: "#b3b3b3",
                        fontSize: 12,
                      }}
                    >
                      {plural(c, "bijdrage", "bijdragen")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#b3b3b3" }}>
            Nog niemand heeft bijgedragen.
          </div>
        )}
      </div>

      {/* Spotify embed */}
      <div style={{ marginTop: 28 }}>
        <div
          style={{
            color: "#fff",
            fontWeight: 700,
            margin: "0 0 8px 2px",
          }}
        >
          Jullie Blend op Spotify
        </div>
        <iframe
          title="Spotify Blend"
          data-testid="embed-iframe"
          style={{ borderRadius: 12 }}
          src="https://open.spotify.com/embed/playlist/37i9dQZF1EJGFQjH16a5QH?utm_source=generator"
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <footer
        style={{
          textAlign: "center",
          color: "#555",
          padding: "16px 0",
          marginTop: 22,
        }}
      >
        v4.05 — Blend Viewer
      </footer>
    </section>
  );
}

/* lokale stijlen */
const cardStyle = {
  background: "#181818",
  border: "1px solid #222",
  borderRadius: 12,
  padding: 16,
  minHeight: 140,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const cardHead = { color: "#b3b3b3", fontSize: 15, letterSpacing: 0.2 };
const cardValue = {
  color: "#fff",
  fontSize: 22,
  fontWeight: 800,
  marginTop: 6,
};
const cardSub = { color: "#b3b3b3", marginTop: 12, fontSize: 14 };
const cardActions = { marginTop: 14, display: "flex", gap: 8 };

const miniBtn = {
  background: "#181818",
  color: "#fff",
  border: "1px solid #333",
  padding: "8px 12px",
  borderRadius: 999,
  cursor: "pointer",
  fontSize: 13,
};

const rankDot = { width: 10, height: 10, borderRadius: "50%" };
const rankColors = [
  "#1DB954",
  "#4DD0E1",
  "#FFB74D",
  "#E57373",
  "#81C784",
  "#BA68C8",
];

const friendCard = {
  background: "#181818",
  border: "1px solid #222",
  borderRadius: 12,
  padding: 12,
};

const avatar = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#222",
  color: "#b3b3b3",
  display: "grid",
  placeItems: "center",
  fontSize: 12,
  border: "1px solid #333",
};
