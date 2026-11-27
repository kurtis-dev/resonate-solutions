import { unsubscribeSeams } from "@/lib/seams/members";

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  await unsubscribeSeams(token);
  return new Response(null, { status: 204 });
}
