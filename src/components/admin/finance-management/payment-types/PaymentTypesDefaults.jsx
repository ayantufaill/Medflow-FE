import React from 'react';
import { Box, Typography, MenuItem } from '@mui/material';
import CustomSelect from '../../../common/CustomSelect';

const PaymentTypesDefaults = ({ defaultTypes, paymentTypes, handleDefaultChange }) => {
  return (
    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 0.5 }}>
          Any adjustment added on a payment type will automatically apply to the invoice of the patient once selected.
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
          Any note added on a payment type will be visible on the invoice.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', width: '250px' }}>Patient Payment Default Type:</Typography>
          <CustomSelect
            size="small"
            value={defaultTypes.patient || ''}
            onChange={(e) => handleDefaultChange('patient', e.target.value)}
            sx={{ width: '200px' }}
          >
            {paymentTypes.filter(pt => !pt.isHidden).map(pt => (
              <MenuItem key={pt.id} value={pt.type}>{pt.type}</MenuItem>
            ))}
          </CustomSelect>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', width: '250px' }}>Insurance Payment Default Type:</Typography>
          <CustomSelect
            size="small"
            value={defaultTypes.insurance || ''}
            onChange={(e) => handleDefaultChange('insurance', e.target.value)}
            sx={{ width: '200px' }}
          >
            {paymentTypes.filter(pt => !pt.isHidden).map(pt => (
              <MenuItem key={pt.id} value={pt.type}>{pt.type}</MenuItem>
            ))}
          </CustomSelect>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', width: '250px' }}>Family Payment Default Type:</Typography>
          <CustomSelect
            size="small"
            value={defaultTypes.family || ''}
            onChange={(e) => handleDefaultChange('family', e.target.value)}
            sx={{ width: '200px' }}
          >
            <MenuItem value="">None</MenuItem>
            {paymentTypes.filter(pt => !pt.isHidden).map(pt => (
              <MenuItem key={pt.id} value={pt.type}>{pt.type}</MenuItem>
            ))}
          </CustomSelect>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentTypesDefaults;
