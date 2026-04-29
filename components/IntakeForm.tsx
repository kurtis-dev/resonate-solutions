"use client";

import { FormEvent, useState } from "react";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

const initialForm = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  businessType: "",
  city: "",
  currentMenuLink: "",
  mainNeed: "Customers cannot find our current menu",
  packageInterest: "Free Mic Check audit",
  notes: "",
  website: ""
};

export function IntakeForm() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting", message: "Sending your Mic Check request..." });

    const response = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, source: "menupilot-page" })
    });

    const result = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setState({ status: "error", message: result.error || "Something went wrong. Please try again." });
      return;
    }

    setForm(initialForm);
    setState({ status: "success", message: result.message || "Thanks. Your request was received." });
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[1.75rem] border border-line bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">Start with a Mic Check</p>
        <h2 className="mt-2 text-3xl font-black text-ink">Find the missing notes in your customer path.</h2>
        <p className="mt-3 leading-7 text-muted">
          Send the basics and Resonate can review what customers see now: menu, hours, location, photos, links, and Google profile signals.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink">
          Business name
          <input required value={form.businessName} onChange={(event) => updateField("businessName", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Contact name
          <input required value={form.contactName} onChange={(event) => updateField("contactName", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Email
          <input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Phone
          <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Business type
          <input required value={form.businessType} onChange={(event) => updateField("businessType", event.target.value)} placeholder="Food truck, coffee shop, salon..." className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          City
          <input required value={form.city} onChange={(event) => updateField("city", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink">
        Current menu, website, or social link
        <input value={form.currentMenuLink} onChange={(event) => updateField("currentMenuLink", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink">
          Main need
          <select required value={form.mainNeed} onChange={(event) => updateField("mainNeed", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal">
            <option>Customers cannot find our current menu</option>
            <option>Customers cannot find our location or hours</option>
            <option>Our photos do not help people choose</option>
            <option>Our Google profile needs cleanup</option>
            <option>We need a QR code and link hub</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Interest
          <select required value={form.packageInterest} onChange={(event) => updateField("packageInterest", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal">
            <option>Free Mic Check audit</option>
            <option>MenuPilot Core</option>
            <option>MenuPilot Managed</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink">
        Notes
        <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows={4} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
      </label>

      <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField("website", event.target.value)} className="hidden" aria-hidden="true" />

      <button disabled={state.status === "submitting"} type="submit" className="rounded-full bg-brand px-6 py-3 font-black text-white shadow-soft hover:bg-brandDark disabled:cursor-not-allowed disabled:opacity-70">
        {state.status === "submitting" ? "Sending..." : "Request Mic Check"}
      </button>

      {state.message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm font-bold ${state.status === "error" ? "bg-red-50 text-red-700" : "bg-sage text-brandDark"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
