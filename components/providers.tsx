'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  const seed = useAppStore((s) => s.seed);

  useEffect(() => {
    seed();
  }, [seed]);

  return <TooltipProvider>{children}</TooltipProvider>;
}
