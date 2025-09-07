import React from 'react';
import { Group, Button, LoadingOverlay, Box } from '@mantine/core';
import { IconDownload, IconTrash } from '@tabler/icons-react';

interface ActionSectionProps {
  onDownloadPDF: () => void;
  onClearData: () => void;
  isGeneratingPDF: boolean;
  isDownloadDisabled: boolean;
}

export const ActionSection: React.FC<ActionSectionProps> = ({
  onDownloadPDF,
  onClearData,
  isGeneratingPDF,
  isDownloadDisabled,
}) => {
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isGeneratingPDF} />
      <Group>
        <Button
          leftSection={<IconDownload size={16} />}
          onClick={onDownloadPDF}
          disabled={isDownloadDisabled}
          loading={isGeneratingPDF}
        >
          Download PDF
        </Button>
        <Button
          leftSection={<IconTrash size={16} />}
          variant="outline"
          onClick={onClearData}
        >
          Clear Data
        </Button>
      </Group>
    </Box>
  );
};
