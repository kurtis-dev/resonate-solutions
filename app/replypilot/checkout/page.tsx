import { redirect } from "next/navigation";

export default function OldCheckoutPage({
  searchParams
}: {
  searchParams: { plan?: string };
}) {
  const suffix = searchParams.plan ? `?plan=${searchParams.plan}` : "";
  redirect(`/checkout${suffix}`);
}
