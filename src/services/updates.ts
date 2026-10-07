import { select, selectOne } from '@/lib/api';
import type { NewsUpdate, Paged, UpdateType } from '@/types/content';

const COLS = 'id,slug,type,title_en,title_bn,content_en,content_bn,cover_image_path,publish_date,is_featured';
export const UPDATES_PAGE = 9;

/** Published updates whose publish date has passed (RLS also enforces this). */
export async function listUpdates(opts: { type?: UpdateType; page?: number; limit?: number; excludeId?: string } = {}): Promise<Paged<NewsUpdate>> {
  const size = opts.limit ?? UPDATES_PAGE;
  const from = ((opts.page ?? 1) - 1) * size;
  const { rows, total } = await select<NewsUpdate>('updates', {
    params: {
      select: COLS,
      is_published: 'eq.true',
      publish_date: `lte.${new Date().toISOString()}`,
      type: opts.type ? `eq.${opts.type}` : undefined,
      id: opts.excludeId ? `neq.${opts.excludeId}` : undefined,
      order: 'publish_date.desc',
    },
    range: [from, from + size - 1],
    count: true,
  });
  return { rows, total: total ?? rows.length };
}

export async function getUpdate(slug: string): Promise<NewsUpdate | null> {
  return selectOne<NewsUpdate>('updates', { select: COLS, slug: `eq.${slug}`, is_published: 'eq.true' });
}
