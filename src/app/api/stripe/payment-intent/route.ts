import { NextRequest, NextResponse } from "next/server";
import { stripe, stripeConfig } from "@/lib/stripe-config";
import { auth } from "@/lib/auth";
import Stripe from "stripe";

// Initialize Stripe client for server-side only
const stripeClient = stripe || new Stripe(stripeConfig.secretKey, {
  apiVersion: '2025-04-30.basil',
});

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
    const { amount, currency = 'usd', paymentMethodType = 'card' } = body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency,
      payment_method_types: [paymentMethodType],
      metadata: {
        userId: session.user.id
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}