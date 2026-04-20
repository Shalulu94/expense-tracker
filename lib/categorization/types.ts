import type { CategorizationConfidence } from '@/types/finance';

export interface CategorizationResult {
  categoryId: string | null;
  confidence: CategorizationConfidence;
  reasoning: string;
}
