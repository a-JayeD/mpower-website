import { excerpt, preferBn } from '../../src/lib/seo/head';
import { defaultImage, htmlWithHead, mediaUrl, rest, siteBase, siteName, slugParam, type Env } from '../_lib';

interface Row {
  slug: string; title_en: string; title_bn: string; content_en: string; content_bn: string;
  cover_image_path: string | null; publish_date: string; updated_at: string;
}

export const onRequestGet: PagesFunction<Env, 'slug'> = (ctx) => htmlWithHead(ctx, async () => {
  const slug = slugParam(ctx.params.slug);
  if (!slug) return null;
  const base = siteBase(ctx.env, ctx.request);
  const [u] = await rest<Row>(ctx.env,
    `updates?select=slug,title_en,title_bn,content_en,content_bn,cover_image_path,publish_date,updated_at&slug=eq.${slug}&is_published=eq.true&limit=1`);
  if (!u) return { status: 404, head: { title: `Update not found | ${siteName.en}`, description: '', noindex: true } };

  const title = preferBn(u.title_bn, u.title_en);
  const url = `${base}/updates/${u.slug}`;
  const image = mediaUrl(ctx.env, u.cover_image_path) ?? defaultImage(base);
  return {
    head: {
      title: `${title} | ${siteName.bn}`,
      description: excerpt(preferBn(u.content_bn, u.content_en) || title),
      url,
      image,
      type: 'article',
      publishedTime: u.publish_date,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: excerpt(u.title_en || title, 110),
        datePublished: u.publish_date,
        dateModified: u.updated_at,
        image: [image],
        mainEntityOfPage: url,
        publisher: { '@type': 'EducationalOrganization', name: siteName.en, url: base },
      },
    },
  };
});
