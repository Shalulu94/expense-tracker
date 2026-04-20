'use client';

import { useState } from 'react';
import { useCategoryDetails } from '@/lib/hooks/useCategoryDetails';
import { formatCurrency } from '@/lib/utils/currency';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryDetailsTableProps {
  currency?: string;
}

export function CategoryDetailsTable({ currency = 'USD' }: CategoryDetailsTableProps) {
  const rows = useCategoryDetails();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggleCollapse(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (rows.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        No expense transactions in the selected period.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="py-2.5 pl-3 pr-4 text-left font-medium">Category</th>
            <th className="py-2.5 px-4 text-right font-medium">Total Spent</th>
            <th className="py-2.5 px-4 text-right font-medium">Avg / Month</th>
            <th className="py-2.5 pl-4 pr-3 text-right font-medium">Transactions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((parent) => {
            const isCollapsed = collapsed.has(parent.id);
            const hasChildren = parent.subcategories.length > 0;

            return (
              <>
                {/* Parent row */}
                <tr
                  key={parent.id}
                  onClick={() => hasChildren && toggleCollapse(parent.id)}
                  className={cn(
                    'border-b border-border/50 font-semibold',
                    hasChildren && 'cursor-pointer hover:bg-muted/50'
                  )}
                >
                  <td className="py-3 pl-3 pr-4">
                    <div className="flex items-center gap-2">
                      {hasChildren ? (
                        isCollapsed
                          ? <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                          : <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <span className="size-3.5 shrink-0" />
                      )}
                      <span className="text-base leading-none">{parent.icon}</span>
                      <span>{parent.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {formatCurrency(parent.total, currency)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                    {formatCurrency(parent.avgPerMonth, currency)}
                  </td>
                  <td className="py-3 pl-4 pr-3 text-right tabular-nums text-muted-foreground">
                    {parent.transactionCount}
                  </td>
                </tr>

                {/* Subcategory rows */}
                {!isCollapsed && parent.subcategories.map((sub) => (
                  <tr key={sub.id} className="border-b border-border/30 bg-muted/20 text-muted-foreground">
                    <td className="py-2.5 pl-10 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm leading-none">{sub.icon}</span>
                        <span>{sub.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-foreground">
                      {formatCurrency(sub.total, currency)}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      {formatCurrency(sub.avgPerMonth, currency)}
                    </td>
                    <td className="py-2.5 pl-4 pr-3 text-right tabular-nums">
                      {sub.transactionCount}
                    </td>
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>

        {/* Grand total footer */}
        <tfoot>
          <tr className="border-t-2 border-border font-semibold">
            <td className="py-3 pl-3 pr-4 text-muted-foreground">Total</td>
            <td className="py-3 px-4 text-right tabular-nums">
              {formatCurrency(rows.reduce((s, r) => s + r.total, 0), currency)}
            </td>
            <td className="py-3 px-4 text-right tabular-nums">
              {formatCurrency(rows.reduce((s, r) => s + r.avgPerMonth, 0), currency)}
            </td>
            <td className="py-3 pl-4 pr-3 text-right tabular-nums">
              {rows.reduce((s, r) => s + r.transactionCount, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
