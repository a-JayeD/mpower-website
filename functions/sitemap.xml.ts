import { seoRoutes } from '../src/lib/seo/head';
import { rest, siteBase, type Env } from './_lib';

/** Sitemap built from the live database, so new courses and updates appear without a rebuild. */
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const base = siteBase(ctx.env, ctx.request);
  const urls: Array<{ loc: string; lastmod?: string }> = Object.keys(seoRoutes.routes).map((p) => ({ loc: `${base}${p}` }));
  try {
    const [courses, updates, albums] = await Promise.all([
      rest<{ slug: string; updated_at: string }>(ctx.env, 'courses?select=slug,updated_at&status=in.(active,upcoming)&order=display_order'),
      rest<{ slug: string; updated_at: string }>(ctx.env, `updates?select=slug,updated_at&is_published=eq.true&publish_date=lte.${new Date().toISOString()}&order=publish_date.desc&limit=1000`),
      rest<{ slug: string; updated_at: string }>(ctx.env, 'gallery_albums?select=slug,updated_at&is_published=eq.true'),
    ]);
    for (const c of courses) urls.push({ loc: `${base}/courses/${c.slug}`, lastmod: c.updated_at });
    for (const u of updates) urls.push({ loc: `${base}/updates/${u.slug}`, lastmod: u.updated_at });
    for (const a of albums) urls.push({ loc: `${base}/gallery/${a.slug}`, lastmod: a.updated_at });
  } catch { /* database unreachable: still serve the fixed pages */ }

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
};
