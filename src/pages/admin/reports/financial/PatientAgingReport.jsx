import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPatientAgingReport,
  selectPatientAging,
  selectPatientAgingLoading
} from '../../../../store/slices/billingSlice';
import AccountNotesDialog from '../../../../components/finance/AccountNotesDialog';
import GenerateStatementsDialog from '../../../../components/finance/GenerateStatementsDialog';
import ViewGeneratedStatementsDialog from '../../../../components/finance/ViewGeneratedStatementsDialog';

const PatientAgingReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectPatientAging) || [];
  const loading = useSelector(selectPatientAgingLoading);
  const [flagFilter, setFlagFilter] = useState('pts');
  const [showFlags, setShowFlags] = useState(true);

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
    return enrichedReportData.filter(row => {
      if (flagFilter === 'with_flags') {
        if (!row.flags || row.flags.length === 0) return false;
      } else if (flagFilter === 'without_flags') {
        if (row.flags && row.flags.length > 0) return false;
      }
      return true;
    });
  }, [enrichedReportData, flagFilter]);

  const [selectedPatientForNotes, setSelectedPatientForNotes] = useState(null);
  const [showGenerateStatements, setShowGenerateStatements] = useState(false);
  const [showViewGeneratedStatements, setShowViewGeneratedStatements] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hidePatientNames, setHidePatientNames] = useState(false);
  const [selectedNames, setSelectedNames] = useState([]);

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

  const handleExportCSV = () => {
    const headers = [
      'Flags',
      !hidePatientNames ? 'Patient Name' : null,
      ...agingBuckets,
      'Total',
      'Total owings',
      'Payment Plan Owing',
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
        `$${(row.paymentPlan || 0).toFixed(2)}`,
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
    link.setAttribute('download', `Patient_Aging_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('patient-aging-report-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Patient Aging Report Table Only</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Patient Aging Report</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  useEffect(() => {
    dispatch(fetchPatientAgingReport());
  }, [dispatch]);

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

  const netOutstandingBalance = useMemo(() => {
    return Math.max(0, totals.totalOutstanding - totals.totalCredit);
  }, [totals]);

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Patient Aging Report:
      </Typography>

      {/* Filter Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', p: 2, borderRadius: 1, mb: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item>
            <Select size="small" defaultValue="any" sx={{ minWidth: 120, fontSize: '0.75rem', backgroundColor: '#fff' }}>
              <MenuItem value="any">Any AR Range</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Select 
            size="small" 
            value={flagFilter} 
            onChange={(e) => setFlagFilter(e.target.value)} 
            sx={{ minWidth: 200, fontSize: '0.75rem', backgroundColor: '#fff' }}
          >
            <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
            <MenuItem value="with_flags">Pts With Flags Only</MenuItem>
            <MenuItem value="without_flags">Pts Without Flags Only</MenuItem>
          </Select>
          <FormControlLabel 
            control={<Checkbox size="small" checked={showFlags} onChange={(e) => setShowFlags(e.target.checked)} />} 
            label={<Typography variant="caption">Show Flags in Report</Typography>} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
          <Select size="small" defaultValue="high-low" sx={{ minWidth: 160, fontSize: '0.75rem', backgroundColor: '#fff' }}>
            <MenuItem value="high-low">High to Low Owings</MenuItem>
          </Select>
          <FormControlLabel 
            control={<Checkbox size="small" defaultChecked />} 
            label={<Typography variant="caption">Show Payment Plan Owing</Typography>} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Reset Invoice outstanding balance age to 0 days: 
            <Box component="span" sx={{ ml: 1, color: 'primary.main', cursor: 'help' }}>ⓘ</Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption">On Patient Payment:</Typography>
            <Select size="small" defaultValue="dont" sx={{ minWidth: 160, fontSize: '0.75rem', backgroundColor: '#fff' }}>
              <MenuItem value="dont">Don't reset invoice age</MenuItem>
            </Select>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
          <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ textTransform: 'none', bgcolor: '#94a3b8' }}
            onClick={() => setShowGenerateStatements(true)}
          >
            Generate Batch Statement
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ textTransform: 'none', bgcolor: '#f5a623' }}
            onClick={() => setShowViewGeneratedStatements(true)}
          >
            View generated statements
          </Button>
          {isGenerating && (
            <Typography variant="caption" sx={{ color: '#4a90e2', fontWeight: 600, ml: 1 }}>
              Generating statements...
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel 
            control={<Checkbox size="small" checked={hidePatientNames} onChange={(e) => setHidePatientNames(e.target.checked)} />} 
            label={<Typography variant="caption">Hide Patient Names</Typography>} 
          />
          <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
          <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }} id="patient-aging-report-table">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1 } }}>
              <TableCell padding="checkbox">
                <Checkbox 
                  size="small" 
                  checked={filteredReportData.length > 0 && selectedNames.length === filteredReportData.length}
                  indeterminate={selectedNames.length > 0 && selectedNames.length < filteredReportData.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNames(filteredReportData.map(row => row.name));
                    } else {
                      setSelectedNames([]);
                    }
                  }}
                />
              </TableCell>
              {showFlags && <TableCell>Flags</TableCell>}
              {!hidePatientNames && <TableCell>Patient Name</TableCell>}
              {agingBuckets.map(bucket => <TableCell key={bucket} align="right">{bucket}</TableCell>)}
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Total owings</TableCell>
              <TableCell align="right">Payment Plan Owing</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell>Last Billed On</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={(showFlags ? 1 : 0) + (hidePatientNames ? 11 : 12)} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredReportData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={(showFlags ? 1 : 0) + (hidePatientNames ? 11 : 12)} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">No patient aging data found.</Typography>
                </TableCell>
              </TableRow>
            ) : filteredReportData.map((row, idx) => (
              <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 0.5, verticalAlign: 'top' } }}>
                <TableCell padding="checkbox">
                  <Checkbox 
                    size="small" 
                    checked={selectedNames.includes(row.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedNames(prev => [...prev, row.name]);
                      } else {
                        setSelectedNames(prev => prev.filter(name => name !== row.name));
                      }
                    }}
                  />
                </TableCell>
                {showFlags && (
                  <TableCell>
                    {row.flags && row.flags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.2 }}>
                        {row.flags.map((color, i) => (
                          <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                        ))}
                      </Box>
                    )}
                  </TableCell>
                )}
                {!hidePatientNames && (
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.6rem' }}>👤</Typography>
                      </Box>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 600, cursor: 'pointer' }}>{row.name}</Typography>
                    </Box>
                  </TableCell>
                )}
                {agingBuckets.map(bucket => (
                  <TableCell key={bucket} align="right">
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block' }}>Pt. ${(row.buckets?.[bucket]?.pt || 0).toFixed(2)}</Typography>
                    </Box>
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Typography variant="caption" sx={{ display: 'block' }}>${(row.total || 0).toFixed(2)}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>${(row.totalOwings || 0).toFixed(2)}</TableCell>
                <TableCell align="right">${(row.paymentPlan || 0).toFixed(2)}</TableCell>
                <TableCell align="right">${(row.credit || 0).toFixed(2)}</TableCell>
                <TableCell>{row.lastBilled}</TableCell>
                <TableCell>
                  <Box 
                    sx={{ display: 'flex', alignItems: 'center', color: 'success.main', cursor: 'pointer' }}
                    onClick={() => setSelectedPatientForNotes(row)}
                  >
                    <NoteAddIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    <Typography variant="caption">add account note</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Footer */}
      <Box sx={{ mt: 2, borderTop: '2px solid #e0e0e0', pt: 2 }}>
        <Table size="small">
          <TableBody>
            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ width: '25%', fontWeight: 600 }}>Total Outstanding Balances</TableCell>
              {agingBuckets.map((bucket, i) => (
                <TableCell key={i} align="right" sx={{ width: '8%', fontWeight: 600 }}>
                  ${totals.buckets[bucket]?.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ width: '8%', fontWeight: 600 }}>
                ${totals.totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell sx={{ width: '15%' }}></TableCell>
            </TableRow>

            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>Total Patients Balances</TableCell>
              {agingBuckets.map((bucket, i) => (
                <TableCell key={i} align="right" sx={{ fontWeight: 600 }}>
                  ${totals.buckets[bucket]?.pt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${totals.totalPt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>Total Insurance Balances</TableCell>
              {agingBuckets.map((bucket, i) => (
                <TableCell key={i} align="right" sx={{ fontWeight: 600 }}>
                  ${totals.buckets[bucket]?.ins.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${totals.totalIns.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>Total Account Credit</TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${totals.totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
            <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
              <TableCell sx={{ fontWeight: 600 }}>
                Net Outstanding Balances<br/>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>(Total Outstanding - Total Account Credit)</Typography>
              </TableCell>
              {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.85rem' }}>
                ${netOutstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Dialog Modals */}
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

export default PatientAgingReport;
