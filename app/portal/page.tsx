import { redirect } from "next/navigation";
import { customerPortalUrl } from "@/lib/portal";

export default function PortalPage() {
  redirect(customerPortalUrl);
}

