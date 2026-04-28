"use server";

import { redirect } from "next/navigation";
import { createMenuBusiness, updateMenuMode } from "@/lib/menu-store";

export async function createMenuBusinessAction(formData: FormData) {
  const result = await createMenuBusiness(formData);

  if (!result.ok) {
    redirect(`/admin/menus?status=${result.reason}`);
  }

  redirect(`/m/${result.slug}`);
}

export async function updateMenuModeAction(formData: FormData) {
  const result = await updateMenuMode(formData);

  if (!result.ok) {
    redirect(`/admin/menus?status=${result.reason}`);
  }

  redirect(`/m/${result.slug}`);
}
