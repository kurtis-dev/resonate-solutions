import { z } from "zod";
import { dailySubmission, prepareDailyFind, type DailyEdition } from "./daily-scout";

const latest = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkedAt: z.string().datetime(),
  coverage: dailySubmission.shape.coverage,
  finds: z.array(z.record(z.unknown())).max(12),
});

export async function readScoutEdition(): Promise<DailyEdition | null> {
  const token = process.env.FIELDWEAR_FEED_TOKEN;
  if (!token) return null;
  try {
    const response = await fetch("https://fieldwear-scout.resonate-sol-7459.chatgpt.site/api/daily-scout", {
      headers: { "OAI-Sites-Authorization": `Bearer ${token}` },
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const { edition } = await response.json();
    const parsed = latest.safeParse(edition);
    if (!parsed.success) return null;
    const finds = parsed.data.finds.flatMap(({ url, imageUrl, title, size, priceCents, evidence }) => {
      const candidate = dailySubmission.shape.finds.element.safeParse({ url, imageUrl, title, size, priceCents, evidence });
      const item = candidate.success ? prepareDailyFind(candidate.data) : null;
      return item ? [item] : [];
    });
    return { ...parsed.data, finds };
  } catch {
    return null;
  }
}
