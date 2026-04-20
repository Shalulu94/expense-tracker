import { LocalStorageProvider } from './localStorage.provider';
import type { IStorageProvider } from './types';

let _provider: IStorageProvider | null = null;

// Swap this factory to migrate to Supabase — zero UI/hook/store changes needed.
export function getStorageProvider(): IStorageProvider {
  if (!_provider) {
    _provider = new LocalStorageProvider();
  }
  return _provider;
}

export type { IStorageProvider };
