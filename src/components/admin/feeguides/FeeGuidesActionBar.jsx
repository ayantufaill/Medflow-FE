import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Autorenew as ReestimateIcon,
  LockOpen as UnlockIcon,
  Restore as ResetIcon,
} from '@mui/icons-material';

const FeeGuidesActionBar = ({
  onReestimate,
  onClearLockedFees,
  onResetTreatmentPlans,
  onCopyFeeGuide,
  onEmptyFeeGuide,
}) => {
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);

  const secondaryBtnStyle = {
    textTransform: 'none',
    color: '#475569',
    borderColor: '#cbd5e1',
    fontWeight: 600,
    fontSize: '0.85rem',
    borderRadius: 2,
    '&:hover': {
      backgroundColor: '#f8fafc',
      borderColor: '#94a3b8',
    },
    whiteSpace: 'nowrap',
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button 
          variant="outlined" 
          startIcon={<ReestimateIcon />} 
          sx={secondaryBtnStyle} 
          onClick={onReestimate}
        >
          Re-estimate Tplans
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<UnlockIcon />} 
          sx={secondaryBtnStyle} 
          onClick={onClearLockedFees}
        >
          Clear Locked Fees
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<ResetIcon />} 
          sx={secondaryBtnStyle} 
          onClick={onResetTreatmentPlans}
        >
          Reset Treatment Plans to Default Fee Guide
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search Fee Guides..."
          sx={{ 
            width: 260,
            '& .MuiInputBase-root': { backgroundColor: '#fff', borderRadius: 2 },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={(e) => setAddMenuAnchor(e.currentTarget)}
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Add Fee Guide
        </Button>
        
        <Menu
          anchorEl={addMenuAnchor}
          open={Boolean(addMenuAnchor)}
          onClose={() => setAddMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { mt: 1, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 200 }
          }}
        >
          <MenuItem 
            onClick={() => { setAddMenuAnchor(null); onCopyFeeGuide(); }} 
            sx={{ fontSize: '0.9rem', color: '#334155', py: 1.5 }}
          >
            Copy from existing
          </MenuItem>
          <MenuItem 
            onClick={() => { setAddMenuAnchor(null); onEmptyFeeGuide(); }} 
            sx={{ fontSize: '0.9rem', color: '#334155', py: 1.5 }}
          >
            Empty Fee Guide
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default FeeGuidesActionBar;
