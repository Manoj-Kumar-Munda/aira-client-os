'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { AuthLayout } from '@/components/layout';
import { PhoneInput, AssistantAvatar } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { useUpdateUser, useAuthActions, queryClient } from '@repo/core';
import { webTokenStorage } from '@/lib/api';
import { ROUTES } from '@/lib/constants';

export default function PhonePage() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('');
  const [subscriberNumber, setSubscriberNumber] = useState('');
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { logout } = useAuthActions();

  // Total digits = country code + subscriber number
  const totalDigits = countryCode.length + subscriberNumber.length;
  // total digits (country code + subscriber) must be 8-15
  const isValidPhone = totalDigits >= 8 && totalDigits <= 15;

  const getFormattedPhone = (): string => {
    return countryCode + subscriberNumber;
  };

  const handleContinue = async () => {
    if (!isValidPhone || isUpdating) return;

    const formattedPhone = getFormattedPhone();

    updateUser(
      { p_n: formattedPhone },
      {
        onSuccess: () => {
          // User is now active, redirect to hub
          router.replace(ROUTES.HUB);
        },
        onError: error => {
          console.error('Failed to update phone number:', error);
        },
      },
    );
  };

  const handleLogout = async () => {
    await logout(webTokenStorage);
    queryClient.clear();
    router.push(ROUTES.SIGNIN);
  };

  return (
    <AuthLayout showBrand={false}>
      <div className="relative">
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="absolute -top-16 right-0 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                You&apos;re in!
              </h1>
              <p className="mt-2 text-muted-foreground">
                AiRA needs your phone number to get started
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your country code and phone number
              </p>
            </div>

            {/* Assistant Avatar - visible on larger screens */}
            <div className="hidden md:block">
              <AssistantAvatar size="md" />
            </div>
          </div>

          {/* Phone Input */}
          <PhoneInput
            countryCode={countryCode}
            subscriberNumber={subscriberNumber}
            onCountryCodeChange={setCountryCode}
            onSubscriberNumberChange={setSubscriberNumber}
          />

          {/* Mobile Avatar */}
          <div className="flex justify-center md:hidden">
            <AssistantAvatar size="lg" />
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!isValidPhone || isUpdating}
            size="default"
            className="w-full"
          >
            {isUpdating ? 'Verifying...' : 'Continue'}
          </Button>

          {/* Info text */}
          <p className="text-center text-xs text-muted-foreground">
            Your phone number will be used for account verification
          </p>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
