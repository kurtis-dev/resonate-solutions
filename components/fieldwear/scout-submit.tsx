"use client";

import type {} from "react-dom/canary";
import { useFormStatus } from "react-dom";

export function ScoutSubmit({ label, className }: { label: string; className: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={`${className} disabled:opacity-70`}>{pending ? "Checking sources…" : label}</button>;
}
