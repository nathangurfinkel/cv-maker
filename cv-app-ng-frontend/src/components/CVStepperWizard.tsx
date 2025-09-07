import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { Stepper as StepperComponent } from './Stepper';
import { DataExtraction } from './DataExtraction';
import { CVForm } from './CVForm';
import { CVEvaluation } from './CVEvaluation';
import { useCVData } from '../hooks/useCVData';

interface CVStepperWizardProps {
  onCVDataUpdate: (data: any) => void;
  onDownloadPDF: () => void;
}

export const CVStepperWizard: React.FC<CVStepperWizardProps> = ({
  onCVDataUpdate,
}) => {
  const { cvData, setCvData } = useCVData();
  const [active, setActive] = useState(0);

  const steps = [
    {
      id: 'extraction',
      title: 'Data Extraction',
      description: 'Extract data from file or text',
      completed: cvData.personal.name !== 'Your Name' && cvData.personal.name.trim() !== '',
    },
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Review and edit your basic details',
      completed: cvData.personal.name !== 'Your Name' && cvData.personal.email !== 'your.email@example.com',
    },
    {
      id: 'experience',
      title: 'Experience',
      description: 'Review and edit your work experience',
      completed: cvData.experience.length > 0,
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Review and edit your educational background',
      completed: cvData.education.length > 0,
    },
    {
      id: 'skills',
      title: 'Skills',
      description: 'Review and edit your skills',
      completed: cvData.skills.technical.length > 0 || cvData.skills.soft.length > 0,
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Review and edit your projects',
      completed: cvData.projects.length > 0,
    },
    {
      id: 'certifications',
      title: 'Certifications',
      description: 'Review and edit your certifications',
      completed: cvData.licenses_certifications.length > 0,
    },
    {
      id: 'evaluation',
      title: 'AI Evaluation',
      description: 'Get AI feedback on your CV',
      completed: false,
    },
  ];

  const nextStep = () => setActive((current) => (current < steps.length ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleCVDataUpdate = (newData: any) => {
    setCvData(newData);
    onCVDataUpdate(newData);
  };

  const renderStepContent = () => {
    switch (active) {
      case 0:
        return (
          <DataExtraction
            onDataExtracted={handleCVDataUpdate}
          />
        );
      case 1:
        return (
          <CVForm
            data={cvData}
            onDataChange={handleCVDataUpdate}
            currentStep={1}
          />
        );
      case 2:
        return (
          <CVForm
            data={cvData}
            onDataChange={handleCVDataUpdate}
            currentStep={2}
          />
        );
      case 3:
        return (
          <CVForm
            data={cvData}
            onDataChange={handleCVDataUpdate}
            currentStep={3}
          />
        );
      case 4:
        return (
          <CVForm
            data={cvData}
            onDataChange={handleCVDataUpdate}
            currentStep={4}
          />
        );
      case 5:
        return (
          <CVForm
            data={cvData}
            onDataChange={handleCVDataUpdate}
            currentStep={5}
          />
        );
      case 6:
        return (
          <CVForm
            data={cvData}
            onDataChange={handleCVDataUpdate}
            currentStep={6}
          />
        );
      case 7:
        return (
          <CVEvaluation
            cvData={cvData}
            onCVDataUpdate={handleCVDataUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <StepperComponent
        steps={steps}
        currentStep={active}
        onNext={nextStep}
        onPrevious={prevStep}
        canGoNext={active < steps.length - 1}
        canGoPrevious={active > 0}
      />
      
      <Box mt="md">
        {renderStepContent()}
      </Box>
    </Box>
  );
};
