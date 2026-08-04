import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise CMS Database Seeding...');

  // 1. Seed Admin User
  const adminPasswordHash = await bcrypt.hash('admin123456', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ammar.dev' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@ammar.dev',
      name: 'Ammar Mohammed (Admin)',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://github.com/ammarmohamed2962023-jpg.png',
      isEmailVerified: true,
    },
  });
  console.log('✅ Admin User seeded:', adminUser.email);

  // 2. Seed Permissions
  const permissionsData = [
    { name: 'manage_all', description: 'Full system management', action: 'MANAGE', resource: 'all' },
    { name: 'manage_settings', description: 'Manage system settings', action: 'MANAGE', resource: 'settings' },
    { name: 'read_logs', description: 'View audit & activity logs', action: 'READ', resource: 'logs' },
    { name: 'manage_projects', description: 'Manage portfolio projects', action: 'MANAGE', resource: 'projects' },
  ];

  for (const perm of permissionsData) {
    const permission = await prisma.permission.upsert({
      where: { name: perm.name },
      update: perm,
      create: perm,
    });
    await prisma.rolePermission.upsert({
      where: {
        role_permissionId: {
          role: 'ADMIN',
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        role: 'ADMIN',
        permissionId: permission.id,
      },
    });
  }
  console.log('✅ Admin Roles & Permissions seeded');

  // 3. Seed Default Settings Across Categories
  const defaultSettings = [
    { key: 'site_title', value: 'Ammar Mohammed | Portfolio', category: 'SEO', type: 'string', isPublic: true, description: 'Website SEO Title' },
    { key: 'meta_description', value: 'Senior Software Engineer Portfolio specializing in Backend, Networking, C#, Next.js', category: 'SEO', type: 'string', isPublic: true, description: 'Meta Description' },
    { key: 'contact_email', value: 'ammar.mohamed2962023@gmail.com', category: 'CONTACT', type: 'string', isPublic: true, description: 'Contact Email Address' },
    { key: 'contact_phone', value: '+201091698261', category: 'CONTACT', type: 'string', isPublic: true, description: 'Contact Phone Number' },
    { key: 'github_url', value: 'https://github.com/ammarmohamed2962023-jpg', category: 'SOCIAL', type: 'string', isPublic: true, description: 'GitHub Profile URL' },
    { key: 'linkedin_url', value: 'https://linkedin.com/in/ammar-mohammed-mohamed-48b415386', category: 'SOCIAL', type: 'string', isPublic: true, description: 'LinkedIn Profile URL' },
    { key: 'theme_default', value: 'dark', category: 'UI', type: 'string', isPublic: true, description: 'Default Theme Mode' },
    { key: 'enable_analytics', value: true, category: 'ANALYTICS', type: 'boolean', isPublic: false, description: 'Enable Analytics Logging' },
    { key: 'maintenance_mode', value: false, category: 'SYSTEM', type: 'boolean', isPublic: false, description: 'System Maintenance Mode' },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }
  console.log('✅ Category Settings seeded');

  // 4. Seed Social Links
  const socialLinks = [
    { platform: 'GitHub', url: 'https://github.com/ammarmohamed2962023-jpg', icon: 'github', order: 1 },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/ammar-mohammed-mohamed-48b415386', icon: 'linkedin', order: 2 },
    { platform: 'Email', url: 'mailto:ammar.mohamed2962023@gmail.com', icon: 'mail', order: 3 },
  ];

  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: `link_${link.platform.toLowerCase()}` },
      update: link,
      create: { id: `link_${link.platform.toLowerCase()}`, ...link },
    });
  }
  console.log('✅ Social Links seeded');

  // 5. Seed Initial Resume Version
  await prisma.resumeVersion.upsert({
    where: { version: 'v2.0' },
    update: { isActive: true },
    create: {
      version: 'v2.0',
      title: 'Ammar Mohammed - Senior Software Engineer Resume',
      fileUrl: '/resume.pdf',
      isActive: true,
      downloadsCount: 42,
    },
  });
  console.log('✅ Initial Resume Version seeded');

  console.log('🎉 Database seeding finished cleanly!');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
