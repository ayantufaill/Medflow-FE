import React, { useState } from 'react';
import { Box, Typography, Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { headingPrimarySx, radius } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

const InsuranceHeader = ({ onAddCoverage }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleOpenMenu = (event) => setMenuAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setMenuAnchorEl(null);

  const handleSelect = (type) => {
    onAddCoverage(type);
    handleCloseMenu();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      backgroundColor: COLORS.SURFACE_CARD, 
      borderRadius: radius.lg, 
      border: `1px solid ${COLORS.BORDER}`, 
      p: '8px', 
      px: 2,
      mb: '8px' 
    }}>
      <Typography sx={headingPrimarySx}>
        Insurance
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="contained"
          onClick={handleOpenMenu}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            bgcolor: COLORS.ACCENT,
            color: '#fff',
            textTransform: 'none',
            borderRadius: radius.md,
            px: 3,
            fontWeight: 700,
            boxShadow: 'none',
            '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
          }}
        >
          Add Coverage
        </Button>
        <Menu 
          anchorEl={menuAnchorEl} 
          open={Boolean(menuAnchorEl)} 
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              mt: 0.5,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid #e1e4e8',
              borderRadius: 1.5,
            }
          }}
        >
          <MenuItem 
            onClick={() => handleSelect('Insurance Coverage')}
            sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
          >
            Insurance Coverage
          </MenuItem>
          <MenuItem 
            onClick={() => handleSelect('Membership Plan')}
            sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
          >
            Membership Plan
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default InsuranceHeader;
