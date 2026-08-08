import React, { useState } from 'react';
import { TableCell, TableRow, Button } from '@mui/material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportDataTable } from '../../../../components/reports/ui';

const INITIAL_DATA = [
  {
    referral: 'Google Search',
    utmSource: 'google',
    utmMedium: 'organic',
    utmCampaign: 'seo_2024',
    clicks: 145,
  },
  {
    referral: 'Facebook Ad',
    utmSource: 'facebook',
    utmMedium: 'cpc',
    utmCampaign: 'summer_promo',
    clicks: 89,
  },
  {
    referral: 'Newsletter',
    utmSource: 'email',
    utmMedium: 'newsletter',
    utmCampaign: 'monthly_update',
    clicks: 56,
  },
];

const OnlineSchedulingReferral = () => {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

  const columns = [
    { label: 'Referral' },
    { label: 'UTM Source' },
    { label: 'UTM Medium' },
    { label: 'UTM Campaign' },
    { label: 'Number of Clicks' },
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
      <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{row.referral}</TableCell>
      <TableCell>{row.utmSource}</TableCell>
      <TableCell>{row.utmMedium}</TableCell>
      <TableCell>{row.utmCampaign}</TableCell>
      <TableCell>{row.clicks}</TableCell>
    </TableRow>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Online Scheduling Referral">
        <ReportFilterBar 
          onCreateTemplate={() => setTemplateDialogOpen(true)}
          onExportCsv={() => alert('Exporting CSV...')}
          onPrint={() => window.print()}
        />

        <ReportDataTable 
          columns={columns} 
          data={INITIAL_DATA} 
          renderRow={renderRow} 
        />
      </ReportLayout>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={handleSaveTemplate} 
      />
    </React.Fragment>
  );
};

export default OnlineSchedulingReferral;
