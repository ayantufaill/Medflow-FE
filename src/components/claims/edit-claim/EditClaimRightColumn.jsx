import React from 'react';
import { Box, Typography, TextField, MenuItem, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { labelSx, inputSx, selectSx, menuItemSx, dropdownMenuProps } from './styles';

const EditClaimRightColumn = ({ formData, handleChange, providerOptions }) => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{...labelSx, display: 'inline-block', mr: 2}}>Attachment Indicator</Typography>
        <RadioGroup 
          row 
          value={formData.attachmentIndicator} 
          onChange={handleChange('attachmentIndicator')}
        >
          <FormControlLabel value="Yes" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>Yes</Typography>} />
          <FormControlLabel value="No" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>No</Typography>} />
        </RadioGroup>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Attachment Type</Typography>
        <TextField 
          select
          SelectProps={{ MenuProps: dropdownMenuProps }}
          variant="outlined" 
          size="small"
          fullWidth 
          value={formData.attachmentType} 
          onChange={handleChange('attachmentType')}
          sx={selectSx}
        >
          <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
          <MenuItem value="Referral Form" sx={menuItemSx}>Referral Form</MenuItem>
          <MenuItem value="Dental Models" sx={menuItemSx}>Dental Models</MenuItem>
          <MenuItem value="Diagnostic Report" sx={menuItemSx}>Diagnostic Report</MenuItem>
          <MenuItem value="Explanation of Benefits" sx={menuItemSx}>Explanation of Benefits</MenuItem>
          <MenuItem value="Operative Note" sx={menuItemSx}>Operative Note</MenuItem>
          <MenuItem value="Support Data for Claim" sx={menuItemSx}>Support Data for Claim</MenuItem>
          <MenuItem value="Periodontal Charts" sx={menuItemSx}>Periodontal Charts</MenuItem>
          <MenuItem value="Radiology Films" sx={menuItemSx}>Radiology Films</MenuItem>
          <MenuItem value="Radiology Reports" sx={menuItemSx}>Radiology Reports</MenuItem>
        </TextField>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Attachment Transmission Code</Typography>
        <TextField 
          select
          SelectProps={{ MenuProps: dropdownMenuProps }}
          variant="outlined" 
          size="small"
          fullWidth 
          value={formData.attachmentTransmissionCode} 
          onChange={handleChange('attachmentTransmissionCode')}
          sx={selectSx}
        >
          <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
          <MenuItem value="Available on Request at Provider Site" sx={menuItemSx}>Available on Request at Provider Site</MenuItem>
          <MenuItem value="By Mail" sx={menuItemSx}>By Mail</MenuItem>
          <MenuItem value="Electronically Only" sx={menuItemSx}>Electronically Only</MenuItem>
          <MenuItem value="E-Mail" sx={menuItemSx}>E-Mail</MenuItem>
          <MenuItem value="By Fax" sx={menuItemSx}>By Fax</MenuItem>
        </TextField>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Additional Attachment Information</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.additionalAttachmentInformation} 
          onChange={handleChange('additionalAttachmentInformation')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Claim Submission Reason Code</Typography>
        <TextField 
          select
          SelectProps={{ MenuProps: dropdownMenuProps }}
          variant="outlined" 
          size="small"
          fullWidth 
          value={formData.claimSubmissionReasonCode} 
          onChange={handleChange('claimSubmissionReasonCode')}
          sx={selectSx}
        >
          <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
          <MenuItem value="Original" sx={menuItemSx}>Original</MenuItem>
          <MenuItem value="Corrected" sx={menuItemSx}>Corrected</MenuItem>
          <MenuItem value="Replacement" sx={menuItemSx}>Replacement</MenuItem>
          <MenuItem value="Void" sx={menuItemSx}>Void</MenuItem>
        </TextField>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Treating Provider *</Typography>
        <TextField 
          select
          SelectProps={{ MenuProps: dropdownMenuProps }}
          variant="outlined" 
          size="small"
          fullWidth 
          value={formData.treatingProvider} 
          onChange={handleChange('treatingProvider')}
          sx={selectSx}
        >
          <MenuItem value="" sx={menuItemSx}><em>Select</em></MenuItem>
          {providerOptions.map(p => (
            <MenuItem key={p.value} value={p.value} sx={menuItemSx}>{p.label}</MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={labelSx}>Insurance Payment Amount $</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.insurancePaymentAmount} 
          onChange={handleChange('insurancePaymentAmount')}
          sx={inputSx}
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Treatment Duration (Months)</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.treatmentDurationMonths} 
          onChange={handleChange('treatmentDurationMonths')}
          sx={inputSx}
        />
      </Box>
    </>
  );
};

export default EditClaimRightColumn;
