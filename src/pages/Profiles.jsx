// src/pages/Profiles.jsx
import React, { useMemo, useState } from "react";
import useAnalyseData from "../hooks/useAnalyseData.js";
import { styles as S } from "../styles.js";

export default function Profiles() {
  const { dataByDate, dates, errors } = useAnalyseData();

  // 1. Alle profielen opbouwen uit alle dagen
  const profiles = useMemo(() => {
    const map = new Map();

    for (const d of dates || []) {
      const tracks = dataByDate[d] || [];
      for (const t of tracks) {
        const user = t.addedBy || "Onbekend";
        if (!map.has(user)) {
          map.set(user, { name: user, tracks: [] });
        }
        // track verrijken met datum
        map.get(user).tracks.push({ ...t, date: d });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const ca = a.tracks.length;
      const cb = b.tracks.length;
      if (cb !== ca) return cb - ca;
      return a.name.localeCompare(b.name, "nl");
    });
  }, [dataByDate, dates]);

  const [selectedName, setSelectedName] = useState(
    () => (profiles[0] && profiles[0].name) || null
  );
  const [selectedTrackKey, setSelectedTrackKey] = useState(null);

  const selectedProfile = useMemo(() => {
    if (!profiles.length) return null;
    return profiles.find((p) => p.name === selectedName) || profiles[0];
  }, [profiles, selectedName]);

  // 2. Top-nummers per profiel + datums per nummer
  const topTracks = useMemo(() => {
    if (!selectedProfile) return [];

    const byTrack = new Map();

    for (const t of selectedProfile.tracks) {
      const title = t.title || "";
      const artist = t.artist || "";
      const cover = t.cover || "";
      const date = t.date || "";

      const key = `${title.toLowerCase()}|||${artist.toLowerCase()}`;
      let cur = byTrack.get(key);
      if (!cur) {
        cur = {
          key,
          title,
          artist,
          cover,
          count: 0,
          dates: new Set(),
        };
        byTrack.set(key, cur);
      }
      cur.count += 1;
      if (date) cur.dates.add(date);
      if (!cur.cover && cover) cur.cover = cover;
    }

    return Array.from(byTrack.values())
      .map((t) => ({ ...t, dates: Array.from(t.dates).sort() }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.title.localeCompare(b.title, "nl");
      });
  }, [selectedProfile]);

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

      <h2 style={{ margin: "6px 12px 10px", color: "#fff" }}>Profielen</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px minmax(0, 1fr)",
          gap: 16,
          minHeight: 300,
        }}
      >
        {/* LINKERKANT – gebruikerslijst */}
        <div
          style={{
            background: "#111",
            borderRadius: 12,
            border: "1px solid #222",
            padding: 10,
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
            Gebruikers
          </div>

          {profiles.length === 0 ? (
            <div style={{ color: "#b3b3b3", fontSize: 13 }}>
              Nog geen profielen gevonden.
            </div>
          ) : (
            <div>
              {profiles.map((p) => {
                const active =
                  selectedProfile && p.name === selectedProfile.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      setSelectedName(p.name);
                      setSelectedTrackKey(null);
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      marginBottom: 4,
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: active
                        ? "rgba(29,185,84,0.25)"
                        : "transparent",
                      color: "#fff",
                    }}
                  >
                    <span>{p.name}</span>
                    <span style={{ fontSize: 12, color: "#b3b3b3" }}>
                      {p.tracks.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RECHTS – nummers en datums */}
        <div
          style={{
            background: "#111",
            borderRadius: 12,
            border: "1px solid #222",
            padding: 12,
          }}
        >
          {!selectedProfile ? (
            <div style={{ color: "#b3b3b3" }}>Selecteer een profiel links.</div>
          ) : (
            <>
              {/* header */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  {selectedProfile.name}
                </div>
                <div style={{ fontSize: 13, color: "#b3b3b3" }}>
                  {selectedProfile.tracks.length} nummers toegevoegd
                </div>
              </div>

              {/* tabel met nummers */}
              <div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        color: "#b3b3b3",
                        borderBottom: "1px solid #222",
                      }}
                    >
                      <th
                        style={{
                          width: 40,
                          textAlign: "right",
                          padding: "4px 6px",
                        }}
                      >
                        #
                      </th>
                      <th
                        style={{
                          width: 56,
                          padding: "4px 6px",
                          textAlign: "left",
                        }}
                      >
                        Cover
                      </th>
                      <th
                        style={{ textAlign: "left", padding: "4px 6px" }}
                      >
                        Titel
                      </th>
                      <th
                        style={{ textAlign: "left", padding: "4px 6px" }}
                      >
                        Artiest
                      </th>
                      <th
                        style={{
                          width: 60,
                          textAlign: "right",
                          padding: "4px 6px",
                        }}
                      >
                        Keer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTracks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: "8px 6px",
                            color: "#b3b3b3",
                          }}
                        >
                          Geen nummers voor dit profiel.
                        </td>
                      </tr>
                    ) : (
                      topTracks.map((t, idx) => (
                        <React.Fragment key={t.key}>
                          {/* hoofd-rij */}
                          <tr
                            onClick={() =>
                              setSelectedTrackKey((cur) =>
                                cur === t.key ? null : t.key
                              )
                            }
                            style={{
                              borderBottom: "1px solid #181818",
                              cursor: "pointer",
                            }}
                          >
                            <td
                              style={{
                                textAlign: "right",
                                padding: "4px 6px",
                                color: "#b3b3b3",
                              }}
                            >
                              {idx + 1}
                            </td>
                            <td style={{ padding: "4px 6px" }}>
                              <img
                                src={t.cover}
                                alt={t.title}
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 4,
                                  objectFit: "cover",
                                  background: "#222",
                                  display: "block",
                                }}
                              />
                            </td>
                            <td
                              style={{
                                padding: "4px 6px",
                                color: "#fff",
                              }}
                              title={t.title}
                            >
                              {t.title}
                            </td>
                            <td
                              style={{
                                padding: "4px 6px",
                                color: "#b3b3b3",
                              }}
                              title={t.artist}
                            >
                              {t.artist}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                padding: "4px 6px",
                                color: "#fff",
                              }}
                            >
                              {t.count}
                            </td>
                          </tr>

                          {/* uitschuif-rij met datum-pills */}
                          {selectedTrackKey === t.key && (
                            <tr>
                              <td
                                colSpan={5}
                                style={{
                                  padding: "6px 8px 10px",
                                  background: "#151515",
                                  borderBottom: "1px solid #181818",
                                }}
                              >
                                {t.dates && t.dates.length ? (
                                  <>
                                    <div
                                      style={{
                                        fontSize: 12,
                                        color: "#b3b3b3",
                                        marginBottom: 4,
                                      }}
                                    >
                                      Toegevoegd op:
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 6,
                                      }}
                                    >
                                      {t.dates.map((d) => (
                                        <span
                                          key={d}
                                          style={{
                                            padding: "3px 10px",
                                            borderRadius: 999,
                                            background: "#181818",
                                            border:
                                              "1px solid #2a2a2a",
                                            fontSize: 12,
                                            color: "#fff",
                                          }}
                                        >
                                          {d}
                                        </span>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <div
                                    style={{
                                      fontSize: 12,
                                      color: "#b3b3b3",
                                    }}
                                  >
                                    Geen dagen gevonden voor dit nummer.
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "#b3b3b3",
                }}
              >
                Klik op een nummer om te zien op welke dagen dit nummer is
                toegevoegd.
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
