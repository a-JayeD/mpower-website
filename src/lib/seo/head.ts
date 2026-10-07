/**
 * Shared <head> builder. Pure string functions with no browser or Node APIs,
 * so the same code runs in the Vite build (static pages) and in the
 * Cloudflare Pages Functions (course / update / album link previews).
 */
import routesJson from './routes.json';

export type Lang = 'bn' | 'en';
export type Localized = Record<Lang, string>;

export const seoRoutes = routesJson as {
  siteName: Localized;
  defaultImage: string;
  routes: Record<string, { title: Localized; description: Localized }>;
};

export interface HeadInput {
  title: string;
  description: string;
  /** Absolute URL of this page; omitted when the site address is unknown at build time. */
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  lang?: Lang;
  noindex?: boolean;
  publishedTime?: string;
  jsonLd?: Record<string, unknown>;
}

export const SEO_START = '<!--seo:start-->';
export const SEO_END = '<!--seo:end-->';

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Plain-text excerpt cut on a word boundary. */
export function excerpt(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:–-]+$/, '')}…`;
}

export function absoluteUrl(base: string | undefined, pathOrUrl: string | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  if (!base) return undefined;
  return `${base.replace(/\/$/, '')}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function headTags(h: HeadInput): string {
  const lang = h.lang ?? 'bn';
  const siteName = seoRoutes.siteName.en;
  const t = escapeHtml(h.title);
  const d = escapeHtml(h.description);
  const tags = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta property="og:type" content="${h.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:locale" content="${lang === 'bn' ? 'bn_BD' : 'en_US'}" />`,
    `<meta property="og:locale:alternate" content="${lang === 'bn' ? 'en_US' : 'bn_BD'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (h.image) tags.push(`<meta property="og:image" content="${escapeHtml(h.image)}" />`);
  if (h.url) {
    const u = escapeHtml(h.url);
    tags.push(
      `<meta property="og:url" content="${u}" />`,
      `<link rel="canonical" href="${u}" />`,
      `<link rel="alternate" hreflang="bn" href="${u}" />`,
      `<link rel="alternate" hreflang="en" href="${u}${h.url.includes('?') ? '&amp;' : '?'}lang=en" />`,
      `<link rel="alternate" hreflang="x-default" href="${u}" />`,
    );
  }
  if (h.publishedTime) tags.push(`<meta property="article:published_time" content="${escapeHtml(h.publishedTime)}" />`);
  if (h.noindex) tags.push('<meta name="robots" content="noindex" />');
  if (h.jsonLd) {
    // Escape "<" so content can never close the script element.
    tags.push(`<script type="application/ld+json">${JSON.stringify(h.jsonLd).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.map((x) => `    ${x}`).join('\n');
}

/** Replace the block between the seo markers in index.html. */
export function injectHead(html: string, tags: string): string {
  const a = html.indexOf(SEO_START);
  const b = html.indexOf(SEO_END);
  if (a === -1 || b === -1) return html;
  return `${html.slice(0, a + SEO_START.length)}\n${tags}\n    ${html.slice(b)}`;
}

/** Choose the visitor-facing text: Bangla first (site default), English if Bangla is empty. */
export function preferBn(bn: string | null | undefined, en: string | null | undefined): string {
  return (bn && bn.trim()) || (en && en.trim()) || '';
}
