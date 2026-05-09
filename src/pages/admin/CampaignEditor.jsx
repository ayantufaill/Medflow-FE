import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  Checkbox,
  FormControlLabel,
  Collapse,
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
  Add as AddIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ImageOutlined as ImageOutlinedIcon,
  Subject as SubjectIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';

const RichTextToolbar = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, border: '1px solid #ccc', borderBottom: 'none', p: 0.5, bgcolor: '#fafafa', flexWrap: 'wrap', borderRadius: '4px 4px 0 0' }}>
    <Box sx={{ p: 0.3, cursor: 'pointer', '&:hover': { bgcolor: '#eee' }, borderRadius: 0.5 }}>
      <Typography sx={{ fontSize: '1rem', color: '#555', fontWeight: 700, px: 0.5 }}>↶</Typography>
    </Box>
    <Box sx={{ p: 0.3, cursor: 'pointer', '&:hover': { bgcolor: '#eee' }, borderRadius: 0.5 }}>
      <Typography sx={{ fontSize: '1rem', color: '#555', fontWeight: 700, px: 0.5 }}>↷</Typography>
    </Box>
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
    {[FormatBold, FormatItalic, FormatUnderlined, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify].map((Icon, i) => (
      <Box key={i} sx={{ p: 0.3, cursor: 'pointer', '&:hover': { bgcolor: '#eee' }, borderRadius: 0.5 }}>
        <Icon sx={{ fontSize: '1rem', color: '#555' }} />
      </Box>
    ))}
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
    <Typography sx={{ fontSize: '0.75rem', color: '#555', cursor: 'pointer', px: 0.5 }}>Paragraph ▾</Typography>
    <Typography sx={{ fontSize: '0.75rem', color: '#555', cursor: 'pointer', px: 0.5 }}>10pt ▾</Typography>
    <Typography sx={{ fontSize: '0.75rem', color: '#555', cursor: 'pointer', px: 0.5 }}>Lato ▾</Typography>
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'red' }}>A ▾</Typography></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>A ▾</Typography></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><LinkIcon sx={{ fontSize: '1rem', color: '#555' }} /></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><ImageIcon sx={{ fontSize: '1rem', color: '#555' }} /></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><BookIcon sx={{ fontSize: '1rem', color: '#555' }} /></Box>
  </Box>
);

