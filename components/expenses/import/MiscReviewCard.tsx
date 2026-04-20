'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { MiscReviewFlow } from './MiscReviewFlow';

interface MiscReviewCardProps {
  count: number;
}

export function MiscReviewCard({ count }: MiscReviewCardProps) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (count === 0 || dismissed) return null;

  return (
    <>
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="size-4 text-amber-500 shrink-0" />
          <p className="text-sm flex-1">
            <strong>{count}</strong> transaction{count !== 1 ? 's' : ''} in Miscellaneous — review to improve future imports.
          </p>
          <Button size="sm" variant="outline" onClick={() => setReviewOpen(true)}>
            Review now
          </Button>
          <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </CardContent>
      </Card>

      <MiscReviewFlow open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </>
  );
}
