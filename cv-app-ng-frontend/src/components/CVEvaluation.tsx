import React, { useState } from 'react';
import { Textarea, Button, Stack, Text, Title, Alert } from '@mantine/core';
import { IconInfoCircle, IconChartBar } from '@tabler/icons-react';
import type { CVData } from '../types';
import { ApiService } from '../services/api';

interface CVEvaluationProps {
  cvData: CVData;
  onCVDataUpdate: (data: CVData) => void;
}

export const CVEvaluation: React.FC<CVEvaluationProps> = ({ cvData }) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Use job description from CVData, fallback to empty string if not available
  const jobDescription = cvData.job_description || '';

  const handleEvaluate = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description for evaluation');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const data = await ApiService.evaluateCV(cvData, jobDescription);
      
      // Format the evaluation result
      let resultText = '';
      if (data.individual_evaluations) {
        resultText = 'AI Evaluation Results:\n\n';
        data.individual_evaluations.forEach((evaluation: any) => {
          resultText += `${evaluation.persona}: ${evaluation.score}/10\n`;
          resultText += `Justification: ${evaluation.justification}\n\n`;
        });
        resultText += `Overall Score: ${data.average_score}/10`;
      } else {
        resultText = JSON.stringify(data, null, 2);
      }
      
      setEvaluationResult(resultText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate CV');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <Stack gap="md">
      <Title order={3}>AI CV Evaluation</Title>
      
      <Alert icon={<IconInfoCircle size={16} />} title="How it works">
        {jobDescription.trim() 
          ? 'Get AI-powered feedback on how well your current CV matches the job description you provided in the first step.'
          : 'Provide a job description in the first step to get AI-powered feedback on how well your current CV matches the position.'
        }
      </Alert>

      <Textarea
        label="Job Description"
        placeholder="No job description available. Please go back to the first step to add one."
        minRows={6}
        value={jobDescription}
        readOnly
        styles={{
          input: {
            backgroundColor: jobDescription ? '#f8f9fa' : '#fff',
            cursor: jobDescription ? 'default' : 'not-allowed'
          }
        }}
      />
      
      {!jobDescription && (
        <Text size="sm" c="orange">
          ⚠️ No job description found. Please go back to the "Data Extraction" step to add a job description first.
        </Text>
      )}

      <Button
        leftSection={<IconChartBar size={16} />}
        onClick={handleEvaluate}
        loading={isEvaluating}
        disabled={!jobDescription.trim()}
        size="lg"
      >
        {jobDescription.trim() ? 'Evaluate My CV' : 'Job Description Required'}
      </Button>

      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}

      {evaluationResult && (
        <Alert color="green" title="Evaluation Results">
          <Text style={{ whiteSpace: 'pre-line' }}>{evaluationResult}</Text>
        </Alert>
      )}
    </Stack>
  );
};
