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
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.referral}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.utmSource}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.utmMedium}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.utmCampaign}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.clicks}</TableCell>
    </TableRow>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Online Scheduling Referral">
        <ReportFilterBar 
          onCreateTemplate={() => setTemplateDialogOpen(true)}
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
