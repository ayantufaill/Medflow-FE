import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Divider, List, ListItem, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Tabs, Tab } from '@mui/material';
import { Sync as SyncIcon, SwapVert as SortIcon, Email as EmailIcon, Sms as SmsIcon, Settings, ChevronRight, InfoOutlined as InfoIcon, FormatBold, FormatItalic, FormatUnderlined, Add as AddIcon, AdsClick as AdsClickIcon, Cake as CakeIcon, CalendarMonth, CreditCard, Warning as WarningIcon, ContentCopy as ContentCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import EditSvg from '../../../../assets/practicesetupicon/editicon.svg';
import DeleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';

import { VariableAccordion } from './VariableAccordion';
import { VariableButton } from './VariableButton';
import { communicationService } from '../../../../services/communication.service';
import { DescriptionOutlined as DescriptionOutlinedIcon } from '@mui/icons-material';

export const GeneralEmailTextTemplates = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('sms'); // 'email' or 'sms'

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [initialData, setInitialData] = useState(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getTemplates(2);
      setTemplates(data || []);
      if (data && data.length > 0) {
        populateForm(data[selectedTemplate] || data[0]);
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

  const populateForm = (tpl) => {
    const initDesc = tpl.description || tpl.name || '';
    const initSub = tpl.subject || '';
    const initBody = tpl.bodyText || '';
    const initMethod = tpl.type === 'email' ? 'email' : 'sms';
    
    setDescription(initDesc);
    setSubject(initSub);
    setBodyText(initBody);
    setSelectedMethod(initMethod);
    setInitialData({ description: initDesc, subject: initSub, bodyText: initBody, method: initMethod });
  };

  const handleSelectTemplate = (index) => {
    setSelectedTemplate(index);
    populateForm(templates[index]);
  };

  const currentData = { description, subject, bodyText, method: selectedMethod };
  const isDirty = initialData && JSON.stringify(initialData) !== JSON.stringify(currentData);

  const handleSave = async () => {
    if (!isDirty) return;
    try {
      const data = { description, subject, bodyText, templateType: 2, type: selectedMethod };
      const tpl = templates[selectedTemplate];
      if (tpl && tpl.id) {
        await communicationService.updateTemplate(tpl.id, data);
        fetchTemplates();
      }
    } catch (err) {
      console.error('Failed to save', err);
    }
  };

  const handleDelete = async () => {
    try {
      const tpl = templates[selectedTemplate];
      if (tpl && tpl.id) {
        await communicationService.deleteTemplate(tpl.id);
        setDeleteConfirmOpen(false);
        setSelectedTemplate(0);
        fetchTemplates();
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const activeTemplate = templates[selectedTemplate];

  const welcomeSmsContent = `Hello {Patient: Preferred Name}!
We are excited to meet you!
To ensure a smooth and efficient visit, please register your MyChart account and complete the medical and dental histories. To help you maximize your reserved time with us, this is needed 48 hours prior to your appointment.
Please text C to confirm.`;

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
              </Box>

              <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '4px', overflow: 'hidden' }}>
                <Box sx={{ p: 1.5, backgroundColor: '#FBFCFE', borderBottom: '1px solid #E5E9F2', display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 1 }}>
                    Template Title <SortIcon sx={{ fontSize: 16 }} />
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {templates.map((template, index) => (
                    <React.Fragment key={template.id || index}>
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
                          <Typography sx={{ fontSize: '0.8rem', color: '#1E293B' }}>{template.description || template.name}</Typography>
                          {template.type === 'email' || template.type === 'both' ? <EmailIcon sx={{ fontSize: 14, color: '#64748b' }} /> : null}
                          {template.type === 'sms' || template.type === 'both' ? <SmsIcon sx={{ fontSize: 14, color: '#64748b' }} /> : null}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" sx={{ color: '#3B82F6' }}><SyncIcon sx={{ fontSize: 16 }} /></IconButton>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleSelectTemplate(index); setDeleteConfirmOpen(true); }}><img src={DeleteSvg} alt="delete" width="16" height="16" /></IconButton>
                        </Box>
                      </ListItem>
                      {index < templates.length - 1 && <Divider />}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                  {activeTemplate?.description || activeTemplate?.name}
                </Typography>
                <IconButton size="small"><img src={EditSvg} alt="edit" width="16" height="16" /></IconButton>
                <IconButton size="small" onClick={() => setDeleteConfirmOpen(true)}><img src={DeleteSvg} alt="delete" width="16" height="16" /></IconButton>
              </Box>
              <Button size="small" variant="contained" onClick={handleSave} disabled={!isDirty} sx={{ textTransform: 'none', backgroundColor: '#22C55E', '&:hover': { backgroundColor: '#16A34A' } }}>Save</Button>
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
                  value={bodyText || welcomeSmsContent}
                  onChange={(e) => setBodyText(e.target.value)}
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
      
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>Are you sure you want to delete this template?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

