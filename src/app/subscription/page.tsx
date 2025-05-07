"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, CreditCardIcon, XMarkIcon, ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { 
  getMockSubscription, 
  subscriptionPlans, 
  updateSubscriptionPlan, 
  cancelSubscription,
  reactivateSubscription,
  type Subscription,
  type SubscriptionPlan
} from "@/lib/subscription-service";
import { PaymentMethodsSection } from "@/components/subscription/payment-methods";
import { InvoiceHistory } from "@/components/subscription/invoice-history";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    // Fetch subscription data
    const fetchSubscription = async () => {
      try {
        const data = getMockSubscription('user_123');
        setSubscription(data);
        setSelectedPlanId(data.plan.id);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleUpgrade = async () => {
    if (!subscription || !selectedPlanId) return;
    
    setUpgrading(true);
    try {
      const updatedSubscription = await updateSubscriptionPlan(
        subscription.id,
        selectedPlanId
      );
      setSubscription(updatedSubscription);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancel = async (immediate: boolean = false) => {
    if (!subscription) return;
    
    setCanceling(true);
    try {
      const updatedSubscription = await cancelSubscription(
        subscription.id,
        !immediate // cancelAtPeriodEnd = !immediate
      );
      setSubscription(updatedSubscription);
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setCanceling(false);
    }
  };

  const handleReactivate = async () => {
    if (!subscription) return;
    
    setReactivating(true);
    try {
      const updatedSubscription = await reactivateSubscription(
        subscription.id
      );
      setSubscription(updatedSubscription);
    } catch (error) {
      console.error('Error reactivating subscription:', error);
    } finally {
      setReactivating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Alert variant="destructive" className="max-w-md">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load subscription details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isCurrentPlan = (planId: string) => subscription.plan.id === planId;
  const isUpgrade = (plan: SubscriptionPlan) => plan.price > subscription.plan.price;
  const isDowngrade = (plan: SubscriptionPlan) => plan.price < subscription.plan.price;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your subscription and payment methods
        </p>
      </div>

      {subscription.status === 'canceled' ? (
        <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <ExclamationTriangleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-600 dark:text-red-400">Subscription Canceled</AlertTitle>
          <AlertDescription className="text-red-600/90 dark:text-red-400/90">
            Your subscription has been canceled and will not renew.
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                onClick={handleReactivate}
                disabled={reactivating}
              >
                {reactivating ? 'Reactivating...' : 'Reactivate Subscription'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : subscription.cancelAtPeriodEnd ? (
        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-600 dark:text-amber-400">Subscription Ending</AlertTitle>
          <AlertDescription className="text-amber-600/90 dark:text-amber-400/90">
            Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. You will lose access to all devices after this date.
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                onClick={handleReactivate}
                disabled={reactivating}
              >
                {reactivating ? 'Reactivating...' : 'Continue Subscription'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="plan" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plan">Subscription Plan</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all ${
                  isCurrentPlan(plan.id) 
                    ? 'border-primary shadow-md' 
                    : 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">/{plan.interval}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrentPlan(plan.id) ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={isUpgrade(plan) ? "default" : "outline"}
                      className="w-full"
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        handleUpgrade();
                      }}
                      disabled={upgrading}
                    >
                      {upgrading && selectedPlanId === plan.id
                        ? "Updating..."
                        : isUpgrade(plan)
                        ? "Upgrade"
                        : isDowngrade(plan)
                        ? "Downgrade"
                        : "Switch"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Plan</h3>
                    <p className="font-medium">{subscription.plan.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div>
                      <Badge 
                        variant={subscription.status === 'active' ? 'default' : 'destructive'}
                        className="mt-1"
                      >
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </Badge>
                      {subscription.cancelAtPeriodEnd && (
                        <Badge variant="outline" className="ml-2 mt-1">
                          Cancels at period end
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Current Period</h3>
                    <p>{formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Next Payment</h3>
                    <p>
                      {subscription.cancelAtPeriodEnd 
                        ? 'No upcoming payments' 
                        : `$${subscription.plan.price} on ${formatDate(subscription.currentPeriodEnd)}`
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-sm text-muted-foreground">
                  {subscription.cancelAtPeriodEnd 
                    ? `Your subscription will end on ${formatDate(subscription.currentPeriodEnd)}`
                    : subscription.status === 'canceled'
                    ? 'Your subscription has been canceled'
                    : `You will be charged $${subscription.plan.price} on ${formatDate(subscription.currentPeriodEnd)}`
                  }
                </div>
                {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <PaymentMethodsSection 
            paymentMethods={subscription.paymentMethods} 
            onUpdate={(methods) => {
              setSubscription({
                ...subscription,
                paymentMethods: methods
              });
            }}
          />
        </TabsContent>

        <TabsContent value="history">
          <InvoiceHistory invoices={subscription.invoices} />
        </TabsContent>
      </Tabs>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">What happens when you cancel:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>You'll continue to have access until the end of your billing period ({formatDate(subscription.currentPeriodEnd)})</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>You won't be charged again</span>
                </li>
                <li className="flex items-start">
                  <XMarkIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span>You'll lose access to all connected devices after your billing period ends</span>
                </li>
              </ul>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-medium">Cancel immediately?</h3>
              <p className="text-sm text-muted-foreground">
                If you cancel immediately, you'll lose access right away and won't receive a refund for the current billing period.
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleCancel(true)}
                disabled={canceling}
              >
                {canceling ? 'Canceling...' : 'Cancel Immediately'}
              </Button>
            </div>
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="ghost" 
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Subscription
            </Button>
            <Button 
              variant="default"
              onClick={() => handleCancel(false)}
              disabled={canceling}
            >
              {canceling ? 'Canceling...' : 'Cancel at Period End'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
