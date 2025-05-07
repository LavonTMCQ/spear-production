"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon, FolderIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface KnowledgeBaseSidebarProps {
  categories: {
    name: string;
    slug: string;
    count: number;
  }[];
}

export function KnowledgeBaseSidebar({ categories }: KnowledgeBaseSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate to search results
    window.location.href = `/knowledge-base/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <>
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full flex justify-between"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span>Knowledge Base Categories</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-4 w-4 transition-transform", isMobileMenuOpen ? "rotate-180" : "")}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Button>
      </div>

      <div className={cn(
        "space-y-4",
        isMobileMenuOpen ? "block" : "hidden lg:block"
      )}>
        <form onSubmit={handleSearch} className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/knowledge-base"
                className={cn(
                  "flex items-center py-1 px-2 rounded-md hover:bg-accent hover:text-accent-foreground",
                  pathname === "/knowledge-base" && "bg-accent text-accent-foreground"
                )}
              >
                <FolderIcon className="h-4 w-4 mr-2" />
                <span>All Articles</span>
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/knowledge-base/category/${category.slug}`}
                  className={cn(
                    "flex items-center justify-between py-1 px-2 rounded-md hover:bg-accent hover:text-accent-foreground",
                    pathname === `/knowledge-base/category/${category.slug}` && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2" />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Popular Articles</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/knowledge-base/getting-started-with-spear"
                className="text-muted-foreground hover:text-foreground block py-1"
              >
                Getting Started with SPEAR
              </Link>
            </li>
            <li>
              <Link
                href="/knowledge-base/teamviewer-integration-guide"
                className="text-muted-foreground hover:text-foreground block py-1"
              >
                TeamViewer Integration Guide
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </>
  );
}
