import React from 'react';
import { Container, Box } from '@mantine/core';
import { AppHeader } from './AppHeader';
import { AppContent } from './AppContent';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box style={{ minHeight: '100vh' }}>
      <Container size="xl" py="md">
        <AppHeader />
        <AppContent>{children}</AppContent>
      </Container>
    </Box>
  );
};
