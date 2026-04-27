import { redirect } from "next/navigation";
import { saveMenuItemQuestion } from "@/lib/menu-store";

function safeReturnPath(value: FormDataEntryValue | null) {
  const raw = String(value || "/");

  if (!raw.startsWith("/")) {
    return "/";
  }

  return raw;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const comment = String(formData.get("comment") || "").trim();
  const returnTo = safeReturnPath(formData.get("returnTo"));

  if (!comment) {
    redirect(`${returnTo}?comment=missing`);
  }

  await saveMenuItemQuestion({
    businessSlug: String(formData.get("businessSlug") || "").trim(),
    businessName: String(formData.get("businessName") || "").trim(),
    itemId: String(formData.get("itemId") || "").trim(),
    itemName: String(formData.get("itemName") || "").trim(),
    customerName: String(formData.get("customerName") || "").trim(),
    customerEmail: String(formData.get("customerEmail") || "").trim(),
    comment
  });

  redirect(`${returnTo}?comment=sent`);
}
