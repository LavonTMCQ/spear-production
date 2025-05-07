'use server'

import { mastra } from '@/mastra';
import { randomUUID } from 'crypto';

// Store user sessions
const userSessions: Record<string, { threadId: string, resourceId: string }> = {};

export async function processAssistantMessage(message: string, userId: string = 'default-user') {
  try {
    console.log("Processing message:", message);

    // Get or create session for this user
    if (!userSessions[userId]) {
      userSessions[userId] = {
        threadId: randomUUID(),
        resourceId: userId,
      };
      console.log(`Created new session for user ${userId}: ${userSessions[userId].threadId}`);
    }

    const { threadId, resourceId } = userSessions[userId];

    // Get the admin network
    const network = mastra.getNetwork("adminNetwork");

    // Process the message through the network
    const response = await network.generate(message, {
      threadId,
      resourceId,
      maxSteps: 10, // Allow enough steps for routing and processing
    });

    console.log("Network response received");
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

    // Get agent interaction summary
    const interactionSummary = network.getAgentInteractionSummary();
    console.log("Agent interaction summary:", interactionSummary);

    // Return the response with tool results if any
    return {
      response: response.text,
      toolResults: toolResults.length > 0 ? toolResults : undefined,
      agentUsed: interactionSummary.length > 0 ? interactionSummary[0].agentName : "Unknown",
    };
  } catch (error) {
    console.error("Error processing assistant message:", error);
    return {
      response: "I'm sorry, I encountered an error while processing your request. Please try again later.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
