import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import {
  fetchReferralByPatientReport,
  selectReferralByPatientData,
  selectPatientReportLoading,
} from '../../../../store/slices/patientReportSlice';

const DUMMY_DATA = [
  { patient: 'Melina Heck', referralSource: 'Melina Jackson', phone: '+13607368380', email: '' },
  { patient: 'Brad Pitt', referralSource: 'john bosco', phone: '+14022107551', email: 'nicole@pannetondental.com' },
  { patient: 'Travis Kendall', referralSource: 'Melina Sistoso', phone: '+19037462410', email: 'traviskendall1@gmail.com' },
];

const DATE_RANGES = [
  'Daily',
  'Range',
  'This Week',
  'This Month',
  'Last 7 days',
  'Last Week',
  'Last 4 Weeks',
  'Last Month',
  'Last 3 Months',
  'Last 12 Months',
  'Month to date',
  'Quarter to date',
  'Year to date',
  'Last Year',
];

const ActionIcons = () => (
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    <PersonIcon sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
    <CalendarTodayIcon sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
    <AttachMoneyIcon sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
    <ListAltIcon sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
  </Box>
);

const ReferralByPatientReport = () => {
  const dispatch = useDispatch();
  const rawReportData = useSelector(selectReferralByPatientData);
  const loading = useSelector(selectPatientReportLoading);

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());
  const [dateRange, setDateRange] = useState('Daily');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [data, setData] = useState(DUMMY_DATA);

  const computeDates = (mode) => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    switch (mode) {
      case 'Daily':
        break;
      case 'This Week': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'This Month': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case 'Last 7 days': {
        start.setDate(today.getDate() - 7);
        break;
      }
      case 'Last Week': {
        const day = today.getDay();
        const diff = today.getDate() - day - 6 + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'Last 4 Weeks': {
        start.setDate(today.getDate() - 28);
        break;
      }
      case 'Last Month': {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      case 'Last 3 Months': {
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        break;
      }
      case 'Last 12 Months': {
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
      }
      case 'Month to date': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      }
      case 'Quarter to date': {
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      }
      case 'Year to date': {
        start = new Date(today.getFullYear(), 0, 1);
        break;
      }
      case 'Last Year': {
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      }
      case 'Range':
        return null;
      default:
        return null;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  const handleDateRangeChange = (e) => {
    const newMode = e.target.value;
    setDateRange(newMode);
    
    const dates = computeDates(newMode);
    if (dates) {
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    }
  };

  // Fetch from backend when date or range changes
  useEffect(() => {
    dispatch(fetchReferralByPatientReport({ 
      startDate,
      endDate,
      range: dateRange
    }));
  }, [dispatch, startDate, endDate, dateRange]);

  // Sync redux state to local state (with fallback to dummy data)
  useEffect(() => {
    if (rawReportData && rawReportData.length > 0) {
      const mapped = rawReportData.map((item) => ({
        patient: item.referred,
        referralSource: item.referredBy,
        phone: '',
        email: '',
      }));
      setData(mapped);
    } else if (!loading) {
      setData(DUMMY_DATA);
    }
  }, [rawReportData, loading]);

  const groupedData = useMemo(() => {
    const groups = {};
    data.forEach(item => {
      const groupKey = item.referralSource || 'Unknown';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });
    return groups;
  }, [data]);

  const handlePrint = () => {
    const tableEl = document.getElementById('referral-report-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Referral By Patient Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; color: #666; }');
    printWindow.document.write('.no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Referral By Patient Report</h2>');
    printWindow.document.write(`<p>Date Range: ${dateRange} (${startDate} to ${endDate})</p>`);
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

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
            onChange={handleDateRangeChange}
            sx={{ fontSize: '0.75rem', width: 120, height: 24 }}
          >
            {DATE_RANGES.map((range) => (
              <MenuItem key={range} value={range}>{range}</MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Start Date:
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
            />
          </Typography>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            End Date:
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
            />
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          size="small" 
          disabled
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
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#4a89dc' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
          <Table id="referral-report-table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#666', borderBottom: '1px solid #ddd' }}>Referral Patient</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#666', borderBottom: '1px solid #ddd' }}>Referred Patients</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#666', borderBottom: '1px solid #ddd' }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.72rem', color: '#666', borderBottom: '1px solid #ddd' }}>Email Address</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #ddd', width: 80 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedData).map(([referrer, patients]) => (
                <React.Fragment key={referrer}>
                  {/* Group Header Row */}
                  <TableRow sx={{ backgroundColor: '#fff' }}>
                    <TableCell sx={{ fontSize: '0.7rem', color: '#666', borderBottom: '1px solid #eee' }}>
                      {referrer}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #eee' }}></TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #eee' }}></TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #eee' }}></TableCell>
                    <TableCell className="no-print" sx={{ borderBottom: '1px solid #eee' }}>
                      <ActionIcons />
                    </TableCell>
                  </TableRow>
                  
                  {/* Item Rows */}
                  {patients.map((p, idx) => (
                    <TableRow key={idx} sx={{ backgroundColor: '#fff' }}>
                      <TableCell sx={{ borderBottom: '1px solid #eee' }}></TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', color: '#666', borderBottom: '1px solid #eee' }}>{p.patient}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', color: '#666', borderBottom: '1px solid #eee' }}>{p.phone || ''}</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', color: '#666', borderBottom: '1px solid #eee' }}>{p.email || ''}</TableCell>
                      <TableCell className="no-print" sx={{ borderBottom: '1px solid #eee' }}>
                        <ActionIcons />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Summary Row */}
                  <TableRow sx={{ backgroundColor: '#fff' }}>
                    <TableCell sx={{ borderBottom: '1px solid #ddd' }}></TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', color: '#333', borderBottom: '1px solid #ddd' }}>Total Referrals:</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', color: '#333', borderBottom: '1px solid #ddd' }}>{patients.length}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #ddd' }}></TableCell>
                    <TableCell className="no-print" sx={{ borderBottom: '1px solid #ddd' }}></TableCell>
                  </TableRow>
                </React.Fragment>
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

export default ReferralByPatientReport;
