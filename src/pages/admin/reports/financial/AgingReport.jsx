import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AccountNotesDialog from '../../../../components/finance/AccountNotesDialog';
import AgingReportFilters from './AgingReportFilters';
import AgingReportActions from './AgingReportActions';
import AgingReportTable from './AgingReportTable';
import GenerateStatementsDialog from '../../../../components/finance/GenerateStatementsDialog';
import ViewGeneratedStatementsDialog from '../../../../components/finance/ViewGeneratedStatementsDialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArAgingReport, selectArAging, selectArAgingLoading } from '../../../../store/slices/billingSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import { reportingService } from '../../../../services/reporting.service';

const AgingReport = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPatientForNotes, setSelectedPatientForNotes] = useState(null);
  const [showGenerateStatements, setShowGenerateStatements] = useState(false);
  const [showViewGeneratedStatements, setShowViewGeneratedStatements] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hidePatientNames, setHidePatientNames] = useState(false);
  const [selectedNames, setSelectedNames] = useState([]);
  const [flagFilter, setFlagFilter] = useState('pts');
  const [showFlags, setShowFlags] = useState(true);
  
  const [providerFilter, setProviderFilter] = useState('all');
  const [patientStatusFilter, setPatientStatusFilter] = useState('active');
  const [claimsFilter, setClaimsFilter] = useState('both');
  
  const [balanceFilter, setBalanceFilter] = useState('any');
  const [owingFilter, setOwingFilter] = useState('any');
  const [billingDateFilter, setBillingDateFilter] = useState('any');
  const [arRangeFilter, setArRangeFilter] = useState('any');
  const [sortBy, setSortBy] = useState('high-low');
  const [showPaymentPlan, setShowPaymentPlan] = useState(true);
  
  const [batches, setBatches] = useState([
    {
      id: 1,
      date: '07/15/2022',
      totalCreated: 1,
      sentViaMyChart: 1,
      manualCreated: 0,
      details: {
        withoutEmails: 0,
        withMcAccounts: 0,
        withEmails: 0,
      },
      myChartSent: {
        count: 1,
        successMessage: '1 e-statements successfully sent!',
      },
      manualPdfs: null,
    },
    {
      id: 2,
      date: '07/15/2022',
      totalCreated: 3,
      sentViaMyChart: 0,
      manualCreated: 3,
      details: {
        withoutEmails: 0,
        withMcAccounts: 3,
        withEmails: 0,
      },
      myChartSent: null,
      manualPdfs: [
        {
          id: 'm1',
          label: '3 manual statements for pts with My Chart accounts',
          hasMyChart: true,
        }
      ],
    },
    {
      id: 3,
      date: '07/14/2022',
      totalCreated: 4,
      sentViaMyChart: 0,
      manualCreated: 4,
      details: {
        withoutEmails: 1,
        withMcAccounts: 2,
        withEmails: 1,
      },
      myChartSent: null,
      manualPdfs: [
        {
          id: 'm2',
          label: '1 manual statements for pts without emails',
          hasMyChart: false,
        },
        {
          id: 'm3',
          label: '2 manual statements for pts with My Chart accounts',
          hasMyChart: true,
        },
        {
          id: 'm4',
          label: '1 manual statements for pts with emails!',
          hasMyChart: false,
          showCreateSend: true,
        }
      ],
    }
  ]);

  const handleGenerateBatch = (config) => {
    setShowGenerateStatements(false);
    setIsGenerating(true);
    
    const newBatchId = Date.now();
    const newBatch = {
      id: newBatchId,
      date: new Date().toLocaleDateString('en-US'),
      status: 'Pending',
      totalCreated: selectedNames.length || 3,
      sentViaMyChart: 0,
      manualCreated: 0,
      details: { withoutEmails: 0, withMcAccounts: 0, withEmails: 0 },
      myChartSent: null,
      manualPdfs: null,
    };
    
    setBatches(prev => [newBatch, ...prev]);

    setTimeout(() => {
      setIsGenerating(false);
      setBatches(prev => prev.map(batch => {
        if (batch.id !== newBatchId) return batch;
        
        const total = batch.totalCreated;
        let withoutEmails = Math.floor(total / 3);
        let withMcAccounts = Math.floor(total / 3);
        let withEmails = total - withoutEmails - withMcAccounts;

        if (total === 1) {
          withoutEmails = 0;
          withMcAccounts = 1;
          withEmails = 0;
        } else if (total === 2) {
          withoutEmails = 1;
          withMcAccounts = 1;
          withEmails = 0;
        }

        const sentViaMyChart = withMcAccounts;
        const manualCreated = withoutEmails + withEmails;

        const manualPdfs = [];
        if (withoutEmails > 0) {
          manualPdfs.push({
            id: `${newBatchId}-m1`,
            label: `${withoutEmails} manual statements for pts without emails`,
            hasMyChart: false,
          });
        }
        if (withEmails > 0) {
          manualPdfs.push({
            id: `${newBatchId}-m2`,
            label: `${withEmails} manual statements for pts with emails!`,
            hasMyChart: false,
            showCreateSend: true,
          });
        }

        return {
          ...batch,
          status: 'Success',
          sentViaMyChart,
          manualCreated,
          details: {
            withoutEmails,
            withMcAccounts,
            withEmails,
          },
          myChartSent: sentViaMyChart > 0 ? {
            count: sentViaMyChart,
            successMessage: `${sentViaMyChart} e-statements successfully sent!`,
          } : null,
          manualPdfs: manualPdfs.length > 0 ? manualPdfs : null,
        };
      }));
    }, 2500);
  };
  
  const dispatch = useDispatch();
  const arAging = useSelector(selectArAging);
  const loading = useSelector(selectArAgingLoading);
  const providersList = useSelector(selectProviderDropdownList) || [];
  const reportData = arAging || [];

  const getProviderName = (p) => {
    const first = p.userId?.firstName || p.firstName || p.FName || '';
    const last  = p.userId?.lastName  || p.lastName  || p.LName  || '';
    return `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
  };

  const enrichedReportData = useMemo(() => {
    return reportData.map((row, idx) => {
      const flags = (row.flags && row.flags.length > 0)
        ? row.flags
        : (idx % 3 === 0 ? ['#f5a623'] : (idx % 5 === 0 ? ['#e11d48', '#4a90e2'] : []));
      return {
        ...row,
        flags
      };
    });
  }, [reportData]);

  const filteredReportData = useMemo(() => {
    let result = enrichedReportData.filter(row => {
      // Flag Filter
      if (flagFilter === 'with_flags' && (!row.flags || row.flags.length === 0)) return false;
      if (flagFilter === 'without_flags' && (row.flags && row.flags.length > 0)) return false;
      
      // Provider Filter
      if (providerFilter !== 'all' && row.providerId !== providerFilter) return false;
      
      // Patient Status Filter
      if (patientStatusFilter === 'active' && row.isActive === false) return false;
      if (patientStatusFilter === 'inactive' && row.isActive !== false) return false;
      
      // Claims Filter
      if (claimsFilter === 'with_claims' && !row.hasOpenClaims) return false;
      if (claimsFilter === 'without_claims' && row.hasOpenClaims) return false;
      
      // Balance Filter
      if (balanceFilter === 'positive' && (row.total || 0) <= 0) return false;
      if (balanceFilter === 'negative' && (row.total || 0) >= 0) return false;
      
      // Owing Type Filter
      if (owingFilter === 'patient') {
        const ptTotal = Object.values(row.buckets || {}).reduce((sum, b) => sum + (b.pt || 0), 0);
        if (ptTotal <= 0) return false;
      }
      if (owingFilter === 'insurance') {
        const insTotal = Object.values(row.buckets || {}).reduce((sum, b) => sum + (b.ins || 0), 0);
        if (insTotal <= 0) return false;
      }
      
      // Billing Date Filter
      if (billingDateFilter !== 'any' && row.lastBilled) {
        const billedDate = new Date(row.lastBilled);
        const today = new Date();
        const diffDays = Math.floor((today - billedDate) / (1000 * 60 * 60 * 24));
        if (billingDateFilter === '30' && diffDays > 30) return false;
        if (billingDateFilter === '60' && diffDays > 60) return false;
        if (billingDateFilter === '90' && diffDays <= 90) return false;
      }
      
      // AR Range Filter
      if (arRangeFilter !== 'any' && row.buckets) {
        if (arRangeFilter === '0-30' && (row.buckets['0 - 30 days']?.total || 0) <= 0) return false;
        if (arRangeFilter === '31-60' && (row.buckets['31 - 60 days']?.total || 0) <= 0) return false;
        if (arRangeFilter === '61-90' && (row.buckets['61 - 90 days']?.total || 0) <= 0) return false;
        if (arRangeFilter === '>90') {
          const over90 = ['91 - 120 days', '121 - 150 days', '151 - 180 days', '> 180 day']
            .reduce((sum, b) => sum + (row.buckets[b]?.total || 0), 0);
          if (over90 <= 0) return false;
        }
      }
      
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'high-low') return (b.total || 0) - (a.total || 0);
      if (sortBy === 'patient-name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'last-billed') {
        const da = a.lastBilled ? new Date(a.lastBilled).getTime() : 0;
        const db = b.lastBilled ? new Date(b.lastBilled).getTime() : 0;
        return db - da; // newest first
      }
      if (sortBy === 'flags') {
        const aFlags = a.flags && a.flags.length > 0 ? 1 : 0;
        const bFlags = b.flags && b.flags.length > 0 ? 1 : 0;
        return bFlags - aFlags;
      }
      return 0;
    });

    return result;
  }, [enrichedReportData, flagFilter, providerFilter, patientStatusFilter, claimsFilter, balanceFilter, owingFilter, billingDateFilter, arRangeFilter, sortBy]);

  const [archivedDate, setArchivedDate] = useState('');
  const [archivedData, setArchivedData] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchArAgingReport());
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const handleDateSelect = async (e) => {
    const date = e.target.value;
    setArchivedDate(date);
    if (!date) {
      setArchivedData([]);
      return;
    }
    
    setArchivedLoading(true);
    try {
      const data = await reportingService.getFinancialReport('aging', { date });
      setArchivedData(data);
    } catch (error) {
      console.error('Failed to fetch archived report', error);
    } finally {
      setArchivedLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExportCSV = () => {
    const headers = [
      'Flags',
      !hidePatientNames ? 'Patient Name' : null,
      ...agingBuckets,
      'Total',
      'Total owings',
      showPaymentPlan ? 'Payment Plan Owing' : null,
      'Credit',
      'Last Billed On'
    ].filter(Boolean);

    const rows = filteredReportData.map(row => {
      const dataRow = [
        '', // Flags
        !hidePatientNames ? row.name : null,
        ...agingBuckets.map(bucket => {
          const pt = row.buckets?.[bucket]?.pt || 0;
          const ins = row.buckets?.[bucket]?.ins || 0;
          return `Pt: $${pt.toFixed(2)} / Ins: $${ins.toFixed(2)}`;
        }),
        `$${(row.total || 0).toFixed(2)}`,
        `$${(row.totalOwings || 0).toFixed(2)}`,
        showPaymentPlan ? `$${(row.paymentPlan || 0).toFixed(2)}` : null,
        `$${(row.credit || 0).toFixed(2)}`,
        row.lastBilled || ''
      ].filter(val => val !== null);
      return dataRow;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Aging_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('aging-report-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Aging Report Table Only</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Aging Report</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const agingBuckets = useMemo(() => [
    '0 - 30 days',
    '31 - 60 days',
    '61 - 90 days',
    '91 - 120 days',
    '121 - 150 days',
    '151 - 180 days',
    '> 180 day',
  ], []);

  const totals = useMemo(() => {
    const sums = {
      buckets: {},
      totalOutstanding: 0,
      totalPt: 0,
      totalIns: 0,
      totalCredit: 0
    };
    
    agingBuckets.forEach(b => {
      sums.buckets[b] = { total: 0, pt: 0, ins: 0 };
    });

    filteredReportData.forEach(row => {
      let rowPtTotal = 0;
      let rowInsTotal = 0;
      
      agingBuckets.forEach(b => {
        const bData = row.buckets?.[b];
        if (bData) {
          const ptVal = bData.pt || 0;
          const insVal = bData.ins || 0;
          sums.buckets[b].pt += ptVal;
          sums.buckets[b].ins += insVal;
          sums.buckets[b].total += (ptVal + insVal);
          
          rowPtTotal += ptVal;
          rowInsTotal += insVal;
        }
      });
      sums.totalPt += rowPtTotal;
      sums.totalIns += rowInsTotal;
      sums.totalOutstanding += (rowPtTotal + rowInsTotal);
      sums.totalCredit += (row.credit || 0);
    });
    return sums;
  }, [filteredReportData, agingBuckets]);

  // dummyData is replaced by reportData from API

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: '#1e293b' }}>
        Aging Report
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: '#f1f5f9', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ 
            minHeight: 36,
            '& .MuiTabs-indicator': {
              backgroundColor: '#3b82f6',
              height: 2,
            }
          }}
        >
          <Tab 
            label="Current Report" 
            sx={{ 
              textTransform: 'none', 
              minHeight: 36, 
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#64748b',
              '&.Mui-selected': { color: '#3b82f6' }
            }} 
          />
          <Tab 
            label="Archived Reports" 
            sx={{ 
              textTransform: 'none', 
              minHeight: 36, 
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#64748b',
              '&.Mui-selected': { color: '#3b82f6' }
            }} 
          />
        </Tabs>
      </Box>

      {tabValue === 0 ? (
        <>
          <AgingReportFilters />
          
          <AgingReportActions 
            hidePatientNames={hidePatientNames} 
            setHidePatientNames={setHidePatientNames} 
          />

          <AgingReportTable 
            loading={loading}
            reportData={reportData}
            hidePatientNames={hidePatientNames}
            agingBuckets={agingBuckets}
            totals={totals}
            setShowAccountNotes={setShowAccountNotes}
          />

          {/* Summary Footer */}
          <Box sx={{ mt: 2, borderTop: '2px solid #e0e0e0', pt: 2 }}>
            <Table size="small">
              <TableBody>
                <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
                  <TableCell sx={{ width: '25%', fontWeight: 600 }}>Total Patients Balances</TableCell>
                  {agingBuckets.map((bucket) => (
                    <TableCell key={bucket} align="right">
                      {bucket}
                    </TableCell>
                  ))}
                  <TableCell align="right">Total</TableCell>
                  <TableCell colSpan={5} />
                </TableRow>

                {/* Footer Row 2: Total Outstanding Balances */}
                <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
                  <TableCell colSpan={(showFlags ? 1 : 0) + (hidePatientNames ? 1 : 2)} sx={{ color: '#555', fontWeight: 600 }}>
                    Total Outstanding Balances
                  </TableCell>
                  {agingBuckets.map((bucket) => (
                    <TableCell key={bucket} align="right">
                      ${totals.buckets[bucket].total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${totals.totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell colSpan={5} />
                </TableRow>

                {/* Footer Row 3: Total Patients Balances */}
                <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
                  <TableCell colSpan={(showFlags ? 1 : 0) + (hidePatientNames ? 1 : 2)} sx={{ color: '#555', fontWeight: 600 }}>
                    Total Patients Balances
                  </TableCell>
                  {agingBuckets.map((bucket) => (
                    <TableCell key={bucket} align="right">
                      ${totals.buckets[bucket].pt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${totals.totalPt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell colSpan={5} />
                </TableRow>

                {/* Footer Row 4: Total Insurance Balances */}
                <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
                  <TableCell colSpan={(showFlags ? 1 : 0) + (hidePatientNames ? 1 : 2)} sx={{ color: '#555', fontWeight: 600 }}>
                    Total Insurance Balances
                  </TableCell>
                  {agingBuckets.map((bucket) => (
                    <TableCell key={bucket} align="right">
                      ${totals.buckets[bucket].ins.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${totals.totalIns.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell colSpan={5} />
                </TableRow>

                {/* Footer Row 5: Total Account Credit */}
                <TableRow sx={{ '& td': { fontSize: '0.75rem', color: '#333', py: 0.5, border: 'none' } }}>
                  <TableCell colSpan={(showFlags ? 1 : 0) + (hidePatientNames ? 1 : 2)} sx={{ color: '#555', fontWeight: 600 }}>
                    Total Account Credit
                  </TableCell>
                  {agingBuckets.map((bucket) => (
                    <TableCell key={bucket} />
                  ))}
                  <TableCell align="right" />
                  <TableCell colSpan={2} />
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${totals.totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Select report by date:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', pb: 0.5, width: 200 }}>
              <input 
                type="date" 
                value={archivedDate} 
                onChange={handleDateSelect} 
                style={{ border: 'none', outline: 'none', width: '100%', color: '#333', fontSize: '0.875rem' }} 
              />
            </Box>
            {archivedDate && (
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ textTransform: 'none', py: 0, height: 26 }}
                onClick={() => {
                  setArchivedDate('');
                  setArchivedData([]);
                }}
              >
                Clear / View All
              </Button>
            )}
          </Box>

          {!archivedDate ? (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1.25 } }}>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { date: '2022-07-14', name: 'Report - Jul 14, 2022' },
                    { date: '2022-07-13', name: 'Report - Jul 13, 2022' },
                    { date: '2022-07-12', name: 'Report - Jul 12, 2022' },
                    { date: '2022-07-11', name: 'Report - Jul 11, 2022' },
                    { date: '2022-07-10', name: 'Report - Jul 10, 2022' },
                    { date: '2022-07-09', name: 'Report - Jul 09, 2022' },
                    { date: '2022-07-08', name: 'Report - Jul 08, 2022' },
                    { date: '2022-07-07', name: 'Report - Jul 07, 2022' },
                    { date: '2022-07-06', name: 'Report - Jul 06, 2022' },
                    { date: '2022-07-05', name: 'Report - Jul 05, 2022' },
                    { date: '2022-07-04', name: 'Report - Jul 04, 2022' },
                    { date: '2022-07-03', name: 'Report - Jul 03, 2022' },
                    { date: '2022-07-02', name: 'Report - Jul 02, 2022' },
                    { date: '2022-07-01', name: 'Report - Jul 01, 2022' },
                    { date: '2022-06-30', name: 'Report - Jun 30, 2022' },
                    { date: '2022-06-29', name: 'Report - Jun 29, 2022' },
                    { date: '2022-06-28', name: 'Report - Jun 28, 2022' },
                  ].map((report, idx) => (
                    <TableRow 
                      key={idx} 
                      hover
                      sx={{ 
                        '& td': { py: 1.25, fontSize: '0.825rem' },
                        cursor: 'pointer',
                        backgroundColor: idx % 2 === 1 ? '#fbfbfb' : '#fff'
                      }}
                      onClick={() => handleDateSelect({ target: { value: report.date } })}
                    >
                      <TableCell sx={{ color: '#4a70b0', fontWeight: 500 }}>
                        {report.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Viewing report for date: {archivedDate}
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1 } }}>
                      <TableCell>Patient Name</TableCell>
                      <TableCell align="right">Total Owings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {archivedLoading ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">Loading...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : archivedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">No report data found for this date.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : archivedData.map((row, idx) => (
                      <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.6rem' }}>👤</Typography>
                            </Box>
                            <Typography variant="caption" color="primary" sx={{ fontWeight: 600, cursor: 'pointer' }}>{row.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>${row.totalOwings?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      )}

      {selectedPatientForNotes && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setSelectedPatientForNotes(null)}
        >
          <Box 
            sx={{ 
              maxWidth: '800px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AccountNotesDialog 
              patient={selectedPatientForNotes}
              onClose={() => setSelectedPatientForNotes(null)}
            />
          </Box>
        </Box>
      )}

      {showGenerateStatements && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowGenerateStatements(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '450px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '4px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <GenerateStatementsDialog 
              onClose={() => setShowGenerateStatements(false)}
              onGenerate={handleGenerateBatch}
            />
          </Box>
        </Box>
      )}

      {showViewGeneratedStatements && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowViewGeneratedStatements(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '1200px', 
              width: '95%',
              bgcolor: '#fff',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ViewGeneratedStatementsDialog 
              batches={batches}
              onClose={() => setShowViewGeneratedStatements(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AgingReport;

