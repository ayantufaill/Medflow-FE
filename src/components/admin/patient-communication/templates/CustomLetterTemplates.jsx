import React, { useState, useEffect } from 'react';

import { DescriptionOutlined as DescriptionOutlinedIcon } from '@mui/icons-material';
import {
  Box, Typography, TextField, Button, IconButton, Divider, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Sync as SyncIcon, SwapVert as SortIcon
} from '@mui/icons-material';
import DeleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';

import { VariablesSidebar } from './VariablesSidebar';
import { communicationService } from '../../../../services/communication.service';

export const CustomLetterTemplates = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [initialData, setInitialData] = useState(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await communicationService.getTemplates(4);
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
    if (!tpl) {
      setDescription('');
      setSubject('');
      setBodyText('');
      setInitialData({ description: '', subject: '', bodyText: '' });
      return;
    }
    const initDesc = tpl.description || '';
    const initSub = tpl.subject || '';
    const initBody = tpl.bodyText || '';
    setDescription(initDesc);
    setSubject(initSub);
    setBodyText(initBody);
    setInitialData({ description: initDesc, subject: initSub, bodyText: initBody });
  };

  const handleSelectTemplate = (index) => {
    setSelectedTemplate(index);
    populateForm(templates[index]);
  };

  const currentData = { description, subject, bodyText };
  const isDirty = initialData && JSON.stringify(initialData) !== JSON.stringify(currentData);

  const handleSave = async () => {
    if (!isDirty) return;
    try {
      const data = { description, subject, bodyText, templateType: 4 };
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

  return (
    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '12px', bgcolor: '#FFFFFF', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box sx={{ bgcolor: '#F2F6FC', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #E5E9F2' }}>
          <DescriptionOutlinedIcon sx={{ fontSize: '1.2rem', color: '#4472C4' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293b' }}>Custom Letter Templates</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Left List */}
          <Box sx={{ width: 350, flexShrink: 0, borderRight: '1px solid #E5E9F2', overflowY: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="input" type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} sx={{ width: 14, height: 14, cursor: 'pointer' }} />
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
                      <ListItem button onClick={() => handleSelectTemplate(index)} sx={{ mx: 2, px: 2, py: 1.2, mb: 0.5, borderRadius: '6px', cursor: 'pointer', bgcolor: selectedTemplate === index ? '#F0F5FF' : 'transparent', '&:hover': { bgcolor: selectedTemplate === index ? '#F0F5FF' : '#F8FAFC' }, transition: 'all 0.15s', borderLeft: selectedTemplate === index ? '4px solid #3B82F6' : '4px solid transparent' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#1E293B', flexGrow: 1 }}>{template.description}</Typography>
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
            {templates.length === 0 ? (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBFCFE' }}>
                <Typography color="text.secondary">Select a template or create a new one to begin</Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ p: 2, borderBottom: '1px solid #E5E9F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField placeholder="Enter template title" variant="standard" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ width: '60%', '& .MuiInput-input': { fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' } }} InputProps={{ disableUnderline: false }} />
              <Button size="small" variant="contained" onClick={handleSave} disabled={!isDirty} sx={{ textTransform: 'none', backgroundColor: '#22C55E', '&:hover': { backgroundColor: '#16A34A' } }}>Save</Button>
            </Box>

            <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Subject / Title</Typography>
                <TextField fullWidth size="small" value={subject} onChange={(e) => setSubject(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { fontSize: '0.85rem', borderColor: '#E5E9F2', borderRadius: '6px' } }} />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Body</Typography>
                <TextField fullWidth multiline rows={15} value={bodyText} onChange={(e) => setBodyText(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem', lineHeight: 1.6, borderColor: '#E5E9F2', borderRadius: '6px' } }} />
              </Box>

              <Box sx={{ display: 'flex', gap: 8 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 2 }}>Signature</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {['Guardian', 'Patient', 'Doctor', 'Witness', 'Office', 'Other'].map(sig => (
                      <Box key={sig} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box component="input" type="checkbox" sx={{ width: 14, height: 14 }} />
                        <Typography sx={{ fontSize: '0.8rem', color: '#1E293B' }}>{sig}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 2 }}>Include In</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {['Update Request', 'New Patient Request'].map(inc => (
                      <Box key={inc} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box component="input" type="checkbox" sx={{ width: 14, height: 14 }} />
                        <Typography sx={{ fontSize: '0.8rem', color: '#1E293B' }}>{inc}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
              </>
            )}
          </Box>

          {/* Right Sidebar */}
          <VariablesSidebar templateInfo={{ name: description }} />
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
