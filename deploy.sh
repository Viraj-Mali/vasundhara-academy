#!/bin/bash

# Ensure script stops on first error
set -e

echo "🚀 Starting Deployment Process for Vasundhara Academy..."

# 1. Pull latest changes from GitHub
echo "📥 Pulling latest changes from main branch..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Generate Prisma Client
echo "🗄️ Generating Prisma Client..."
npx prisma generate

# 4. Build the Next.js application
echo "🏗️ Building the Next.js application..."
npm run build

# 5. Restart the application using PM2
echo "🔄 Restarting PM2 process..."
# Assuming the PM2 app is named 'vasundhara-academy' as per ecosystem.config.js
pm2 restart vasundhara-academy || pm2 start ecosystem.config.js

echo "✅ Deployment Successful!"
