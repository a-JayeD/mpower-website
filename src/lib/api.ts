/**
 * Minimal read-only client for Supabase's REST API (PostgREST).
 * The public site only needs simple reads and one insert, so this replaces
 * the ~60 kB supabase-js library with a few lines of fetch.
 * What visitors can see is decided by Row Level Security in the database.
 */
import { config } from './config';

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string, public hint?: string) {
    super(message);
  }
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { apikey: config.supabaseKey, ...extra };
  // Legacy anon keys are JWTs and also go in Authorization; new publishable keys must not.
  if (config.supabaseKey.startsWith('eyJ')) h.Authorization = `Bearer ${config.supabaseKey}`;
  return h;
}

async function fail(res: Response): Promise<never> {
  let body: { message?: string; code?: string; hint?: string } = {};
  try { body = await res.json(); } catch { /* not JSON */ }
  throw new ApiError(body.message || res.statusText, res.status, body.code, body.hint);
}

export interface SelectOptions {
  /** PostgREST query parameters, e.g. { select: '*', status: 'eq.active', order: 'display_order' } */
  params: Record<string, string | undefined>;
  /** Inclusive row range for pagination */
  range?: [number, number];
  count?: boolean;
  signal?: AbortSignal;
}

export async function select<T>(table: string, opts: SelectOptions): Promise<{ rows: T[]; total: number | null }> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(opts.params)) if (v !== undefined) qs.append(k, v);
  const extra: Record<string, string> = {};
  if (opts.range) { extra['Range-Unit'] = 'items'; extra.Range = `${opts.range[0]}-${opts.range[1]}`; }
  if (opts.count) extra.Prefer = 'count=exact';
  const res = await fetch(`${config.supabaseUrl}/rest/v1/${table}?${qs}`, { headers: headers(extra), signal: opts.signal });
  if (!res.ok && res.status !== 206) await fail(res);
  const rows = (await res.json()) as T[];
  const cr = res.headers.get('content-range'); // "0-11/57"
  const total = cr && cr.includes('/') && !cr.endsWith('*') ? Number(cr.split('/')[1]) : null;
  return { rows, total };
}

export async function selectOne<T>(table: string, params: Record<string, string>, signal?: AbortSignal): Promise<T | null> {
  const { rows } = await select<T>(table, { params: { ...params, limit: '1' }, signal });
  return rows[0] ?? null;
}

/** Insert without reading the row back (anonymous visitors may not read contact messages). */
export async function insert(table: string, row: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${config.supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  });
  if (!res.ok) await fail(res);
}

/** Public URL of a file in the public-media bucket. */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const clean = path.split('/').map(encodeURIComponent).join('/');
  return `${config.supabaseUrl}/storage/v1/object/public/${config.mediaBucket}/${clean}`;
}
