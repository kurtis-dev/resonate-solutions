"use server";

import { redirect } from "next/navigation";
import { updateMenuMode } from "@/lib/menu-store";

export async function updateBusinessDashboardAction(formData: FormData) {
  const fallbackSlug = String(formData.get("slug") || "").trim();
  const result = await updateMenuMode(formData);

  if (!result.ok) {
    redirect(`/dashboard/${fallbackSlug || "mellow-moose-burgers"}?status=${result.reason}`);
  }

  redirect(`/dashboard/${result.slug}?status=saved`);
}
