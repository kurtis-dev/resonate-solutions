"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

const motifs = ["blocks", "checks", "sunburst", "waves", "confetti", "static", "steps", "zebra", "rings", "halftone", "split", "grid", "lightning"] as const;
const palettes = {
  "Color blocks": ["#82efa1", "#738cff", "#ff596e", "#ffcc32", "#c296fb", "#5cdbed", "#fff2db", "#f59244"],
  "Purple and cream": ["#fdf1d7", "#a873ec", "#6941b1", "#e0bfff", "#fbbbc8", "#fffdf5", "#7650ca", "#98dbc9"],
  "Neon and ink": ["#dcfb24", "#ff51a1", "#99fce8", "#fff3d8", "#c09bff", "#7e9aff", "#fa8b34", "#a2da5e"],
} as const;
type PaletteName = keyof typeof palettes;

export function WordmarkPreview() {
  const [wordmark, setWordmark] = useState<"shop" | "broadcast">("shop");
  const [paletteName, setPaletteName] = useState<PaletteName>("Color blocks");
  const palette = palettes[paletteName];

  return (
    <div data-wordmark={wordmark}>
      <h1 className="seams-preview-title">
        <span className="sr-only">Seams Familiar</span>
        {wordmark === "shop" ? (
          <Image src="/assets/seams/preview/storefront-print.svg" className="seams-shop-sign" alt="" width={789} height={101} priority />
        ) : (
          <span className="seams-broadcast" aria-hidden="true">
            {["SEAMS", "FAMILIAR"].map((word, wordIndex) => (
              <span key={word} className="seams-broadcast-word">
                {Array.from(word, (letter, index) => {
                  const position = wordIndex === 0 ? index : index + 5;
                  const size = palette.length;
                  const artwork = {
                    "--face": palette[(position + wordIndex) % size],
                    "--pattern": palette[(position * 3 + 4) % size],
                    "--accent-mark": palette[(position + 5) % size],
                  } as CSSProperties;
                  return <span key={position} className="seams-broadcast-letter" data-motif={motifs[position]} style={artwork}>{letter}</span>;
                })}
              </span>
            ))}
          </span>
        )}
      </h1>
      <div className="seams-preview-caption">
        <p>Vintage worth wearing again.</p>
        <details className="seams-preview-disclosure">
          <summary>Design preview</summary>
          <div className="seams-preview-controls">
            <div className="seams-preview-options" role="group" aria-label="Wordmark preview">
              <button type="button" aria-pressed={wordmark === "shop"} onClick={() => setWordmark("shop")}>Storefront</button>
              <button type="button" aria-pressed={wordmark === "broadcast"} onClick={() => setWordmark("broadcast")}>Music TV</button>
            </div>
            {wordmark === "broadcast" ? (
              <label>Palette <select value={paletteName} onChange={(event) => setPaletteName(event.target.value as PaletteName)}>
                {Object.keys(palettes).map((name) => <option key={name}>{name}</option>)}
              </select></label>
            ) : null}
          </div>
        </details>
      </div>
    </div>
  );
}
