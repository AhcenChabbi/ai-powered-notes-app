import { detectBot, shield, tokenBucket } from "@arcjet/next";
import { basicArcjet } from "../arcjet";

export const middlewareArcjet = basicArcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 20,
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );
