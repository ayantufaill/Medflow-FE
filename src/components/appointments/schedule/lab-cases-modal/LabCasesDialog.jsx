import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Link,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScienceIcon from '@mui/icons-material/Science';

import LabCasesFilters from './LabCasesFilters';
import LabCasesActions from './LabCasesActions';
import LabCasesTable from './LabCasesTable';

const LabCasesDialog = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: 1,
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ height: '73px', boxSizing: 'border-box', p: '0 25px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `1px solid #e2e8f0` }}>
        <Box sx={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
          <ScienceIcon sx={{ fontSize: '20px' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
            Lab Cases
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#64748b' }}>
            View and manage patient lab cases
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '25px', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
        <Link 
          href="#" 
          underline="always" 
          sx={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', mt: 1, mb: 2, display: 'inline-block' }}
        >
          Lab Case Documents:
        </Link>

        {/* Filters */}
        <LabCasesFilters />

        {/* Actions */}
        <LabCasesActions />

        {/* Table */}
        <LabCasesTable />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={onClose}
            sx={{ 
              color: '#64748b', 
              borderColor: '#cbd5e1', 
              borderRadius: '8px',
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
              textTransform: 'none',
              px: 2,
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LabCasesDialog;
