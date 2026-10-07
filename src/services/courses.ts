import { select, selectOne } from '@/lib/api';
import type { Course } from '@/types/content';

const COLS = 'id,slug,course_name_en,course_name_bn,description_en,description_bn,joining_fee,total_classes,duration_en,duration_bn,class_days,image_path,status';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Active and upcoming courses only (enforced again by RLS). */
export async function listCourses(limit?: number): Promise<Course[]> {
  const { rows } = await select<Course>('courses', {
    params: {
      select: COLS,
      status: 'in.(active,upcoming)',
      order: 'status.asc,display_order.asc,course_name_en.asc',
      limit: limit ? String(limit) : undefined,
    },
  });
  return rows.map(normalize);
}

export async function getCourse(slugOrId: string): Promise<Course | null> {
  const key = UUID.test(slugOrId) ? 'id' : 'slug';
  const row = await selectOne<Course>('courses', { select: COLS, [key]: `eq.${slugOrId}`, status: 'in.(active,upcoming)' });
  return row && normalize(row);
}

// numeric columns arrive as strings from some PostgREST versions
function normalize(c: Course): Course {
  return { ...c, joining_fee: Number(c.joining_fee), class_days: c.class_days ?? [] };
}
