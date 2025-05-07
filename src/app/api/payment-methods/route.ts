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
      return NextResponse.json({ paymentMethods: [] });
    }
    
    const customerId = customers.data[0].id;
    
    // Get payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    
    // Get default payment method
    const customer = await stripe.customers.retrieve(customerId);
    const defaultPaymentMethodId = typeof customer !== 'string' && customer.invoice_settings?.default_payment_method;
    
    // Mark default payment method
    const formattedPaymentMethods = paymentMethods.data.map(method => ({
      ...method,
      isDefault: method.id === defaultPaymentMethodId,
    }));
    
    return NextResponse.json({ paymentMethods: formattedPaymentMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Error fetching payment methods' },
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
    const { paymentMethodId } = body;
    
    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      );
    }
    
    // Get or create customer
    let customerId;
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;
    }
    
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    
    // Get the payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    return NextResponse.json({
      success: true,
      paymentMethod: {
        ...paymentMethod,
        isDefault: false,
      },
    });
  } catch (error) {
    console.error('Error adding payment method:', error);
    return NextResponse.json(
      { error: 'Error adding payment method' },
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
    const { paymentMethodId } = body;
    
    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      );
    }
    
    // Get customer
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });
    
    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    
    const customerId = customers.data[0].id;
    
    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    
    // Get updated payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    
    // Mark default payment method
    const formattedPaymentMethods = paymentMethods.data.map(method => ({
      ...method,
      isDefault: method.id === paymentMethodId,
    }));
    
    return NextResponse.json({
      success: true,
      paymentMethods: formattedPaymentMethods,
    });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return NextResponse.json(
      { error: 'Error setting default payment method' },
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
    const paymentMethodId = searchParams.get('id');
    
    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      );
    }
    
    // Get customer
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });
    
    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    
    const customerId = customers.data[0].id;
    
    // Check if this is the default payment method
    const customer = await stripe.customers.retrieve(customerId);
    const defaultPaymentMethodId = typeof customer !== 'string' && customer.invoice_settings?.default_payment_method;
    
    if (defaultPaymentMethodId === paymentMethodId) {
      // Unset default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: '',
        },
      });
    }
    
    // Detach payment method
    await stripe.paymentMethods.detach(paymentMethodId);
    
    // Get updated payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    
    return NextResponse.json({
      success: true,
      paymentMethods: paymentMethods.data,
    });
  } catch (error) {
    console.error('Error removing payment method:', error);
    return NextResponse.json(
      { error: 'Error removing payment method' },
      { status: 500 }
    );
  }
}
