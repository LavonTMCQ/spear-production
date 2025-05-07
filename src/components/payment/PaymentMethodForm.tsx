import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import StripeElements from './StripeElements';
import StripeProvider from './StripeProvider';
import { addPaymentMethod } from '@/lib/subscription-service';
import { toast } from 'sonner';

interface PaymentMethodFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentMethodCreated = async (paymentMethod: any) => {
    try {
      setIsSubmitting(true);

      // Call the API to save the payment method
      await addPaymentMethod({
        id: paymentMethod.id,
        type: paymentMethod.type,
        last4: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand,
        expiryMonth: paymentMethod.card?.exp_month,
        expiryYear: paymentMethod.card?.exp_year,
      });

      toast.success('Your payment method has been added successfully.');

      onSuccess();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method. Please try again.');
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Enter your card details to add a new payment method.
          </DialogDescription>
        </DialogHeader>

        <StripeProvider>
          <StripeElements
            onSuccess={handlePaymentMethodCreated}
            onCancel={onClose}
            buttonText={isSubmitting ? 'Processing...' : 'Add Payment Method'}
          />
        </StripeProvider>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodForm;
