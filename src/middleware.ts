import { NextResponse, type NextRequest } from "next/server";
import { middlewareArcjet } from "./lib/security/middlewareArcjet";

export async function middleware(req: NextRequest) {
  const decision = await middlewareArcjet.protect(req, {
    requested: 1,
  });
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    } else if (decision.reason.isBot()) {
      return NextResponse.json({ error: "Bot Detected" }, { status: 403 });
    } else if (decision.reason.isShield()) {
      return NextResponse.json(
        {
          error:
            "Your request was blocked by our security system for unusual activity.",
        },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/api/notes/:path*", "/api/tags/:path*", "/api/user/:path*"],
};
