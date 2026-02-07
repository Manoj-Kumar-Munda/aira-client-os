'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GroupPickerGuideSheet } from './group-picker-guide-sheet';

interface Group {
  id: string;
  name: string;
  memberCount?: number;
  rulesCount?: number;
}

interface GroupSelectorProps {
  groups: Group[];
  selected: string[];
  onChange: (selected: string[]) => void;
  visible?: boolean;
  className?: string;
  label?: string;
}

export function GroupSelector({
  groups,
  selected,
  onChange,
  visible = true,
  className,
  label = 'WhatsApp Groups',
}: GroupSelectorProps) {
  const handleToggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const [showGuide, setShowGuide] = useState(false);

  if (!visible) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={cn('space-y-2', className)}
        >
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              {label}
            </label>
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowGuide(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Info className="h-4 w-4" />
            </motion.button>
          </div>
          <ScrollArea className="h-48 rounded-xl border border-border bg-card p-2">
            <div className="space-y-1">
              {groups.map(group => {
                const isSelected = selected.includes(group.id);

                return (
                  <motion.button
                    key={group.id}
                    whileHover={{ x: 2 }}
                    onClick={() => handleToggle(group.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
                      isSelected ? 'bg-primary/10' : 'hover:bg-secondary',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                        isSelected ? 'bg-primary/20' : 'bg-muted',
                      )}
                    >
                      <Users
                        className={cn(
                          'h-5 w-5',
                          isSelected ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {group.name}
                      </p>
                      {(group.rulesCount !== undefined ||
                        group.memberCount !== undefined) && (
                        <p className="text-xs text-muted-foreground">
                          {group.rulesCount !== undefined
                            ? `${group.rulesCount} ${group.rulesCount === 1 ? 'rule' : 'rules'}`
                            : `${group.memberCount} members`}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-primary"
                      >
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </ScrollArea>
        </motion.div>
      </AnimatePresence>

      {/* Guide Sheet */}
      <GroupPickerGuideSheet open={showGuide} onOpenChange={setShowGuide} />
    </>
  );
}
