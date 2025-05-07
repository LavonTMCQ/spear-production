"use client";

import { useState, useEffect } from "react";
import { KnowledgeBaseSidebar } from "@/components/knowledge-base/knowledge-base-sidebar";
import { ArticleCard } from "@/components/knowledge-base/article-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenIcon, LightBulbIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

// Mock categories data
const categories = [
  { name: "Guides", slug: "guides", count: 5 },
  { name: "Integrations", slug: "integrations", count: 3 },
  { name: "Troubleshooting", slug: "troubleshooting", count: 2 },
  { name: "Security", slug: "security", count: 1 },
];

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch articles from the API
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/knowledge-base');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Knowledge Base</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions and learn how to get the most out of SPEAR.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <KnowledgeBaseSidebar categories={categories} />
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                All Articles
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center">
                <LightBulbIcon className="h-4 w-4 mr-2" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center">
                <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>

                  {articles.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">No articles found.</p>
                      <Button variant="outline">Create Your First Article</Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="guides" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles
                  .filter(article => article.category === 'Guides')
                  .map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
              </div>

              {articles.filter(article => article.category === 'Guides').length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No guides found.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <div className="space-y-6">
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-2">What is SPEAR?</h3>
                  <p className="text-muted-foreground">
                    SPEAR is a comprehensive platform for remote device management that integrates with TeamViewer for reliable remote access.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-2">How do I connect to a device?</h3>
                  <p className="text-muted-foreground">
                    You can connect to a device by navigating to the Dashboard, selecting the device you want to connect to, and clicking the "Connect" button.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-2">Why does SPEAR use TeamViewer?</h3>
                  <p className="text-muted-foreground">
                    SPEAR uses TeamViewer because it offers comprehensive features for enterprise users, excellent security, and reliable performance for remote device management.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
