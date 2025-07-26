import { detectBot, shield, tokenBucket } from "@arcjet/next";
import { basicArcjet } from "../arcjet";

export const verifyEmailArcjet = basicArcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    tokenBucket({
      mode: "LIVE",
      refillRate: 1,
      interval: 2 * 60,
      capacity: 2,
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );
