'use client';

import { Button } from '@/components/ui/button';
import { useExport } from '@/lib/hooks/useExport';
import { Download } from 'lucide-react';

export function ExportButton() {
  const { exportToCSV } = useExport();
  return (
    <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
      <Download className="size-4" />
      Export CSV
    </Button>
  );
}
