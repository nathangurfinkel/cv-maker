import React from 'react';
import { Flex, Title } from '@mantine/core';
import { CookieSettingsButton } from '../CookieConsentBanner';

export const AppHeader: React.FC = () => {
  return (
    <Flex justify="space-between" align="center" mb="md">
      <Title order={1} size="h2">
        CV Builder
      </Title>
      <CookieSettingsButton />
    </Flex>
  );
};
