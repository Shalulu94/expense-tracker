'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ImportButtonProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function ImportButton({ onFileSelect, isLoading }: ImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        className="gap-2"
      >
        <Upload className="size-4" />
        {isLoading ? 'Processing...' : 'Import CSV'}
      </Button>
    </>
  );
}
