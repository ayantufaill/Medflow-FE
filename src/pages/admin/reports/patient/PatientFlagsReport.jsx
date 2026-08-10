import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable, ReportDivider } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';

const DUMMY_DATA = [
  { number: '1249', patient: 'John Doe', flags: 'VIP, Pre-med', lastAppointment: '05/01/2026' },
  { number: '1210', patient: 'Jane Smith', flags: 'Billing Alert', lastAppointment: '04/22/2026' },
  { number: '540', patient: 'Robert Brown', flags: 'X-Ray needed', lastAppointment: '05/05/2026' },
];

const ActionIcons = () => (
  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
    <PrintOutlined sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
    <AttachMoneyOutlined sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
    <MedicationOutlined sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
    <ChatBubbleOutline sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
  </Box>
);

const PatientFlagsReport = () => {
  const dispatch = useDispatch();
  const { patientFlagsReportData, loading } = useSelector((state) => state.patientReport || { patientFlagsReportData: [], loading: false });

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
    <TableRow 
      key={index} 
      hover
      sx={{ 
        '& td': { fontSize: '0.75rem', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' },
        '&:hover': { backgroundColor: '#f1f5f9' }
      }}
    >
      <TableCell>{row.number}</TableCell>
      <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{row.patient}</TableCell>
      <TableCell>{row.flags}</TableCell>
      <TableCell>{row.lastAppointment}</TableCell>
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

      <ReportDivider />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', textTransform: 'uppercase' }}>Including Flags:</Typography>
        <Button
          variant="contained"
          size="small"
          endIcon={<EditIcon sx={{ fontSize: 14 }} />}
          sx={{ backgroundColor: '#3b82f6', textTransform: 'none', fontSize: '0.75rem', height: 28, borderRadius: '6px', minWidth: 80, '&:hover': { bgcolor: '#2563eb' }, boxShadow: 'none' }}
        >
          Flags
        </Button>
      </Box>

      <ReportDivider />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', textTransform: 'uppercase' }}>Excluding Flags:</Typography>
        <Button
          variant="contained"
          size="small"
          endIcon={<EditIcon sx={{ fontSize: 14 }} />}
          sx={{ backgroundColor: '#3b82f6', textTransform: 'none', fontSize: '0.75rem', height: 28, borderRadius: '6px', minWidth: 80, '&:hover': { bgcolor: '#2563eb' }, boxShadow: 'none' }}
        >
          Flags
        </Button>
      </Box>
    </>
  );

  const handleSaveFlags = (flags) => {
    if (dialogMode === 'include') {
      setIncludeFlags(flags);
    } else if (dialogMode === 'exclude') {
      setExcludeFlags(flags);
    }
  };

  const renderFlagSquares = (flagIds) => {
    if (!flagIds) return null;
    const idsArray = Array.isArray(flagIds) ? flagIds : [flagIds];
    let splitIds = [];
    idsArray.forEach(f => {
      if (typeof f === 'string') {
        splitIds.push(...f.split(/[,;]/).map(s => s.trim()).filter(Boolean));
      } else {
        splitIds.push(f);
      }
    });

    if (splitIds.length === 0) return null;
    
    return (
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {splitIds.map((flagObj, i) => {
          const flagId = typeof flagObj === 'object' ? (flagObj.id || flagObj.name || flagObj.label) : flagObj;
          const flagDef = ALL_FLAGS.find(f => f.id === flagId || (typeof flagId === 'string' && f.label.toLowerCase() === flagId.toLowerCase()));
          
          if (!flagDef) {
            return (
              <Tooltip key={`unknown-${i}`} title={typeof flagId === 'string' ? flagId : 'Flag'} arrow>
                <Box 
                  sx={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: '#ccc', 
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }} 
                />
              </Tooltip>
            );
          }
          
          return (
            <Tooltip key={`${flagId}-${i}`} title={flagDef.label} arrow>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: flagDef.color, 
                  borderRadius: '2px',
                  cursor: 'pointer'
                }} 
              />
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  return (
    <React.Fragment>
      <ReportLayout title="Patient Flags Report:">
        <Box className="hide-on-print" sx={{ mb: 2 }}>
          <ReportFilterBar 
            topRowFilters={topFilters}
            onApplyFilters={() => setShowData(true)}
            onClearAll={() => { setFilterBy('active'); setShowData(false); }}
            onCreateTemplate={() => setTemplateDialogOpen(true)}
          />
        </Box>

        {/* Summary Text and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
            (number of patients = {showData ? DUMMY_DATA.length : 0})
          </Typography>
          <Box sx={{ transform: 'translateY(-4px)' }}>
            <ProductionReportActions
              onExportCsv={() => alert('Exporting CSV...')}
              onPrint={() => window.print()}
              hasData={showData && DUMMY_DATA.length > 0}
            />
          </Box>
        </Box>

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
