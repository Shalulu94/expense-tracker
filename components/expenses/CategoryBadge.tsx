import { cn } from '@/lib/utils';
import type { Category } from '@/types/finance';

interface CategoryBadgeProps {
  category: Category | undefined;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  if (!category) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
        Unknown
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
      }}
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
    </span>
  );
}
