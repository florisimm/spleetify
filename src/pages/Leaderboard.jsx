import React, { useMemo, useState } from "react";
import useAnalyseData from "../hooks/useAnalyseData.js";
import { styles as S } from "../styles.js";
import { fmt, parse, last, safeMax } from "../utils/date.js";

export default function Leaderboard() {
  const { perDayUserCounts, dates, errors } = useAnalyseData();

  // all-time totals
  const totals = useMemo(() => {
    const acc = {};
    for (const d of Object.keys(perDayUserCounts)) {
      const row = perDayUserCounts[d] || {};
      for (const u of Object.keys(row)) acc[u] = (acc[u] || 0) + row[u];
    }
    return acc;
  }, [perDayUserCounts]);

  const usersSorted = useMemo(
    () => Object.entries(totals).sort((a, b) => b[1] - a[1]),
    [totals]
  );

  // tijdvenster
  const [range, setRange] = useState("30"); // "30" | "90" | "all"
  const allDates = Array.isArray(dates) ? dates : [];
  const lastDate = last(allDates) || fmt(new Date());
  const cutoff = range === "all" ? "0000-01-01" : fmt(new Date(parse(lastDate).getTime() - Number(range) * 86400000));
  const shownDates = allDates.filter((d) => d >= cutoff);

  // series
  const users = usersSorted.map(([u]) => u);
  const [hidden, setHidden] = useState({});
  const toggleUser = (u) => setHidden((h) => ({ ...h, [u]: !h[u] }));

  const series = users.map((u) => ({
    user: u,
    values: shownDates.map((d) => (perDayUserCounts?.[d]?.[u] ?? 0)),
  }));

  const maxY = safeMax(series.map((s) => safeMax(s.values, 0)), 1);

  // chart dims
  const W = 1000, H = 320, M = { l: 50, r: 12, t: 10, b: 28 };
  const innerW = W - M.l - M.r, innerH = H - M.t - M.b;
  const x = (i) => (shownDates.length <= 1 ? innerW / 2 : (i * innerW) / (shownDates.length - 1));
  const y = (v) => innerH - (v / maxY) * innerH;

  const palette = ["#1DB954","#4DD0E1","#FFB74D","#E57373","#81C784","#BA68C8","#64B5F6","#FFD54F","#A1887F","#90A4AE"];

  return (
    <section>
      {!!errors.length && (
        <div style={S.errorBox}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Fouten</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <h2 style={{ margin: "6px 12px 10px" }}>Leaderboard (all-time)</h2>

      {/* Ranglijst */}
      <div style={S.leaderTable}>
        <div style={S.leaderHeader}>
          <div style={{ width: 56, textAlign: "right" }}>#</div>
          <div style={{ flex: 1 }}>Gebruiker</div>
          <div style={{ width: 120, textAlign: "right" }}>Totaal</div>
        </div>
        <div style={S.divider} />
        {usersSorted.length === 0 ? (
          <div style={{ color: "#b3b3b3", padding: "10px 12px" }}>Nog geen samenvattingen gevonden.</div>
        ) : (
          usersSorted.map(([u, c], i) => (
            <div key={u} style={S.leaderRow}>
              <div style={{ width: 56, textAlign: "right", color: "#b3b3b3" }}>{i + 1}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...S.legendDot, background: palette[i % palette.length] }} />
                <div>{u}</div>
              </div>
              <div style={{ width: 120, textAlign: "right", color: "#b3b3b3" }}>{c}</div>
            </div>
          ))
        )}
      </div>

      {/* Tijdvenster */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "18px 12px 8px" }}>
        <span style={{ color: "#b3b3b3" }}>Per dag</span>
        {["30","90","all"].map((r)=>(
          <button key={r} onClick={()=>setRange(r)} style={{ ...S.chip, ...(range===r?S.chipActive:null) }}>
            {r==="all" ? "All-time" : `${r} dagen`}
          </button>
        ))}
      </div>

      {/* Chart */}
      {shownDates.length === 0 || users.length === 0 ? (
        <div style={{ color: "#b3b3b3", margin: "12px 12px" }}>Geen data in dit tijdvenster.</div>
      ) : (
        <div style={{ overflowX: "auto", padding: "8px 0" }}>
          <svg width={W} height={H} style={{ background: "#121212", border: "1px solid #222", borderRadius: 12 }}>
            <g transform={`translate(${M.l},${M.t})`}>
              {/* Y-grid + labels */}
              {[0,0.25,0.5,0.75,1].map((t,i)=>{
                const yy = y(t*maxY), val = Math.round(t*maxY);
                return (
                  <g key={i}>
                    <line x1={0} y1={yy} x2={innerW} y2={yy} stroke="#222"/>
                    <text x={-8} y={yy+4} fill="#b3b3b3" fontSize="10" textAnchor="end">{val}</text>
                  </g>
                );
              })}

              {/* X-labels (max 12) */}
              {shownDates.map((d,i)=>{
                const skip = Math.max(1, Math.ceil(shownDates.length/12));
                if (i % skip !== 0 && i !== shownDates.length - 1) return null;
                return <text key={d} x={x(i)} y={innerH+18} fill="#b3b3b3" fontSize="10" textAnchor="middle">{d.slice(5)}</text>;
              })}

              {shownDates.length === 1 ? (
                // 1 dag → kleine bars per gebruiker
                (() => {
                  const cx = x(0);
                  const visible = series.filter(s => !hidden[s.user]);
                  const gap = 8, w = 22;
                  const totalW = visible.length * w + Math.max(0, visible.length - 1) * gap;
                  const xStart = cx - totalW/2;
                  return (
                    <>
                      {visible.map((s, i) => {
                        const v = s.values[0] || 0;
                        const h = innerH - y(v);
                        const xi = xStart + i*(w+gap);
                        return (
                          <g key={s.user}>
                            <rect x={xi} y={y(v)} width={w} height={h} fill={palette[i % palette.length]} rx="4" />
                            <text x={xi + w/2} y={y(v) - 6} fill="#b3b3b3" fontSize="10" textAnchor="middle">{v}</text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()
              ) : (
                // ≥2 dagen → lijnen + markers
                <>
                  {series.map((s, si) => {
                    if (hidden[s.user]) return null;
                    const path = s.values.map((v,i)=>`${i===0?"M":"L"} ${x(i)} ${y(v)}`).join(" ");
                    return (
                      <g key={s.user}>
                        <path d={path} fill="none" stroke={palette[si % palette.length]} strokeWidth="2.2" />
                        {s.values.map((v,i)=>(
                          <circle key={i} cx={x(i)} cy={y(v)} r={3.5}
                                  fill={palette[si % palette.length]} stroke="#121212" strokeWidth="1" />
                        ))}
                      </g>
                    );
                  })}
                </>
              )}
            </g>
          </svg>
        </div>
      )}

      {/* Legenda */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
        {users.map((u, i) => (
          <button key={u} onClick={()=>toggleUser(u)}
            style={{ ...S.legendBtn, opacity: hidden[u] ? 0.45 : 1, borderColor: palette[i % palette.length] + "66" }}
            title={hidden[u] ? "Klik om te tonen" : "Klik om te verbergen"}>
            <span style={{ ...S.legendDot, background: palette[i % palette.length] }} />
            {u}
          </button>
        ))}
      </div>
    </section>
  );
}
