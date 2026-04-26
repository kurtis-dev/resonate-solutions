import { NextResponse } from "next/server";
import { generatePlaceholderReplies, type ReplyInput } from "@/lib/reply-generator";

export async function POST(request: Request) {
  const input = (await request.json()) as ReplyInput;

  // OPENAI API CONNECTION POINT:
  // Replace generatePlaceholderReplies(input) with a call to the OpenAI Responses API.
  // Send businessName, businessType, reviewText, starRating, tone, managerName, and includeContactOffer.
  // Return exactly three safe draft reply options after validating and rate-limiting the user account.
  const replies = generatePlaceholderReplies(input);

  return NextResponse.json({ replies });
}
