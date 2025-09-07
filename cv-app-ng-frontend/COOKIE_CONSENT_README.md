# Cookie Consent Implementation

This document explains the cookie consent system implemented in the CV Maker application.

## Overview

The cookie consent system provides GDPR/CCPA compliant cookie management with the following features:

- **Cookie Consent Banner**: Appears on first visit to collect user consent
- **Granular Cookie Control**: Users can accept/reject specific cookie categories
- **Persistent Preferences**: User choices are saved and respected across sessions
- **Cookie Management Service**: Centralized service for managing cookies based on consent
- **Privacy Policy Integration**: Links to detailed privacy information

## Components

### 1. CookieConsentBanner (`src/components/CookieConsentBanner.tsx`)

The main consent banner component that:
- Shows on first visit or when consent hasn't been given
- Provides "Accept All", "Customize", and "Reject All" options
- Includes detailed cookie category explanations
- Links to privacy policy
- Can be reopened via the settings button in the header

### 2. useCookieConsent Hook (`src/hooks/useCookieConsent.ts`)

React hook that manages cookie consent state:
- Tracks user consent status
- Manages cookie preferences for different categories
- Provides methods to accept/reject cookies
- Persists preferences in localStorage

### 3. CookieService (`src/services/cookieService.ts`)

Centralized service for cookie management:
- Respects user consent preferences
- Provides methods for setting/getting cookies by category
- Includes analytics and marketing tracking methods
- Handles preference storage

### 4. PrivacyPolicy (`src/components/PrivacyPolicy.tsx`)

Modal component displaying detailed privacy information and cookie usage.

## Cookie Categories

### Necessary Cookies
- **Always enabled** - Required for basic website functionality
- Includes session management, security features, form processing
- Cannot be disabled by users

### Analytics Cookies
- **Optional** - Help understand website usage
- Includes page view tracking, user journey analysis, performance monitoring
- Used for improving user experience

### Marketing Cookies
- **Optional** - Used for targeted advertising
- Includes ad personalization, campaign tracking, conversion measurement
- Used for marketing and advertising purposes

### Preference Cookies
- **Optional** - Remember user choices and settings
- Includes theme preferences, language settings, custom configurations
- Used for personalizing user experience

## Usage Examples

### Basic Cookie Consent

The banner automatically appears on first visit. Users can:
1. Click "Accept All" to enable all cookies
2. Click "Customize" to choose specific categories
3. Click "Reject All" to only allow necessary cookies

### Using the Cookie Service

```typescript
import { cookieService } from '../services/cookieService';

// Track analytics event (only if consent given)
cookieService.trackEvent('button_click', {
  button_name: 'submit_cv',
  timestamp: new Date().toISOString(),
});

// Set analytics cookie (only if consent given)
cookieService.setCookie('user_session', 'session_id', 'analytics', 1);

// Save user preference (only if consent given)
cookieService.setPreference('theme', 'dark');

// Check if analytics is allowed
if (cookieService.canUseAnalytics()) {
  // Initialize analytics tracking
}
```

### Using the Hook

```typescript
import { useCookieConsent } from '../hooks/useCookieConsent';

const MyComponent = () => {
  const { hasConsented, preferences, showSettings } = useCookieConsent();
  
  if (!hasConsented) {
    return <div>Please accept cookies to continue</div>;
  }
  
  return (
    <div>
      <button onClick={showSettings}>
        Change Cookie Settings
      </button>
    </div>
  );
};
```

## Integration

The cookie consent system is integrated into the app as follows:

1. **App.tsx**: CookieConsentBanner is rendered at the root level
2. **AppHeader.tsx**: CookieSettingsButton allows users to reopen settings
3. **CookieService**: Can be used throughout the app for cookie management

## Customization

### Styling
The components use Mantine UI styling and can be customized by:
- Modifying the component styles
- Updating the Mantine theme
- Adding custom CSS classes

### Cookie Categories
To add new cookie categories:
1. Update the `CookiePreferences` interface in `useCookieConsent.ts`
2. Add the new category to the cookie categories array in `CookieConsentBanner.tsx`
3. Update the `CookieService` methods as needed

### Analytics Integration
To integrate with analytics services (Google Analytics, Mixpanel, etc.):
1. Update the `trackEvent` method in `CookieService`
2. Add your analytics tracking code
3. Ensure it only runs when `canUseAnalytics()` returns true

## Compliance

This implementation follows GDPR and CCPA best practices:
- ✅ Clear information about cookie usage
- ✅ Granular consent options
- ✅ Easy withdrawal of consent
- ✅ No pre-checked boxes
- ✅ No cookie walls
- ✅ Persistent consent storage
- ✅ Privacy policy integration

## Testing

To test the cookie consent system:

1. **Clear localStorage** to simulate first visit
2. **Test different consent scenarios**:
   - Accept all cookies
   - Reject all cookies
   - Customize specific categories
3. **Verify cookie behavior** based on consent choices
4. **Test settings reopening** via the header button

## Browser Support

The implementation uses modern web APIs:
- localStorage for preference storage
- document.cookie for cookie management
- Modern JavaScript features (ES6+)

Compatible with all modern browsers (Chrome, Firefox, Safari, Edge).
