"use client";

import { FormEvent, useMemo, useState } from "react";
import { productStyles } from "@/app/excellent-pins/productStyles";

const emblemTypes = productStyles.map((style) => style.name);

const artworkStatuses = [
  "I have final artwork",
  "I have a rough design",
  "I need help preparing artwork",
  "Not sure yet"
];

const useCases = [
  "Business / organization",
  "Event or giveaway",
  "Employee or customer gift",
  "School or youth group",
  "Resale",
  "Not sure"
];

const packagingOptions = [
  "No preference",
  "Individual bags",
  "Backing cards",
  "Gift boxes",
  "Retail packaging",
  "Other / not sure"
];

const finishOptions = [
  "Recommend the best finish",
  "Gold",
  "Silver / nickel",
  "Black nickel",
  "Antique finish",
  "Full-color print",
  "Not sure"
];

const backingOptions = [
  "Recommend the best backing",
  "Rubber clutch",
  "Deluxe clutch",
  "Magnet",
  "Safety pin",
  "Keychain / attachment",
  "Not sure"
];

const budgetOptions = [
  "Recommend the best production option",
  "Lowest practical cost",
  "Balanced quality / value",
  "Premium finish",
  "Not sure"
];

type QuoteState = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  emblemType: string;
  quantity: string;
  designCount: string;
  approximateSize: string;
  deadline: string;
  artworkStatus: string;
  artworkLink: string;
  useCase: string;
  finishPreference: string;
  backingPreference: string;
  packaging: string;
  budgetGuidance: string;
  notes: string;
  website: string;
  companyWebsite: string;
  confirmEmail: string;
  startedAt: string;
};

function createInitialState(): QuoteState {
  return {
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    emblemType: "",
    quantity: "",
    designCount: "",
    approximateSize: "",
    deadline: "",
    artworkStatus: "",
    artworkLink: "",
    useCase: "",
    finishPreference: "Recommend the best finish",
    backingPreference: "Recommend the best backing",
    packaging: "No preference",
    budgetGuidance: "Recommend the best production option",
    notes: "",
    website: "",
    companyWebsite: "",
    confirmEmail: "",
    startedAt: Date.now().toString()
  };
}

