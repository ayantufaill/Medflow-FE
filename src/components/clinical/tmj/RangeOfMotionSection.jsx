import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup, Grid, Chip, TextField, Divider } from '@mui/material';

const PillChip = ({ label, type }) => {
  const isWNL = type === 'wnl';
  return (
    <Chip
      label={label}
      variant="outlined"
      sx={{
        height: 22,
        fontSize: '11px',
        fontWeight: 700,
        color: isWNL ? '#10b981' : '#64748b',
        borderColor: isWNL ? '#10b981' : '#e2e8f0',
        backgroundColor: '#fff',
        borderRadius: '12px',
        px: 0.5,
        mr: 2
      }}
    />
  );
};

const CustomInput = ({ value, onChange, width = 60 }) => (
  <TextField
    variant="standard"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    InputProps={{
      disableUnderline: false,
    }}
    sx={{
      width,
      mr: 2,
      '& input': {
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 600,
        color: '#1e293b',
        padding: '2px 0 6px 0'
      },
      '& .MuiInput-root:before': { borderBottom: '1px solid #e2e8f0 !important' },
      '& .MuiInput-root:after': { borderBottom: '2px solid #3b82f6 !important' },
      '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #cbd5e1 !important' }
    }}
  />
);

const CustomCheckbox = ({ checked, onChange, label, lightLabel = false, mr = 2 }) => (
  <FormControlLabel
    control={
      <Checkbox
        size="small"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          p: '4px',
          color: '#cbd5e1',
          '&.Mui-checked': { color: '#3b82f6' },
          '& .MuiSvgIcon-root': { fontSize: 18, borderRadius: '4px' }
        }}
      />
    }
    label={<Typography sx={{ fontSize: '13px', color: lightLabel ? '#94a3b8' : '#334155' }}>{label}</Typography>}
    sx={{ m: 0, mr }}
  />
);

const CustomRadio = ({ value, label, checkedValue }) => (
  <FormControlLabel
    value={value}
    control={
      <Radio
        sx={{
          p: '4px',
          color: '#cbd5e1',
          '&.Mui-checked': { color: '#3b82f6' },
          '& .MuiSvgIcon-root': { fontSize: 18 }
        }}
      />
    }
    label={<Typography sx={{ fontSize: '13px', color: '#334155' }}>{label}</Typography>}
    sx={{ m: 0, mr: 1.5 }}
  />
);

