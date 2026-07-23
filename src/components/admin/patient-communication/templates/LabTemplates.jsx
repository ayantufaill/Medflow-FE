import React, { useState, useEffect } from 'react';

import { DescriptionOutlined as DescriptionOutlinedIcon } from '@mui/icons-material';
import {
  Box, Typography, TextField, Button, IconButton, Divider, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Sync as SyncIcon, SwapVert as SortIcon, Edit as EditIcon, Delete as DeleteIcon
} from '@mui/icons-material';

import { VariableAccordion } from './VariableAccordion';
import { VariableButton } from './VariableButton';
import { communicationService } from '../../../../services/communication.service';

const MOCK_TEMPLATES = [
  { description: 'Crown Fabrication', bodyText: 'Please fabricate a full coverage crown for tooth {Tooth Number} using zirconia. Shade A2.' },
  { description: 'Denture Repair', bodyText: 'Please repair the fractured acrylic base on the maxillary denture. Patient needs it rushed.' },
  { description: 'Nightguard', bodyText: 'Please fabricate a hard/soft nightguard for the maxillary arch.' },
  { description: 'Orthodontic Retainer', bodyText: 'Please fabricate an Essix retainer for the mandibular arch.' },
];

export const LabTemplates = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(-1);
  const [isCreating, setIsCreating] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setTemplates(MOCK_TEMPLATES);
      if (MOCK_TEMPLATES.length > 0 && !isCreating && selectedTemplate === -1) {
        // optionally select first one, or leave as -1
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
    setDescription(tpl.description || '');
    setSubject(tpl.subject || '');
    setBodyText(tpl.bodyText || '');
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTemplate(-1);
    setDescription('New Lab Template');
    setSubject('');
    setBodyText('');
  };

  const handleSelectTemplate = (index) => {
    setIsCreating(false);
    setSelectedTemplate(index);
    populateForm(templates[index]);
  };

  const handleSave = async () => {
    try {
      const data = { description, subject, bodyText, templateType: 5 };
      if (isCreating) {
        await communicationService.createTemplate(data);
        setIsCreating(false);
        setSelectedTemplate(0); // Optional: would need to fetch then set to matching index
      } else {
        const tpl = templates[selectedTemplate];
        if (tpl && tpl._id) {
          await communicationService.updateTemplate(tpl._id, data);
        }
      }
      fetchTemplates();
    } catch (err) {
      console.error('Failed to save', err);
    }
  };

  const handleDelete = async () => {
    try {
      const tpl = templates[selectedTemplate];
      if (tpl && tpl._id) {
        await communicationService.deleteTemplate(tpl._id);
        setDeleteConfirmOpen(false);
        setSelectedTemplate(-1);
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
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293b' }}>Lab Templates</Typography>
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
                <Button variant="contained" size="small" onClick={handleCreateNew} sx={{ textTransform: 'none', backgroundColor: '#3B82F6', borderRadius: '16px', px: 2, fontSize: '0.7rem', '&:hover': { backgroundColor: '#2563EB' } }}>
                  + Create New Form
                </Button>
              </Box>

              <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '4px', overflow: 'hidden' }}>
                <Box sx={{ p: 1.5, backgroundColor: '#FBFCFE', borderBottom: '1px solid #E5E9F2', display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 1 }}>
                    Template Title <SortIcon sx={{ fontSize: 16 }} />
                  </Typography>
                </Box>
                {templates.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>No templates found</Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {templates.map((template, index) => (
                      <React.Fragment key={template._id}>
                        <ListItem button onClick={() => handleSelectTemplate(index)} sx={{ mx: 2, px: 2, py: 1.2, mb: 0.5, borderRadius: '6px', cursor: 'pointer', bgcolor: selectedTemplate === index ? '#F0F5FF' : 'transparent', '&:hover': { bgcolor: selectedTemplate === index ? '#F0F5FF' : '#F8FAFC' }, transition: 'all 0.15s', borderLeft: selectedTemplate === index ? '4px solid #3B82F6' : '4px solid transparent' }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#1E293B', flexGrow: 1 }}>{template.description}</Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" sx={{ color: '#3B82F6' }}><SyncIcon sx={{ fontSize: 16 }} /></IconButton>
                            <IconButton size="small" sx={{ color: '#94a3b8' }} onClick={(e) => { e.stopPropagation(); handleSelectTemplate(index); setDeleteConfirmOpen(true); }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                          </Box>
                        </ListItem>
                        {index < templates.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </Box>
          </Box>

          {/* Center Editor */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FBFCFE' }}>
            {isCreating || selectedTemplate !== -1 ? (
              <>
                <Box sx={{ p: 2, borderBottom: '1px solid #E5E9F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TextField placeholder="Enter template title *" variant="standard" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ width: '60%', '& .MuiInput-input': { fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' } }} InputProps={{ disableUnderline: false }} autoFocus={isCreating} />
                  <Button size="small" variant="contained" onClick={handleSave} sx={{ textTransform: 'none', backgroundColor: '#22C55E', '&:hover': { backgroundColor: '#16A34A' } }}>Save</Button>
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
                </Box>
              </>
            ) : (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBFCFE' }}>
                <Typography color="text.secondary">Select a template or create a new one to begin</Typography>
              </Box>
            )}
          </Box>

          {/* Right Sidebar */}
          {(isCreating || selectedTemplate !== -1) && (
            <Box sx={{ width: 250, flexShrink: 0, borderLeft: '1px solid #E5E9F2', backgroundColor: '#FBFCFE', height: '100%', overflowY: 'auto' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #E5E9F2' }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>Variables</Typography>
              </Box>

              <VariableAccordion title="Patient" defaultExpanded>
                <VariableButton label="General Information" />
                <VariableButton label="Insurance" />
              </VariableAccordion>
            </Box>
          )}
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
