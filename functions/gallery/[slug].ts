import { excerpt, preferBn } from '../../src/lib/seo/head';
import { defaultImage, htmlWithHead, mediaUrl, rest, siteBase, siteName, slugParam, type Env } from '../_lib';

interface Row {
  slug: string; title_en: string; title_bn: string; description_en: string; description_bn: string;
  cover: { image_path: string } | null;
}

export const onRequestGet: PagesFunction<Env, 'slug'> = (ctx) => htmlWithHead(ctx, async () => {
  const slug = slugParam(ctx.params.slug);
  if (!slug) return null;
  const base = siteBase(ctx.env, ctx.request);
  const [a] = await rest<Row>(ctx.env,
    `gallery_albums?select=slug,title_en,title_bn,description_en,description_bn,cover:gallery_images!gallery_albums_cover_image_fkey(image_path)&slug=eq.${slug}&is_published=eq.true&limit=1`);
  if (!a) return { status: 404, head: { title: `Album not found | ${siteName.en}`, description: '', noindex: true } };

  const title = preferBn(a.title_bn, a.title_en);
  return {
    head: {
      title: `${title} | ${siteName.bn}`,
      description: excerpt(preferBn(a.description_bn, a.description_en) || `${a.title_en} — ${siteName.en}`),
      url: `${base}/gallery/${a.slug}`,
      image: mediaUrl(ctx.env, a.cover?.image_path) ?? defaultImage(base),
    },
  };
});
