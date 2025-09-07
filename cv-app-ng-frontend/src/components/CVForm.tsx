import React, { useState } from 'react';
import { 
  TextInput, 
  Textarea, 
  Button, 
  Group, 
  Stack, 
  Title, 
  Paper, 
  ActionIcon, 
  Text, 
  MultiSelect,
  Divider
} from '@mantine/core';
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import type { CVData, Experience, Project, LicenseCertification } from '../types';
import { RephraseButton } from './RephraseButton';

interface CVFormProps {
  data: CVData;
  onDataChange: (data: CVData) => void;
  currentStep?: number;
}

export const CVForm: React.FC<CVFormProps> = ({ data, onDataChange, currentStep = 1 }) => {
  const form = useForm({
    initialValues: data,
  });

  // State for editing indices
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);

  const handleSubmit = (values: CVData) => {
    onDataChange(values);
  };

  const renderPersonalInfoForm = () => (
    <Stack gap="md">
      <Title order={3}>Personal Information</Title>
      
      <TextInput
        label="Full Name"
        placeholder="Enter your full name"
        {...form.getInputProps('personal.name')}
      />
      
      <TextInput
        label="Email"
        placeholder="Enter your email"
        {...form.getInputProps('personal.email')}
      />
      
      <TextInput
        label="Phone"
        placeholder="Enter your phone number"
        {...form.getInputProps('personal.phone')}
      />
      
      <TextInput
        label="Location"
        placeholder="Enter your location"
        {...form.getInputProps('personal.location')}
      />
      
      <TextInput
        label="Website"
        placeholder="Enter your website"
        {...form.getInputProps('personal.website')}
      />
      
      <TextInput
        label="LinkedIn"
        placeholder="Enter your LinkedIn profile"
        {...form.getInputProps('personal.linkedin')}
      />
      
      <TextInput
        label="GitHub"
        placeholder="Enter your GitHub profile"
        {...form.getInputProps('personal.github')}
      />
      
      <Textarea
        label="Professional Summary"
        placeholder="Write a brief professional summary"
        minRows={4}
        {...form.getInputProps('professional_summary')}
      />
      
      <Group justify="flex-end">
        <RephraseButton
          sectionContent={form.values.professional_summary}
          sectionType="professional_summary"
          jobDescription={form.values.job_description}
          onRephrase={(rephrased) => form.setFieldValue('professional_summary', rephrased)}
        />
      </Group>
      
      <Textarea
        label="Job Description"
        placeholder="Paste the job description you're applying for"
        minRows={6}
        {...form.getInputProps('job_description')}
      />
    </Stack>
  );

  const renderExperienceForm = () => {
    const addExperience = () => {
      const newExperience: Experience = {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        achievements: []
      };
      form.setFieldValue('experience', [...form.values.experience, newExperience]);
      setEditingExperienceIndex(form.values.experience.length);
    };

    const removeExperience = (index: number) => {
      const newExperiences = form.values.experience.filter((_, i) => i !== index);
      form.setFieldValue('experience', newExperiences);
      if (editingExperienceIndex === index) setEditingExperienceIndex(null);
    };

    const updateExperience = (index: number, field: keyof Experience, value: any) => {
      const newExperiences = [...form.values.experience];
      newExperiences[index] = { ...newExperiences[index], [field]: value };
      form.setFieldValue('experience', newExperiences);
    };

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Work Experience</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={addExperience}>
            Add Experience
          </Button>
        </Group>

        {form.values.experience.map((exp, index) => (
          <Paper key={index} p="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={500}>Experience #{index + 1}</Text>
              <Group>
                <ActionIcon
                  variant="subtle"
                  onClick={() => setEditingExperienceIndex(editingExperienceIndex === index ? null : index)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => removeExperience(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Group>

            <Stack gap="sm">
              <TextInput
                label="Job Title"
                placeholder="e.g., Software Engineer"
                value={exp.role}
                onChange={(e) => updateExperience(index, 'role', e.target.value)}
              />
              
              <TextInput
                label="Company"
                placeholder="e.g., Google"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
              />
              
              <Group grow>
                <TextInput
                  label="Start Date"
                  placeholder="e.g., Jan 2020"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
                <TextInput
                  label="End Date"
                  placeholder="e.g., Present"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                />
              </Group>
              
              <TextInput
                label="Location"
                placeholder="e.g., San Francisco, CA"
                value={exp.location}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
              />
              
              <Textarea
                label="Description"
                placeholder="Describe your role and responsibilities..."
                minRows={3}
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
              />
              
              <Group justify="flex-end">
                <RephraseButton
                  sectionContent={exp.description}
                  sectionType="experience"
                  jobDescription={form.values.job_description}
                  onRephrase={(rephrased) => updateExperience(index, 'description', rephrased)}
                />
              </Group>
            </Stack>
          </Paper>
        ))}

        {form.values.experience.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No work experience added yet. Click "Add Experience" to get started.
          </Text>
        )}
      </Stack>
    );
  };

  const renderEducationForm = () => {
    const addEducation = () => {
      const newEducation = {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
      };
      form.setFieldValue('education', [...form.values.education, newEducation]);
    };

    const removeEducation = (index: number) => {
      const newEducation = form.values.education.filter((_, i) => i !== index);
      form.setFieldValue('education', newEducation);
    };

    const updateEducation = (index: number, field: string, value: string) => {
      const newEducation = [...form.values.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      form.setFieldValue('education', newEducation);
    };

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Education</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={addEducation}>
            Add Education
          </Button>
        </Group>

        {form.values.education.map((edu, index) => (
          <Paper key={index} p="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={500}>Education #{index + 1}</Text>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => removeEducation(index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>

            <Stack gap="sm">
              <TextInput
                label="Institution"
                placeholder="e.g., Stanford University"
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
              />
              
              <Group grow>
                <TextInput
                  label="Degree"
                  placeholder="e.g., Bachelor of Science"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                />
                <TextInput
                  label="Field of Study"
                  placeholder="e.g., Computer Science"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                />
              </Group>
              
              <Group grow>
                <TextInput
                  label="Start Date"
                  placeholder="e.g., Sep 2016"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                />
                <TextInput
                  label="End Date"
                  placeholder="e.g., May 2020"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                />
                <TextInput
                  label="GPA (Optional)"
                  placeholder="e.g., 3.8"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                />
              </Group>
            </Stack>
          </Paper>
        ))}

        {form.values.education.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No education added yet. Click "Add Education" to get started.
          </Text>
        )}
      </Stack>
    );
  };

  const renderSkillsForm = () => {
    const updateSkills = (category: 'technical' | 'soft' | 'languages', value: string[]) => {
      form.setFieldValue('skills', {
        ...form.values.skills,
        [category]: value
      });
    };

    const rephraseSkills = (category: 'technical' | 'soft' | 'languages') => {
      const skillsText = form.values.skills[category].join(', ');
      return skillsText;
    };

    const handleSkillsRephrase = (category: 'technical' | 'soft' | 'languages', rephrasedText: string) => {
      // Split the rephrased text back into an array of skills
      const rephrasedSkills = rephrasedText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      updateSkills(category, rephrasedSkills);
    };

    return (
      <Stack gap="md">
        <Title order={3}>Skills</Title>
        
        <MultiSelect
          label="Technical Skills"
          placeholder="Add technical skills (e.g., JavaScript, Python, React)"
          data={[
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
            'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
            'HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap',
            'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
            'AWS', 'Docker', 'Kubernetes', 'Git', 'Linux', 'Windows'
          ]}
          value={form.values.skills.technical}
          onChange={(value) => updateSkills('technical', value)}
          searchable
        />
        
        <Group justify="flex-end">
          <RephraseButton
            sectionContent={rephraseSkills('technical')}
            sectionType="skills"
            jobDescription={form.values.job_description}
            onRephrase={(rephrased) => handleSkillsRephrase('technical', rephrased)}
          />
        </Group>
        
        <MultiSelect
          label="Soft Skills"
          placeholder="Add soft skills (e.g., Leadership, Communication, Problem Solving)"
          data={[
            'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management',
            'Critical Thinking', 'Adaptability', 'Creativity', 'Emotional Intelligence',
            'Project Management', 'Public Speaking', 'Negotiation', 'Mentoring',
            'Customer Service', 'Conflict Resolution', 'Strategic Planning', 'Decision Making'
          ]}
          value={form.values.skills.soft}
          onChange={(value) => updateSkills('soft', value)}
          searchable
        />
        
        <Group justify="flex-end">
          <RephraseButton
            sectionContent={rephraseSkills('soft')}
            sectionType="skills"
            jobDescription={form.values.job_description}
            onRephrase={(rephrased) => handleSkillsRephrase('soft', rephrased)}
          />
        </Group>
        
        <MultiSelect
          label="Languages"
          placeholder="Add languages (e.g., English, Spanish, French)"
          data={[
            'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
            'Chinese (Mandarin)', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch',
            'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian'
          ]}
          value={form.values.skills.languages}
          onChange={(value) => updateSkills('languages', value)}
          searchable
        />
        
        <Group justify="flex-end">
          <RephraseButton
            sectionContent={rephraseSkills('languages')}
            sectionType="skills"
            jobDescription={form.values.job_description}
            onRephrase={(rephrased) => handleSkillsRephrase('languages', rephrased)}
          />
        </Group>
      </Stack>
    );
  };

  const renderProjectsForm = () => {
    const addProject = () => {
      const newProject: Project = {
        name: '',
        description: '',
        tech_stack: [],
        link: ''
      };
      form.setFieldValue('projects', [...form.values.projects, newProject]);
    };

    const removeProject = (index: number) => {
      const newProjects = form.values.projects.filter((_, i) => i !== index);
      form.setFieldValue('projects', newProjects);
    };

    const updateProject = (index: number, field: keyof Project, value: any) => {
      const newProjects = [...form.values.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      form.setFieldValue('projects', newProjects);
    };

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Projects</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={addProject}>
            Add Project
          </Button>
        </Group>

        {form.values.projects.map((project, index) => (
          <Paper key={index} p="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={500}>Project #{index + 1}</Text>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => removeProject(index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>

            <Stack gap="sm">
              <TextInput
                label="Project Name"
                placeholder="e.g., E-commerce Website"
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
              />
              
              <Textarea
                label="Description"
                placeholder="Describe the project, your role, and key achievements..."
                minRows={3}
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
              />
              
              <MultiSelect
                label="Tech Stack"
                placeholder="Add technologies used (e.g., React, Node.js, MongoDB)"
                data={[
                  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
                  'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
                  'HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap',
                  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
                  'AWS', 'Docker', 'Kubernetes', 'Git', 'Linux', 'Windows',
                  'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator'
                ]}
                value={project.tech_stack}
                onChange={(value) => updateProject(index, 'tech_stack', value)}
                searchable
              />
              
              <TextInput
                label="Project Link (Optional)"
                placeholder="e.g., https://github.com/username/project"
                value={project.link}
                onChange={(e) => updateProject(index, 'link', e.target.value)}
              />
              
              <Group justify="flex-end">
                <RephraseButton
                  sectionContent={project.description}
                  sectionType="project"
                  jobDescription={form.values.job_description}
                  onRephrase={(rephrased) => updateProject(index, 'description', rephrased)}
                />
              </Group>
            </Stack>
          </Paper>
        ))}

        {form.values.projects.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No projects added yet. Click "Add Project" to get started.
          </Text>
        )}
      </Stack>
    );
  };

  const renderCertificationsForm = () => {
    const addCertification = () => {
      const newCert: LicenseCertification = {
        name: '',
        issuer: '',
        date: '',
        expiry: ''
      };
      form.setFieldValue('licenses_certifications', [...form.values.licenses_certifications, newCert]);
    };

    const removeCertification = (index: number) => {
      const newCerts = form.values.licenses_certifications.filter((_, i) => i !== index);
      form.setFieldValue('licenses_certifications', newCerts);
    };

    const updateCertification = (index: number, field: keyof LicenseCertification, value: string) => {
      const newCerts = [...form.values.licenses_certifications];
      newCerts[index] = { ...newCerts[index], [field]: value };
      form.setFieldValue('licenses_certifications', newCerts);
    };

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Licenses & Certifications</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={addCertification}>
            Add Certification
          </Button>
        </Group>

        {form.values.licenses_certifications.map((cert, index) => (
          <Paper key={index} p="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={500}>Certification #{index + 1}</Text>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => removeCertification(index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>

            <Stack gap="sm">
              <TextInput
                label="Certification Name"
                placeholder="e.g., AWS Certified Solutions Architect"
                value={cert.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
              />
              
              <TextInput
                label="Issuing Organization"
                placeholder="e.g., Amazon Web Services"
                value={cert.issuer}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
              />
              
              <Group grow>
                <TextInput
                  label="Issue Date"
                  placeholder="e.g., Jan 2023"
                  value={cert.date}
                  onChange={(e) => updateCertification(index, 'date', e.target.value)}
                />
                <TextInput
                  label="Expiry Date (Optional)"
                  placeholder="e.g., Jan 2026"
                  value={cert.expiry || ''}
                  onChange={(e) => updateCertification(index, 'expiry', e.target.value)}
                />
              </Group>
            </Stack>
          </Paper>
        ))}

        {form.values.licenses_certifications.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No certifications added yet. Click "Add Certification" to get started.
          </Text>
        )}
      </Stack>
    );
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoForm();
      case 2:
        return renderExperienceForm();
      case 3:
        return renderEducationForm();
      case 4:
        return renderSkillsForm();
      case 5:
        return renderProjectsForm();
      case 6:
        return renderCertificationsForm();
      default:
        return renderPersonalInfoForm();
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        {renderCurrentForm()}
        
        <Divider />
        
        <Group justify="flex-end">
          <Button type="submit">
            Save Changes
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
