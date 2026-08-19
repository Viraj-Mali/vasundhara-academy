import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const dataDir = join(process.cwd(), '.local-data');
const dataFile = join(dataDir, 'gallery.json');
const hiddenStaticDataFile = join(dataDir, 'gallery-static-hidden.json');

async function readGallery() {
  try {
    const data = await readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeGallery(items) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(items, null, 2));
}

export async function listLocalGalleryImages({ category, includeAll, excludedCategories = [] } = {}) {
  const items = await readGallery();
  if (category) return items.filter((item) => item.category === category);
  if (includeAll) return items;
  return items.filter((item) => !excludedCategories.includes(item.category));
}

export async function createLocalGalleryImage(data) {
  const items = await readGallery();
  const item = {
    id: randomUUID(),
    title: data.title || '',
    url: data.url,
    category: data.category || 'general',
    order: 0,
    createdAt: new Date().toISOString(),
  };
  await writeGallery([item, ...items]);
  return item;
}

export async function deleteLocalGalleryImages({ id, ids }) {
  const items = await readGallery();
  const deleteSet = new Set(ids || (id ? [id] : []));
  await writeGallery(items.filter((item) => !deleteSet.has(item.id)));
}

export async function listLocalHiddenStaticGalleryIds() {
  try {
    const data = JSON.parse(await readFile(hiddenStaticDataFile, 'utf8'));
    return Array.isArray(data) ? data.map(String) : [];
  } catch {
    return [];
  }
}

export async function hideLocalStaticGalleryImages(ids) {
  const hiddenIds = new Set(await listLocalHiddenStaticGalleryIds());
  ids.map(String).forEach((id) => hiddenIds.add(id));
  await mkdir(dataDir, { recursive: true });
  await writeFile(hiddenStaticDataFile, JSON.stringify([...hiddenIds], null, 2));
}
