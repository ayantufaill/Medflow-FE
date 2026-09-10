import React, { useEffect, useState, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import {
  fetchDepositSlips,
  fetchUnDepositedPayments,
  createDepositSlip,
  fetchPaymentMethodsConfig,
} from '../../../../store/slices/depositSlice';
import { reportingService } from '../../../../services/reporting.service';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { PAYMENT_METHODS } from '../../../../constants/financeConstants';

import DepositSlipFilters from '../../../../components/reports/financial/DepositSlipFilters';
import DepositSlipPreview from '../../../../components/reports/financial/DepositSlipPreview';
import PreviousDepositSlipsTable from '../../../../components/reports/financial/PreviousDepositSlipsTable';

const DepositSlips = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const templateData = location.state?.templateData;
  const { slips, unDeposited, paymentMethodsConfig, loading } = useSelector((state) => state.deposits || { slips: [], unDeposited: { patientPayments: [], insurancePayments: [], depositPayments: [] }, paymentMethodsConfig: { patient: [], insurance: [], refund: [], deposit: [] }, loading: false });
  const [isSlipsExpanded, setIsSlipsExpanded] = useState(true);

  const [patientPayTypes, setPatientPayTypes] = useState([]);
  const [insPayTypes, setInsPayTypes] = useState([]);
  const [refPayTypes, setRefPayTypes] = useState([]);
  const [incDepTypes, setIncDepTypes] = useState([]);

  // Bug 6 fix: prevent auto-date override after user manually changes filter mode
  const hasUserChangedFilter = useRef(false);

  const formatMethodLabel = (method) => {
    if (!method) return 'Check';
    const lower = method.toLowerCase().trim();
    if (lower === 'card' || lower === 'credit_card') return 'Credit Card';
    if (lower === 'cash') return 'Cash';
    if (lower === 'ach' || lower === 'eft') return 'EFT';
    if (lower === 'check') return 'Check';
    return method;
  };

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

  const isMethodSelected = (method, selectedTypes) => {
    if (!method) return false;
    const lowerMethod = method.toLowerCase().trim();
    const lowerSelected = selectedTypes.map(t => t.toLowerCase().trim());

    // Direct match
    if (lowerSelected.includes(lowerMethod)) return true;

    // Check aliases
    const aliases = METHOD_ALIASES[lowerMethod];
    if (aliases) {
      return aliases.some(alias => lowerSelected.includes(alias));
    }

    return false;
  };

  const getLocalDateOnly = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [filterMode, setFilterMode] = useState('daily');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const [createdSlipDetails, setCreatedSlipDetails] = useState(null);
  const [depositNote, setDepositNote] = useState('');

  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);
  const templateTitle = templateData?.name;

  const [includeArchived, setIncludeArchived] = useState(true);
  const [groupByProvider, setGroupByProvider] = useState(true);

  useEffect(() => {
    if (templateData && templateData.filters) {
      templateData.filters.forEach(f => {
        if (f.type === 'mode') {
          setFilterMode(f.value);
          applyModeDates(f.value);
        }
        if (f.type === 'patientPayTypes') setPatientPayTypes(f.value);
        if (f.type === 'insPayTypes') setInsPayTypes(f.value);
        if (f.type === 'refPayTypes') setRefPayTypes(f.value);
        if (f.type === 'incDepTypes') setIncDepTypes(f.value);
      });
    }
  }, [templateData]);

  useEffect(() => {
    dispatch(fetchDepositSlips({ page: 1, limit: 50 }));
    dispatch(fetchUnDepositedPayments());
    dispatch(fetchPaymentMethodsConfig());
  }, [dispatch]);

  // Sync state once config loads, if not overridden by template
  useEffect(() => {
    if (templateData && templateData.filters) return;
    if (paymentMethodsConfig && paymentMethodsConfig.insurance?.length > 0) {
      if (patientPayTypes.length === 0) setPatientPayTypes(paymentMethodsConfig.patient || []);
      if (insPayTypes.length === 0) setInsPayTypes(paymentMethodsConfig.insurance || []);
      if (refPayTypes.length === 0) setRefPayTypes(paymentMethodsConfig.refund || []);
      if (incDepTypes.length === 0) setIncDepTypes(paymentMethodsConfig.deposit || []);
    }
  }, [paymentMethodsConfig, templateData]);

  // Bug 6 fix: don't override user's manual filter changes
  useEffect(() => {
    if (templateData) return;
    if (hasUserChangedFilter.current) return;

    const pts = unDeposited.patientPayments || [];
    const inss = unDeposited.insurancePayments || [];
    if (pts.length > 0 || inss.length > 0) {
      const allDates = [...pts, ...inss]
        .map((p) => p.date)
        .filter(Boolean)
        .map((d) => new Date(d).getTime());

      if (allDates.length > 0) {
        const minDateStr = dayjs(Math.min(...allDates));
        const maxDateStr = dayjs(Math.max(...allDates));
        setStartDate(minDateStr);
        setEndDate(maxDateStr);
        setFilterMode('range');
      }
    }
  }, [unDeposited]);

  const applyModeDates = (mode) => {
    const today = dayjs();
    if (mode === 'daily') {
      setStartDate(today);
      setEndDate(today);
    } else if (mode === 'weekly') {
      setStartDate(today.startOf('week'));
      setEndDate(today.endOf('week'));
    } else if (mode === 'monthly') {
      setStartDate(today.startOf('month'));
      setEndDate(today.endOf('month'));
    }
  };

  const handleFilterModeChange = (e) => {
    setCreatedSlipDetails(null);
    const newMode = e.target.value;
    hasUserChangedFilter.current = true; // Bug 6 fix
    setFilterMode(newMode);
    applyModeDates(newMode);
  };

  // Bug 1 + 8 fix: handleToggleAll now correctly uses the specific config lists
  const handleToggleAll = (type, checked) => {
    setCreatedSlipDetails(null);
    if (type === 'patient') {
      setPatientPayTypes(checked ? [...(paymentMethodsConfig.patient || [])] : []);
    } else if (type === 'insurance') {
      setInsPayTypes(checked ? [...(paymentMethodsConfig.insurance || [])] : []);
    } else if (type === 'refund') {
      setRefPayTypes(checked ? [...(paymentMethodsConfig.refund || [])] : []);
    } else if (type === 'include') {
      setIncDepTypes(checked ? [...(paymentMethodsConfig.deposit || [])] : []);
    }
  };

  const handleToggleItem = (type, item, checked) => {
    setCreatedSlipDetails(null);
    let list;
    if (type === 'patient') {
      list = checked ? [...patientPayTypes, item] : patientPayTypes.filter(x => x !== item);
      setPatientPayTypes(list);
    } else if (type === 'insurance') {
      list = checked ? [...insPayTypes, item] : insPayTypes.filter(x => x !== item);
      setInsPayTypes(list);
    } else if (type === 'refund') {
      list = checked ? [...refPayTypes, item] : refPayTypes.filter(x => x !== item);
      setRefPayTypes(list);
    } else if (type === 'include') {
      list = checked ? [...incDepTypes, item] : incDepTypes.filter(x => x !== item);
      setIncDepTypes(list);
    }
  };

  // Bug 8 fix: derive "all" state from actual data instead of separate state variables
  const patPayAll = patientPayTypes.length > 0 && patientPayTypes.length === (paymentMethodsConfig.patient?.length || 0);
  const insPayAll = insPayTypes.length > 0 && insPayTypes.length === (paymentMethodsConfig.insurance?.length || 0);
  const refPayAll = refPayTypes.length > 0 && refPayTypes.length === (paymentMethodsConfig.refund?.length || 0);
  const incDepAll = incDepTypes.length > 0 && incDepTypes.length === (paymentMethodsConfig.deposit?.length || 0);

  // Bug 2 fix: incDepTypes is now included in the filtering dependency and logic
  const { filteredPatientPayments, filteredInsurancePayments, filteredDepositPayments } = useMemo(() => {
    const startStr = startDate ? startDate.format('YYYY-MM-DD') : '';
    const endStr = endDate ? endDate.format('YYYY-MM-DD') : '';

    const combinedPatientTypes = [...patientPayTypes];
    const combinedInsTypes = [...insPayTypes];

    const pts = (unDeposited.patientPayments || []).filter((p) => {
      const isSelected = p.amount < 0
        ? isMethodSelected(p.method, refPayTypes)
        : isMethodSelected(p.method, combinedPatientTypes);

      if (!isSelected) return false;

      if (p.date && startStr && endStr) {
        const pDate = getLocalDateOnly(p.date);
        if (pDate < startStr || pDate > endStr) return false;
      }
      return true;
    });

    const inss = (unDeposited.insurancePayments || []).filter((ins) => {
      const isSelected = ins.amount < 0
        ? isMethodSelected(ins.method, refPayTypes)
        : isMethodSelected(ins.method, combinedInsTypes);

      if (!isSelected) return false;

      if (ins.date && startStr && endStr) {
        const insDate = getLocalDateOnly(ins.date);
        if (insDate < startStr || insDate > endStr) return false;
      }
      return true;
    });

    // Filter deposit (prepayment) payments using the "Include Deposit" checkboxes
    const deps = (unDeposited.depositPayments || []).filter((dep) => {
      const isSelected = isMethodSelected(dep.method, incDepTypes);
      if (!isSelected) return false;

      if (dep.date && startStr && endStr) {
        const depDate = getLocalDateOnly(dep.date);
        if (depDate < startStr || depDate > endStr) return false;
      }
      return true;
    });

    return { filteredPatientPayments: pts, filteredInsurancePayments: inss, filteredDepositPayments: deps };
  }, [unDeposited, patientPayTypes, insPayTypes, refPayTypes, incDepTypes, startDate, endDate]);

  const previewPayments = useMemo(() => {
    return [...filteredPatientPayments, ...filteredInsurancePayments, ...filteredDepositPayments];
  }, [filteredPatientPayments, filteredInsurancePayments, filteredDepositPayments]);

  const previewTotal = useMemo(() => {
    return previewPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [previewPayments]);

  const patientGroups = useMemo(() => {
    if (!createdSlipDetails) return {};
    const groups = {};
    createdSlipDetails.patientPayments.forEach((p) => {
      const groupKey = groupByProvider ? (p.providerName || p.provider || 'Unassigned Provider') : formatMethodLabel(p.method);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(p);
    });
    return groups;
  }, [createdSlipDetails, groupByProvider]);

  const insuranceGroups = useMemo(() => {
    if (!createdSlipDetails) return {};
    const groups = {};
    createdSlipDetails.insurancePayments.forEach((ins) => {
      const groupKey = groupByProvider ? (ins.providerName || ins.provider || 'Unassigned Provider') : formatMethodLabel(ins.method);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(ins);
    });
    return groups;
  }, [createdSlipDetails, groupByProvider]);

  const handleCreateDepositClick = async () => {
    const patientPaymentIds = [...filteredPatientPayments, ...filteredDepositPayments].map((p) => p.id);
    const insurancePaymentIds = filteredInsurancePayments.map((ins) => ins.id);

    if (patientPaymentIds.length === 0 && insurancePaymentIds.length === 0) {
      showSnackbar('No un-deposited payments found matching the selected filters.', 'warning');
      return;
    }

    try {
      const res = await dispatch(createDepositSlip({
        bankAccountInfo: 'Main Bank Account',
        memo: depositNote || `Deposit Slip - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        patientPaymentIds,
        insurancePaymentIds,
      })).unwrap();

      setCreatedSlipDetails({
        slip: res,
        patientPayments: [...filteredPatientPayments, ...filteredDepositPayments],
        insurancePayments: [...filteredInsurancePayments],
      });

      showSnackbar('Deposit slip created successfully!', 'success');
      dispatch(fetchUnDepositedPayments());
    } catch (err) {
      showSnackbar(err || 'Failed to create deposit slip.', 'error');
    }
  };

  const handleClear = () => {
    setCreatedSlipDetails(null);
    setDepositNote('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      showSnackbar("Please enter a template name.", 'warning');
      return;
    }

    let finalName = templateName.trim();
    if (filterMode === 'daily' && !finalName.toLowerCase().includes('daily')) {
      finalName = `Daily ${finalName}`;
    } else if (filterMode === 'weekly' && !finalName.toLowerCase().includes('weekly')) {
      finalName = `Weekly ${finalName}`;
    } else if (filterMode === 'monthly' && !finalName.toLowerCase().includes('monthly')) {
      finalName = `Monthly ${finalName}`;
    }

    try {
      setSavingTemplate(true);
      await reportingService.saveReport({
        name: finalName,
        kind: 'Financial',
        filters: [
          { type: 'mode', value: filterMode },
          { type: 'patientPayTypes', value: patientPayTypes },
          { type: 'insPayTypes', value: insPayTypes },
          { type: 'refPayTypes', value: refPayTypes },
          { type: 'incDepTypes', value: incDepTypes },
        ],
        columns: []
      });
      showSnackbar('Template saved successfully! It will now appear in Saved Reports.', 'success');
      setShowTemplateForm(false);
      setTemplateName('');
    } catch (err) {
      showSnackbar(err || 'Failed to save template.', 'error');
    } finally {
      setSavingTemplate(false);
    }
  };

  // Bug 7 fix: show actual data (or empty state), no mock fallback
  const displaySlips = slips || [];

  return (
    <Box sx={{ p: 0 }}>
      {templateTitle && (
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 700, color: '#1e293b' }}>
          {templateTitle}
        </Typography>
      )}
      <Typography variant="h6" className="no-print" sx={{ mb: 2, fontWeight: 700, color: '#1e293b' }}>
        Deposit Slips:
      </Typography>

      <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        <Grid item xs={12} md={8}>
          <DepositSlipFilters 
            filterMode={filterMode}
            handleFilterModeChange={handleFilterModeChange}
            startDate={startDate}
            setStartDate={(v) => { setCreatedSlipDetails(null); setStartDate(v); }}
            endDate={endDate}
            setEndDate={(v) => { setCreatedSlipDetails(null); setEndDate(v); }}
            patientPaymentTypesOptions={paymentMethodsConfig.patient || []}
            insurancePaymentTypesOptions={paymentMethodsConfig.insurance || []}
            refundPaymentTypesOptions={paymentMethodsConfig.refund || []}
            includeDepositTypesOptions={paymentMethodsConfig.deposit || []}
            patientPayTypes={patientPayTypes}
            patPayAll={patPayAll}
            insPayTypes={insPayTypes}
            insPayAll={insPayAll}
            refPayTypes={refPayTypes}
            refPayAll={refPayAll}
            incDepTypes={incDepTypes}
            incDepAll={incDepAll}
            handleToggleAll={handleToggleAll}
            handleToggleItem={handleToggleItem}
            showTemplateForm={showTemplateForm}
            setShowTemplateForm={setShowTemplateForm}
            templateName={templateName}
            setTemplateName={setTemplateName}
            savingTemplate={savingTemplate}
            handleSaveTemplate={handleSaveTemplate}
            handleCreateDepositClick={handleCreateDepositClick}
            loading={loading}
            includeArchived={includeArchived}
            onIncludeArchivedChange={setIncludeArchived}
            groupByProvider={groupByProvider}
            onGroupByProviderChange={setGroupByProvider}
          />
        </Grid>

        <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '8px', height: '100%' }}>
            <DepositSlipPreview 
              createdSlipDetails={createdSlipDetails}
              previewPayments={previewPayments}
              previewTotal={previewTotal}
              filteredPatientPayments={filteredPatientPayments}
              filteredInsurancePayments={filteredInsurancePayments}
              patientGroups={patientGroups}
              insuranceGroups={insuranceGroups}
              depositNote={depositNote}
              setDepositNote={setDepositNote}
              handlePrint={handlePrint}
              handleClear={handleClear}
              formatMethodLabel={formatMethodLabel}
            />
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} className="no-print" />

      <PreviousDepositSlipsTable 
        displaySlips={displaySlips}
        isSlipsExpanded={isSlipsExpanded}
        setIsSlipsExpanded={setIsSlipsExpanded}
      />

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #root, #root * {
            visibility: visible;
          }
        }
      `}</style>
    </Box>
  );
};

export default DepositSlips;
