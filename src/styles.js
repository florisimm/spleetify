export const styles = {
  root: {
    background: "#121212", minHeight: "100vh", color: "white",
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif",
    display: "flex", flexDirection: "column",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 32px", borderBottom: "1px solid #222",
    position: "sticky", top: 0, zIndex: 100, background: "#121212",
  },
  logoDot: { width: 12, height: 12, background: "#1DB954", borderRadius: "50%", display: "inline-block" },
  title: { margin: 0, fontSize: 22, letterSpacing: 0.2 },
  navBtns: { display: "flex", gap: 12 },
  tabBtn: { background: "#181818", color: "white", border: "1px solid #333", padding: "10px 16px",
            borderRadius: 999, cursor: "pointer", fontSize: 15 },
  tabActive: { borderColor: "#1DB954", boxShadow: "0 0 0 1px #1DB954 inset", background: "#1DB95422" },

  hero: { background: "linear-gradient(180deg, #1f1f1f, #121212)", border: "1px solid #2b2b2b",
          borderRadius: 16, padding: "36px 44px", marginBottom: 24, width: "100%" },
  cta: { background: "#1DB954", color: "#000", border: "none", padding: "12px 22px",
         borderRadius: 999, cursor: "pointer", marginTop: 16, fontWeight: 700, fontSize: 15 },

  errorBox: { background: "#2a1616", border: "1px solid #5f2b2b", color: "#ffd9d9",
              padding: "10px 12px", borderRadius: 8, marginBottom: 12 },

  toolbar: { display: "flex", alignItems: "center", gap: 16, margin: "12px 12px 10px" },
  navBtn: { background: "#1DB954", color: "#000", border: "none", width: 40, height: 40,
            borderRadius: "50%", cursor: "pointer", fontWeight: 800, fontSize: 16 },
  dateBtn: { background: "#181818", color: "white", border: "1px solid #333",
             padding: "10px 14px", borderRadius: 10, cursor: "pointer", minWidth: 150, textAlign: "center" },
  popover: { position: "absolute", top: "calc(100% + 8px)", left: "50%",
             transform: "translateX(-50%)", zIndex: 200, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" },

  headerRow: { display: "grid", gridTemplateColumns: "56px 1fr 300px", alignItems: "center",
               gap: 12, padding: "8px 12px", color: "#b3b3b3", fontSize: 13, width: "100%" },
  thBtn: { background: "transparent", color: "#b3b3b3", border: "none", cursor: "pointer", fontSize: 13, textAlign: "right" },
  divider: { height: 1, background: "#222", margin: "0 12px 6px", width: "calc(100% - 24px)" },
  row: { display: "grid", gridTemplateColumns: "56px 1fr 300px", alignItems: "center", gap: 12,
         padding: "8px 12px", borderRadius: 8, transition: "background 120ms ease", width: "100%" },

  // Leaderboard
  leaderTable: { border: "1px solid #222", borderRadius: 12, overflow: "hidden", width: "100%" },
  leaderHeader: { display: "grid", gridTemplateColumns: "56px 1fr 120px", gap: 12, padding: "8px 12px", background: "#181818" },
  leaderRow: { display: "grid", gridTemplateColumns: "56px 1fr 120px", gap: 12, padding: "8px 12px" },
  legendDot: { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
  legendBtn: { background: "#181818", color: "white", border: "1px solid #333", padding: "6px 10px",
               borderRadius: 999, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  chip: { background: "#181818", color: "white", border: "1px solid #333", padding: "8px 12px", borderRadius: 999, cursor: "pointer" },
  chipActive: { borderColor: "#1DB954", boxShadow: "0 0 0 1px #1DB954 inset" },

  // Kalender
  calWrap: { background: "#181818", border: "1px solid #2b2b2b", borderRadius: 12, padding: 10 },
  calHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  calNavBtn: { background: "#181818", color: "white", border: "1px solid #333", width: 28, height: 28, borderRadius: 6, cursor: "pointer" },
  calGridHeader: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", color: "#b3b3b3", fontSize: 12, marginBottom: 6, gap: 4, textAlign: "center" },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 },
  calCell: { background: "#202020", border: "1px solid #2b2b2b", color: "white", aspectRatio: "1 / 1",
             borderRadius: 8, cursor: "pointer", position: "relative" },
  calCellActive: { outline: "2px solid #1DB954" },
  calCellDisabled: { visibility: "hidden" },
  calDot: { position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 6, width: 6, height: 6, background: "#1DB954", borderRadius: "50%" },
};