const RangeOfMotionSection = ({ formData, handleFieldChange, handleCheckboxChange, handleCheckboxArrayChange, summaryContent }) => {
  return (
    <Grid container spacing={0} sx={{ mt: 1 }}>
      {/* LEFT FORM COLUMN */}
      <Grid item xs={8} sx={{ pr: 4 }}>
        {summaryContent}
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 3, pt: 4, backgroundColor: '#f8fafc' }}>

          {/* Row 1: Maximum Opening */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ width: 150 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>MAXIMUM OPENING</Typography>
            </Box>
            <Box sx={{ width: 90 }} /> {/* Empty space for Left Lateral column */}
            <Box sx={{ width: 80, display: 'flex', alignItems: 'center' }}>
              <CustomInput value={formData.maxOpening} onChange={(val) => handleFieldChange('maxOpening', val)} width={45} />
              <Typography sx={{ fontSize: '13px', color: '#64748b' }}>mm</Typography>
            </Box>
            <Box sx={{ width: 40 }} /> {/* Spacer to match the gap in mockup */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <PillChip label="WNL" type="wnl" />
              <Typography sx={{ fontSize: '11px', color: '#94a3b8', width: 130 }}>Restricted (&lt; 35 mm)</Typography>
              <Typography sx={{ fontSize: '11px', color: '#94a3b8' }}>Excessive (&gt; 65 mm)</Typography>
            </Box>
          </Box>

          {/* Row 2: Left to Right Movement */}
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Box sx={{ width: 150, pt: 0.5 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>LEFT TO RIGHT<br />MOVEMENT</Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 90 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Left Lateral</Typography>
                </Box>
                <Box sx={{ width: 80, display: 'flex', alignItems: 'center' }}>
                  <CustomInput value={formData.leftLateral} onChange={(val) => handleFieldChange('leftLateral', val)} width={45} />
                  <Typography sx={{ fontSize: '13px', color: '#64748b' }}>mm</Typography>
                </Box>
                <Box sx={{ width: 40 }} /> {/* Spacer */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <PillChip label="WNL" type="wnl" />
                  <Typography sx={{ fontSize: '11px', color: '#94a3b8' }}>Restricted (&lt; 10 mm)</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 90 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Right Lateral</Typography>
                </Box>
                <Box sx={{ width: 80, display: 'flex', alignItems: 'center' }}>
                  <CustomInput value={formData.rightLateral} onChange={(val) => handleFieldChange('rightLateral', val)} width={45} />
                  <Typography sx={{ fontSize: '13px', color: '#64748b' }}>mm</Typography>
                </Box>
                <Box sx={{ width: 40 }} /> {/* Spacer */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <PillChip label="WNL" type="wnl" />
                  <Typography sx={{ fontSize: '11px', color: '#94a3b8' }}>Restricted (&lt; 10 mm)</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 2.5, borderColor: '#e2e8f0' }} />

          {/* Row 3: Deviation Upon Opening */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Box sx={{ width: 170 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Deviation Upon Opening</Typography>
            </Box>
            <Box sx={{ width: 150, display: 'flex', alignItems: 'center' }}>
              <RadioGroup row value={formData.deviationOnOpening} onChange={(e) => handleFieldChange('deviationOnOpening', e.target.value)}>
                <CustomRadio value="no" label="No" checkedValue={formData.deviationOnOpening} />
                <CustomRadio value="yes" label="Yes:" checkedValue={formData.deviationOnOpening} />
              </RadioGroup>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <CustomCheckbox checked={formData.deviationLeft} onChange={(c) => handleCheckboxChange('deviationLeft', c)} label="Left" mr={1.5} />
              <CustomCheckbox checked={formData.deviationLeftReduction} onChange={(c) => handleCheckboxChange('deviationLeftReduction', c)} label="w/ Reduction" lightLabel mr={4} />
              <CustomCheckbox checked={formData.deviationRight} onChange={(c) => handleCheckboxChange('deviationRight', c)} label="Right" mr={1.5} />
              <CustomCheckbox checked={formData.deviationRightReduction} onChange={(c) => handleCheckboxChange('deviationRightReduction', c)} label="w/ Reduction" lightLabel mr={0} />
            </Box>
          </Box>

          <Divider sx={{ mb: 2.5, borderColor: '#e2e8f0' }} />

          {/* Row 4: Pain When in Motion */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 170 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Pain When in Motion</Typography>
            </Box>
            <Box sx={{ width: 150, display: 'flex', alignItems: 'center' }}>
              <RadioGroup row value={formData.painWhenInMotion} onChange={(e) => handleFieldChange('painWhenInMotion', e.target.value)}>
                <CustomRadio value="no" label="No" checkedValue={formData.painWhenInMotion} />
                <CustomRadio value="yes" label="Yes:" checkedValue={formData.painWhenInMotion} />
              </RadioGroup>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
              {['Sharp', 'Dull', 'Muscle', 'Right TMJ', 'Left TMJ'].map((text, index, arr) => (
                <CustomCheckbox
                  key={text}
                  checked={(formData.painTypes || []).includes(text)}
                  onChange={(c) => handleCheckboxArrayChange('painTypes', text, c)}
                  label={text}
                  lightLabel
                  mr={index === arr.length - 1 ? 0 : 2}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* RIGHT DIAGRAM COLUMN */}
      <Grid item xs={4} sx={{ borderLeft: '1px solid #f1f5f9', pl: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', mb: 2 }}>MOVEMENT DIRECTION</Typography>
          <Box sx={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            width: '260px',
            height: '160px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <svg width="160" height="100" viewBox="0 0 160 100">
              {/* Labels */}
              <text x="15" y="20" fill="#0f172a" fontSize="14px" fontWeight="700" textAnchor="middle" fontFamily="'Inter', 'Segoe UI', sans-serif">R</text>
              <text x="145" y="20" fill="#0f172a" fontSize="14px" fontWeight="700" textAnchor="middle" fontFamily="'Inter', 'Segoe UI', sans-serif">L</text>

              {/* Horizontal line */}
              <line x1="15" y1="40" x2="145" y2="40" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

              {/* Vertical line pointing down */}
              <line x1="80" y1="40" x2="80" y2="90" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

              {/* Arrow head */}
              <path d="M72 82 L80 94 L88 82 Z" fill="#0f172a" />
            </svg>
          </Box>
          <Typography sx={{ fontSize: '11px', color: '#64748b', mt: 2 }}>
            Arrow indicates deviation vector during opening.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RangeOfMotionSection;
