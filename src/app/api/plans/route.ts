import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-config";
import { auth } from "@/lib/auth";

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
    
    // Get all active prices from Stripe
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      type: 'recurring',
    });
    
    // Transform prices to subscription plans
    const plans = prices.data.map(price => {
      const product = price.product as any;
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount! / 100, // Convert from cents to dollars
        interval: price.recurring?.interval,
        features: product.metadata.features ? JSON.parse(product.metadata.features) : [],
        deviceLimit: parseInt(product.metadata.deviceLimit || '1'),
        isPopular: product.metadata.isPopular === 'true',
      };
    });
    
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Error fetching plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, price, interval, features, deviceLimit, isPopular } = body;
    
    // Create a product in Stripe
    const product = await stripe.products.create({
      name,
      metadata: {
        features: JSON.stringify(features),
        deviceLimit: deviceLimit.toString(),
        isPopular: isPopular ? 'true' : 'false',
      },
    });
    
    // Create a price for the product
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100), // Convert to cents
      currency: 'usd',
      recurring: {
        interval: interval,
      },
    });
    
    // Return the created plan
    return NextResponse.json({
      plan: {
        id: stripePrice.id,
        name,
        price,
        interval,
        features,
        deviceLimit,
        isPopular,
      },
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Error creating plan' },
      { status: 500 }
    );
  }
}
