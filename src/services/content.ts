import { select } from '@/lib/api';
import type { Faq, Instructor, SiteSettings, SuccessStory } from '@/types/content';

export async function getSettings(): Promise<SiteSettings | null> {
  const { rows } = await select<SiteSettings>('site_settings', {
    params: {
      select: [
        'center_name_en', 'center_name_bn', 'logo_path', 'phone', 'whatsapp', 'email', 'facebook_url', 'messenger_url',
        'youtube_url', 'google_maps_url', 'map_embed_url', 'address_en', 'address_bn', 'opening_hours_en', 'opening_hours_bn',
        'hero_title_en', 'hero_title_bn', 'hero_subtitle_en', 'hero_subtitle_bn', 'footer_text_en', 'footer_text_bn',
        'about_en', 'about_bn',
      ].join(','),
      limit: '1',
    },
  });
  return rows[0] ?? null;
}

export async function listInstructors(limit?: number): Promise<Instructor[]> {
  const { rows } = await select<Instructor>('instructors', {
    params: {
      select: 'id,name_en,name_bn,photo_path,position_en,position_bn,bio_en,bio_bn,specialization',
      is_active: 'eq.true',
      order: 'display_order.asc,name_en.asc',
      limit: limit ? String(limit) : undefined,
    },
  });
  return rows;
}

export async function listStories(limit?: number): Promise<SuccessStory[]> {
  const { rows } = await select<SuccessStory>('success_stories', {
    params: {
      select: 'id,student_name,photo_path,story_en,story_bn,is_featured,course:courses(slug,course_name_en,course_name_bn)',
      is_published: 'eq.true',
      order: limit ? 'is_featured.desc,display_order.asc' : 'display_order.asc,created_at.desc',
      limit: limit ? String(limit) : undefined,
    },
  });
  return rows;
}

export async function listFaqs(limit?: number): Promise<Faq[]> {
  const { rows } = await select<Faq>('faqs', {
    params: {
      select: 'id,question_en,question_bn,answer_en,answer_bn',
      is_published: 'eq.true',
      order: 'display_order.asc,created_at.asc',
      limit: limit ? String(limit) : undefined,
    },
  });
  return rows;
}
