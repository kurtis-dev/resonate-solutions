export const questionsEmail = process.env.NEXT_PUBLIC_QUESTIONS_EMAIL || "questions@resonate.solutions";

export function mailtoLink(subject: string, body?: string) {
  const params = new URLSearchParams({ subject });

  if (body) {
    params.set("body", body);
  }

  return `mailto:${questionsEmail}?${params.toString()}`;
}
