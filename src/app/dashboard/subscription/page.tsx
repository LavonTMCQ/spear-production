"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  CreditCardIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  ClockIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import PaymentMethodForm from "@/components/payment/PaymentMethodForm";

// Enhanced subscription data
const subscription = {
  id: "1",
  plan: "Basic Plan",
  status: "active",
  price: 350,
  billingCycle: "monthly",
  nextBillingDate: "May 13, 2023",
  startDate: "April 13, 2023",
  devices: 2,
  maxDevices: 5,
  features: [
    { name: "Remote Access", included: true },
    { name: "Location Verification", included: true },
    { name: "Session Recording", included: true },
    { name: "Priority Support", included: false },
    { name: "Custom Branding", included: false },
    { name: "API Access", included: false },
  ],
  paymentMethod: {
    type: "credit_card",
    brand: "Visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2024,
  },
};

// Enhanced billing history
const billingHistory = [
  {
    id: "inv-001",
    date: "April 13, 2023",
    amount: 350,
    status: "paid",
    description: "Basic Plan - Monthly Subscription",
  },
  {
    id: "inv-002",
    date: "March 13, 2023",
    amount: 350,
    status: "paid",
    description: "Basic Plan - Monthly Subscription",
  },
  {
    id: "inv-003",
    date: "February 13, 2023",
    amount: 350,
    status: "paid",
    description: "Basic Plan - Monthly Subscription",
  },
];

