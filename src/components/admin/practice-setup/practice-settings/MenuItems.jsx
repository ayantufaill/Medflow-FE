import React from 'react';
import { Box } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox } from './SharedSettings';

const MenuItems = () => {
  return (
    <PracticeSettingCard 
      title="Menu Items" 
      subtitle="Navigation items shown across Clinical, Patient, and Finance menus"
      icon={<MenuOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1 }}>
        <SettingCheckbox label="Show Adjunctive Therapy menu item under Clinical menu" defaultChecked />
        <SettingCheckbox label="Show Dental History menu item under Patient menu" defaultChecked />
        <SettingCheckbox label="Show Diagnostic Opinion menu item under Clinical menu" defaultChecked />
        <SettingCheckbox label="Show ETrans menu item under Finance menu" />
        <SettingCheckbox label="Show Home Care menu item under Patient Reports menu" defaultChecked />
        <SettingCheckbox label="Show Medical History menu item under Patient menu" defaultChecked />
        <SettingCheckbox label="Show Pedo Dental History menu item under Patient menu" defaultChecked />
        <SettingCheckbox label="Show Pedo Medical History menu item under Patient menu" defaultChecked />
        <SettingCheckbox label="Show Responses for Deleted Questionnaires" />
        <SettingCheckbox label="Show Risk Assessment menu item under Patient Reports menu" defaultChecked />
        <SettingCheckbox label="Show Scans menu item under Ancillary Tests menu" defaultChecked />
        <SettingCheckbox label="Show Showcase menu item under Patient Reports menu" defaultChecked />
      </Box>
    </PracticeSettingCard>
  );
};

export default MenuItems;
