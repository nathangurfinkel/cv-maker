import React from 'react';
import { Box } from '@mantine/core';

interface AppContentProps {
  children: React.ReactNode;
}

export const AppContent: React.FC<AppContentProps> = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>
  );
};
