import sharp from 'sharp';
import { createUploadFileName, writeUploadFile } from '@/lib/uploadStorage';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getExtension(filename = '') {
  const match = filename.toLowerCase().match(/\.[^.]+$/);
  return match ? match[0] : '';
}

export function validateHeroSliderImage(file) {
  const extension = getExtension(file?.name || '');
  const type = file?.type || '';

  if (!file) {
    return 'Hero background image is required';
  }
  if (!ALLOWED_EXTENSIONS.includes(extension) || !ALLOWED_TYPES.includes(type)) {
    return 'Only JPG, JPEG, PNG, and WEBP image files are allowed';
  }
  return null;
}

export async function optimizeAndStoreHeroSliderImage(file) {
  const validationError = validateHeroSliderImage(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const input = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(input).metadata();
  let width = metadata.width;

  if (width && width > 2400) {
    width = 2400;
  }

  const qualities = [88, 82, 76, 70, 64, 58, 52, 46, 40];
  let bestBuffer = null;

  for (const quality of qualities) {
    const pipeline = sharp(input).rotate();
    if (width) {
      pipeline.resize({ width, withoutEnlargement: true });
    }
    const optimized = await pipeline.webp({ quality, effort: 5 }).toBuffer();

    bestBuffer = optimized;
    if (optimized.length <= MAX_IMAGE_BYTES) break;
  }

  while (bestBuffer.length > MAX_IMAGE_BYTES && width && width > 640) {
    width = Math.floor(width * 0.85);
    bestBuffer = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 38, effort: 6 })
      .toBuffer();
  }

  if (bestBuffer.length > MAX_IMAGE_BYTES) {
    bestBuffer = await sharp(input)
      .rotate()
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 32, effort: 6 })
      .toBuffer();
  }

  if (bestBuffer.length > MAX_IMAGE_BYTES) {
    throw new Error('Unable to compress image below 2 MB while preserving a usable background image');
  }

  const name = createUploadFileName(file.name).replace(/\.[^.]+$/, '.webp');
  const upload = await writeUploadFile(name, bestBuffer);

  return {
    url: upload.url,
    filename: upload.filename,
    size: bestBuffer.length,
  };
}
