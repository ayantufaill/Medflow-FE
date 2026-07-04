import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const DUMMY_DATA = [
  { number: '1249', patient: 'John Doe', flags: 'VIP, Pre-med', lastAppointment: '05/01/2026' },
  { number: '1210', patient: 'Jane Smith', flags: 'Billing Alert', lastAppointment: '04/22/2026' },
  { number: '540', patient: 'Robert Brown', flags: 'X-Ray needed', lastAppointment: '05/05/2026' },
];

const PatientFlagsReport = () => {
  const [filterBy, setFilterBy] = useState('active');
  const [showData, setShowData] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const columns = [
    { label: 'Patient Number' },
    { label: 'Patient' },
    { label: 'Flags' },
    { label: 'Last Appointment' },
  ];

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.number}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1, color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.flags}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.lastAppointment}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <ReportSelect 
        label="Active Patients Only" 
        prefix="Filter Report By" 
        value={filterBy} 
        onChange={(e) => setFilterBy(e.target.value)} 
        options={[
          { value: 'active', label: 'Active Patients Only' },
          { value: 'all', label: 'All Patients' },
          { value: 'inactive', label: 'Inactive Patients Only' }
        ]} 
        width="180px"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Including Flags:</Typography>
        <Button
          variant="contained"
          size="small"
          endIcon={<EditIcon sx={{ fontSize: 14 }} />}
          sx={{ backgroundColor: '#2362EF', textTransform: 'none', fontSize: '0.75rem', height: 26, minWidth: 80, '&:hover': { bgcolor: '#1a4bbd' }, boxShadow: 'none' }}
        >
          Flags
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Excluding Flags:</Typography>
        <Button
          variant="contained"
          size="small"
          endIcon={<EditIcon sx={{ fontSize: 14 }} />}
          sx={{ backgroundColor: '#2362EF', textTransform: 'none', fontSize: '0.75rem', height: 26, minWidth: 80, '&:hover': { bgcolor: '#1a4bbd' }, boxShadow: 'none' }}
        >
          Flags
        </Button>
      </Box>
    </>
  );

  const bottomRowLeftActions = (
    <Typography variant="caption" sx={{ fontWeight: 700, textDecoration: 'underline', color: '#1e293b', mr: 2 }}>
      Number of Patients: {showData ? DUMMY_DATA.length : 0}
    </Typography>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Patient Flags Report:">
        <ReportFilterBar 
          topRowFilters={topFilters}
          bottomRowLeftActions={bottomRowLeftActions}
          onApplyFilters={() => setShowData(true)}
          onCreateTemplate={() => setTemplateDialogOpen(true)}
          onExportCsv={() => alert('Exporting CSV...')}
          onPrint={() => window.print()}
        />

        {!showData ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              Please select which flags you would like to include/exclude, then click on "apply filters"
            </Typography>
          </Box>
        ) : (
          <ReportDataTable 
            columns={columns} 
            data={DUMMY_DATA} 
            renderRow={renderRow} 
          />
        )}
      </ReportLayout>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={(name) => alert(`Template "${name}" saved!`)} 
      />
    </React.Fragment>
  );
};
export default PatientFlagsReport;
