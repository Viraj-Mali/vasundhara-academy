import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { basename, extname, join } from 'path';

const fallbackUploadName = '1781851904740-Affilation-Letter.pdf';

export function getUploadDirectories() {
  return [
    process.env.UPLOAD_DIR,
    join(process.cwd(), 'public', 'uploads'),
    join(process.cwd(), 'uploads'),
    join(tmpdir(), 'vasundhara-academy', 'uploads'),
  ].filter(Boolean).filter((dir, index, dirs) => dirs.indexOf(dir) === index);
}

export function createUploadFileName(originalName = 'upload') {
  const ext = extname(originalName).toLowerCase();
  const base = basename(originalName, ext)
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'upload';
  return `${Date.now()}-${base}${ext}`;
}

export function uploadUrlFor(filename) {
  return `/uploads/${encodeURIComponent(filename)}`;
}

export function filenameFromUploadUrl(url) {
  if (!url || !url.startsWith('/uploads/')) return null;
  return basename(decodeURIComponent(url.replace('/uploads/', '')));
}

export async function writeUploadFile(filename, buffer) {
  const safeName = basename(filename);
  const errors = [];

  for (const dir of getUploadDirectories()) {
    try {
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, safeName), buffer);
      return {
        filename: safeName,
        url: uploadUrlFor(safeName),
        path: join(dir, safeName),
      };
    } catch (error) {
      errors.push(`${dir}: ${error.message}`);
    }
  }

  throw new Error(`Unable to write upload file. ${errors.join(' | ')}`);
}

export async function readUploadFile(filename = fallbackUploadName) {
  const safeName = basename(filename);
  const errors = [];

  for (const dir of getUploadDirectories()) {
    try {
      return {
        buffer: await readFile(join(dir, safeName)),
        filename: safeName,
      };
    } catch (error) {
      errors.push(`${dir}: ${error.message}`);
    }
  }

  throw new Error(`Upload file not found. ${errors.join(' | ')}`);
}

export async function deleteUploadFileByUrl(url) {
  const filename = filenameFromUploadUrl(url);
  if (!filename) return false;

  let deleted = false;
  await Promise.all(getUploadDirectories().map(async (dir) => {
    try {
      await unlink(join(dir, filename));
      deleted = true;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`Unable to delete upload file ${filename} from ${dir}:`, error.message);
      }
    }
  }));

  return deleted;
}

export function contentTypeForUpload(filename) {
  const ext = extname(filename).toLowerCase();
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'application/octet-stream';
}
