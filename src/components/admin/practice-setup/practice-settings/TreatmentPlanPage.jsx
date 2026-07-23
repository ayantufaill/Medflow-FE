import React from 'react';
import { Box } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox } from './SharedSettings';

const TreatmentPlanPage = () => {
  return (
    <PracticeSettingCard 
      title="Treatment Plan Page" 
      subtitle="Fields and amounts shown on the treatment plan"
      icon={<ReceiptLongIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <SettingCheckbox label="Collapse Recare Plan Procedures By Default" defaultChecked info />
        <SettingCheckbox label="Show Discount Amount" defaultChecked info />
        <SettingCheckbox label="Show Insurance Portion" defaultChecked info />
        <SettingCheckbox label="Show Insurance Write Off Portion" info />
        <SettingCheckbox label="Show Max Allowed" info />
        <SettingCheckbox label="Show Office Fee" defaultChecked info />
      </Box>
    </PracticeSettingCard>
  );
};

export default TreatmentPlanPage;
