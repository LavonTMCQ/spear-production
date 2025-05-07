import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeConfig } from "@/lib/stripe-config";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

// Initialize Stripe client for server-side only
const stripeClient = stripe || new Stripe(stripeConfig.secretKey, {
  apiVersion: '2025-04-30.basil',
});

// Disable body parsing, need the raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') as string;

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event;
    try {
      event = stripeClient.webhooks.constructEvent(
        body,
        signature,
        stripeConfig.webhookSecret
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionChange(subscription);
        break;
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionDeletion(deletedSubscription);
        break;
      case 'invoice.payment_succeeded':
        // Handle successful payment
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Error handling webhook' },
      { status: 500 }
    );
  }
}

// Helper functions to handle subscription events
async function handleSubscriptionChange(subscription: any) {
  // Update subscription in database
  try {
    await prisma.subscription.upsert({
      where: {
        stripeSubId: subscription.id,
      },
      update: {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      create: {
        stripeSubId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        userId: subscription.metadata.userId,
      },
    });
  } catch (error) {
    console.error('Error updating subscription in database:', error);
  }
}

async function handleSubscriptionDeletion(subscription: any) {
  // Update subscription status to canceled
  try {
    await prisma.subscription.update({
      where: {
        stripeSubId: subscription.id,
      },
      data: {
        status: 'canceled',
      },
    });
  } catch (error) {
    console.error('Error updating subscription in database:', error);
  }
}