// Subscription service functions for Stripe integration
// Provides both real Stripe functionality and fallback mock data for development

import { stripeConfig } from './stripe-config';

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  deviceLimit: number;
  isPopular?: boolean;
};

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export type PaymentMethod = {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  name?: string;
  email?: string;
  isDefault: boolean;
};

export type Invoice = {
  id: string;
  amount: number;
  status: 'paid' | 'open' | 'failed';
  date: string;
  pdfUrl: string;
};

export type Subscription = {
  id: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
};

// Available subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Access to 1 device',
      'Basic support',
      'Standard connection speed',
      'Weekly usage reports'
    ],
    deviceLimit: 1
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 19.99,
    interval: 'month',
    features: [
      'Access to 3 devices',
      'Priority support',
      'Enhanced connection speed',
      'Daily usage reports',
      'Custom device names'
    ],
    deviceLimit: 3,
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39.99,
    interval: 'month',
    features: [
      'Access to 10 devices',
      '24/7 premium support',
      'Maximum connection speed',
      'Real-time usage analytics',
      'Custom device names',
      'Advanced security features'
    ],
    deviceLimit: 10
  }
];

// Mock user subscription
export const getMockSubscription = (userId: string): Subscription => {
  return {
    id: 'sub_123456',
    status: 'active',
    plan: subscriptionPlans[1], // Standard plan
    currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    cancelAtPeriodEnd: false,
    paymentMethods: [
      {
        id: 'pm_123456',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      },
      {
        id: 'pm_789012',
        type: 'paypal',
        email: 'user@example.com',
        isDefault: false
      }
    ],
    invoices: [
      {
        id: 'inv_123456',
        amount: 19.99,
        status: 'paid',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: '#'
      },
      {
        id: 'inv_789012',
        amount: 19.99,
        status: 'paid',
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: '#'
      },
      {
        id: 'inv_345678',
        amount: 19.99,
        status: 'paid',
        date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: '#'
      }
    ]
  };
};

// Function to get subscription plans from Stripe
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock plans');
      return subscriptionPlans;
    }

    // Make API call to get plans
    const response = await fetch('/api/plans');
    if (!response.ok) {
      throw new Error('Failed to fetch subscription plans');
    }

    const data = await response.json();
    return data.plans;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    // Fall back to mock data if Stripe is not available
    return subscriptionPlans;
  }
};

// Function to get user's subscription
export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock subscription');
      return getMockSubscription(userId);
    }

    // Make API call to get subscription
    const response = await fetch('/api/subscription');
    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }

    const data = await response.json();

    if (!data.subscription) {
      return null;
    }

    // Get payment methods
    const paymentMethods = await getUserPaymentMethods();

    // Get invoices
    const invoices = await getUserInvoices();

    // Transform the Stripe subscription to our format
    return {
      id: data.subscription.id,
      status: data.subscription.status as SubscriptionStatus,
      plan: {
        id: data.subscription.plan.id,
        name: data.subscription.plan.product.name,
        price: data.subscription.plan.unit_amount / 100,
        interval: data.subscription.plan.interval,
        features: JSON.parse(data.subscription.plan.product.metadata.features || '[]'),
        deviceLimit: parseInt(data.subscription.plan.product.metadata.deviceLimit || '1'),
      },
      currentPeriodStart: new Date(data.subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(data.subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: data.subscription.cancel_at_period_end,
      paymentMethods,
      invoices,
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    // Fall back to mock data for development
    return getMockSubscription(userId);
  }
};

// Function to update subscription plan
export const updateSubscriptionPlan = async (
  subscriptionId: string,
  planId: string
): Promise<Subscription> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock update');
      // Mock response - return updated subscription
      const newPlan = subscriptionPlans.find(plan => plan.id === planId);
      if (!newPlan) {
        throw new Error(`Plan ${planId} not found`);
      }

      const subscription = getMockSubscription('user_123');
      subscription.plan = newPlan;

      return new Promise(resolve => {
        setTimeout(() => resolve(subscription), 1000);
      });
    }

    // Make API call to update subscription
    const response = await fetch('/api/subscription', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId, priceId: planId }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    const data = await response.json();

    // Get the updated subscription
    return getUserSubscription('user_123');
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    throw error;
  }
};

