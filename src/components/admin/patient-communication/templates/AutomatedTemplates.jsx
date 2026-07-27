import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { DescriptionOutlined as DescriptionOutlinedIcon } from '@mui/icons-material';
import { AutomatedTemplatesList } from './AutomatedTemplatesList';
import { TemplateEditor } from './TemplateEditor';
import { VariablesSidebar } from './VariablesSidebar';
import { communicationService } from '../../../../services/communication.service';

export const AutomatedTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [templateInfo, setTemplateInfo] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getTemplates(1);
      setTemplates(data || []);
      if (data && data.length > 0 && !templateInfo) {
        setTemplateInfo({ ...data[0] });
      }
    } catch (err) {
      console.error('Failed to fetch templates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      if (templateInfo.id) {
        await communicationService.updateTemplate(templateInfo.id, updatedData);
      }
      fetchTemplates();
    } catch (err) {
      console.error('Failed to save template', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await communicationService.deleteTemplate(id);
      setSelectedTemplate(0);
      setTemplateInfo(null);
      fetchTemplates();
    } catch (err) {
      console.error('Failed to delete template', err);
    }
  };


  return (
    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{
        border: '1px solid #E5E9F2',
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        {/* Main Header */}
        <Box sx={{
          bgcolor: '#F2F6FC',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid #E5E9F2'
        }}>
          <DescriptionOutlinedIcon sx={{ fontSize: '1.2rem', color: '#4472C4' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293b' }}>
            Automated Templates
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Left List */}
          <Box sx={{ width: 350, flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
            <AutomatedTemplatesList
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelect={(idx, info) => {
                setSelectedTemplate(idx);
                setTemplateInfo({ ...info, type: !info.subject ? 'text' : 'email', name: info.description || info.name });
              }}
            />
          </Box>

          {/* Center Editor */}
          <TemplateEditor
            selectedTemplate={selectedTemplate}
            templateInfo={templateInfo}
            onSave={handleSave}
            onDelete={handleDelete}
          />

          {/* Right Sidebar */}
          <VariablesSidebar templateInfo={templateInfo} />
        </Box>
      </Box>
    </Box>
  );
};
