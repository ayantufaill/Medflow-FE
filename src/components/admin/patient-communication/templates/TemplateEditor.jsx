import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Email as EmailIcon, Sms as SmsIcon } from '@mui/icons-material';
import EditSvg from '../../../../assets/practicesetupicon/editicon.svg';
import DeleteSvg from '../../../../assets/practicesetupicon/deleteicon.svg';

export const TemplateEditor = ({ selectedTemplate, templateInfo, onSave, onDelete }) => {
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [type, setType] = useState('email'); // 'email' or 'text'
  const [initialData, setInitialData] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (templateInfo) {
      const initDesc = templateInfo.name || templateInfo.description || '';
      const initSub = templateInfo.subject || '';
      const initBody = templateInfo.bodyText || '';
      const initType = templateInfo.type || 'email';
      
      setDescription(initDesc);
      setSubject(initSub);
      setBodyText(initBody);
      setType(initType);
      
      setInitialData({
        description: initDesc,
        subject: initSub,
        bodyText: initBody,
        type: initType
      });
    }
  }, [templateInfo]);

  const currentData = { description, subject: type === 'email' ? subject : '', bodyText, type };
  // the currentData logic needs to match what happens when we compare. 
  // Wait, if type is 'text', subject is ignored. Let's just compare what's currently in state.
  const currentRawData = { description, subject, bodyText, type };
  const isDirty = initialData && JSON.stringify(initialData) !== JSON.stringify(currentRawData);

  const handleSave = () => {
    if (!isDirty) return;
    onSave({ description, subject: type === 'email' ? subject : '', bodyText, type });
  };

  const handleDelete = () => {
    onDelete(templateInfo._id);
    setDeleteConfirmOpen(false);
  };



  if (!templateInfo) {
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBFCFE' }}>
        <Typography color="text.secondary">Select a template or create a new one to begin</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FBFCFE', overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #E5E9F2', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
      }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>
              {description}
            </Typography>
            <IconButton size="small"><img src={EditSvg} alt="edit" width="16" height="16" /></IconButton>
            <IconButton size="small" onClick={() => setDeleteConfirmOpen(true)}><img src={DeleteSvg} alt="delete" width="16" height="16" /></IconButton>
          </Box>
        <Button size="small" variant="contained" onClick={handleSave} disabled={!isDirty} sx={{ textTransform: 'none', backgroundColor: '#22C55E', '&:hover': { backgroundColor: '#16A34A' } }}>Save</Button>
      </Box>

      <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
        {/* Method Selector */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setType('text')}>
            <Box sx={{ 
              width: 16, height: 16, borderRadius: '50%', border: '1px solid', borderColor: type === 'text' ? '#3B82F6' : '#E5E9F2', 
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {type === 'text' && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6' }} />}
            </Box>
            <Typography sx={{ fontSize: '0.85rem', color: '#1E293B' }}>Text Message</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => setType('email')}>
            <Box sx={{ 
              width: 16, height: 16, borderRadius: '50%', border: '1px solid', borderColor: type === 'email' ? '#3B82F6' : '#E5E9F2', 
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {type === 'email' && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6' }} />}
            </Box>
            <Typography sx={{ fontSize: '0.85rem', color: '#1E293B' }}>Email</Typography>
          </Box>
        </Box>

        {type === 'email' && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Subject</Typography>
            <TextField 
              fullWidth 
              size="small" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { fontSize: '0.85rem', borderColor: '#E5E9F2', borderRadius: '6px', backgroundColor: '#FFFFFF' } }}
            />
          </Box>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>Body</Typography>
          <TextField
            fullWidth
            multiline
            rows={12}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                fontSize: '0.85rem', 
                lineHeight: 1.6,
                backgroundColor: '#FFFFFF',
                borderColor: '#E5E9F2', 
                borderRadius: '6px'
              } 
            }}
          />
          {type === 'text' && (
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>Please note that the characters count is inaccurate if template variables are used.</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>The system will automatically add the practice name and contact info to the end of your text message.</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 8, mb: 2 }}>
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