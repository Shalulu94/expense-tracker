import { Skeleton } from '@/components/ui/skeleton';

export default function ExpensesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border bg-card" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-72 rounded-xl" />
          <div className="lg:col-span-2 grid grid-rows-2 gap-4">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </main>
    </div>
  );
}
