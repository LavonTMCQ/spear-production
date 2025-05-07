"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon, ArrowRightIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, LifebuoyIcon, CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketCategory, setTicketCategory] = useState("technical");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Support ticket submitted successfully");
      setTicketSubject("");
      setTicketDescription("");
      setTicketCategory("technical");
      setIsSubmitting(false);
    }, 1500);
  };
  
  const faqCategories = [
    {
      id: "general",
      name: "General",
      icon: QuestionMarkCircleIcon,
    },
    {
      id: "account",
      name: "Account & Billing",
      icon: DocumentTextIcon,
    },
    {
      id: "devices",
      name: "Devices & Connectivity",
      icon: LifebuoyIcon,
    },
    {
      id: "teamviewer",
      name: "TeamViewer Integration",
      icon: ChatBubbleLeftRightIcon,
    },
  ];
  
  const faqs = [
    {
      id: "faq-1",
      category: "general",
      question: "What is SPEAR?",
      answer: "SPEAR (Secure Platform for Extended Augmented Reality) is a comprehensive remote device management platform that allows organizations to securely access, monitor, and control remote devices. It provides enterprise-grade security, location verification, and compliance solutions for various industries."
    },
    {
      id: "faq-2",
      category: "general",
      question: "How does SPEAR ensure security?",
      answer: "SPEAR implements multiple layers of security including end-to-end encryption, multi-factor authentication, role-based access controls, and detailed audit logs. All connections are secured using industry-standard protocols, and data is encrypted both in transit and at rest."
    },
    {
      id: "faq-3",
      category: "account",
      question: "How do I change my password?",
      answer: "You can change your password by navigating to your profile settings. Click on your avatar in the top-right corner, select 'Profile', then go to the 'Security' tab. From there, you can update your password by entering your current password and your new password."
    },
    {
      id: "faq-4",
      category: "account",
      question: "How do I upgrade my subscription?",
      answer: "To upgrade your subscription, go to the 'Subscription' page from the main navigation menu. You'll see your current plan and available upgrade options. Select the plan you want to upgrade to and follow the payment instructions."
    },
    {
      id: "faq-5",
      category: "devices",
      question: "How do I add a new device?",
      answer: "To add a new device, navigate to the 'Devices' section from the main menu. Click on the 'Add Device' button and follow the setup instructions. You'll need to provide a name for the device and complete the provisioning process."
    },
    {
      id: "faq-6",
      category: "devices",
      question: "What should I do if a device goes offline?",
      answer: "If a device goes offline, first check the device's physical connection and power status. Then, verify the network connectivity. If the device is still offline, you can try to restart it remotely from the 'Devices' page if that option was previously enabled. If issues persist, contact our support team."
    },
    {
      id: "faq-7",
      category: "teamviewer",
      question: "How do I connect SPEAR with TeamViewer?",
      answer: "To connect SPEAR with TeamViewer, go to the 'Integrations' page in the admin dashboard. Click on 'Configure' next to TeamViewer, and you'll be guided through the API connection process. You'll need your TeamViewer API credentials to complete the setup."
    },
    {
      id: "faq-8",
      category: "teamviewer",
      question: "What TeamViewer permissions does SPEAR require?",
      answer: "SPEAR requires the following TeamViewer permissions: View users, View groups, View devices, Create sessions, and View sessions. These permissions allow SPEAR to manage devices, create remote connections, and monitor session activity."
    },
  ];
  
  const supportArticles = [
    {
      id: "article-1",
      title: "Getting Started with SPEAR",
      description: "Learn the basics of setting up and using SPEAR for remote device management.",
      category: "Beginner",
      readTime: "5 min read",
      image: "/images/help/getting-started.jpg"
    },
    {
      id: "article-2",
      title: "Configuring TeamViewer Integration",
      description: "Step-by-step guide to connecting SPEAR with your TeamViewer account.",
      category: "Integration",
      readTime: "8 min read",
      image: "/images/help/teamviewer-integration.jpg"
    },
    {
      id: "article-3",
      title: "Device Provisioning Guide",
      description: "Learn how to provision and set up new devices in your SPEAR account.",
      category: "Devices",
      readTime: "6 min read",
      image: "/images/help/device-provisioning.jpg"
    },
    {
      id: "article-4",
      title: "Security Best Practices",
      description: "Recommended security settings and practices for your SPEAR implementation.",
      category: "Security",
      readTime: "10 min read",
      image: "/images/help/security-practices.jpg"
    },
  ];
  
  const recentTickets = [
    {
      id: "ticket-1",
      subject: "Cannot connect to device",
      status: "open",
      created: "2 days ago",
      lastUpdate: "1 day ago"
    },
    {
      id: "ticket-2",
      subject: "Billing question about subscription",
      status: "closed",
      created: "1 week ago",
      lastUpdate: "5 days ago"
    },
    {
      id: "ticket-3",
      subject: "TeamViewer integration error",
      status: "in_progress",
      created: "3 days ago",
      lastUpdate: "12 hours ago"
    },
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support Center</h1>
        <p className="text-muted-foreground">
          Find answers, get help, and contact our support team
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for help articles, FAQs, or topics..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="articles">Help Articles</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>
        
        {/* FAQs Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {faqCategories.map((category) => (
              <Card key={category.id} className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {faqs.filter(faq => faq.category === category.id).length} articles
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No FAQs found matching your search.</p>
                </div>
              )}
            </Accordion>
          </div>
        </TabsContent>
        
        {/* Help Articles Tab */}
        <TabsContent value="articles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <div className="h-40 relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Read Article
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline">
              View All Articles
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </TabsContent>
        
        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>
                View and manage your support requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentTickets.length > 0 ? (
                <div className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className={`mt-1 h-2 w-2 rounded-full ${
                          ticket.status === "open" ? "bg-blue-500" :
                          ticket.status === "in_progress" ? "bg-amber-500" :
                          "bg-green-500"
                        }`} />
                        <div>
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-xs text-muted-foreground">
                              Created: {ticket.created}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last update: {ticket.lastUpdate}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge className={
                          ticket.status === "open" ? "bg-blue-500" :
                          ticket.status === "in_progress" ? "bg-amber-500" :
                          "bg-green-500"
                        }>
                          {ticket.status === "open" ? "Open" :
                           ticket.status === "in_progress" ? "In Progress" :
                           "Closed"}
                        </Badge>
                        <Button variant="ghost" size="sm" className="ml-2">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any support tickets yet.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => document.querySelector('[data-value="contact"]')?.click()}>
                Create New Ticket
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ticket Status Guide</CardTitle>
              <CardDescription>
                Understanding your ticket status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <ClockIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Open</h3>
                    <p className="text-sm text-muted-foreground">
                      Your ticket has been received and is waiting to be assigned to a support agent.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <ExclamationCircleIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">In Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      A support agent is actively working on your ticket and will provide updates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircleIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Closed</h3>
                    <p className="text-sm text-muted-foreground">
                      Your issue has been resolved and the ticket is now closed.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Support Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>
                  Our support team will respond to your inquiry as soon as possible
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleTicketSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                    >
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Subscription</option>
                      <option value="account">Account Management</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Please provide as much detail as possible about your issue"
                      rows={6}
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="attachments" className="text-sm font-medium">
                      Attachments (Optional)
                    </label>
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      File uploads are disabled in this demo
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting || !ticketSubject || !ticketDescription}>
                    {isSubmitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <LifebuoyIcon className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Support Hours</h3>
                      <p className="text-sm text-muted-foreground">
                        Monday - Friday: 9am - 6pm EST
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-sm text-muted-foreground">
                        support@spear-platform.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Documentation</h3>
                      <Link href="/docs" className="text-sm text-primary hover:underline">
                        View Documentation
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Support Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <p className="text-sm text-muted-foreground">
                        Technical Support Lead
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Jane Smith</h3>
                      <p className="text-sm text-muted-foreground">
                        Customer Success Manager
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>RJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Robert Johnson</h3>
                      <p className="text-sm text-muted-foreground">
                        Billing Specialist
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
