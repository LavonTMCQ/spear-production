import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const contentSuggestionTool = createTool({
  id: "contentSuggestionTool",
  description: "Generate content suggestions and outlines for blog posts, landing pages, and other marketing materials.",
  inputSchema: z.object({
    topic: z.string().describe("The main topic or keyword to generate content suggestions for."),
    contentType: z.enum(["blog", "landing", "social", "email", "ad"]).describe("The type of content to generate suggestions for."),
    audience: z.string().optional().describe("The target audience for the content (e.g., 'IT administrators', 'business owners')."),
    goal: z.string().optional().describe("The primary goal of the content (e.g., 'lead generation', 'brand awareness', 'education')."),
  }),
  execute: async ({ context }) => {
    try {
      const { topic, contentType, audience = "general", goal = "engagement" } = context;
      
      // Log for debugging
      console.log("Content suggestion tool executed with:", { topic, contentType, audience, goal });
      
      // Generate content suggestions based on the content type
      let suggestions = [];
      let outline = [];
      
      switch (contentType) {
        case "blog":
          suggestions = [
            `"The Ultimate Guide to ${topic}: Everything You Need to Know"`,
            `"5 Ways ${topic} Can Transform Your Business Operations"`,
            `"${topic} vs. Traditional Solutions: A Comprehensive Comparison"`,
            `"How to Implement ${topic} in Your Organization: Step-by-Step Guide"`,
            `"The Future of ${topic}: Trends and Predictions for 2024 and Beyond"`
          ];
          
          outline = [
            "Introduction: Why this topic matters now",
            "Section 1: Understanding the basics of the topic",
            "Section 2: Key benefits and advantages",
            "Section 3: Common challenges and how to overcome them",
            "Section 4: Implementation strategies and best practices",
            "Section 5: Case studies or real-world examples",
            "Section 6: Future trends and developments",
            "Conclusion: Next steps and call to action"
          ];
          break;
          
        case "landing":
          suggestions = [
            `"Transform Your Business with ${topic} - Start Your Free Trial Today"`,
            `"Discover the Power of ${topic} - Request a Demo"`,
            `"${topic} Solutions for Modern Businesses - Learn More"`,
            `"Streamline Your Operations with Our ${topic} Platform"`,
            `"The Most Secure ${topic} Solution on the Market - See How It Works"`
          ];
          
          outline = [
            "Hero section: Compelling headline and value proposition",
            "Benefits section: 3-4 key benefits with icons and brief descriptions",
            "Social proof: Customer testimonials and logos",
            "Features overview: Key features with visuals",
            "How it works: Simple step-by-step process",
            "Pricing options (if applicable)",
            "FAQ section addressing common objections",
            "Strong call-to-action"
          ];
          break;
          
        case "social":
          suggestions = [
            `"Did you know? ${topic} can increase productivity by up to 30%. Learn how in our latest guide (link)"`,
            `"We're excited to announce our new ${topic} feature! Check out how it works in this short video #${topic.replace(/\s+/g, '')}"`,
            `"'${topic} changed how we operate entirely.' - Read how our client achieved 45% cost reduction with our solution"`,
            `"5 myths about ${topic} debunked! Number 3 might surprise you... (link to blog)"`,
            `"Join our webinar: '${topic} Mastery in 60 Minutes' - Register now (link)"`
          ];
          break;
          
        case "email":
          suggestions = [
            `"Subject: Unlock the Full Potential of ${topic} - Exclusive Guide Inside"`,
            `"Subject: [New Release] Our ${topic} Solution Just Got Better"`,
            `"Subject: Are You Making These ${topic} Mistakes?"`,
            `"Subject: See How Company X Revolutionized Their Business with ${topic}"`,
            `"Subject: Your ${topic} Questions, Answered - Join Our Upcoming Webinar"`
          ];
          
          outline = [
            "Personalized greeting",
            "Brief, attention-grabbing introduction",
            "Main content: Value proposition or announcement",
            "Supporting points or benefits (bullet points work well)",
            "Clear call-to-action",
            "Professional signature with contact information"
          ];
          break;
          
        case "ad":
          suggestions = [
            `"${topic} Made Simple | 30-Day Free Trial | No Credit Card Required"`,
            `"Struggling with ${topic}? Our Solution Delivers 40% Better Results"`,
            `"Industry-Leading ${topic} Platform | Trusted by 500+ Companies"`,
            `"Cut ${topic} Costs by 35% | See Demo | Limited Time Offer"`,
            `"${topic} Solutions for Every Business Size | Starting at $X/month"`
          ];
          break;
      }
      
      // Generate SEO recommendations based on content type
      const seoRecommendations = contentType === "blog" || contentType === "landing" ? [
        `Include "${topic}" in your page title, preferably near the beginning`,
        `Use "${topic}" and variations in H1, H2, and H3 headings`,
        `Aim for a keyword density of 1-2% for "${topic}" throughout the content`,
        `Include "${topic}" in meta description, URL, and image alt text`,
        `Create internal links to and from other relevant content about "${topic}"`,
        `Ensure the content is comprehensive (1500+ words for blogs, 500+ for landing pages)`,
        `Include schema markup relevant to your content type`,
        `Optimize page load speed for better user experience and SEO ranking`
      ] : [];
      
      return {
        success: true,
        topic,
        contentType,
        audience,
        goal,
        suggestions,
        outline: outline.length > 0 ? outline : undefined,
        seoRecommendations: seoRecommendations.length > 0 ? seoRecommendations : undefined,
        additionalTips: [
          `Focus on addressing the specific needs and pain points of your ${audience} audience`,
          `Align content with the ${goal} goal by including appropriate calls-to-action`,
          `Use clear, concise language and avoid industry jargon unless writing for technical audiences`,
          `Include relevant statistics and data points to support your claims`,
          `Incorporate visual elements (images, infographics, videos) to enhance engagement`
        ]
      };
    } catch (error) {
      console.error("Error in content suggestion tool:", error);
      return {
        success: false,
        message: "An error occurred while generating content suggestions.",
      };
    }
  },
});
