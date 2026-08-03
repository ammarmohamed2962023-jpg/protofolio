import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Ammar Mohamed — CS Student | Networking | Software Development | AI",
  description:
    "Personal brand portfolio of Ammar Mohamed, a Computer Science student at Innovation University specializing in Networking, Software Development, and Artificial Intelligence.",
  keywords: [
    "Ammar Mohamed",
    "Computer Science",
    "Networking",
    "Software Development",
    "Artificial Intelligence",
    "Cisco",
    "C#",
    "Java",
    "Portfolio",
    "Innovation University",
  ],
  authors: [{ name: "Ammar Mohamed" }],
  creator: "Ammar Mohamed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ammar-portfolio.vercel.app",
    title: "Ammar Mohamed — CS Student | Networking | Software Development | AI",
    description:
      "Personal brand portfolio of Ammar Mohamed, a CS student specializing in Networking, Software Development, and AI.",
    siteName: "Ammar Mohamed Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ammar Mohamed — Portfolio",
    description:
      "CS Student specializing in Networking, Software Development, and AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/context/LanguageContext";
import SkipToContent from "@/components/SkipToContent";

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ammar Mohamed",
    url: "https://ammar-portfolio.vercel.app",
    jobTitle: "Computer Science Student & Software Developer",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Innovation University",
    },
    sameAs: [
      "https://github.com/ammar-mohamed",
      "https://www.linkedin.com/in/ammar-mohammed-mohamed-48b415386/",
      "https://wa.me/201091698261"
    ],
  };

  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#060912" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="Ammar Mohamed RSS Feed" href="/feed.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ammar_theme') || 'dark';
                  var lang  = localStorage.getItem('ammar_lang')  || 'en';
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.setAttribute('lang', lang);
                  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
                } catch(e) {}
              })();
              
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.error('Service Worker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <SkipToContent />
        <LanguageProvider>
          <div id="main-content">
            {children}
          </div>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
