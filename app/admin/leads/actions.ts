"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { leadTaskStages, type LeadTaskStage } from "@/lib/lead-tasks";
import { updateLeadTaskStage } from "@/lib/lead-task-store";

function stageFromForm(value: FormDataEntryValue | null): LeadTaskStage | null {
  const stage = String(value || "");
  return leadTaskStages.includes(stage as LeadTaskStage) ? (stage as LeadTaskStage) : null;
}

export async function updateLeadTaskStageAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const stage = stageFromForm(formData.get("stage"));

  if (!id || !stage) {
    redirect("/admin?status=invalid-lead-stage");
  }

  await updateLeadTaskStage(id, stage);
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${id}`);
  redirect(`/admin/leads/${id}?status=stage-updated`);
}

