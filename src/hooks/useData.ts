import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tiny data loader with an in-memory cache.
 * Pages visited again within STALE_MS render instantly from cache and are not
 * refetched, which keeps Supabase usage low on the free tier. No polling, no realtime.
 */
const STALE_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; data: unknown }>();
const inflight = new Map<string, Promise<unknown>>();

export function prefetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < STALE_MS) return Promise.resolve(hit.data as T);
  const running = inflight.get(key);
  if (running) return running as Promise<T>;
  const p = fetcher()
    .then((data) => { cache.set(key, { at: Date.now(), data }); return data; })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

export interface DataState<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
  retry: () => void;
}

export function useData<T>(key: string | null, fetcher: () => Promise<T>): DataState<T> {
  const hit = key ? cache.get(key) : undefined;
  const [state, setState] = useState<{ key: string | null; data: T | undefined; error: unknown }>({
    key, data: hit?.data as T | undefined, error: undefined,
  });
  const [attempt, setAttempt] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!key) return;
    let active = true;
    const cached = cache.get(key);
    setState({ key, data: cached?.data as T | undefined, error: undefined });
    prefetch(key, () => fetcherRef.current())
      .then((data) => active && setState({ key, data: data as T, error: undefined }))
      .catch((error) => active && setState((s) => ({ key, data: s.key === key ? s.data : undefined, error })));
    return () => { active = false; };
  }, [key, attempt]);

  const retry = useCallback(() => {
    if (key) cache.delete(key);
    setAttempt((a) => a + 1);
  }, [key]);

  const current = state.key === key;
  const data = current ? state.data : (hit?.data as T | undefined);
  return { data, error: current ? state.error : undefined, loading: !!key && data === undefined && !(current && state.error), retry };
}
