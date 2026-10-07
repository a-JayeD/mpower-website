/**
 * Shared code for the Cloudflare Pages Functions.
 *
 * Only a few URLs run code at all (see public/_routes.json): course, update
 * and album pages, the sitemap and robots.txt. Everything else is a free
 * static file. The functions add the right title, description and preview
 * image to the HTML so links shared on Facebook/WhatsApp show a proper card.
 */
import { headTags, injectHead, seoRoutes, type HeadInput } from '../src/lib/seo/head';

export interface Env {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_SITE_URL?: string;
  ASSETS: Fetcher;
}

export const CACHE_SECONDS = 300;

/** Public read from Supabase REST with the anon key (Row Level Security applies). */
export async function rest<T>(env: Env, path: string): Promise<T[]> {
  const base = (env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  const key = env.VITE_SUPABASE_ANON_KEY || '';
  const headers: Record<string, string> = { apikey: key, Accept: 'application/json' };
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
  // Give up quickly: a slow database must never hold the page back.
  const res = await fetch(`${base}/rest/v1/${path}`, {
    headers, signal: AbortSignal.timeout(2500), cf: { cacheTtl: 60, cacheEverything: true },
  } as RequestInit);
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return res.json();
}

export function mediaUrl(env: Env, path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  const base = (env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  return `${base}/storage/v1/object/public/public-media/${path.split('/').map(encodeURIComponent).join('/')}`;
}

/** The canonical site address: VITE_SITE_URL when set, otherwise the address being visited. */
export function siteBase(env: Env, request: Request): string {
  return (env.VITE_SITE_URL || new URL(request.url).origin).replace(/\/$/, '');
}

export function slugParam(value: string | string[] | undefined): string | null {
  const v = Array.isArray(value) ? value.join('/') : value ?? '';
  return /^[a-z0-9-]{1,120}$/i.test(v) ? v.toLowerCase() : null;
}

export const defaultImage = (base: string) => `${base}${seoRoutes.defaultImage}`;
export const siteName = seoRoutes.siteName;

/**
 * Serve the app's HTML with page-specific head tags. Falls back to the plain
 * app (which shows its own "not found" or loads the data itself) on any error,
 * so a Supabase hiccup never breaks the page.
 */
export async function htmlWithHead(
  ctx: EventContext<Env, string, unknown>,
  build: () => Promise<{ head: HeadInput; status?: number } | null>,
): Promise<Response> {
  const cache = (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;
  const key = new Request(new URL(ctx.request.url).toString(), { method: 'GET' });
  try {
    const hit = await cache?.match(key);
    if (hit) return hit;
  } catch { /* cache unavailable on *.pages.dev: carry on */ }

  const shell = await ctx.env.ASSETS.fetch(new URL('/', ctx.request.url));
  let result: Awaited<ReturnType<typeof build>> = null;
  try {
    result = await build();
  } catch {
    return shell;
  }
  if (!result) return shell;

  const html = injectHead(await shell.text(), headTags(result.head));
  const res = new Response(html, {
    status: result.status ?? 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': `public, max-age=0, s-maxage=${CACHE_SECONDS}`,
    },
  });
  if ((result.status ?? 200) === 200) {
    try { ctx.waitUntil(cache?.put(key, res.clone()) ?? Promise.resolve()); } catch { /* ignore */ }
  }
  return res;
}
