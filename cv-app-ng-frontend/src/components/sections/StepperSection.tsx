import React from 'react';
import { Box, Text } from '@mantine/core';
import { CVStepperWizard } from '../CVStepperWizard';
import type { CVData } from '../../types';

interface StepperSectionProps {
  onCVDataUpdate: (data: CVData) => void;
  onDownloadPDF: () => void;
}

export const StepperSection: React.FC<StepperSectionProps> = ({
  onCVDataUpdate,
  onDownloadPDF,
}) => {
  return (
    <Box p="md" mb="md">
      <Text size="md" fw={600} mb="md">
        AI-Powered CV Builder
      </Text>
      <CVStepperWizard
        onCVDataUpdate={onCVDataUpdate}
        onDownloadPDF={onDownloadPDF}
      />
    </Box>
  );
};
