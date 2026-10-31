import { useEffect } from 'react';
import { updateGoogleConsent } from '@/lib/google-ads';

const CONSENT_COOKIE = 'ayur_mandira_consent';
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

type CookieConsentProps = {
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
};

function getSavedConsent() {
  const consentCookie = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`));
  const choice = consentCookie?.split('=')[1];

  return choice === 'accepted' || choice === 'rejected' ? choice : null;
}

function saveConsent(choice: 'accepted' | 'rejected') {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

export function CookieConsent({ visible, onVisibilityChange }: CookieConsentProps) {
  useEffect(() => {
    const savedConsent = getSavedConsent();
    updateGoogleConsent(savedConsent === 'accepted');
    onVisibilityChange(savedConsent === null);
  }, [onVisibilityChange]);

  const chooseConsent = (choice: 'accepted' | 'rejected') => {
    saveConsent(choice);
    updateGoogleConsent(choice === 'accepted');
    onVisibilityChange(false);
  };

  if (!visible) return null;

  return (
    <section
      className="cookie-consent"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      data-testid="cookie-consent-banner"
    >
      <h2 id="cookie-consent-title">Your privacy choices</h2>
      <p id="cookie-consent-description">
        Optional analytics and advertising cookies help us understand visits and measure calls.
        They stay off unless you accept.
      </p>
      <div className="cookie-consent-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => chooseConsent('rejected')}
          data-testid="reject-optional-cookies"
        >
          Reject optional
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={() => chooseConsent('accepted')}
          data-testid="accept-cookies"
        >
          Accept all
        </button>
      </div>
    </section>
  );
}
