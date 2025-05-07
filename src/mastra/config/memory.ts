import { Memory } from "@mastra/memory";

// Create a memory instance with in-memory storage
export const agentMemory = new Memory({
  options: {
    // Keep the last 20 messages in the conversation history
    lastMessages: 20,

    // Enable working memory to maintain persistent information about users
    workingMemory: {
      enabled: true,
      use: "tool-call", // Use tool calls to update working memory
      template: `
# User Profile

## Personal Info

- Name:
- Role: [Admin/Client]
- Preferences:

## Session State

- Last Topic Discussed:
- Open Questions:
  - [Question 1]
  - [Question 2]

## Important Information

- [Key point 1]
- [Key point 2]
      `,
    },
  },
});
