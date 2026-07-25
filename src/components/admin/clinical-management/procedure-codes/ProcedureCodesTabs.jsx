import { Box, Tabs, Tab, Button } from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';

const ProcedureCodesTabs = ({ activeTab, handleTabChange, handleOpenSyncDialog }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', mb: 4 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            minWidth: 'auto',
            px: 3,
            color: '#64748b',
          },
          '& .Mui-selected': {
            color: '#0f172a !important',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#2563eb',
            height: '3px',
            borderTopLeftRadius: '3px',
            borderTopRightRadius: '3px',
          },
        }}
      >
        <Tab label="Power Codes" />
        <Tab label="Codes" />
        <Tab label="Eligibility Used ADA Codes" />
      </Tabs>
      <Button
        variant="contained"
        onClick={handleOpenSyncDialog}
        startIcon={<SyncIcon />}
        sx={{
          mb: 1.5,
          bgcolor: '#3B82F6',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.85rem',
          borderRadius: 1.5,
          px: 3,
          py: 1,
          boxShadow: 'none',
          transition: 'all 0.15s',
          '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' }
        }}
      >
        Sync
      </Button>
    </Box>
  );
};

export default ProcedureCodesTabs;
