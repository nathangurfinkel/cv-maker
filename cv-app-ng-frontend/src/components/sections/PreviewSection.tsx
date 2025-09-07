import React from 'react';
import { Text, Group, SegmentedControl } from '@mantine/core';
import { Card } from '../layout/Card';
import { LivePreview } from '../LivePreview';
import type { CVData, TemplateId } from '../../types';

interface PreviewSectionProps {
  cvData: CVData;
  selectedTemplate: TemplateId;
  onTemplateChange: (template: TemplateId) => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  cvData,
  selectedTemplate,
  onTemplateChange,
}) => {
  const header = (
    <Group justify="space-between" align="center">
      <Text size="md" fw={600}>
        Live Preview
      </Text>
      <SegmentedControl
        value={selectedTemplate}
        onChange={(value) => onTemplateChange(value as TemplateId)}
        data={[
          { label: 'Modern', value: 'modern' },
          { label: 'Classic', value: 'classic' },
        ]}
        size="sm"
      />
    </Group>
  );

  return (
    <Card header={header}>
      <LivePreview
        data={cvData}
        selectedTemplate={selectedTemplate}
      />
    </Card>
  );
};