// Available plans for upgrade
const availablePlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 350,
    billingCycle: "monthly",
    description: "Essential features for small teams",
    features: [
      "Up to 5 devices",
      "Remote Access",
      "Location Verification",
      "Session Recording",
      "Standard Support",
    ],
    current: true,
  },
  {
    id: "professional",
    name: "Professional Plan",
    price: 750,
    billingCycle: "monthly",
    description: "Advanced features for growing businesses",
    features: [
      "Up to 15 devices",
      "Remote Access",
      "Location Verification",
      "Session Recording",
      "Priority Support",
      "Custom Branding",
    ],
    current: false,
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 1500,
    billingCycle: "monthly",
    description: "Complete solution for large organizations",
    features: [
      "Unlimited devices",
      "Remote Access",
      "Location Verification",
      "Session Recording",
      "Priority Support",
      "Custom Branding",
      "API Access",
      "Dedicated Account Manager",
    ],
    current: false,
  },
];

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);

    try {
      // Check if user has a payment method
      const hasPaymentMethod = subscription.paymentMethod && subscription.paymentMethod.id;

      if (!hasPaymentMethod) {
        // Show payment method form
        toast.error("Please add a payment method before upgrading");
        document.querySelector('[data-value="payment"]')?.click();
        setIsLoading(false);
        return;
      }

      // Call API to upgrade subscription
      // In a real implementation, this would call your backend API
      // For now, we'll simulate the API call
      setTimeout(() => {
        toast.success(`Upgraded to ${availablePlans.find(p => p.id === planId)?.name}`);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast.error('Failed to upgrade subscription');
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Subscription cancellation request submitted");
      setIsLoading(false);
    }, 1500);
  };

  const handleUpdatePaymentMethod = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Payment method updated successfully");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your subscription, billing, and payment information
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Subscription</CardTitle>
                  <Badge className={subscription.status === "active" ? "bg-green-500" : "bg-red-500"}>
                    {subscription.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>
                  Your subscription details and usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Plan</h3>
                    <p className="text-lg font-semibold">{subscription.plan}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                    <p className="text-lg font-semibold">${subscription.price}/{subscription.billingCycle}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Billing Cycle</h3>
                    <p className="text-lg font-semibold capitalize">{subscription.billingCycle}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Next Billing Date</h3>
                    <p className="text-lg font-semibold">{subscription.nextBillingDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                    <p className="text-lg font-semibold">{subscription.startDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                    <p className="text-lg font-semibold">{subscription.paymentMethod.brand} ending in {subscription.paymentMethod.last4}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Device Usage</h3>
                    <p className="text-sm text-muted-foreground">{subscription.devices} of {subscription.maxDevices} devices</p>
                  </div>
                  <Progress value={(subscription.devices / subscription.maxDevices) * 100} className="h-2" />
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-4">Included Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {feature.included ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className={feature.included ? "" : "text-muted-foreground"}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => document.querySelector('[data-value="plans"]')?.click()}>
                  Upgrade Plan
                </Button>
                <Button variant="destructive" onClick={handleCancelSubscription} disabled={isLoading}>
                  {isLoading ? "Processing..." : "Cancel Subscription"}
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => document.querySelector('[data-value="payment"]')?.click()}>
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Update Payment Method
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => document.querySelector('[data-value="billing"]')?.click()}>
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    View Billing History
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/help">
                      <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                      Get Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">${subscription.price}.00</p>
                        <p className="text-sm text-muted-foreground">Due on {subscription.nextBillingDate}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Your card ending in {subscription.paymentMethod.last4} will be charged automatically.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Plans & Pricing Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <Card key={plan.id} className={plan.current ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.current && (
                      <Badge>Current Plan</Badge>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground ml-1">/{plan.billingCycle}</span>
                  </div>
                  <Separator />
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current || isLoading}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {isLoading ? "Processing..." : plan.current ? "Current Plan" : "Upgrade"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Plan Comparison</CardTitle>
              <CardDescription>
                Compare features across different plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Basic</TableHead>
                    <TableHead>Professional</TableHead>
                    <TableHead>Enterprise</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Devices</TableCell>
                    <TableCell>Up to 5</TableCell>
                    <TableCell>Up to 15</TableCell>
                    <TableCell>Unlimited</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Remote Access</TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Location Verification</TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Session Recording</TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Priority Support</TableCell>
                    <TableCell><XMarkIcon className="h-5 w-5 text-muted-foreground" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Custom Branding</TableCell>
                    <TableCell><XMarkIcon className="h-5 w-5 text-muted-foreground" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">API Access</TableCell>
                    <TableCell><XMarkIcon className="h-5 w-5 text-muted-foreground" /></TableCell>
                    <TableCell><XMarkIcon className="h-5 w-5 text-muted-foreground" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dedicated Account Manager</TableCell>
                    <TableCell><XMarkIcon className="h-5 w-5 text-muted-foreground" /></TableCell>
                    <TableCell><XMarkIcon className="h-5 w-5 text-muted-foreground" /></TableCell>
                    <TableCell><CheckIcon className="h-5 w-5 text-green-500" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={invoice.status === "paid" ? "bg-green-500" : "bg-amber-500"}>
                          {invoice.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">John Doe</p>
                  <p>123 Main Street</p>
                  <p>Apt 4B</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Update Address</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">John Doe</p>
                  <p>john.doe@example.com</p>
                  <p>+1 (555) 123-4567</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Update Contact</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white">
                      <CreditCardIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{subscription.paymentMethod.brand} ending in {subscription.paymentMethod.last4}</p>
                      <p className="text-sm text-muted-foreground">Expires {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowPaymentForm(true)}
              >
                Add Payment Method
              </Button>
              <Button
                onClick={handleUpdatePaymentMethod}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Card"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-Renew Subscription</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically renew your subscription when it expires
                  </p>
                </div>
                <div className="flex h-6 items-center space-x-2">
                  <div className="h-4 w-8 rounded-full bg-green-500 flex items-center">
                    <div className="h-3 w-3 rounded-full bg-white ml-auto mr-0.5"></div>
                  </div>
                  <span className="text-sm">On</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Receipts</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive email receipts for all payments
                  </p>
                </div>
                <div className="flex h-6 items-center space-x-2">
                  <div className="h-4 w-8 rounded-full bg-green-500 flex items-center">
                    <div className="h-3 w-3 rounded-full bg-white ml-auto mr-0.5"></div>
                  </div>
                  <span className="text-sm">On</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Payment Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders before payments are due
                  </p>
                </div>
                <div className="flex h-6 items-center space-x-2">
                  <div className="h-4 w-8 rounded-full bg-green-500 flex items-center">
                    <div className="h-3 w-3 rounded-full bg-white ml-auto mr-0.5"></div>
                  </div>
                  <span className="text-sm">On</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stripe Payment Method Form */}
      <PaymentMethodForm
        open={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSuccess={() => {
          setShowPaymentForm(false);
          toast.success("Payment method added successfully");
        }}
      />
    </div>
  );
}
