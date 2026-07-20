import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
import AgingReportTable from '../../../../components/reports/financial/AgingReportTable';
import AgingReportFilters from '../../../../components/reports/financial/AgingReportFilters';
import AgingReportActions from '../../../../components/reports/financial/AgingReportActions';
import GenerateStatementsDialog from '../../../../components/finance/GenerateStatementsDialog';
import ViewGeneratedStatementsDialog from '../../../../components/finance/ViewGeneratedStatementsDialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArAgingReport, selectArAging, selectArAgingLoading } from '../../../../store/slices/billingSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';

import { ReportSelect } from '../../../../components/reports/ui';
import { reportingService } from '../../../../services/reporting.service';

const AgingReport = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedPatientForNotes, setSelectedPatientForNotes] = useState(null);
  const [showGenerateStatements, setShowGenerateStatements] = useState(false);
  const [showViewGeneratedStatements, setShowViewGeneratedStatements] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hidePatientNames, setHidePatientNames] = useState(false);
  const [selectedNames, setSelectedNames] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({
    balance: 'any',
    billingDate: 'any',
    claims: 'with_or_without',
    patients: 'all',
    provider: 'all',
    sortReport: 'high_to_low',
    owing: 'any',
    arRange: 'any',
    flags: 'with_or_without',
    showFlags: true,
    paymentPlanOwing: true,
    resetOnPatientPayment: 'dont_reset',
    resetOnInsurancePayment: 'dont_reset',
  });

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
  };
  
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

  const filteredReportData = enrichedReportData;

  const [archivedDate, setArchivedDate] = useState('');
  const [archivedReportsList, setArchivedReportsList] = useState([]);
  const [archivedReportsLoading, setArchivedReportsLoading] = useState(false);
  const [archivedData, setArchivedData] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);
  const [archiveFilterDate, setArchiveFilterDate] = useState(null);

  useEffect(() => {
    dispatch(fetchArAgingReport(appliedFilters));
  }, [dispatch, appliedFilters]);

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (tabValue === 1) {
      const fetchArchived = async () => {
        setArchivedReportsLoading(true);
        try {
          const list = await reportingService.getArchivedReports();
          setArchivedReportsList(list.filter(r => r.type === 'aging'));
        } catch (error) {
          console.error('Failed to fetch archived reports list', error);
        } finally {
          setArchivedReportsLoading(false);
        }
      };
      fetchArchived();
    }
  }, [tabValue]);

  const handleDateSelect = async (e) => {
    const selectedId = e.target.value;
    const reportItem = archivedReportsList.find(r => r.id === selectedId);
    
    if (!selectedId || !reportItem) {
      setArchivedDate('');
      setArchivedData([]);
      return;
    }
    
    setArchivedDate(new Date(reportItem.snapshotDate).toLocaleDateString() + ' ' + new Date(reportItem.snapshotDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setArchivedLoading(true);
    try {
      const result = await reportingService.getArchivedReportById(selectedId);
      setArchivedData(result.data);
    } catch (error) {
      console.error('Failed to fetch archived report', error);
    } finally {
      setArchivedLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExportCSV = async () => {
    const headers = [
      'Flags',
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
        '', // Flags
        !hidePatientNames ? row.name || 'Unknown Patient' : null,
        ...agingBuckets.map(bucket => {
          const pt = row.buckets?.[bucket]?.pt || 0;
          const ins = row.buckets?.[bucket]?.ins || 0;
          return `Pt: $${pt.toFixed(2)} / Ins: $${ins.toFixed(2)}`;
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
    link.setAttribute('download', `Aging_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Save snapshot to backend archive
    try {
      await reportingService.archiveReport('aging', filteredReportData);
      if (tabValue === 1) {
        // Refresh list if currently on archived tab
        const list = await reportingService.getArchivedReports();
        setArchivedReportsList(list.filter(r => r.type === 'aging'));
      }
    } catch (e) {
      console.error('Failed to archive report', e);
    }
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('aging-report-table');
    if (!tableEl) {
      alert("Table not found to print.");
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Aging Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Aging Report</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
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
    <Box sx={{ 
      p: 0,
      '@media print': {
        '& .hide-on-print': {
          display: 'none !important'
        }
      }
    }}>
      <Typography variant="h6" className="hide-on-print" sx={{ mb: 1, fontWeight: 700, color: '#1e293b' }}>
        Aging Report
      </Typography>

      <Box className="hide-on-print" sx={{ borderBottom: 1, borderColor: '#f1f5f9', mb: 2 }}>
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
          <Box className="hide-on-print">
            <AgingReportFilters onApplyFilters={handleApplyFilters} />
          </Box>
          
          <Box className="hide-on-print">
            <AgingReportActions 
              hidePatientNames={hidePatientNames} 
              setHidePatientNames={setHidePatientNames} 
              onExportCsv={handleExportCSV}
              onPrint={handlePrint}
            />
          </Box>

          <AgingReportTable 
            loading={loading}
            reportData={filteredReportData}
            hidePatientNames={hidePatientNames}
            agingBuckets={agingBuckets}
            groupByRange={appliedFilters.arRange === 'any'}
            totals={totals}
            showFlags={appliedFilters.showFlags}
            showPaymentPlan={appliedFilters.paymentPlanOwing}
            setSelectedPatientForNotes={setSelectedPatientForNotes}
            selectedNames={selectedNames}
            setSelectedNames={setSelectedNames}
          />
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            {!archivedDate && (
              <>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Filter reports by date:</Typography>
                <DatePicker
                  value={archiveFilterDate}
                  onChange={(v) => setArchiveFilterDate(v)}
                  format="MM/DD/YYYY"
                  slotProps={{ 
                    popper: { sx: { zIndex: 1400 } },
                    textField: { 
                      size: 'small', 
                      sx: { width: '165px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '8px', height: '40px', backgroundColor: '#fff' }, '& fieldset': { borderColor: '#e2e8f0' } } 
                    }
                  }}
                />
              </>
            )}
            {archiveFilterDate && (
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ textTransform: 'none', py: 0, height: 26, borderColor: '#e2e8f0', color: '#64748b', '&:hover': { bgcolor: '#f8fafc' } }}
                onClick={() => {
                  setArchiveFilterDate(null);
                }}
              >
                Clear
              </Button>
            )}
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { fontSize: '0.75rem', fontWeight: 600, color: '#64748b', backgroundColor: '#f8fafc', py: 1.5, borderBottom: '1px solid #e2e8f0' } }}>
                    <TableCell>Report Date / Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {archivedReportsLoading ? (
                    <TableRow>
                      <TableCell align="center" sx={{ py: 3 }}><Typography variant="body2" color="text.secondary">Loading archived reports...</Typography></TableCell>
                    </TableRow>
                  ) : archivedReportsList.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" sx={{ py: 3 }}><Typography variant="body2" color="text.secondary">No archived reports available.</Typography></TableCell>
                    </TableRow>
                  ) : (() => {
                    const visibleReports = archiveFilterDate && archiveFilterDate.isValid()
                      ? archivedReportsList.filter(r => new Date(r.snapshotDate).toISOString().split('T')[0] === archiveFilterDate.format('YYYY-MM-DD'))
                      : archivedReportsList;
                      
                    if (visibleReports.length === 0) {
                      return (
                        <TableRow>
                          <TableCell align="center" sx={{ py: 3 }}><Typography variant="body2" color="text.secondary">No reports match the selected date.</Typography></TableCell>
                        </TableRow>
                      );
                    }

                    return visibleReports.map((report, idx) => {
                      const dt = new Date(report.snapshotDate);
                      const formattedName = `Report - ${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                      return (
                        <TableRow 
                          key={report.id} 
                          sx={{ 
                            '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' },
                            backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff'
                          }}
                        >
                          <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>
                            {formattedName}
                          </TableCell>
                        </TableRow>
                      );
                    });
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
        </Box>
      )}

      <AccountNotesDialog 
        patient={selectedPatientForNotes}
        onClose={() => setSelectedPatientForNotes(null)}
      />

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

