import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({ label, value, subValue, trend, icon, isLoading, className }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('p-4', className)}>
        <CardContent className="p-0 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-32" />
        </CardContent>
      </Card>
    );
  }

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className={cn('p-4', className)}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
        <p className="text-2xl font-semibold tracking-tight mt-1">{value}</p>
        {subValue && (
          <div className="flex items-center gap-1 mt-1">
            {trend && (
              <TrendIcon
                className={cn(
                  'size-3',
                  trend === 'up' && 'text-emerald-500',
                  trend === 'down' && 'text-red-500',
                  trend === 'neutral' && 'text-muted-foreground'
                )}
              />
            )}
            <p className="text-xs text-muted-foreground">{subValue}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
