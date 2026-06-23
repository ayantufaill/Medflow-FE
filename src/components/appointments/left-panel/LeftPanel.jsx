import { useState } from 'react';
import { Box } from '@mui/material';
import LeftPanelTabs from './LeftPanelTabs';

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState('Patient');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* Sticky tab header */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#ffffff', flexShrink: 0 }}>
        <LeftPanelTabs activeTab={activeTab} onChange={setActiveTab} />
      </Box>

      {/* Scrollable content area */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: '12px' }}>
        {/* Content per tab goes here in the next phase */}
      </Box>

    </Box>
  );
};

export default LeftPanel;
