import React from 'react';
import { Box, Typography, Button, MenuItem, Select, FormControl } from '@mui/material';

const EditDeposit = ({ depositData, onSave, onCancel }) => {
  const [paymentType, setPaymentType] = React.useState(depositData?.method || 'Master Card');
  const [provider, setProvider] = React.useState('');

  return (
    <Box
      sx={{
        width: '420px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#8eb378',
          color: 'white',
          padding: '12px',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'normal', margin: 0 }}>
          Edit Deposit #{depositData?.id || '24532'}
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ padding: '25px', color: '#333' }}>
        {/* Payment Type */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Typography component="span" sx={{ fontSize: '15px', marginRight: '8px', whiteSpace: 'nowrap' }}>
            Payment Type:
          </Typography>
          <FormControl sx={{ flexGrow: 1 }}>
            <Select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{
                fontSize: '15px',
                color: '#333',
                backgroundColor: 'transparent',
                '& .MuiSelect-select': {
                  padding: '2px 0',
                  borderBottom: '1px solid #ccc',
                  '&:focus': {
                    borderBottom: '1px solid #8eb378',
                  },
                },
              }}
            >
              <MenuItem value="Master Card">Master Card</MenuItem>
              <MenuItem value="Visa">Visa</MenuItem>
              <MenuItem value="American Express">American Express</MenuItem>
              <MenuItem value="Sunbit">Sunbit</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Provider */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', width: '60%' }}>
          <Typography component="span" sx={{ fontSize: '15px', marginRight: '8px', whiteSpace: 'nowrap' }}>
            Provider:
          </Typography>
          <FormControl sx={{ flexGrow: 1 }}>
            <Select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              variant="standard"
              displayEmpty
              disableUnderline
              sx={{
                fontSize: '15px',
                color: '#333',
                backgroundColor: 'transparent',
                '& .MuiSelect-select': {
                  padding: '2px 0',
                  borderBottom: '1px solid #ccc',
                  '&:focus': {
                    borderBottom: '1px solid #8eb378',
                  },
                },
              }}
            >
              <MenuItem value="">
                <Typography sx={{ color: '#999' }}>Select Provider</Typography>
              </MenuItem>
              <MenuItem value="provider1">Provider 1</MenuItem>
              <MenuItem value="provider2">Provider 2</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => onSave && onSave({ paymentType, provider })}
            sx={{
              padding: '6px 16px',
              borderRadius: '4px',
              backgroundColor: '#d1bc8a',
              fontSize: '13px',
              color: 'white',
              '&:hover': {
                backgroundColor: '#c4ad7a',
              },
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onCancel}
            sx={{
              padding: '6px 16px',
              borderRadius: '4px',
              backgroundColor: '#a9a9a9',
              fontSize: '13px',
              color: 'white',
              '&:hover': {
                backgroundColor: '#999999',
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditDeposit;
