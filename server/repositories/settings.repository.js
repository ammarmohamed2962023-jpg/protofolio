import prisma from '@/lib/prisma';

export class SettingsRepository {
  async getAll() {
    try {
      return await prisma.setting.findMany({
        orderBy: { category: 'asc' },
      });
    } catch (error) {
      console.warn('[SettingsRepository] getAll fallback used:', error?.message);
      return [
        { key: 'site_title', value: 'Ammar Mohammed | Portfolio', category: 'SEO', isPublic: true },
        { key: 'contact_email', value: 'ammar.mohamed2962023@gmail.com', category: 'CONTACT', isPublic: true },
        { key: 'github_url', value: 'https://github.com/ammarmohamed2962023-jpg', category: 'SOCIAL', isPublic: true },
        { key: 'theme_default', value: 'dark', category: 'UI', isPublic: true },
        { key: 'maintenance_mode', value: false, category: 'SYSTEM', isPublic: false },
      ];
    }
  }

  async getByKey(key) {
    try {
      return await prisma.setting.findUnique({
        where: { key },
      });
    } catch (error) {
      return null;
    }
  }

  async upsert(key, data) {
    return prisma.setting.upsert({
      where: { key },
      update: data,
      create: { key, ...data },
    });
  }
}

export const settingsRepository = new SettingsRepository();
