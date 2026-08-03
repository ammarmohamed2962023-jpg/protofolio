/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import GlobalModal from '@/components/GlobalModal';
import { CheckCircle2, ExternalLink, Download } from 'lucide-react';

export default function ProjectsPage() {
  const [modalContent, setModalContent] = useState(null);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Link href="/" className="btn-secondary px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 mb-2">
          ← Back to Main Portfolio
        </Link>
      </div>
      <Projects onOpenCaseStudy={(project) => setModalContent(project)} />
      <Footer />

      <GlobalModal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
        {modalContent && (
          <div className="space-y-6">
            <div className="h-64 rounded-2xl overflow-hidden border border-[var(--border-glass)]">
              <img src={modalContent.image} alt={modalContent.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {modalContent.featured && (
                  <span className="tag tag-orange text-[10px]">⭐ Featured</span>
                )}
                {modalContent.status && (
                  <span className="tag tag-green text-[10px]">{modalContent.status}</span>
                )}
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{modalContent.title}</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {modalContent.technologies.map((t, i) => (
                  <span key={i} className="tag">{t}</span>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              {modalContent.problem && (
                <div>
                  <h4 className="text-sm font-bold text-[var(--accent-cyan)] mb-1">Problem Statement</h4>
                  <p>{modalContent.problem}</p>
                </div>
              )}
              {modalContent.solution && (
                <div>
                  <h4 className="text-sm font-bold text-[var(--accent-cyan)] mb-1">Solution Approach</h4>
                  <p>{modalContent.solution}</p>
                </div>
              )}
              {modalContent.architecture && (
                <div>
                  <h4 className="text-sm font-bold text-[var(--accent-cyan)] mb-1">Architecture</h4>
                  <p>{modalContent.architecture}</p>
                </div>
              )}
              {modalContent.features?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[var(--accent-cyan)] mb-2">Key Features</h4>
                  <ul className="space-y-1.5">
                    {modalContent.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)] mt-0.5 shrink-0" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--border-glass)] justify-end">
              {modalContent.github && modalContent.github !== '#' && (
                <a href={modalContent.github} target="_blank" rel="noopener noreferrer"
                  className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  GitHub Repo
                </a>
              )}
              {modalContent.demo && modalContent.demo !== '#' && (
                <a href={modalContent.demo} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                </a>
              )}
            </div>
          </div>
        )}
      </GlobalModal>
    </main>
  );
}
