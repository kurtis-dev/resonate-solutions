"use client";

import { useEffect, useMemo, useState } from "react";

type FormState = {
  businessName: string;
  businessType: string;
  reviewText: string;
  starRating: string;
  tone: "professional" | "warm" | "apologetic" | "short" | "friendly";
  managerName: string;
  includeContactOffer: boolean;
};

const initialForm: FormState = {
  businessName: "",
  businessType: "",
  reviewText: "",
  starRating: "5",
  tone: "professional",
  managerName: "",
  includeContactOffer: false
};

const FREE_LIMIT = 10;

function currentMonthKey() {
  const now = new Date();
  return `replypilot-usage-${now.getFullYear()}-${now.getMonth() + 1}`;
}

export default function GeneratorPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);
  const usageKey = useMemo(() => currentMonthKey(), []);

  useEffect(() => {
    setUsage(Number(localStorage.getItem(usageKey) || "0"));
  }, [usageKey]);

  async function generateReplies() {
    if (usage >= FREE_LIMIT) return;
    setLoading(true);
    setCopied(null);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setReplies(data.replies);
    const nextUsage = usage + 1;
    setUsage(nextUsage);
    localStorage.setItem(usageKey, String(nextUsage));
    setLoading(false);
  }

  async function copyReply(reply: string, index: number) {
    await navigator.clipboard.writeText(reply);
    setCopied(index);
  }

  function downloadReply(reply: string, index: number) {
    const blob = new Blob([reply], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `replypilot-option-${index + 1}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const blocked = usage >= FREE_LIMIT;

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Reply Generator</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink md:text-6xl">Generate review replies.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">Start with 10 free replies. Paid workflows can save your business rules, simplify approval, and support posting where platform access is available.</p>
        </div>
        <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-ink">Free usage</p>
          <p className="mt-1 text-sm text-muted">{usage} of {FREE_LIMIT} free trial replies used</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-ink">
              Business name
              <input className="rounded-lg border border-line px-3 py-3 font-normal" value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} placeholder="ReplyPilot Cafe" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Business type
              <input className="rounded-lg border border-line px-3 py-3 font-normal" value={form.businessType} onChange={(event) => setForm({ ...form, businessType: event.target.value })} placeholder="restaurant, dental office, hotel" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Review text
              <textarea className="min-h-36 rounded-lg border border-line px-3 py-3 font-normal" value={form.reviewText} onChange={(event) => setForm({ ...form, reviewText: event.target.value })} placeholder="Paste the customer review here..." />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-ink">
                Star rating
                <select className="rounded-lg border border-line px-3 py-3 font-normal" value={form.starRating} onChange={(event) => setForm({ ...form, starRating: event.target.value })}>
                  {["5", "4", "3", "2", "1"].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-ink">
                Desired tone
                <select className="rounded-lg border border-line px-3 py-3 font-normal" value={form.tone} onChange={(event) => setForm({ ...form, tone: event.target.value as FormState["tone"] })}>
                  <option value="professional">Professional</option>
                  <option value="warm">Warm</option>
                  <option value="apologetic">Apologetic</option>
                  <option value="short">Short</option>
                  <option value="friendly">Friendly</option>
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-bold text-ink">
              Manager name, optional
              <input className="rounded-lg border border-line px-3 py-3 font-normal" value={form.managerName} onChange={(event) => setForm({ ...form, managerName: event.target.value })} placeholder="Alex" />
            </label>
            <label className="flex items-center gap-3 text-sm font-bold text-ink">
              <input type="checkbox" checked={form.includeContactOffer} onChange={(event) => setForm({ ...form, includeContactOffer: event.target.checked })} />
              Mention offer to contact the business
            </label>
            {blocked ? (
              <a href="/replypilot/pricing" className="rounded-lg bg-gold px-5 py-3 text-center font-black text-ink">Upgrade to keep generating</a>
            ) : (
              <button onClick={generateReplies} disabled={loading || !form.reviewText.trim()} className="rounded-lg bg-brand px-5 py-3 font-black text-white hover:bg-brandDark disabled:cursor-not-allowed disabled:bg-slate-300">
                {loading ? "Generating..." : replies.length ? "Regenerate" : "Generate replies"}
              </button>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <h2 className="text-2xl font-black text-ink">Safe draft options</h2>
              <p className="mt-1 text-sm text-muted">Drafts avoid admissions of fault, refund promises, private details, and defensive language.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            {replies.length ? replies.map((reply, index) => (
              <article key={`${reply}-${index}`} className="rounded-lg border border-line bg-slate-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-ink">{reply}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => copyReply(reply, index)} className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white">
                    {copied === index ? "Copied" : "Copy"}
                  </button>
                  <button onClick={() => downloadReply(reply, index)} className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-ink">
                    Download .txt
                  </button>
                </div>
              </article>
            )) : (
              <div className="rounded-lg border border-dashed border-line p-8 text-center text-muted">
                Your three generated reply options will appear here.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
