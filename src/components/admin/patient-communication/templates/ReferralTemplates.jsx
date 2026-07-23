import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Divider, List, ListItem, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Tabs, Tab } from '@mui/material';
import { Sync as SyncIcon, SwapVert as SortIcon, Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon, Sms as SmsIcon, Settings, ChevronRight, InfoOutlined as InfoIcon, FormatBold, FormatItalic, FormatUnderlined, Add as AddIcon, AdsClick as AdsClickIcon, Cake as CakeIcon, CalendarMonth, CreditCard, Warning as WarningIcon, ContentCopy as ContentCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

import { VariableAccordion } from './VariableAccordion';
import { VariableButton } from './VariableButton';
import { communicationService } from '../../../../services/communication.service';
import { DescriptionOutlined as DescriptionOutlinedIcon } from '@mui/icons-material';


const MOCK_TEMPLATES = [
  {
    id: 1,
    name: 'Standard Referral',
    isWellnessUpdate: false,
    blocks: [
      { id: 1, content: 'Dear Dr. {Provider Referred To: Last Name},\n\nWe are pleased to refer our mutual patient, {Patient: First Name} {Patient: Last Name}, for consultation and treatment.' }
    ]
  },
  {
    id: 2,
    name: 'Wellness Update',
    isWellnessUpdate: true,
    blocks: [
      {
        id: 1,
        content: `Patient: {Patient: First Name} {Patient: Last Name}
DOB: {Patient: DOB}
Phone: {Patient: Mobile Phone Number}
Email: {Patient: Email Address}`
      },
      {
        id: 2,
        content: `Dear Dr. {Provider Referred To: First Name} {Provider Referred To: Last Name}
We are pleased to provide an update about a mutual patient who was seen in our office today. Please review the accompanying documents included in this referral.
1. Radiographs
2. Intraoral photographs (if taken)

Calculus:
Plaque:
Stain:`
      }
    ]
  }
];

export const ReferralTemplates = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const activeTemplate = isCreating ? { name: '' } : MOCK_TEMPLATES[selectedTemplate];
  const isWellnessUpdate = !isCreating && activeTemplate?.isWellnessUpdate;

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTemplate(-1);
  };


  const handleSelectTemplate = (index) => {
    setIsCreating(false);
    setSelectedTemplate(index);
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '12px', bgcolor: '#FFFFFF', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box sx={{ bgcolor: '#F2F6FC', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #E5E9F2' }}>
          <DescriptionOutlinedIcon sx={{ fontSize: '1.2rem', color: '#4472C4' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293b' }}>Referral Templates</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Left List */}
          <Box sx={{ width: 350, flexShrink: 0, borderRight: '1px solid #E5E9F2', overflowY: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={handleCreateNew}
                  sx={{ 
                    textTransform: 'none', 
                    backgroundColor: '#3B82F6', 
                    borderRadius: '16px',
                    px: 2,
                    fontSize: '0.7rem',
                    '&:hover': { backgroundColor: '#2563EB' }
                  }}
                >
                  + Create New Form
                </Button>
              </Box>

              <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '4px', overflow: 'hidden' }}>
                <Box sx={{ p: 1.5, backgroundColor: '#FBFCFE', borderBottom: '1px solid #E5E9F2', display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 1 }}>
                    Template Title <SortIcon sx={{ fontSize: 16 }} />
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {MOCK_TEMPLATES.map((template, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        button
                        onClick={() => handleSelectTemplate(index)}
                        sx={{ 
                          py: 1.2, 
                          px: 2, 
                          mx: 2,
                          mb: 0.5,
                          borderRadius: '6px',
                          '&:hover': { backgroundColor: selectedTemplate === index ? '#F0F5FF' : '#F8FAFC' },
                          backgroundColor: selectedTemplate === index ? '#F0F5FF' : 'transparent',
                          borderLeft: selectedTemplate === index ? '4px solid #3B82F6' : '4px solid transparent',
                          transition: 'all 0.15s'
                        }}
                      >
                        <Typography sx={{ fontSize: '0.8rem', color: '#1E293B', flexGrow: 1 }}>{template.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" sx={{ color: '#3B82F6' }}><SyncIcon sx={{ fontSize: 16 }} /></IconButton>
                          <IconButton size="small" sx={{ color: '#94a3b8' }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                        </Box>
                      </ListItem>
                      {index < MOCK_TEMPLATES.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </Box>
          </Box>

          {/* Center Editor */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FBFCFE' }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid #E5E9F2', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: '#FFFFFF'
            }}>
              {isCreating ? (
                <TextField 
                  placeholder="Enter template title"
                  variant="standard"
                  sx={{ 
                    width: '60%', 
                    '& .MuiInput-input': { fontSize: '0.9rem', fontWeight: 600, color: '#334155' } 
                  }}
                  InputProps={{ disableUnderline: false }}
                  autoFocus
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                    {activeTemplate?.name}
                  </Typography>
                  <IconButton size="small"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                </Box>
              )}
              <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}>Save</Button>
            </Box>

            <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Subject</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder={isCreating ? "" : undefined}
                  defaultValue={isCreating ? "" : (isWellnessUpdate ? "We saw our mutual patient today:" : "Patient consult requested")}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }}
                />
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 1</Typography>
                    <TextField fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Title 2</Typography>
                    <TextField fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem' } }} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Body</Typography>
                {isCreating ? (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                      sx={{ textTransform: 'none', fontSize: '0.7rem', color: '#64748b', borderColor: '#e2e8f0', borderStyle: 'dashed', px: 8 }}
                    >
                      Add Paragraph
                    </Button>
                  </Box>
                ) : (
                  (activeTemplate?.blocks || []).map((block, idx) => (
                    <Box key={block.id} sx={{ mb: idx === 0 && isWellnessUpdate ? 4 : 0 }}>
                      <Box sx={{ border: '1px solid #e2e8f0', borderBottom: 'none', p: 0.5, backgroundColor: '#f8fafc', display: 'flex', gap: 1 }}>
                        <IconButton size="small"><FormatBold sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton size="small"><FormatItalic sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton size="small"><FormatUnderlined sx={{ fontSize: 18 }} /></IconButton>
                      </Box>
                      <Box sx={{ border: '1px solid #e2e8f0', p: 2, minHeight: isWellnessUpdate ? 120 : 200, fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {block.content}
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: '#f87171', cursor: 'pointer' }}>Remove</Typography>
                      </Box>
                    </Box>
                  ))
                )}

                {!isCreating && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                      sx={{ textTransform: 'none', fontSize: '0.7rem', color: '#64748b', borderColor: '#e2e8f0', borderStyle: 'dashed', px: 8 }}
                    >
                      Add Paragraph
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                  sx={{ textTransform: 'none', fontSize: '0.7rem', color: '#64748b', borderColor: '#e2e8f0', borderStyle: 'dashed', px: 8 }}
                >
                  Add Paragraph
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Right Sidebar */}
          <Box sx={{ width: 250, borderLeft: '1px solid #E5E9F2', backgroundColor: '#FBFCFE', height: '100%', overflowY: 'auto' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #E5E9F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>Variables</Typography>
              <IconButton size="small"><Settings sx={{ fontSize: 18 }} /></IconButton>
            </Box>

            <VariableAccordion title="Patient" defaultExpanded>
              <VariableButton label="General Information" />
              <VariableButton label="Insurance" />
              <VariableButton label="Financial Account" />
              <VariableButton label="Appointments" />
              <VariableButton label="Parent Information" />
            </VariableAccordion>

            <VariableAccordion title="Provider" defaultExpanded>
              <VariableButton label="Preferred Dentist" />
              <VariableButton label="Preferred Hygienist" />
              <VariableButton label="Provider Referred To" />
            </VariableAccordion>

            <VariableAccordion title="Practice">
              <VariableButton label="Name" />
              <VariableButton label="Phone number" />
              <VariableButton label="Address" />
              <VariableButton label="Website" />
              <VariableButton label="Email address" />
              <VariableButton label="Services available" />
            </VariableAccordion>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
