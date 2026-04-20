'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { Eye, EyeOff, Check } from 'lucide-react';

export function ApiKeySettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasKey = !!settings?.anthropicApiKey;

  async function handleSave() {
    await updateSettings({ anthropicApiKey: keyInput.trim() || null });
    setKeyInput('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleRemove() {
    await updateSettings({ anthropicApiKey: null });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">AI Categorization (Anthropic API)</CardTitle>
        <CardDescription>
          Add your Anthropic API key to enable AI-powered categorization when importing bank statements.
          Your key is stored locally and never transmitted anywhere except directly to Anthropic.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasKey ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <Check className="size-4" />
              API key configured
            </div>
            <Button variant="outline" size="sm" onClick={handleRemove}>
              Remove key
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="apiKey">Anthropic API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Button onClick={handleSave} disabled={!keyInput.trim()}>
                {saved ? 'Saved!' : 'Save'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key at console.anthropic.com. Without a key, unrecognized merchants go straight to Miscellaneous.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
