# Subscription Parameters Guide

## Subscription Tiers

### Basic Plan ($350/month)
- 1 Device
- Full remote control access
- Basic support

### Additional Device Plan ($300/month/device)
- Each additional device
- Same features as basic plan

## Subscription States
- `active`: Payment current, full access
- `past_due`: Payment failed, grace period
- `canceled`: Subscription ended
- `unpaid`: Payment failed, access revoked

## Billing Cycle
- Monthly billing
- Payment due on subscription date
- 3-day grace period for failed payments

## Access Control
- Active subscription: Full remote access
- Past due: Access maintained during grace period
- Unpaid/Canceled: Remote access disabled

## Client Management

### New Client Setup
1. Create client account (email/password)
2. Set up Stripe subscription
3. Assign device(s)
4. Provide login credentials

### Device Assignment
1. Register device in TeamViewer
2. Link device ID to client account
3. Verify remote access

### Subscription Cancellation
1. Cancel in Stripe dashboard
2. System automatically:
   - Updates subscription status
   - Revokes TeamViewer access
   - Unassigns devices

## Support Policy
- Email support: support@company.com
- Response time: 24-48 hours
- Business hours: 9 AM - 5 PM EST

## Payment Terms
- Auto-charge monthly
- Payment methods: Credit/Debit cards
- Failed payment grace period: 3 days
- Late fee: None