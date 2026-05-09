import { useState } from 'react';
import {
  Box, Typography, Button, Radio, RadioGroup, FormControlLabel, Checkbox, TextField, Divider, Link,
} from '@mui/material';
import {
  FormatBold, FormatItalic, FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
  FormatAlignJustify, FormatListBulleted, FormatListNumbered, Link as LinkIcon, Image as ImageIcon,
} from '@mui/icons-material';

const SectionHeader = ({ title }) => (
  <Box sx={{ bgcolor: '#1a3a6b', color: '#fff', px: 2, py: 0.8, borderRadius: '4px 4px 0 0', mb: 0, fontWeight: 700, fontSize: '0.85rem' }}>
    {title}
  </Box>
);

const RichTextToolbar = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, border: '1px solid #ccc', borderBottom: 'none', p: 0.5, bgcolor: '#fafafa', flexWrap: 'wrap' }}>
    {[FormatBold, FormatItalic, FormatAlignLeft, FormatAlignCenter, FormatAlignJustify].map((Icon, i) => (
      <Box key={i} sx={{ p: 0.3, cursor: 'pointer', '&:hover': { bgcolor: '#eee' }, borderRadius: 0.5 }}>
        <Icon sx={{ fontSize: '1rem', color: '#555' }} />
      </Box>
    ))}
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
    <Typography sx={{ fontSize: '0.72rem', color: '#555', cursor: 'pointer', px: 0.5 }}>Paragraph ▾</Typography>
    <Typography sx={{ fontSize: '0.72rem', color: '#555', cursor: 'pointer', px: 0.5 }}>10pt ▾</Typography>
    <Typography sx={{ fontSize: '0.72rem', color: '#555', cursor: 'pointer', px: 0.5 }}>Lato ▾</Typography>
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'red' }}>A</Typography></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><ImageIcon sx={{ fontSize: '1rem', color: '#555' }} /></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><LinkIcon sx={{ fontSize: '1rem', color: '#555' }} /></Box>
  </Box>
);

const EmailTemplateSettings = () => {
  const [bodyAlign, setBodyAlign] = useState('Center');
  const [logoAlign, setLogoAlign] = useState('Center');
  const [footerAlign, setFooterAlign] = useState('Center');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#222' }}>Email Template Settings</Typography>
        <Button variant="contained" sx={{ bgcolor: '#2e7d32', textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3, '&:hover': { bgcolor: '#1b5e20' } }}>Preview</Button>
      </Box>

      {/* ── General Section ── */}
      <Box sx={{ border: '1px solid #ddd', borderRadius: 1, mb: 3 }}>
        <SectionHeader title="General" />
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>Template Color *</Typography>
              <Box sx={{ width: 32, height: 32, bgcolor: '#333', borderRadius: 0.5, border: '1px solid #ccc', cursor: 'pointer' }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>Body Alignment</Typography>
              <RadioGroup row value={bodyAlign} onChange={(e) => setBodyAlign(e.target.value)}>
                <FormControlLabel value="Left" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Left</Typography>} />
                <FormControlLabel value="Center" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Center</Typography>} />
              </RadioGroup>
            </Box>
          </Box>

          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 1.5 }}>What to include in emails from your office:</Typography>
          <Box sx={{ display: 'flex', gap: 6 }}>
            <Box>
              {['Practice Logo', 'Practice Name', 'Address', 'Email', 'Phone Number', 'Working Hours'].map(item => (
                <FormControlLabel key={item} control={<Checkbox size="small" defaultChecked sx={{ p: 0.3 }} />}
                  label={<Typography sx={{ fontSize: '0.8rem' }}>{item}</Typography>} sx={{ display: 'block', mb: 0.3 }} />
              ))}
            </Box>
            <Box>
              {['Available Payment Methods', 'Available Services', 'Social Media', 'Map & Directions'].map((item, i) => (
                <FormControlLabel key={item} control={<Checkbox size="small" defaultChecked={i >= 2} sx={{ p: 0.3 }} />}
                  label={<Typography sx={{ fontSize: '0.8rem' }}>{item}</Typography>} sx={{ display: 'block', mb: 0.3 }} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Header Section ── */}
      <Box sx={{ border: '1px solid #ddd', borderRadius: 1, mb: 3 }}>
        <SectionHeader title="Header" />
        <Box sx={{ p: 3 }}>
          <Box sx={{ width: 180, height: 100, border: '1px solid #ddd', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#999', fontFamily: 'serif', letterSpacing: 2 }}>THE DENTAL STUDIO</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#c06000', mb: 0.5 }}>Header Background Color</Typography>
              <Box sx={{ width: 32, height: 32, bgcolor: '#333', borderRadius: 0.5, border: '1px solid #ccc', cursor: 'pointer' }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#c06000', mb: 0.5 }}>Logo Alignment</Typography>
              <RadioGroup row value={logoAlign} onChange={(e) => setLogoAlign(e.target.value)}>
                <FormControlLabel value="Left" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Left</Typography>} />
                <FormControlLabel value="Center" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Center</Typography>} />
                <FormControlLabel value="Right" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Right</Typography>} />
              </RadioGroup>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Footer Section ── */}
      <Box sx={{ border: '1px solid #ddd', borderRadius: 1, mb: 3 }}>
        <SectionHeader title="Footer" />
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>Footer Alignment</Typography>
            <RadioGroup row value={footerAlign} onChange={(e) => setFooterAlign(e.target.value)}>
              <FormControlLabel value="Left" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Left</Typography>} />
              <FormControlLabel value="Center" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem' }}>Center</Typography>} />
            </RadioGroup>
          </Box>

          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#c06000', mb: 1 }}>Address</Typography>
          <RichTextToolbar />
          <TextField fullWidth multiline rows={4} sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '0 0 4px 4px' } }} />

          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 1.5 }}>Social Media</Typography>
          {[
            { label: 'Twitter', value: '' },
            { label: 'Facebook', value: 'https://www.facebook.com/OrTechDentistry' },
            { label: 'Google', value: 'https://www.google.com/search?q=...' },
            { label: 'Instagram', value: 'https://www.instagram.com/thedentalstudiostx/' },
            { label: 'LinkedIn', value: '' },
          ].map((field) => (
            <Box key={field.label} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#c06000', width: 80 }}>{field.label}</Typography>
              <TextField size="small" fullWidth defaultValue={field.value}
                sx={{ '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }} />
            </Box>
          ))}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, width: 80 }}>Title</Typography>
            <TextField size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' } }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, width: 80 }}>Website</Typography>
            <TextField size="small" fullWidth defaultValue="www.thedentalstudiostx.com"
              sx={{ '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.8rem' }, '& input': { color: '#1a3a6b' } }} />
          </Box>

          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>Custom Footer Text</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#777', mb: 1 }}>
            You can use this field to display your services, contact us, or any practice information.
          </Typography>
          <RichTextToolbar />
          <TextField fullWidth multiline rows={4} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0 0 4px 4px' } }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Link href="#" underline="hover" sx={{ fontSize: '0.78rem', color: '#4b71a1' }}>Edit in HTML</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailTemplateSettings;
