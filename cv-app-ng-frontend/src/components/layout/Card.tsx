import React from 'react';
import { Paper, Box } from '@mantine/core';

interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
}) => {
  return (
    <Paper shadow="sm" p="md" style={{ height: '100%' }}>
      {header && (
        <Box mb="md">
          {header}
        </Box>
      )}
      <Box>
        {children}
      </Box>
    </Paper>
  );
};
