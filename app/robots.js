export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ammarmohamed.dev';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/admin', '/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
