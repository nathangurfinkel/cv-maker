// CV Data Types for Templating System

// Date handling types
export type DateValue = {
  year: number;
  month?: number; // 1-12, optional for year-only dates
  day?: number;   // 1-31, optional for month/year or year-only dates
  isPresent?: boolean; // true for "Present" or "Current" dates
};

export type DateString = string; // For backward compatibility and display

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: DateString;
  endDate: DateString;
  location: string;
  description: string;
  achievements: string[];
  // Enhanced date fields for better handling
  startDateValue?: DateValue;
  endDateValue?: DateValue;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: DateString;
  endDate: DateString;
  gpa: string;
  // Enhanced date fields for better handling
  startDateValue?: DateValue;
  endDateValue?: DateValue;
}

export interface Project {
  name: string;
  description: string;
  tech_stack: string[];
  link: string;
  // Optional date fields for projects
  startDate?: DateString;
  endDate?: DateString;
  startDateValue?: DateValue;
  endDateValue?: DateValue;
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface LicenseCertification {
  name: string;
  issuer: string;
  date: DateString;
  expiry?: DateString;
  // Enhanced date fields for better handling
  dateValue?: DateValue;
  expiryValue?: DateValue;
}

export interface CVData {
  personal: PersonalInfo;
  professional_summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skills;
  licenses_certifications: LicenseCertification[];
  job_description: string;
}

export interface PDFRequest {
  templateId: string;
  data: CVData;
}

// AI Evaluation Types
export interface EvaluationRequest {
  job_description: string;
  cv_json: CVData;
}

export interface PersonaEvaluation {
  persona: string;
  score: number;
  justification: string;
}

export interface CommitteeEvaluation {
  individual_evaluations: PersonaEvaluation[];
  average_score: number;
}

export interface FileUploadResponse {
  success: boolean;
  extracted_data?: CVData;
  message: string;
}

// Template types
export type TemplateId = 'modern' | 'classic';

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
}

// Available templates
export const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design with blue accents'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, professional layout with serif fonts'
  }
];

// Date utility functions
export const formatDate = (dateValue: DateValue): string => {
  if (dateValue.isPresent) {
    return 'Present';
  }
  
  if (dateValue.day && dateValue.month) {
    // Full date: "Jan 2023" or "15 Jan 2023"
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[dateValue.month - 1];
    return `${dateValue.day} ${month} ${dateValue.year}`;
  } else if (dateValue.month) {
    // Month/Year: "Jan 2023"
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[dateValue.month - 1];
    return `${month} ${dateValue.year}`;
  } else {
    // Year only: "2023"
    return dateValue.year.toString();
  }
};

export const parseDateString = (dateString: string): DateValue | null => {
  if (!dateString || dateString.toLowerCase() === 'present' || dateString.toLowerCase() === 'current') {
    return { year: new Date().getFullYear(), isPresent: true };
  }
  
  // Try to parse various date formats
  const patterns = [
    /^(\d{4})$/, // Year only: "2023"
    /^(\w{3})\s+(\d{4})$/, // Month Year: "Jan 2023"
    /^(\d{1,2})\s+(\w{3})\s+(\d{4})$/, // Day Month Year: "15 Jan 2023"
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY or DD/MM/YYYY
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
  ];
  
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                     'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  for (const pattern of patterns) {
    const match = dateString.match(pattern);
    if (match) {
      if (pattern === patterns[0]) {
        // Year only
        return { year: parseInt(match[1]) };
      } else if (pattern === patterns[1]) {
        // Month Year
        const monthIndex = monthNames.indexOf(match[1].toLowerCase());
        if (monthIndex !== -1) {
          return { year: parseInt(match[2]), month: monthIndex + 1 };
        }
      } else if (pattern === patterns[2]) {
        // Day Month Year
        const monthIndex = monthNames.indexOf(match[2].toLowerCase());
        if (monthIndex !== -1) {
          return { 
            year: parseInt(match[3]), 
            month: monthIndex + 1, 
            day: parseInt(match[1]) 
          };
        }
      } else if (pattern === patterns[3]) {
        // MM/DD/YYYY or DD/MM/YYYY (assume MM/DD/YYYY)
        return { 
          year: parseInt(match[3]), 
          month: parseInt(match[1]), 
          day: parseInt(match[2]) 
        };
      } else if (pattern === patterns[4]) {
        // YYYY-MM-DD
        return { 
          year: parseInt(match[1]), 
          month: parseInt(match[2]), 
          day: parseInt(match[3]) 
        };
      }
    }
  }
  
  return null;
};

export const createDateValue = (year: number, month?: number, day?: number, isPresent?: boolean): DateValue => {
  return { year, month, day, isPresent };
};

// Default CV data
export const DEFAULT_CV_DATA: CVData = {
  personal: {
    name: 'Your Name',
    email: 'your.email@example.com',
    phone: '+1234567890',
    location: 'City, State',
    website: 'your-website.com',
    linkedin: 'linkedin.com/in/username',
    github: 'github.com/username'
  },
  professional_summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: {
    technical: [],
    soft: [],
    languages: []
  },
  licenses_certifications: [],
  job_description: ''
};
