import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  DeleteOutline as DeleteIcon,
  AttachFile as AttachFileIcon,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  ImageOutlined as ImageOutlinedIcon,
  Subject as SubjectIcon,
  MenuBook as BookIcon,
  PersonOutline as PersonIcon,
} from '@mui/icons-material';
import { VariableAccordion } from '../../components/admin/patient-communication/templates/VariableAccordion';
import { VariableButton } from '../../components/admin/patient-communication/templates/VariableButton';
import { communicationService } from '../../services/communication.service';

const RichTextToolbar = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, border: '1px solid #E5E9F2', borderBottom: 'none', p: 0.5, bgcolor: '#FBFCFE', flexWrap: 'wrap', borderRadius: '6px 6px 0 0' }}>
    <Box sx={{ p: 0.3, cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' }, borderRadius: 0.5 }}>
      <Typography sx={{ fontSize: '1rem', color: '#64748b', fontWeight: 700, px: 0.5 }}>↶</Typography>
    </Box>
    <Box sx={{ p: 0.3, cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' }, borderRadius: 0.5 }}>
      <Typography sx={{ fontSize: '1rem', color: '#64748b', fontWeight: 700, px: 0.5 }}>↷</Typography>
    </Box>
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#E5E9F2' }} />
    {[FormatBold, FormatItalic, FormatUnderlined, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify].map((Icon, i) => (
      <Box key={i} sx={{ p: 0.3, cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' }, borderRadius: 0.5 }}>
        <Icon sx={{ fontSize: '1rem', color: '#64748b' }} />
      </Box>
    ))}
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#E5E9F2' }} />
    <Typography sx={{ fontSize: '0.75rem', color: '#64748b', cursor: 'pointer', px: 0.5, fontWeight: 500 }}>Paragraph ▾</Typography>
    <Typography sx={{ fontSize: '0.75rem', color: '#64748b', cursor: 'pointer', px: 0.5, fontWeight: 500 }}>10pt ▾</Typography>
    <Typography sx={{ fontSize: '0.75rem', color: '#64748b', cursor: 'pointer', px: 0.5, fontWeight: 500 }}>Lato ▾</Typography>
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#E5E9F2' }} />
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'red' }}>A ▾</Typography></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>A ▾</Typography></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><LinkIcon sx={{ fontSize: '1rem', color: '#64748b' }} /></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><ImageIcon sx={{ fontSize: '1rem', color: '#64748b' }} /></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><BookIcon sx={{ fontSize: '1rem', color: '#64748b' }} /></Box>
  </Box>
);

const CampaignEditor = ({ open, title, campaign, onClose, onPreview }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let initSub = '';
    let initBody = '';
    
    if (campaign) {
      initSub = campaign.subject || campaign.name || '';
      initBody = campaign.body || campaign.bodyText || '';
    } else {
      initSub = 'BOTOX: Just $10/Unit + Bring a Friend Bonus!';
      initBody = `Botox Special: Save More When You Share!\n\nBotox Specials You'll Love. Starting October 1st!\nWe're making it easier than ever to look refreshed and feel confident this season.\n\nJust $10 per unit of Botox, bring a friend and you'll each receive $25 OFF your treatment!\n\nThis special runs October 1 through December 31, 2025- the perfect time to smooth fine lines before the holidays and start the new year looking refreshed!\n\nAppointments are limited!\n\nThank you,\nRobin\nFront Office Coordinator`;
    }
    
    setSubject(initSub);
    setBody(initBody);
    setInitialData({ subject: initSub, body: initBody });
  }, [campaign, open]);

  const currentData = { subject, body };
  const isDirty = initialData && JSON.stringify(initialData) !== JSON.stringify(currentData);

  const handleSave = async (status) => {
    // If saving as draft and nothing changed, block.
    // If changing status (e.g., scheduling a draft), allow even if text didn't change.
    if (!isDirty && status === 'Draft') return;
    
    try {
      setLoading(true);
      const payload = { subject, body, status };
      if (campaign && campaign.id) {
        await communicationService.updateCampaign(campaign.id, payload);
      } else {
        await communicationService.createCampaign(payload);
      }
      setInitialData(currentData);
      onClose();
    } catch (error) {
      console.error('Failed to save campaign', error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          maxHeight: '90vh'
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
            <SubjectIcon sx={{ fontSize: '20px', color: '#2563EB' }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ 
                fontFamily: 'Inter, sans-serif', 
                fontWeight: 600, 
                fontSize: '16px', 
                lineHeight: '24px', 
                letterSpacing: '-0.4px', 
                color: '#111' 
              }}>
                Edit Campaign
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, bgcolor: '#e0e7ff', borderRadius: 1 }}>
                <PersonIcon sx={{ fontSize: '12px', color: '#3B82F6' }} />
                <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#3B82F6' }}>Audience: Valentines 2025</Typography>
              </Box>
            </Box>
            <Typography sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 400, 
              fontSize: '11.5px', 
              lineHeight: '17.25px', 
              color: '#6B7280' 
            }}>
              {title}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#1E293B', bgcolor: '#F8FAFC' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: '32px !important', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          
          {/* Left Column (Editor) */}
          <Box sx={{ flex: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<AttachFileIcon />} 
              sx={{ textTransform: 'none', borderRadius: 1.5, mb: 3, color: '#64748b', borderColor: '#E5E9F2', fontWeight: 600, '&:hover': { borderColor: '#cbd5e1', bgcolor: '#F8FAFC' } }}
            >
              Add Attachment
            </Button>

            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5, color: '#1E293B' }}>Email Subject</Typography>
            <TextField 
              fullWidth 
              size="small" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { height: 40, fontSize: '0.85rem', borderRadius: 1.5, '& fieldset': { borderColor: '#E5E9F2' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} 
            />

            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5, color: '#1E293B' }}>Body</Typography>
            <RichTextToolbar />
            <TextField 
              fullWidth 
              multiline 
              rows={12} 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0 0 6px 6px', fontSize: '0.85rem', lineHeight: 1.6, '& fieldset': { borderColor: '#E5E9F2' } } }} 
            />
            <Typography sx={{ fontSize: '0.75rem', color: '#ef4444', mt: 1, display: 'inline-flex', alignItems: 'center', cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
              <DeleteIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} /> Remove Body
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Box sx={{ flex: 1, border: '1px dashed #cbd5e1', borderRadius: 2, py: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', bgcolor: '#F8FAFC', '&:hover': { bgcolor: '#F1F5F9' } }}>
                <ImageOutlinedIcon sx={{ fontSize: '1.2rem', color: '#64748b', mr: 1 }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Add Image</Typography>
              </Box>
              <Box sx={{ flex: 1, border: '1px dashed #cbd5e1', borderRadius: 2, py: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', bgcolor: '#F8FAFC', '&:hover': { bgcolor: '#F1F5F9' } }}>
                <SubjectIcon sx={{ fontSize: '1.2rem', color: '#64748b', mr: 1 }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Add Paragraph</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1, color: '#1E293B' }}>Include in email</Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel control={<Checkbox size="small" defaultChecked sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#3B82F6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#1E293B' }}>Header</Typography>} />
                <FormControlLabel control={<Checkbox size="small" defaultChecked sx={{ p: 0.5, color: '#cbd5e1', '&.Mui-checked': { color: '#3B82F6' } }} />} label={<Typography sx={{ fontSize: '0.85rem', color: '#1E293B' }}>Footer</Typography>} />
              </Box>
            </Box>
          </Box>

          {/* Right Column (Variables) */}
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
              <VariableButton label="Website" />
              <VariableButton label="Email address" />
            </VariableAccordion>

            <VariableAccordion title="Insurance">
              <VariableButton label="Carrier Name" />
              <VariableButton label="Group Number" />
            </VariableAccordion>
            
            <VariableAccordion title="Financial Account">
              <VariableButton label="Account Balance" />
              <VariableButton label="Last Payment Date" />
            </VariableAccordion>
          </Box>

        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: '#E5E9F2' }} />
      <DialogActions sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose}
          variant="outlined" 
          sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b', borderColor: '#E5E9F2', borderRadius: 1.5, px: 3, py: 1, '&:hover': { bgcolor: '#F8FAFC', borderColor: '#cbd5e1' } }}
        >
          Cancel
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button 
            variant="outlined" 
            onClick={() => onPreview({ subject, body })}
            sx={{ textTransform: 'none', fontWeight: 600, color: '#3B82F6', borderColor: '#3B82F6', borderRadius: 1.5, px: 3, py: 1, '&:hover': { bgcolor: '#F0F5FF', borderColor: '#2563EB' } }}
          >
            Preview
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleSave('Draft')}
            disabled={loading || !isDirty}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#3B82F6', borderRadius: 1.5, px: 3, py: 1, boxShadow: 'none', '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } }}
          >
            Save Draft
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleSave('Sent')}
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#10B981', borderRadius: 1.5, px: 3, py: 1, boxShadow: 'none', '&:hover': { bgcolor: '#059669', boxShadow: 'none' } }}
          >
            Schedule Campaign
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignEditor;
