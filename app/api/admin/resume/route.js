import { z } from 'zod';
import { decryptToken, COOKIE_NAME } from '@/lib/auth/session';
import { resumeRepository } from '@/server/repositories/resume.repository';
import { storage } from '@/server/storage';
import { logRepository } from '@/server/repositories/log.repository';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const resumes = await resumeRepository.findMany();
    return apiSuccess(resumes, 'Resume versions retrieved', { count: resumes.length }, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to fetch resume versions', 500);
  }
}

export async function POST(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user) {
    return apiError('UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const version = formData.get('version') || `v${Date.now()}`;
    const title = formData.get('title') || 'Ammar Mohammed Resume';

    if (!file || typeof file === 'string') {
      return apiError('VALIDATION_ERROR', 'No PDF file provided', 400);
    }

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return apiError('VALIDATION_ERROR', 'Only PDF files are allowed', 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `resume-${version}-${Date.now()}.pdf`;

    const uploadResult = await storage.upload(buffer, fileName, 'application/pdf');

    const resume = await resumeRepository.create({
      version: String(version),
      title: String(title),
      fileUrl: uploadResult.url,
      isActive: false,
    });

    await logRepository.createAuditLog({
      action: 'RESUME_UPLOAD',
      entity: 'ResumeVersion',
      entityId: resume.id,
      newValues: resume,
      userId: user.userId,
    });

    return apiSuccess(resume, 'New Resume version uploaded', {}, 201);
  } catch (error) {
    console.error('Resume upload error:', error);
    return apiError('INTERNAL_ERROR', 'Failed to upload resume version', 500);
  }
}

export async function PATCH(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await decryptToken(token) : null;

  if (!user) {
    return apiError('UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const { id } = await request.json();
    const activeResume = await resumeRepository.setActive(id);

    await logRepository.createAuditLog({
      action: 'RESUME_ACTIVATE',
      entity: 'ResumeVersion',
      entityId: id,
      newValues: activeResume,
      userId: user.userId,
    });

    return apiSuccess(activeResume, 'Active resume version updated', {}, 200);
  } catch (error) {
    return apiError('INTERNAL_ERROR', 'Failed to activate resume version', 500);
  }
}
