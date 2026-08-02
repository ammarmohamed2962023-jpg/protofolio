'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import GlobalModal from '@/components/GlobalModal';

export default function BlogPage() {
  const [modalContent, setModalContent] = useState(null);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-4">
        <a href="/" className="btn-secondary px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 mb-2">
          ← Back to Main Portfolio
        </a>
      </div>
      <BlogSection onOpenArticle={(article) => setModalContent(article)} />
      <Footer />

      <GlobalModal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
        {modalContent && (
          <div className="space-y-5">
            <div className="border-b border-[var(--border-glass)] pb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="tag">{modalContent.category}</span>
                {modalContent.featured && <span className="tag tag-orange">Featured</span>}
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] leading-snug">{modalContent.title}</h2>
              <div className="flex gap-4 text-xs font-mono text-[var(--text-muted)] mt-2">
                <span>{modalContent.date}</span>
                <span>{modalContent.read_time}</span>
              </div>
            </div>
            <div className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
              {modalContent.content}
            </div>
            {modalContent.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border-glass)]">
                {modalContent.tags.map(t => <span key={t} className="tag text-[10px]">#{t}</span>)}
              </div>
            )}
          </div>
        )}
      </GlobalModal>
    </main>
  );
}
