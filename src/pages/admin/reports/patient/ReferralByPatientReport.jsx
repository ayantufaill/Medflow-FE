import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDivider } from '../../../../components/reports/ui';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
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

  const handleClearFilters = () => {
    setDateRange('Daily');
    setStartDate(getTodayString());
    setEndDate(getTodayString());
  };

  const topFilters = (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReportSelect 
        label="DATE RANGE" 
        options={DATE_RANGES.map(r => ({ value: r, label: r }))} 
        value={dateRange} 
        onChange={handleDateRangeChange} 
        width="160px" 
      />

      <ReportDivider />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>start date</Typography>
        <DatePicker
          value={startDate ? dayjs(startDate) : null}
          onChange={(newValue) => setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { size: 'small', sx: { width: '135px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '4px', height: '36px', backgroundColor: '#fafbfe', color: '#09121f' }, '& fieldset': { borderColor: '#e2e8f0' } } }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>end date</Typography>
        <DatePicker
          value={endDate ? dayjs(endDate) : null}
          onChange={(newValue) => setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { size: 'small', sx: { width: '135px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '4px', height: '36px', backgroundColor: '#fafbfe', color: '#09121f' }, '& fieldset': { borderColor: '#e2e8f0' } } }
          }}
        />
      </Box>
    </LocalizationProvider>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Referral By Patient:">
        <Box className="hide-on-print" sx={{ mb: 2 }}>
          <ReportFilterBar 
            topRowFilters={topFilters}
            onClearAll={handleClearFilters}
            onCreateTemplate={() => setTemplateDialogOpen(true)}
          />
        </Box>

        {/* Summary Text and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
            (number of patients = {data.length})
          </Typography>
          <Box sx={{ transform: 'translateY(-4px)' }}>
            <ProductionReportActions
              onExportCsv={handleExport}
              onPrint={handlePrint}
              hasData={data.length > 0}
            />
          </Box>
        </Box>

      {/* Table Section */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#4a89dc' }} />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ 
          bgcolor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
          mt: 1 
        }}>
          <Table id="referral-report-table" size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', color: '#1a3353', textTransform: 'uppercase', py: 1.5 } }}>
                <TableCell>Referral Patient</TableCell>
                <TableCell>Referred Patients</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Email Address</TableCell>
                <TableCell width={80}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ '& .MuiTableRow-root:hover': { backgroundColor: '#f8fafc' }, '& .MuiTableCell-root': { fontSize: "0.85rem", verticalAlign: "middle", borderBottom: '1px solid #e2e8f0' } }}>
              {Object.entries(groupedData).map(([referrer, patients]) => (
                <React.Fragment key={referrer}>
                  {/* Group Header Row */}
                  <TableRow sx={{ backgroundColor: '#fff' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {referrer}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="no-print">
                      <ActionIcons />
                    </TableCell>
                  </TableRow>
                  
                  {/* Item Rows */}
                  {patients.map((p, idx) => (
                    <TableRow key={idx} sx={{ backgroundColor: '#fff' }}>
                      <TableCell></TableCell>
                      <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{p.patient}</TableCell>
                      <TableCell sx={{ color: '#475569' }}>{p.phone || ''}</TableCell>
                      <TableCell sx={{ color: '#475569' }}>{p.email || ''}</TableCell>
                      <TableCell className="no-print">
                        <ActionIcons />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Summary Row */}
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell></TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>Total Referrals:</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>{patients.length}</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="no-print"></TableCell>
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
        onSave={(name) => alert(`Template "${name}" saved!`)} 
      />
      </ReportLayout>
    </React.Fragment>
  );
};
export default ReferralByPatientReport;
