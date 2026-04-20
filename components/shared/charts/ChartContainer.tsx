import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  height?: number;
  action?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function ChartContainer({
  title,
  description,
  children,
  height = 280,
  action,
  isLoading,
  className,
}: ChartContainerProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {isLoading ? (
          <Skeleton style={{ height }} className="w-full rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {children as React.ReactElement}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
