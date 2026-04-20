import type { MerchantRule } from '@/types/finance';
import { normalizeMerchant } from './normalizer';

// Priority: user > ai-learned > system. First match wins.
const SOURCE_PRIORITY: Record<MerchantRule['source'], number> = {
  user: 0,
  'ai-learned': 1,
  system: 2,
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Word-boundary match: the pattern must appear as a complete word or phrase.
// Prevents 'next' matching 'nextdoor', 'three' matching 'three forks', etc.
function matchesWordBoundary(text: string, pattern: string): boolean {
  try {
    const re = new RegExp(`\\b${escapeRegex(pattern)}\\b`, 'i');
    return re.test(text);
  } catch {
    return text.includes(pattern.toLowerCase());
  }
}

export function applyRules(
  merchantRaw: string,
  rules: MerchantRule[]
): MerchantRule | null {
  const normalized = normalizeMerchant(merchantRaw);

  const sorted = [...rules].sort(
    (a, b) => SOURCE_PRIORITY[a.source] - SOURCE_PRIORITY[b.source]
  );

  for (const rule of sorted) {
    const pattern = rule.pattern.toLowerCase();

    if (rule.isRegex) {
      try {
        const re = new RegExp(rule.pattern, 'i');
        if (re.test(normalized) || re.test(merchantRaw.toLowerCase())) return rule;
      } catch {
        // invalid regex — skip
      }
    } else if (rule.source === 'user' || rule.source === 'ai-learned') {
      // Stricter word-boundary matching for learned rules to prevent
      // short patterns accidentally matching unrelated merchants.
      if (
        matchesWordBoundary(normalized, pattern) ||
        matchesWordBoundary(merchantRaw.toLowerCase(), pattern)
      ) {
        return rule;
      }
    } else {
      // System rules use the original substring matching for broad coverage.
      if (
        normalized.includes(pattern) ||
        merchantRaw.toLowerCase().includes(pattern)
      ) {
        return rule;
      }
    }
  }
  return null;
}
