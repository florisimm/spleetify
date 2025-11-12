import React, { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Analyse from "./pages/Analyse.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import SongLeaderboard from "./pages/SongLeaderboard.jsx";
import { styles as S } from "./styles.js";

export default function App() {
  const [page, setPage] = useState(() => {
    const saved = Number(localStorage.getItem("blend_tab"));
    return Number.isFinite(saved) ? saved : 0;
  });

  // 🧠 Titel automatisch aanpassen
  useEffect(() => {
    const titles = [
      "Spleetify — Home",
      "Spleetify — Laatste Blend",
      "Spleetify — Top bijdragers",
      "Spleetify — Top liedjes",
    ];
    document.title = titles[page] || "Spotify Blend";
    localStorage.setItem("blend_tab", String(page));
  }, [page]);

  const tabs = ["Home", "Laatste Blend", "Top bijdragers", "Top bijdragers"];

  return (
    <div style={S.root}>
      <header style={S.header}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => setPage(0)}
          title="Ga naar Home"
        >
          <span style={S.logoDot} />
          <h1 style={S.title}>Spleetify Blend</h1>
        </div>

        <nav style={S.navBtns}>
          {tabs.map((label, i) => (
            <button
              key={label}
              onClick={() => setPage(i)}
              style={{ ...S.tabBtn, ...(page === i ? S.tabActive : null) }}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ padding: "16px 24px" }}>
        {page === 0 && (
          <Home
            goAnalyse={() => setPage(1)}
            goLeaderboard={() => setPage(2)}
            goSongLeaderboard={() => setPage(3)}
          />
        )}
        {page === 1 && <Analyse goHome={() => setPage(0)} />}
        {page === 2 && <Leaderboard />}
        {page === 3 && <SongLeaderboard />}
        {page >= 4 && <div style={{ color: "#b3b3b3" }}>Pagina {page} — nog leeg.</div>}
      </main>
    </div>
  );
}
