'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { CategoryManager } from '@/components/expenses/CategoryManager';
import { ApiKeySettings } from '@/components/expenses/settings/ApiKeySettings';
import { RulesManager } from '@/components/expenses/settings/RulesManager';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-primary">💰 FinTracker</span>
            <div className="flex gap-1">
              <Link href="/expenses" className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted">
                Expenses
              </Link>
              <Link href="/settings" className="px-3 py-1.5 text-sm rounded-md bg-muted font-medium">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/expenses">
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <PageHeader title="Settings" description="Manage categories, API key, and preferences" />
        </div>

        <ApiKeySettings />
        <RulesManager />
        <CategoryManager />
      </main>
    </div>
  );
}
