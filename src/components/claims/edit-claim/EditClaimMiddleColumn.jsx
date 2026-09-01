import React from 'react';
import { Box, Typography, TextField, MenuItem, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { labelSx, inputSx, selectSx, menuItemSx, dropdownMenuProps } from './styles';

const EditClaimMiddleColumn = ({ formData, handleChange, providerOptions }) => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{...labelSx, display: 'inline-block', mr: 2}}>Accident Indicator</Typography>
        <RadioGroup 
          row 
          value={formData.accidentIndicator} 
          onChange={handleChange('accidentIndicator')}
        >
          <FormControlLabel value="Automobile" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>Automobile</Typography>} />
          <FormControlLabel value="Non-Automobile" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>Non-Automobile</Typography>} />
          <FormControlLabel value="Non Accident" control={<Radio size="small" />} label={<Typography sx={{fontSize: '12px'}}>Non Accident</Typography>} />
        </RadioGroup>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Auto Accident State</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.autoAccidentState} 
          onChange={handleChange('autoAccidentState')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Referral Date</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.referralDate} 
          onChange={handleChange('referralDate')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Admission Date</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.admissionDate} 
          onChange={handleChange('admissionDate')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Discharge Date</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.dischargeDate} 
          onChange={handleChange('dischargeDate')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Billing Entity</Typography>
        <TextField 
          select
          SelectProps={{ MenuProps: dropdownMenuProps }}
          variant="outlined" 
          size="small"
          fullWidth 
          value={formData.billingEntity} 
          onChange={handleChange('billingEntity')}
          sx={selectSx}
        >
          <MenuItem value="" sx={menuItemSx}><em>None</em></MenuItem>
          {providerOptions.map(p => (
            <MenuItem key={p.value} value={p.value} sx={menuItemSx}>{p.label}</MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Service Authorization Exception Code</Typography>
        <TextField 
          select
          SelectProps={{ MenuProps: dropdownMenuProps }}
          variant="outlined" 
          size="small"
          fullWidth 
          value={formData.serviceAuthExceptionCode} 
          onChange={handleChange('serviceAuthExceptionCode')}
          sx={selectSx}
        >
          <MenuItem value="None" sx={menuItemSx}>None</MenuItem>
          <MenuItem value="Immediate/Urgent Care" sx={menuItemSx}>Immediate/Urgent Care</MenuItem>
          <MenuItem value="Services rendered in retroactive period" sx={menuItemSx}>Services rendered in retroactive period</MenuItem>
          <MenuItem value="Emergency Care" sx={menuItemSx}>Emergency Care</MenuItem>
          <MenuItem value="Client like temporary Medicaid" sx={menuItemSx}>Client like temporary Medicaid</MenuItem>
          <MenuItem value="Request from County for second opinion to recipient can work" sx={menuItemSx}>Request from County for second opinion to recipient can work</MenuItem>
          <MenuItem value="Request for override pending" sx={menuItemSx}>Request for override pending</MenuItem>
          <MenuItem value="Special Handling" sx={menuItemSx}>Special Handling</MenuItem>
        </TextField>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={labelSx}>Remittance Date</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.remittanceDate} 
          onChange={handleChange('remittanceDate')}
          sx={inputSx}
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>Date Orthodontic Appliance Placed</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.dateOrthoAppliancePlaced} 
          onChange={handleChange('dateOrthoAppliancePlaced')}
          sx={inputSx}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={labelSx}>SRP Last Date</Typography>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={formData.srpLastDate} 
          onChange={handleChange('srpLastDate')}
          sx={inputSx}
        />
      </Box>
    </>
  );
};

export default EditClaimMiddleColumn;
