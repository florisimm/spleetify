import React from "react";

export default function Calendar({ dates, selected, onSelect }) {
  if (!dates.length) return <p>Geen data gevonden.</p>;
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {dates.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          style={{
            background: d === selected ? "#1DB954" : "#222",
            border: "1px solid #333",
            color: d === selected ? "#000" : "#aaa",
            borderRadius: "6px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          {d}
        </button>
      ))}
    </div>
  );
}
