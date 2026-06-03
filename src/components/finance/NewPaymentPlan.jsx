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
import { invoiceService } from '../../services/invoice.service';

const SummaryItem = ({ label, value }) => (
  <Box sx={{ minWidth: '140px' }}>
    <Typography variant="caption" sx={{ color: '#555', display: 'block', fontSize: '11px' }}>
      {label}: <Box component="span" sx={{ fontWeight: 'bold' }}>{value || '$0.00'}</Box>
    </Typography>
  </Box>
);

const PaymentPlanRow = ({ id, date, amount, initials, checked, onToggle, summary = {} }) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
    <Checkbox 
      size="small" 
      sx={{ p: 0 }} 
      checked={checked}
      onChange={onToggle}
    />
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

const NewPaymentPlan = ({ patient, onBack, onCreatePlan, items = [] }) => {
  const [scheduleType, setScheduleType] = React.useState('Month');
  const [showAddCard, setShowAddCard] = React.useState(false);
  const [invoices, setInvoices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = React.useState([]);
  
  // Terms states
  const [downPayment, setDownPayment] = React.useState('0.00');
  const [excludeAmount, setExcludeAmount] = React.useState('0.00');
  const [scheduleEvery, setScheduleEvery] = React.useState('1');
  const [numberOfPayments, setNumberOfPayments] = React.useState('12');

  React.useEffect(() => {
    const fetchInvoices = async () => {
      const patientId = patient?.id || patient?._id;
      if (!patientId) return;
      try {
        setLoading(true);
        const data = await invoiceService.getInvoicesByPatient(patientId);
        const list = data.invoices || [];
        setInvoices(list);
        setSelectedInvoiceIds(list.map(inv => inv.id));
      } catch (err) {
        console.error('Error fetching invoices for payment plan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [patient]);

  React.useEffect(() => {
    if (invoices.length === 0) {
      setSelectedInvoiceIds(['24636', '24635', '24634', '24633']);
    }
  }, [invoices]);

  const mapInvoiceToPlanRow = (inv) => {
    const ptBalance = inv.patientPortion !== undefined ? inv.patientPortion - (inv.ptPaid || 0) : inv.balanceDue;
    const ptPaid = inv.ptPaid || 0;
    const insBalance = inv.insurancePortion !== undefined ? inv.insurancePortion - (inv.insPaid || 0) : 0;
    const insPaid = inv.insPaid || 0;
    const insWo = inv.insWriteOff || 0;
    
    return {
      id: inv.id || inv._id,
      date: inv.dateOfService ? new Date(inv.dateOfService).toLocaleDateString() : new Date().toLocaleDateString(),
      amount: `$${(inv.totalAmount || 0).toFixed(2)}`,
      initials: inv.provider ? `${inv.provider.firstName?.[0] || ''}${inv.provider.lastName?.[0] || ''}`.toUpperCase() || 'MAG' : 'MAG',
      balanceDue: inv.balanceDue || 0,
      summary: {
        insWo: `$${Number(insWo).toFixed(2)}`,
        appliedWo: `$0.00`,
        ptBalance: `$${Number(ptBalance).toFixed(2)}`,
        ptPaid: `$${Number(ptPaid).toFixed(2)}`,
        insBalance: `$${Number(insBalance).toFixed(2)}`,
        insPaid: `$${Number(insPaid).toFixed(2)}`,
        invoiceBalance: `$${Number(inv.balanceDue).toFixed(2)}`
      }
    };
  };

  const handleToggleInvoice = (id) => {
    setSelectedInvoiceIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const planItems = invoices.length > 0 ? invoices : [
    { id: '24636', date: '04/15/2026', amount: '$100.00', initials: 'MAG', balanceDue: 100, summary: { insWo: '$0.00', appliedWo: '$0.00', ptBalance: '$100.00', ptPaid: '$0.00', insBalance: '$0.00', insPaid: '$0.00', invoiceBalance: '$100.00' } },
    { id: '24635', date: '04/15/2026', amount: '$100.00', initials: 'MAG', balanceDue: 100, summary: { insWo: '$0.00', appliedWo: '$0.00', ptBalance: '$100.00', ptPaid: '$0.00', insBalance: '$0.00', insPaid: '$0.00', invoiceBalance: '$100.00' } },
    { id: '24634', date: '04/15/2026', amount: '$100.00', initials: 'MAG', balanceDue: 100, summary: { insWo: '$0.00', appliedWo: '$0.00', ptBalance: '$100.00', ptPaid: '$0.00', insBalance: '$0.00', insPaid: '$0.00', invoiceBalance: '$100.00' } },
    { id: '24633', date: '04/15/2026', amount: '$100.00', initials: 'MAG', balanceDue: 100, summary: { insWo: '$0.00', appliedWo: '$0.00', ptBalance: '$100.00', ptPaid: '$0.00', insBalance: '$0.00', insPaid: '$0.00', invoiceBalance: '$100.00' } },
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
        Patient: {patient ? `${patient.firstName} ${patient.lastName}` : 'test test'}
      </Typography>

      {/* Invoice List */}
      <Box sx={{ maxWidth: '100%', mb: 4 }}>
        {planItems.map((item) => {
          const rowData = invoices.length > 0 ? mapInvoiceToPlanRow(item) : item;
          const itemId = rowData.id;
          return (
            <PaymentPlanRow 
              key={itemId}
              id={itemId}
              date={rowData.date}
              amount={rowData.amount}
              initials={rowData.initials}
              summary={rowData.summary}
              checked={selectedInvoiceIds.includes(itemId)}
              onToggle={() => handleToggleInvoice(itemId)}
            />
          );
        })}
      </Box>

      {/* Terms Section */}
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
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
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
              value={excludeAmount}
              onChange={(e) => setExcludeAmount(e.target.value)}
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
              value={scheduleEvery}
              onChange={(e) => setScheduleEvery(e.target.value)}
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
              value={numberOfPayments}
              onChange={(e) => setNumberOfPayments(e.target.value)}
              size="small"
              sx={{ width: 80, '& .MuiInputBase-input': { fontSize: '13px' } }}
            />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>{scheduleType}/s</Typography>
          </Box>
        </Box>

        {/* Calculation summary */}
        {(() => {
          const totalSelectedBalance = planItems
            .filter(item => selectedInvoiceIds.includes(item.id))
            .reduce((sum, item) => sum + (item.balanceDue || 0), 0);
          const numDownPayment = parseFloat(downPayment) || 0;
          const numExcludeAmount = parseFloat(excludeAmount) || 0;
          const planTotalAmount = Math.max(0, totalSelectedBalance - numExcludeAmount - numDownPayment);
          const numPayments = parseInt(numberOfPayments) || 12;
          const calculatedPayment = numPayments > 0 ? (planTotalAmount / numPayments).toFixed(2) : '0.00';

          return (
            <Box sx={{ mt: 5, p: 2, bgcolor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', maxWidth: '400px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#333', fontSize: '13px' }}>Plan Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '13px', color: '#666' }}>Selected Balance:</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold' }}>${totalSelectedBalance.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '13px', color: '#666' }}>Down Payment:</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: '#b64c4c' }}>-${numDownPayment.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '13px', color: '#666' }}>Excluded:</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: '#b64c4c' }}>-${numExcludeAmount.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Total Plan Amount:</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: '#1e40af' }}>${planTotalAmount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>{scheduleType}ly Payment:</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a' }}>${calculatedPayment} / {scheduleType.toLowerCase()}</Typography>
              </Box>
            </Box>
          );
        })()}

        {/* Create Plan Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 8 }}>
          <Button
            variant="contained"
            onClick={() => {
              const totalSelectedBalance = planItems
                .filter(item => selectedInvoiceIds.includes(item.id))
                .reduce((sum, item) => sum + (item.balanceDue || 0), 0);
              const numDownPayment = parseFloat(downPayment) || 0;
              const numExcludeAmount = parseFloat(excludeAmount) || 0;
              const planTotalAmount = Math.max(0, totalSelectedBalance - numExcludeAmount - numDownPayment);
              const numPayments = parseInt(numberOfPayments) || 12;
              const calculatedPayment = numPayments > 0 ? (planTotalAmount / numPayments).toFixed(2) : '0.00';

              if (onCreatePlan) {
                onCreatePlan({
                  totalAmount: planTotalAmount,
                  downPayment: numDownPayment,
                  monthlyPayment: parseFloat(calculatedPayment),
                  numberOfPayments: numPayments,
                  notes: `Payment Plan for Invoices: ${selectedInvoiceIds.join(', ')}. Schedule: Every ${scheduleEvery} ${scheduleType}s. Excluded: $${numExcludeAmount.toFixed(2)}`
                });
              }
            }}
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
