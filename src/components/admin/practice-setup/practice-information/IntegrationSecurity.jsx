import React from 'react';
import { Box, TextField, FormControlLabel, Checkbox, Typography, InputAdornment } from '@mui/material';
import { AdminPanelSettings as SecurityIcon } from '@mui/icons-material';
import { useFormContext, Controller } from 'react-hook-form';
import InfoCard from './InfoCard';
import { FieldRow, stdSx, inputSx } from './SharedComponents';

const XRAY_BRIDGES = ['Carestream', 'Dexis', 'Vatech', 'Planmeca', 'Cad'];

const IntegrationSecurity = () => {
  const { register, control, watch, setValue } = useFormContext();
  const xrayBridgesVal = watch('xrayBridges') || [];

  const toggleXray = (bridge) => {
    const lowerBridge = bridge.toLowerCase();
    if (xrayBridgesVal.includes(lowerBridge)) {
      setValue('xrayBridges', xrayBridgesVal.filter((b) => b !== lowerBridge));
    } else {
      setValue('xrayBridges', [...xrayBridgesVal, lowerBridge]);
    }
  };

  return (
    <InfoCard title="INTEGRATIONS & SECURITY" icon={<SecurityIcon sx={{ fontSize: 16 }} />}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Rx ID" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('rxId')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Mango ID" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('mangoId')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Mango Authentication Token" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('mangoAuthToken')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="MyChart Link" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('myChartLink')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Online Scheduling Link" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('onlineSchedulingLink')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Open Edge Token" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('openEdgeToken')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Open Edge MyChart Token" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('openEdgeMyChartToken')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Google Measurement ID" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('googleMeasurementId')} placeholder="G-XXXXXXXXXX" inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="SmilePay Merchant ID" labelWidth="100%">
            <TextField sx={inputSx} variant="outlined" size="small" fullWidth {...register('smilePayMerchantId')} inputProps={{ style: stdSx }} />
          </FieldRow>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FieldRow label="Surcharge Fee" labelWidth="100%">
            <TextField 
              sx={inputSx} 
              variant="outlined" 
              size="small" 
              fullWidth 
              {...register('surchargeFee')} 
              inputProps={{ style: stdSx }} 
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </FieldRow>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1, mb: 2 }}>
        <Controller
          name="restrictIPs"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox size="small" {...field} checked={field.value} />}
              label={<Typography sx={{ fontSize: '12px', color: '#4B5568' }}>Restrict PIN</Typography>}
              sx={{ m: 0 }}
            />
          )}
        />
        <Controller
          name="twoFactorNonAuth"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox size="small" {...field} checked={field.value} />}
              label={<Typography sx={{ fontSize: '12px', color: '#4B5568' }}>Allow two-factor login from non-authorized IPs</Typography>}
              sx={{ m: 0 }}
            />
          )}
        />
        <Controller
          name="usingOryxImaging"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox size="small" {...field} checked={field.value} />}
              label={<Typography sx={{ fontSize: '12px', color: '#4B5568' }}>Using Oryx Imaging</Typography>}
              sx={{ m: 0 }}
            />
          )}
        />
      </Box>

      <Box>
        <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#4B5568', mb: 1 }}>Xray Acquisition Bridge</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
          {XRAY_BRIDGES.map((bridge) => (
            <FormControlLabel
              key={bridge}
              control={
                <Checkbox
                  size="small"
                  checked={xrayBridgesVal.includes(bridge.toLowerCase())}
                  onChange={() => toggleXray(bridge)}
                />
              }
              label={<Typography sx={{ fontSize: '12px', color: '#4B5568' }}>{bridge}</Typography>}
              sx={{ m: 0 }}
            />
          ))}
        </Box>
      </Box>

    </InfoCard>
  );
};

export default IntegrationSecurity;
