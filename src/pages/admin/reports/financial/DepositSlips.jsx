import React, { useEffect, useState, useMemo } from 'react';
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
} from '../../../../store/slices/depositSlice';
import { reportingService } from '../../../../services/reporting.service';

import DepositSlipFilters from '../../../../components/reports/financial/DepositSlipFilters';
import DepositSlipPreview from '../../../../components/reports/financial/DepositSlipPreview';
import PreviousDepositSlipsTable from '../../../../components/reports/financial/PreviousDepositSlipsTable';

const DepositSlips = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const templateData = location.state?.templateData;
  const { slips, unDeposited, loading } = useSelector((state) => state.deposits || { slips: [], unDeposited: { patientPayments: [], insurancePayments: [] }, loading: false });
  const [isSlipsExpanded, setIsSlipsExpanded] = useState(true);

  const paymentTypes = [
    'Do not use', 'Check', 'Debit Card', 'EFT', 'Cash', 'Care Credit', 
    'Master Card', 'Visa Card', 'ACH Payment', 'American Express', 
    'Discover', 'Card on File', 'Online Card', 'Sunbit', 'Cherry', 'HFD', 'VCC'
  ];

  const defaultSelectedTypes = [
    'Check', 'Patient Check', 'Insurance Check', 'Debit Card', 'EFT', 'Cash', 
    'Care Credit', 'Master Card', 'Visa Card', 'ACH Payment', 'American Express', 
    'Discover', 'Card on File', 'Online Card', 'Sunbit', 'Cherry', 'HFD', 'VCC',
    'Courtesy Credit', 'Account Correction'
  ];

  const [patientPayTypes, setPatientPayTypes] = useState(defaultSelectedTypes);
  const [insPayTypes, setInsPayTypes] = useState(defaultSelectedTypes);
  const [refPayTypes, setRefPayTypes] = useState(defaultSelectedTypes);
  const [incDepTypes, setIncDepTypes] = useState(defaultSelectedTypes);

  const [patPayAll, setPatPayAll] = useState(true);
  const [insPayAll, setInsPayAll] = useState(true);
  const [refPayAll, setRefPayAll] = useState(true);
  const [incDepAll, setIncDepAll] = useState(true);

  const formatMethodLabel = (method) => {
    if (!method) return 'Check';
    const lower = method.toLowerCase().trim();
    if (lower === 'card' || lower === 'credit_card') return 'Credit Card';
    if (lower === 'cash') return 'Cash';
    if (lower === 'ach' || lower === 'eft') return 'EFT';
    if (lower === 'check') return 'Check';
    return method; 
  };

  const isMethodSelected = (method, selectedTypes) => {
    if (!method) return false;
    const lowerMethod = method.toLowerCase().trim();
    
    return selectedTypes.some(t => {
      const lowerT = t.toLowerCase().trim();
      if (lowerT === lowerMethod) return true;
      if (lowerMethod === 'card' && lowerT.includes('card')) return true;
      if (lowerMethod === 'ach' && (lowerT === 'eft' || lowerT === 'ach payment')) return true;
      if ((lowerT === 'check' && lowerMethod === 'patient check') ||
          (lowerT === 'check' && lowerMethod === 'insurance check') ||
          (lowerT === 'patient check' && lowerMethod === 'check') ||
          (lowerT === 'insurance check' && lowerMethod === 'check')) {
        return true;
      }
      return false;
    });
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
  }, [dispatch]);

  useEffect(() => {
    if (templateData) return; 

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
    const newMode = e.target.value;
    setFilterMode(newMode);
    applyModeDates(newMode);
  };

  const handleToggleAll = (type, checked) => {
    const list = checked ? [...paymentTypes] : [];
    if (type === 'patient') {
      setPatPayAll(checked);
      setPatientPayTypes(list);
    } else if (type === 'insurance') {
      setInsPayAll(checked);
      setInsPayTypes(list);
    } else if (type === 'refund') {
      setRefPayAll(checked);
      setRefPayTypes(list);
    } else if (type === 'include') {
      setIncDepAll(checked);
      setIncDepTypes(list);
    }
  };

  const handleToggleItem = (type, item, checked) => {
    let list;
    if (type === 'patient') {
      list = checked ? [...patientPayTypes, item] : patientPayTypes.filter(x => x !== item);
      setPatientPayTypes(list);
      setPatPayAll(list.length === paymentTypes.length);
    } else if (type === 'insurance') {
      list = checked ? [...insPayTypes, item] : insPayTypes.filter(x => x !== item);
      setInsPayTypes(list);
      setInsPayAll(list.length === paymentTypes.length);
    } else if (type === 'refund') {
      list = checked ? [...refPayTypes, item] : refPayTypes.filter(x => x !== item);
      setRefPayTypes(list);
      setRefPayAll(list.length === paymentTypes.length);
    } else if (type === 'include') {
      list = checked ? [...incDepTypes, item] : incDepTypes.filter(x => x !== item);
      setIncDepTypes(list);
      setIncDepAll(list.length === paymentTypes.length);
    }
  };

  const { filteredPatientPayments, filteredInsurancePayments } = useMemo(() => {
    const startStr = startDate ? startDate.format('YYYY-MM-DD') : '';
    const endStr = endDate ? endDate.format('YYYY-MM-DD') : '';

    const pts = (unDeposited.patientPayments || []).filter((p) => {
      const isSelected = p.amount < 0 
        ? isMethodSelected(p.method, refPayTypes)
        : isMethodSelected(p.method, patientPayTypes);
      
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
        : isMethodSelected(ins.method, insPayTypes);

      if (!isSelected) return false;

      if (ins.date && startStr && endStr) {
        const insDate = getLocalDateOnly(ins.date);
        if (insDate < startStr || insDate > endStr) return false;
      }
      return true;
    });

    return { filteredPatientPayments: pts, filteredInsurancePayments: inss };
  }, [unDeposited, patientPayTypes, insPayTypes, refPayTypes, startDate, endDate]);

  const previewPayments = useMemo(() => {
    return [...filteredPatientPayments, ...filteredInsurancePayments];
  }, [filteredPatientPayments, filteredInsurancePayments]);

  const previewTotal = useMemo(() => {
    return previewPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [previewPayments]);

  const patientGroups = useMemo(() => {
    if (!createdSlipDetails) return {};
    const groups = {};
    createdSlipDetails.patientPayments.forEach((p) => {
      const method = formatMethodLabel(p.method);
      if (!groups[method]) groups[method] = [];
      groups[method].push(p);
    });
    return groups;
  }, [createdSlipDetails]);

  const insuranceGroups = useMemo(() => {
    if (!createdSlipDetails) return {};
    const groups = {};
    createdSlipDetails.insurancePayments.forEach((ins) => {
      const method = formatMethodLabel(ins.method);
      if (!groups[method]) groups[method] = [];
      groups[method].push(ins);
    });
    return groups;
  }, [createdSlipDetails]);

  const handleCreateDepositClick = async () => {
    const patientPaymentIds = filteredPatientPayments.map((p) => p.id);
    const insurancePaymentIds = filteredInsurancePayments.map((ins) => ins.id);

    if (patientPaymentIds.length === 0 && insurancePaymentIds.length === 0) {
      alert('No un-deposited payments found matching the selected filters.');
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
        patientPayments: [...filteredPatientPayments],
        insurancePayments: [...filteredInsurancePayments],
      });

      alert('Deposit slip created successfully!');
      dispatch(fetchUnDepositedPayments());
    } catch (err) {
      alert(err || 'Failed to create deposit slip.');
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
      alert("Please enter a template name.");
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
      alert('Template saved successfully! It will now appear in Saved Reports.');
      setShowTemplateForm(false);
      setTemplateName('');
    } catch (err) {
      alert(err || 'Failed to save template.');
    } finally {
      setSavingTemplate(false);
    }
  };

  const displaySlips = slips && slips.length > 0 ? slips : [
    { date: '02/01/2022', amount: '29,243.17', memo: 'Mock: Deposit slip 1' },
    { date: '03/06/2022', amount: '11,009.60', memo: 'Mock: Deposit slip 2' },
  ];

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
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <DepositSlipFilters 
              filterMode={filterMode}
              handleFilterModeChange={handleFilterModeChange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              paymentTypes={paymentTypes}
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
            />
          </Paper>
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
