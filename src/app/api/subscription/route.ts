import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeConfig } from "@/lib/stripe-config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

// Initialize Stripe client for server-side only
const stripeClient = stripe || new Stripe(stripeConfig.secretKey, {
  apiVersion: '2025-04-30.basil',
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's subscription from database
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.user.id,
      },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({ subscription: null });
    }

    // Get the active subscription from Stripe
    const activeSubscription = subscriptions.find((sub: any) => sub.status === 'active');

    if (activeSubscription) {
      const stripeSubscription = await stripeClient.subscriptions.retrieve(
        activeSubscription.stripeSubId
      );

      return NextResponse.json({
        subscription: {
          id: activeSubscription.id,
          stripeSubId: activeSubscription.stripeSubId,
          status: activeSubscription.status,
          currentPeriodEnd: activeSubscription.currentPeriodEnd,
          plan: stripeSubscription.items.data[0].plan,
        }
      });
    }

    return NextResponse.json({ subscription: subscriptions[0] });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Error fetching subscription' },
      { status: 500 }
    );
  }
}

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
    const { priceId, paymentMethodId } = body;

    // Get or create customer
    let customer;
    const existingCustomers = await stripeClient.customers.list({
      email: session.user.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripeClient.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      });
    }

    // Attach payment method to customer
    if (paymentMethodId) {
      await stripeClient.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });

      // Set as default payment method
      await stripeClient.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Create subscription
    const subscription = await stripeClient.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Error creating subscription' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { subscriptionId, priceId } = body;

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

    // Update subscription in Stripe
    const subscription = await stripeClient.subscriptions.retrieve(
      dbSubscription.stripeSubId
    );

    const updatedSubscription = await stripeClient.subscriptions.update(
      subscription.id,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
      }
    );

    return NextResponse.json({ subscription: updatedSubscription });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Error updating subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const subscriptionId = searchParams.get('id');
    const cancelAtPeriodEnd = searchParams.get('cancelAtPeriodEnd') === 'true';

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

    // Cancel subscription in Stripe
    const subscription = await stripeClient.subscriptions.update(
      dbSubscription.stripeSubId,
      {
        cancel_at_period_end: cancelAtPeriodEnd,
      }
    );

    if (!cancelAtPeriodEnd) {
      // Immediately cancel
      await stripeClient.subscriptions.cancel(dbSubscription.stripeSubId);
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Error canceling subscription' },
      { status: 500 }
    );
  }
}