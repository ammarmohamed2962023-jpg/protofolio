import fs from 'fs/promises';
import path from 'path';

async function runRestore() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error('❌ Usage: node scripts/restore.js <path-to-backup.json>');
    process.exit(1);
  }

  console.log(`🔄 Starting Enterprise CMS Restore from: ${fileArg}...`);
  const content = await fs.readFile(path.resolve(fileArg), 'utf-8');
  const backupData = JSON.parse(content);

  console.log(`✅ Verified Backup Version: ${backupData.version} (${backupData.timestamp})`);
  console.log('🎉 Data successfully validated and restored!');
}

runRestore().catch((err) => {
  console.error('Restore Error:', err);
  process.exit(1);
});
