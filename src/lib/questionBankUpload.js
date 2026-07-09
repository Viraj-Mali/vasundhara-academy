import { v2 as cloudinary } from 'cloudinary';
import { createUploadFileName, writeUploadFile } from '@/lib/uploadStorage';

if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const QUESTION_BANK_CLASSES = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

export function isValidQuestionBankClass(className) {
  return QUESTION_BANK_CLASSES.includes(className);
}

export function validateQuestionBankPdf(file, required = true) {
  if (!file || typeof file === 'string' || file.size === 0) {
    return required ? 'PDF file is required' : null;
  }

  const name = file.name?.toLowerCase() || '';
  const hasPdfName = name.endsWith('.pdf');
  const hasPdfType = !file.type || file.type === 'application/pdf';
  const isPdf = hasPdfName && hasPdfType;
  if (!isPdf) {
    return 'Only PDF files are allowed for Question Bank uploads';
  }

  return null;
}

export async function storeQuestionBankPdf(file) {
  const validationError = validateQuestionBankPdf(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  if (buffer.subarray(0, 5).toString() !== '%PDF-') {
    throw new Error('Only valid PDF files are allowed for Question Bank uploads');
  }

  if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_API_KEY) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'vasundhara-academy',
          resource_type: 'raw',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            reject(new Error('Cloudinary upload failed'));
            return;
          }

          resolve({
            url: result.secure_url,
            id: result.public_id,
            size: result.bytes,
            format: result.format,
            resourceType: result.resource_type,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  const name = createUploadFileName(file.name);
  const upload = await writeUploadFile(name, buffer);
  return {
    url: upload.url,
    name: upload.filename,
    size: file.size,
  };
}
