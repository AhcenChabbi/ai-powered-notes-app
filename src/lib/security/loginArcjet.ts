import { detectBot, shield, tokenBucket } from "@arcjet/next";
import { basicArcjet } from "../arcjet";

export const loginArcjet = basicArcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 60,
      capacity: 10,
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );
