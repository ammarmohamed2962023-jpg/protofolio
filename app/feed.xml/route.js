import { NextResponse } from 'next/server';
import { Feed } from 'feed';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ammarmohamed.dev';

  const feed = new Feed({
    title: 'Ammar Mohamed - Engineering Articles',
    description: 'Articles on Software Engineering, Full Stack Architecture, AI, and Cloud Infrastructure.',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Ammar Mohamed`,
    author: {
      name: 'Ammar Mohamed',
      email: 'contact@ammarmohamed.dev',
      link: baseUrl,
    },
  });

  const samplePosts = [
    {
      title: 'Building Scalable Full-Stack Applications with Next.js 16 & React 19',
      description: 'An enterprise guide to architectural decisions, modern rendering strategies, and performance optimizations.',
      url: `${baseUrl}/blog/scalable-fullstack-nextjs-16`,
      date: new Date('2026-02-15'),
    },
    {
      title: 'AI Integration Patterns for Modern Web Applications',
      description: 'How to build responsive, robust, and cost-effective AI assistants and workflow agents.',
      url: `${baseUrl}/blog/ai-integration-patterns`,
      date: new Date('2026-01-20'),
    },
  ];

  samplePosts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: post.url,
      link: post.url,
      description: post.description,
      date: post.date,
    });
  });

  return new NextResponse(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
    },
  });
}
