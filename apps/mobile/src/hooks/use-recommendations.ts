import type { RecommendResult } from '@wcic/matching';
import { useEffect, useMemo, useState } from 'react';

import { isServerConfigured, recommendOffline, recommendOnline } from '@/lib/recommend';

/**
 * Shows on-phone matches straight away, then swaps in the server's answer when it arrives.
 * If the server is unreachable, the on-phone matches stay.
 */
export function useRecommendations(pantry: string[]): RecommendResult {
  const offline = useMemo(() => recommendOffline(pantry), [pantry]);
  const [online, setOnline] = useState<{ pantry: string[]; result: RecommendResult } | null>(null);

  useEffect(() => {
    if (!isServerConfigured || pantry.length === 0) return;
    const controller = new AbortController();
    recommendOnline(pantry, controller.signal)
      .then((result) => setOnline({ pantry, result }))
      .catch(() => {});
    return () => controller.abort();
  }, [pantry]);

  return online?.pantry === pantry ? online.result : offline;
}
