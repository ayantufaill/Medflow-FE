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
  DescriptionOutlined as DescriptionOutlinedIcon,
  PaymentOutlined as PaymentOutlinedIcon,
} from '@mui/icons-material';

import PaymentDetailsForm from './PaymentDetailsForm';
import { invoiceService } from '../../services/invoice.service';
import SectionCard from '../shared/SectionCard';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

const SummaryItem = ({ label, value }) => (
  <Box sx={{ minWidth: '140px' }}>
    <Typography variant="caption" sx={{ color: COLORS.TEXT_SECONDARY, display: 'block', fontSize: '11px' }}>
      {label}: <Box component="span" sx={{ fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>{value || '$0.00'}</Box>
    </Typography>
  </Box>
);

const PaymentPlanRow = ({ id, date, amount, initials, checked, onToggle, summary = {} }) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
    <Checkbox 
      size="small" 
      sx={{ p: 0, color: COLORS.BORDER, '&.Mui-checked': { color: COLORS.ACCENT } }} 
      checked={checked}
      onChange={onToggle}
    />
    <Paper
      elevation={0}
      sx={{
        flexGrow: 1,
        p: '8px 16px',
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.md,
        bgcolor: COLORS.SURFACE,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
          <CheckCircle sx={{ color: COLORS.STATUS_SUCCESS, fontSize: 22 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>
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
        <Typography variant="caption" sx={{ color: COLORS.TEXT_MUTED, fontWeight: fontWeight.semibold, fontSize: '11px', alignSelf: 'flex-end', mb: 0.5 }}>
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

  const planItems = invoices;
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: COLORS.BACKGROUND, minHeight: '100vh' }}>
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
        separator={<NavigateNext fontSize="small" sx={{ color: COLORS.ACCENT }} />} 
        sx={{ mb: 2 }}
      >
        <Link 
          underline="hover" 
          color={COLORS.ACCENT}
          href="#" 
          onClick={onBack}
          sx={{ fontSize: fontSize.sm }}
        >
          Finance
        </Link>
        <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: fontSize.sm }}>
          New Payment Plan
        </Typography>
      </Breadcrumbs>

      <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, fontSize: fontSize.lg }}>
        Patient: {patient ? `${patient.firstName} ${patient.lastName}` : 'test test'}
      </Typography>

      {/* Invoice List */}
      <SectionCard 
        icon={DescriptionOutlinedIcon} 
        title="Select Invoices" 
        subtitle="Choose which invoices to include in this payment plan"
      >
        <Box sx={{ maxWidth: '100%', pt: 2, pb: 1, px: 2 }}>
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
      </SectionCard>

      {/* Terms Section */}
      <SectionCard 
        icon={PaymentOutlinedIcon} 
        title="Terms" 
        subtitle="Set up the payment schedule and amounts"
      >
        <Box sx={{ pt: 3, pb: 2, px: 3 }}>
          <Grid container spacing={4}>
            {/* Down Payment Field */}
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" sx={{ fontWeight: fontWeight.semibold, mb: 1, fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>
                Down Payment
              </Typography>
            <TextField
              fullWidth
              placeholder="0.00"
              size="small"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ '& .MuiTypography-root': { fontSize: fontSize.sm } }}>$</InputAdornment>,
                sx: { fontSize: fontSize.sm, bgcolor: COLORS.SURFACE_INPUT, '& fieldset': { borderColor: COLORS.BORDER } }
              }}
            />
          </Grid>

          {/* Exclude Amount Field */}
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" sx={{ fontWeight: fontWeight.semibold, mb: 1, fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>
              Exclude Amount
            </Typography>
            <TextField
              fullWidth
              placeholder="0.00"
              size="small"
              value={excludeAmount}
              onChange={(e) => setExcludeAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ '& .MuiTypography-root': { fontSize: fontSize.sm } }}>$</InputAdornment>,
                sx: { fontSize: fontSize.sm, bgcolor: COLORS.SURFACE_INPUT, '& fieldset': { borderColor: COLORS.BORDER } }
              }}
            />
          </Grid>
        </Grid>

        {/* Payment Schedule Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="body2" sx={{ fontWeight: fontWeight.semibold, mb: 2, fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>
            Payment Schedule*
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>Every</Typography>
            <TextField
              value={scheduleEvery}
              onChange={(e) => setScheduleEvery(e.target.value)}
              size="small"
              sx={{ width: 80, bgcolor: COLORS.SURFACE_INPUT, '& fieldset': { borderColor: COLORS.BORDER }, '& .MuiInputBase-input': { fontSize: fontSize.sm } }}
            />
            
            <Select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              size="small"
              sx={{ width: 120, bgcolor: COLORS.SURFACE_INPUT, fontSize: fontSize.sm, '& fieldset': { borderColor: COLORS.BORDER } }}
            >
              <MenuItem value="Month" sx={{ fontSize: fontSize.sm }}>Month</MenuItem>
              <MenuItem value="Week" sx={{ fontSize: fontSize.sm }}>Week</MenuItem>
            </Select>

            <Typography variant="body2" sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>For</Typography>
            <TextField
              value={numberOfPayments}
              onChange={(e) => setNumberOfPayments(e.target.value)}
              size="small"
              sx={{ width: 80, bgcolor: COLORS.SURFACE_INPUT, '& fieldset': { borderColor: COLORS.BORDER }, '& .MuiInputBase-input': { fontSize: fontSize.sm } }}
            />
            <Typography variant="body2" sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_PRIMARY }}>{scheduleType}/s</Typography>
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
            <Box sx={{ mt: 5, p: 3, bgcolor: COLORS.SURFACE_TINT, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, maxWidth: '400px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: fontWeight.bold, mb: 1.5, color: COLORS.TEXT_PRIMARY, fontSize: fontSize.base }}>Plan Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>Selected Balance:</Typography>
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>${totalSelectedBalance.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>Down Payment:</Typography>
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: COLORS.STATUS_ERROR }}>-${numDownPayment.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>Excluded:</Typography>
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: COLORS.STATUS_ERROR }}>-${numExcludeAmount.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1.5, borderColor: COLORS.BORDER }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>Total Plan Amount:</Typography>
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: COLORS.ACCENT }}>${planTotalAmount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>{scheduleType}ly Payment:</Typography>
                <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.bold, color: COLORS.STATUS_SUCCESS }}>${calculatedPayment} / {scheduleType.toLowerCase()}</Typography>
              </Box>
            </Box>
          );
        })()}

        {/* Create Plan Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
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
              bgcolor: COLORS.PRIMARY,
              textTransform: 'none',
              borderRadius: radius.md,
              px: 6,
              py: 1,
              fontSize: fontSize.sm,
              fontWeight: fontWeight.semibold,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: COLORS.PRIMARY_HOVER,
                boxShadow: 'none',
              },
            }}
          >
            Create Plan
          </Button>
        </Box>
      </Box>
    </SectionCard>
  </Box>
  );
};

export default NewPaymentPlan;
