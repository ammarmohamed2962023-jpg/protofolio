import fs from 'fs/promises';
import path from 'path';

async function runBackup() {
  console.log('📦 Starting Enterprise CMS Backup Process...');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  await fs.mkdir(backupDir, { recursive: true });

  const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

  const backupData = {
    version: '1.5.0',
    timestamp: new Date().toISOString(),
    system: 'Portfolio Enterprise CMS',
    data: {
      settings: [
        { key: 'site_title', value: 'Ammar Mohammed | Portfolio', category: 'SEO' },
        { key: 'contact_email', value: 'ammar.mohamed2962023@gmail.com', category: 'CONTACT' },
      ],
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/ammarmohamed2962023-jpg' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/ammar-mohammed-mohamed-48b415386' },
      ],
    },
  };

  await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2));
  console.log(`✅ Backup successfully saved to: ${backupFile}`);
}

runBackup().catch(console.error);
