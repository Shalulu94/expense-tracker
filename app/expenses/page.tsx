'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { SummaryBar } from '@/components/expenses/SummaryBar';
import { TransactionFilters } from '@/components/expenses/TransactionFilters';
import { TransactionList } from '@/components/expenses/TransactionList';
import { TransactionForm } from '@/components/expenses/TransactionForm';
import { ExportButton } from '@/components/expenses/ExportButton';
import { ImportDialog } from '@/components/expenses/import/ImportDialog';
import { ImportPreviewModal } from '@/components/expenses/import/ImportPreviewModal';
import { MiscReviewCard } from '@/components/expenses/import/MiscReviewCard';
import { DonutChart } from '@/components/shared/charts/DonutChart';
import { SpendingAreaChart } from '@/components/shared/charts/SpendingAreaChart';
import { MonthlyBarChart } from '@/components/shared/charts/MonthlyBarChart';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { useSummaryStats } from '@/lib/hooks/useSummaryStats';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useImport } from '@/lib/hooks/useImport';
import { CategoryDetailsTable } from '@/components/expenses/CategoryDetailsTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useMemo } from 'react';

export default function ExpensesPage() {
  const openTransactionModal = useAppStore((s) => s.openTransactionModal);
  const isLoading = useAppStore((s) => s.isLoading);
  const transactions = useAppStore((s) => s.transactions);
  const categories = useAppStore((s) => s.categories);
  const { categoryBreakdown, monthlyTotals } = useSummaryStats();
  const { transactions: filteredTransactions } = useTransactions();
  const filters = useAppStore((s) => s.filters);

  const {
    importState,
    isPreviewOpen,
    processFile,
    updateRow,
    confirmImport,
    cancelImport,
  } = useImport();

  const miscCategoryId = categories.find((c) => c.name === 'Miscellaneous')?.id;
  const miscCount = useMemo(
    () => transactions.filter((t) => t.categoryId === miscCategoryId).length,
    [transactions, miscCategoryId]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-primary">💰 FinTracker</span>
            <div className="flex gap-1">
              <Link href="/expenses" className="px-3 py-1.5 text-sm rounded-md bg-muted font-medium">
                Expenses
              </Link>
              <Link href="/settings" className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted">
                Settings
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton />
            <ImportDialog
              onFileSelect={processFile}
              isLoading={importState?.isProcessing}
            />
            <Button size="sm" onClick={() => openTransactionModal()} className="gap-2">
              <Plus className="size-4" />
              Add
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <PageHeader
          title="Expenses"
          description="Track and manage your spending"
        />

        {/* Misc review prompt */}
        <MiscReviewCard count={miscCount} />

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            <SummaryBar currency="USD" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <DonutChart data={categoryBreakdown} isLoading={isLoading} />
              <div className="lg:col-span-2 grid grid-rows-2 gap-4">
                <SpendingAreaChart
                  transactions={filteredTransactions}
                  dateRange={filters.dateRange}
                  isLoading={isLoading}
                />
                <MonthlyBarChart data={monthlyTotals} isLoading={isLoading} />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="p-4 flex flex-wrap items-center gap-3 justify-between">
                  <h2 className="font-semibold">Transactions</h2>
                  <TransactionFilters />
                </div>
                <Separator />
                <div className="p-2">
                  <TransactionList currency="USD" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details tab */}
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="p-4 flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <h2 className="font-semibold">Category Breakdown</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Totals respect the active date filter. Click a parent row to collapse subcategories.
                    </p>
                  </div>
                  <TransactionFilters />
                </div>
                <Separator />
                <CategoryDetailsTable currency="USD" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <TransactionForm />
      {importState && (
        <ImportPreviewModal
          open={isPreviewOpen}
          filename={importState.filename}
          rows={importState.rows}
          error={importState.error}
          onUpdateRow={updateRow}
          onConfirm={confirmImport}
          onCancel={cancelImport}
        />
      )}
    </div>
  );
}
