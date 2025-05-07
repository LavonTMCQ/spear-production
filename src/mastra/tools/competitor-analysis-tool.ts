import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Mock competitor data - in a real app, this would come from actual market research
const mockCompetitorData = {
  "teamviewer": {
    name: "TeamViewer",
    strengths: [
      "Established brand with high recognition",
      "Comprehensive feature set for remote control",
      "Cross-platform compatibility",
      "Strong security features",
      "Large existing user base"
    ],
    weaknesses: [
      "Expensive pricing structure",
      "Complex interface for new users",
      "Visible branding on free version",
      "Performance issues on slower connections",
      "Limited customization options"
    ],
    marketShare: "High",
    targetAudience: "Businesses of all sizes, IT professionals",
    pricingModel: "Subscription-based with tiered plans",
    keyDifferentiators: [
      "Brand recognition",
      "Extensive platform support",
      "Enterprise-grade security"
    ]
  },

  "logmein": {
    name: "LogMeIn",
    strengths: [
      "Comprehensive remote work solution",
      "Strong security and compliance features",
      "Good integration with other business tools",
      "Reliable connection quality",
      "Advanced reporting and management"
    ],
    weaknesses: [
      "Higher price point",
      "Complex deployment for large organizations",
      "Steeper learning curve",
      "Resource-intensive client",
      "Less flexible pricing options"
    ],
    marketShare: "Medium-High",
    targetAudience: "Medium to large enterprises, IT departments",
    pricingModel: "Subscription-based with annual contracts",
    keyDifferentiators: [
      "Enterprise focus",
      "Comprehensive solution suite",
      "Advanced management capabilities"
    ]
  },
  "splashtop": {
    name: "Splashtop",
    strengths: [
      "Competitive pricing",
      "Good performance and reliability",
      "Easy setup and deployment",
      "Strong mobile support",
      "Sector-specific solutions"
    ],
    weaknesses: [
      "Limited advanced features",
      "Less comprehensive management tools",
      "Fewer integration options",
      "Limited customization",
      "Less market presence"
    ],
    marketShare: "Medium-Low",
    targetAudience: "Small businesses, education sector, MSPs",
    pricingModel: "Subscription-based with flexible options",
    keyDifferentiators: [
      "Value for money",
      "Sector-specific focus",
      "Simplicity"
    ]
  }
};

export const competitorAnalysisTool = createTool({
  id: "competitorAnalysisTool",
  description: "Analyze competitors in the remote device control and subscription management space.",
  inputSchema: z.object({
    competitor: z.string().optional().describe("The specific competitor to analyze. If not provided, returns an overview of all major competitors."),
    aspect: z.enum(["strengths", "weaknesses", "pricing", "features", "all"]).default("all").describe("The specific aspect of the competitor(s) to analyze."),
  }),
  execute: async ({ context }) => {
    try {
      const { competitor, aspect = "all" } = context;

      // Log for debugging
      console.log("Competitor analysis tool executed with:", { competitor, aspect });

      // If a specific competitor is provided, return detailed analysis for that competitor
      if (competitor) {
        // Find the competitor (case-insensitive)
        const competitorKey = Object.keys(mockCompetitorData).find(
          key => key.toLowerCase() === competitor.toLowerCase()
        );

        if (!competitorKey) {
          return {
            success: false,
            message: `No data available for competitor: ${competitor}. Try one of: ${Object.keys(mockCompetitorData).join(", ")}`,
          };
        }

        const competitorData = mockCompetitorData[competitorKey];

        // Filter data based on requested aspect
        if (aspect !== "all") {
          let aspectData;

          switch (aspect) {
            case "strengths":
              aspectData = { strengths: competitorData.strengths };
              break;
            case "weaknesses":
              aspectData = { weaknesses: competitorData.weaknesses };
              break;
            case "pricing":
              aspectData = { pricingModel: competitorData.pricingModel };
              break;
            case "features":
              aspectData = {
                keyDifferentiators: competitorData.keyDifferentiators,
                strengths: competitorData.strengths
              };
              break;
          }

          return {
            success: true,
            competitor: competitorData.name,
            aspect,
            data: aspectData,
            marketPosition: competitorData.marketShare,
            targetAudience: competitorData.targetAudience,
          };
        }

        // Return all data for the competitor
        return {
          success: true,
          competitor: competitorData.name,
          data: competitorData,
          competitiveAdvantageOpportunities: [
            "Areas where SPEAR can differentiate:",
            "1. Simplified user interface with focus on ease of use",
            "2. More flexible and transparent pricing model",
            "3. Enhanced privacy features with hidden branding",
            "4. Specialized features for specific industry needs",
            "5. Better integration with subscription management"
          ]
        };
      }

      // If no specific competitor is provided, return an overview of all competitors
      const competitorOverview = Object.values(mockCompetitorData).map(comp => ({
        name: comp.name,
        marketShare: comp.marketShare,
        targetAudience: comp.targetAudience,
        keyStrengths: comp.strengths.slice(0, 3),
        keyWeaknesses: comp.weaknesses.slice(0, 3),
      }));

      return {
        success: true,
        competitors: competitorOverview,
        marketInsights: [
          "The remote device control market is mature but still growing due to remote work trends",
          "Price sensitivity is increasing as more competitors enter the market",
          "Integration with other business tools is becoming a key differentiator",
          "Security and privacy concerns are top priorities for customers",
          "Subscription-based models dominate the market"
        ],
        opportunitiesForSPEAR: [
          "Focus on seamless subscription management integration as a unique selling point",
          "Emphasize privacy and white-labeling capabilities to attract brand-conscious clients",
          "Target specific industries with tailored solutions",
          "Offer more flexible pricing options than established competitors",
          "Highlight modern, intuitive interface as an advantage over legacy systems"
        ]
      };
    } catch (error) {
      console.error("Error in competitor analysis tool:", error);
      return {
        success: false,
        message: "An error occurred while analyzing competitors.",
      };
    }
  },
});
