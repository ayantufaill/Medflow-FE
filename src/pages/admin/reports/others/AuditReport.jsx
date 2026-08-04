import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Select, MenuItem, Button, IconButton, Divider
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuditReport } from '../../../../store/slices/othersReportSlice';
import { ReportLayout } from '../../../../components/reports/ui';
import AuditReportFilters from '../../../../components/reports/others/AuditReportFilters';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import dayjs from 'dayjs';

const AuditReport = () => {
  const dispatch = useDispatch();
  const { auditData, loading } = useSelector((state) => state.othersReport);

  const [dateRange, setDateRange] = useState('Daily');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [searchUser, setSearchUser] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [actionFilter, setActionFilter] = useState('None');
  const [categoryFilter, setCategoryFilter] = useState('None');

  const fetchReportData = () => {
    dispatch(fetchAuditReport({
      startDate,
      endDate,
      range: dateRange,
      searchUser: searchUser || undefined,
      searchPatient: searchPatient || undefined,
      action: actionFilter !== 'None' ? actionFilter : undefined,
      category: categoryFilter !== 'None' ? categoryFilter : undefined,
    }));
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleApply = () => {
    fetchReportData();
  };

  const handleClear = () => {
    setDateRange('Daily');
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setEndDate(dayjs().format('YYYY-MM-DD'));
    setSearchUser('');
    setSearchPatient('');
    setActionFilter('None');
    setCategoryFilter('None');
    setTimeout(() => {
      dispatch(fetchAuditReport({
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        range: 'Daily',
      }));
    }, 0);
  };

  const filteredData = (auditData || []).filter(row => {
    if (searchUser && !row.user?.toLowerCase().includes(searchUser.toLowerCase())) return false;
    if (searchPatient && !row.patient?.toLowerCase().includes(searchPatient.toLowerCase())) return false;
    if (actionFilter !== 'None' && row.action !== actionFilter) return false;
    if (categoryFilter !== 'None' && row.category !== categoryFilter) return false;
    return true;
  });

  return (
    <ReportLayout title="Audit Report:">
      <AuditReportFilters 
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        searchUser={searchUser}
        searchPatient={searchPatient}
        actionFilter={actionFilter}
        categoryFilter={categoryFilter}
        setDateRange={setDateRange}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setSearchUser={setSearchUser}
        setSearchPatient={setSearchPatient}
        setActionFilter={setActionFilter}
        setCategoryFilter={setCategoryFilter}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions 
        onExportCsv={() => alert('Exporting CSV...')} 
        onPrint={() => window.print()} 
      />

      {/* Audit Table Custom Render since it has merged headers */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th rowSpan="2" style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>Patient</th>
              <th rowSpan="2" style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>User</th>
              <th rowSpan="2" style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>Category</th>
              <th rowSpan="2" style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>Subcategory</th>
              <th rowSpan="2" style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>Action</th>
              <th rowSpan="2" style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>Object</th>
              <th rowSpan="2" style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>Date</th>
              <th rowSpan="2" style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>Message</th>
              <th colSpan="3" style={{ padding: '12px 8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', textAlign: 'center' }}>Difference</th>
            </tr>
            <tr>
              <th style={{ padding: '8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', textAlign: 'center' }}>Key</th>
              <th style={{ padding: '8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', textAlign: 'center' }}>Old</th>
              <th style={{ padding: '8px', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid #e0e0e0', textAlign: 'center' }}>New</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" style={{ padding: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ padding: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
                  No audit logs found
                </td>
              </tr>
            ) : filteredData.map((row, index) => (
              <tr key={row.id || index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.patient || ''}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.user || ''}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.category || ''}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.subcategory || ''}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.action || ''}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.object || ''}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.date || (row.createdAt ? dayjs(row.createdAt).format('MM/DD/YYYY h:mm A') : '')}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0', maxWidth: 300, wordBreak: 'break-word', color: '#666', verticalAlign: 'top' }}>
                  {(() => {
                    if (!row.message) return '';
                    try {
                      // Attempt to extract JSON from params=...
                      const paramsMatch = row.message.match(/params=(\{.*\})/);
                      if (paramsMatch && paramsMatch[1]) {
                        const jsonStr = paramsMatch[1];
                        const parsed = JSON.parse(jsonStr);
                        const formattedJson = JSON.stringify(parsed, null, 2);
                        const prefix = row.message.replace(paramsMatch[0], '').replace(/,\s*$/, '').trim();
                        return (
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', display: 'inline' }}>{prefix}</Typography>
                            {prefix && <br />}
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, mt: 0.5 }}>Params:</Typography>
                            <Box 
                              component="pre" 
                              sx={{ 
                                m: 0, 
                                p: 1, 
                                mt: 0.5,
                                bgcolor: '#f1f5f9', 
                                borderRadius: '4px', 
                                fontSize: '0.7rem', 
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                                border: '1px solid #e2e8f0'
                              }}
                            >
                              {formattedJson}
                            </Box>
                          </Box>
                        );
                      }
                      
                      // For non-JSON params (e.g. startDate=...)
                      if (row.message.includes('params=')) {
                        const parts = row.message.split('params=');
                        const prefix = parts[0].replace(/,\s*$/, '').trim();
                        return (
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem' }}>{prefix}</Typography>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, mt: 0.5 }}>Params:</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#334155' }}>{parts[1].trim()}</Typography>
                          </Box>
                        );
                      }
                    } catch (e) {
                      // Fallback if parsing fails
                    }
                    return row.message;
                  })()}
                </td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.diff?.key || ''}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.diff?.old || ''}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem' }}>{row.diff?.new || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </ReportLayout>
  );
};

export default AuditReport;

