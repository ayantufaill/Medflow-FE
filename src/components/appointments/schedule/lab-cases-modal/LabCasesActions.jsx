import React from 'react';
import { Box, Button, Link } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

const LabCasesActions = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', mb: 2, mt: 1, gap: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#2362EF', borderRadius: '8px', px: 2, boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#1a50cc', boxShadow: 'none' } }}>
            Export as CSV
          </Button>
          <Button variant="outlined" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', borderColor: '#2362EF', color: '#2362EF', borderRadius: '8px', px: 2, fontWeight: 600, '&:hover': { borderColor: '#1a50cc', backgroundColor: 'rgba(35, 98, 239, 0.04)' } }}>
            Print
          </Button>
        </Box>
        <Link href="#" underline="hover" sx={{ color: '#2362EF', fontSize: '0.75rem', fontWeight: 500 }}>
          Expand Notes
        </Link>
      </Box>
    </Box>
  );
};

export default LabCasesActions;
