import type { MouseEvent as ReactMouseEvent } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    gtag_report_conversion?: (url?: string) => boolean;
  }
}

export function updateGoogleConsent(granted: boolean) {
  window.gtag?.('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  });
}

export function trackPhoneConversion(event: ReactMouseEvent<HTMLAnchorElement>) {
  if (!window.gtag_report_conversion) return;

  event.preventDefault();
  window.gtag_report_conversion(event.currentTarget.href);
}