const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ borderBottom: '1px solid #eee' }}>
      <Box 
        onClick={() => setOpen(!open)}
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, cursor: 'pointer', '&:hover': { bgcolor: '#f9f9f9' } }}
      >
        <Typography sx={{ fontSize: '0.8rem', color: '#333' }}>{title}</Typography>
        {open ? <KeyboardArrowUp fontSize="small" sx={{ color: '#999' }}/> : <KeyboardArrowDown fontSize="small" sx={{ color: '#999' }}/>}
      </Box>
      <Collapse in={open}>
        <Box sx={{ p: 1.5, pt: 0 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

const CampaignEditor = ({ mode, title, onCancel, onPreview }) => {
  const isTemplate = mode === 'template';

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Top Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 1.5, borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
        <Button variant="outlined" onClick={onCancel} sx={{ textTransform: 'none', borderRadius: 5, color: '#555', borderColor: '#ccc', px: 3 }}>
          Cancel
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 700, color: '#1a3a6b', fontSize: '1.1rem' }}>{title}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {!isTemplate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
              <PersonIcon sx={{ fontSize: '1.2rem', color: '#1a3a6b' }} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a3a6b' }}>Audience: Valentines 2025</Typography>
            </Box>
          )}
          <Button variant="outlined" onClick={onPreview} sx={{ textTransform: 'none', borderRadius: 5, color: '#1a3a6b', borderColor: '#1a3a6b', px: 3, py: 0.5 }}>
            Preview
          </Button>
          <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 5, bgcolor: '#4caf50', px: 3, py: 0.5, '&:hover': { bgcolor: '#388e3c' } }}>
            Save ▾
          </Button>
          <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 5, bgcolor: '#1976d2', px: 3, py: 0.5, '&:hover': { bgcolor: '#115293' } }}>
            Send Test
          </Button>
          {isTemplate ? (
            <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 5, bgcolor: '#4caf50', px: 3, py: 0.5, '&:hover': { bgcolor: '#388e3c' } }}>
              Copy From Template
            </Button>
          ) : (
            <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 5, bgcolor: '#78909c', px: 3, py: 0.5, '&:hover': { bgcolor: '#546e7a' } }}>
              Schedule Campaign
            </Button>
          )}
          <IconButton size="small" sx={{ ml: 1 }}>
            <DeleteIcon sx={{ color: '#999' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Main Layout */}
      <Box sx={{ display: 'flex', p: 3, gap: 4 }}>
        
        {/* Left Column (Editor) */}
        <Box sx={{ flex: 1 }}>
          <Button variant="outlined" startIcon={<AttachFileIcon />} sx={{ textTransform: 'none', borderRadius: 5, mb: 3, color: '#1a3a6b', borderColor: '#ccc' }}>
            Add Attachment
          </Button>

          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Email Subject</Typography>
          <TextField 
            fullWidth 
            size="small" 
            defaultValue="BOTOX: Just $10/Unit + Bring a Friend Bonus!"
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem' } }} 
          />

          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Body</Typography>
          <RichTextToolbar />
          <TextField 
            fullWidth 
            multiline 
            rows={12} 
            defaultValue={`Botox Special: Save More When You Share!\n\nBotox Specials You'll Love. Starting October 1st!\nWe're making it easier than ever to look refreshed and feel confident this season.\n\nJust $10 per unit of Botox, bring a friend and you'll each receive $25 OFF your treatment!\n\nThis special runs October 1 through December 31, 2025- the perfect time to smooth fine lines before the holidays and start the new year looking refreshed!\n\nAppointments are limited!\n\nThank you,\nRobin\nFront Office Coordinator`}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0 0 4px 4px', fontSize: '0.85rem', lineHeight: 1.6 } }} 
          />
          <Typography sx={{ fontSize: '0.75rem', color: '#f44336', mt: 0.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <DeleteIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} /> Remove
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Box sx={{ flex: 1, border: '1px dashed #ccc', borderRadius: 1, py: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f9f9f9' } }}>
              <ImageOutlinedIcon sx={{ fontSize: '1.2rem', color: '#555', mr: 1 }} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Add Image</Typography>
            </Box>
            <Box sx={{ flex: 1, border: '1px dashed #ccc', borderRadius: 1, py: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f9f9f9' } }}>
              <SubjectIcon sx={{ fontSize: '1.2rem', color: '#555', mr: 1 }} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Add Paragraph</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1 }}>Include in email</Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <FormControlLabel control={<Checkbox size="small" defaultChecked sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: '0.85rem' }}>Header</Typography>} />
              <FormControlLabel control={<Checkbox size="small" defaultChecked sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: '0.85rem' }}>Footer</Typography>} />
            </Box>
          </Box>
        </Box>

        {/* Right Column (Variables) */}
        <Box sx={{ width: 300, border: '1px solid #e0e0e0', borderRadius: 1, alignSelf: 'flex-start' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>Variables</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#999', border: '1px solid #ccc', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</Typography>
          </Box>
          
          <Box sx={{ bgcolor: '#fafafa', p: 1.5, borderBottom: '1px solid #e0e0e0' }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Patient</Typography>
          </Box>
          <AccordionItem title="General Information" />
          <AccordionItem title="Insurance" />
          <AccordionItem title="Financial Account" />
          <AccordionItem title="Appointments" />
          <AccordionItem title="Parent Information" />

          <Box sx={{ bgcolor: '#fafafa', p: 1.5, borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0', mt: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Provider</Typography>
          </Box>

          <Box sx={{ bgcolor: '#fafafa', p: 1.5, borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0', mt: 2 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Practice</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            {['Phone number', 'Address', 'Website', 'Email address', 'Services available', 'Payment methods', 'Working hours'].map(item => (
              <Box key={item} sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: '#f0f4f8', color: '#1a3a6b', px: 1.5, py: 0.5, borderRadius: 5, mb: 1, mr: 1, cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '0.75rem', mr: 0.5 }}>{item}</Typography>
                <AddIcon sx={{ fontSize: '0.8rem' }} />
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

// Also need the PersonIcon for Audience
import { PersonOutline as PersonIcon } from '@mui/icons-material';

export default CampaignEditor;
