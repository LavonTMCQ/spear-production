"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowLeftIcon, PlayIcon } from "@heroicons/react/24/outline";

export default function LearnMorePage() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header with logo and back button */}
      <header className="container mx-auto pt-8 px-4">
        <div className="flex justify-between items-center">
          <Link href="/login">
            <Button variant="ghost" className="flex items-center text-white hover:text-blue-400">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
          <div className="flex items-center">
            <Image 
              src="/images/spear-logo.PNG" 
              alt="SPEAR Logo" 
              width={50} 
              height={50} 
              className="mr-3"
            />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              SPEAR
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">SPEAR</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-slate-300 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Secure Platform for Extended Augmented Reality - The ultimate solution for remote device management and location verification
        </motion.p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
            <TabsTrigger value="demo">Demo Video</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Secure Remote Access</h3>
                  <p className="text-slate-300">
                    Access and control remote devices securely through TeamViewer integration with enterprise-grade security features.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Location Verification</h3>
                  <p className="text-slate-300">
                    Verify device presence at specific locations with geofencing capabilities and automated location logging.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Compliance Solutions</h3>
                  <p className="text-slate-300">
                    Maintain compliance with automated verification of device presence and secure documentation of check-ins.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Discord Integration</h3>
                  <p className="text-slate-300">
                    Seamless communication with Discord integration, including admin panel and mini chat widget for immediate support.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Comprehensive Analytics</h3>
                  <p className="text-slate-300">
                    Gain insights with detailed analytics on device usage, connection history, and compliance metrics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="use-cases" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Remote Compliance Verification</h3>
                  <p className="text-slate-300 mb-4">
                    SPEAR allows organizations to verify compliance requirements by placing devices at specific locations. Users can remotely access these devices to complete required check-ins or verifications.
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Automated location verification
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Secure audit trails
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Time-based access controls
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Distributed Location Management</h3>
                  <p className="text-slate-300 mb-4">
                    Organizations with multiple physical locations can use SPEAR to maintain a presence at each location without requiring staff to be physically present at all times.
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Reduced travel requirements
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Efficient resource allocation
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Centralized management
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Field Verification Systems</h3>
                  <p className="text-slate-300 mb-4">
                    SPEAR enables organizations to verify field operations by placing devices at key locations where verification is required, allowing remote check-ins and status updates.
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Real-time verification
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Photographic evidence
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      GPS-verified locations
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Compliance-Heavy Industries</h3>
                  <p className="text-slate-300 mb-4">
                    Industries with strict compliance requirements can use SPEAR to maintain and document compliance with location-based regulations and requirements.
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Comprehensive audit trails
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Secure documentation
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Regulatory compliance
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="demo" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                {!videoPlaying ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image 
                        src="/images/spear-logo.PNG" 
                        alt="SPEAR Demo Video Thumbnail" 
                        fill
                        className="object-contain opacity-20"
                      />
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <Button 
                          onClick={() => setVideoPlaying(true)}
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center mb-4"
                        >
                          <PlayIcon className="h-8 w-8" />
                        </Button>
                        <p className="text-white text-xl font-medium">Watch Demo Video</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-white text-center p-8">
                      This is where the actual demo video would play. In a real implementation, this would be an embedded video player showing how SPEAR works.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">See SPEAR in Action</h3>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  The demo video shows how SPEAR can be used to remotely access devices, verify locations, and maintain compliance with location-based requirements.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Experience the power of SPEAR for your organization's remote device management and location verification needs.
          </p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg">
              Return to Login
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
