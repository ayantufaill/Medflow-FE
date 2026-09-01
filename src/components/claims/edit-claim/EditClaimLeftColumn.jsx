import React from 'react';
import { Box, Typography, TextField, MenuItem, FormControlLabel, Checkbox, InputAdornment } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { labelSx, inputSx, selectSx, menuItemSx, dropdownMenuProps } from './styles';

const EditClaimLeftColumn = ({ formData, handleChange }) => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Accident Date</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.accidentDate} 
          onChange={handleChange('accidentDate')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Diagnostic Code</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.diagnosticCode} 
          onChange={handleChange('diagnosticCode')}
          sx={inputSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Predetermination Number</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.predeterminationNumber} 
          onChange={handleChange('predeterminationNumber')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Service Location</Typography>
        <TextField 
          select
          SelectProps={{ MenuProps: dropdownMenuProps }}
          variant="outlined"
          size="small"
          fullWidth 
          value={formData.serviceLocation} 
          onChange={handleChange('serviceLocation')}
          sx={selectSx}
        >
          <MenuItem value="" sx={menuItemSx}><em>Select a location</em></MenuItem>
          <MenuItem value="Office" sx={menuItemSx}>Office</MenuItem>
          <MenuItem value="Hospital" sx={menuItemSx}>Hospital</MenuItem>
        </TextField>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Laboratory or Facility Primary ID</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.laboratoryId} 
          onChange={handleChange('laboratoryId')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Document Control Number</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.documentControlNumber} 
          onChange={handleChange('documentControlNumber')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Delay Reason Code</Typography>
        <TextField 
          select
          SelectProps={{ MenuProps: dropdownMenuProps }}
          variant="outlined" 
          size="small"
          fullWidth 
          value={formData.delayReasonCode} 
          onChange={handleChange('delayReasonCode')}
          sx={selectSx}
        >
          <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
          <MenuItem value="Proof of eligibility Unknown or Unavailable" sx={menuItemSx}>Proof of eligibility Unknown or Unavailable</MenuItem>
          <MenuItem value="Litigation" sx={menuItemSx}>Litigation</MenuItem>
          <MenuItem value="Authorization Delays" sx={menuItemSx}>Authorization Delays</MenuItem>
          <MenuItem value="Delay in Certifying Provider" sx={menuItemSx}>Delay in Certifying Provider</MenuItem>
          <MenuItem value="Delay in Supplying Billing Forms" sx={menuItemSx}>Delay in Supplying Billing Forms</MenuItem>
          <MenuItem value="Delay in Delivery of Custom made Appliances" sx={menuItemSx}>Delay in Delivery of Custom made Appliances</MenuItem>
          <MenuItem value="Third Party Processing Delay" sx={menuItemSx}>Third Party Processing Delay</MenuItem>
          <MenuItem value="Delay in Eligibility Determination" sx={menuItemSx}>Delay in Eligibility Determination</MenuItem>
          <MenuItem value="Original Claim Rejected or Denied Due to a Reason Unrelated to the Billing Limitation Rules" sx={menuItemSx}>Original Claim Rejected or Denied Due to a Reason Unrelated to the Billing Limitation Rules</MenuItem>
          <MenuItem value="Administration Delay in the Prior Approval Process" sx={menuItemSx}>Administration Delay in the Prior Approval Process</MenuItem>
          <MenuItem value="Other" sx={menuItemSx}>Other</MenuItem>
          <MenuItem value="Natural Disaster" sx={menuItemSx}>Natural Disaster</MenuItem>
        </TextField>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={labelSx}>Prior Placement Date</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.priorPlacementDate} 
          onChange={handleChange('priorPlacementDate')}
          sx={inputSx}
        />
      </Box>
      
      <Typography sx={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'underline', mb: 1, cursor: 'pointer' }}>
        Ortho Treatment
      </Typography>
      <FormControlLabel
        control={<Checkbox size="small" checked={formData.treatmentRequiredForOrtho} onChange={handleChange('treatmentRequiredForOrtho')} />}
        label={<Typography sx={{ fontSize: '12px', color: '#334155' }}>Treatment Required for Ortho</Typography>}
        sx={{ mb: 1 }}
      />
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Estimated Treatment Start Date</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.estimatedTreatmentStartDate} 
          onChange={handleChange('estimatedTreatmentStartDate')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Initial Payment</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.initialPayment} 
          onChange={handleChange('initialPayment')}
          sx={inputSx}
        />
      </Box>
    </>
  );
};

export default EditClaimLeftColumn;
