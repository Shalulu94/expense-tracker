import Anthropic from '@anthropic-ai/sdk';
import type { CategorizationResult } from './types';

export async function callClaude(
  merchantName: string,
  amount: number,
  availableCategories: { id: string; name: string; parentName?: string }[],
  apiKey: string
): Promise<CategorizationResult> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const categoryList = availableCategories
    .map((c) => `- ${c.parentName ? `${c.parentName} > ` : ''}${c.name} (id: ${c.id})`)
    .join('\n');

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Categorize this bank transaction. Respond with JSON only, no other text.

Transaction: "${merchantName}"
Amount: £${amount.toFixed(2)}

Available categories:
${categoryList}

Respond with exactly this JSON structure:
{"categoryId": "<id or null if genuinely ambiguous>", "confidence": "high|medium|low", "reasoning": "<brief explanation>"}

Use null for categoryId only if you truly cannot determine the category. Prefer a low-confidence guess over null.`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';

  try {
    const parsed = JSON.parse(text) as {
      categoryId: string | null;
      confidence: 'high' | 'medium' | 'low';
      reasoning: string;
    };
    return {
      categoryId: parsed.categoryId,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
    };
  } catch {
    return { categoryId: null, confidence: 'low', reasoning: 'Failed to parse AI response' };
  }
}
