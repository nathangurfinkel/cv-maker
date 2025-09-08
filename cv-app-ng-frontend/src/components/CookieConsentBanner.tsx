import React, { useState } from 'react';
import {
  Paper,
  Text,
  Button,
  Group,
  Stack,
  Checkbox,
  Collapse,
  Divider,
  Anchor,
  Box,
  Modal,
  List,
  ThemeIcon,
} from '@mantine/core';
import { IconCookie, IconSettings, IconCheck, IconX } from '@tabler/icons-react';
import { useCookieConsent, type CookiePreferences } from '../hooks/useCookieConsent';
import { PrivacyPolicy } from './PrivacyPolicy';

export const CookieConsentBanner: React.FC = () => {
  const {
    hasConsented,
    preferences,
    showBanner,
    acceptAll,
    acceptSelected,
    rejectAll,
  } = useCookieConsent();

  const [showDetails, setShowDetails] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>(preferences);

  const handleAcceptSelected = () => {
    acceptSelected(tempPreferences);
    setShowSettingsModal(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Can't change necessary cookies
    setTempPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner || hasConsented) {
    return null;
  }

  const cookieCategories = [
    {
      key: 'necessary' as keyof CookiePreferences,
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. These cannot be disabled.',
      required: true,
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting anonymous information.',
      required: false,
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Marketing Cookies',
      description: 'Used to track visitors across websites to display relevant and engaging advertisements.',
      required: false,
    },
    {
      key: 'preferences' as keyof CookiePreferences,
      title: 'Preference Cookies',
      description: 'Remember your choices and preferences to provide a personalized experience.',
      required: false,
    },
  ];

  return (
    <>
      {/* Main Banner */}
      <Paper
        shadow="lg"
        p="md"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderRadius: 0,
        }}
      >
        <Group align="flex-start" gap="md">
          <ThemeIcon size="lg" variant="light" color="blue">
            <IconCookie size={20} />
          </ThemeIcon>
          
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500} mb="xs">
              We use cookies to enhance your experience
            </Text>
            <Text size="xs" c="dimmed" mb="sm">
              We use cookies to analyze site usage, personalize content, and improve our services. 
              By clicking "Accept All", you consent to our use of cookies.{' '}
              <Anchor
                size="xs"
                onClick={() => setShowDetails(!showDetails)}
                style={{ cursor: 'pointer' }}
              >
                Learn more
              </Anchor>
              {' '}or{' '}
              <Anchor
                size="xs"
                onClick={() => setShowPrivacyModal(true)}
                style={{ cursor: 'pointer' }}
              >
                view our Privacy Policy
              </Anchor>
            </Text>

            <Collapse in={showDetails}>
              <Box mb="sm">
                <Text size="xs" mb="xs">
                  <strong>Cookie Categories:</strong>
                </Text>
                <List size="xs" spacing="xs">
                  <List.Item>• <strong>Necessary:</strong> Required for basic website functionality</List.Item>
                  <List.Item>• <strong>Analytics:</strong> Help us understand website usage</List.Item>
                  <List.Item>• <strong>Marketing:</strong> Used for targeted advertising</List.Item>
                  <List.Item>• <strong>Preferences:</strong> Remember your settings and choices</List.Item>
                </List>
              </Box>
            </Collapse>

            <Group gap="xs" wrap="wrap">
              <Button
                size="xs"
                variant="filled"
                onClick={acceptAll}
                leftSection={<IconCheck size={14} />}
              >
                Accept All
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  setTempPreferences(preferences);
                  setShowSettingsModal(true);
                }}
                leftSection={<IconSettings size={14} />}
              >
                Customize
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={rejectAll}
                leftSection={<IconX size={14} />}
              >
                Reject All
              </Button>
            </Group>
          </Box>
        </Group>
      </Paper>

      {/* Settings Modal */}
      <Modal
        opened={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title={
          <Group gap="xs">
            <IconSettings size={20} />
            <Text fw={500}>Cookie Preferences</Text>
          </Group>
        }
        size="lg"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Choose which cookies you want to accept. You can change these settings at any time.
          </Text>

          <Divider />

          {cookieCategories.map((category) => (
            <Box key={category.key}>
              <Group justify="space-between" mb="xs">
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {category.title}
                    {category.required && (
                      <Text component="span" size="xs" c="dimmed" ml="xs">
                        (Required)
                      </Text>
                    )}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {category.description}
                  </Text>
                </Box>
                <Checkbox
                  checked={tempPreferences[category.key]}
                  onChange={(event) => handlePreferenceChange(category.key, event.currentTarget.checked)}
                  disabled={category.required}
                  size="sm"
                />
              </Group>
            </Box>
          ))}

          <Divider />

          <Group justify="space-between">
            <Button
              variant="subtle"
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </Button>
            <Group gap="xs">
              <Button
                variant="outline"
                onClick={() => {
                  const onlyNecessary: CookiePreferences = {
                    necessary: true,
                    analytics: false,
                    marketing: false,
                    preferences: false,
                  };
                  setTempPreferences(onlyNecessary);
                }}
              >
                Reject All
              </Button>
              <Button
                variant="filled"
                onClick={handleAcceptSelected}
              >
                Save Preferences
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>

      {/* Privacy Policy Modal */}
      <PrivacyPolicy
        opened={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </>
  );
};

export const CookieSettingsButton: React.FC = () => {
  const { showSettings } = useCookieConsent();

  return (
    <Button
      variant="subtle"
      size="xs"
      leftSection={<IconSettings size={14} />}
      onClick={showSettings}
    >
      Cookie Settings
    </Button>
  );
};
