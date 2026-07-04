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
import { useDispatch, useSelector } from 'react-redux';
import { fetchArAgingReport, selectArAging, selectArAgingLoading } from '../../../../store/slices/billingSlice';
import { reportingService } from '../../../../services/reporting.service';

const AgingReport = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showAccountNotes, setShowAccountNotes] = useState(false);
  const [hidePatientNames, setHidePatientNames] = useState(false);
  
  const dispatch = useDispatch();
  const arAging = useSelector(selectArAging);
  const loading = useSelector(selectArAgingLoading);
  const reportData = arAging || [];

  const [archivedDate, setArchivedDate] = useState('');
  const [archivedData, setArchivedData] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchArAgingReport());
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
      totalOwings: 0,
      totalCredit: 0
    };
    agingBuckets.forEach(b => sums.buckets[b] = 0);

    reportData.forEach(row => {
      agingBuckets.forEach(b => {
        const bData = row.buckets?.[b];
        if (bData) {
          sums.buckets[b] += (bData.pt || 0) + (bData.ins || 0);
        }
      });
      sums.totalOwings += (row.totalOwings || 0);
      sums.totalCredit += (row.credit || 0);
    });
    return sums;
  }, [reportData, agingBuckets]);

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
                    <TableCell key={bucket} align="right" sx={{ width: '8%', fontWeight: 600 }}>
                      ${totals.buckets[bucket].toFixed(2)}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ width: '8%', fontWeight: 600 }}>${totals.totalOwings.toFixed(2)}</TableCell>
                  <TableCell sx={{ width: '15%' }}></TableCell>
                </TableRow>
                <TableRow sx={{ '& td': { fontSize: '0.75rem', border: 'none', py: 0.2 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>Total Account Credit</TableCell>
                  {agingBuckets.map((_, i) => <TableCell key={i}></TableCell>)}
                  <TableCell></TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>${totals.totalCredit.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Select report by date:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', pb: 0.5, width: 200 }}>
              <input 
                type="date" 
                value={archivedDate} 
                onChange={handleDateSelect} 
                style={{ border: 'none', outline: 'none', width: '100%', color: '#666', fontSize: '0.875rem' }} 
              />
            </Box>
          </Box>

          {archivedDate && (
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
          )}
        </Box>
      )}

      {showAccountNotes && (
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
          onClick={() => setShowAccountNotes(false)}
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
              onClose={() => setShowAccountNotes(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AgingReport;

