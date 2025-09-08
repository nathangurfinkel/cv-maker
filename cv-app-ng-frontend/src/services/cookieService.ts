import { type CookiePreferences } from '../hooks/useCookieConsent';

class CookieService {
  private static instance: CookieService;
  private preferences: CookiePreferences | null = null;

  private constructor() {
    this.loadPreferences();
  }

  public static getInstance(): CookieService {
    if (!CookieService.instance) {
      CookieService.instance = new CookieService();
    }
    return CookieService.instance;
  }

  private loadPreferences(): void {
    try {
      const savedPreferences = localStorage.getItem('cv-maker-cookie-preferences');
      if (savedPreferences) {
        this.preferences = JSON.parse(savedPreferences);
      }
    } catch (error) {
      console.error('Error loading cookie preferences:', error);
      this.preferences = null;
    }
  }

  public updatePreferences(preferences: CookiePreferences): void {
    this.preferences = preferences;
  }

  public canUseAnalytics(): boolean {
    return this.preferences?.analytics === true;
  }

  public canUseMarketing(): boolean {
    return this.preferences?.marketing === true;
  }

  public canUsePreferences(): boolean {
    return this.preferences?.preferences === true;
  }

  public canUseNecessary(): boolean {
    return this.preferences?.necessary === true;
  }

  // Cookie management methods
  public setCookie(name: string, value: string, category: keyof CookiePreferences, days: number = 30): void {
    if (!this.preferences || !this.preferences[category]) {
      console.warn(`Cannot set cookie ${name}: ${category} cookies not allowed`);
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  public getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  public deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  public deleteAllCookies(): void {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
  }

  // Analytics tracking (only if consent given)
  public trackEvent(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.canUseAnalytics()) {
      console.log('Analytics tracking disabled - no consent');
      return;
    }

    // Here you would integrate with your analytics service
    // For example: Google Analytics, Mixpanel, etc.
    console.log('Analytics event:', eventName, properties);
    
    // Example Google Analytics 4 integration:
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', eventName, properties);
    // }
  }

  // Marketing tracking (only if consent given)
  public trackMarketingEvent(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.canUseMarketing()) {
      console.log('Marketing tracking disabled - no consent');
      return;
    }

    // Here you would integrate with your marketing tools
    // For example: Facebook Pixel, Google Ads, etc.
    console.log('Marketing event:', eventName, properties);
  }

  // Preference storage (only if consent given)
  public setPreference(key: string, value: unknown): void {
    if (!this.canUsePreferences()) {
      console.log('Preference storage disabled - no consent');
      return;
    }

    try {
      const preferences = JSON.parse(localStorage.getItem('cv-maker-user-preferences') || '{}');
      preferences[key] = value;
      localStorage.setItem('cv-maker-user-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  }

  public getPreference<T = unknown>(key: string, defaultValue?: T): T | undefined {
    if (!this.canUsePreferences()) {
      return defaultValue;
    }

    try {
      const preferences = JSON.parse(localStorage.getItem('cv-maker-user-preferences') || '{}');
      return preferences[key] !== undefined ? preferences[key] : defaultValue;
    } catch (error) {
      console.error('Error loading preference:', error);
      return defaultValue;
    }
  }

  // Get all current cookies for display in settings
  public getAllCookies(): Array<{ name: string; value: string; category: string }> {
    const cookies: Array<{ name: string; value: string; category: string }> = [];
    const cookieString = document.cookie;
    
    if (cookieString) {
      const cookiePairs = cookieString.split(';');
      cookiePairs.forEach(pair => {
        const [name, value] = pair.trim().split('=');
        if (name && value) {
          // Determine category based on cookie name (you can customize this logic)
          let category = 'necessary';
          if (name.includes('analytics') || name.includes('_ga') || name.includes('_gid')) {
            category = 'analytics';
          } else if (name.includes('marketing') || name.includes('_fbp') || name.includes('_gcl')) {
            category = 'marketing';
          } else if (name.includes('preference') || name.includes('theme') || name.includes('language')) {
            category = 'preferences';
          }
          
          cookies.push({ name, value, category });
        }
      });
    }
    
    return cookies;
  }
}

export const cookieService = CookieService.getInstance();
