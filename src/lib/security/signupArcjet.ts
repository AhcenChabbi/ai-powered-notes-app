import { detectBot, shield, tokenBucket, validateEmail } from "@arcjet/next";
import { basicArcjet } from "../arcjet";

export const signUpArcjet = basicArcjet
  .withRule(
    validateEmail({
      mode: "LIVE",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    })
  )
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    tokenBucket({
      mode: "LIVE",
      refillRate: 1,
      interval: 120,
      capacity: 3,
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );
