import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Divider, List, ListItem } from '@mui/material';
import { Sync as SyncIcon, SwapVert as SortIcon, Delete as DeleteIcon, Email as EmailIcon, Sms as SmsIcon } from '@mui/icons-material';

export const AutomatedTemplatesList = ({ templates, selectedTemplate, onSelect }) => {
  const [showDeleted, setShowDeleted] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid #E5E9F2', backgroundColor: '#FFFFFF' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              component="input" 
              type="checkbox" 
              checked={showDeleted} 
              onChange={(e) => setShowDeleted(e.target.checked)}
              sx={{ width: 14, height: 14, cursor: 'pointer' }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>Show deleted</Typography>
          </Box>
        </Box>

        <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '4px', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
          <Box sx={{ p: 1.5, backgroundColor: '#FBFCFE', borderBottom: '1px solid #E5E9F2', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 1 }}>
              Template Title <SortIcon sx={{ fontSize: 16 }} />
            </Typography>
          </Box>
          <List sx={{ p: 0, flexShrink: 0 }}>
            {templates.map((template, index) => (
              <React.Fragment key={template.id || index}>
                <ListItem 
                  button
                  onClick={() => onSelect(index, template)}
                  sx={{ 
                    mx: 2, 
                    px: 2, 
                    py: 1.2, 
                    mb: 0.5, 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: selectedTemplate === index ? '#F0F5FF' : '#F8FAFC' },
                    backgroundColor: selectedTemplate === index ? '#F0F5FF' : 'transparent',
                    borderLeft: selectedTemplate === index ? '4px solid #3B82F6' : '4px solid transparent',
                    transition: 'all 0.15s'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {template.description || template.name}
                    </Typography>
                    {(!template.subject || template.type === 'sms' || template.type === 'both') && <SmsIcon sx={{ fontSize: 14, color: '#64748b', flexShrink: 0 }} />}
                    {(template.subject || template.type === 'email' || template.type === 'both') && <EmailIcon sx={{ fontSize: 14, color: '#64748b', flexShrink: 0 }} />}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: '#3B82F6' }}><SyncIcon sx={{ fontSize: 16 }} /></IconButton>
                    {/* Assuming delete is handled elsewhere or we can add delete button here if needed */}
                  </Box>
                </ListItem>
                {index < templates.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};