import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Checkbox,
  Paper,
  Stack,
  Divider,
  Alert,
  IconButton,
  TextField,
  MenuItem,
  Select,
  Button,
  Grid,
  InputAdornment,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  CheckCircle,
  NavigateNext,
} from '@mui/icons-material';

import PaymentDetailsForm from './PaymentDetailsForm';

const SummaryItem = ({ label, value }) => (
  <Box sx={{ minWidth: '140px' }}>
    <Typography variant="caption" sx={{ color: '#555', display: 'block', fontSize: '11px' }}>
      {label}: <Box component="span" sx={{ fontWeight: 'bold' }}>{value || '$0.00'}</Box>
    </Typography>
  </Box>
);

const PaymentPlanRow = ({ id, date, amount, initials, summary = {} }) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
    <Checkbox size="small" sx={{ p: 0 }} />
    <Paper
      elevation={0}
      sx={{
        flexGrow: 1,
        p: '8px 16px',
        border: '1px solid #a5b4fc',
        borderRadius: '4px',
        bgcolor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
          <CheckCircle sx={{ color: '#8bc34a', fontSize: 22 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '12px', color: '#333' }}>
              INVOICE #{id} ({date}) {amount}
            </Typography>
            
            <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
              <Box>
                <SummaryItem label="Ins WO" value={summary.insWo} />
                <SummaryItem label="Applied WO" value={summary.appliedWo} />
              </Box>
              <Box>
                <SummaryItem label="Pt Balance" value={summary.ptBalance} />
                <SummaryItem label="Pt Paid" value={summary.ptPaid} />
              </Box>
              <Box>
                <SummaryItem label="Ins Balance" value={summary.insBalance} />
                <SummaryItem label="Ins Paid" value={summary.insPaid} />
              </Box>
              <Box>
                <SummaryItem label="Invoice Balance" value={summary.invoiceBalance} />
              </Box>
            </Box>
          </Box>
        </Stack>
        <Typography variant="caption" sx={{ color: '#cfd8dc', fontWeight: 'bold', fontSize: '11px', alignSelf: 'flex-end', mb: 0.5 }}>
          {initials}
        </Typography>
      </Box>
    </Paper>
  </Stack>
);

const NewPaymentPlan = ({ onBack, items = [] }) => {
  const [scheduleType, setScheduleType] = React.useState('Month');
  const [showAddCard, setShowAddCard] = React.useState(false);
  
  const planItems = items.length > 0 ? items : [
    { id: '24636', date: '04/15/2026', amount: '$100.00', initials: 'MAG', summary: { insWo: '$0.00', appliedWo: '$0.00', ptBalance: '$0.00', ptPaid: '$0.00', insBalance: '$0.00', insPaid: '$0.00', invoiceBalance: '$0.00' } },
    { id: '24635', date: '04/15/2026', amount: '$100.00', initials: 'MAG', summary: { insWo: '$0.00', appliedWo: '$0.00', ptBalance: '$0.00', ptPaid: '$0.00', insBalance: '$0.00', insPaid: '$0.00', invoiceBalance: '$0.00' } },
    { id: '24634', date: '04/15/2026', amount: '$100.00', initials: 'MAG', summary: { insWo: '$0.00', appliedWo: '$0.00', ptBalance: '$0.00', ptPaid: '$0.00', insBalance: '$0.00', insPaid: '$0.00', invoiceBalance: '$0.00' } },
    { id: '24633', date: '04/15/2026', amount: '$100.00', initials: 'MAG', summary: { insWo: '$0.00', appliedWo: '$0.00', ptBalance: '$0.00', ptPaid: '$0.00', insBalance: '$0.00', insPaid: '$0.00', invoiceBalance: '$0.00' } },
  ];
  return (
    <Box sx={{ p: 2, bgcolor: '#fff', minHeight: '100vh' }}>
      <Dialog 
        open={showAddCard} 
        onClose={() => setShowAddCard(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <PaymentDetailsForm onBack={() => setShowAddCard(false)} />
        </DialogContent>
      </Dialog>
      {/* Alert Banner */}
      <Alert 
        severity="error" 
        icon={false}
        sx={{ 
          mb: 3, 
          bgcolor: '#ffebee', 
          color: '#d32f2f', 
          border: 'none',
          '& .MuiAlert-message': { width: '100%', textAlign: 'center' }
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '12px' }}>
          This patient has no credit card registered on their profile. Please <Link href="#" onClick={() => setShowAddCard(true)} sx={{ color: '#0288d1', textDecoration: 'underline', cursor: 'pointer' }}>add a card</Link> before creating a payment plan.
        </Typography>
      </Alert>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" sx={{ color: '#0288d1' }} />} 
        sx={{ mb: 2 }}
      >
        <Link 
          underline="hover" 
          color="#0288d1" 
          href="#" 
          onClick={onBack}
          sx={{ fontSize: '14px' }}
        >
          Finance
        </Link>
        <Typography color="#333" sx={{ fontSize: '14px' }}>
          New Payment Plan
        </Typography>
      </Breadcrumbs>

      <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
        Patient: test test
      </Typography>

      {/* Invoice List */}
      <Box sx={{ maxWidth: '100%', mb: 4 }}>
        {planItems.map((item) => (
          <PaymentPlanRow 
            key={item.id}
            id={item.id}
            date={item.date}
            amount={item.amount}
            initials={item.initials}
            summary={item.summary}
          />
        ))}
      </Box>

      {/* Terms Section */}
      <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #eee' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4, color: '#333', fontSize: '18px' }}>
          Terms
        </Typography>

        <Grid container spacing={4}>
          {/* Down Payment Field */}
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '13px' }}>
              Down Payment
            </Typography>
            <TextField
              fullWidth
              placeholder="0.00"
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ '& .MuiTypography-root': { fontSize: '13px' } }}>$</InputAdornment>,
                sx: { fontSize: '13px' }
              }}
            />
          </Grid>

          {/* Exclude Amount Field */}
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '13px' }}>
              Exclude Amount
            </Typography>
            <TextField
              fullWidth
              placeholder="0.00"
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ '& .MuiTypography-root': { fontSize: '13px' } }}>$</InputAdornment>,
                sx: { fontSize: '13px' }
              }}
            />
          </Grid>
        </Grid>

        {/* Payment Schedule Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2, fontSize: '13px' }}>
            Payment Schedule*
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontSize: '13px' }}>Every</Typography>
            <TextField
              defaultValue="1"
              size="small"
              sx={{ width: 80, '& .MuiInputBase-input': { fontSize: '13px' } }}
            />
            
            <Select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              size="small"
              sx={{ width: 120, bgcolor: '#f5f5f5', fontSize: '13px' }}
            >
              <MenuItem value="Month" sx={{ fontSize: '13px' }}>Month</MenuItem>
              <MenuItem value="Week" sx={{ fontSize: '13px' }}>Week</MenuItem>
            </Select>

            <Typography variant="body2" sx={{ fontSize: '13px' }}>For</Typography>
            <TextField
              defaultValue="12"
              size="small"
              sx={{ width: 80, '& .MuiInputBase-input': { fontSize: '13px' } }}
            />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>{scheduleType}/s</Typography>
          </Box>
        </Box>

        {/* Create Plan Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 8 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#94a3b8',
              textTransform: 'none',
              borderRadius: '20px',
              px: 6,
              py: 1,
              fontSize: '14px',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#64748b',
              },
            }}
          >
            Create Plan
          </Button>
        </Box>
      </Box>

      {/* Side Tab Placeholder */}
      <Box 
        sx={{ 
          position: 'fixed', 
          right: 0, 
          top: '50%', 
          bgcolor: '#0d47a1', 
          color: '#fff', 
          p: 1, 
          borderRadius: '4px 0 0 4px',
          cursor: 'pointer'
        }}
      >
        <Box sx={{ width: 12, height: 24 }} />
      </Box>
    </Box>
  );
};

export default NewPaymentPlan;
