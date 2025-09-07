import { useState, useCallback, useEffect } from 'react';
import type { CVData, TemplateId } from '../types';
import { DEFAULT_CV_DATA } from '../types';

export interface UseCVDataReturn {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  clearData: () => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (template: TemplateId) => void;
  isGeneratingPDF: boolean;
  setIsGeneratingPDF: (loading: boolean) => void;
}

const STORAGE_KEY = 'cv-maker-data';

export const useCVData = (): UseCVDataReturn => {
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCvData(parsedData);
      }
    } catch (error) {
      console.error('Failed to load CV data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever cvData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    } catch (error) {
      console.error('Failed to save CV data to localStorage:', error);
    }
  }, [cvData]);

  const clearData = useCallback(() => {
    setCvData(DEFAULT_CV_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear CV data from localStorage:', error);
    }
  }, []);

  return {
    cvData,
    setCvData,
    clearData,
    selectedTemplate,
    setSelectedTemplate,
    isGeneratingPDF,
    setIsGeneratingPDF,
  };
};
