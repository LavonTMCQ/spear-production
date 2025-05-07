"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MetaTags } from "@/components/seo/meta-tags";
import { FAQPageLD } from "@/components/seo/json-ld";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// FAQ data
const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is SPEAR?",
        answer: "SPEAR (Secure Platform for Extended Augmented Reality) is a comprehensive remote device management platform that allows organizations to securely access, monitor, and control remote devices. It provides enterprise-grade security, location verification, and compliance solutions for various industries."
      },
      {
        question: "How does SPEAR ensure security?",
        answer: "SPEAR implements multiple layers of security including end-to-end encryption, multi-factor authentication, role-based access controls, and detailed audit logs. All connections are secured using industry-standard protocols, and data is encrypted both in transit and at rest."
      },
      {
        question: "What devices can SPEAR manage?",
        answer: "SPEAR can manage a wide range of devices including desktop computers, laptops, mobile devices, tablets, and specialized hardware. It's designed to work across different operating systems including Windows, macOS, Linux, iOS, and Android."
      },
      {
        question: "Is SPEAR suitable for my industry?",
        answer: "SPEAR is designed to meet the needs of various industries including healthcare, finance, education, manufacturing, and more. It includes features specifically designed for regulatory compliance and can be customized to meet the unique requirements of your industry."
      }
    ]
  },
  {
    category: "Account & Billing",
    questions: [
      {
        question: "How do I change my password?",
        answer: "You can change your password by navigating to your profile settings. Click on your avatar in the top-right corner, select 'Profile', then go to the 'Security' tab. From there, you can update your password by entering your current password and your new password."
      },
      {
        question: "How do I upgrade my subscription?",
        answer: "To upgrade your subscription, go to the 'Subscription' page from the main navigation menu. You'll see your current plan and available upgrade options. Select the plan you want to upgrade to and follow the payment instructions."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. For enterprise customers, we also offer invoicing options with net-30 payment terms."
      },
      {
        question: "Can I get a refund?",
        answer: "We offer a 14-day money-back guarantee for new subscriptions. If you're not satisfied with our service within the first 14 days, contact our support team for a full refund. After this period, refunds are handled on a case-by-case basis."
      }
    ]
  },
  {
    category: "TeamViewer Integration",
    questions: [
      {
        question: "How do I connect SPEAR with TeamViewer?",
        answer: "To connect SPEAR with TeamViewer, go to the 'Integrations' page in the admin dashboard. Click on 'Configure' next to TeamViewer, and you'll be guided through the API connection process. You'll need your TeamViewer API credentials to complete the setup."
      },
      {
        question: "What TeamViewer permissions does SPEAR require?",
        answer: "SPEAR requires the following TeamViewer permissions: View users, View groups, View devices, Create sessions, and View sessions. These permissions allow SPEAR to manage devices, create remote connections, and monitor session activity."
      },
      {
        question: "Can I use SPEAR without TeamViewer?",
        answer: "Yes, SPEAR can be used without TeamViewer. While TeamViewer integration provides additional remote access capabilities, SPEAR offers its own core functionality for device management, monitoring, and security that works independently."
      },
      {
        question: "Is my TeamViewer license included with SPEAR?",
        answer: "No, TeamViewer licenses are not included with SPEAR subscriptions. You'll need to maintain your own TeamViewer subscription separately. SPEAR integrates with your existing TeamViewer account to enhance its capabilities."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "How do I get technical support?",
        answer: "You can access technical support through multiple channels: (1) In-app support via the Help Center, (2) Email support at support@spear-platform.com, (3) Live chat available during business hours, or (4) Phone support for enterprise customers."
      },
      {
        question: "What are your support hours?",
        answer: "Our standard support hours are Monday to Friday, 9 AM to 6 PM Eastern Time. Enterprise customers with premium support plans have access to extended hours and emergency support outside of regular business hours."
      },
      {
        question: "Is there a knowledge base or documentation?",
        answer: "Yes, we provide comprehensive documentation and a knowledge base accessible through our Help Center. This includes getting started guides, feature documentation, troubleshooting tips, and best practices for using SPEAR effectively."
      },
      {
        question: "Do you offer training for new users?",
        answer: "Yes, we offer various training options including self-paced video tutorials, regular webinars, and custom training sessions for enterprise customers. All new accounts also receive a complimentary onboarding session with our customer success team."
      }
    ]
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Filter questions based on search query and active category
  const filteredFAQs = faqData
    .filter(category => activeCategory === "all" || category.category === activeCategory)
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        q =>
          searchQuery === "" ||
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(category => category.questions.length > 0);
  
  // Prepare questions for JSON-LD
  const allQuestions = faqData.flatMap(category => category.questions);
  
  return (
    <>
      <MetaTags
        title="Frequently Asked Questions | SPEAR Platform"
        description="Find answers to common questions about SPEAR's remote device management platform, TeamViewer integration, account management, and technical support."
        keywords="SPEAR FAQ, remote device management questions, TeamViewer integration help, technical support"
      />
      <FAQPageLD questions={allQuestions} />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about SPEAR
            </p>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for answers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              onClick={() => setActiveCategory("all")}
            >
              All Categories
            </Button>
            {faqData.map((category) => (
              <Button
                key={category.category}
                variant={activeCategory === category.category ? "default" : "outline"}
                onClick={() => setActiveCategory(category.category)}
              >
                {category.category}
              </Button>
            ))}
          </div>
          
          {/* FAQ Accordions */}
          {filteredFAQs.length > 0 ? (
            <div className="space-y-8">
              {filteredFAQs.map((category) => (
                <div key={category.category}>
                  <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.category}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No results found for "{searchQuery}"</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}
          
          {/* Contact Support */}
          <div className="mt-16 text-center p-8 border rounded-lg bg-muted/20">
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you with any questions you may have.
            </p>
            <Button asChild>
              <a href="/help">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
