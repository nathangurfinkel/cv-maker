import React, { useState } from 'react';
import { 
  Textarea, 
  Button, 
  Stack, 
  Text, 
  Title, 
  Alert, 
  Tabs,
  FileInput,
  Box,
  LoadingOverlay
} from '@mantine/core';
import { IconUpload, IconFileText, IconCheck } from '@tabler/icons-react';
import type { CVData } from '../types';
import { ApiService } from '../services/api';

interface DataExtractionProps {
  onDataExtracted: (data: CVData) => void;
}

export const DataExtraction: React.FC<DataExtractionProps> = ({ onDataExtracted }) => {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<CVData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtractFromText = async () => {
    if (!cvText.trim() || !jobDescription.trim()) {
      setError('Please provide both CV text and job description');
      return;
    }

    setIsExtracting(true);
    setError(null);

    try {
      const transformedData = await ApiService.extractCVData(cvText, jobDescription);
      // Include job description in the extracted data
      const dataWithJobDescription = { ...transformedData, job_description: jobDescription };
      setExtractedData(dataWithJobDescription);
      onDataExtracted(dataWithJobDescription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract data');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file || !jobDescription.trim()) {
      setError('Please provide both a file and job description');
      return;
    }

    setIsExtracting(true);
    setError(null);

    try {
      const transformedData = await ApiService.tailorCVFromFile(file, jobDescription);
      // Include job description in the extracted data
      const dataWithJobDescription = { ...transformedData, job_description: jobDescription };
      setExtractedData(dataWithJobDescription);
      onDataExtracted(dataWithJobDescription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract data from file');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isExtracting} />
      
      <Stack gap="md">
        <Title order={3}>Extract CV Data</Title>
        
 

        <Textarea
          label="Job Description (Required)"
          placeholder="Paste the job description here to help AI tailor the extraction..."
          minRows={4}
          value={jobDescription}
          onChange={(event) => setJobDescription(event.currentTarget.value)}
        />

        <Tabs defaultValue="text">
          <Tabs.List>
            <Tabs.Tab value="text" leftSection={<IconFileText size={16} />}>
              From Text
            </Tabs.Tab>
            <Tabs.Tab value="file" leftSection={<IconUpload size={16} />}>
              From File
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="text" pt="md">
            <Stack gap="md">
              <Textarea
                label="CV Text"
                placeholder="Paste your CV text here..."
                minRows={8}
                value={cvText}
                onChange={(event) => setCvText(event.currentTarget.value)}
              />
              <Button
                leftSection={<IconCheck size={16} />}
                onClick={handleExtractFromText}
                disabled={!cvText.trim() || !jobDescription.trim()}
              >
                Extract Data from Text
              </Button>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="file" pt="md">
            <Stack gap="md">
              <FileInput
                label="CV File"
                placeholder="Upload your CV file (PDF or DOCX)"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
              />
              <Text size="sm" c="dimmed">
                Supported formats: PDF, DOCX
              </Text>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}

        {extractedData && (
          <Alert color="green" title="Data Extracted Successfully" icon={<IconCheck size={16} />}>
            <Text size="sm">
              Successfully extracted data for <strong>{extractedData.personal.name}</strong>.
              You can now proceed to the next step to review and edit the information.
            </Text>
          </Alert>
        )}
      </Stack>
    </Box>
  );
};
