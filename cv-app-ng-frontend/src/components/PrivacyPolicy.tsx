import React from 'react';
import {
  Modal,
  Stack,
  Text,
  Title,
  List,
  Anchor,
  Divider,
  Box,
} from '@mantine/core';

interface PrivacyPolicyProps {
  opened: boolean;
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ opened, onClose }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Privacy Policy & Cookie Information</Title>}
      size="lg"
      centered
      scrollAreaComponent="div"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Box>
          <Title order={4} mb="sm">How We Use Cookies</Title>
          <Text size="sm" mb="sm">
            Our CV Builder uses cookies to enhance your experience and provide personalized services. 
            We respect your privacy and give you control over your data.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Title order={4} mb="sm">Cookie Categories</Title>
          
          <Box mb="md">
            <Text fw={500} size="sm" mb="xs">🍪 Necessary Cookies</Text>
            <Text size="sm" c="dimmed" mb="xs">
              These cookies are essential for the website to function properly. They enable basic functions 
              like page navigation, access to secure areas, and form submissions.
            </Text>
            <List size="sm" c="dimmed">
              <List.Item>Session management</List.Item>
              <List.Item>Security features</List.Item>
              <List.Item>Form data processing</List.Item>
            </List>
          </Box>

          <Box mb="md">
            <Text fw={500} size="sm" mb="xs">📊 Analytics Cookies</Text>
            <Text size="sm" c="dimmed" mb="xs">
              These cookies help us understand how visitors interact with our website by collecting 
              anonymous information about page views, time spent, and user behavior.
            </Text>
            <List size="sm" c="dimmed">
              <List.Item>Page view tracking</List.Item>
              <List.Item>User journey analysis</List.Item>
              <List.Item>Performance monitoring</List.Item>
            </List>
          </Box>

          <Box mb="md">
            <Text fw={500} size="sm" mb="xs">🎯 Marketing Cookies</Text>
            <Text size="sm" c="dimmed" mb="xs">
              These cookies are used to track visitors across websites to display relevant and 
              engaging advertisements.
            </Text>
            <List size="sm" c="dimmed">
              <List.Item>Ad personalization</List.Item>
              <List.Item>Campaign tracking</List.Item>
              <List.Item>Conversion measurement</List.Item>
            </List>
          </Box>

          <Box mb="md">
            <Text fw={500} size="sm" mb="xs">⚙️ Preference Cookies</Text>
            <Text size="sm" c="dimmed" mb="xs">
              These cookies remember your choices and preferences to provide a personalized experience.
            </Text>
            <List size="sm" c="dimmed">
              <List.Item>Theme preferences</List.Item>
              <List.Item>Language settings</List.Item>
              <List.Item>Custom configurations</List.Item>
            </List>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Title order={4} mb="sm">Your Rights</Title>
          <Text size="sm" mb="sm">
            You have the right to:
          </Text>
          <List size="sm" mb="sm">
            <List.Item>Accept or reject non-essential cookies</List.Item>
            <List.Item>Change your cookie preferences at any time</List.Item>
            <List.Item>Request information about cookies we use</List.Item>
            <List.Item>Request deletion of your data</List.Item>
          </List>
        </Box>

        <Divider />

        <Box>
          <Title order={4} mb="sm">Data Protection</Title>
          <Text size="sm" mb="sm">
            We are committed to protecting your privacy and personal data. We follow industry 
            best practices and comply with applicable data protection laws including GDPR and CCPA.
          </Text>
          <Text size="sm" c="dimmed">
            For more information about how we handle your personal data, please review our full 
            Privacy Policy or contact us directly.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Title order={4} mb="sm">Contact Us</Title>
          <Text size="sm">
            If you have any questions about our use of cookies or this privacy policy, 
            please contact us at:{' '}
            <Anchor href="mailto:privacy@cv-maker.com" size="sm">
              privacy@cv-maker.com
            </Anchor>
          </Text>
        </Box>
      </Stack>
    </Modal>
  );
};
