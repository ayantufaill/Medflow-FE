import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Divider, List, ListItem, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Tabs, Tab } from '@mui/material';
import { Sync as SyncIcon, SwapVert as SortIcon, Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon, Sms as SmsIcon, Settings, ChevronRight, InfoOutlined as InfoIcon, FormatBold, FormatItalic, FormatUnderlined, Add as AddIcon, AdsClick as AdsClickIcon, Cake as CakeIcon, CalendarMonth, CreditCard, Warning as WarningIcon, ContentCopy as ContentCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

import { VariableAccordion } from './VariableAccordion';
import { VariableButton } from './VariableButton';
import { communicationService } from '../../../../services/communication.service';
import { DescriptionOutlined as DescriptionOutlinedIcon } from '@mui/icons-material';


const MOCK_TEMPLATES = [
  { name: 'New Patient Text Welcome', type: 'sms', bodyText: 'Hello {Patient: Preferred Name}!\nWe are excited to meet you!\nTo ensure a smooth and efficient visit, please register your MyChart account and complete the medical and dental histories. To help you maximize your reserved time with us, this is needed 48 hours prior to your appointment.\nPlease text C to confirm.' },
  { name: 'Imaging patient reminder', type: 'email', subject: 'Upcoming Imaging Appointment', bodyText: 'This is a friendly reminder for your upcoming imaging appointment. Please arrive 15 minutes early.' },
  { name: 'Existing patient reminder', type: 'both', subject: 'Your Upcoming Appointment', bodyText: 'We are looking forward to seeing you at your upcoming appointment.' },
  { name: 'Post dental patient scheduled reminder', type: 'sms', bodyText: 'Reminder: You have a follow-up appointment scheduled after your recent dental procedure. Reply C to confirm.' },
  { name: 'Paperwork Reminder', type: 'email', subject: 'Important: Complete Your Paperwork', bodyText: 'Please remember to complete your digital paperwork before your visit to ensure a smooth check-in process.' },
  { name: 'Save the Date', type: 'email', subject: 'Save the Date', bodyText: 'Please save the date for your upcoming procedure. We will contact you shortly with the time.' },
  { name: 'Visit ID Reminder', type: 'sms', bodyText: 'Your Visit ID for your upcoming telehealth appointment is {Visit ID}. Please log in 5 minutes early.' },
  { name: '48 hour Notice Text', type: 'sms', bodyText: 'Reminder: Your appointment is in 48 hours. Please text C to confirm or call to reschedule.' },
  { name: 'Thank you for confirming Text', type: 'sms', bodyText: 'Thank you for confirming your appointment. We will see you soon!' },
  { name: 'Referral Request', type: 'email', subject: 'We would love your referral', bodyText: 'The highest compliment our patients can give us is the referral of their friends and family.' },
  { name: 'DOH Confirmation', type: 'email', subject: 'Department of Health Confirmation', bodyText: 'Your DOH screening has been successfully recorded.' },
  { name: 'Invitation: Treatment follow-up', type: 'email', subject: 'Treatment Follow-Up Invitation', bodyText: 'We would like to invite you to schedule a follow-up appointment for your recent treatment.' },
  { name: 'Patient reminder confirmation', type: 'sms', bodyText: 'Your appointment is confirmed. Thank you!' },
  { name: 'Unscheduled Treatment', type: 'sms', bodyText: 'We noticed you have an unscheduled treatment on your plan. Please call us to get scheduled.' },
];

export const GeneralEmailTextTemplates = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('sms'); // 'email' or 'sms'

  const activeTemplate = isCreating ? { name: '', bodyText: '', subject: '' } : MOCK_TEMPLATES[selectedTemplate];

  const welcomeSmsContent = `Hello {Patient: Preferred Name}!
We are excited to meet you!
To ensure a smooth and efficient visit, please register your MyChart account and complete the medical and dental histories. To help you maximize your reserved time with us, this is needed 48 hours prior to your appointment.
Please text C to confirm.`;

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTemplate(-1);
  };

  const handleSelectTemplate = (index) => {
    setIsCreating(false);
    setSelectedTemplate(index);
  };

  if (isCreating && selectedMethod === null) {
    return (
      <Box sx={{ p: 4, height: '100%', backgroundColor: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, pb: 2, borderBottom: '1px solid #eee' }}>
          <TextField 
            placeholder="Enter template title"
            variant="standard"
            sx={{ 
              width: '40%', 
              '& .MuiInput-input': { fontSize: '0.9rem', fontWeight: 600, color: '#334155' } 
            }}
            InputProps={{ disableUnderline: false }}
            autoFocus
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => setIsCreating(false)}
              sx={{ textTransform: 'none', color: '#64748b', borderColor: '#e2e8f0' }}
            >
              Cancel
            </Button>
            <Button size="small" variant="contained" sx={{ textTransform: 'none', backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}>Save</Button>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a3a6b', mb: 4 }}>Select communication method</Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Box 
              onClick={() => setSelectedMethod('email')}
              sx={{ 
                width: 200, 
                p: 4, 
                border: '2px solid', 
                borderColor: selectedMethod === 'email' ? '#4b71a1' : '#f1f5f9',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedMethod === 'email' ? '#f8fafc' : '#fff',
                '&:hover': { borderColor: '#4b71a1', backgroundColor: '#f8fafc' }
              }}
            >
              <EmailIcon sx={{ fontSize: 60, color: selectedMethod === 'email' ? '#4b71a1' : '#94a3b8', mb: 2 }} />
              <Typography sx={{ fontWeight: 600, color: '#334155' }}>Email</Typography>
            </Box>

            <Box 
              onClick={() => setSelectedMethod('sms')}
              sx={{ 
                width: 200, 
                p: 4, 
                border: '2px solid', 
                borderColor: selectedMethod === 'sms' ? '#4b71a1' : '#f1f5f9',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedMethod === 'sms' ? '#f8fafc' : '#fff',
                '&:hover': { borderColor: '#4b71a1', backgroundColor: '#f8fafc' }
              }}
            >
              <SmsIcon sx={{ fontSize: 60, color: selectedMethod === 'sms' ? '#4b71a1' : '#94a3b8', mb: 2 }} />
              <Typography sx={{ fontWeight: 600, color: '#334155' }}>SMS</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '12px', bgcolor: '#FFFFFF', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box sx={{ bgcolor: '#F2F6FC', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #E5E9F2' }}>
          <DescriptionOutlinedIcon sx={{ fontSize: '1.2rem', color: '#4472C4' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293b' }}>General Email & Text Templates</Typography>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#1E293B' }}>{template.name}</Typography>
                          {template.type === 'email' || template.type === 'both' ? <EmailIcon sx={{ fontSize: 14, color: '#64748b' }} /> : null}
                          {template.type === 'sms' || template.type === 'both' ? <SmsIcon sx={{ fontSize: 14, color: '#64748b' }} /> : null}
                        </Box>
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
              {/* Method Selector */}
              <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setSelectedMethod('sms')}>
                  <Box sx={{ 
                    width: 16, height: 16, borderRadius: '50%', border: '1px solid', borderColor: selectedMethod === 'sms' ? '#3B82F6' : '#E5E9F2', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {selectedMethod === 'sms' && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6' }} />}
                  </Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#1E293B' }}>Text Message</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setSelectedMethod('email')}>
                  <Box sx={{ 
                    width: 16, height: 16, borderRadius: '50%', border: '1px solid', borderColor: selectedMethod === 'email' ? '#3B82F6' : '#E5E9F2', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {selectedMethod === 'email' && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6' }} />}
                  </Box>
                  <Typography sx={{ fontSize: '0.85rem', color: '#1E293B' }}>Email</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Body</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={isCreating ? '' : activeTemplate?.bodyText || welcomeSmsContent}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      fontSize: '0.85rem', 
                      lineHeight: 1.6,
                      backgroundColor: '#fff'
                    } 
                  }}
                />
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>437 characters left</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>Please note that the characters count is inaccurate if template variables are used.</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>The system will automatically add the practice name and contact info to the end of your text message.</Typography>
                </Box>
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
            </VariableAccordion>

            <VariableAccordion title="Practice">
              <VariableButton label="Name" />
              <VariableButton label="Phone number" />
              <VariableButton label="Address" />
              <VariableButton label="Website" />
              <VariableButton label="Email address" />
              <VariableButton label="Services available" />
              <VariableButton label="Payment methods" />
              <VariableButton label="Working hours" />
            </VariableAccordion>
            
            <Box sx={{ p: 2, borderTop: '1px solid #E5E9F2' }}>
              <VariableButton label="Outstanding Balance" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
