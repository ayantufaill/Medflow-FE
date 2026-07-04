import React from 'react';
import { 
  Box, Typography, TextField, Select, MenuItem, Button, IconButton, Divider
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportSearchInput } from '../../../../components/reports/ui';

const AuditReport = () => {
  const rows = [
    { id: 1, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'User Login Report', date: '05/08/2026 02:26 PM', message: 'Success, duration=171ms, params=startDate=2026-5-8 & endDate=2026-5-8', diff: { key: '', old: '', new: '' } },
    { id: 2, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Recare List Report', date: '05/08/2026 02:25 PM', message: 'Success, duration=40ms, params={"currentPage":1,"pageSize":15,"includeAppointed":false,"patientList":[],"includeFlags":null,"flagIds":null}', diff: { key: '', old: '', new: '' } },
    { id: 3, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Recare List Report', date: '05/08/2026 02:25 PM', message: 'Success, duration=38ms, params={"currentPage":1,"pageSize":15,"includeAppointed":false,"patientList":[],"includeFlags":null,"flagIds":null}', diff: { key: '', old: '', new: '' } },
    { id: 4, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Rx Report', date: '05/08/2026 02:25 PM', message: 'Success, duration=20ms, params=startDate=2026-5-7 & endDate=2026-5-8', diff: { key: '', old: '', new: '' } },
    { id: 5, patient: '', user: 'Y... S...', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Payment Lines Report', date: '05/08/2026 02:23 PM', message: 'Success, duration=24ms', diff: { key: '', old: '', new: '' } },
    { id: 6, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Unsigned Progress Notes Report', date: '05/08/2026 02:23 PM', message: 'Success, duration=656ms, params=date=2026-4-8 & endDate=2026-5-8', diff: { key: '', old: '', new: '' } },
    { id: 7, patient: '', user: 'Babar Magsi', category: 'Report', subcategory: 'Report', action: 'Action Performed', object: 'Advanced Report', date: '05/08/2026 02:23 PM', message: 'Success, duration=281ms', diff: { key: '', old: '', new: '' } },
  ];

  const topFilters = (
    <>
      <ReportSelect 
        label="Daily" 
        prefix="Date Range:" 
        defaultValue="Daily"
        options={[{ value: 'Daily', label: 'Daily' }]}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2, mr: 2 }}>
        <IconButton size="small" sx={{ color: '#337ab7', p: 0 }}><ChevronLeft fontSize="small" /></IconButton>
        <Typography variant="body2" sx={{ color: '#337ab7', fontWeight: 600 }}>May 07, 2026</Typography>
        <Typography variant="body2" sx={{ mx: 0.5, color: '#337ab7' }}>➔</Typography>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>Date:</Typography>
        <Typography variant="body2" sx={{ color: '#337ab7', fontWeight: 600 }}>05/07/2026</Typography>
        <IconButton size="small" sx={{ color: '#337ab7', p: 0 }}><ChevronRight fontSize="small" /></IconButton>
      </Box>

      <ReportSearchInput 
        placeholder="Search User" 
        value="" 
        onChange={() => {}}
        sx={{ mr: 2 }}
      />
      
      <ReportSearchInput 
        placeholder="Search Patient" 
        value="" 
        onChange={() => {}}
        sx={{ mr: 2 }}
      />

      <ReportSelect 
        label="None" 
        prefix="Action:" 
        defaultValue="None"
        options={[{ value: 'None', label: 'None' }]}
        sx={{ mr: 2 }}
      />

      <ReportSelect 
        label="None" 
        prefix="Category:" 
        defaultValue="None"
        options={[{ value: 'None', label: 'None' }]}
      />
    </>
  );

  return (
    <ReportLayout title="Audit Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={() => console.log('Apply Filters')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />

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
            {rows.map((row, index) => (
              <tr key={row.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.patient}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.user}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.category}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.subcategory}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.action}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.object}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.date}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0', maxWidth: 300, wordBreak: 'break-word', color: '#666' }}>{row.message}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.diff.key}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem', borderRight: '1px solid #e0e0e0' }}>{row.diff.old}</td>
                <td style={{ padding: '8px', fontSize: '0.75rem' }}>{row.diff.new}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan="11" style={{ padding: '16px', textAlign: 'center', color: '#666' }}>No audit logs found for this date range</td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </ReportLayout>
  );
};

export default AuditReport;

