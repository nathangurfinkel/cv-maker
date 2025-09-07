import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface CookieConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
}

const COOKIE_CONSENT_KEY = 'cv-maker-cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cv-maker-cookie-preferences';

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true as these are required
  analytics: false,
  marketing: false,
  preferences: false,
};

export const useCookieConsent = () => {
  const [consentState, setConsentState] = useState<CookieConsentState>({
    hasConsented: false,
    preferences: defaultPreferences,
    showBanner: true,
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (savedConsent === 'true' && savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setConsentState({
          hasConsented: true,
          preferences,
          showBanner: false,
        });
      } catch (error) {
        console.error('Error parsing saved cookie preferences:', error);
        // Reset to default state if parsing fails
        setConsentState({
          hasConsented: false,
          preferences: defaultPreferences,
          showBanner: true,
        });
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));

    setConsentState({
      hasConsented: true,
      preferences: allAccepted,
      showBanner: false,
    });
  };

  const acceptSelected = (preferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));

    setConsentState({
      hasConsented: true,
      preferences,
      showBanner: false,
    });
  };

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(onlyNecessary));

    setConsentState({
      hasConsented: true,
      preferences: onlyNecessary,
      showBanner: false,
    });
  };

  const showSettings = () => {
    setConsentState(prev => ({
      ...prev,
      showBanner: true,
    }));
  };

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updatedPreferences = {
      ...consentState.preferences,
      ...newPreferences,
      necessary: true, // Always keep necessary cookies
    };

    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(updatedPreferences));

    setConsentState(prev => ({
      ...prev,
      preferences: updatedPreferences,
    }));
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);

    setConsentState({
      hasConsented: false,
      preferences: defaultPreferences,
      showBanner: true,
    });
  };

  return {
    ...consentState,
    acceptAll,
    acceptSelected,
    rejectAll,
    showSettings,
    updatePreferences,
    resetConsent,
  };
};
