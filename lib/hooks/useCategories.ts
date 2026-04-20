import { useAppStore } from '@/lib/store';
import type { Category } from '@/types/finance';

export function useCategories() {
  const categories = useAppStore((s) => s.categories);
  const createCategory = useAppStore((s) => s.createCategory);
  const updateCategory = useAppStore((s) => s.updateCategory);
  const deleteCategory = useAppStore((s) => s.deleteCategory);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  // Root categories have no parent — these are the top-level display groups.
  const rootExpenseCategories = expenseCategories.filter((c) => !c.parentId);

  function getCategoryById(id: string): Category | undefined {
    return categories.find((c) => c.id === id);
  }

  function getChildCategories(parentId: string): Category[] {
    return categories.filter((c) => c.parentId === parentId);
  }

  function getCategoryParent(id: string): Category | undefined {
    const cat = getCategoryById(id);
    return cat?.parentId ? getCategoryById(cat.parentId) : undefined;
  }

  // Returns the ID to use for chart grouping: parentId if the category is a
  // subcategory, otherwise the category's own ID.
  function resolveChartId(categoryId: string): string {
    return getCategoryById(categoryId)?.parentId ?? categoryId;
  }

  return {
    categories,
    expenseCategories,
    incomeCategories,
    rootExpenseCategories,
    getCategoryById,
    getChildCategories,
    getCategoryParent,
    resolveChartId,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
