"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw, SearchCheck } from "lucide-react";
import { classifyGarment } from "@/lib/fieldwear/listing-model";
import { matchesScoutFit, type ScoutPreferences } from "@/lib/fieldwear/preferences";

type Finding = { label: string; points: number };

const ageSignals = [
  ["union made", 2, "Union-made label claim"],
  ["union label", 2, "Union label pictured"],
  ["made in usa", 1, "Made in USA claim"],
  ["talon", 1, "Talon hardware"],
  ["scovill", 1, "Scovill hardware"],
  ["ideal zipper", 1, "Ideal zipper"],
  ["vintage", 0, "Seller says vintage—still needs proof"],
] as const;

const qualitySignals = [
  ["100% wool", 2, "100% wool"],
  ["100% cotton", 1, "100% cotton"],
  ["selvedge", 2, "Selvedge construction"],
  ["chain stitch", 1, "Chain stitching"],
  ["flat felled", 2, "Flat-felled seams"],
  ["double knee", 1, "Double-knee construction"],
  ["reinforced", 1, "Reinforced construction"],
  ["heavyweight", 1, "Heavyweight fabric"],
  ["chamois", 1, "Chamois cloth"],
  ["duck canvas", 1, "Duck canvas"],
  ["canvas", 1, "Canvas fabric"],
] as const;

const concernSignals = [
  ["dry rot", -35, "Dry rot mentioned"],
  ["moth", -18, "Possible moth damage"],
  ["large hole", -15, "Large hole"],
  ["stain", -6, "Staining disclosed"],
  ["polyester", -3, "Check fabric weight; polyester alone is not a rejection"],
  ["reproduction", -9, "Modern reproduction"],
  ["print on demand", -18, "Print-on-demand item"],
  ["graphic tee", -16, "Graphic tee"],
  ["no returns", -4, "No returns"],
  ["rare", -1, "‘Rare’ is price language, not quality evidence"],
  ["archive", -1, "‘Archive’ is price language, not age proof"],
  ["gorpcore", -1, "‘Gorpcore’ often signals a trend premium"],
  ["y2k", -1, "‘Y2K’ often signals a trend premium"],
  ["deadstock", -1, "Deadstock can still have storage damage"],
] as const;

function inspect(text: string, preferences: ScoutPreferences) {
  const haystack = text.toLowerCase();
  const ageEvidence: Finding[] = [];
  const qualityEvidence: Finding[] = [];
  const concerns: Finding[] = [];

  for (const [term, points, label] of ageSignals) {
    if (haystack.includes(term)) ageEvidence.push({ label, points });
  }

  for (const [term, points, label] of qualitySignals) {
    if (haystack.includes(term)) {
      qualityEvidence.push({ label, points });
    }
  }
  for (const [term, points, label] of concernSignals) {
    if (haystack.includes(term)) {
      concerns.push({ label, points });
    }
  }

  const garmentKind = classifyGarment({ title: text });
  const fit = matchesScoutFit({ title: text, garmentKind }, preferences);
  if (/\b(19[5-9]\d|200[0-5]|19[5-9]0'?s|2000'?s)\b/.test(haystack)) ageEvidence.push({ label: "Specific older year or decade claim", points: 1 });

  const ageScore = Math.min(4, ageEvidence.reduce((sum, item) => sum + item.points, 0));
  const qualityScore = Math.min(4, qualityEvidence.reduce((sum, item) => sum + item.points, 0));
  const evidenceScore = ageScore + qualityScore;
  const severeConcern = concerns.some((item) => item.points <= -15);

  return { ageScore, qualityScore, evidenceScore, ageEvidence, qualityEvidence, concerns, fit, severeConcern };
}

