"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCardIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PaymentMethod, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } from "@/lib/subscription-service";

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onUpdate: (paymentMethods: PaymentMethod[]) => void;
}

export function PaymentMethodsSection({ paymentMethods, onUpdate }: PaymentMethodsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<'card' | 'paypal'>('card');
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [settingDefault, setSettingDefault] = useState<string | null>(null);
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  const handleAddPaymentMethod = async () => {
    setLoading(true);
    try {
      let newPaymentMethod;
      
      if (paymentType === 'card') {
        // In a real app, you would use a payment processor SDK here
        // For this mock, we'll just simulate adding a card
        newPaymentMethod = await addPaymentMethod({
          type: 'card',
          last4: cardNumber.slice(-4),
          brand: 'Visa', // This would be determined by the payment processor
          expiryMonth: parseInt(expiryMonth),
          expiryYear: parseInt(expiryYear),
          name: cardName
        });
      } else {
        // Add PayPal
        newPaymentMethod = await addPaymentMethod({
          type: 'paypal',
          email: paypalEmail
        });
      }
      
      onUpdate([...paymentMethods, newPaymentMethod]);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error adding payment method:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePaymentMethod = async (id: string) => {
    setRemoving(id);
    try {
      const updatedMethods = await removePaymentMethod(id);
      onUpdate(updatedMethods);
    } catch (error) {
      console.error('Error removing payment method:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleSetDefaultPaymentMethod = async (id: string) => {
    setSettingDefault(id);
    try {
      const updatedMethods = await setDefaultPaymentMethod(id);
      onUpdate(updatedMethods);
    } catch (error) {
      console.error('Error setting default payment method:', error);
    } finally {
      setSettingDefault(null);
    }
  };

  const resetForm = () => {
    setPaymentType('card');
    setCardNumber('');
    setCardName('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvc('');
    setPaypalEmail('');
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods for subscription billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No payment methods added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    method.isDefault 
                      ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                      {method.type === 'card' ? (
                        <CreditCardIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.5 10.5H17.5M6.5 13.5H13.5M19 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      {method.type === 'card' ? (
                        <>
                          <p className="font-medium">{method.brand} •••• {method.last4}</p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">{method.email}</p>
                        </>
                      )}
                    </div>
                    {method.isDefault && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefaultPaymentMethod(method.id)}
                        disabled={settingDefault === method.id}
                      >
                        {settingDefault === method.id ? 'Setting...' : 'Set Default'}
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      disabled={removing === method.id || method.isDefault}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowAddDialog(true)}
            className="w-full"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new payment method to your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <RadioGroup 
              defaultValue="card" 
              value={paymentType} 
              onValueChange={(value) => setPaymentType(value as 'card' | 'paypal')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="cursor-pointer">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
              </div>
            </RadioGroup>

            {paymentType === 'card' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19} // 16 digits + 3 spaces
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                      <SelectTrigger id="expiryMonth">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = i + 1;
                          return (
                            <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">Year</Label>
                    <Select value={expiryYear} onValueChange={setExpiryYear}>
                      <SelectTrigger id="expiryYear">
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        {getYears().map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">PayPal Email</Label>
                <Input
                  id="paypalEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddPaymentMethod}
              disabled={loading || (
                paymentType === 'card' 
                  ? !cardNumber || !cardName || !expiryMonth || !expiryYear || !cvc
                  : !paypalEmail
              )}
            >
              {loading ? 'Adding...' : 'Add Payment Method'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
