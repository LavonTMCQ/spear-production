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
    
    // Get customer ID from Stripe
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });
    
    if (customers.data.length === 0) {
      return NextResponse.json({ invoices: [] });
    }
    
    const customerId = customers.data[0].id;
    
    // Get invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 10, // Limit to 10 most recent invoices
    });
    
    return NextResponse.json({ invoices: invoices.data });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Error fetching invoices' },
      { status: 500 }
    );
  }
}
