import { readFile } from 'fs/promises';
import { join } from 'path';

export const EXCLUDED_FROM_PUBLIC_GALLERY = [
  'sports-day', 'annual-day',
  'faculty', 'staff', 'teacher',
  'classroom', 'science-lab', 'computer-lab', 'library',
  'hostel', 'counseling', 'healthcare',
  'sports-ground', 'sports-grounds', 'indoor-games', 'outings', 'assembly', 'transport',
  'music', 'dance', 'drama', 'yoga',
  'mandatory-disclosure',
];

export const STATIC_GALLERY_HIDDEN_SLUG = 'gallery-static-hidden';

export function parseHiddenStaticGalleryIds(content) {
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    const ids = Array.isArray(parsed) ? parsed : parsed?.ids;
    return new Set((Array.isArray(ids) ? ids : []).map(String));
  } catch {
    return new Set();
  }
}

export function excludeHiddenStaticGalleryImages(images, hiddenIds) {
  const hidden = hiddenIds instanceof Set ? hiddenIds : new Set(hiddenIds || []);
  return images.filter((image) => !hidden.has(String(image.id)));
}

export async function getStaticGalleryImages() {
  try {
    const dataPath = join(process.cwd(), 'public', 'images', 'gallery', 'data.json');
    const data = JSON.parse(await readFile(dataPath, 'utf8'));
    return data.map((item) => ({
      id: `static-${item.id}`,
      title: item.title || '',
      url: item.url,
      category: item.category,
      createdAt: null,
      static: true,
    }));
  } catch {
    return [];
  }
}

export function mergeGalleryImages(dynamicImages = [], staticImages = []) {
  const seen = new Set();
  return [...dynamicImages, ...staticImages].filter((item) => {
    if (!item.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export function filterGalleryImages(
  images,
  { category, includeAll, excludedCategories = EXCLUDED_FROM_PUBLIC_GALLERY } = {}
) {
  if (category) return images.filter((item) => item.category === category);
  if (includeAll) return images;
  return images.filter((item) => !excludedCategories.includes(item.category));
}
