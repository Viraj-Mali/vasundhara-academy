import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { normalizePublicDisclosureInfo } from '@/lib/publicDisclosureConfig';

const dataDir = join(process.cwd(), '.local-data');
const dataFile = join(dataDir, 'public-disclosure-info.json');

export async function readLocalPublicDisclosureInfo() {
  try {
    const data = await readFile(dataFile, 'utf8');
    return normalizePublicDisclosureInfo(JSON.parse(data));
  } catch {
    return normalizePublicDisclosureInfo();
  }
}

export async function writeLocalPublicDisclosureInfo(info) {
  const data = normalizePublicDisclosureInfo(info);
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(data, null, 2));
  return data;
}
