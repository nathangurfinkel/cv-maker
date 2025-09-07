/**
 * API service for communicating with the CV Generator backend.
 * Follows Single Responsibility Principle - handles only API communication.
 */

import type { CVData, PDFRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class ApiService {
  /**
   * Generate PDF from CV data
   */
  static async generatePDF(cvData: CVData, templateId: string = 'modern'): Promise<Blob> {
    const request: PDFRequest = {
      templateId,
      data: cvData
    };

    const response = await fetch(`${API_BASE_URL}/pdf/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  /**
   * Get available PDF templates
   */
  static async getAvailableTemplates(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/pdf/templates`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Extract structured CV data from text
   */
  static async extractCVData(cvText: string, jobDescription: string): Promise<CVData> {
    const response = await fetch(`${API_BASE_URL}/cv/extract-cv-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cv_text: cvText,
        job_description: jobDescription,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform backend response to our CVData format
    return {
      personal: {
        name: data.personal?.name || "Your Name",
        email: data.personal?.email || "your.email@example.com",
        phone: data.personal?.phone || "+1234567890",
        location: data.personal?.location || "City, State",
        website: data.personal?.website || "your-website.com",
        linkedin: data.personal?.linkedin || "linkedin.com/in/username",
        github: data.personal?.github || "github.com/username"
      },
      professional_summary: data.professional_summary || "",
      experience: data.experience || [],
      education: data.education || [],
      projects: data.projects || [],
      skills: data.skills || { technical: [], soft: [], languages: [] },
      licenses_certifications: data.licenses_certifications || [],
      job_description: data.job_description || ""
    };
  }

  /**
   * Tailor CV from uploaded file
   */
  static async tailorCVFromFile(file: File, jobDescription: string): Promise<CVData> {
    const formData = new FormData();
    formData.append('cv_file', file);
    formData.append('job_description', jobDescription);

    const response = await fetch(`${API_BASE_URL}/cv/tailor-from-file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform backend response to our CVData format
    return {
      personal: {
        name: data.personal?.name || "Your Name",
        email: data.personal?.email || "your.email@example.com",
        phone: data.personal?.phone || "+1234567890",
        location: data.personal?.location || "City, State",
        website: data.personal?.website || "your-website.com",
        linkedin: data.personal?.linkedin || "linkedin.com/in/username",
        github: data.personal?.github || "github.com/username"
      },
      professional_summary: data.professional_summary || "",
      experience: data.experience || [],
      education: data.education || [],
      projects: data.projects || [],
      skills: data.skills || { technical: [], soft: [], languages: [] },
      licenses_certifications: data.licenses_certifications || [],
      job_description: data.job_description || ""
    };
  }

  /**
   * Evaluate CV with AI committee
   */
  static async evaluateCV(cvData: CVData, jobDescription: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/evaluation/cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_description: jobDescription,
        cv_json: cvData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Rephrase a CV section to better fit the target job
   */
  static async rephraseSection(
    sectionContent: string, 
    sectionType: string, 
    jobDescription: string
  ): Promise<{ original_content: string; rephrased_content: string; section_type: string }> {
    const response = await fetch(`${API_BASE_URL}/cv/rephrase-section`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        section_content: sectionContent,
        section_type: sectionType,
        job_description: jobDescription,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
