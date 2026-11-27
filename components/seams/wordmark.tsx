import Image from "next/image";
import type { CSSProperties } from "react";

const motifs = ["blocks", "checks", "sunburst", "waves", "confetti", "static", "steps", "zebra", "rings", "halftone", "split", "grid", "lightning"] as const;
const palette = ["#82efa1", "#738cff", "#ff596e", "#ffcc32", "#c296fb", "#5cdbed", "#fff2db", "#f59244"] as const;

export function SeamsWordmark({ broadcast }: { broadcast: boolean }) {
  return (
    <h1 className="seams-wordmark-title" data-wordmark={broadcast ? "broadcast" : "storefront"}>
      <span className="sr-only">Seams Familiar</span>
      {broadcast ? (
        <span className="seams-broadcast" aria-hidden="true">
          {["SEAMS", "FAMILIAR"].map((word, wordIndex) => (
            <span key={word} className="seams-broadcast-word">
              {Array.from(word, (letter, index) => {
                const position = wordIndex === 0 ? index : index + 5;
                const artwork = {
                  "--face": palette[(position + wordIndex) % palette.length],
                  "--pattern": palette[(position * 3 + 4) % palette.length],
                  "--accent-mark": palette[(position + 5) % palette.length],
                } as CSSProperties;
                return <span key={position} className="seams-broadcast-letter" data-motif={motifs[position]} style={artwork}>{letter}</span>;
              })}
            </span>
          ))}
        </span>
      ) : (
        <Image src="/assets/seams/wordmarks/storefront-print.svg" className="seams-shop-sign" alt="" width={789} height={101} priority />
      )}
    </h1>
  );
}
