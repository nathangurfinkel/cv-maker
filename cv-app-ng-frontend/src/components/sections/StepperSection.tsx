import React from 'react';
import { Box, Text } from '@mantine/core';
import { CVStepperWizard } from '../CVStepperWizard';

interface StepperSectionProps {
  onCVDataUpdate: (data: any) => void;
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
