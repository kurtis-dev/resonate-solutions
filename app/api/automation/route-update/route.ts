import { NextResponse } from "next/server";
import { buildUpdateRoutePlan, parseUpdateRouteRequest } from "@/lib/channel-automation";

function isAuthorized(request: Request) {
  const expected = process.env.ZAPIER_WEBHOOK_SECRET;

  if (!expected) {
    return true;
  }

  const headerSecret = request.headers.get("x-zapier-secret");
  const authorization = request.headers.get("authorization");
  return headerSecret === expected || authorization === `Bearer ${expected}`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: "MenuPilot update route planner",
    method: "POST",
    requiredFields: ["businessName", "requestType", "whatShouldChange"],
    optionalFields: [
      "requestId",
      "businessId",
      "requestedBy",
      "plan",
      "paymentStatus",
      "permissionVerified",
      "approvalStatus",
      "publicCopyApproved",
      "approvedPublicCopy",
      "requestedChannels",
      "connectedChannels",
      "goLiveAt",
      "effectiveDate",
      "endDate",
      "sourceMaterialUrl"
    ],
    example: {
      businessName: "Mellow Moose Burgers",
      requestType: "hours",
      whatShouldChange: "Closing two hours early for the storm. Back tomorrow at 11.",
      plan: "managed",
      paymentStatus: "ok",
      permissionVerified: true,
      approvalStatus: "approved",
      publicCopyApproved: true,
      requestedChannels: ["MenuPilot page", "Google Business Profile", "Facebook Page", "DoorDash"],
      connectedChannels: ["Google Business Profile", "Facebook Page"]
    }
  });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseUpdateRouteRequest(body);

  if (!parsed.payload) {
    return NextResponse.json({ error: parsed.error || "Invalid update route request." }, { status: 400 });
  }

  return NextResponse.json(buildUpdateRoutePlan(parsed.payload));
}
