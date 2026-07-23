import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientAgingReport, selectPatientAging, selectPatientAgingLoading } from '../../../../store/slices/billingSlice';
import { reportingService } from '../../../../services/reporting.service';
import { Box, Typography, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { ReportFilterBar, ReportSelect, ReportCheckbox } from '../../../../components/reports/ui';
import {
  AR_RANGE_OPTIONS,
  FLAGS_OPTIONS,
  SORT_REPORT_OPTIONS,
  ON_PATIENT_PAYMENT_OPTIONS,
  ON_INSURANCE_PAYMENT_OPTIONS
} from '../constants/reportFilters';
import PatientAgingReportTable from '../../../../components/reports/financial/PatientAgingReportTable';
import AgingReportFilters from '../../../../components/reports/financial/AgingReportFilters';
import AgingReportActions from '../../../../components/reports/financial/AgingReportActions';

const PatientAgingReport = () => {
  const [hidePatientNames, setHidePatientNames] = useState(false);

  const agingBuckets = [
    '0 - 30 days',
    '31 - 60 days',
    '61 - 90 days',
    '91 - 120 days',
    '121 - 150 days',
    '151 - 180 days',
    '> 180 day',
  ];

  const dispatch = useDispatch();
  const patientAging = useSelector(selectPatientAging);
  const loading = useSelector(selectPatientAgingLoading);

  const [draftFilters, setDraftFilters] = useState({
    arRange: AR_RANGE_OPTIONS[0].value,
    flags: FLAGS_OPTIONS[0].value,
    sortReport: SORT_REPORT_OPTIONS[0].value,
    showFlags: true,
    paymentPlanOwing: true,
    resetOnPatientPayment: ON_PATIENT_PAYMENT_OPTIONS[0].value,
    resetOnInsurancePayment: ON_INSURANCE_PAYMENT_OPTIONS[0].value
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...draftFilters });

  useEffect(() => {
    dispatch(fetchPatientAgingReport(appliedFilters));
  }, [dispatch, appliedFilters]);

  const handleFilterChange = (key, value) => {
    setDraftFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...draftFilters });
  };

  const handleClearAll = () => {
    const defaultFilters = {
      arRange: AR_RANGE_OPTIONS[0].value,
      flags: FLAGS_OPTIONS[0].value,
      sortReport: SORT_REPORT_OPTIONS[0].value,
      showFlags: true,
      paymentPlanOwing: true,
      resetOnPatientPayment: ON_PATIENT_PAYMENT_OPTIONS[0].value,
      resetOnInsurancePayment: ON_INSURANCE_PAYMENT_OPTIONS[0].value
    };
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const filteredReportData = patientAging || [];

  const { totals, netOutstandingBalance } = useMemo(() => {
    const bucketsTotals = {};
    agingBuckets.forEach(bucket => {
      bucketsTotals[bucket] = { pt: 0, ins: 0, total: 0 };
    });
    
    let totalOutstanding = 0;
    let totalPt = 0;
    let totalIns = 0;
    let totalCredit = 0;

    filteredReportData.forEach(row => {
      totalOutstanding += row.totalOwings || 0;
      totalCredit += row.credit || 0;
      
      agingBuckets.forEach(bucket => {
        if (row.buckets && row.buckets[bucket]) {
          const pt = row.buckets[bucket].pt || 0;
          const ins = row.buckets[bucket].ins || 0;
          bucketsTotals[bucket].pt += pt;
          bucketsTotals[bucket].ins += ins;
          bucketsTotals[bucket].total += pt + ins;
          totalPt += pt;
          totalIns += ins;
        }
      });
    });

    return {
      totals: {
        buckets: bucketsTotals,
        totalOutstanding,
        totalPt,
        totalIns,
        totalCredit
      },
      netOutstandingBalance: Math.max(0, totalOutstanding - totalCredit)
    };
  }, [filteredReportData, agingBuckets]);

  const handlePrint = () => {
    const tableEl = document.getElementById('patient-aging-table');
    if (!tableEl) {
      alert("Table not found to print.");
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Patient Aging Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Patient Aging Report</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportCSV = async () => {
    const headers = [
      appliedFilters.showFlags ? 'Flags' : null,
      !hidePatientNames ? 'Patient Name' : null,
      ...agingBuckets,
      'Total',
      'Total owings',
      appliedFilters.paymentPlanOwing ? 'Payment Plan Owing' : null,
      'Credit',
      'Last Billed On'
    ].filter(Boolean);

    const rows = filteredReportData.map(row => {
      const dataRow = [
        appliedFilters.showFlags ? '' : null, // Flags
        !hidePatientNames ? row.name || 'Unknown Patient' : null,
        ...agingBuckets.map(bucket => {
          const pt = row.buckets?.[bucket]?.pt || 0;
          return `$${pt.toFixed(2)}`;
        }),
        `$${(row.total || 0).toFixed(2)}`,
        `$${(row.totalOwings || 0).toFixed(2)}`,
        appliedFilters.paymentPlanOwing ? `$${(row.paymentPlan || 0).toFixed(2)}` : null,
        `$${(row.credit || 0).toFixed(2)}`,
        row.lastBilled || ''
      ].filter(val => val !== null && val !== undefined);
      return dataRow;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Patient_Aging_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Save snapshot to backend archive
    try {
      await reportingService.archiveReport('patient-aging', filteredReportData);
    } catch (err) {
      console.error('Failed to archive patient aging report:', err);
    }
  };

  const topFilters = (
    <>
      <ReportSelect label="AR RANGE" value={draftFilters.arRange} onChange={(e) => handleFilterChange('arRange', e.target.value)} options={AR_RANGE_OPTIONS} width="140px" />
      <ReportSelect label="PTS FLAGS" value={draftFilters.flags} onChange={(e) => handleFilterChange('flags', e.target.value)} options={FLAGS_OPTIONS} width="180px" />
      <ReportSelect label="SORT REPORT BY" value={draftFilters.sortReport} onChange={(e) => handleFilterChange('sortReport', e.target.value)} options={SORT_REPORT_OPTIONS} width="180px" />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox label="Show Flags in Report" checked={draftFilters.showFlags} onChange={(e) => handleFilterChange('showFlags', e.target.checked)} />
      <ReportCheckbox label="Show Payment Plan Owing" checked={draftFilters.paymentPlanOwing} onChange={(e) => handleFilterChange('paymentPlanOwing', e.target.checked)} />
      <Box sx={{ borderLeft: '1px solid #e2e8f0', height: 24, mx: 1 }} />
      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
        RESET AGE ON 
        <Box component="span" sx={{ ml: 0.5, color: '#94a3b8', border: '1px solid #cbd5e1', borderRadius: '50%', width: 14, height: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', verticalAlign: 'middle' }}>i</Box>
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Pt</Typography>
        <ReportSelect value={draftFilters.resetOnPatientPayment} onChange={(e) => handleFilterChange('resetOnPatientPayment', e.target.value)} options={ON_PATIENT_PAYMENT_OPTIONS} width="120px" />
      </Box>
    </>
  );

  return (
    <Box sx={{ 
      p: 0,
      '@media print': {
        '& .hide-on-print': {
          display: 'none !important'
        }
      }
    }}>
      <Typography variant="h6" className="hide-on-print" sx={{ mb: 2, fontWeight: 700, color: '#1e293b' }}>
        Patient Aging Report
      </Typography>

      <Box className="hide-on-print" sx={{ mb: 2 }}>
        <ReportFilterBar 
          topRowFilters={topFilters}
          bottomRowFilters={bottomFilters}
          onApplyFilters={handleApplyFilters}
          onCreateTemplate={() => console.log('Create Template')}
          onClearAll={handleClearAll}
        />
      </Box>

      <Box className="hide-on-print">
        <AgingReportActions 
          hidePatientNames={hidePatientNames} 
          setHidePatientNames={setHidePatientNames} 
          onExportCsv={handleExportCSV}
          onPrint={handlePrint}
        />
      </Box>

      <PatientAgingReportTable 
        loading={loading}
        reportData={filteredReportData}
        agingBuckets={agingBuckets}
        hidePatientNames={hidePatientNames}
        groupByRange={appliedFilters.arRange === 'any'}
        totals={totals}
        showFlags={appliedFilters.showFlags}
        showPaymentPlan={appliedFilters.paymentPlanOwing}
      />
    </Box>
  );
};

export default PatientAgingReport;
