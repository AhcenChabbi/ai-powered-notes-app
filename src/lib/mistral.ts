import { createMistral } from "@ai-sdk/mistral";

const mistral = createMistral({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
});
export default mistral;
