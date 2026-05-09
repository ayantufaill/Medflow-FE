import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Edit as EditIcon, Print as PrintIcon, FileDownload as DownloadIcon } from '@mui/icons-material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';

const DUMMY_DATA = [
  {
    number: '1249',
    patient: 'John Doe',
    flags: 'VIP, Pre-med',
    lastAppointment: '05/01/2026',
  },
  {
    number: '1210',
    patient: 'Jane Smith',
    flags: 'Billing Alert',
    lastAppointment: '04/22/2026',
  },
  {
    number: '540',
    patient: 'Robert Brown',
    flags: 'X-Ray needed',
    lastAppointment: '05/05/2026',
  },
];

const PatientFlagsReport = () => {
  const [filterBy, setFilterBy] = useState('active');
  const [showData, setShowData] = useState(false);

  const handleApplyFilters = () => {
    setShowData(true);
  };

  const handleExportCSV = () => {
    if (!showData) {
      alert('Please apply filters first to generate data.');
      return;
    }
    const headers = ['Patient Number', 'Patient', 'Flags', 'Last Appointment'];
    const csvRows = [
      headers.join(','),
      ...DUMMY_DATA.map((row) =>
        [row.number, `"${row.patient}"`, `"${row.flags}"`, row.lastAppointment].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_flags_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);
  const handleCreateTemplate = () => setTemplateDialogOpen(true);

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
      >
        Patient Flags Report:
      </Typography>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#337ab7' }}>Filter Report By</Typography>
            <Select
              size="small"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              sx={{ height: 30, fontSize: '0.8rem', width: 180, backgroundColor: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#337ab7' } }}
            >
              <MenuItem value="active">Active Patients Only</MenuItem>
              <MenuItem value="all">All Patients</MenuItem>
              <MenuItem value="inactive">Inactive Patients Only</MenuItem>
            </Select>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, pt: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Including Flags:</Typography>
              <Button
                variant="contained"
                size="small"
                endIcon={<EditIcon sx={{ fontSize: 14 }} />}
                sx={{ backgroundColor: '#4a89dc', textTransform: 'none', fontSize: '0.75rem', height: 26, minWidth: 80 }}
              >
                Flags
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Excluding Flags:</Typography>
              <Button
                variant="contained"
                size="small"
                endIcon={<EditIcon sx={{ fontSize: 14 }} />}
                sx={{ backgroundColor: '#4a89dc', textTransform: 'none', fontSize: '0.75rem', height: 26, minWidth: 80 }}
              >
                Flags
              </Button>
            </Box>
          </Box>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1, pt: 2.5 }}>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleApplyFilters}
              sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
            >
              Apply Filters
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleCreateTemplate}
              sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
            >
              Create Template
            </Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, borderColor: '#e67e22', opacity: 0.3 }} />

      {/* Results Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="caption" 
          sx={{ fontWeight: 700, textDecoration: 'underline', color: '#333' }}
        >
          Number of Patients: {showData ? DUMMY_DATA.length : 0}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleExportCSV}
            startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
            sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
          >
            Export as CSV
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            onClick={handlePrint}
            startIcon={<PrintIcon sx={{ fontSize: 16 }} />}
            sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Content */}
      {!showData ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body2" color="text.secondary">
            Please select which flags you would like to include/exclude, then click on "apply filters"
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Patient Number', 'Patient', 'Flags', 'Last Appointment'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 600, fontSize: '0.75rem', py: 1, px: 1, borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {DUMMY_DATA.map((row, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', '& td': { borderBottom: '1px solid #eee' } }}>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.number}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1, color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.flags}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.lastAppointment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={handleSaveTemplate} 
      />
    </Box>
  );
};

export default PatientFlagsReport;
