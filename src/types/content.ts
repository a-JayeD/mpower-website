/** Public rows as returned by the services (subset of the admin schema). */
export type CourseStatus = 'active' | 'upcoming';
export type UpdateType = 'announcement' | 'news' | 'notice' | 'event';
export type AlbumCategory = 'training' | 'industrial_visit' | 'workshop' | 'event' | 'students' | 'facilities' | 'other';

export interface Course {
  id: string;
  slug: string;
  course_name_en: string;
  course_name_bn: string;
  description_en: string;
  description_bn: string;
  joining_fee: number;
  total_classes: number;
  duration_en: string;
  duration_bn: string;
  class_days: number[];
  image_path: string | null;
  status: CourseStatus;
}

export interface Instructor {
  id: string;
  name_en: string;
  name_bn: string;
  photo_path: string | null;
  position_en: string;
  position_bn: string;
  bio_en: string;
  bio_bn: string;
  specialization: string;
}

export interface NewsUpdate {
  id: string;
  slug: string;
  type: UpdateType;
  title_en: string;
  title_bn: string;
  content_en: string;
  content_bn: string;
  cover_image_path: string | null;
  publish_date: string;
  is_featured: boolean;
}

export interface Album {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  category: AlbumCategory;
  created_at: string;
  photo_count: number;
  cover_thumb: string | null;
}

export interface GalleryImage {
  id: string;
  image_path: string;
  thumb_path: string;
  caption_en: string;
  caption_bn: string;
  width: number | null;
  height: number | null;
}

export interface SuccessStory {
  id: string;
  student_name: string;
  photo_path: string | null;
  story_en: string;
  story_bn: string;
  is_featured: boolean;
  course: { slug: string; course_name_en: string; course_name_bn: string } | null;
}

export interface Faq {
  id: string;
  question_en: string;
  question_bn: string;
  answer_en: string;
  answer_bn: string;
}

export interface SiteSettings {
  center_name_en: string;
  center_name_bn: string;
  logo_path: string | null;
  phone: string;
  whatsapp: string;
  email: string;
  facebook_url: string;
  messenger_url: string;
  youtube_url: string;
  google_maps_url: string;
  map_embed_url: string;
  address_en: string;
  address_bn: string;
  opening_hours_en: string;
  opening_hours_bn: string;
  hero_title_en: string;
  hero_title_bn: string;
  hero_subtitle_en: string;
  hero_subtitle_bn: string;
  footer_text_en: string;
  footer_text_bn: string;
  about_en: string;
  about_bn: string;
}

export interface Paged<T> {
  rows: T[];
  total: number;
}
