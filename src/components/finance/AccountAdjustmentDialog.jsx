import React from 'react';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  RadioGroup, 
  Radio, 
  FormControlLabel, 
  Checkbox, 
  InputBase, 
  Button, 
  TextField
} from '@mui/material';

const AccountAdjustmentDialog = ({ onClose }) => {
  const [adjustmentType, setAdjustmentType] = React.useState('Un-Collected');
  const [rateType, setRateType] = React.useState('Flat rate');
  const [outstandingType, setOutstandingType] = React.useState('total');
  const [specificAmount, setSpecificAmount] = React.useState('$ 0');
  const [includeCourtesy, setIncludeCourtesy] = React.useState(false);
  const [description, setDescription] = React.useState('');
  
  const totalOutstanding = 400.00;
  const patientOutstanding = 400.00;
  const courtesyCredit = 0.00;
  
  const blueHeader = '#7788bb';
  const labelBlue = '#5c6bc0';
  const adjustmentRed = '#c0392b';
  const goldButton = '#d4af37';

  // Adjustment type options - can be fetched from API
  const adjustmentTypeOptions = [
    'Un-Collected',
    'Professional Courtesy',
    'Immediate Family Courtesy',
    'OON paid',
    'Sunbit Fee',
    'Courtesy 3% for cash pay',
    'Alle Rewards',
    'Uncollect: de-escalate situation',
    'No balance billing',
    'Pro bono',
    'Fee included in Invisalign treatment',
    'Downgrade',
    'Care Credit fee',
    'Employee benefit',
    'Cherry Fee',
    'HFD Fee'
  ];

  // Rate type options - can be fetched from API
  const rateTypeOptions = [
    'Flat rate',
    'Percentage'
  ];

  // Outstanding type options
  const outstandingTypeOptions = [
    { value: 'total', label: 'Total Outstanding', amount: totalOutstanding },
    { value: 'patient', label: 'Patient Outstanding', amount: patientOutstanding },
    { value: 'specific', label: 'Specific', amount: 0 }
  ];

  const calculateAdjustmentValue = () => {
    let value = 0;
    
    if (outstandingType === 'total') {
      value = totalOutstanding;
    } else if (outstandingType === 'patient') {
      value = patientOutstanding;
    } else if (outstandingType === 'specific') {
      value = parseFloat(specificAmount.replace(/[^0-9.-]+/g, '')) || 0;
    }
    
    if (rateType === 'Percentage') {
      // Assuming 100% for flat rate, adjust as needed
      value = value;
    }
    
    if (includeCourtesy) {
      value += courtesyCredit;
    }
    
    return value.toFixed(2);
  };

  return (
    <Box sx={{ width: '100%', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header Bar */}
      <Box sx={{ bgcolor: blueHeader, py: 1, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontWeight: 500 }}>Account Adjustment</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* First Row: Date and Adjustment Type */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 1, borderBottom: '1px solid #7788bb', pb: 1 }}>
          <Typography sx={{ color: labelBlue, fontSize: '0.9rem' }}>04/15/2026</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: labelBlue, fontSize: '0.9rem' }}>Adjustment Type</Typography>
            <Box sx={{ flexGrow: 1, borderBottom: '1.5px solid #7788bb' }}>
              <Select
                variant="standard"
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
                sx={{ 
                  fontSize: '0.9rem', 
                  minWidth: 200,
                  height: 25,
                  '& .MuiSelect-select': { pb: 0.5 }
                }}
                disableUnderline
                MenuProps={{
                  PaperProps: {
                    sx: { 
                      zIndex: 1301,
                      bgcolor: '#fff',
                      '& .MuiMenuItem-root': {
                        fontSize: '12px',
                        py: 0.5,
                        borderBottom: '1px solid #eee'
                      },
                      '& .Mui-selected': {
                        bgcolor: '#7788bb !important',
                        color: '#fff'
                      }
                    }
                  }
                }}
              >
                {adjustmentTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Box>

        {/* Second Row: Calculation Logic */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 3, py: 1.5 }}>
          <Select
            variant="standard"
            value={rateType}
            onChange={(e) => setRateType(e.target.value)}
            sx={{ fontSize: '0.85rem', minWidth: 120 }}
            MenuProps={{
              PaperProps: {
                sx: { zIndex: 1301 }
              }
            }}
          >
            {rateTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <RadioGroup 
            row 
            value={outstandingType}
            onChange={(e) => setOutstandingType(e.target.value)}
            sx={{ alignItems: 'center', flexWrap: 'nowrap', gap: 2 }}
          >
            {outstandingTypeOptions.map((option) => (
              <Box key={option.value} sx={{ display: 'flex', alignItems: 'center', gap: option.value === 'specific' ? 1 : 0 }}>
                <FormControlLabel 
                  value={option.value} 
                  control={<Radio size="small" sx={{ color: '#666', '&.Mui-checked': { color: '#444' } }} />} 
                  label={<Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{option.label} ( <b>${option.amount.toFixed(2)}</b> )</Typography>} 
                />
                {option.value === 'specific' && (
                  <TextField
                    size="small"
                    value={specificAmount}
                    onChange={(e) => setSpecificAmount(e.target.value)}
                    placeholder="$ 0"
                    sx={{ 
                      width: 100, 
                      '& .MuiInputBase-root': { 
                        height: '28px', 
                        fontSize: '0.85rem',
                        bgcolor: outstandingType === 'specific' ? '#fff' : '#f5f5f5'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: outstandingType === 'specific' ? '#7788bb' : '#ccc'
                      }
                    }}
                    disabled={outstandingType !== 'specific'}
                  />
                )}
              </Box>
            ))}
          </RadioGroup>

          <FormControlLabel 
            control={
              <Checkbox 
                size="small" 
                checked={includeCourtesy}
                onChange={(e) => setIncludeCourtesy(e.target.checked)}
              />
            } 
            label={<Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Include the Courtesy Credit ( ${courtesyCredit.toFixed(2)} )</Typography>} 
          />
        </Box>

        {/* Third Row: Description and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 2 }}>
          <TextField
            placeholder="Description"
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ width: '250px', '& .MuiInputBase-root': { height: '30px', fontSize: '0.85rem' } }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: adjustmentRed, fontWeight: 'bold', fontSize: '0.9rem' }}>
              Adjustment Value: ${calculateAdjustmentValue()}
            </Typography>
            
            <Button 
              variant="contained" 
              sx={{ bgcolor: goldButton, '&:hover': { bgcolor: '#b3a247' }, textTransform: 'none', px: 3 }}
            >
              Apply
            </Button>
            <Button 
              variant="contained" 
              onClick={onClose}
              sx={{ bgcolor: '#a6a6a6', '&:hover': { bgcolor: '#919191' }, textTransform: 'none', px: 3 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountAdjustmentDialog;
