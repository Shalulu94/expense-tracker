'use client';

import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useAppStore } from '@/lib/store';
import type { DatePreset } from '@/types/finance';

const PRESETS: { label: string; value: DatePreset }[] = [
  { label: 'This Month', value: 'this_month' },
  { label: '3 Months', value: 'last_3_months' },
  { label: '6 Months', value: 'last_6_months' },
  { label: 'This Year', value: 'this_year' },
  { label: 'This FY', value: 'this_financial_year' },
];

export function DateRangePicker() {
  const filters = useAppStore((s) => s.filters);
  const setDatePreset = useAppStore((s) => s.setDatePreset);
  const setFilters = useAppStore((s) => s.setFilters);
  const [open, setOpen] = useState(false);

  const { datePreset, dateRange } = filters;

  return (
    <div className="flex items-center gap-1">
      <div className="flex rounded-lg border border-border overflow-hidden">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setDatePreset(preset.value)}
            className={cn(
              'px-3 py-1.5 text-sm transition-colors',
              datePreset === preset.value
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: datePreset === 'custom' ? 'default' : 'outline', size: 'sm' }),
            'gap-2'
          )}
        >
          <CalendarIcon className="size-4" />
          {datePreset === 'custom'
            ? `${format(parseISO(dateRange.from), 'dd MMM')} – ${format(parseISO(dateRange.to), 'dd MMM yyyy')}`
            : 'Custom'}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: parseISO(dateRange.from),
              to: parseISO(dateRange.to),
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setFilters({
                  datePreset: 'custom',
                  dateRange: {
                    from: format(range.from, 'yyyy-MM-dd'),
                    to: format(range.to, 'yyyy-MM-dd'),
                  },
                });
                setOpen(false);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