// Function to cancel subscription
export const cancelSubscription = async (
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<Subscription> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock cancellation');
      // Mock response - return updated subscription
      const subscription = getMockSubscription('user_123');

      if (cancelAtPeriodEnd) {
        subscription.cancelAtPeriodEnd = true;
      } else {
        subscription.status = 'canceled';
      }

      return new Promise(resolve => {
        setTimeout(() => resolve(subscription), 1000);
      });
    }

    // Make API call to cancel subscription
    const response = await fetch(`/api/subscription?id=${subscriptionId}&cancelAtPeriodEnd=${cancelAtPeriodEnd}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    const data = await response.json();

    // Get the updated subscription
    return getUserSubscription('user_123');
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

// Function to get user's payment methods
export const getUserPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock payment methods');
      return getMockSubscription('user_123').paymentMethods;
    }

    // Make API call to get payment methods
    const response = await fetch('/api/payment-methods');
    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }

    const data = await response.json();

    // Transform Stripe payment methods to our format
    return data.paymentMethods.map((method: any) => ({
      id: method.id,
      type: method.type,
      last4: method.card?.last4,
      brand: method.card?.brand,
      expiryMonth: method.card?.exp_month,
      expiryYear: method.card?.exp_year,
      name: method.billing_details?.name,
      email: method.billing_details?.email,
      isDefault: method.isDefault,
    }));
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    // Return mock data
    return getMockSubscription('user_123').paymentMethods;
  }
};

// Function to get user's invoices
export const getUserInvoices = async (): Promise<Invoice[]> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock invoices');
      return getMockSubscription('user_123').invoices;
    }

    // Make API call to get invoices
    const response = await fetch('/api/invoices');
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    const data = await response.json();

    // Transform Stripe invoices to our format
    return data.invoices.map((invoice: any) => ({
      id: invoice.id,
      amount: invoice.amount_due / 100,
      status: invoice.status,
      date: new Date(invoice.created * 1000).toISOString(),
      pdfUrl: invoice.invoice_pdf,
    }));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    // Return mock data
    return getMockSubscription('user_123').invoices;
  }
};

// Function to add payment method
export const addPaymentMethod = async (
  paymentDetails: Partial<PaymentMethod>
): Promise<PaymentMethod> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock add payment method');
      // Mock response - return new payment method
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Math.random().toString(36).substring(2, 10)}`,
        type: paymentDetails.type || 'card',
        last4: paymentDetails.last4 || '4242',
        brand: paymentDetails.brand || 'Visa',
        expiryMonth: paymentDetails.expiryMonth || 12,
        expiryYear: paymentDetails.expiryYear || 2025,
        name: paymentDetails.name,
        email: paymentDetails.email,
        isDefault: false
      };

      return new Promise(resolve => {
        setTimeout(() => resolve(newPaymentMethod), 1000);
      });
    }

    // In a real implementation, you would create a payment method with Stripe.js
    // on the client side and then pass the payment method ID to the server
    // For now, we'll just simulate this process

    // Make API call to add payment method
    const response = await fetch('/api/payment-methods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentMethodId: 'pm_card_visa' }), // This would be a real payment method ID from Stripe.js
    });

    if (!response.ok) {
      throw new Error('Failed to add payment method');
    }

    const data = await response.json();

    // Transform Stripe payment method to our format
    return {
      id: data.paymentMethod.id,
      type: data.paymentMethod.type,
      last4: data.paymentMethod.card?.last4,
      brand: data.paymentMethod.card?.brand,
      expiryMonth: data.paymentMethod.card?.exp_month,
      expiryYear: data.paymentMethod.card?.exp_year,
      name: data.paymentMethod.billing_details?.name,
      email: data.paymentMethod.billing_details?.email,
      isDefault: data.paymentMethod.isDefault,
    };
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

