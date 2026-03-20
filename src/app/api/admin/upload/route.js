import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v2 as cloudinary } from 'cloudinary';

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

    // 1. CLOUDINARY UPLOAD (Production)
    if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_API_KEY) {
      return new Promise((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'vasundhara-academy',
            resource_type: 'auto',
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
                format: result.format
              }));
            }
          }
        );
        uploadStream.end(buffer);
      });
    }

    // 2. LOCAL UPLOAD (Development Fallback)
    const name = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}
    
    const path = join(uploadDir, name);
    await writeFile(path, buffer);

    return NextResponse.json({
      url: `/uploads/${name}`,
      name: name,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Server error during upload' }, { status: 500 });
  }
}
