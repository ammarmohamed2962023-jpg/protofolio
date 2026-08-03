export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ammarmohamed.dev';

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ammar Mohamed',
    alternateName: 'عمار محمد',
    jobTitle: 'Senior Software Engineer & Full Stack Developer',
    url: baseUrl,
    sameAs: [
      'https://github.com/ammarmohamed',
      'https://linkedin.com/in/ammarmohamed',
    ],
    knowsAbout: [
      'Software Engineering',
      'Full Stack Development',
      'React',
      'Next.js',
      'Node.js',
      'TypeScript',
      'Tailwind CSS',
      'Web Architecture',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ammar Mohamed - Enterprise Portfolio',
    url: baseUrl,
    description: 'Portfolio of Ammar Mohamed - Senior Software Engineer specializing in Full Stack Web Applications, Cloud Architecture, and Performance.',
    author: {
      '@type': 'Person',
      name: 'Ammar Mohamed',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
