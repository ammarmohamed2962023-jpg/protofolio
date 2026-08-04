import prisma from '@/lib/prisma';

export class NotificationService {
  async sendNotification(userId, title, message, type = 'INFO') {
    try {
      return await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
        },
      });
    } catch (err) {
      console.warn('[NotificationService] Notification fallback:', err?.message);
      return null;
    }
  }

  async getUserNotifications(userId) {
    try {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    } catch (err) {
      return [];
    }
  }
}

export const notificationService = new NotificationService();
