import type { MerchantRule } from '@/types/finance';
import { normalizeMerchant } from './normalizer';

// Priority: user > ai-learned > system. First match wins.
const SOURCE_PRIORITY: Record<MerchantRule['source'], number> = {
  user: 0,
  'ai-learned': 1,
  system: 2,
};

export function applyRules(
  merchantRaw: string,
  rules: MerchantRule[]
): MerchantRule | null {
  const normalized = normalizeMerchant(merchantRaw);

  const sorted = [...rules].sort(
    (a, b) => SOURCE_PRIORITY[a.source] - SOURCE_PRIORITY[b.source]
  );

  for (const rule of sorted) {
    if (rule.isRegex) {
      try {
        const re = new RegExp(rule.pattern, 'i');
        if (re.test(normalized) || re.test(merchantRaw.toLowerCase())) return rule;
      } catch {
        // invalid regex — skip
      }
    } else {
      if (
        normalized.includes(rule.pattern.toLowerCase()) ||
        merchantRaw.toLowerCase().includes(rule.pattern.toLowerCase())
      ) {
        return rule;
      }
    }
  }
  return null;
}
