import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Divider,
} from '@mui/material';

const PAYMENT_TYPES = [
  'Do not use', 'Check', 'Debit Card', 'EFT', 'Cash', 'Care Credit', 'Master Card', 'Visa Card', 'ACH Payment',
  'American Express', 'Discover', 'Card on File', 'Online Card', 'Sunbit', 'Cherry', 'HFD', 'VCC'
];

const DepositSummary = () => {
  const [dateRange, setDateRange] = useState('Daily');

  const CheckboxGroup = ({ title, items }) => (
    <Box sx={{ mb: 3 }}>
      <FormControlLabel
        control={<Checkbox size="small" />}
        label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{title}</Typography>}
      />
      <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column' }}>
        {items.map((item, idx) => (
          <FormControlLabel
            key={idx}
            control={<Checkbox size="small" />}
            label={<Typography sx={{ fontSize: '0.75rem' }}>{item}</Typography>}
            sx={{ mb: -0.5 }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 3, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Deposit Summary:
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={7}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a3a6b', mb: 1, borderBottom: '1px solid #e0e0e0', pb: 0.5 }}>
            Create new deposit summary:
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.85rem' }}>Transactions Date Range:</Typography>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                size="small"
                variant="standard"
                sx={{ fontSize: '0.85rem', minWidth: 100 }}
              >
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
              </Select>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b' }}>← May 08, 2026 →</Typography>
              <Typography sx={{ fontSize: '0.85rem' }}>Date: 05/08/2026</Typography>
            </Box>
          </Box>

          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 2 }}>Include payment types</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <CheckboxGroup title="Patient payment types" items={PAYMENT_TYPES} />
            </Grid>
            <Grid item xs={4}>
              <CheckboxGroup title="Insurance payment types" items={PAYMENT_TYPES.slice(0, 15)} />
            </Grid>
            <Grid item xs={4}>
              <CheckboxGroup title="Include refund payment types" items={PAYMENT_TYPES.slice(0, 15)} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <CheckboxGroup title="Include Deposits" items={PAYMENT_TYPES.slice(0, 5)} />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end', borderTop: '1px solid #e0e0e0', pt: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#5c85bb',
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                px: 3,
                '&:hover': { backgroundColor: '#4a74a8' }
              }}
            >
              Create Deposit
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#dcb265',
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                px: 3,
                '&:hover': { backgroundColor: '#c99f54' }
              }}
            >
              Create Template
            </Button>
          </Box>
        </Grid>

        {/* Divider */}
        <Grid item xs={false} md={0.5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2, borderColor: '#5c85bb' }} />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
             <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a3a6b', borderBottom: '1px solid #1a3a6b', pb: 0.5 }}>
              Deposit summary:
            </Typography>
             <Button
              variant="contained"
              sx={{
                backgroundColor: '#dcb265',
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                minWidth: 60,
                height: 30,
                '&:hover': { backgroundColor: '#c99f54' }
              }}
            >
              Print
            </Button>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#333', mb: 1 }}>
              No summary create.
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#666' }}>
              Create a deposit summary by editing the left side options and clicking 'create'.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepositSummary;

