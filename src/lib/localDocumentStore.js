import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const dataDir = join(process.cwd(), '.local-data');
const dataFile = join(dataDir, 'documents.json');

async function readDocuments() {
  try {
    const data = await readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeDocuments(items) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(items, null, 2));
}

export async function listLocalDocuments() {
  return readDocuments();
}

export async function createLocalDocument(data) {
  const items = await readDocuments();
  const item = {
    id: randomUUID(),
    title: data.title,
    category: data.category || 'affiliation',
    fileUrl: data.fileUrl,
    order: data.order || 0,
    createdAt: new Date().toISOString(),
  };
  await writeDocuments([item, ...items]);
  return item;
}

export async function updateLocalDocument(id, data) {
  const items = await readDocuments();
  let updated = null;
  const nextItems = items.map((item) => {
    if (item.id !== id) return item;
    updated = {
      ...item,
      ...data,
      id: item.id,
      createdAt: item.createdAt,
    };
    return updated;
  });
  await writeDocuments(nextItems);
  return updated;
}

export async function deleteLocalDocument(id) {
  const items = await readDocuments();
  await writeDocuments(items.filter((item) => item.id !== id));
}
