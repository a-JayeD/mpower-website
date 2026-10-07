import { siteBase, type Env } from './_lib';

/**
 * Allow everything on the main address. When a custom domain is set as
 * VITE_SITE_URL, the *.pages.dev copies (and preview builds) ask search
 * engines not to index them, so results are not split across two addresses.
 */
export const onRequestGet: PagesFunction<Env> = (ctx) => {
  const base = siteBase(ctx.env, ctx.request);
  const host = new URL(ctx.request.url).host;
  const canonicalHost = new URL(base).host;
  const body = host !== canonicalHost
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
};
