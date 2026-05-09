import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';

const DUMMY_DATA = [
  { patient: 'Alice Smith', referralSource: 'Insurance', referDate: '05/01/2026', notes: 'Referred from Cigna portal' },
  { patient: 'Bob Johnson', referralSource: 'Dr. Mike Lee', referDate: '04/28/2026', notes: 'Oral surgeon referral' },
];

const ReferralByPatientReport = () => {
  const [currentDate, setCurrentDate] = useState(dayjs('2026-05-08'));
  const [dateRange, setDateRange] = useState('daily');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const handlePrevDate = () => setCurrentDate(prev => prev.subtract(1, 'day'));
  const handleNextDate = () => setCurrentDate(prev => prev.add(1, 'day'));

  const handlePrint = () => window.print();
  const handleExport = () => alert('Exporting report as CSV...');
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
      >
        Referral By Patient:
      </Typography>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Date Range:</Typography>
          <Select 
            variant="standard"
            size="small" 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            sx={{ fontSize: '0.75rem', width: 80, height: 24 }}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <ChevronLeft 
              onClick={handlePrevDate}
              sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} 
            />
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 600, minWidth: 80, textAlign: 'center' }}>
              {currentDate.format('MMM DD, YYYY')}
            </Typography>
            <ChevronRight 
              onClick={handleNextDate}
              sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} 
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Date:</Typography>
          <Typography variant="caption" sx={{ fontSize: '0.75rem', borderBottom: '1px solid #ccc', width: 100, pb: 0.5 }}>
            {currentDate.format('MM/DD/YYYY')}
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          size="small" 
          onClick={() => setTemplateDialogOpen(true)}
          sx={{ ml: 'auto', textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
        >
          Create Template
        </Button>
      </Box>

      <Divider sx={{ mb: 2, opacity: 0.3 }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleExport}
          sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
        >
          Export as CSV
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handlePrint}
          sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
        >
          Print
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Patient', 'Referral Source', 'Referral Date', 'Notes'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {DUMMY_DATA.map((row, i) => (
              <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.referralSource}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.referDate}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={handleSaveTemplate} 
      />
    </Box>
  );
};

export default ReferralByPatientReport;
