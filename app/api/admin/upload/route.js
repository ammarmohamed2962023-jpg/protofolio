import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { storage } from '@/server/storage';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function POST(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user) {
    return apiError('UNAUTHORIZED', 'Authentication required for file upload', 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return apiError('VALIDATION_ERROR', 'No file provided', 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;

    const uploadResult = await storage.upload(buffer, fileName, file.type);

    return apiSuccess(
      {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        provider: uploadResult.provider,
        size: file.size,
        mimeType: file.type,
      },
      'File uploaded successfully',
      {},
      201
    );
  } catch (error) {
    console.error('Upload API Error:', error);
    return apiError('UPLOAD_FAILED', 'File upload failed', 500);
  }
}
