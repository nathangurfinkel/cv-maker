import React from 'react';
import { Box, Text, Title, Stack, Group, Badge } from '@mantine/core';
import type { CVData } from '../types';

interface LivePreviewProps {
  data: CVData;
  selectedTemplate: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ data, selectedTemplate }) => {
  const hasData = data.personal.name !== 'Your Name' && data.personal.name.trim() !== '';

  if (!hasData) {
    return (
      <Box ta="center" p="xl">
        <Text size="lg" c="dimmed" fs="italic">
          CV preview will appear here...
        </Text>
        <Text size="sm" mt="sm">
          Fill in your information to see the live preview
        </Text>
      </Box>
    );
  }

  // Template-specific styling
  const isModern = selectedTemplate === 'modern';
  const headerColor = isModern ? '#3182ce' : '#000000';
  const accentColor = isModern ? '#3182ce' : '#000000';
  const textColor = isModern ? '#2d3748' : '#000000';
  const mutedColor = isModern ? '#4a5568' : '#000000';

  // Helper function to render section titles
  const renderSectionTitle = (title: string) => (
    <Title 
      order={3} 
      size="h4"
      style={{ 
        color: textColor,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: `1px solid ${isModern ? '#e2e8f0' : '#000000'}`,
        paddingBottom: '4px',
        marginBottom: '8px'
      }}
    >
      {title}
    </Title>
  );

  return (
    <Box p="md">
      <Stack gap="md">
        {/* Header */}
        <Box ta="center" style={{ borderBottom: `2px solid ${headerColor}`, paddingBottom: '12px', marginBottom: '16px' }}>
          <Title 
            order={1} 
            size={isModern ? "h2" : "h3"}
            style={{ 
              color: headerColor,
              textTransform: isModern ? 'none' : 'uppercase',
              letterSpacing: isModern ? 'normal' : '1px',
              fontWeight: isModern ? 700 : 'bold'
            }}
          >
            {data.personal.name}
          </Title>
          <Group justify="center" gap="md" mt="xs">
            <Text size="sm" c={mutedColor}>{data.personal.email}</Text>
            <Text size="sm" c={mutedColor}>{data.personal.phone}</Text>
            <Text size="sm" c={mutedColor}>{data.personal.location}</Text>
          </Group>
          <Group justify="center" gap="md" mt="xs">
            {data.personal.website && (
              <Text size="sm" c={accentColor}>{data.personal.website}</Text>
            )}
            {data.personal.linkedin && (
              <Text size="sm" c={accentColor}>{data.personal.linkedin}</Text>
            )}
            {data.personal.github && (
              <Text size="sm" c={accentColor}>{data.personal.github}</Text>
            )}
          </Group>
        </Box>

        {/* Professional Summary */}
        {data.professional_summary && (
          <Box>
            {renderSectionTitle('Professional Summary')}
            <Text c={mutedColor}>{data.professional_summary}</Text>
          </Box>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <Box>
            {renderSectionTitle('Professional Experience')}
            <Stack gap="md">
              {data.experience.map((exp, index) => (
                <Box key={index}>
                  <Group justify="space-between">
                    <Title order={4} size="h5" c={textColor}>{exp.role}</Title>
                    <Text size="sm" c={mutedColor}>
                      {exp.startDate} - {exp.endDate}
                    </Text>
                  </Group>
                  <Text fw={500} c={accentColor}>{exp.company}</Text>
                  <Text size="sm" c={mutedColor}>{exp.location}</Text>
                  <Text mt="xs" c={mutedColor}>{exp.description}</Text>
                  {exp.achievements.length > 0 && (
                    <Box mt="xs">
                      <Text size="sm" fw={500} c={textColor}>Key Achievements:</Text>
                      <ul>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i}>
                            <Text size="sm" c={mutedColor}>{achievement}</Text>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <Box>
            {renderSectionTitle('Education')}
            <Stack gap="md">
              {data.education.map((edu, index) => (
                <Box key={index}>
                  <Group justify="space-between">
                    <Title order={4} size="h5" c={textColor}>{edu.degree}</Title>
                    <Text size="sm" c={mutedColor}>
                      {edu.startDate} - {edu.endDate}
                    </Text>
                  </Group>
                  <Text fw={500} c={accentColor}>{edu.institution}</Text>
                  <Text size="sm" c={mutedColor}>{edu.field}</Text>
                  {edu.gpa && (
                    <Text size="sm" c={mutedColor}>GPA: {edu.gpa}</Text>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Skills */}
        {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.languages.length > 0) && (
          <Box>
            {renderSectionTitle('Skills')}
            <Stack gap="sm">
              {data.skills.technical.length > 0 && (
                <Box>
                  <Text fw={500} c={textColor}>Technical Skills:</Text>
                  <Group gap="xs" mt="xs">
                    {data.skills.technical.map((skill, index) => (
                      <Badge key={index} variant="light" color={isModern ? "blue" : "gray"}>{skill}</Badge>
                    ))}
                  </Group>
                </Box>
              )}
              {data.skills.soft.length > 0 && (
                <Box>
                  <Text fw={500} c={textColor}>Soft Skills:</Text>
                  <Group gap="xs" mt="xs">
                    {data.skills.soft.map((skill, index) => (
                      <Badge key={index} variant="light" color={isModern ? "green" : "gray"}>{skill}</Badge>
                    ))}
                  </Group>
                </Box>
              )}
              {data.skills.languages.length > 0 && (
                <Box>
                  <Text fw={500} c={textColor}>Languages:</Text>
                  <Group gap="xs" mt="xs">
                    {data.skills.languages.map((language, index) => (
                      <Badge key={index} variant="light" color={isModern ? "orange" : "gray"}>{language}</Badge>
                    ))}
                  </Group>
                </Box>
              )}
            </Stack>
          </Box>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <Box>
            {renderSectionTitle('Projects')}
            <Stack gap="md">
              {data.projects.map((project, index) => (
                <Box key={index}>
                  <Title order={4} size="h5" c={textColor}>{project.name}</Title>
                  <Text c={mutedColor}>{project.description}</Text>
                  {project.tech_stack.length > 0 && (
                    <Group gap="xs" mt="xs">
                      {project.tech_stack.map((tech, i) => (
                        <Badge key={i} variant="outline" size="sm" color={isModern ? "blue" : "gray"}>{tech}</Badge>
                      ))}
                    </Group>
                  )}
                  {project.link && (
                    <Text size="sm" c={accentColor} mt="xs">{project.link}</Text>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
