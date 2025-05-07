import { Mastra } from "@mastra/core";
import { adminAgent } from "./agents/admin-agent";
import { seoAgent } from "./agents/seo-agent";
import { adminNetwork } from "./network/admin-network";

// Configure OpenAI API key
import { openai } from "@ai-sdk/openai";
if (process.env.OPENAI_API_KEY) {
  openai.apiKey = process.env.OPENAI_API_KEY;
  console.log("OpenAI API key configured");
} else {
  console.error("OpenAI API key not found in environment variables");
}

export const mastra = new Mastra({
  agents: {
    adminAgent,
    seoAgent,
  },
  networks: {
    adminNetwork,
  },
});
