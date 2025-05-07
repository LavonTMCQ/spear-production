"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetaTags } from "@/components/seo/meta-tags";
import { ArticleLD } from "@/components/seo/json-ld";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ShareIcon,
  BookmarkIcon,
  LinkIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from "@heroicons/react/24/outline";

// Mock blog posts data (same as in blog/page.tsx)
const mockPosts = [
  {
    id: "1",
    title: "The Future of Remote Device Management",
    slug: "future-of-remote-device-management",
    excerpt: "Explore how AI, automation, and advanced security are transforming remote device management for enterprises.",
    content: `
# The Future of Remote Device Management

Remote device management is undergoing a significant transformation, driven by advancements in artificial intelligence, automation, and security technologies. As organizations continue to embrace remote work and distributed teams, the need for efficient and secure remote device management solutions has never been greater.

## The Rise of AI in Remote Management

Artificial intelligence is revolutionizing how devices are managed remotely. AI-powered systems can now:

- **Predict device failures** before they occur, allowing for proactive maintenance
- **Automatically optimize** device performance based on usage patterns
- **Detect anomalies** that might indicate security breaches or operational issues
- **Provide intelligent assistance** to support teams, reducing resolution times

These capabilities are transforming reactive IT support into proactive device management, significantly reducing downtime and improving user experience.

## Automation: The Key to Scalability

As device fleets grow, manual management becomes increasingly impractical. Automation is the answer to scaling remote device management effectively:

1. **Zero-touch provisioning** allows new devices to be configured automatically
2. **Scheduled maintenance** can occur during off-hours without human intervention
3. **Policy enforcement** happens automatically across all devices
4. **Software updates** can be deployed seamlessly to thousands of devices simultaneously

Organizations implementing these automation capabilities are seeing dramatic improvements in operational efficiency and significant cost reductions.

## Enhanced Security for a Distributed World

With devices accessing corporate resources from anywhere, security has become the top priority for remote device management:

- **Zero Trust architectures** are replacing traditional perimeter-based security
- **Continuous authentication** ensures only authorized users access devices and resources
- **Behavioral analytics** detect unusual activity that might indicate compromise
- **Encrypted connections** protect data in transit regardless of network

The most advanced remote management platforms now integrate these security features natively, providing peace of mind for IT administrators.

## The Integration Advantage

Perhaps the most significant trend is the move toward integrated platforms that combine remote access, device management, security, and analytics in a single solution. Platforms like SPEAR represent this new generation of integrated solutions, offering:

- **Unified management** across multiple remote access technologies
- **Consistent security policies** regardless of access method
- **Comprehensive analytics** across all remote sessions
- **Streamlined workflows** that reduce operational complexity

Organizations that adopt these integrated approaches are seeing not only technical benefits but also significant business advantages through improved productivity and reduced operational costs.

## Conclusion

The future of remote device management is intelligent, automated, secure, and integrated. As these technologies continue to evolve, organizations that embrace these advancements will gain significant competitive advantages through improved operational efficiency, enhanced security, and superior user experiences.
    `,
    coverImage: "/images/blog/remote-management.jpg",
    author: {
      name: "Alex Johnson",
      avatar: "/images/avatars/alex.jpg",
      title: "CTO",
      bio: "Alex has over 15 years of experience in IT infrastructure and remote management solutions. He specializes in enterprise-scale deployments and emerging technologies."
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
      title: "Product Manager",
      bio: "Sarah is a product manager specializing in remote access solutions. She has extensive experience with TeamViewer implementations across various industries."
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
      title: "Security Specialist",
      bio: "Michael is a certified information security specialist with a focus on remote access technologies and their security implications."
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
      title: "Enterprise Solutions Director",
      bio: "Emily specializes in designing and implementing remote support solutions for Fortune 500 companies and large enterprises."
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
      title: "Business Analyst",
      bio: "David is a business analyst who helps organizations quantify the value of their technology investments, with a focus on remote access and management solutions."
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
      title: "Healthcare Solutions Specialist",
      bio: "Jennifer specializes in healthcare IT compliance and has helped numerous medical organizations implement secure remote access solutions."
    },
    category: "Healthcare",
    tags: ["healthcare", "HIPAA", "compliance", "security"],
    publishedAt: "2023-01-20T00:00:00.000Z",
    readTime: 11,
    featured: false
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find the post with the matching slug
    const foundPost = mockPosts.find(p => p.slug === slug);

    if (foundPost) {
      setPost(foundPost);

      // Find related posts (same category or shared tags)
      const related = mockPosts
        .filter(p => p.id !== foundPost.id)
        .filter(p =>
          p.category === foundPost.category ||
          p.tags.some(tag => foundPost.tags.includes(tag))
        )
        .slice(0, 3);

      setRelatedPosts(related);
    }

    setIsLoading(false);
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "SPEAR Blog Post";

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'link':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted animate-pulse rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-muted animate-pulse rounded w-3/4 mb-8"></div>
          <div className="h-64 bg-muted animate-pulse rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link href="/blog">Return to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={`${post.title} | SPEAR Blog`}
        description={post.excerpt}
        keywords={post.tags.join(", ")}
        ogType="article"
        ogImage={post.coverImage}
      />
      <ArticleLD
        headline={post.title}
        description={post.excerpt}
        image={post.coverImage}
        datePublished={post.publishedAt}
        dateModified={post.publishedAt}
        authorName={post.author.name}
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Blog
            </Link>

            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-8 gap-4">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
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
                <p className="text-sm text-muted-foreground">{post.author.title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="container mx-auto px-4 -mt-12 mb-12">
        <div className="max-w-5xl mx-auto relative aspect-[21/9] rounded-xl overflow-hidden shadow-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/1200x630/slate/white?text=SPEAR+Blog";
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8 space-y-8">
              {/* Share Buttons */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="font-semibold mb-4">Share This Article</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare('twitter')}
                    className="h-9 w-9"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                    </svg>
                    <span className="sr-only">Share on Twitter</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare('facebook')}
                    className="h-9 w-9"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                    </svg>
                    <span className="sr-only">Share on Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare('linkedin')}
                    className="h-9 w-9"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                    <span className="sr-only">Share on LinkedIn</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare('link')}
                    className="h-9 w-9"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span className="sr-only">Copy Link</span>
                  </Button>
                </div>
              </div>

              {/* Author Bio */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="font-semibold mb-4">About the Author</h3>
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
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
                    <p className="text-sm text-muted-foreground">{post.author.title}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {post.author.bio}
                </p>
              </div>

              {/* Tags */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {/* This would be replaced with a proper markdown renderer in production */}
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
            </article>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block rounded-lg border overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback if image doesn't exist
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/800x450/slate/white?text=SPEAR+Blog";
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <Badge className="mb-2" variant="secondary">{relatedPost.category}</Badge>
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-muted/50 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Enjoyed this article?</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter to receive more insights about remote device management.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-md border bg-background"
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
