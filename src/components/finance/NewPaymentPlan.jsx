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
  DialogTitle,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle,
  NavigateNext,
  DescriptionOutlined as DescriptionOutlinedIcon,
  PaymentOutlined as PaymentOutlinedIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';


import { invoiceService } from '../../services/invoice.service';
import SectionCard from '../shared/SectionCard';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

const PaymentPlanRow = ({ id, date, amount, initials, checked, onToggle, summary = {} }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
    <Checkbox 
      size="small" 
      sx={{ p: 0, color: COLORS.BORDER, '&.Mui-checked': { color: COLORS.ACCENT } }} 
      checked={checked}
      onChange={onToggle}
    />
    <Box sx={{
      border: '1px solid #DFE5EC',
      borderRadius: '18px',
      bgcolor: '#FFFFFF',
      overflow: 'hidden',
      flexGrow: 1
    }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: '16px 24px',
          bgcolor: '#F8FAFC',
        }}
      >
        {/* Left: Icon & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 280 }}>
          <CheckCircle sx={{ color: '#42C070', fontSize: '20px' }} />
          <Typography sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '14px', textTransform: 'uppercase' }}>
            INVOICE #{id} ({date}) {amount}
          </Typography>
        </Box>

        {/* Middle: Balances Grid */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 6 }}>
          {/* Column 1 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 1, rowGap: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Ins WO:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{summary.insWo}</Typography>

            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Applied WO:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{summary.appliedWo}</Typography>
          </Box>

          {/* Column 2 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 1, rowGap: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Pt Balance:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{summary.ptBalance}</Typography>

            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Pt Paid:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{summary.ptPaid}</Typography>
          </Box>

          {/* Column 3 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 1, rowGap: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Ins Balance:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{summary.insBalance}</Typography>

            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Ins Paid:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{summary.insPaid}</Typography>
          </Box>

          {/* Column 4 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 1, rowGap: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Invoice Balance:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px', whiteSpace: 'nowrap' }}>
              {summary.invoiceBalance}
            </Typography>
          </Box>
        </Box>

        {/* Right: Initials */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#6B778C', fontWeight: 600, fontSize: '11px' }}>
            {initials}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Stack>
);

