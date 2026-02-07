'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface GroupPickerGuideSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps: { title: string; description?: string; image: string }[] = [
  {
    title: 'Visit workspace',
    description: 'Visit workspace and tab on whatsapp',
    image: '/images/img-1.png',
  },
  {
    title: 'Select Moderate',
    image: '/images/img-2.png',
    description: "Tap on moderate"
  },
  {
    title: 'Select groups',
    description: 'Select groups you want to set rules for',
    image: '/images/img-3.png',
  },
];

export function GroupPickerGuideSheet({
  open,
  onOpenChange,
}: GroupPickerGuideSheetProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="text-center">
            How to Select Groups & Chats
          </SheetTitle>
        </SheetHeader>

        <div className="py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <p className="mb-2 text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                {step.title}
              </h3>

              <div className="relative mx-auto my-4 overflow-hidden rounded-lg max-w-80 h-30">
                <Image
                  src={step.image}
                  alt={step.title}
                  className=" object-cover"
                  width={320}
                  height={120}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {step.description && (
                <p className="text-muted-foreground">{step.description}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mb-4 flex justify-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentStep
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-muted hover:bg-muted-foreground',
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? (
              'Got it'
            ) : (
              <>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
