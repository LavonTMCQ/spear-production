"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetaTags } from "@/components/seo/meta-tags";
import { WebsiteLD, ArticleLD } from "@/components/seo/json-ld";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

// Mock blog posts data
const mockPosts = [
  {
    id: "1",
    title: "The Future of Remote Device Management",
    slug: "future-of-remote-device-management",
    excerpt: "Explore how AI, automation, and advanced security are transforming remote device management for enterprises.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "/images/blog/remote-management.jpg",
    author: {
      name: "Alex Johnson",
      avatar: "/images/avatars/alex.jpg",
      title: "CTO"
    },
    category: "Technology",
    tags: ["remote management", "AI", "security", "automation"],
    publishedAt: "2023-06-15T00:00:00.000Z",
    readTime: 8,
    featured: true
  },
  {
    id: "2",
    title: "TeamViewer: The Ultimate Remote Access Solution",
    slug: "teamviewer-ultimate-remote-access",
    excerpt: "An in-depth look at TeamViewer's enterprise features and why it's the preferred choice for professional remote device management.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "/images/blog/comparison.jpg",
    author: {
      name: "Sarah Chen",
      avatar: "/images/avatars/sarah.jpg",
      title: "Product Manager"
    },
    category: "Remote Access",
    tags: ["TeamViewer", "remote access", "enterprise", "security"],
    publishedAt: "2023-05-22T00:00:00.000Z",
    readTime: 12,
    featured: true
  },
  {
    id: "3",
    title: "Securing Your Remote Access Infrastructure",
    slug: "securing-remote-access-infrastructure",
    excerpt: "Best practices for ensuring your remote access solutions are secure, compliant, and protected against emerging threats.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "/images/blog/security.jpg",
    author: {
      name: "Michael Rodriguez",
      avatar: "/images/avatars/michael.jpg",
      title: "Security Specialist"
    },
    category: "Security",
    tags: ["security", "compliance", "best practices", "remote access"],
    publishedAt: "2023-04-10T00:00:00.000Z",
    readTime: 10,
    featured: false
  },
  {
    id: "4",
    title: "Optimizing Remote Support for Enterprise Teams",
    slug: "optimizing-remote-support-enterprise",
    excerpt: "Strategies and tools to streamline remote support operations for large enterprise teams.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "/images/blog/enterprise.jpg",
    author: {
      name: "Emily Watson",
      avatar: "/images/avatars/emily.jpg",
      title: "Enterprise Solutions Director"
    },
    category: "Enterprise",
    tags: ["enterprise", "remote support", "team management", "efficiency"],
    publishedAt: "2023-03-18T00:00:00.000Z",
    readTime: 7,
    featured: false
  },
  {
    id: "5",
    title: "The ROI of Integrated Remote Access Solutions",
    slug: "roi-integrated-remote-access",
    excerpt: "How businesses are achieving significant ROI by implementing integrated remote access platforms like SPEAR.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "/images/blog/roi.jpg",
    author: {
      name: "David Park",
      avatar: "/images/avatars/david.jpg",
      title: "Business Analyst"
    },
    category: "Business",
    tags: ["ROI", "business value", "integration", "case study"],
    publishedAt: "2023-02-05T00:00:00.000Z",
    readTime: 9,
    featured: false
  },
  {
    id: "6",
    title: "Remote Access for Healthcare: Ensuring HIPAA Compliance",
    slug: "remote-access-healthcare-hipaa",
    excerpt: "How healthcare organizations can implement remote access solutions while maintaining HIPAA compliance and patient data security.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "/images/blog/healthcare.jpg",
    author: {
      name: "Jennifer Lee",
      avatar: "/images/avatars/jennifer.jpg",
      title: "Healthcare Solutions Specialist"
    },
    category: "Healthcare",
    tags: ["healthcare", "HIPAA", "compliance", "security"],
    publishedAt: "2023-01-20T00:00:00.000Z",
    readTime: 11,
    featured: false
  }
];

// Categories derived from posts
const categories = [
  { name: "All", slug: "all" },
  { name: "Technology", slug: "technology" },
  { name: "Security", slug: "security" },
  { name: "Enterprise", slug: "enterprise" },
  { name: "Comparison", slug: "comparison" },
  { name: "Business", slug: "business" },
  { name: "Healthcare", slug: "healthcare" },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);

  useEffect(() => {
    // Filter posts based on search query and active category
    let filtered = mockPosts;

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter(post =>
        post.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    setFilteredPosts(filtered);

    // Set featured posts
    setFeaturedPosts(mockPosts.filter(post => post.featured));
  }, [searchQuery, activeCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <MetaTags
        title="SPEAR Blog - Remote Device Management Insights & Best Practices"
        description="Explore the latest insights, tutorials, and best practices for remote device management, security, compliance, and TeamViewer integration."
        keywords="remote device management, TeamViewer integration, security best practices, compliance, SPEAR platform"
        ogType="website"
        ogImage="/images/blog/remote-management.jpg"
      />
      <WebsiteLD
        name="SPEAR Blog"
        description="Insights, guides, and news about remote device management and access solutions"
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-foreground/5 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
              SPEAR Blog
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Insights, guides, and news about remote device management and access solutions
            </p>
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && !searchQuery && activeCategory === "all" && (
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <div key={post.id} className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden">
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 bg-black/30 z-10"></div>
                    <div className="absolute bottom-0 left-0 z-20 p-6">
                      <Badge className="mb-3">{post.category}</Badge>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-white/80 text-sm space-x-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x450/slate/white?text=SPEAR+Blog";
                      }}
                    />
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/100/slate/white?text=User";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">{post.author.title}</p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" className="group">
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : activeCategory !== "all"
                ? `${activeCategory} Articles`
                : "All Articles"}
          </h2>
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2">
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={activeCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.slug)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="group flex flex-col h-full rounded-xl border bg-card shadow-sm transition-all hover:shadow-md overflow-hidden">
                <div className="aspect-video w-full overflow-hidden relative">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/800x450/slate/white?text=SPEAR+Blog";
                    }}
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <Badge className="mb-2">{post.category}</Badge>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-3">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-center">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/100/slate/white?text=User";
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{post.author.name}</span>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="group">
                      <Link href={`/blog/${post.slug}`}>
                        Read
                        <ArrowRightIcon className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `No articles matching "${searchQuery}"`
                : `No articles in the ${activeCategory} category`}
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}>
              View All Articles
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter to receive the latest updates, articles, and insights about remote device management.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
