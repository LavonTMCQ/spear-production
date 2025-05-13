import { usePathname } from "next/navigation";
import Script from "next/script";

interface OrganizationLDProps {
  name?: string;
  logo?: string;
  url?: string;
  sameAs?: string[];
}

export function OrganizationLD({
  name = "SPEAR Platform",
  logo = "/images/spear-logo.PNG",
  url = "https://spear-platform.com",
  sameAs = [
    "https://twitter.com/spearplatform",
    "https://www.linkedin.com/company/spear-platform",
    "https://www.facebook.com/spearplatform",
  ],
}: OrganizationLDProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://spear-platform.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": `${siteUrl}${logo}`,
    "sameAs": sameAs,
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteLDProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebsiteLD({
  name = "SPEAR Platform",
  url = "https://spear-platform.com",
  description = "SPEAR provides enterprise-grade remote device management with security, location verification, and compliance solutions for various industries.",
}: WebsiteLDProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArticleLDProps {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  publisherName?: string;
  publisherLogo?: string;
}

export function ArticleLD({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  publisherName = "SPEAR Platform",
  publisherLogo = "/images/spear-logo.PNG",
}: ArticleLDProps) {
  const pathname = usePathname();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://spear-platform.com";
  const fullUrl = `${siteUrl}${pathname}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": `${siteUrl}${image}`,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}${publisherLogo}`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  };

  return (
    <Script
      id="article-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQPageLDProps {
  questions: {
    question: string;
    answer: string;
  }[];
}

export function FAQPageLD({ questions }: FAQPageLDProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((q) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ProductLDProps {
  name: string;
  description: string;
  image: string;
  price: number;
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  ratingValue?: number;
  reviewCount?: number;
}

export function ProductLD({
  name,
  description,
  image,
  price,
  priceCurrency = "USD",
  availability = "InStock",
  ratingValue,
  reviewCount,
}: ProductLDProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://spear-platform.com";

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": `${siteUrl}${image}`,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": `https://schema.org/${availability}`,
    },
  };

  // Add reviews if provided
  if (ratingValue && reviewCount) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount,
    };
  }

  return (
    <Script
      id="product-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