function ChoiceGroup({
  name,
  value,
  options,
  onChange
}: {
  name: keyof QuoteState;
  value: string;
  options: string[];
  onChange: (name: keyof QuoteState, value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(name, option)}
            className={`rounded-[18px] border px-4 py-3 text-left text-sm font-black transition ${
              selected
                ? "border-[#c92f2f] bg-[#fff0e4] text-[#17120f] shadow-[0_10px_24px_rgba(201,47,47,0.14)]"
                : "border-[#c8d4e3] bg-[#fffaf3] text-[#173866] hover:border-[#c92f2f]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  name,
  value,
  placeholder,
  onChange,
  type = "text",
  required
}: {
  label: string;
  name: keyof QuoteState;
  value: string;
  placeholder?: string;
  onChange: (name: keyof QuoteState, value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-black">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        className="rounded-[14px] border border-[#c8d4e3] bg-[#fffaf4] px-4 py-3 font-medium outline-none focus:border-[#c92f2f]"
      />
    </label>
  );
}

export function ExcellentPinsQuoteFlow() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<QuoteState>(createInitialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const selectedStyle = productStyles.find((style) => style.name === form.emblemType);

  const steps = useMemo(
    () => [
      { label: "Project", title: "What type of metal emblem do you need?" },
      { label: "Details", title: "Tell us the core order details." },
      { label: "Options", title: "Choose any production preferences." },
      { label: "Contact", title: "Where should Excellent Pins follow up?" }
    ],
    []
  );

  function update(name: keyof QuoteState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  }

  function canContinue() {
    if (step === 0) return Boolean(form.emblemType);
    if (step === 1) return Boolean(form.quantity && form.artworkStatus);
    if (step === 2) return Boolean(form.useCase && form.finishPreference && form.backingPreference && form.packaging && form.budgetGuidance);
    return Boolean(form.customerName && form.customerEmail);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinue()) {
      setError("Please fill out the required fields before sending.");
      return;
    }

    setStatus("submitting");
    setError("");

    const response = await fetch("/api/excellent-pins/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setError(body?.error || "The quote request could not be sent. Please try again.");
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-[28px] border border-[#c8d4e3] bg-[#fffaf4] p-8 shadow-[0_18px_55px_rgba(23,56,102,0.08)]">
        <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#173866]">Request sent</p>
        <h3 className="excellent-pins-display mt-4 text-4xl font-black leading-tight text-[#17120f]">Excellent Pins received your quote request.</h3>
        <p className="mt-4 text-base leading-7 text-[#4b5e73]">
          The details were sent to Excellent Pins and a confirmation was sent to your email.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(createInitialState());
            setStep(0);
            setStatus("idle");
          }}
          className="mt-6 rounded-full bg-[#173866] px-7 py-4 text-sm font-black text-white"
        >
          Start another quote
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[28px] border border-[#c8d4e3] bg-[#fffaf4] p-5 shadow-[0_18px_55px_rgba(23,56,102,0.08)] sm:p-8">
      <div className="mb-6 grid gap-2 sm:grid-cols-4">
        {steps.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.18em] ${
              index === step ? "bg-[#173866] text-white" : "bg-[#eef5fb] text-[#173866]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#173866]">Step {step + 1} of 4</p>
      <h3 className="excellent-pins-display mt-3 text-4xl font-black leading-tight text-[#17120f]">{steps[step].title}</h3>

      <div className="mt-6">
        {step === 0 && (
          <div className="grid gap-6">
            <label className="grid gap-2 text-sm font-black">
              Product type
              <select
                value={form.emblemType}
                required
                onChange={(event) => update("emblemType", event.target.value)}
                onInput={(event) => update("emblemType", event.currentTarget.value)}
                className="rounded-[14px] border border-[#c8d4e3] bg-[#fffaf4] px-4 py-3 font-bold text-[#17120f] outline-none focus:border-[#c92f2f]"
              >
                <option value="">Choose a product type</option>
                {emblemTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 rounded-[22px] border border-[#c8d4e3] bg-[#eef5fb] p-4 sm:grid-cols-[180px_1fr] sm:items-center">
              <div className="overflow-hidden rounded-[18px] border border-[#dbe7f4] bg-[#fffaf4] shadow-[0_10px_26px_rgba(23,56,102,0.08)]">
                <img
                  src={(selectedStyle || productStyles[0]).image}
                  alt={`${(selectedStyle || productStyles[0]).name} visual preview`}
                  className={`aspect-[1.38/1] w-full ${
                    (selectedStyle || productStyles[0]).imageFit === "contain"
                      ? "object-contain p-5"
                      : "object-cover"
                  }`}
                />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#173866]">
                  {selectedStyle ? selectedStyle.shortName : "Pick a style"}
                </p>
                <p className="mt-2 text-sm font-black leading-6 text-[#17120f]">
                  {selectedStyle
                    ? selectedStyle.quoteNote
                    : "Choose the closest product type. Not sure is okay."}
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#4b5e73]">
                  Tell us what you want made and Excellent Pins can recommend what works.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Approx quantity" name="quantity" value={form.quantity} placeholder="Example: 250, 1,000, 20,000" required onChange={update} />
              <Field label="How many designs?" name="designCount" value={form.designCount} placeholder="Example: 1 design, 3 versions" onChange={update} />
              <Field label="Approx size or shape" name="approximateSize" value={form.approximateSize} placeholder="Example: 1.25 inch round, custom shape" onChange={update} />
              <Field label="Deadline" name="deadline" value={form.deadline} placeholder="Event date or target date" onChange={update} />
            </div>
            <div>
              <p className="mb-3 text-sm font-black">Artwork status</p>
              <ChoiceGroup name="artworkStatus" value={form.artworkStatus} options={artworkStatuses} onChange={update} />
            </div>
            <Field label="Artwork link, if available" name="artworkLink" value={form.artworkLink} placeholder="Google Drive, Dropbox, website, or file link" onChange={update} />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6">
            <div>
              <p className="mb-3 text-sm font-black">How will these be used?</p>
              <ChoiceGroup name="useCase" value={form.useCase} options={useCases} onChange={update} />
            </div>
            <div>
              <p className="mb-3 text-sm font-black">Metal finish preference</p>
              <ChoiceGroup name="finishPreference" value={form.finishPreference} options={finishOptions} onChange={update} />
            </div>
            <div>
              <p className="mb-3 text-sm font-black">Backing or attachment</p>
              <ChoiceGroup name="backingPreference" value={form.backingPreference} options={backingOptions} onChange={update} />
            </div>
            <div>
              <p className="mb-3 text-sm font-black">Any special packaging preferred?</p>
              <ChoiceGroup name="packaging" value={form.packaging} options={packagingOptions} onChange={update} />
            </div>
            <div>
              <p className="mb-3 text-sm font-black">Budget guidance</p>
              <ChoiceGroup name="budgetGuidance" value={form.budgetGuidance} options={budgetOptions} onChange={update} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="customerName" value={form.customerName} required onChange={update} />
              <Field label="Email" name="customerEmail" value={form.customerEmail} type="email" required onChange={update} />
            </div>
            <Field label="Phone" name="customerPhone" value={form.customerPhone} placeholder="Optional" onChange={update} />
            <label className="grid gap-2 text-sm font-black">
              Anything else Excellent Pins should know?
              <textarea
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                rows={6}
                placeholder="Tell us what you want and any details you already know."
                className="rounded-[14px] border border-[#c8d4e3] bg-[#fffaf4] px-4 py-3 font-medium outline-none focus:border-[#c92f2f]"
              />
            </label>
          </div>
        )}
      </div>

      <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} className="hidden" aria-hidden="true" />
      <input tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(event) => update("companyWebsite", event.target.value)} className="hidden" aria-hidden="true" />
      <input tabIndex={-1} autoComplete="off" value={form.confirmEmail} onChange={(event) => update("confirmEmail", event.target.value)} className="hidden" aria-hidden="true" />

      {error && <p className="mt-5 rounded-[14px] bg-[#fff0e4] px-4 py-3 text-sm font-black text-[#9d2429]">{error}</p>}

      <div className="mt-7 flex flex-col gap-4 rounded-[18px] border border-[#c8d4e3] bg-[#eef5fb] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[#c8d4e3] bg-[#fffaf3] shadow-[0_10px_24px_rgba(23,56,102,0.12)]">
            <img
              src="/assets/excellent-pins/excellent-pins-logo-mark.png"
              alt="Excellent Pins & Badges"
              className="h-full w-full object-contain p-1.5 drop-shadow-[0_5px_8px_rgba(21,17,13,0.18)]"
            />
          </span>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#173866]">
              Sent to Excellent Pins
            </p>
            <p className="mt-1 text-sm font-bold leading-6 text-[#4b5e73]">
              Your quote details go directly to Excellent Pins & Badges for review.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            className="rounded-full border border-[#c8d4e3] bg-[#fffaf4] px-7 py-4 text-sm font-black text-[#173866]"
          >
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              if (!canContinue()) {
                setError("Please answer this step before continuing.");
                return;
              }
              setStep((current) => current + 1);
            }}
            className="rounded-full bg-[#c92f2f] px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(201,47,47,0.24)]"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-[#c92f2f] px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(201,47,47,0.24)] disabled:opacity-60"
          >
            {status === "submitting" ? "Sending..." : "Send quote request"}
          </button>
        )}
      </div>
    </form>
  );
}
