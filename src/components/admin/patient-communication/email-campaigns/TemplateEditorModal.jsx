import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, Email as EmailIcon, FormatBold, FormatItalic, FormatUnderlined, FormatAlignLeft, FormatAlignCenter, FormatAlignRight } from '@mui/icons-material';
import { VariableAccordion } from '../templates/VariableAccordion';
import { VariableButton } from '../templates/VariableButton';

const RichTextToolbar = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: '1px solid #E5E9F2', borderBottom: 'none', p: 0.5, bgcolor: '#FBFCFE', borderRadius: '6px 6px 0 0' }}>
    {[FormatBold, FormatItalic, FormatUnderlined, FormatAlignLeft, FormatAlignCenter, FormatAlignRight].map((Icon, i) => (
      <IconButton key={i} size="small" sx={{ color: '#64748b', '&:hover': { bgcolor: '#F0F5FF', color: '#3B82F6' } }}>
        <Icon sx={{ fontSize: '1.1rem' }} />
      </IconButton>
    ))}
  </Box>
);

const TemplateEditorModal = ({ open, onClose, templateName }) => {
  const defaultBody = `Hi {Patient: First Name},\n\nWe wanted to remind you about our Membership Plan which can save you up to 20% on all treatments!\n\nIf you have any questions, feel free to contact us.\n\nBest,\nThe Team at Medflow`;
  const [subject, setSubject] = useState(templateName || 'Membership Plan');
  const [body, setBody] = useState(defaultBody);
  const [initialData, setInitialData] = useState({ subject: templateName || 'Membership Plan', body: defaultBody });

  React.useEffect(() => {
    if (open) {
      const initSub = templateName || 'Membership Plan';
      setSubject(initSub);
      setBody(defaultBody);
      setInitialData({ subject: initSub, body: defaultBody });
    }
  }, [open, templateName]);

  const currentData = { subject, body };
  const isDirty = initialData && JSON.stringify(initialData) !== JSON.stringify(currentData);
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        py: 2, 
        px: 3,
        bgcolor: '#F3F8FD',
        borderBottom: '1px solid #E5E9F2',
        m: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Icon badge */}
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px', backgroundColor: '#e2ebfc',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <EmailIcon sx={{ fontSize: '20px', color: '#2563EB' }} />
          </Box>
          <Box>
            <Typography sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 600, 
              fontSize: '16px', 
              lineHeight: '24px', 
              letterSpacing: '-0.4px', 
              color: '#111' 
            }}>
              Edit Template
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 400, 
              fontSize: '11.5px', 
              lineHeight: '17.25px', 
              color: '#6B7280' 
            }}>
              {templateName}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#1E293B', bgcolor: '#F8FAFC' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, pt: '32px !important', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Editor Area */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>Template Subject</Typography>
            <TextField 
              fullWidth 
              size="small" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { height: 40, fontSize: '0.85rem', borderRadius: 1.5, '& fieldset': { borderColor: '#E5E9F2' } } }} 
            />

            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>Body</Typography>
            <RichTextToolbar />
            <TextField 
              fullWidth 
              multiline 
              rows={12} 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0 0 6px 6px', fontSize: '0.85rem', lineHeight: 1.6, '& fieldset': { borderColor: '#E5E9F2' } } }} 
            />
          </Box>
          {/* Variables Sidebar */}
          <Box sx={{ width: 250, border: '1px solid #E5E9F2', borderRadius: 2, alignSelf: 'flex-start', bgcolor: '#FBFCFE', overflow: 'hidden' }}>
            <Box sx={{ p: 1.5, borderBottom: '1px solid #E5E9F2', bgcolor: '#F8FAFC' }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>Variables</Typography>
            </Box>
            <VariableAccordion title="Patient" defaultExpanded>
              <VariableButton label="First Name" />
              <VariableButton label="Last Name" />
              <VariableButton label="Date of Birth" />
              <VariableButton label="Next Appointment" />
            </VariableAccordion>
            
            <VariableAccordion title="Practice">
              <VariableButton label="Practice Name" />
              <VariableButton label="Phone Number" />
              <VariableButton label="Address" />
            </VariableAccordion>
          </Box>
        </Box>
      </DialogContent>
      
      <Divider sx={{ borderColor: '#E5E9F2' }} />
      <DialogActions sx={{ p: 2.5, px: 3, gap: 1 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b', borderColor: '#E5E9F2', borderRadius: 1.5, '&:hover': { bgcolor: '#F8FAFC', borderColor: '#cbd5e1' } }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          disabled={!isDirty}
          sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#3B82F6', borderRadius: 1.5, boxShadow: 'none', '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateEditorModal;