export function ListingChecker({ preferences }: { preferences: ScoutPreferences }) {
  const [details, setDetails] = useState("");
  const [checked, setChecked] = useState(false);
  const result = useMemo(() => inspect(details, preferences), [details, preferences]);
  const verdict = result.severeConcern ? "Probably pass" : result.evidenceScore >= 6 && result.fit ? "Worth a closer look" : "Keep it open—ask for evidence";

  function reset() {
    setDetails("");
    setChecked(false);
  }

  return (
    <section id="check" className="mt-8 scroll-mt-20 overflow-hidden rounded-[28px] border border-black/8 bg-[var(--card)] shadow-[0_14px_45px_rgba(44,38,27,.07)]">
      <div className="grid lg:grid-cols-[.82fr_1.18fr]">
        <div className="bg-[var(--pine)] p-5 text-[var(--paper)] sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d9d5b9]">Listing screen</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Check the evidence before you buy.</h2>
          <p className="mt-3 text-sm leading-6 text-[#dedfce]">Paste the title and description from any marketplace. This text screen separates age clues from construction clues, flags risky wording, and tells you what the seller still needs to prove.</p>
          <div className="mt-6 rounded-2xl border border-white/12 bg-black/10 p-4 text-xs leading-5 text-[#dedfce]"><strong className="text-white">It will not authenticate a garment.</strong> Confirm labels, measurements, condition, and seller photos on the original listing.</div>
        </div>

        <div className="p-5 sm:p-8">
          <label className="block text-xs font-bold uppercase tracking-[.14em] text-[var(--muted-ink)]" htmlFor="listing-details">Listing title and description</label>
          <textarea id="listing-details" value={details} onChange={(event) => { setDetails(event.target.value); setChecked(false); }} placeholder="Example: Vintage L.L.Bean 100% cotton chamois shirt, Made in USA, men’s XLT…" className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-base leading-6 outline-none transition placeholder:text-black/35 focus:border-[var(--pine)] focus:ring-2 focus:ring-[var(--pine)]/10" />

          <div className="mt-4 flex gap-2">
            <button type="button" disabled={details.trim().length < 12} onClick={() => setChecked(true)} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--rust)] px-4 text-sm font-bold text-white transition active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-40"><SearchCheck size={18} />Check quality</button>
            <button type="button" onClick={reset} aria-label="Clear listing" className="grid min-h-12 min-w-12 place-items-center rounded-xl border border-black/10 bg-white text-[var(--muted-ink)]"><RotateCcw size={17} /></button>
          </div>

          {checked && (
            <div className="mt-6 rounded-2xl border border-black/8 bg-[var(--paper)] p-4" aria-live="polite">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--muted-ink)]">First-pass verdict</p><h3 className="mt-1 font-display text-2xl">{verdict}</h3></div>
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--pine)] text-center text-white"><span><strong className="block text-xl leading-none">{result.evidenceScore}/8</strong><small className="text-[9px] uppercase tracking-wider">evidence</small></span></div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <FindingList title={`Age evidence ${result.ageScore}/4`} icon={<CheckCircle2 size={15} />} items={result.ageEvidence.map((item) => item.label)} empty="No age proof yet—ask for every label and the zipper." positive />
                <FindingList title={`Quality evidence ${result.qualityScore}/4`} icon={<CheckCircle2 size={15} />} items={result.qualityEvidence.map((item) => item.label)} empty="Ask for fiber, seams, cuffs and fabric-weight details." positive />
                <FindingList title="Purchase gates" icon={<AlertTriangle size={15} />} items={[result.fit ? "Fits your search preferences. Confirm measurements with the seller." : "Check the size and measurements against your preferences.", ...result.concerns.map((item) => item.label)]} empty="Condition and measurements still need proof." />
              </div>
              <p className="mt-3 text-xs leading-5 text-[var(--muted-ink)]">The search stays broad. A low evidence score means “ask for proof,” not automatically “reject.” Buy only when measurements and condition are confirmed.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FindingList({ title, icon, items, empty, positive = false }: { title: string; icon: React.ReactNode; items: string[]; empty: string; positive?: boolean }) {
  return <div className="rounded-xl bg-white/70 p-3"><p className={`flex items-center gap-1.5 text-xs font-bold ${positive ? "text-[var(--pine)]" : "text-[var(--rust)]"}`}>{icon}{title}</p><ul className="mt-2 space-y-1.5 text-xs leading-4 text-[var(--muted-ink)]">{items.length ? items.map((item) => <li key={item}>• {item}</li>) : <li>{empty}</li>}</ul></div>;
}
