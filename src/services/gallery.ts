import { select, selectOne } from '@/lib/api';
import type { Album, AlbumCategory, GalleryImage, Paged } from '@/types/content';

type AlbumRow = Omit<Album, 'photo_count' | 'cover_thumb'> & {
  photos: Array<{ count: number }>;
  cover: { thumb_path: string } | null;
};

const ALBUM_COLS =
  'id,slug,title_en,title_bn,description_en,description_bn,category,created_at,' +
  'photos:gallery_images!gallery_images_album_id_fkey(count),cover:gallery_images!gallery_albums_cover_image_fkey(thumb_path)';
const IMAGE_COLS = 'id,image_path,thumb_path,caption_en,caption_bn,width,height';
export const PHOTOS_PAGE = 24;

const toAlbum = ({ photos, cover, ...a }: AlbumRow): Album => ({
  ...a, photo_count: photos?.[0]?.count ?? 0, cover_thumb: cover?.thumb_path ?? null,
});

export async function listAlbums(limit?: number): Promise<Album[]> {
  const { rows } = await select<AlbumRow>('gallery_albums', {
    params: { select: ALBUM_COLS, is_published: 'eq.true', order: 'display_order.asc,created_at.desc', limit: limit ? String(limit) : undefined },
  });
  // Empty albums are hidden from visitors.
  return rows.map(toAlbum).filter((a) => a.photo_count > 0);
}

export async function getAlbum(slug: string): Promise<Album | null> {
  const row = await selectOne<AlbumRow>('gallery_albums', { select: ALBUM_COLS, slug: `eq.${slug}`, is_published: 'eq.true' });
  return row && toAlbum(row);
}

/** One page of an album's photos (thumbnails load first; full size only in the lightbox). */
export async function listAlbumImages(albumId: string, page: number): Promise<Paged<GalleryImage>> {
  const from = (page - 1) * PHOTOS_PAGE;
  const { rows, total } = await select<GalleryImage>('gallery_images', {
    params: { select: IMAGE_COLS, album_id: `eq.${albumId}`, order: 'display_order.asc,created_at.asc' },
    range: [from, from + PHOTOS_PAGE - 1],
    count: true,
  });
  return { rows, total: total ?? rows.length };
}

/** A handful of recent photos from training / lab / facility albums for the home and about pages. */
export async function listPracticePhotos(limit = 6, categories: AlbumCategory[] = ['training', 'facilities', 'workshop', 'industrial_visit']) {
  const { rows } = await select<GalleryImage & { album: { slug: string; title_en: string; title_bn: string } }>('gallery_images', {
    params: {
      select: `${IMAGE_COLS},album:gallery_albums!gallery_images_album_id_fkey!inner(slug,title_en,title_bn,category)`,
      'album.category': `in.(${categories.join(',')})`,
      order: 'created_at.desc',
      limit: String(limit),
    },
  });
  return rows;
}
