"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    keywords: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Calculate estimated read time (1 minute per 200 words)
  const wordCount = article.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // Format date
  const formattedDate = new Date(article.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // Truncate content for preview
  const previewContent = article.content.length > 150
    ? article.content.substring(0, 150) + "..."
    : article.content;

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardContent className="flex-grow pt-6">
        <Link href={`/knowledge-base/${article.slug}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {article.title}
          </h3>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-3">
          <div className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>{readTime} min read</span>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">{previewContent}</p>
        <div className="flex items-center">
          <TagIcon className="h-3 w-3 mr-1 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {article.keywords.slice(0, 3).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {article.keywords.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.keywords.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6">
        <Link
          href={`/knowledge-base/${article.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Read More →
        </Link>
      </CardFooter>
    </Card>
  );
}
