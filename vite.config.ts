import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { absoluteUrl, headTags, injectHead, seoRoutes } from './src/lib/seo/head';

/**
 * After the build, write one HTML file per static route with its own title,
 * description and social-preview tags. Search engines and link previews then
 * see real metadata without any server. (Course, update and album pages are
 * handled at request time by the Pages Functions in /functions.)
 */
function prerenderMeta(siteUrl: string | undefined): Plugin {
  return {
    name: 'mpower-prerender-meta',
    apply: 'build',
    closeBundle() {
      const dist = fileURLToPath(new URL('./dist', import.meta.url));
      const template = readFileSync(join(dist, 'index.html'), 'utf8');
      for (const [route, meta] of Object.entries(seoRoutes.routes)) {
        const tags = headTags({
          title: meta.title.bn,
          description: meta.description.bn,
          url: absoluteUrl(siteUrl, route === '/' ? '/' : route),
          image: absoluteUrl(siteUrl, seoRoutes.defaultImage) ?? seoRoutes.defaultImage,
          jsonLd: route === '/' ? {
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: seoRoutes.siteName.en,
            alternateName: seoRoutes.siteName.bn,
            ...(siteUrl ? { url: siteUrl } : {}),
          } : undefined,
        });
        const html = injectHead(template, tags);
        if (route === '/') writeFileSync(join(dist, 'index.html'), html);
        // about.html is served by Cloudflare Pages at /about (no trailing-slash redirect).
        else writeFileSync(join(dist, `${route.slice(1)}.html`), html);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL?.replace(/\/$/, '') || undefined;
  return {
    plugins: [react(), prerenderMeta(siteUrl)],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      target: 'es2020',
      sourcemap: false,
      rollupOptions: {
        output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] } },
      },
    },
  };
});
