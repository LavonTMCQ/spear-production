"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { VRTitleSection } from "@/components/dashboard/vr-title-section";
import { motion } from "framer-motion";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use NextAuth signIn function
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Redirect based on user role
      // We'll check the session on the dashboard pages to determine the role
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4">
      {/* Logo and Title Section */}
      <div className="w-full max-w-4xl mb-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <Image
            src="/images/spear-logo.PNG"
            alt="SPEAR Logo"
            width={100}
            height={100}
            className="drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          />
        </motion.div>
        <VRTitleSection />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* Login Card */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full shadow-lg border-slate-700 bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="mt-1.5 text-slate-300">
                Enter your credentials to access your SPEAR dashboard
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-white bg-red-500 rounded">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="text-sm text-slate-300 p-3 bg-slate-800/50 rounded-md border border-slate-700">
                  <p className="font-medium mb-2 text-slate-200">Test Accounts</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center">
                      <span className="w-16 font-medium">Admin:</span>
                      <span className="text-slate-300">quiseforeverphilly@gmail.com / password</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-16 font-medium">Client:</span>
                      <span className="text-slate-300">client@example.com / password</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-16 font-medium">Test:</span>
                      <span className="text-slate-300">admin@example.com / password</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="flex justify-between w-full gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 text-sm border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800"
                    onClick={() => {
                      setEmail("client@example.com");
                      setPassword("password");
                    }}
                  >
                    Fill Client
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 text-sm border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800"
                    onClick={() => {
                      setEmail("quiseforeverphilly@gmail.com");
                      setPassword("password");
                    }}
                  >
                    Fill Admin
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        {/* New User Card */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="w-full h-full shadow-lg border-slate-700 bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-white">New to SPEAR?</CardTitle>
              <CardDescription className="mt-1.5 text-slate-300">
                Discover how SPEAR can transform your remote device management
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="space-y-4 text-slate-300 flex-grow">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Secure Remote Access</h3>
                    <p className="text-sm">Control remote devices with enterprise-grade security</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Location Verification</h3>
                    <p className="text-sm">Verify device presence at specific locations</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Compliance Solutions</h3>
                    <p className="text-sm">Maintain compliance with automated verification</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-slate-300 mb-4">
                  Learn more about how SPEAR can help your organization
                </p>
                <Link href="/learn-more">
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-11">
                    <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
                    Learn More About SPEAR
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>© 2023 SPEAR Technologies. All rights reserved.</p>
      </div>
    </div>
  );
}
