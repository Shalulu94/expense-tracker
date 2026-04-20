'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { parseStatementFile } from '@/lib/parsers/csv-parser';
import { applyRules } from '@/lib/categorization/rule-engine';
import { callClaude } from '@/lib/categorization/ai-categorizer';
import { normalizeMerchant } from '@/lib/categorization/normalizer';
import { findDuplicates } from '@/lib/categorization/deduplicator';
import { getStorageProvider } from '@/lib/storage';
import { DEFAULT_USER_ID } from '@/types/finance';
import type { Transaction, CategorizationSource, CategorizationConfidence } from '@/types/finance';
import { generateId, nowISO } from '@/lib/utils/date';

export interface ImportRow {
  index: number;
  date: string;
  description: string;
  amount: number;
  categoryId: string | null;
  categorizationSource: CategorizationSource;
  categorizationConfidence: CategorizationConfidence | null;
  isDuplicate: boolean;
  excluded: boolean;
  aiReasoning?: string;
}

export interface ImportState {
  filename: string;
  bankProfileId: string;
  rows: ImportRow[];
  isProcessing: boolean;
  processingProgress: number; // 0-100
  error: string | null;
}

export function useImport() {
  const transactions = useAppStore((s) => s.transactions);
  const merchantRules = useAppStore((s) => s.merchantRules);
  const categories = useAppStore((s) => s.categories);
  const settings = useAppStore((s) => s.settings);

  const [importState, setImportState] = useState<ImportState | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setImportState({
      filename: file.name,
      bankProfileId: '',
      rows: [],
      isProcessing: true,
      processingProgress: 0,
      error: null,
    });

    const { profile, rows, errors } = await parseStatementFile(file);

    if (errors.length > 0 && rows.length === 0) {
      setImportState((s) => s && ({ ...s, isProcessing: false, error: errors[0] }));
      setIsPreviewOpen(true);
      return;
    }

    const duplicateIndices = findDuplicates(rows, transactions);
    const storage = getStorageProvider();
    const aiCache = await storage.getAiCache();
    const aiCacheMap = new Map(aiCache.map((e) => [e.merchantNormalized, e]));
    const miscCategoryId = categories.find((c) => c.name === 'Miscellaneous')?.id ?? null;

    const importRows: ImportRow[] = [];
    const total = rows.length;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const normalized = normalizeMerchant(row.description);

      // Update progress
      setImportState((s) => s && ({ ...s, processingProgress: Math.round((i / total) * 100) }));

      let categoryId: string | null = null;
      let source: CategorizationSource = 'manual';
      let confidence: CategorizationConfidence | null = null;
      let aiReasoning: string | undefined;

      // 1. Rule engine
      const matchedRule = applyRules(row.description, merchantRules);
      if (matchedRule) {
        categoryId = matchedRule.categoryId;
        source = 'rule';
        confidence = 'high';
      } else {
        // 2. AI cache
        const cached = aiCacheMap.get(normalized);
        if (cached) {
          categoryId = cached.categoryId;
          source = 'ai';
          confidence = cached.confidence;
          aiReasoning = cached.reasoning;
          // Update hit count
          await storage.upsertAiCache(normalized, { ...cached, hitCount: cached.hitCount + 1 });
        } else if (settings?.anthropicApiKey) {
          // 3. Claude API
          try {
            // Pass only leaf categories (subcategories + leaf parents) so Claude
            // targets the most specific level. Include parent name as context.
            const parentMap = new Map(categories.map((c) => [c.id, c.name]));
            const availableCats = categories
              .filter((c) => c.type === 'expense')
              .filter((c) => {
                // Include if it's a subcategory OR a root category with no children
                if (c.parentId) return true;
                return !categories.some((child) => child.parentId === c.id);
              })
              .map((c) => ({
                id: c.id,
                name: c.name,
                parentName: c.parentId ? parentMap.get(c.parentId) : undefined,
              }));

            const result = await callClaude(
              row.description,
              row.amount,
              availableCats,
              settings.anthropicApiKey
            );
            categoryId = result.categoryId;
            source = 'ai';
            confidence = result.confidence;
            aiReasoning = result.reasoning;

            // Cache result
            await storage.upsertAiCache(normalized, {
              merchantNormalized: normalized,
              categoryId,
              confidence,
              reasoning: result.reasoning,
              hitCount: 1,
              createdAt: nowISO(),
            });
          } catch {
            categoryId = miscCategoryId;
            source = 'ai';
            confidence = 'low';
          }
        }

        // 4. Fallback to Miscellaneous
        if (!categoryId) {
          categoryId = miscCategoryId;
          confidence = 'low';
        }
      }

      importRows.push({
        index: i,
        date: row.date,
        description: row.description,
        amount: row.amount,
        categoryId,
        categorizationSource: source,
        categorizationConfidence: confidence,
        isDuplicate: duplicateIndices.has(i),
        excluded: duplicateIndices.has(i), // duplicates excluded by default
        aiReasoning,
      });
    }

    setImportState({
      filename: file.name,
      bankProfileId: profile?.id ?? 'unknown',
      rows: importRows,
      isProcessing: false,
      processingProgress: 100,
      error: null,
    });
    setIsPreviewOpen(true);
  }, [transactions, merchantRules, categories, settings]);

  function updateRow(index: number, updates: Partial<ImportRow>) {
    setImportState((s) => {
      if (!s) return s;
      return {
        ...s,
        rows: s.rows.map((r) => (r.index === index ? { ...r, ...updates } : r)),
      };
    });
  }

  async function confirmImport(learnFromCorrections: boolean): Promise<number> {
    if (!importState) return 0;

    const toImport = importState.rows.filter((r) => !r.excluded);
    const miscId = categories.find((c) => c.name === 'Miscellaneous')?.id ?? '';
    const sessionId = generateId();
    const storage = getStorageProvider();

    // Build all transaction objects up-front
    const txData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[] = toImport.map((row) => ({
      userId: DEFAULT_USER_ID,
      type: 'expense' as const,
      amount: row.amount,
      currency: 'AUD',
      date: row.date,
      categoryId: row.categoryId ?? miscId,
      description: row.description,
      tags: [],
      notes: null,
      isRecurring: false,
      recurrenceRule: null,
      recurrenceGroupId: null,
      accountId: null,
      attachments: [],
      importSessionId: sessionId,
      merchantRaw: row.description,
      categorizationSource: row.categorizationSource,
      categorizationConfidence: row.categorizationConfidence,
      isExcludedFromBudget: false,
      isSplit: false,
      splitGroupId: null,
    }));

    // Write all transactions in one localStorage call — no per-row re-renders
    await storage.createTransactionsBatch(txData);

    // Learn from corrections
    if (learnFromCorrections) {
      // Build a live map of pattern → rule so we can upsert correctly
      const patternToRule = new Map(
        merchantRules.map((r) => [r.pattern.toLowerCase(), r])
      );

      for (const row of toImport) {
        if (!row.categoryId) continue;

        const normalized = normalizeMerchant(row.description);
        const pattern = (normalized.split(' ')[0] ?? normalized).toLowerCase();
        if (!pattern) continue;

        const existing = patternToRule.get(pattern);
        const isCorrection = row.categorizationSource === 'user-correction';

        if (isCorrection) {
          // User explicitly changed the category — save as a high-priority 'user'
          // rule so it overrides both system and ai-learned rules in future imports.
          if (existing) {
            if (existing.categoryId !== row.categoryId || existing.source !== 'user') {
              await storage.updateMerchantRule(existing.id, {
                categoryId: row.categoryId,
                source: 'user',
              });
              patternToRule.set(pattern, { ...existing, categoryId: row.categoryId, source: 'user' });
            }
          } else {
            const created = await storage.createMerchantRule({
              pattern,
              isRegex: false,
              categoryId: row.categoryId,
              source: 'user',
              matchCount: 1,
            });
            patternToRule.set(pattern, created);
          }
        } else if (!existing && row.categorizationSource !== 'rule') {
          // New pattern not yet in any rule, categorised by AI or left as manual —
          // save as ai-learned so future imports skip the AI call.
          const created = await storage.createMerchantRule({
            pattern,
            isRegex: false,
            categoryId: row.categoryId,
            source: 'ai-learned',
            matchCount: 1,
          });
          patternToRule.set(pattern, created);
        }
      }
    }

    await storage.createImportSession({
      userId: DEFAULT_USER_ID,
      filename: importState.filename,
      bankProfileId: importState.bankProfileId,
      importedAt: nowISO(),
      rowCount: importState.rows.length,
      duplicatesSkipped: importState.rows.filter((r) => r.isDuplicate).length,
      transactionIds: [],
    });

    // Single state refresh instead of N individual set() calls
    await useAppStore.getState().loadAll();

    setIsPreviewOpen(false);
    setImportState(null);
    return toImport.length;
  }

  function cancelImport() {
    setIsPreviewOpen(false);
    setImportState(null);
  }

  const miscCount = importState?.rows.filter(
    (r) => !r.excluded && r.categorizationConfidence === 'low'
  ).length ?? 0;

  return {
    importState,
    isPreviewOpen,
    processFile,
    updateRow,
    confirmImport,
    cancelImport,
    miscCount,
  };
}
