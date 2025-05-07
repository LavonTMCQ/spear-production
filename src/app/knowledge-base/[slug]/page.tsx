"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { KnowledgeBaseSidebar } from "@/components/knowledge-base/knowledge-base-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ClockIcon, 
  TagIcon,
  ShareIcon,
  PrinterIcon,
  BookmarkIcon
} from "@heroicons/react/24/outline";

// Mock categories data
const categories = [
  { name: "Guides", slug: "guides", count: 5 },
  { name: "Integrations", slug: "integrations", count: 3 },
  { name: "Troubleshooting", slug: "troubleshooting", count: 2 },
  { name: "Security", slug: "security", count: 1 },
];

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    // Fetch article from the API
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/knowledge-base?slug=${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data);
        
        // Fetch related articles
        const relatedResponse = await fetch('/api/knowledge-base');
        if (relatedResponse.ok) {
          const allArticles = await relatedResponse.json();
          // Filter out current article and limit to 3 related articles
          const related = allArticles
            .filter((a: any) => a.id !== data.id)
            .filter((a: any) => {
              // Find articles with matching keywords or category
              return (
                a.category === data.category ||
                a.keywords.some((keyword: string) => 
                  data.keywords.includes(keyword)
                )
              );
            })
            .slice(0, 3);
          
          setRelatedArticles(related);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  // Calculate estimated read time (1 minute per 200 words)
  const wordCount = article?.content.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // Format date
  const formattedDate = article?.updatedAt 
    ? new Date(article.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : '';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: `Check out this article: ${article?.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <KnowledgeBaseSidebar categories={categories} />
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
              <div className="h-64 bg-muted animate-pulse rounded-lg mt-6"></div>
            </div>
          ) : article ? (
            <div>
              <Link 
                href="/knowledge-base" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Knowledge Base
              </Link>
              
              <article className="prose prose-slate dark:prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                
                <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6 gap-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Updated: {formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{readTime} min read</span>
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="h-4 w-4 mr-1" />
                    <Badge variant="secondary">{article.category}</Badge>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center">
                    <PrinterIcon className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center">
                    <ShareIcon className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <BookmarkIcon className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
                
                <div className="mt-8">
                  {/* This would be replaced with a proper markdown renderer in production */}
                  <p>{article.content}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-8">
                  {article.keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </article>
              
              {relatedArticles.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedArticles.map((relatedArticle) => (
                      <Link 
                        key={relatedArticle.id}
                        href={`/knowledge-base/${relatedArticle.slug}`}
                        className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <h3 className="font-medium mb-1">{relatedArticle.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {relatedArticle.content.substring(0, 80)}...
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been moved.
              </p>
              <Button asChild>
                <Link href="/knowledge-base">
                  Return to Knowledge Base
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
