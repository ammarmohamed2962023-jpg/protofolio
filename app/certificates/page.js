'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Certificates from '@/components/Certificates';
import Footer from '@/components/Footer';
import GlobalModal from '@/components/GlobalModal';
import { ExternalLink, Copy, CheckCheck } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

export default function CertificatesPage() {
  const [modalContent, setModalContent] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (id) => {
    await copyToClipboard(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-4">
        <a href="/" className="btn-secondary px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 mb-2">
          ← Back to Main Portfolio
        </a>
      </div>
      <Certificates onOpenCertModal={(cert) => setModalContent(cert)} />
      <Footer />

      <GlobalModal isOpen={!!modalContent} onClose={() => setModalContent(null)}>
        {modalContent && (
          <div className="space-y-6 text-center">
            <div className="h-52 rounded-2xl overflow-hidden border border-[var(--border-glass)]">
              <img src={modalContent.image} alt={modalContent.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider mb-2">{modalContent.provider}</p>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{modalContent.title}</h2>
            </div>
            {modalContent.issue_date && (
              <p className="text-xs text-[var(--text-muted)]">Issued: <strong className="text-[var(--text-primary)]">{modalContent.issue_date}</strong></p>
            )}
            <div className="flex flex-wrap justify-center gap-1.5">
              {modalContent.skills_gained?.map((s, i) => (
                <span key={i} className="tag">{s}</span>
              ))}
            </div>
            {modalContent.credential_id && (
              <div className="flex items-center justify-center gap-2 font-mono text-xs text-[var(--text-secondary)]">
                <span>Credential ID: <strong className="text-[var(--text-primary)]">{modalContent.credential_id}</strong></span>
                <button onClick={() => handleCopy(modalContent.credential_id)} className="p-1.5 rounded-lg glass-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all" aria-label="Copy credential ID">
                  {copied ? <CheckCheck className="w-3.5 h-3.5 text-[var(--accent-green)]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
            <div className="pt-4 border-t border-[var(--border-glass)] flex justify-center">
              {modalContent.verify_url && (
                <a href={modalContent.verify_url} target="_blank" rel="noopener noreferrer"
                  className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" /> Verify Credential
                </a>
              )}
            </div>
          </div>
        )}
      </GlobalModal>
    </main>
  );
}
