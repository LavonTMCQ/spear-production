import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Mock knowledge base data
const mockKnowledgeBase = {
  "product_documentation": [
    {
      title: "SPEAR Overview",
      content: "SPEAR (Secure Platform for Extended Augmented Reality) is a Next.js application for remote device control and subscription management with role-based access control. It provides a seamless way to remotely control devices without visible TeamViewer branding.",
      tags: ["overview", "introduction", "spear"],
    },
    {
      title: "Remote Device Control",
      content: "SPEAR's remote device control feature allows administrators to connect to client devices securely. The connection is established through TeamViewer's API but with custom branding. Users can name their devices if they have multiple devices.",
      tags: ["remote", "control", "device", "connection"],
    },
    {
      title: "Subscription Management",
      content: "SPEAR includes comprehensive subscription management features. Administrators can view, create, update, and cancel client subscriptions. Clients can manage their own subscriptions, including payment updates and upgrades.",
      tags: ["subscription", "payment", "billing"],
    },
    {
      title: "Role-Based Access Control",
      content: "SPEAR implements role-based access control with admin and client roles. Admins have full access to all features, while clients can only access their own devices and subscriptions. This ensures proper security and data isolation.",
      tags: ["security", "roles", "access control"],
    },
    {
      title: "Notification System",
      content: "SPEAR's notification system separates admin notifications from client notifications. Admins can see both types of notifications, while clients only see client notifications. This ensures relevant information is delivered to the appropriate users.",
      tags: ["notifications", "alerts"],
    },
  ],
  "marketing_content": [
    {
      title: "Why Choose SPEAR",
      content: "SPEAR offers a seamless remote device control experience with custom branding, comprehensive subscription management, and role-based access control. Unlike competitors, SPEAR provides a unified platform for both device control and subscription management.",
      tags: ["benefits", "advantages", "comparison"],
    },
    {
      title: "SPEAR for IT Administrators",
      content: "IT administrators benefit from SPEAR's centralized management console, detailed device information, and comprehensive audit logs. The platform simplifies remote support and reduces resolution time for technical issues.",
      tags: ["it", "administrators", "support"],
    },
    {
      title: "SPEAR for Business Owners",
      content: "Business owners can track subscription costs, manage device access, and ensure security compliance with SPEAR. The platform provides transparency into technology expenses and simplifies budget planning.",
      tags: ["business", "owners", "costs"],
    },
    {
      title: "SPEAR Security Features",
      content: "SPEAR prioritizes security with end-to-end encryption, role-based access control, and detailed audit logs. All connections are secured with industry-standard protocols, and sensitive data is encrypted at rest and in transit.",
      tags: ["security", "encryption", "compliance"],
    },
  ],
};

export const knowledgeRetrievalTool = createTool({
  id: "knowledgeRetrievalTool",
  description: "Retrieve relevant information from the knowledge base based on a query.",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant information."),
    collection: z.enum(["marketing_content", "product_documentation"]).default("product_documentation").describe("The collection to search in."),
    topK: z.number().default(3).describe("Number of results to return."),
  }),
  execute: async ({ context }) => {
    try {
      const { query, collection, topK = 3 } = context;

      // Log for debugging
      console.log("Knowledge retrieval tool executed with:", { query, collection, topK });

      // Simple search implementation using string matching
      const documents = mockKnowledgeBase[collection];

      // Score documents based on query match
      const scoredDocuments = documents.map(doc => {
        // Calculate a simple relevance score based on word matching
        const queryWords = query.toLowerCase().split(/\s+/);
        const contentWords = doc.content.toLowerCase();
        const titleWords = doc.title.toLowerCase();
        const tagWords = doc.tags.join(" ").toLowerCase();

        // Count matches in content, title, and tags
        let score = 0;
        queryWords.forEach(word => {
          if (contentWords.includes(word)) score += 1;
          if (titleWords.includes(word)) score += 2; // Title matches are more important
          if (tagWords.includes(word)) score += 1.5; // Tag matches are also important
        });

        return {
          ...doc,
          score,
        };
      });

      // Sort by score and take top K
      const results = scoredDocuments
        .filter(doc => doc.score > 0) // Only include relevant documents
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

      if (results.length === 0) {
        return {
          success: true,
          query,
          collection,
          results: [],
          message: "No relevant information found for this query.",
        };
      }

      return {
        success: true,
        query,
        collection,
        results: results.map(result => ({
          title: result.title,
          content: result.content,
          score: result.score,
          tags: result.tags,
        })),
      };
    } catch (error) {
      console.error("Error in knowledge retrieval tool:", error);
      return {
        success: false,
        message: "An error occurred while retrieving information from the knowledge base.",
      };
    }
  },
});
