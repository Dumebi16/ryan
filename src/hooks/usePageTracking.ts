import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Direct GA4 tracking (retained as requested)
      // @ts-ignore - gtag is injected via index.html
      if (typeof window.gtag === 'function') {
        // @ts-ignore
        window.gtag('event', 'page_view', {
          page_path: location.pathname + location.search,
        });
      }

      // 2. Google Tag Manager custom event tracking
      // @ts-ignore - dataLayer is injected via index.html
      window.dataLayer = window.dataLayer || [];
      // @ts-ignore
      window.dataLayer.push({
        event: 'pageview',
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};

export const PageTracker = () => {
  usePageTracking();
  return null;
};
