import arcjet from "@arcjet/next";

export const basicArcjet = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [],
});
