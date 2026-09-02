import { Box, Tabs, Tab, Button } from '@mui/material';
import syncSvg from '../../../../assets/claimicons/refreshicon.svg';

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
        startIcon={<img src={syncSvg} alt="Sync" style={{ width: 16, height: 16 }} />}
        size="small"
        variant="outlined"
        onClick={handleOpenSyncDialog}
        sx={{
          mb: 1.5,
          textTransform: 'none',
          color: '#1e293b',
          borderColor: '#e2e8f0',
          fontWeight: 600,
          borderRadius: 2,
          height: 36,
          px: 2,
          '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }
        }}
      >
        Sync
      </Button>
    </Box>
  );
};

export default ProcedureCodesTabs;