// Function to set default payment method
export const setDefaultPaymentMethod = async (
  paymentMethodId: string
): Promise<PaymentMethod[]> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock set default payment method');
      // Mock response - return updated payment methods
      const subscription = getMockSubscription('user_123');
      const updatedPaymentMethods = subscription.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId
      }));

      return new Promise(resolve => {
        setTimeout(() => resolve(updatedPaymentMethods), 1000);
      });
    }

    // Make API call to set default payment method
    const response = await fetch('/api/payment-methods', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentMethodId }),
    });

    if (!response.ok) {
      throw new Error('Failed to set default payment method');
    }

    const data = await response.json();

    // Transform Stripe payment methods to our format
    return data.paymentMethods.map((method: any) => ({
      id: method.id,
      type: method.type,
      last4: method.card?.last4,
      brand: method.card?.brand,
      expiryMonth: method.card?.exp_month,
      expiryYear: method.card?.exp_year,
      name: method.billing_details?.name,
      email: method.billing_details?.email,
      isDefault: method.isDefault,
    }));
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

// Function to remove payment method
export const removePaymentMethod = async (
  paymentMethodId: string
): Promise<PaymentMethod[]> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock remove payment method');
      // Mock response - return updated payment methods
      const subscription = getMockSubscription('user_123');
      const updatedPaymentMethods = subscription.paymentMethods.filter(
        pm => pm.id !== paymentMethodId
      );

      return new Promise(resolve => {
        setTimeout(() => resolve(updatedPaymentMethods), 1000);
      });
    }

    // Make API call to remove payment method
    const response = await fetch(`/api/payment-methods?id=${paymentMethodId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove payment method');
    }

    const data = await response.json();

    // Transform Stripe payment methods to our format
    return data.paymentMethods.map((method: any) => ({
      id: method.id,
      type: method.type,
      last4: method.card?.last4,
      brand: method.card?.brand,
      expiryMonth: method.card?.exp_month,
      expiryYear: method.card?.exp_year,
      name: method.billing_details?.name,
      email: method.billing_details?.email,
      isDefault: method.isDefault,
    }));
  } catch (error) {
    console.error('Error removing payment method:', error);
    throw error;
  }
};

// Function to reactivate a canceled subscription
export const reactivateSubscription = async (
  subscriptionId: string
): Promise<Subscription> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock reactivation');
      // Mock response - return updated subscription
      const subscription = getMockSubscription('user_123');
      subscription.status = 'active';
      subscription.cancelAtPeriodEnd = false;

      return new Promise(resolve => {
        setTimeout(() => resolve(subscription), 1000);
      });
    }

    // Make API call to reactivate subscription
    const response = await fetch('/api/subscription/reactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to reactivate subscription');
    }

    const data = await response.json();

    // Get the updated subscription
    return getUserSubscription('user_123');
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw error;
  }
};

// Create a new API route for plans
export const createPlan = async (plan: Omit<SubscriptionPlan, 'id'>): Promise<SubscriptionPlan> => {
  try {
    if (!stripeConfig.isConfigured()) {
      console.log('Stripe not configured, using mock plan creation');
      // Mock response - return new plan
      const newPlan: SubscriptionPlan = {
        id: `plan_${Math.random().toString(36).substring(2, 10)}`,
        ...plan
      };

      return new Promise(resolve => {
        setTimeout(() => resolve(newPlan), 1000);
      });
    }

    // Make API call to create plan
    const response = await fetch('/api/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plan),
    });

    if (!response.ok) {
      throw new Error('Failed to create plan');
    }

    const data = await response.json();

    return data.plan;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
};
