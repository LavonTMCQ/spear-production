import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { subscriptionId } = body;
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }
    
    // Get subscription from database
    const dbSubscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: session.user.id,
      },
    });
    
    if (!dbSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }
    
    // Reactivate subscription in Stripe
    const subscription = await stripe.subscriptions.update(
      dbSubscription.stripeSubId,
      {
        cancel_at_period_end: false,
      }
    );
    
    // If subscription is already canceled, create a new one with the same plan
    if (subscription.status === 'canceled') {
      // Get the original plan ID
      const originalSubscription = await stripe.subscriptions.retrieve(
        dbSubscription.stripeSubId
      );
      
      const planId = originalSubscription.items.data[0].price.id;
      
      // Get or create customer
      let customer;
      const existingCustomers = await stripe.customers.list({
        email: session.user.email,
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name || undefined,
          metadata: {
            userId: session.user.id,
          },
        });
      }
      
      // Create a new subscription
      const newSubscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: planId }],
        metadata: {
          userId: session.user.id,
        },
      });
      
      // Update the subscription in the database
      await prisma.subscription.update({
        where: {
          id: dbSubscription.id,
        },
        data: {
          stripeSubId: newSubscription.id,
          status: newSubscription.status,
          currentPeriodEnd: new Date(newSubscription.current_period_end * 1000),
        },
      });
      
      return NextResponse.json({ subscription: newSubscription });
    }
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return NextResponse.json(
      { error: 'Error reactivating subscription' },
      { status: 500 }
    );
  }
}
