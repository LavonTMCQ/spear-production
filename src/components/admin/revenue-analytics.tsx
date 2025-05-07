"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

// Mock revenue data
const mockRevenueData = {
  summary: {
    totalRevenue: 128750.45,
    monthlyRecurring: 42500.00,
    yearlyRecurring: 86250.45,
    averageSubscriptionValue: 1250.00,
    customerLifetimeValue: 15000.00,
    churnRate: 2.3,
    growthRate: 8.5
  },
  services: [
    {
      name: "TeamViewer",
      revenue: 128750.45,
      customers: 63,
      growth: 8.5,
      color: "bg-blue-500"
    }
  ],
  subscriptions: [
    {
      id: "1",
      customer: "TechStart Inc",
      plan: "Enterprise",
      service: "TeamViewer",
      amount: 2500.00,
      billingCycle: "Monthly",
      startDate: "2023-01-15",
      status: "Active"
    },
    {
      id: "2",
      customer: "Global Solutions Ltd",
      plan: "Business",
      service: "TeamViewer",
      amount: 1200.00,
      billingCycle: "Monthly",
      startDate: "2023-02-10",
      status: "Active"
    },
    {
      id: "3",
      customer: "Innovate Systems",
      plan: "Enterprise",
      service: "TeamViewer",
      amount: 2200.00,
      billingCycle: "Monthly",
      startDate: "2023-03-05",
      status: "Active"
    },
    {
      id: "4",
      customer: "Tech Dynamics",
      plan: "Business",
      service: "TeamViewer",
      amount: 1000.00,
      billingCycle: "Monthly",
      startDate: "2023-04-20",
      status: "Active"
    },
    {
      id: "5",
      customer: "Future Networks",
      plan: "Enterprise",
      service: "TeamViewer",
      amount: 24000.00,
      billingCycle: "Yearly",
      startDate: "2023-01-30",
      status: "Active"
    }
  ],
  monthlyRevenue: [
    { month: "Jan", teamviewer: 9000 },
    { month: "Feb", teamviewer: 9800 },
    { month: "Mar", teamviewer: 10200 },
    { month: "Apr", teamviewer: 10800 },
    { month: "May", teamviewer: 10800 },
    { month: "Jun", teamviewer: 11600 }
  ]
};

export function RevenueAnalytics() {
  const [timeframe, setTimeframe] = useState("monthly");

  // Filter subscriptions for TeamViewer
  const filteredSubscriptions = mockRevenueData.subscriptions.filter(sub =>
    sub.service.toLowerCase() === "teamviewer"
  );

  // Calculate total revenue based on filters
  const totalFilteredRevenue = filteredSubscriptions.reduce((total, sub) => total + sub.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold">Revenue Analytics</h2>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(mockRevenueData.summary.totalRevenue)}
              </div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                {mockRevenueData.summary.growthRate}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              vs. previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Recurring Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(mockRevenueData.summary.monthlyRecurring)}
              </div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                7.2%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockRevenueData.subscriptions.filter(s => s.billingCycle === "Monthly").length} monthly subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Subscription Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(mockRevenueData.summary.averageSubscriptionValue)}
              </div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                3.5%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per subscription
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Churn Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {mockRevenueData.summary.churnRate}%
              </div>
              <div className="flex items-center text-sm text-red-500">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                0.8%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Monthly customer churn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Service</CardTitle>
          <CardDescription>
            Breakdown of revenue by remote access service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Service Filter */}
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
              >
                TeamViewer
              </Button>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockRevenueData.services.map((service) => (
                <Card key={service.name}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{service.name}</CardTitle>
                      <Badge className={service.color}>
                        {service.customers} customers
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-bold">
                        {formatCurrency(service.revenue)}
                      </div>
                      <div className="flex items-center text-sm text-green-500">
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                        {service.growth}%
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span>Revenue Share</span>
                        <span>{Math.round((service.revenue / mockRevenueData.summary.totalRevenue) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${service.color}`}
                          style={{ width: `${(service.revenue / mockRevenueData.summary.totalRevenue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Revenue chart would be displayed here</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>
                All active subscription plans
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Total: {formatCurrency(totalFilteredRevenue)}</p>
              <p className="text-xs text-muted-foreground">{filteredSubscriptions.length} subscriptions</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.customer}</TableCell>
                  <TableCell>{subscription.plan}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      subscription.service === "TeamViewer" ? "border-blue-500 text-blue-500" :
                      "border-red-500 text-red-500"
                    }>
                      {subscription.service}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(subscription.amount)}</TableCell>
                  <TableCell>{subscription.billingCycle}</TableCell>
                  <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">{subscription.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline">Export Subscriptions</Button>
          <Button>Add Subscription</Button>
        </CardFooter>
      </Card>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Lifetime Value</CardTitle>
            <CardDescription>
              Average revenue generated per customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between mb-6">
              <div className="text-3xl font-bold">
                {formatCurrency(mockRevenueData.summary.customerLifetimeValue)}
              </div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                5.2%
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>TeamViewer Customers</span>
                  <span>{formatCurrency(18500)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "62%" }}></div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>
              Projected revenue for the next 3 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between mb-6">
              <div className="text-3xl font-bold">
                {formatCurrency(135200)}
              </div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                5.0%
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Projected Growth</span>
                </div>
                <span className="text-sm font-medium">+$6,450/month</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm">Churn Risk</span>
                </div>
                <span className="text-sm font-medium">-$2,800/month</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Expansion Revenue</span>
                </div>
                <span className="text-sm font-medium">+$3,200/month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
