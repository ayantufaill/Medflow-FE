import { useState } from 'react';
import {
  Box, Typography, Radio, RadioGroup, FormControlLabel, Checkbox, TextField, Divider, Link,
} from '@mui/material';
import {
  FormatBold, FormatItalic, FormatAlignLeft, FormatAlignCenter, FormatAlignJustify, Link as LinkIcon
} from '@mui/icons-material';

const SectionHeader = ({ title }) => (
  <Box sx={{ bgcolor: '#F8FAFC', px: 3, py: 1.5, borderBottom: '1px solid #E5E9F2', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
    <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B', letterSpacing: '0.05em' }}>{title}</Typography>
  </Box>
);

const RichTextToolbar = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, border: '1px solid #E5E9F2', borderBottom: 'none', p: 0.5, bgcolor: '#fff', flexWrap: 'wrap', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
    {[FormatBold, FormatItalic, FormatAlignLeft, FormatAlignCenter, FormatAlignJustify].map((Icon, i) => (
      <Box key={i} sx={{ p: 0.3, cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' }, borderRadius: 0.5 }}>
        <Icon sx={{ fontSize: '1rem', color: '#64748B' }} />
      </Box>
    ))}
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#E5E9F2' }} />
    <Typography sx={{ fontSize: '0.72rem', color: '#64748B', cursor: 'pointer', px: 0.5 }}>Paragraph ▾</Typography>
    <Typography sx={{ fontSize: '0.72rem', color: '#64748B', cursor: 'pointer', px: 0.5 }}>16pt ▾</Typography>
    <Typography sx={{ fontSize: '0.72rem', color: '#64748B', cursor: 'pointer', px: 0.5 }}>Lato ▾</Typography>
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#E5E9F2' }} />
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>T</Typography></Box>
    <Box sx={{ p: 0.3, cursor: 'pointer' }}><LinkIcon sx={{ fontSize: '1rem', color: '#64748B' }} /></Box>
  </Box>
);

const CustomCheckbox = ({ checked, onChange, label }) => (
  <FormControlLabel
    control={
      <Checkbox
        size="small"
        checked={checked}
        onChange={onChange}
        sx={{ p: 0.5, '&.Mui-checked': { color: '#2563EB' } }}
        icon={<Box sx={{ width: 14, height: 14, border: '2px solid #CBD5E1', borderRadius: '3px' }} />}
        checkedIcon={<Box sx={{ width: 14, height: 14, bgcolor: '#2563EB', borderRadius: '3px', position: 'relative', '&::after': { content: '""', position: 'absolute', width: 4, height: 8, border: 'solid white', borderWidth: '0 2px 2px 0', transform: 'rotate(45deg)', top: 1, left: 4 } }} />}
      />
    }
    label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>{label}</Typography>}
    sx={{ display: 'block', mb: 0.3, ml: 0 }}
  />
);

const defaultEmailTemplateSettings = {
  templateColor: '#1A202C',
  bodyAlign: 'Center',
  includes: {
    practiceLogo: true,
    practiceName: true,
    address: true,
    email: true,
    phoneNumber: true,
    availablePaymentMethods: false,
    availableServices: false,
    socialMedia: true,
    mapDirections: true,
    workingHours: true,
  },
  headerBackgroundColor: '#1A202C',
  headerText: 'THE DENTAL STUDIO',
  logoAlign: 'Center',
  footerAlign: 'Center',
  footerAddress: '',
  socialMedia: {
    twitter: '',
    facebook: 'https://www.facebook.com/DrTechDentistry',
    google: 'https://www.google.com/search?q=...',
    instagram: 'https://www.instagram.com/thedentalstudiofw/',
    linkedin: '',
  },
  footerTitle: '',
  footerWebsite: 'www.thedentalstudiofw.com',
  customFooterText: ''
};

const EmailTemplateSettings = ({ settings, setSettings }) => {
  if (!settings) return null;

  const currentSettings = settings.emailTemplateSettings || defaultEmailTemplateSettings;

  const updateSettings = (newPartial) => {
    setSettings(prev => {
      const current = prev.emailTemplateSettings || defaultEmailTemplateSettings;
      return {
        ...prev,
        emailTemplateSettings: {
          ...current,
          ...newPartial
        }
      };
    });
  };

  const updateInclude = (key, value) => {
    updateSettings({ includes: { ...currentSettings.includes, [key]: value } });
  };

  const updateSocialMedia = (key, value) => {
    updateSettings({ socialMedia: { ...currentSettings.socialMedia, [key]: value } });
  };

  return (
    <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '8px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#F2F6FC', px: 3, py: 1.5, borderBottom: '1px solid #E5E9F2' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293B' }}>Email Template Settings</Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Top 2 Columns */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'stretch' }}>

          {/* ── General Section ── */}
          <Box sx={{ flex: 1, border: '1px solid #E5E9F2', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
            <SectionHeader title="GENERAL" />
            <Box sx={{ p: 3, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 6, mb: 4 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', mb: 1 }}>Template Color *</Typography>
                  <Box sx={{ position: 'relative', width: 28, height: 28, borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #E5E9F2' }}>
                    <input
                      type="color"
                      value={currentSettings.templateColor}
                      onChange={(e) => updateSettings({ templateColor: e.target.value })}
                      style={{ position: 'absolute', opacity: 0, width: '200%', height: '200%', top: '-50%', left: '-50%', cursor: 'pointer' }}
                    />
                    <Box sx={{ width: '100%', height: '100%', bgcolor: currentSettings.templateColor }} />
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', mb: 0.5 }}>Body Alignment</Typography>
                  <RadioGroup row value={currentSettings.bodyAlign} onChange={(e) => updateSettings({ bodyAlign: e.target.value })}>
                    <FormControlLabel value="Left" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2563EB' } }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Left</Typography>} />
                    <FormControlLabel value="Center" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2563EB' } }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Center</Typography>} />
                  </RadioGroup>
                </Box>
              </Box>

              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', mb: 1.5 }}>What to include in emails from your office:</Typography>
              <Box sx={{ display: 'flex', gap: 6 }}>
                <Box>
                  <CustomCheckbox label="Practice Logo" checked={currentSettings.includes.practiceLogo} onChange={(e) => updateInclude('practiceLogo', e.target.checked)} />
                  <CustomCheckbox label="Practice Name" checked={currentSettings.includes.practiceName} onChange={(e) => updateInclude('practiceName', e.target.checked)} />
                  <CustomCheckbox label="Address" checked={currentSettings.includes.address} onChange={(e) => updateInclude('address', e.target.checked)} />
                  <CustomCheckbox label="Email" checked={currentSettings.includes.email} onChange={(e) => updateInclude('email', e.target.checked)} />
                  <CustomCheckbox label="Phone Number" checked={currentSettings.includes.phoneNumber} onChange={(e) => updateInclude('phoneNumber', e.target.checked)} />
                </Box>
                <Box>
                  <CustomCheckbox label="Available Payment Methods" checked={currentSettings.includes.availablePaymentMethods} onChange={(e) => updateInclude('availablePaymentMethods', e.target.checked)} />
                  <CustomCheckbox label="Available Services" checked={currentSettings.includes.availableServices} onChange={(e) => updateInclude('availableServices', e.target.checked)} />
                  <CustomCheckbox label="Social Media" checked={currentSettings.includes.socialMedia} onChange={(e) => updateInclude('socialMedia', e.target.checked)} />
                  <CustomCheckbox label="Map & Directions" checked={currentSettings.includes.mapDirections} onChange={(e) => updateInclude('mapDirections', e.target.checked)} />
                  <CustomCheckbox label="Working Hours" checked={currentSettings.includes.workingHours} onChange={(e) => updateInclude('workingHours', e.target.checked)} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── Header Section ── */}
          <Box sx={{ flex: 1, border: '1px solid #E5E9F2', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
            <SectionHeader title="HEADER" />
            <Box sx={{ p: 3, flex: 1 }}>
              <Box sx={{ width: 220, height: 70, border: '1px solid #E5E9F2', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <input
                  value={currentSettings.headerText !== undefined ? currentSettings.headerText : 'THE DENTAL STUDIO'}
                  onChange={(e) => updateSettings({ headerText: e.target.value })}
                  style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'serif', letterSpacing: 2, textAlign: 'center', border: 'none', background: 'transparent', width: '90%', outline: 'none' }}
                />
              </Box>
              <Divider sx={{ mb: 3, borderColor: '#F1F5F9' }} />
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', mb: 1 }}>Header Background Color</Typography>
                <Box sx={{ position: 'relative', width: 28, height: 28, borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', mb: 3, border: '1px solid #E5E9F2' }}>
                  <input
                    type="color"
                    value={currentSettings.headerBackgroundColor}
                    onChange={(e) => updateSettings({ headerBackgroundColor: e.target.value })}
                    style={{ position: 'absolute', opacity: 0, width: '200%', height: '200%', top: '-50%', left: '-50%', cursor: 'pointer' }}
                  />
                  <Box sx={{ width: '100%', height: '100%', bgcolor: currentSettings.headerBackgroundColor }} />
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', mb: 0.5 }}>Logo Alignment</Typography>
                <RadioGroup row value={currentSettings.logoAlign} onChange={(e) => updateSettings({ logoAlign: e.target.value })}>
                  <FormControlLabel value="Left" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2563EB' } }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Left</Typography>} />
                  <FormControlLabel value="Center" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2563EB' } }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Center</Typography>} />
                  <FormControlLabel value="Right" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2563EB' } }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Right</Typography>} />
                </RadioGroup>
              </Box>
            </Box>
          </Box>

        </Box>

        {/* ── Footer Section ── */}
        <Box sx={{ border: '1px solid #E5E9F2', borderRadius: '8px', mb: 3 }}>
          <SectionHeader title="FOOTER" />
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', mb: 0.5 }}>Footer Alignment</Typography>
              <RadioGroup row value={currentSettings.footerAlign} onChange={(e) => updateSettings({ footerAlign: e.target.value })}>
                <FormControlLabel value="Left" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2563EB' } }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Left</Typography>} />
                <FormControlLabel value="Center" control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#2563EB' } }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#475569' }}>Center</Typography>} />
              </RadioGroup>
            </Box>

            <Divider sx={{ mb: 3, borderColor: '#F1F5F9' }} />

            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', mb: 1 }}>Address</Typography>
            <RichTextToolbar />
            <TextField
              fullWidth multiline rows={3}
              value={currentSettings.footerAddress}
              onChange={(e) => updateSettings({ footerAddress: e.target.value })}
              sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '0 0 6px 6px', borderColor: '#E5E9F2' } }}
            />

            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', mb: 1.5 }}>Social Media</Typography>
            {[
              { label: 'Twitter', key: 'twitter' },
              { label: 'Facebook', key: 'facebook' },
              { label: 'Google', key: 'google' },
              { label: 'Instagram', key: 'instagram' },
              { label: 'LinkedIn', key: 'linkedin' },
            ].map((field) => (
              <Box key={field.key} sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', mb: 0.5 }}>{field.label}</Typography>
                <TextField
                  size="small" fullWidth
                  value={currentSettings.socialMedia[field.key]}
                  onChange={(e) => updateSocialMedia(field.key, e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem', borderRadius: '6px' } }}
                />
              </Box>
            ))}

            <Box sx={{ mt: 3, mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', mb: 0.5 }}>Title</Typography>
              <TextField
                size="small" fullWidth
                value={currentSettings.footerTitle}
                onChange={(e) => updateSettings({ footerTitle: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem', borderRadius: '6px' } }}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', mb: 0.5 }}>Website</Typography>
              <TextField
                size="small" fullWidth
                value={currentSettings.footerWebsite}
                onChange={(e) => updateSettings({ footerWebsite: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem', borderRadius: '6px' }, '& input': { color: '#3B82F6' } }}
              />
            </Box>

            <Divider sx={{ mb: 3, borderColor: '#F1F5F9' }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', mb: 0.5 }}>Custom Footer Text</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', mb: 1.5 }}>
              You can use this field to display any excuse, contact us, or any practice information.
            </Typography>
            <RichTextToolbar />
            <TextField
              fullWidth multiline rows={3}
              value={currentSettings.customFooterText}
              onChange={(e) => updateSettings({ customFooterText: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0 0 6px 6px', borderColor: '#E5E9F2' } }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Link href="#" underline="hover" sx={{ fontSize: '0.75rem', color: '#3B82F6' }}>Edit in HTML</Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailTemplateSettings;
