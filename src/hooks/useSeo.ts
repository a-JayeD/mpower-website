import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { config } from '@/lib/config';
import { useI18n } from '@/lib/i18n';
import { seoRoutes } from '@/lib/seo/head';

interface Seo {
  title?: string;
  description?: string;
  image?: string | null;
  type?: 'website' | 'article';
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, value: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (value === null) { el?.remove(); return; }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

function setLink(rel: string, href: string, hreflang?: string) {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Keep <title>, description, Open Graph and canonical tags in sync while
 * visitors navigate inside the app. First-load HTML already carries the
 * same tags (build-time for fixed pages, Pages Functions for detail pages).
 */
export function useSeo(seo: Seo, ready = true) {
  const { lang } = useI18n();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!ready) return;
    const site = seoRoutes.siteName[lang];
    const fixed = seoRoutes.routes[pathname];
    const title = seo.title ? `${seo.title} | ${site}` : fixed?.title[lang] ?? site;
    const description = seo.description || fixed?.description[lang] || seoRoutes.routes['/'].description[lang];
    const url = `${config.siteUrl}${pathname === '/' ? '/' : pathname}`;
    const image = seo.image || `${config.siteUrl}${seoRoutes.defaultImage}`;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', seo.type ?? 'website');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:locale', lang === 'bn' ? 'bn_BD' : 'en_US');
    setMeta('name', 'robots', seo.noindex ? 'noindex' : null);
    setLink('canonical', url);
    setLink('alternate', url, 'bn');
    setLink('alternate', `${url}?lang=en`, 'en');
    setLink('alternate', url, 'x-default');
  }, [ready, seo.title, seo.description, seo.image, seo.type, seo.noindex, lang, pathname]);
}
