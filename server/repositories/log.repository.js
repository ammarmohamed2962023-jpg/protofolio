import prisma from '@/lib/prisma';

export class LogRepository {
  async createActivityLog(data) {
    try {
      return await prisma.activityLog.create({ data });
    } catch (err) {
      console.warn('[LogRepository] ActivityLog create warning:', err?.message);
      return null;
    }
  }

  async createAuditLog(data) {
    try {
      return await prisma.auditLog.create({ data });
    } catch (err) {
      console.warn('[LogRepository] AuditLog create warning:', err?.message);
      return null;
    }
  }

  async getRecentLogs(limit = 50) {
    try {
      return await prisma.auditLog.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      });
    } catch (err) {
      return [];
    }
  }
}

export const logRepository = new LogRepository();
