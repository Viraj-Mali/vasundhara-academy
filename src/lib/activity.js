import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Log an admin action to the activity log
 */
export async function logActivity(action, entityType, entityName, description = null) {
  try {
    const session = await getServerSession(authOptions);
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityName,
        description,
        userId: session?.user?.email || session?.user?.name || 'admin',
      },
    });
  } catch (e) {
    // Don't break the main operation if logging fails
    console.error('Activity log error:', e.message);
  }
}
