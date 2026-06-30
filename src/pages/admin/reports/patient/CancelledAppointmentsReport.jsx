import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
} from '@mui/material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { fetchCancelledAppointmentsReport } from '../../../../store/slices/patientReportSlice';

const DUMMY_DATA = [
  { patient: 'Kevin Wells', type: 'Recare', providers: 'BAL', duration: '60 mins', prefDay: 'Wed', prefTime: '10:05 AM', procedures: '', aptDate: 'Jun 22, 2022', nextAptDate: 'Sep 14, 2022' },
  { patient: 'shelby test', type: 'Treatment', providers: 'SMI', duration: '30 mins', prefDay: 'Fri', prefTime: '10:50 AM', procedures: '', aptDate: 'Jun 24, 2022', nextAptDate: '' },
  { patient: 'Billy Training', type: 'Treatment', providers: 'DR2', duration: '60 mins', prefDay: 'Tues', prefTime: '10:55 AM', procedures: '', aptDate: 'Jun 28, 2022', nextAptDate: '' },
  { patient: 'Melina Stockton', type: 'Recare', providers: 'BAL', duration: '90 mins', prefDay: 'Tues', prefTime: '01:05 PM', procedures: '', aptDate: 'Jun 28, 2022', nextAptDate: 'Dec 27, 2022' },
  { patient: 'Billy Training', type: 'Treatment', providers: 'BAL', duration: '60 mins', prefDay: 'Thurs', prefTime: '10:00 AM', procedures: '', aptDate: 'Jun 30, 2022', nextAptDate: '' },
  { patient: 'Melina Bignami', type: 'Treatment', providers: 'BAL', duration: '90 mins', prefDay: 'Thurs', prefTime: '09:45 AM', procedures: '', aptDate: 'Jun 30, 2022', nextAptDate: 'Dec 30, 2022' },
  { patient: 'Ana Ramos', type: 'Recare', providers: 'SMI', duration: '60 mins', prefDay: 'Fri', prefTime: '10:30 AM', procedures: '', aptDate: 'Jul 01, 2022', nextAptDate: '' },
];

const CancelledAppointmentsReport = () => {
  const dispatch = useDispatch();
  const { cancelledAppointmentsData, loading } = useSelector((state) => state.patientReport || { cancelledAppointmentsData: [], loading: false });

  // Get current date string in YYYY-MM-DD for native date input
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  
  const [data, setData] = useState(DUMMY_DATA);
  const [showData, setShowData] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  useEffect(() => {
    let baseData = DUMMY_DATA;
    if (cancelledAppointmentsData && cancelledAppointmentsData.length > 0) {
      baseData = cancelledAppointmentsData.map(item => ({
        patient: item.patient || 'Unknown',
        type: item.type || '',
        providers: item.provider || item.providers || '',
        duration: item.duration || '',
        prefDay: item.prefDay || '',
        prefTime: item.prefTime || '',
        procedures: item.procedures || '',
        aptDate: item.date || item.aptDate || '',
        nextAptDate: item.nextAptDate || '',
      }));
    } else if (loading || !showData) {
      return;
    }

    let filtered = baseData;
    
    // Apply date range filter
    if (startDate || endDate) {
      const startT = startDate ? new Date(startDate).getTime() : 0;
      // Add one day to end date to make it inclusive
      const endT = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;
      
      filtered = filtered.filter(item => {
        if (!item.aptDate) return true; // If no date, maybe keep it or drop it? Let's keep if no date.
        const itemT = new Date(item.aptDate).getTime();
        if (isNaN(itemT)) return true; // Invalid date
        return itemT >= startT && itemT < endT;
      });
    }

    setData(filtered);
  }, [cancelledAppointmentsData, loading, showData, startDate, endDate]);

  const handleApply = () => {
    setShowData(true);
    dispatch(fetchCancelledAppointmentsReport({ startDate, endDate }));
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('cancelled-appointments-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Cancelled Appointments Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Cancelled Appointments Report</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);
  const handleCreateTemplate = () => setTemplateDialogOpen(true);

  return (
    <Box sx={{ p: 4, backgroundColor: '#fff', textAlign: 'left', minHeight: '100vh' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#3b5998', fontWeight: 500, mb: 4, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}
      >
        Cancelled Appointments Report:
      </Typography>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#555', fontSize: '0.8rem', pb: 0.5 }}>Start Date:</Typography>
            <TextField 
              variant="standard"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ width: 120, input: { fontSize: '0.8rem', color: '#555', py: 0.5, cursor: 'pointer' } }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#555', fontSize: '0.8rem', pb: 0.5 }}>End Date:</Typography>
            <TextField 
              variant="standard"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ width: 120, input: { fontSize: '0.8rem', color: '#555', py: 0.5, cursor: 'pointer' } }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            onClick={handleApply}
            sx={{ textTransform: 'none', backgroundColor: '#8ca9d3', color: '#fff', fontSize: '0.75rem', px: 3, boxShadow: 'none' }}
          >
            Apply
          </Button>
          <Button 
            variant="contained" 
            disabled
            onClick={handleCreateTemplate}
            sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', px: 2, boxShadow: 'none' }}
          >
            Create Template
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePrint}
            sx={{ textTransform: 'none', backgroundColor: '#e74c3c', color: '#fff', fontSize: '0.75rem', px: 3, boxShadow: 'none' }}
          >
            Print
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#e0e0e0', borderBottomWidth: 1 }} />

      {/* Table Section */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#8ca9d3' }} />
        </Box>
      ) : (
        <TableContainer elevation={0} sx={{ border: 'none', borderRadius: 0 }}>
          <Table id="cancelled-appointments-table" size="small">
            <TableHead>
              <TableRow>
                {[
                  'Patient', 'Type', 'Providers', 'Duration', 'Pref. day', 
                  'Pref. time', 'Procedures', 'Apt. Date', 'Next Apt. Date'
                ].map((header) => (
                  <TableCell 
                    key={header} 
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '0.75rem', 
                      py: 1.5, 
                      px: 1, 
                      borderBottom: '1px solid #e0e0e0', 
                      backgroundColor: '#fff',
                      color: '#444'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow 
                  key={index} 
                  sx={{ 
                    backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                    '& td': { borderBottom: '1px solid #f0f0f0' }
                  }}
                >
                  <TableCell sx={{ fontSize: '0.75rem', py: 1.5, px: 1, color: '#555' }}>{row.patient}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1.5, px: 1, color: '#666' }}>{row.type}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1.5, px: 1, color: '#666' }}>{row.providers}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1.5, px: 1, color: '#666' }}>{row.duration}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1.5, px: 1, color: '#666' }}>{row.prefDay}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1.5, px: 1, color: '#666' }}>{row.prefTime}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1.5, px: 1, color: '#666' }}>{row.procedures}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1.5, px: 1, color: '#666' }}>{row.aptDate}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', py: 1.5, px: 1, color: '#666' }}>{row.nextAptDate}</TableCell>
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

export default CancelledAppointmentsReport;
