import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow
} from '@mui/material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const DUMMY_DATA = [
  { patient: 'Bonnie Fuller', provider: 'Dr. Smith', created: '05/07/2026', due: '', shared: '05/07/2026', status: 'Sent Out' },
  { patient: 'Sarah Miller', provider: 'Dr. Johnson', created: '05/04/2026', due: '', shared: '05/04/2026', status: 'Sent Out' },
  { patient: 'Charlie Wright', provider: 'Dr. Brown', created: '04/30/2026', due: '', shared: '05/01/2026', status: 'Sent Out' },
  { patient: 'David Lee', provider: 'Dr. Davis', created: '04/29/2026', due: '', shared: '04/29/2026', status: 'Sent Out' },
  { patient: 'Jane Smith', provider: 'Dr. White', created: '04/22/2026', due: '', shared: '04/22/2026', status: 'Sent Out' },
  { patient: 'Sabrina Sosa', provider: 'Dr. Green', created: '03/19/2026', due: '', shared: '', status: 'New' },
];

const ReferralDocumentReport = () => {
  const [status, setStatus] = useState('none');
  const [provider, setProvider] = useState('all');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const columns = [
    { label: 'Referral Patient' },
    { label: 'Referral Provider' },
    { label: 'Created Date' },
    { label: 'Due Date' },
    { label: 'Shared Date' },
    { label: 'Status' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.created}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.due}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.shared}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Typography variant="caption" sx={{ fontWeight: 600, mr: 1, color: '#1e293b' }}>Filter By:</Typography>
      <ReportSelect 
        label="None" 
        prefix="Status:" 
        value={status} 
        onChange={(e) => setStatus(e.target.value)} 
        options={[
          { value: 'none', label: 'None' },
          { value: 'new', label: 'New' },
          { value: 'sent', label: 'Sent Out' }
        ]}
      />
      <ReportSelect 
        label="All" 
        prefix="Provider:" 
        value={provider} 
        onChange={(e) => setProvider(e.target.value)} 
        options={[
          { value: 'all', label: 'All' },
          { value: 'smith', label: 'Dr. Smith' }
        ]}
      />
    </>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Referral Document:">
        <ReportFilterBar 
          topRowFilters={topFilters}
          onApplyFilters={() => console.log('Apply Filters')}
          onCreateTemplate={() => setTemplateDialogOpen(true)}
          onExportCsv={() => alert('Exporting CSV...')}
          onPrint={() => window.print()}
        />

        <ReportDataTable 
          columns={columns} 
          data={DUMMY_DATA} 
          renderRow={renderRow} 
        />
      </ReportLayout>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={(name) => alert(`Template "${name}" saved!`)} 
      />
    </React.Fragment>
  );
};
export default ReferralDocumentReport;
