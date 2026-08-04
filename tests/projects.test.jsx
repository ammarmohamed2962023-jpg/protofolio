import { describe, it, expect } from 'vitest';
import { projectService } from '../server/services/project.service';

describe('Phase 2A Projects Engine Tests', () => {
  it('should generate clean URL slug from title', () => {
    const slug = projectService.slugify('Enterprise Microservices Platform v2!');
    expect(slug).toBe('enterprise-microservices-platform-v2');
  });

  it('should handle reserved slugs properly by suffixing', async () => {
    const slug = await projectService.generateUniqueSlug('admin');
    expect(slug).toBe('admin-proj');
  });

  it('should compute high SEO score for fully detailed project', () => {
    const score = projectService.calculateSeoScore({
      title: 'Enterprise Microservices Platform',
      summary: 'High-performance scalable microservices backend built with C# and PostgreSQL.',
      coverImage: 'https://example.com/cover.jpg',
      ogImage: 'https://example.com/og.jpg',
      demoUrl: 'https://example.com',
    });
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('should deduct SEO score for missing cover and description', () => {
    const score = projectService.calculateSeoScore({
      title: 'Short',
      summary: 'Short',
    });
    expect(score).toBeLessThan(80);
  });
});
