import React, { useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProviders, selectProviderList } from '../../../store/slices/providerSlice';
import { ReportFilterBar, ReportSelect, ReportCheckbox, ReportDivider } from '../ui';
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
  ON_INSURANCE_PAYMENT_OPTIONS,
  CARRIER_OPTIONS,
  BRANCH_OPTIONS
} from '../../../pages/admin/reports/constants/reportFilters';

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
    carrier: CARRIER_OPTIONS[0].value,
    branch: BRANCH_OPTIONS[0].value,
    showFlags: true,
    paymentPlanOwing: true,
    resetOnPatientPayment: ON_PATIENT_PAYMENT_OPTIONS[0].value,
    resetOnInsurancePayment: ON_INSURANCE_PAYMENT_OPTIONS[0].value,
    customArRange: { start: null, end: null }
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
      carrier: CARRIER_OPTIONS[0].value,
      branch: BRANCH_OPTIONS[0].value,
      showFlags: true,
      paymentPlanOwing: true,
      resetOnPatientPayment: ON_PATIENT_PAYMENT_OPTIONS[0].value,
      resetOnInsurancePayment: ON_INSURANCE_PAYMENT_OPTIONS[0].value,
      customArRange: { start: null, end: null }
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
      <ReportSelect label="SORT REPORT BY" options={SORT_REPORT_OPTIONS} value={draftFilters.sortReport} onChange={(e) => handleFilterChange('sortReport', e.target.value)} />
    </>
  );

  const middleFilters = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <ReportSelect label="OWING" options={OWING_OPTIONS} value={draftFilters.owing} onChange={(e) => handleFilterChange('owing', e.target.value)} />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <ReportSelect label="AR RANGE" options={AR_RANGE_OPTIONS} value={draftFilters.arRange} onChange={(e) => handleFilterChange('arRange', e.target.value)} />
        {draftFilters.arRange === 'custom' && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                  start date
                </Typography>
                <DatePicker
                  value={draftFilters.customArRange?.start || null}
                  onChange={(newValue) => handleFilterChange('customArRange', { ...draftFilters.customArRange, start: newValue })}
                  slotProps={{ 
                    textField: { 
                      size: 'small', 
                      sx: { 
                        width: 150, 
                        backgroundColor: '#fafbfe',
                        borderRadius: '4px',
                        '& .MuiInputBase-root': {
                           height: 36,
                           fontSize: '13px',
                           fontFamily: 'Inter',
                           fontWeight: 500,
                           color: '#09121f',
                        },
                        '& .MuiInputBase-input': {
                           padding: '8px 14px',
                           boxSizing: 'border-box',
                           '&::placeholder': {
                             color: '#94a3b8',
                             opacity: 1
                           }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0'
                        },
                        '& .MuiIconButton-root': {
                          padding: '4px'
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '20px',
                          color: '#4a5568'
                        }
                      } 
                    } 
                  }}
                />
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>-</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                  end date
                </Typography>
                <DatePicker
                  value={draftFilters.customArRange?.end || null}
                  onChange={(newValue) => handleFilterChange('customArRange', { ...draftFilters.customArRange, end: newValue })}
                  slotProps={{ 
                    textField: { 
                      size: 'small', 
                      sx: { 
                        width: 150, 
                        backgroundColor: '#fafbfe',
                        borderRadius: '4px',
                        '& .MuiInputBase-root': {
                           height: 36,
                           fontSize: '13px',
                           fontFamily: 'Inter',
                           fontWeight: 500,
                           color: '#09121f',
                        },
                        '& .MuiInputBase-input': {
                           padding: '0 10px',
                           height: '36px',
                           display: 'flex',
                           alignItems: 'center',
                           boxSizing: 'border-box'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0'
                        },
                        '& .MuiIconButton-root': {
                          padding: '4px'
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '20px',
                          color: '#4a5568'
                        }
                      } 
                    } 
                  }}
                />
              </Box>
            </Box>
          </LocalizationProvider>
        )}
      </Box>
      <ReportSelect label="PTS FLAGS" options={FLAGS_OPTIONS} value={draftFilters.flags} onChange={(e) => handleFilterChange('flags', e.target.value)} />
      <ReportSelect label="CARRIER" options={CARRIER_OPTIONS} value={draftFilters.carrier} onChange={(e) => handleFilterChange('carrier', e.target.value)} />
      <ReportSelect label="BRANCH" options={BRANCH_OPTIONS} value={draftFilters.branch} onChange={(e) => handleFilterChange('branch', e.target.value)} />
    </Box>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox label="Show Flags" checked={draftFilters.showFlags} onChange={(e) => handleFilterChange('showFlags', e.target.checked)} />
      <ReportCheckbox label="Payment Plan Owing" checked={draftFilters.paymentPlanOwing} onChange={(e) => handleFilterChange('paymentPlanOwing', e.target.checked)} />
      <ReportDivider />
      <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', ml: 1 }}>
                  Reset age on 
                  <Box component="span" sx={{ ml: 1, color: '#3CA2E0', cursor: 'help' }}>ⓘ</Box>
      </Typography>
      <Typography />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Pt</Typography>
        <ReportSelect options={ON_PATIENT_PAYMENT_OPTIONS} value={draftFilters.resetOnPatientPayment} onChange={(e) => handleFilterChange('resetOnPatientPayment', e.target.value)} width="120px" />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Ins</Typography>
        <ReportSelect options={ON_INSURANCE_PAYMENT_OPTIONS} value={draftFilters.resetOnInsurancePayment} onChange={(e) => handleFilterChange('resetOnInsurancePayment', e.target.value)} width="120px" />
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
