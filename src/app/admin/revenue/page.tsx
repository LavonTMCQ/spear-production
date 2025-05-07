"use client";

import { AdminTitle } from "@/components/admin/admin-title";
import { SectionTitle } from "@/components/admin/section-title";
import { RevenueAnalytics } from "@/components/admin/revenue-analytics";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RevenuePage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <AdminTitle 
        title="Revenue & Analytics" 
        description="Track revenue, subscriptions, and business performance"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        }
      />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <RevenueAnalytics />
        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-6">
          <SectionTitle 
            title="Subscription Management" 
            description="Manage all subscription plans and billing"
          />
          
          <div className="bg-card rounded-lg border p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Subscription Analytics</h3>
            <p className="text-muted-foreground mb-6">
              Detailed subscription analytics will be displayed here.
            </p>
            <Button>View Subscriptions</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-6">
          <SectionTitle 
            title="Customer Analytics" 
            description="Analyze customer behavior and value"
          />
          
          <div className="bg-card rounded-lg border p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Customer Analytics</h3>
            <p className="text-muted-foreground mb-6">
              Detailed customer analytics will be displayed here.
            </p>
            <Button>View Customers</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="forecasts" className="space-y-6">
          <SectionTitle 
            title="Revenue Forecasts" 
            description="Projected revenue and growth analysis"
          />
          
          <div className="bg-card rounded-lg border p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Revenue Forecasts</h3>
            <p className="text-muted-foreground mb-6">
              Detailed revenue forecasts will be displayed here.
            </p>
            <Button>View Forecasts</Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <SectionTitle 
        title="Financial Reports" 
        description="Download and export financial reports"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Report</CardTitle>
            <CardDescription>Detailed monthly revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This report includes a detailed breakdown of revenue by service, subscription type, and customer.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Download PDF</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription Report</CardTitle>
            <CardDescription>Active and churned subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This report includes details on active subscriptions, new subscriptions, and churn rate analysis.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Download PDF</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Annual Financial Report</CardTitle>
            <CardDescription>Yearly financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This report includes annual revenue, growth metrics, and year-over-year comparisons.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Download PDF</Button>
          </CardFooter>
        </Card>
      </div>
      
      <SectionTitle 
        title="Revenue Settings" 
        description="Configure revenue tracking and reporting"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing Settings</CardTitle>
            <CardDescription>Configure billing and payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure payment gateways, billing cycles, and invoice settings for your subscriptions.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Manage Settings</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
            <CardDescription>Configure automated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set up automated financial reports to be generated and sent to stakeholders on a schedule.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Manage Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
