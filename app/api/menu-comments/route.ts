import { redirect } from "next/navigation";
import { saveMenuItemQuestion } from "@/lib/menu-store";
import { notifyOpsAlert } from "@/lib/ops-alerts";

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

  const question = {
    businessSlug: String(formData.get("businessSlug") || "").trim(),
    businessName: String(formData.get("businessName") || "").trim(),
    itemId: String(formData.get("itemId") || "").trim(),
    itemName: String(formData.get("itemName") || "").trim(),
    customerName: String(formData.get("customerName") || "").trim(),
    customerEmail: String(formData.get("customerEmail") || "").trim(),
    comment
  };

  await saveMenuItemQuestion(question);
  await notifyOpsAlert({
    eventType: "customer_question",
    priority: "normal",
    title: "New customer question",
    message: `${question.customerName || "A customer"} asked about ${question.itemName || question.businessName || "a MenuPilot page"}.`,
    businessName: question.businessName,
    contactName: question.customerName,
    email: question.customerEmail,
    source: "public_menu",
    actionUrl: `${process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin}/admin`,
    metadata: {
      businessSlug: question.businessSlug,
      itemId: question.itemId,
      itemName: question.itemName,
      comment: question.comment
    }
  });

  redirect(`${returnTo}?comment=sent`);
}
