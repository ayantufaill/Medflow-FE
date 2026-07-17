import React, { useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProviders, selectProviderList } from '../../../../store/slices/providerSlice';
import { ReportFilterBar, ReportSelect, ReportCheckbox, ReportDivider } from '../../../../components/reports/ui';
import {
  BALANCE_OPTIONS,
  OWING_OPTIONS,
  BILLING_DATE_OPTIONS,
  CLAIMS_OPTIONS,
  PATIENTS_OPTIONS,
  PROVIDER_OPTIONS,
  AR_RANGE_OPTIONS,
  FLAGS_OPTIONS,
  SORT_REPORT_OPTIONS,
  ON_PATIENT_PAYMENT_OPTIONS,
  ON_INSURANCE_PAYMENT_OPTIONS
} from '../constants/reportFilters';

const AgingReportFilters = ({ onApplyFilters }) => {
  const dispatch = useDispatch();
  const providersData = useSelector(selectProviderList) || [];

  const [draftFilters, setDraftFilters] = React.useState({
    balance: BALANCE_OPTIONS[0].value,
    billingDate: BILLING_DATE_OPTIONS[0].value,
    claims: CLAIMS_OPTIONS[0].value,
    patients: PATIENTS_OPTIONS[0].value,
    provider: PROVIDER_OPTIONS[0].value,
    sortReport: SORT_REPORT_OPTIONS[0].value,
    owing: OWING_OPTIONS[0].value,
    arRange: AR_RANGE_OPTIONS[0].value,
    flags: FLAGS_OPTIONS[0].value,
    showFlags: true,
    paymentPlanOwing: true,
    resetOnPatientPayment: ON_PATIENT_PAYMENT_OPTIONS[0].value,
    resetOnInsurancePayment: ON_INSURANCE_PAYMENT_OPTIONS[0].value,
  });

  const handleFilterChange = (field, value) => {
    setDraftFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearAll = () => {
    const cleared = {
      balance: BALANCE_OPTIONS[0].value,
      billingDate: BILLING_DATE_OPTIONS[0].value,
      claims: CLAIMS_OPTIONS[0].value,
      patients: PATIENTS_OPTIONS[0].value,
      provider: PROVIDER_OPTIONS[0].value,
      sortReport: SORT_REPORT_OPTIONS[0].value,
      owing: OWING_OPTIONS[0].value,
      arRange: AR_RANGE_OPTIONS[0].value,
      flags: FLAGS_OPTIONS[0].value,
      showFlags: true,
      paymentPlanOwing: true,
      resetOnPatientPayment: ON_PATIENT_PAYMENT_OPTIONS[0].value,
      resetOnInsurancePayment: ON_INSURANCE_PAYMENT_OPTIONS[0].value,
    };
    setDraftFilters(cleared);
    if (onApplyFilters) onApplyFilters(cleared);
  };

  useEffect(() => {
    dispatch(fetchProviders({ page: 1, limit: 100 }));
  }, [dispatch]);

  const dynamicProviderOptions = useMemo(() => {
    const backendProviders = providersData.map(p => {
      const name = p.userId ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim() : `${p.firstName || ''} ${p.lastName || ''}`.trim();
      return { value: p._id, label: name || 'Unnamed Provider' };
    });
    return [...PROVIDER_OPTIONS, ...backendProviders];
  }, [providersData]);

  const topFilters = (
    <>
      <ReportSelect label="BALANCE" options={BALANCE_OPTIONS} value={draftFilters.balance} onChange={(e) => handleFilterChange('balance', e.target.value)} />
      <ReportSelect label="BILLING DATE" options={BILLING_DATE_OPTIONS} value={draftFilters.billingDate} onChange={(e) => handleFilterChange('billingDate', e.target.value)} />
      <ReportSelect label="CLAIMS" options={CLAIMS_OPTIONS} value={draftFilters.claims} onChange={(e) => handleFilterChange('claims', e.target.value)} />
      <ReportSelect label="PATIENTS" options={PATIENTS_OPTIONS} value={draftFilters.patients} onChange={(e) => handleFilterChange('patients', e.target.value)} />
      <ReportSelect label="PROVIDER" options={dynamicProviderOptions} value={draftFilters.provider} onChange={(e) => handleFilterChange('provider', e.target.value)} />
      <ReportSelect label="SORT REPORT" options={SORT_REPORT_OPTIONS} value={draftFilters.sortReport} onChange={(e) => handleFilterChange('sortReport', e.target.value)} />
    </>
  );

  const middleFilters = (
    <>
      <ReportSelect label="OWING" options={OWING_OPTIONS} value={draftFilters.owing} onChange={(e) => handleFilterChange('owing', e.target.value)} />
      <ReportSelect label="AR RANGE" options={AR_RANGE_OPTIONS} value={draftFilters.arRange} onChange={(e) => handleFilterChange('arRange', e.target.value)} />
      <ReportSelect label="PTS FLAGS" options={FLAGS_OPTIONS} value={draftFilters.flags} onChange={(e) => handleFilterChange('flags', e.target.value)} />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox label="Show Flags" checked={draftFilters.showFlags} onChange={(e) => handleFilterChange('showFlags', e.target.checked)} />
      <ReportCheckbox label="Payment Plan Owing" checked={draftFilters.paymentPlanOwing} onChange={(e) => handleFilterChange('paymentPlanOwing', e.target.checked)} />
      <ReportDivider />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
          RESET AGE ON 
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', border: '1px solid #cbd5e1', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Pt</Typography>
        <ReportSelect options={ON_PATIENT_PAYMENT_OPTIONS} value={draftFilters.resetOnPatientPayment} onChange={(e) => handleFilterChange('resetOnPatientPayment', e.target.value)} sx={{ height: 32, borderRadius: '20px' }} width="120px" />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Ins</Typography>
        <ReportSelect options={ON_INSURANCE_PAYMENT_OPTIONS} value={draftFilters.resetOnInsurancePayment} onChange={(e) => handleFilterChange('resetOnInsurancePayment', e.target.value)} sx={{ height: 32, borderRadius: '20px' }} width="120px" />
      </Box>
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      middleRowFilters={middleFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={() => onApplyFilters && onApplyFilters(draftFilters)}
      onCreateTemplate={() => console.log('create')}
      onClearAll={handleClearAll}
    />
  );
};

export default AgingReportFilters;
