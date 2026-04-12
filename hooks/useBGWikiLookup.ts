/**
 * Hook: useBGWikiLookup
 *
 * Fetches weapon data from BGWiki via our Netlify Function proxy.
 * Never calls BGWiki directly — avoids CORS entirely.
 *
 * Usage:
 *   const { item, loading, error, search, clear } = useBGWikiLookup();
 *   await search('Verethragna');
 */

import { useState, useCallback } from 'react';
import type { GearItem, WeaponType } from '@/data/gear/types';

export interface BGWikiLookupResult {
  item:    GearItem | null;
  loading: boolean;
  error:   string | null;
  /** Fetch a weapon from BGWiki by name */
  search:  (name: string, weaponType?: WeaponType) => Promise<void>;
  /** Clear the current result */
  clear:   () => void;
}

const LOOKUP_ENDPOINT = '/.netlify/functions/bgwiki-lookup';

export function useBGWikiLookup(): BGWikiLookupResult {
  const [item,    setItem]    = useState<GearItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const search = useCallback(async (name: string, weaponType?: WeaponType) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setItem(null);

    try {
      const params = new URLSearchParams({ weapon: trimmed });
      if (weaponType) params.set('weaponType', weaponType);

      const res = await fetch(`${LOOKUP_ENDPOINT}?${params}`);
      const data = await res.json() as { success: boolean; item?: GearItem; error?: string };

      if (!data.success || !data.item) {
        setError(data.error ?? 'Item not found on BGWiki');
        return;
      }

      setItem(data.item);
    } catch (err) {
      setError('Network error — check connection');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setItem(null);
    setError(null);
  }, []);

  return { item, loading, error, search, clear };
}
