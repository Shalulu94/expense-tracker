'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ExpensesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm">
        <AlertTriangle className="size-10 text-destructive mx-auto" />
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
