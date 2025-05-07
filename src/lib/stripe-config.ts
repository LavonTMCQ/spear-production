/**
 * Stripe API configuration
 *
 * This file provides access to Stripe API credentials from environment variables.
 * In development, these values come from your .env.local file.
 * In production, they should be set in your hosting environment.
 */

// Use different imports for server and client components
import Stripe from 'stripe';

export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  isConfigured: () => {
    return Boolean(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      process.env.STRIPE_SECRET_KEY
    );
  }
};

// Only initialize Stripe on the server side
let stripe: Stripe | null = null;

// This code will only run on the server
if (typeof window === 'undefined' && stripeConfig.secretKey) {
  stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: '2025-04-30.basil', // Use the latest API version
  });
}

export { stripe };