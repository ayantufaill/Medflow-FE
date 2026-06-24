import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import {
  fetchModificationsReport,
  selectModificationsData,
  selectModificationsLoading
} from '../../../../store/slices/billingSlice';

const MOCK_MODIFICATIONS = [
  { action: 'Add', trans: 'pay #25197', proc: 'D0120', rendering: 'SAB', billing: 'SAB', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '+$31.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'pay #25197', proc: 'D0274', rendering: 'SAB', billing: 'SAB', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '+$35.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'pay #25197', proc: 'D1110', rendering: 'SAB', billing: 'SAB', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '+$53.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'pay #25200', proc: 'D1110', rendering: 'KAR', billing: 'KAR', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '+$99.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'adj #25199', proc: 'D1110', rendering: 'KAR', billing: 'KAR', fees: '$0.00', creditAdj: '-$96.00', debitAdj: '$0.00', collection: '$0.00', accountCredit: '$0.00' },
  { action: 'Void', trans: 'pay #25213', proc: 'D1110', rendering: 'KAR', billing: 'KAR', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '-$99.00', accountCredit: '$0.00' },
  { action: 'Void', trans: 'adj #25212', proc: 'D1110', rendering: 'KAR', billing: 'KAR', fees: '$0.00', creditAdj: '+$96.00', debitAdj: '$0.00', collection: '$0.00', accountCredit: '$0.00' },
  { action: 'Add', trans: 'dep #25208', proc: 'D1110', rendering: '', billing: '', fees: '$0.00', creditAdj: '$0.00', debitAdj: '$0.00', collection: '$0.00', accountCredit: '+$9.90' },
];

const ModificationsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectModificationsData);
  const loading = useSelector(selectModificationsLoading);

  const [affectedDate, setAffectedDate] = useState('2026-05-08');

  useEffect(() => {
    dispatch(fetchModificationsReport({ date: affectedDate, range: 'Daily' }));
  }, [dispatch, affectedDate]);

  const mappedModifications = useMemo(() => {
    if (affectedDate === '2026-05-08') {
      return MOCK_MODIFICATIONS;
    }
    if (!reportData || reportData.length === 0) {
      return [];
    }

    return reportData.map(item => {
      // If backend returns modifications log: { timestamp, modifiedBy, field, originalValue, newValue }
      if (item.timestamp && item.modifiedBy) {
        return {
          action: item.field || 'Modify',
          trans: item.modifiedBy || 'System',
          proc: item.field || 'Log Entry',
          rendering: 'Admin',
          billing: 'Admin',
          fees: `$${parseFloat(item.originalValue || 0).toFixed(2)}`,
          creditAdj: `-$${Math.abs(parseFloat(item.newValue || 0) - parseFloat(item.originalValue || 0)).toFixed(2)}`,
          debitAdj: '$0.00',
          collection: '$0.00',
          accountCredit: '$0.00'
        };
      }
      return item;
    });
  }, [reportData, affectedDate]);

  const totalFees = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.fees || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalCreditAdj = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.creditAdj || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalDebitAdj = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.debitAdj || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalCollection = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.collection || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const totalAccountCredit = useMemo(() => mappedModifications.reduce((sum, row) => {
    const val = parseFloat((row.accountCredit || '0').replace(/[$,]/g, '')) || 0;
    return sum + val;
  }, 0), [mappedModifications]);

  const netProd = totalFees + totalCreditAdj + totalDebitAdj;

  const formatAmount = (val, prefix = '') => {
    if (val === 0) return '$0.00';
    if (val < 0) return `-$${Math.abs(val).toFixed(2)}`;
    return `${prefix}$${val.toFixed(2)}`;
  };

  const handleExportCSV = () => {
    const headers = [
      'Action',
      'Transaction #',
      'Procedures',
      'Rendering Prov / Internal Code',
      'Billing Prov / Internal Code',
      'Fees',
      'Credit Adj',
      'Debit Adj',
      'Collection',
      'Account Credit'
    ];

    const rows = mappedModifications.map(row => [
      row.action,
      row.trans,
      row.proc,
      row.rendering,
      row.billing,
      row.fees,
      row.creditAdj,
      row.debitAdj,
      row.collection,
      row.accountCredit
    ]);

    // Add totals row
    rows.push([
      'totals modifications',
      '',
      '',
      '',
      '',
      formatAmount(totalFees),
      formatAmount(totalCreditAdj),
      formatAmount(totalDebitAdj),
      formatAmount(totalCollection, '+'),
      formatAmount(totalAccountCredit, '+')
    ]);

    // Add net prod row
    rows.push([
      'net prod modification',
      '',
      '',
      '(prod + adj)',
      '',
      formatAmount(netProd),
      '',
      '',
      '',
      ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Modifications_Report_${affectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('modifications-report-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Modifications Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Modifications Report</h2>');
    printWindow.document.write(`<p>Affected Date: ${affectedDate}</p>`);
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', border: '1px solid #000' }}>
          <Box sx={{ px: 2, py: 0.5, borderRight: '1px solid #000', backgroundColor: '#f5f5f5' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>affected date:</Typography>
          </Box>
          <Box sx={{ px: 2, py: 0.5, display: 'flex', alignItems: 'center' }}>
            <input 
              type="date"
              value={affectedDate}
              onChange={(e) => setAffectedDate(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '0.8rem', fontFamily: 'inherit' }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportCSV}
            sx={{ fontSize: '0.75rem', py: 0.5 }}
          >
            Export CSV
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ fontSize: '0.75rem', py: 0.5 }}
          >
            Print
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #000', borderRadius: 0, position: 'relative' }}>
        <Table id="modifications-report-table" size="small" sx={{ '& .MuiTableCell-root': { border: '1px solid #000', px: 1, py: 0.5 } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Action</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>transaction #</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>procedures</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>rendering prov / internal code</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>billing prov / internal code</TableCell>
              <TableCell colSpan={3} align="center" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>production</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>collection</TableCell>
              <TableCell rowSpan={2} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>account credit</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>fees</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>credit adj</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>debit adj</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : mappedModifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.75rem' }}>
                  No modifications found for selected date.
                </TableCell>
              </TableRow>
            ) : (
              mappedModifications.map((row, index) => {
                const isAdd = row.action === 'Add';
                const isVoid = row.action === 'Void';
                const bgColor = isAdd ? '#e6f4ea' : isVoid ? '#fce8e6' : '#fff';
                const textColor = isAdd ? '#007b3e' : isVoid ? '#d93025' : '#000';
                const collectionColor = (row.collection || '').startsWith('-') ? '#d93025' : (row.collection || '').startsWith('+') ? '#007b3e' : '#000';

                return (
                  <TableRow key={index} sx={{ backgroundColor: bgColor }}>
                    <TableCell sx={{ fontSize: '0.75rem', color: textColor, fontWeight: 600 }}>{row.action}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#0052cc', textDecoration: 'underline' }}>{row.trans}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.proc}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.rendering}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.billing}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.fees}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: (row.creditAdj || '').startsWith('-') ? '#007b3e' : (row.creditAdj || '').startsWith('+') ? '#d93025' : '#000' }}>{row.creditAdj}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.debitAdj}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: collectionColor }}>{row.collection}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: (row.accountCredit || '').startsWith('+') ? '#007b3e' : '#000' }}>{row.accountCredit}</TableCell>
                  </TableRow>
                );
              })
            )}

            {!loading && mappedModifications.length > 0 && (
              <>
                {/* Totals Rows */}
                <TableRow sx={{ backgroundColor: '#fff' }}>
                  <TableCell colSpan={5} sx={{ fontWeight: 600, fontSize: '0.8rem' }}>totals modifications</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{formatAmount(totalFees)}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: totalCreditAdj < 0 ? '#d93025' : '#000' }}>{formatAmount(totalCreditAdj)}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{formatAmount(totalDebitAdj)}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: totalCollection < 0 ? '#d93025' : totalCollection > 0 ? '#007b3e' : '#000' }}>{formatAmount(totalCollection, '+')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: totalAccountCredit < 0 ? '#d93025' : totalAccountCredit > 0 ? '#007b3e' : '#000' }}>{formatAmount(totalAccountCredit, '+')}</TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: '#fff' }}>
                  <TableCell colSpan={3} sx={{ border: 'none' }}></TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', backgroundColor: '#f5f5f5' }}>net prod modification</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', backgroundColor: '#f5f5f5' }}>(prod + adj)</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', backgroundColor: '#f5f5f5', color: netProd < 0 ? '#d93025' : '#000' }}>{formatAmount(netProd)}</TableCell>
                  <TableCell colSpan={4} sx={{ border: 'none' }}></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ModificationsReport;
