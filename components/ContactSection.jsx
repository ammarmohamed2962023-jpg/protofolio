'use client';
import { useState } from 'react';
import { Mail, GraduationCap, Briefcase, Send, Copy, CheckCheck, MapPin, Phone, ExternalLink } from 'lucide-react';
import { isValidEmail, copyToClipboard, SITE } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const EMAIL = SITE.email;

export default function ContactSection({ onShowToast }) {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors]   = useState({});
  const [sending, setSending] = useState(false);
  const [copied, setCopied]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name    = t.valNameRequired;
    if (!isValidEmail(form.email)) e.email   = t.valEmailInvalid;
    if (!form.subject.trim())      e.subject = t.valSubjectRequired;
    if (form.message.trim().length < 20) e.message = t.valMessageLength;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      setSending(false);
      if (res.ok && data.success) {
        if (onShowToast) onShowToast(t.valSuccessToast ? t.valSuccessToast.replace('{name}', form.name) : data.message, 'success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        if (data.details) {
          const formatted = {};
          Object.keys(data.details).forEach(key => { formatted[key] = data.details[key][0]; });
          setErrors(formatted);
        }
        if (onShowToast) onShowToast(data.error || 'Failed to send message', 'error');
      }
    } catch (err) {
      setSending(false);
      if (onShowToast) onShowToast('Network error. Please try again.', 'error');
    }
  };

  const handleCopyEmail = async () => {
    const ok = await copyToClipboard(EMAIL);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2200); }
  };

  const field = (id, label, type = 'text', placeholder = '') => (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={form[id]}
        onChange={e => setForm(prev => ({ ...prev, [id]: e.target.value }))}
        className={`form-input ${errors[id] ? 'border-red-500/60 focus:border-red-500' : ''}`}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        aria-invalid={!!errors[id]}
        required
      />
      {errors[id] && (
        <p id={`${id}-error`} className="text-[10px] text-red-400 mt-1" role="alert">{errors[id]}</p>
      )}
    </div>
  );

  return (
    <section id="contact" className="py-24 relative z-10" aria-labelledby="contact-heading">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div 
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          <span className="section-badge">{t.contactBadge}</span>
          <h2 id="contact-heading" className="section-title">
            {t.contactTitle} <span className="gradient-text">{t.contactTitleAccent}</span>
          </h2>
          <p className="section-subtitle mt-3">
            {t.contactSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Info panel ── */}
          <motion.aside 
            className="lg:col-span-5 space-y-4 text-left rtl:text-right"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Availability */}
            <div className="glass-card">
              <h3 className="text-sm font-bold text-[var(--accent-cyan)] mb-4">{t.contactStatusHeading}</h3>
              <div className="flex items-center gap-3">
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-[var(--accent-green)]">{t.contactStatusOpen}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t.contactStatusOpenDesc}</p>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="glass-card space-y-5">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{t.contactDetailsHeading}</h3>

              {/* WhatsApp / Phone */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[var(--text-muted)] mb-0.5">{t.contactLabelPhone}</p>
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[var(--text-primary)] hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    {SITE.phone}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      WhatsApp 💬
                    </span>
                  </a>
                </div>
              </div>

              {/* LinkedIn Profile */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-600/25 shrink-0 text-blue-400">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[var(--text-muted)] mb-0.5">{t.contactLabelLinkedIn}</p>
                  <a
                    href={SITE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 truncate max-w-full"
                  >
                    {t.brandName}
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Email with copy */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/25 shrink-0">
                  <Mail className="w-4 h-4 text-[var(--accent-cyan)]" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[var(--text-muted)] mb-0.5">{t.contactLabelEmail}</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{EMAIL}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg glass-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-all shrink-0"
                  aria-label={t.certsBtnCopy}
                  title={t.certsBtnCopy}
                >
                  {copied
                    ? <CheckCheck className="w-4 h-4 text-[var(--accent-green)]" />
                    : <Copy className="w-4 h-4" />
                  }
                </motion.button>
              </div>

              {/* University */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 shrink-0">
                  <GraduationCap className="w-4 h-4 text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] mb-0.5">{t.contactLabelUniversity}</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.contactLabelUniversityVal}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t.contactLabelFacultyVal}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 shrink-0">
                  <MapPin className="w-4 h-4 text-purple-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] mb-0.5">{t.contactLabelLocation}</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.contactLabelLocationVal}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t.contactLabelLocationDesc}</p>
                </div>
              </div>

              {/* Internship */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 shrink-0">
                  <Briefcase className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] mb-0.5">{t.contactLabelSeeking}</p>
                  <p className="text-sm font-semibold text-emerald-400">{t.contactLabelSeekingVal}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t.contactLabelSeekingDesc}</p>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="glass-sm p-4 rounded-xl flex items-center gap-3">
              <div className="text-2xl" aria-hidden="true">⚡</div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">{t.contactLabelResponse}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{t.contactLabelResponseDesc}</p>
              </div>
            </div>
          </motion.aside>

          {/* ── Contact form ── */}
          <motion.div 
            className="lg:col-span-7 glass-card text-left rtl:text-right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-6">{t.contactFormHeading}</h3>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field('name', t.contactFormName, 'text', t.contactFormNamePlaceholder)}
                {field('email', t.contactFormEmail, 'email', t.contactFormEmailPlaceholder)}
              </div>
              {field('subject', t.contactFormSubject, 'text', t.contactFormSubjectPlaceholder)}

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                  {t.contactFormMessage}
                  <span className="ml-2 rtl:ml-0 rtl:mr-2 text-[var(--text-muted)] font-normal">({form.message.length}/500)</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder={t.contactFormMessagePlaceholder}
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value.slice(0, 500) }))}
                  className={`form-input resize-none ${errors.message ? 'border-red-500/60' : ''}`}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  aria-invalid={!!errors.message}
                  required
                />
                {errors.message && (
                  <p id="message-error" className="text-[10px] text-red-400 mt-1" role="alert">{errors.message}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={sending}
                className="btn-primary w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-busy={sending}
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    {t.contactFormBtnSending}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                    {t.contactFormBtnSend}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

