import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  CircularProgress,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { reportingService } from '../../../../services/reporting.service';

const CreditAccountsReport = () => {
  const [filter, setFilter] = useState('All patients');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [groupByCredit, setGroupByCredit] = useState(false);
  
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCreditAccounts();
  }, []);

  const fetchCreditAccounts = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('credit-accounts');
      setReportData(data || []);
    } catch (error) {
      console.error('Failed to fetch', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    let data = [...reportData];
    
    // Inactive filter is visually hooked, but assuming all returned data is active unless specified
    // Outstanding filter logic (just an example based on balance)
    if (filter === 'Outstanding only') {
      data = data.filter(r => r.balTotal < 0); // Assuming negative means credit outstanding
    }
    
    if (groupByCredit) {
      data.sort((a, b) => (a.balTotal || 0) - (b.balTotal || 0));
    }
    
    return data;
  }, [reportData, filter, includeInactive, groupByCredit]);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Patient Name,Amount\n";
    filteredData.forEach(row => {
      const name = `${row.FName || ''} ${row.LName || ''}`.trim();
      csvContent += `"${name}","${row.balTotal || 0}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "credit_accounts_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Credit Accounts Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>Filter by Outstanding:</Typography>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            variant="standard"
            sx={{ fontSize: '0.85rem', minWidth: 120 }}
          >
            <MenuItem value="All patients">All patients</MenuItem>
            <MenuItem value="Outstanding only">Outstanding only</MenuItem>
          </Select>
        </Box>

        <FormControlLabel
          control={<Checkbox checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} size="small" />}
          label={<Typography sx={{ fontSize: '0.85rem' }}>Include Inactive Patients</Typography>}
        />

        <FormControlLabel
          control={<Checkbox checked={groupByCredit} onChange={(e) => setGroupByCredit(e.target.checked)} size="small" />}
          label={<Typography sx={{ fontSize: '0.85rem' }}>Group By Credit</Typography>}
        />

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={fetchCreditAccounts}
            sx={{
              backgroundColor: '#5c85bb',
              textTransform: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              py: 0.3,
              px: 1.5,
              minWidth: 'auto',
              '&:hover': { backgroundColor: '#4a74a8' }
            }}
          >
            Apply Filters
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#dcb265',
              textTransform: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              py: 0.3,
              px: 1.5,
              minWidth: 'auto',
              '&:hover': { backgroundColor: '#c99f54' }
            }}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleExportCSV}
          startIcon={<FileDownloadIcon />}
          sx={{
            backgroundColor: '#5c85bb',
            textTransform: 'none',
            fontSize: '0.72rem',
            fontWeight: 600,
            py: 0.3,
            px: 1.5,
            minWidth: 'auto',
            '&:hover': { backgroundColor: '#4a74a8' }
          }}
        >
          Export as CSV
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handlePrint}
          startIcon={<PrintIcon />}
          sx={{
            backgroundColor: '#dcb265',
            textTransform: 'none',
            fontSize: '0.72rem',
            fontWeight: 600,
            py: 0.3,
            px: 1.5,
            minWidth: 'auto',
            '&:hover': { backgroundColor: '#c99f54' }
          }}
        >
          Print
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Birth Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Patient Credit</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Insurance Credit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                  No credit accounts found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => {
                const name = `${row.FName || ''} ${row.LName || ''}`.trim();
                const bal = row.balTotal ? `$${Math.abs(row.balTotal).toFixed(2)}` : '$0.00';
                return (
                  <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fcfcfc' : '#fff' }}>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{name}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>-</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>-</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>-</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{bal}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{bal}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>$0.00</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CreditAccountsReport;

