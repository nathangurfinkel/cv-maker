import React, { useState } from 'react';
import { Button, Tooltip, Loader } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { ApiService } from '../services/api';

interface RephraseButtonProps {
  sectionContent: string;
  sectionType: string;
  jobDescription: string;
  onRephrase: (rephrasedContent: string) => void;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default';
}

export const RephraseButton: React.FC<RephraseButtonProps> = ({
  sectionContent,
  sectionType,
  jobDescription,
  onRephrase,
  disabled = false,
  size = 'xs',
  variant = 'light'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRephrase = async () => {
    if (!sectionContent.trim() || !jobDescription.trim()) {
      setError('Section content and job description are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ApiService.rephraseSection(
        sectionContent,
        sectionType,
        jobDescription
      );
      
      onRephrase(result.rephrased_content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rephrase section');
      console.error('Rephrase error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tooltipLabel = error 
    ? `Error: ${error}` 
    : `Rephrase ${sectionType.replace('_', ' ')} to better fit the target job`;

  return (
    <Tooltip label={tooltipLabel} position="top">
      <Button
        leftSection={isLoading ? <Loader size="xs" /> : <IconRefresh size={14} />}
        onClick={handleRephrase}
        disabled={disabled || isLoading || !sectionContent.trim() || !jobDescription.trim()}
        size={size}
        variant={variant}
        color={error ? 'red' : 'blue'}
        loading={isLoading}
      >
        {isLoading ? 'Rephrasing...' : 'Rephrase'}
      </Button>
    </Tooltip>
  );
};
