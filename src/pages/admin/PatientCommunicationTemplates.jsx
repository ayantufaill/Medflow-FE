import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';

import { AutomatedTemplates } from '../../components/admin/patient-communication/templates/AutomatedTemplates';
import { ReferralTemplates } from '../../components/admin/patient-communication/templates/ReferralTemplates';
import { GeneralEmailTextTemplates } from '../../components/admin/patient-communication/templates/GeneralEmailTextTemplates';
import { CustomLetterTemplates } from '../../components/admin/patient-communication/templates/CustomLetterTemplates';
import { LabTemplates } from '../../components/admin/patient-communication/templates/LabTemplates';

const TEMPLATE_SUB_TABS = [
  { label: 'Automated Templates', id: 'automated' },
  { label: 'Referral Templates', id: 'referral' },
  { label: 'Email/Text Templates', id: 'email-text' },
  { label: 'Custom Letter', id: 'custom-letter' },
  { label: 'Lab Templates', id: 'lab' },
];

const PatientCommunicationTemplates = () => {
  const theme = useTheme();
  const [activeSubTab, setActiveSubTab] = useState(0);

  return (
    <Box sx={{ px: 0, py: 0 }}>
      {/* Tab Area */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0, backgroundColor: '#fff' }}>
        <Tabs
          value={activeSubTab}
          onChange={(e, newValue) => setActiveSubTab(newValue)}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              minWidth: 100,
              minHeight: 40,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              height: 2,
            }
          }}
        >
          {TEMPLATE_SUB_TABS.map((tab) => (
            <Tab key={tab.id} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ backgroundColor: '#fff', height: 'calc(100vh - 20px)', display: 'flex', flexDirection: 'column' }}>
        {activeSubTab === 0 ? (
          <AutomatedTemplates />
        ) : activeSubTab === 1 ? (
          <ReferralTemplates />
        ) : activeSubTab === 2 ? (
          <GeneralEmailTextTemplates />
        ) : activeSubTab === 3 ? (
          <CustomLetterTemplates />
        ) : activeSubTab === 4 ? (
          <LabTemplates />
        ) : (
          <Box sx={{ p: 4, textAlign: 'center', flexGrow: 1 }}>
            <Typography variant="h6" color="text.secondary">
              {TEMPLATE_SUB_TABS[activeSubTab].label} section is under development.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PatientCommunicationTemplates;
