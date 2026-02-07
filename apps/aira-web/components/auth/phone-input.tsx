'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  countryCode: string;
  subscriberNumber: string;
  onCountryCodeChange: (value: string) => void;
  onSubscriberNumberChange: (value: string) => void;
  className?: string;
}

// Simple country detection based on phone number prefix
const detectCountry = (
  phone: string,
): { code: string; name: string } | null => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91')) {
    return { code: '+91', name: 'India' };
  }
  if (cleaned.startsWith('1')) {
    return { code: '+1', name: 'USA' };
  }
  if (cleaned.startsWith('44')) {
    return { code: '+44', name: 'UK' };
  }
  if (cleaned.startsWith('61')) {
    return { code: '+61', name: 'Australia' };
  }
  return null;
};

export function PhoneInput({
  countryCode,
  subscriberNumber,
  onCountryCodeChange,
  onSubscriberNumberChange,
  className,
}: PhoneInputProps) {
  const country = useMemo(
    () => detectCountry(countryCode + subscriberNumber),
    [countryCode, subscriberNumber],
  );
  const [countryCodeFocused, setCountryCodeFocused] = useState(false);
  const [subscriberFocused, setSubscriberFocused] = useState(false);

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 3 characters for country code
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 3);
    onCountryCodeChange(newValue);
  };

  const handleSubscriberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 12 characters for subscriber number
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 12);
    onSubscriberNumberChange(newValue);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex gap-2">
        {/* Country Code Input */}
        <div className="relative w-24">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground pointer-events-none">
            +
          </div>
          <Input
            type="tel"
            value={countryCode}
            onChange={handleCountryCodeChange}
            onFocus={() => setCountryCodeFocused(true)}
            onBlur={() => setCountryCodeFocused(false)}
            placeholder="91"
            className={cn(
              'h-14 text-lg pl-7 transition-all',
              countryCodeFocused && 'ring-2 ring-primary',
            )}
          />
        </div>

        {/* Subscriber Number Input */}
        <div className="relative flex-1">
          <Input
            type="tel"
            value={subscriberNumber}
            onChange={handleSubscriberChange}
            onFocus={() => setSubscriberFocused(true)}
            onBlur={() => setSubscriberFocused(false)}
            placeholder="9876543210"
            className={cn(
              'h-14 text-lg transition-all',
              subscriberFocused && 'ring-2 ring-primary',
            )}
          />
        </div>
      </div>

      {/* Country Badge */}
      <AnimatePresence>
        {country && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute -top-3 left-4"
          >
            <Badge variant="secondary" className="text-xs">
              {country.code} {country.name}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
