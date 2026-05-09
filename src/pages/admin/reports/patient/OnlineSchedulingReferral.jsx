import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';

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

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#337ab7', 
          fontWeight: 500, 
          mb: 2, 
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
      >
        Online Scheduling Referral:
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1.5 }}>
        <Button variant="contained" size="small" onClick={() => setTemplateDialogOpen(true)} sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Create Template</Button>
        <Button variant="contained" size="small" onClick={() => window.print()} sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', height: 24, boxShadow: 'none' }}>Print</Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderBottom: '1px solid #ddd', borderRadius: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                'Referral', 
                'UTM Source', 
                'UTM Medium', 
                'UTM Campaign', 
                'Number of Clicks'
              ].map((header) => (
                <TableCell 
                  key={header} 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '0.75rem', 
                    py: 1,
                    px: 1,
                    borderBottom: '1px solid #ddd',
                    backgroundColor: '#fff'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {INITIAL_DATA.map((row, index) => (
              <TableRow 
                key={index} 
                sx={{ 
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc',
                  '& td': { borderBottom: '1px solid #eee' }
                }}
              >
                <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.referral}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.utmSource}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.utmMedium}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.utmCampaign}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1, px: 1 }}>{row.clicks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={handleSaveTemplate} 
      />
    </Box>
  );
};

export default OnlineSchedulingReferral;
