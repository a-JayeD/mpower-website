import { excerpt, preferBn } from '../../src/lib/seo/head';
import { defaultImage, htmlWithHead, mediaUrl, rest, siteBase, siteName, slugParam, type Env } from '../_lib';

interface Row {
  slug: string; course_name_en: string; course_name_bn: string; description_en: string; description_bn: string;
  image_path: string | null; joining_fee: number; total_classes: number; duration_en: string;
}

export const onRequestGet: PagesFunction<Env, 'slug'> = (ctx) => htmlWithHead(ctx, async () => {
  const slug = slugParam(ctx.params.slug);
  if (!slug) return null;
  const base = siteBase(ctx.env, ctx.request);
  const [c] = await rest<Row>(ctx.env,
    `courses?select=slug,course_name_en,course_name_bn,description_en,description_bn,image_path,joining_fee,total_classes,duration_en&slug=eq.${slug}&status=in.(active,upcoming)&limit=1`);
  if (!c) return { status: 404, head: { title: `Course not found | ${siteName.en}`, description: '', noindex: true } };

  const name = preferBn(c.course_name_bn, c.course_name_en);
  const desc = excerpt(preferBn(c.description_bn, c.description_en) || `${c.course_name_en}: ${c.total_classes} classes${c.duration_en ? `, ${c.duration_en}` : ''}.`);
  const url = `${base}/courses/${c.slug}`;
  return {
    head: {
      title: `${name} | ${siteName.bn}`,
      description: desc,
      url,
      image: mediaUrl(ctx.env, c.image_path) ?? defaultImage(base),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: c.course_name_en,
        alternateName: c.course_name_bn || undefined,
        description: excerpt(c.description_en || desc, 300),
        url,
        provider: { '@type': 'EducationalOrganization', name: siteName.en, url: base },
        ...(Number(c.joining_fee) > 0 ? { offers: { '@type': 'Offer', price: Number(c.joining_fee), priceCurrency: 'BDT', category: 'Joining fee' } } : {}),
      },
    },
  };
});
