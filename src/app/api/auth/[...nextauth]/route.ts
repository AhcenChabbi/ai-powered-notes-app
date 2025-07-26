import { basicArcjet } from "@/lib/arcjet";
import { handlers } from "@/lib/auth"; // Referring to the auth.ts we just created
import { detectBot, shield, slidingWindow } from "@arcjet/next";
import { NextResponse, type NextRequest } from "next/server";

const { GET } = handlers;

const aj = basicArcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    slidingWindow({
      mode: "LIVE",
      interval: 60,
      max: 10,
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

// Protect the sensitive actions e.g. login, signup, etc with Arcjet
const ajProtectedPOST = async (req: NextRequest) => {
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  return handlers.POST(req);
};

export { GET, ajProtectedPOST as POST };
