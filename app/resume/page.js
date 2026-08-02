'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-28 pb-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6">
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="btn-secondary px-4 py-2 rounded-full text-xs font-semibold inline-block mb-6"
        >
          ← Back to Main Portfolio
        </motion.a>

        <motion.div
          className="glass-card p-8 sm:p-12 space-y-8 text-left"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            className="flex justify-between items-center border-b border-[var(--accent-cyan)] pb-6"
          >
            <div>
              <h1 className="text-3xl font-black text-white">Ammar Mohamed</h1>
              <p className="text-sm font-semibold text-[var(--accent-cyan)] mt-1">
                Computer Science Student | Networking Specialist | Software Developer
              </p>
            </div>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/assets/cv/cv_ammar_mohamed.pdf"
              download
              className="btn-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PDF
            </motion.a>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm"
          >
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[var(--accent-cyan)] text-base mb-2">Education</h3>
                <p className="font-bold text-white">Innovation University</p>
                <p className="text-xs text-[var(--text-secondary)]">Faculty of Computers &amp; Information</p>
                <p className="text-xs text-[var(--text-muted)]">Bachelor's Degree (Expected 2027)</p>
              </div>

              <div>
                <h3 className="font-bold text-[var(--accent-cyan)] text-base mb-2">Cisco Certifications</h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[var(--text-secondary)]">
                  <li>Cisco Networking Academy</li>
                  <li>English for IT</li>
                  <li>Networking Basics</li>
                  <li>Network Addressing</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[var(--accent-cyan)] text-base mb-2">Status</h3>
                <div className="flex items-center gap-2">
                  <span className="status-dot" aria-hidden="true" />
                  <span className="text-xs font-semibold text-[var(--accent-green)]">Open for Internship</span>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="sm:col-span-2 space-y-6">
              <div>
                <h3 className="font-bold text-[var(--accent-cyan)] text-base mb-2">Technical Profile</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Dedicated CS student with expertise in C# WinForms enterprise applications, SQL Server database design,
                  Java OOP development, and Cisco network routing/switching configuration. Passionate about building
                  reliable software and well-structured networks.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[var(--accent-cyan)] text-base mb-2">Featured Projects</h3>
                <div className="space-y-3 text-xs text-[var(--text-secondary)]">
                  <div>
                    <p className="font-bold text-white">ALASAR Pharmacy Management System</p>
                    <p>Desktop C# POS, barcode scanner stream, and SQL billing database.</p>
                  </div>
                  <div>
                    <p className="font-bold text-white">Student Management System</p>
                    <p>Java OOP academic enrollment &amp; GPA calculation system.</p>
                  </div>
                  <div>
                    <p className="font-bold text-white">Cisco Network Enterprise Lab</p>
                    <p>VLAN segmentation, OSPF dynamic routing, and ACL firewall rules.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[var(--accent-cyan)] text-base mb-2">Core Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['C# .NET', 'Java', 'C++', 'SQL Server', 'Cisco IOS', 'TCP/IP', 'JavaScript', 'Next.js', 'Python', 'Git'].map(s => (
                    <span key={s} className="tag text-[10px]">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}

