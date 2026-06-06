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
  mainNeed: "We need a food menu",
  packageInterest: "Free Page Plan",
  notes: "",
  website: ""
};

export function IntakeForm() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting", message: "Sending your free page plan request..." });

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
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Start with a free page plan</p>
        <h2 className="mt-2 text-3xl font-black text-ink">Tell us what kind of page, menu, or services list you need.</h2>
        <p className="mt-3 leading-7 text-muted">
          Send the basics and Resonate will recommend the right page setup before you pay. Custom build work starts after the Launch payment.
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
          <input required value={form.businessType} onChange={(event) => updateField("businessType", event.target.value)} placeholder="Restaurant, food truck, salon, lawn care..." className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          City or service area
          <input required value={form.city} onChange={(event) => updateField("city", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink">
        Current website, menu, social, or Google profile link
        <input value={form.currentMenuLink} onChange={(event) => updateField("currentMenuLink", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink">
          What do you need built or updated?
          <select required value={form.mainNeed} onChange={(event) => updateField("mainNeed", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal">
            <option>We need a food menu</option>
            <option>We need a services list</option>
            <option>We need both menu and services</option>
            <option>We need a simple business page</option>
            <option>We need an existing page/menu cleaned up</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Likely next step
          <select required value={form.packageInterest} onChange={(event) => updateField("packageInterest", event.target.value)} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal">
            <option>Free Page Plan</option>
            <option>Launch</option>
            <option>Maintain after launch</option>
            <option>Managed after launch</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-ink">
        What should be created or updated?
        <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows={4} className="rounded-2xl border border-line bg-cream px-4 py-3 font-normal" />
      </label>

      <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => updateField("website", event.target.value)} className="hidden" aria-hidden="true" />

      <button disabled={state.status === "submitting"} type="submit" className="rounded-full bg-coral px-6 py-3 font-black text-white shadow-soft hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70">
        {state.status === "submitting" ? "Sending..." : "Request Free Page Plan"}
      </button>

      {state.message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm font-bold ${state.status === "error" ? "bg-red-50 text-red-700" : "bg-[#fff0e9] text-coral"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
