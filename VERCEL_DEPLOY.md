# Vercel Deployment Guide - Vasundhara Academy

Follow these steps to deploy the application to Vercel.

## 1. Database Setup (Vercel Postgres)
1. Go to your project on the Vercel Dashboard.
2. Click on the **Storage** tab and select **Postgres**.
3. Create a new database and connect it to your project.
4. Vercel will automatically add `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` to your environment variables.
5. In your local terminal, run `npx prisma db push` to create the tables in the cloud database.

## 2. Image Storage (Cloudinary)
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/).
2. From the dashboard, get your **Cloud Name**, **API Key**, and **API Secret**.
3. Add the following environment variable to Vercel:
   - `CLOUDINARY_URL`: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`
   - Alternatively, add:
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

## 3. Authentication (NextAuth)
Add these environment variables to Vercel:
- `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`).
- `NEXTAUTH_URL`: Your production URL (e.g., `https://vasundhara-academy.vercel.app`).

## 4. Build Configuration
Ensure your `package.json` includes:
```json
"scripts": {
  "postinstall": "prisma generate",
  "build": "next build"
}
```

## 5. Deployment
Push your code to a GitHub repository and import it into Vercel. 
The app will build automatically and your database will be ready!

---
*Vasundhara Academy Admin Team*
