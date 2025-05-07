import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Mock SEO data - in a real app, this would come from actual SEO analysis tools
const mockKeywordData = {
  "remote device control": {
    searchVolume: 2400,
    competition: "Medium",
    cpc: "$1.85",
    difficulty: 65,
    relatedKeywords: [
      "remote device management",
      "remote control devices",
      "remote access device control",
      "secure remote device control"
    ]
  },
  "subscription management": {
    searchVolume: 3200,
    competition: "High",
    cpc: "$2.45",
    difficulty: 72,
    relatedKeywords: [
      "subscription management software",
      "subscription billing management",
      "manage digital subscriptions",
      "subscription management platform"
    ]
  },
  "augmented reality": {
    searchVolume: 18500,
    competition: "High",
    cpc: "$3.75",
    difficulty: 80,
    relatedKeywords: [
      "AR technology",
      "augmented reality applications",
      "AR devices",
      "augmented reality solutions"
    ]
  },
  "secure platform": {
    searchVolume: 1900,
    competition: "Medium",
    cpc: "$2.10",
    difficulty: 68,
    relatedKeywords: [
      "secure cloud platform",
      "secure business platform",
      "secure enterprise platform",
      "secure digital platform"
    ]
  }
};

export const seoAnalysisTool = createTool({
  id: "seoAnalysisTool",
  description: "Analyze keywords for SEO optimization and content creation.",
  inputSchema: z.object({
    keyword: z.string().describe("The keyword or phrase to analyze for SEO potential."),
    includeRelated: z.boolean().default(true).describe("Whether to include related keywords in the analysis."),
  }),
  execute: async ({ context }) => {
    try {
      const { keyword, includeRelated = true } = context;
      
      // Log for debugging
      console.log("SEO analysis tool executed with:", { keyword, includeRelated });
      
      // Check if we have data for this exact keyword
      const exactMatch = mockKeywordData[keyword.toLowerCase()];
      
      if (exactMatch) {
        return {
          success: true,
          keyword: keyword,
          data: exactMatch,
          relatedKeywords: includeRelated ? exactMatch.relatedKeywords : [],
          recommendations: [
            `Focus on creating content around "${keyword}" as it has ${exactMatch.searchVolume} monthly searches.`,
            `Competition is ${exactMatch.competition.toLowerCase()}, so differentiate your content with unique insights.`,
            `Consider addressing specific pain points related to ${keyword} to stand out.`,
            `Use the keyword in title tags, meta descriptions, headers, and naturally throughout content.`,
            `Create comprehensive guides that cover all aspects of ${keyword} to increase content depth.`
          ]
        };
      }
      
      // If no exact match, find the closest keyword
      const allKeywords = Object.keys(mockKeywordData);
      const closestKeyword = allKeywords.find(k => 
        keyword.toLowerCase().includes(k) || k.includes(keyword.toLowerCase())
      );
      
      if (closestKeyword) {
        const closestData = mockKeywordData[closestKeyword];
        return {
          success: true,
          keyword: keyword,
          closestMatch: closestKeyword,
          data: closestData,
          relatedKeywords: includeRelated ? closestData.relatedKeywords : [],
          recommendations: [
            `Consider targeting "${closestKeyword}" which has ${closestData.searchVolume} monthly searches.`,
            `Your keyword "${keyword}" is related to "${closestKeyword}" which has established search data.`,
            `Use both terms in your content to capture broader search intent.`,
            `Create content that addresses the specific needs of users searching for these terms.`,
            `Incorporate these keywords naturally in your page titles, headers, and content.`
          ]
        };
      }
      
      // If no match at all, return generic recommendations
      return {
        success: true,
        keyword: keyword,
        data: null,
        recommendations: [
          `The keyword "${keyword}" doesn't have specific data in our system.`,
          `Consider researching more specific or popular terms in your industry.`,
          `Use Google's Keyword Planner or other SEO tools to find related keywords with search volume.`,
          `Focus on creating valuable content that addresses user needs rather than just keyword optimization.`,
          `Consider long-tail variations of your keyword that might have less competition.`
        ]
      };
    } catch (error) {
      console.error("Error in SEO analysis tool:", error);
      return {
        success: false,
        message: "An error occurred while analyzing the keyword.",
      };
    }
  },
});
