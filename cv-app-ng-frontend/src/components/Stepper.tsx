import React from 'react';
import { Box, Text, Group, Button, Progress } from '@mantine/core';

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Box p="md">
      {/* Progress Bar */}
      <Box mb="md">
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500}>
            {steps[currentStep]?.title || 'Progress'}
          </Text>
          <Text size="sm">
            Step {currentStep + 1} of {steps.length}
          </Text>
        </Group>
        <Progress value={progress} size="sm" />
      </Box>


      {/* Navigation */}
      <Group justify="space-between">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!canGoNext}
        >
          Next
        </Button>
      </Group>
    </Box>
  );
};