const NewPaymentPlan = ({ patient, onBack, onCreatePlan, onAddCard, items = [] }) => {
  const [scheduleType, setScheduleType] = React.useState('Month');
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
        const list = (data.invoices || []).filter(inv => 
          (inv.balanceDue > 0) && 
          String(inv.status).toLowerCase() !== 'voided' && 
          String(inv.status).toLowerCase() !== 'void'
        );
        setInvoices(list);
        setSelectedInvoiceIds(list.map(inv => inv.id || inv._id));
      } catch (err) {
        console.error('Error fetching invoices for payment plan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [patient]);


  const mapInvoiceToPlanRow = (inv) => {
    const ptPaid = inv.paidAmount || inv.ptPaid || 0;
    const ptBalance = inv.patientPortion !== undefined ? inv.patientPortion - ptPaid : inv.balanceDue;
    const insPaid = inv.insPaid || 0;
    const insBalance = inv.insurancePortion !== undefined ? inv.insurancePortion - insPaid : 0;
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
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '14px', overflow: 'hidden' }}>
      {/* Header Bar */}
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '25px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <PaymentOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Create Payment Plan
        </Typography>
        <IconButton onClick={onBack} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: '25px', py: '20px', pt: '25px !important', display: 'flex', flexDirection: 'column', gap: 2.5, maxHeight: '70vh', overflowY: 'auto', bgcolor: COLORS.BACKGROUND }}>

        {/* Alert Banner */}
        <Box sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '12px',
        }}>
          <ErrorOutlineIcon sx={{ color: '#EF4444', fontSize: '20px' }} />
          <Typography sx={{ fontSize: '13px', color: '#991B1B', fontWeight: 500 }}>
            This patient has no credit card registered on their profile. Please{' '}
            <Link 
              href="#" 
              onClick={(e) => { e.preventDefault(); onAddCard?.(); }} 
              sx={{ color: '#2362EF', textDecoration: 'underline', fontWeight: 600, cursor: 'pointer' }}
            >
              add a card
            </Link>{' '}
            before creating a payment plan.
          </Typography>
        </Box>

      {/* Invoice List */}
      <SectionCard 
        icon={DescriptionOutlinedIcon} 
        title="Select Invoices" 
        subtitle="Choose which invoices to include in this payment plan"
        sx={{ flexShrink: 0, mb: 0 }}
      >
        <Box sx={{ maxWidth: '100%', pt: 2, pb: 0.5, px: 2 }}>
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
        sx={{ flexShrink: 0, mb: 0 }}
      >
        <Box sx={{ pt: 3, pb: 2, px: 3, display: 'flex', gap: 6, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          {/* Left Column (Inputs) */}
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '50%' } }}>
          <Grid container spacing={4}>
            {/* Down Payment Field */}
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '13px', color: '#1A1A1A' }}>
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
                sx: { fontSize: '13px', bgcolor: '#FFFFFF', borderRadius: '8px', '& fieldset': { borderColor: '#DFE5EC' } }
              }}
            />
          </Grid>

          {/* Exclude Amount Field */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '13px', color: '#1A1A1A' }}>
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
                sx: { fontSize: '13px', bgcolor: '#FFFFFF', borderRadius: '8px', '& fieldset': { borderColor: '#DFE5EC' } }
              }}
            />
          </Grid>
        </Grid>

        {/* Payment Schedule Section */}
        <Box sx={{ mt: 5 }}>
          <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '13px', color: '#1A1A1A' }}>
            Payment Schedule*
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '13px', color: '#1A1A1A' }}>Every</Typography>
            <TextField
              value={scheduleEvery}
              onChange={(e) => setScheduleEvery(e.target.value)}
              size="small"
              sx={{ width: 80, '& .MuiOutlinedInput-root': { bgcolor: '#FFFFFF', borderRadius: '8px' }, '& fieldset': { borderColor: '#DFE5EC' }, '& .MuiInputBase-input': { fontSize: '13px' } }}
            />
            
            <Select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              size="small"
              sx={{ width: 120, bgcolor: '#FFFFFF', borderRadius: '8px', fontSize: '13px', '& fieldset': { borderColor: '#DFE5EC' } }}
            >
              <MenuItem value="Month" sx={{ fontSize: '13px' }}>Month</MenuItem>
              <MenuItem value="Week" sx={{ fontSize: '13px' }}>Week</MenuItem>
            </Select>

            <Typography sx={{ fontSize: '13px', color: '#1A1A1A' }}>For</Typography>
            <TextField
              value={numberOfPayments}
              onChange={(e) => setNumberOfPayments(e.target.value)}
              size="small"
              sx={{ width: 80, '& .MuiOutlinedInput-root': { bgcolor: '#FFFFFF', borderRadius: '8px' }, '& fieldset': { borderColor: '#DFE5EC' }, '& .MuiInputBase-input': { fontSize: '13px' } }}
            />
            <Typography sx={{ fontSize: '13px', color: '#1A1A1A' }}>{scheduleType}/s</Typography>
          </Box>
        </Box>
        </Box>

        {/* Right Column (Summary) */}
        <Box sx={{ minWidth: '350px' }}>
        {/* Calculation summary */}
        {(() => {
          const totalSelectedBalance = planItems
            .filter(item => selectedInvoiceIds.includes(item.id || item._id))
            .reduce((sum, item) => sum + (item.balanceDue || 0), 0);
          const numDownPayment = parseFloat(downPayment) || 0;
          const numExcludeAmount = parseFloat(excludeAmount) || 0;
          const planTotalAmount = Math.max(0, totalSelectedBalance - numExcludeAmount - numDownPayment);
          const numPayments = parseInt(numberOfPayments) || 12;
          const calculatedPayment = numPayments > 0 ? (planTotalAmount / numPayments).toFixed(2) : '0.00';

          return (
            <Box sx={{ p: '24px', bgcolor: '#F8FAFC', borderRadius: '18px', border: '1px solid #DFE5EC', width: '100%' }}>
              <Typography sx={{ fontWeight: 600, mb: 2, color: '#1A1A1A', fontSize: '14px' }}>Plan Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '13px', color: '#6B778C' }}>Selected Balance:</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>${totalSelectedBalance.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '13px', color: '#6B778C' }}>Down Payment:</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>-${numDownPayment.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '13px', color: '#6B778C' }}>Excluded:</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>-${numExcludeAmount.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1.5, borderColor: '#DFE5EC' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>Total Plan Amount:</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#2362EF' }}>${planTotalAmount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{scheduleType}ly Payment:</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#42C070' }}>${calculatedPayment} / {scheduleType.toLowerCase()}</Typography>
              </Box>
            </Box>
          );
        })()}
        </Box>

        </Box>
      </SectionCard>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ p: '16px 25px', borderTop: `1px solid ${COLORS.BORDER}`, display: 'flex', justifyContent: 'flex-end', bgcolor: 'white' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const totalSelectedBalance = planItems
                .filter(item => selectedInvoiceIds.includes(item.id || item._id))
                .reduce((sum, item) => sum + (item.balanceDue || 0), 0);
              const numDownPayment = parseFloat(downPayment) || 0;
              const numExcludeAmount = parseFloat(excludeAmount) || 0;
              const planTotalAmount = Math.max(0, totalSelectedBalance - numExcludeAmount - numDownPayment);
              const numPayments = parseInt(numberOfPayments) || 12;
              const calculatedPayment = numPayments > 0 ? (planTotalAmount / numPayments).toFixed(2) : '0.00';

              if (onCreatePlan) {
                onCreatePlan({
                  invoiceIds: selectedInvoiceIds,
                  totalAmount: planTotalAmount,
                  downPayment: numDownPayment,
                  monthlyPayment: parseFloat(calculatedPayment),
                  numberOfPayments: numPayments,
                  notes: `Payment Plan for Invoices: ${selectedInvoiceIds.join(', ')}. Schedule: Every ${scheduleEvery} ${scheduleType}s. Excluded: $${numExcludeAmount.toFixed(2)}`
                });
              }
            }}
            sx={{
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: fontWeight.medium,
              borderRadius: radius.sm,
              height: '36px',
              px: 3,
              boxShadow: 'none',
              '&:hover': { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
            }}
          >
            Apply
          </Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default NewPaymentPlan;
