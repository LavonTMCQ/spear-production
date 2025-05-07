'use server'

import { mastra } from '@/mastra';

export async function processSeoMessage(message: string) {
  try {
    console.log("Processing SEO message:", message);

    // Get the SEO agent
    const agent = mastra.getAgent("seoAgent");

    // Process the message
    const response = await agent.generate(message);

    console.log("SEO Agent response received");
    console.log("Tool calls:", response.toolCalls?.length || 0);
    
    // If there were tool calls, include them in the response for transparency
    let toolResults = [];
    
    if (response.toolCalls && response.toolCalls.length > 0) {
      toolResults = response.toolCalls.map(call => {
        return {
          tool: call.name,
          args: call.args,
          result: call.result,
        };
      });
      
      console.log("Tool results:", JSON.stringify(toolResults, null, 2));
    }

    // Return the response with tool results if any
    return {
      response: response.text,
      toolResults: toolResults.length > 0 ? toolResults : undefined,
    };
  } catch (error) {
    console.error("Error processing SEO assistant message:", error);
    return {
      response: "I'm sorry, I encountered an error while processing your request. Please try again later.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
