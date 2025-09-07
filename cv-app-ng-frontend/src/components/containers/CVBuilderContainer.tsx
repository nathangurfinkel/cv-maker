import React from 'react';
import { Grid, GridCol } from '@mantine/core';
import { StepperSection } from '../sections/StepperSection';
import { ActionSection } from '../sections/ActionSection';
import { PreviewSection } from '../sections/PreviewSection';
import { useCVData } from '../../hooks/useCVData';
import { notifications } from '@mantine/notifications';
import { ApiService } from '../../services/api';

export const CVBuilderContainer: React.FC = () => {
  const { cvData, setCvData, clearData, selectedTemplate, setSelectedTemplate, isGeneratingPDF, setIsGeneratingPDF } = useCVData();

  const handleDownloadPDF = async () => {
    if (!cvData) {
      notifications.show({
        title: 'Error',
        message: 'No CV data available to generate PDF.',
        color: 'red',
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // Generate PDF using the API service with selected template
      const pdfBlob = await ApiService.generatePDF(cvData, selectedTemplate);
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cv_${cvData.personal.name.replace(/\s+/g, '_')}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
      notifications.show({
        title: 'PDF Generated',
        message: 'Your CV has been generated and downloaded successfully!',
        color: 'green',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      notifications.show({
        title: 'Error',
        message: `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
        color: 'red',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleClearData = () => {
    clearData();
    notifications.show({
      title: 'Data Cleared',
      message: 'All form data has been reset.',
      color: 'blue',
    });
  };

  // Computed values
  const isDownloadDisabled = !cvData?.personal?.name || cvData.personal.name === 'Your Name';

  return (
    <Grid>
      {/* Left Column - Form and Controls */}
      <GridCol span={6}>
        <StepperSection
          onCVDataUpdate={setCvData}
          onDownloadPDF={handleDownloadPDF}
        />
        <ActionSection
          onDownloadPDF={handleDownloadPDF}
          onClearData={handleClearData}
          isGeneratingPDF={isGeneratingPDF}
          isDownloadDisabled={isDownloadDisabled}
        />
      </GridCol>

      {/* Right Column - Live Preview */}
      <GridCol span={6}>
        <PreviewSection
          cvData={cvData}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
      </GridCol>
    </Grid>
  );
};
