import React, { useEffect } from 'react';
import { Button, Group, Text, Box } from '@mantine/core';
import { cookieService } from '../services/cookieService';

/**
 * Example component demonstrating how to use the cookie service
 * This shows how to track events and store preferences based on user consent
 */
export const CookieUsageExample: React.FC = () => {
  useEffect(() => {
    // Example: Track page view (only if analytics consent given)
    cookieService.trackEvent('page_view', {
      page: 'cv-builder',
      timestamp: new Date().toISOString(),
    });

    // Example: Load user preferences (only if preferences consent given)
    const savedTheme = cookieService.getPreference('theme', 'light');
    const savedLanguage = cookieService.getPreference('language', 'en');
    
    console.log('Loaded preferences:', { savedTheme, savedLanguage });
  }, []);

  const handleButtonClick = (buttonName: string) => {
    // Example: Track button clicks (only if analytics consent given)
    cookieService.trackEvent('button_click', {
      button_name: buttonName,
      timestamp: new Date().toISOString(),
    });

    // Example: Track marketing event (only if marketing consent given)
    cookieService.trackMarketingEvent('cta_click', {
      cta_name: buttonName,
      page: 'cv-builder',
    });
  };

  const saveUserPreference = () => {
    // Example: Save user preference (only if preferences consent given)
    cookieService.setPreference('last_action', 'preference_saved');
    cookieService.setPreference('preference_timestamp', new Date().toISOString());
    
    console.log('Preference saved (if consent given)');
  };

  const setAnalyticsCookie = () => {
    // Example: Set analytics cookie (only if analytics consent given)
    cookieService.setCookie('user_session', 'example_session_id', 'analytics', 1);
    console.log('Analytics cookie set (if consent given)');
  };

  const setMarketingCookie = () => {
    // Example: Set marketing cookie (only if marketing consent given)
    cookieService.setCookie('marketing_id', 'example_marketing_id', 'marketing', 30);
    console.log('Marketing cookie set (if consent given)');
  };

  const setPreferenceCookie = () => {
    // Example: Set preference cookie (only if preferences consent given)
    cookieService.setCookie('user_theme', 'dark', 'preferences', 365);
    console.log('Preference cookie set (if consent given)');
  };

  return (
    <Box p="md" style={{ border: '1px dashed #ccc', borderRadius: '8px' }}>
      <Text size="sm" fw={500} mb="sm">
        Cookie Service Usage Examples
      </Text>
      <Text size="xs" c="dimmed" mb="md">
        These buttons demonstrate how the cookie service respects user consent preferences.
        Check the console to see which actions are allowed based on your cookie settings.
      </Text>
      
      <Group gap="xs" wrap="wrap">
        <Button
          size="xs"
          variant="outline"
          onClick={() => handleButtonClick('example_button')}
        >
          Track Button Click
        </Button>
        
        <Button
          size="xs"
          variant="outline"
          onClick={saveUserPreference}
        >
          Save Preference
        </Button>
        
        <Button
          size="xs"
          variant="outline"
          onClick={setAnalyticsCookie}
        >
          Set Analytics Cookie
        </Button>
        
        <Button
          size="xs"
          variant="outline"
          onClick={setMarketingCookie}
        >
          Set Marketing Cookie
        </Button>
        
        <Button
          size="xs"
          variant="outline"
          onClick={setPreferenceCookie}
        >
          Set Preference Cookie
        </Button>
      </Group>
    </Box>
  );
};
