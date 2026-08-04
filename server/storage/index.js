import fs from 'fs/promises';
import path from 'path';

/**
 * Enterprise Storage Provider Abstraction Interface
 */
export class LocalStorageProvider {
  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
  }

  async upload(fileBuffer, fileName) {
    await fs.mkdir(this.uploadDir, { recursive: true });
    const filePath = path.join(this.uploadDir, fileName);
    await fs.writeFile(filePath, fileBuffer);
    return {
      provider: 'local',
      publicId: fileName,
      url: `/uploads/${fileName}`,
    };
  }

  async delete(fileName) {
    try {
      const filePath = path.join(this.uploadDir, fileName);
      await fs.unlink(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  getPublicUrl(fileName) {
    return `/uploads/${fileName}`;
  }
}

export class CloudinaryStorageProvider {
  async upload(fileBuffer, fileName) {
    console.log('[Storage Abstraction] Cloudinary upload provider invoked for:', fileName);
    return {
      provider: 'cloudinary',
      publicId: fileName,
      url: `/uploads/${fileName}`,
    };
  }

  async delete(publicId) {
    return true;
  }

  getPublicUrl(publicId) {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
  }
}

export class SupabaseStorageProvider {
  async upload(fileBuffer, fileName) {
    console.log('[Storage Abstraction] Supabase storage provider invoked for:', fileName);
    return {
      provider: 'supabase',
      publicId: fileName,
      url: `/uploads/${fileName}`,
    };
  }

  async delete(publicId) {
    return true;
  }

  getPublicUrl(publicId) {
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${publicId}`;
  }
}

export function getStorageProvider() {
  const provider = process.env.STORAGE_PROVIDER || 'local';
  switch (provider.toLowerCase()) {
    case 'cloudinary':
      return new CloudinaryStorageProvider();
    case 'supabase':
      return new SupabaseStorageProvider();
    case 'local':
    default:
      return new LocalStorageProvider();
  }
}

export const storage = getStorageProvider();
