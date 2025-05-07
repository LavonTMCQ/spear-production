"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface UnifiedSubscriptionManagementProps {
  clientId?: string;
  clientName?: string;
}

export function UnifiedSubscriptionManagement({
  clientId,
  clientName = "Selected Client"
}: UnifiedSubscriptionManagementProps) {
  const [selectedService] = useState<"teamviewer">("teamviewer");
  const [subscriptionPlan, setSubscriptionPlan] = useState("professional");
  const [autoRenew, setAutoRenew] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveSubscription = () => {
    setIsSaving(true);
    setSaveMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage({
        type: "success",
        text: `Successfully updated ${selectedService.charAt(0).toUpperCase() + selectedService.slice(1)} subscription for ${clientName}`
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Remote Access Subscription</CardTitle>
        <CardDescription>
          Manage remote access service subscriptions for {clientName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {saveMessage && (
          <div className={`p-3 rounded-md ${saveMessage.type === "success" ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
            {saveMessage.text}
          </div>
        )}

        <div className="space-y-2">
          <Label>Remote Access Service</Label>
          <RadioGroup
            value="teamviewer"
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="teamviewer" id="service-teamviewer" />
              <Label htmlFor="service-teamviewer" className="flex items-center">
                <img
                  src="/images/teamviewer-logo.png"
                  alt="TeamViewer"
                  className="h-5 w-5 mr-2"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.style.display = 'none';
                  }}
                />
                TeamViewer
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscription-plan">Subscription Plan</Label>
          <Select value={subscriptionPlan} onValueChange={setSubscriptionPlan}>
            <SelectTrigger id="subscription-plan">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-renew">Auto-Renew Subscription</Label>
            <p className="text-sm text-slate-500">
              Automatically renew subscription when it expires
            </p>
          </div>
          <Switch
            id="auto-renew"
            checked={autoRenew}
            onCheckedChange={setAutoRenew}
          />
        </div>

        {selectedService === "teamviewer" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md text-sm text-blue-800 dark:text-blue-400">
            <p className="font-medium">TeamViewer Subscription Details</p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li><strong>Basic Plan</strong>: Single user, 3 devices, basic features</li>
              <li><strong>Professional Plan</strong>: Multiple users, unlimited devices, advanced features</li>
              <li><strong>Enterprise Plan</strong>: Team management, custom branding, premium support</li>
            </ul>
          </div>
        )}


      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSaveSubscription}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Subscription"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
