import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Google Tag Manager custom event tracking — GTM's GA4 tag fires off this event
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
