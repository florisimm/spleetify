// src/components/GenrePieChart.jsx
import React, { useMemo } from "react";

const COLORS = [
  "#1db954",
  "#0099ff",
  "#ff884d",
  "#ff4d4d",
  "#b84dff",
  "#ffe14d",
  "#4dd2ff",
  "#4dff88",
  "#ff4da6",
  "#4d88ff",
];

export default function GenrePieChart({ tracks }) {
  const data = useMemo(() => {
    if (!Array.isArray(tracks)) return [];

    const counter = {};

    for (const t of tracks) {
      if (!t || !t.genre) continue;

      const genres = String(t.genre)
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);

      for (const g of genres) {
        counter[g] = (counter[g] || 0) + 1;
      }
    }

    const arr = Object.entries(counter).map(([name, value]) => ({
      name,
      value,
    }));

    arr.sort((a, b) => b.value - a.value);

    return arr;
  }, [tracks]);

  if (!data.length) {
    return (
      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          color: "#b3b3b3",
        }}
      >
        Geen genres gevonden voor dit profiel.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value));

  return (
    <div
      style={{
        marginTop: 16,
        paddingTop: 8,
        borderTop: "1px solid #202020",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#fff",
          marginBottom: 8,
        }}
      >
        Genres
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {data.map((g, i) => {
          const color = COLORS[i % COLORS.length];
          const widthPct = max > 0 ? (g.value / max) * 100 : 0;

          return (
            <div key={g.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#fff",
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: color,
                    }}
                  />
                  <span>{g.name}</span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "#b3b3b3",
                  }}
                >
                  {g.value}
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: 6,
                  borderRadius: 999,
                  background: "#1b1b1b",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: "100%",
                    background: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
