import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { fetchReferralDocumentReport, selectReferralDocumentData, selectReferralDocumentDataLoading } from '../../../../store/slices/patientReportSlice';



const ReferralDocumentReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectReferralDocumentData) || [];
  const loading = useSelector(selectReferralDocumentDataLoading);

  const [status, setStatus] = useState('none');
  const [provider, setProvider] = useState('all');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const fetchReport = () => {
    dispatch(fetchReferralDocumentReport({ status, provider }));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleApply = () => {
    fetchReport();
  };

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
        <Box className="hide-on-print" sx={{ mb: 2 }}>
          <ReportFilterBar 
            topRowFilters={topFilters}
            onApplyFilters={handleApply}
            onCreateTemplate={() => setTemplateDialogOpen(true)}
          />
        </Box>

        {/* Summary Text and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
            (number of documents = {reportData.length})
          </Typography>
          <Box sx={{ transform: 'translateY(-4px)' }}>
            <ProductionReportActions
              onExportCsv={() => alert('Exporting CSV...')}
              onPrint={() => window.print()}
              hasData={reportData.length > 0}
            />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ReportDataTable 
            columns={columns} 
            data={reportData} 
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
export default ReferralDocumentReport;
