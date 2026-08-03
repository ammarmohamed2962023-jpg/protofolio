'use client';

import { useEffect } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Analytics() {
  useEffect(() => {
    // GA4 Telemetry initialization if NEXT_PUBLIC_GA_ID environment variable is provided
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (gaId && typeof window !== 'undefined') {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { page_path: window.location.pathname });
      `;
      document.head.appendChild(script2);
    }
  }, []);

  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
