"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MetaTags } from "@/components/seo/meta-tags";
import { OrganizationLD, WebsiteLD } from "@/components/seo/json-ld";
import {
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ChartBarIcon,
  ServerIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <>
      <MetaTags
        title="SPEAR - Secure Platform for Extended Augmented Reality"
        description="SPEAR provides enterprise-grade remote device management with security, location verification, and compliance solutions for various industries."
        keywords="remote device management, TeamViewer integration, security, compliance, location verification"
        ogType="website"
        ogImage="/images/spear-og-image.jpg"
      />
      <OrganizationLD />
      <WebsiteLD />

      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-foreground/5 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Secure Remote Device Management
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                  SPEAR provides enterprise-grade remote access with security, location verification, and compliance solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/hero-dashboard.jpg"
                  alt="SPEAR Dashboard"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/800x600/slate/white?text=SPEAR+Platform";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comprehensive Remote Management
              </h2>
              <p className="text-xl text-muted-foreground">
                SPEAR combines powerful features to provide a complete remote device management solution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Remote Access</h3>
                <p className="text-muted-foreground">
                  Securely access and control remote devices from anywhere with TeamViewer integration.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  End-to-end encryption, multi-factor authentication, and detailed audit logs.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPinIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Location Verification</h3>
                <p className="text-muted-foreground">
                  Verify device locations for compliance and security requirements.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ChartBarIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive reporting and analytics for device usage and performance.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ServerIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Device Provisioning</h3>
                <p className="text-muted-foreground">
                  Streamlined device setup and configuration for quick deployment.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <UserGroupIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Collaborative tools for support teams to work together efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your remote device management?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of organizations using SPEAR to secure and streamline their remote operations.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/blog">Read Our Blog</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted py-12 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center">
                  <Image
                    src="/images/spear-logo.PNG"
                    alt="SPEAR Logo"
                    width={40}
                    height={40}
                    className="mr-2"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/40/slate/white?text=SPEAR";
                    }}
                  />
                  <span className="text-xl font-bold">SPEAR</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Secure Platform for Extended Augmented Reality
                </p>
              </div>
              <div className="flex flex-wrap gap-6">
                <Link href="/about" className="text-sm hover:text-primary">About</Link>
                <Link href="/blog" className="text-sm hover:text-primary">Blog</Link>
                <Link href="/faq" className="text-sm hover:text-primary">FAQ</Link>
                <Link href="/contact" className="text-sm hover:text-primary">Contact</Link>
                <Link href="/privacy" className="text-sm hover:text-primary">Privacy</Link>
                <Link href="/terms" className="text-sm hover:text-primary">Terms</Link>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SPEAR Platform. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
