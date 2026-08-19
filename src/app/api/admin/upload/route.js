import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createUploadFileName, writeUploadFile } from '@/lib/uploadStorage';

const pdfMimeTypes = new Set(['application/pdf', 'application/x-pdf']);
const storyImageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const storyImageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

function isPdfFileName(name = '') {
  return name.toLowerCase().endsWith('.pdf');
}

function hasPdfSignature(buffer) {
  return buffer.subarray(0, 4).toString('utf8') === '%PDF';
}

function isStoryImageFile(file, buffer) {
  const name = (file.name || '').toLowerCase();
  const hasAllowedExtension = storyImageExtensions.some((extension) => name.endsWith(extension));
  const hasAllowedMimeType = storyImageMimeTypes.has((file.type || '').toLowerCase());
  const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  return hasAllowedExtension && hasAllowedMimeType && (isJpeg || isPng || isWebp);
}

function contentTypeForResponse(file, isPdf, isValidatedPdfUpload = false) {
  if (isValidatedPdfUpload) return 'application/pdf';
  return file.type || (isPdf ? 'application/pdf' : 'application/octet-stream');
}

// Configure Cloudinary if env vars are present
if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadContext = formData.get('uploadContext');
    const isPublicDisclosurePdf = uploadContext === 'public-disclosure-pdf';
    const isComprehensiveInformationPdf = uploadContext === 'comprehensive-information-pdf';
    const isManagedContentImage = uploadContext === 'story-achievement-image'
      || uploadContext === 'teacher-training-image'
      || uploadContext === 'academic-program-image';
    const isValidatedPdfUpload = isPublicDisclosurePdf || isComprehensiveInformationPdf;
    const hasPdfExtension = isPdfFileName(file.name || '');
    const isPdf = hasPdfExtension || pdfMimeTypes.has((file.type || '').toLowerCase());

    if (isValidatedPdfUpload) {
      const isValidPdf = hasPdfExtension && hasPdfSignature(buffer);
      if (!isValidPdf) {
        const error = isPublicDisclosurePdf
          ? 'Only PDF files are allowed for Public Disclosures'
          : 'Only PDF files are allowed';
        return NextResponse.json({ error }, { status: 400 });
      }
    }

    if (isManagedContentImage && !isStoryImageFile(file, buffer)) {
      return NextResponse.json({ error: 'Only JPG, JPEG, PNG, and WEBP images are allowed' }, { status: 400 });
    }

    // 1. CLOUDINARY UPLOAD (Production)
    if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_API_KEY) {
      return new Promise((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'vasundhara-academy',
            resource_type: isPdf ? 'raw' : 'image',
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              resolve(NextResponse.json({ error: 'Cloudinary upload failed' }, { status: 500 }));
            } else {
              resolve(NextResponse.json({
                url: result.secure_url,
                id: result.public_id,
                size: result.bytes,
                format: result.format,
                resourceType: result.resource_type,
                originalName: file.name,
                contentType: contentTypeForResponse(file, isPdf, isValidatedPdfUpload),
              }));
            }
          }
        );
        uploadStream.end(buffer);
      });
    }

    // 2. LOCAL UPLOAD (Development Fallback)
    const name = createUploadFileName(file.name);
    const upload = await writeUploadFile(name, buffer);

    return NextResponse.json({
      url: upload.url,
      name: upload.filename,
      size: file.size,
      originalName: file.name,
      contentType: contentTypeForResponse(file, isPdf, isValidatedPdfUpload),
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Server error during upload' }, { status: 500 });
  }
}
