import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnDepositedPayments, fetchPaymentMethodsConfig } from '../../../../store/slices/depositSlice';

import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import dayjs from 'dayjs';
import DepositSlipFilters from '../../../../components/reports/financial/DepositSlipFilters';
import DepositSummaryPreview from '../../../../components/reports/financial/DepositSummaryPreview';
import medflowLogo from '../../../../assets/medflow-logo.png';



const DepositSummary = () => {
  const dispatch = useDispatch();
  const { unDeposited, paymentMethodsConfig, loading } = useSelector((state) => state.deposits || { unDeposited: { patientPayments: [], insurancePayments: [], depositPayments: [] }, paymentMethodsConfig: { patient: [], insurance: [], refund: [], deposit: [] }, loading: false });

  const METHOD_ALIASES = {
    'card': ['debit card (debit)', 'visa card', 'master card', 'amex', 'testing credit', 'credit card'],
    'credit_card': ['debit card (debit)', 'visa card', 'master card', 'amex', 'testing credit', 'credit card'],
    'credit card': ['debit card (debit)', 'visa card', 'master card', 'amex', 'testing credit', 'credit card'],
    'ach': ['eft'],
    'eft': ['eft', 'ach'],
    'check': ['patient check', 'insurance check', 'check'],
    'patient check': ['patient check', 'check'],
    'insurance check': ['insurance check', 'check'],
    'cash': ['cash'],
  };

  const formatMethodLabel = (method) => {
    if (!method) return 'Check';
    const lower = method.toLowerCase().trim();
    if (lower === 'debit_card' || lower === 'debit card (debit)') return 'Debit Card (debit)';
    if (lower === 'card' || lower === 'credit_card') return 'Credit Card';
    if (lower === 'cash') return 'Cash';
    if (lower === 'ach' || lower === 'eft') return 'EFT';
    if (lower === 'check') return 'Check';
    return method;
  };

  const isMethodSelected = (method, selectedTypes) => {
    if (!method) return false;
    const lowerMethod = method.toLowerCase().trim();
    const lowerSelected = selectedTypes.map(t => t.toLowerCase().trim());
    if (lowerSelected.includes(lowerMethod)) return true;
    const aliases = METHOD_ALIASES[lowerMethod];
    if (aliases) return aliases.some(alias => lowerSelected.includes(alias));
    return false;
  };

  const location = useLocation();
  const templateData = location.state?.templateData;
  const [dateRangeType, setDateRangeType] = useState('Range');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [patientTypes, setPatientTypes] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [refundTypes, setRefundTypes] = useState([]);
  const [depositTypes, setDepositTypes] = useState([]);
  const [groupByProvider, setGroupByProvider] = useState(true);
  
  

  useEffect(() => {
    dispatch(fetchUnDepositedPayments());
    dispatch(fetchPaymentMethodsConfig());
  }, [dispatch]);

  const [groupedPayments, setGroupedPayments] = useState(null);

  const applyModeDates = (mode) => {
    const today = new Date();
    const getLocalDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const m = mode.toLowerCase();
    if (m === 'daily') {
      const todayStr = getLocalDateString(today);
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (m === 'weekly') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(today.setDate(diff));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      setFromDate(getLocalDateString(startOfWeek));
      setToDate(getLocalDateString(endOfWeek));
    } else if (m === 'monthly') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setFromDate(getLocalDateString(startOfMonth));
      setToDate(getLocalDateString(endOfMonth));
    } else if (m === 'range') {
      setToDate(getLocalDateString(today));
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      setFromDate(getLocalDateString(lastMonth));
    }
  };

  useEffect(() => {
    if (templateData && templateData.filters) {
      templateData.filters.forEach(f => {
        if (f.type === 'mode') {
          setDateRangeType(f.value);
          applyModeDates(f.value);
        }
        if (f.type === 'patientPayTypes') setPatientTypes(f.value);
        if (f.type === 'insPayTypes') setInsuranceTypes(f.value);
        if (f.type === 'refPayTypes') setRefundTypes(f.value);
        if (f.type === 'incDepTypes') setDepositTypes(f.value);
      });
    } else {
      applyModeDates('Range');
    }
  }, [templateData]);

  useEffect(() => {
    if (templateData && templateData.filters) return;
    if (paymentMethodsConfig && paymentMethodsConfig.insurance?.length > 0) {
      if (patientTypes.length === 0) setPatientTypes(paymentMethodsConfig.patient || []);
      if (insuranceTypes.length === 0) setInsuranceTypes(paymentMethodsConfig.insurance || []);
      if (refundTypes.length === 0) setRefundTypes(paymentMethodsConfig.refund || []);
      if (depositTypes.length === 0) setDepositTypes(paymentMethodsConfig.deposit || []);
    }
  }, [paymentMethodsConfig, templateData]);

  

  
  const handleApplyFilters = () => {
    const pts = unDeposited.patientPayments || [];
    const inss = unDeposited.insurancePayments || [];
    const deps = unDeposited.depositPayments || [];
    const combined = [...pts, ...inss, ...deps];
    filterAndGroupPayments(combined);
  };


  const filterAndGroupPayments = (payments) => {
    const getLocalDateOnly = (dateVal) => {
      if (!dateVal) return '';
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const combinedPatientTypes = [...patientTypes];
    const combinedInsTypes = [...insuranceTypes];

    let filtered = payments.filter(p => {
      let isSelected = false;
      if (p.type === 'insurance') {
        isSelected = p.amount < 0 ? isMethodSelected(p.method, refundTypes) : isMethodSelected(p.method, combinedInsTypes);
      } else if (p.type === 'patient') {
        isSelected = p.amount < 0 ? isMethodSelected(p.method, refundTypes) : isMethodSelected(p.method, combinedPatientTypes);
      } else if (p.type === 'deposit') {
        isSelected = isMethodSelected(p.method, depositTypes);
      } else {
        isSelected = isMethodSelected(p.method, [...combinedPatientTypes, ...combinedInsTypes, ...depositTypes]);
      }

      if (!isSelected) return false;

      if (p.date && fromDate && toDate) {
        const pDate = getLocalDateOnly(p.date);
        if (pDate < fromDate || pDate > toDate) return false;
      }
      return true;
    });

    const groups = {};
    filtered.forEach(p => {
      const d = p.date ? getLocalDateOnly(p.date) : 'Unknown Date';
      if (!groups[d]) {
        groups[d] = {
          date: d,
          types: {},
          dailyTotal: 0,
          payments: []
        };
      }
      const typeKey = groupByProvider ? (p.providerName || p.provider || 'Unassigned Provider') : formatMethodLabel(p.method);
      if (!groups[d].types[typeKey]) groups[d].types[typeKey] = 0;
      groups[d].types[typeKey] += p.amount;
      groups[d].dailyTotal += p.amount;
      groups[d].payments.push(p);
    });

    const groupedArray = Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date));
    setGroupedPayments(groupedArray);
  };


  const handlePrint = () => {
    const tableEl = document.getElementById('deposit-summary-table');
    if (!tableEl) return;
    
    const htmlContent = `
      <html>
        <head>
          <title>Deposit Summary</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }
            .MuiCheckbox-root, input[type="checkbox"], button, .no-print, svg { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" onerror="this.style.display='none'" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Deposit Summary</h2>
          <p style="text-align: center; margin-bottom: 20px;">Date Range: ${fromDate} to ${toDate}</p>
          <div style="text-align: center; margin-bottom: 20px; font-weight: bold; font-size: 14px;">Total Summary Amount: $${overallTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 10px;">
            ${tableEl.outerHTML}
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.srcdoc = htmlContent;

    iframe.onload = () => {
      iframe.contentWindow.onafterprint = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };

    document.body.appendChild(iframe);
  };

  const CheckboxGroup = ({ title, items, selected, setSelected }) => {
    const handleToggleAll = (e) => {
      if (e.target.checked) setSelected([...items]);
      else setSelected([]);
    };

    const handleToggle = (item) => {
      if (selected.includes(item)) setSelected(selected.filter(i => i !== item));
      else setSelected([...selected, item]);
    };

    const allSelected = items.length > 0 && selected.length === items.length;

    return (
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Checkbox size="small" checked={allSelected} onChange={handleToggleAll} />}
          label={<Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>}
        />
        <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
          {items.map((item, idx) => (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox 
                  size="small" 
                  checked={selected.includes(item)} 
                  onChange={() => handleToggle(item)}
                />
              }
              label={<Typography variant="caption">{item}</Typography>}
              sx={{ my: -0.5 }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const overallTotal = groupedPayments 
    ? groupedPayments.reduce((sum, g) => sum + g.dailyTotal, 0)
    : 0;

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" className="no-print" sx={{ mb: 2, fontWeight: 700, color: '#1e293b' }}>
        Deposit Summary:
      </Typography>

      <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Left Column - Filters */}
        <Grid item xs={12} md={8}>
          <DepositSlipFilters
            title="Create new deposit summary:"
            buttonText="Apply Filters"
            extraButtons={
              <>
                <Button onClick={handleApplyFilters} variant="outlined" size="small" sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', px: 2, fontWeight: 600, bgcolor: '#fff', whiteSpace: 'nowrap', boxShadow: 'none' }}>Preview Deposit</Button>
              </>
            }
            filterMode={dateRangeType.toLowerCase()}
            handleFilterModeChange={(e) => {
              setDateRangeType(e.target.value);
              applyModeDates(e.target.value);
            }}
            startDate={fromDate ? dayjs(fromDate) : null}
            setStartDate={(v) => setFromDate(v ? v.format('YYYY-MM-DD') : '')}
            endDate={toDate ? dayjs(toDate) : null}
            setEndDate={(v) => setToDate(v ? v.format('YYYY-MM-DD') : '')}
            
            patientPaymentTypesOptions={paymentMethodsConfig.patient || []}
            insurancePaymentTypesOptions={paymentMethodsConfig.insurance || []}
            refundPaymentTypesOptions={paymentMethodsConfig.refund || []}
            includeDepositTypesOptions={paymentMethodsConfig.deposit || []}
            patientPayTypes={patientTypes}
            patPayAll={patientTypes.length > 0 && patientTypes.length === (paymentMethodsConfig.patient?.length || 0)}
            insPayTypes={insuranceTypes}
            insPayAll={insuranceTypes.length > 0 && insuranceTypes.length === (paymentMethodsConfig.insurance?.length || 0)}
            refPayTypes={refundTypes}
            refPayAll={refundTypes.length > 0 && refundTypes.length === (paymentMethodsConfig.refund?.length || 0)}
            incDepTypes={depositTypes}
            incDepAll={depositTypes.length > 0 && depositTypes.length === (paymentMethodsConfig.deposit?.length || 0)}
            groupByProvider={groupByProvider}
            onGroupByProviderChange={setGroupByProvider}
            handleToggleAll={(type, checked) => {
              if (type === 'patient') setPatientTypes(checked ? [...(paymentMethodsConfig.patient || [])] : []);
              else if (type === 'insurance') setInsuranceTypes(checked ? [...(paymentMethodsConfig.insurance || [])] : []);
              else if (type === 'refund') setRefundTypes(checked ? [...(paymentMethodsConfig.refund || [])] : []);
              else if (type === 'include') setDepositTypes(checked ? [...(paymentMethodsConfig.deposit || [])] : []);
            }}
            handleToggleItem={(type, item, checked) => {
              if (type === 'patient') setPatientTypes(checked ? [...patientTypes, item] : patientTypes.filter(x => x !== item));
              else if (type === 'insurance') setInsuranceTypes(checked ? [...insuranceTypes, item] : insuranceTypes.filter(x => x !== item));
              else if (type === 'refund') setRefundTypes(checked ? [...refundTypes, item] : refundTypes.filter(x => x !== item));
              else if (type === 'include') setDepositTypes(checked ? [...depositTypes, item] : depositTypes.filter(x => x !== item));
            }}
            showTemplateForm={false}
            setShowTemplateForm={() => {}}
            templateName=""
            setTemplateName={() => {}}
            savingTemplate={false}
            handleSaveTemplate={() => {}}
            handleCreateDepositClick={handleApplyFilters}
            loading={loading}
          />
        </Grid>

        {/* Right Column - Preview */}
        <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '8px', height: '100%' }}>
            <DepositSummaryPreview
              groupedPayments={groupedPayments}
              overallTotal={overallTotal}
              handlePrint={handlePrint}
              groupByProvider={groupByProvider}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepositSummary;
