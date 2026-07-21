import React, { useRef } from 'react';
import { Box, Typography, TextField, Tooltip, Chip } from '@mui/material';
import { InfoOutlined as InfoOutlinedIcon, Home as HomeIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import InfoCard from './InfoCard';
import { FieldRow, stdSx, inputSx } from './SharedComponents';

const PracticeDetails = ({ logoPreview, onLogoChange }) => {
  const { register, watch } = useFormContext();
  const logoRef = useRef(null);

  return (
    <InfoCard title="PRACTICE DETAILS" icon={<HomeIcon sx={{ fontSize: 16 }} />}>
      <Box
        onClick={() => logoRef.current?.click()}
        sx={{
          width: '100%', height: 160,
          border: '1px dashed #ccc', borderRadius: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          cursor: 'pointer', mb: 4, overflow: 'hidden', bgcolor: '#F9FAFB',
          '&:hover': { borderColor: 'primary.main', bgcolor: '#F2F6FC' },
        }}
      >
        {logoPreview
          ? <img 
              src={logoPreview} 
              alt="logo" 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/180x160/png?text=Mock+S3+Logo';
              }}
            />
          : (
            <>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>↑</Typography>
              <Typography variant="caption" color="text.disabled">Click to upload logo</Typography>
            </>
          )}
      </Box>
      <input ref={logoRef} type="file" accept="image/*" hidden onChange={onLogoChange} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Practice Name" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('practiceName')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Phone Number" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('phone')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Extension" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('extension')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Fax" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('fax')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="E-mail Address" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('email')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Website" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('website')} placeholder="https://" inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Fee Guide Unit" labelWidth="100%">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('feeGuidesUnit')} inputProps={{ style: stdSx }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '11px' }}>mins</Typography>
            </Box>
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Schedule Unit" labelWidth="100%">
            <Box sx={{ 
              border: '1px solid #E6E8EC', 
              borderRadius: '7px', 
              height: '34px',
              px: '12px', 
              display: 'flex',
              alignItems: 'center',
              width: '100%', 
              bgcolor: '#fff',
              boxSizing: 'border-box'
            }}>
               <Typography sx={{ fontSize: '12px', color: '#11223F' }}>{watch('scheduleUnit') || '10'} mins</Typography>
            </Box>
          </FieldRow>
        </Box>
      </Box>

    </InfoCard>
  );
};

export default PracticeDetails;
