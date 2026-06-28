"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startTime = useRef(Date.now());
  const lastPath = useRef(pathname);

  useEffect(() => {
    // Reset timer on new path
    if (pathname !== lastPath.current) {
      startTime.current = Date.now();
      lastPath.current = pathname;
    }

    const recordVisit = () => {
      // Don't track admin pages
      if (pathname?.startsWith('/admin')) return;

      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      
      // Use navigator.sendBeacon for reliable delivery on page unload
      // Fallback to fetch if sendBeacon is unavailable
      const data = JSON.stringify({
        path: pathname,
        referrer: document.referrer,
        duration,
      });

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/analytics/visit`;

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          endpoint,
          new Blob([data], { type: 'application/json' })
        );
      } else {
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data,
          keepalive: true, // Equivalent to sendBeacon
        }).catch(console.error);
      }
    };

    // Track on unmount or beforeunload
    window.addEventListener('beforeunload', recordVisit);

    return () => {
      window.removeEventListener('beforeunload', recordVisit);
      // We could also record it when component unmounts (route change)
      recordVisit();
    };
  }, [pathname, searchParams]);

  return null; // Invisible component
}
