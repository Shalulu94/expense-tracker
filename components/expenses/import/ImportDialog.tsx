'use client';

import { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { SELECTABLE_BANK_PROFILES } from '@/lib/parsers/bank-formats';

const AUTO_DETECT = 'auto';

interface ImportDialogProps {
  onFileSelect: (file: File, bankProfileId?: string) => void;
  isLoading?: boolean;
}

export function ImportDialog({ onFileSelect, isLoading }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>(AUTO_DETECT);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file, selectedBank === AUTO_DETECT ? undefined : selectedBank);
      setOpen(false);
      setSelectedBank(AUTO_DETECT);
    }
    e.target.value = '';
  }

  function handleUploadClick() {
    inputRef.current?.click();
  }

  // Group profiles by country for the dropdown
  const byCountry = SELECTABLE_BANK_PROFILES.reduce<Record<string, typeof SELECTABLE_BANK_PROFILES>>(
    (acc, p) => {
      (acc[p.country] ??= []).push(p);
      return acc;
    },
    {}
  );

  const countryLabels: Record<string, string> = {
    AU: 'Australia',
    GB: 'United Kingdom',
    US: 'United States',
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={isLoading}
        className="gap-2"
      >
        <Upload className="size-4" />
        {isLoading ? 'Processing...' : 'Import CSV'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import CSV Statement</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="bank-select">Bank / Institution</Label>
              <Select value={selectedBank} onValueChange={(v) => setSelectedBank(v ?? AUTO_DETECT)}>
                <SelectTrigger id="bank-select">
                  <SelectValue placeholder="Select bank…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AUTO_DETECT}>Auto-detect format</SelectItem>
                  {Object.entries(byCountry).map(([country, profiles]) => (
                    <div key={country}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {countryLabels[country] ?? country}
                      </div>
                      {profiles.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select your bank for accurate column mapping. Use Auto-detect if unsure.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadClick} className="gap-2">
              <Upload className="size-4" />
              Choose File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
