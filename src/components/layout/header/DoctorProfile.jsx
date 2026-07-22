import { useState } from 'react';
import { Box, Typography, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { Person, Lock, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import InitialsAvatar from '../../shared/InitialsAvatar';

const DoctorProfile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    if (logout) {
      await logout();
    }
  };

  return (
    <>
      <Box 
        onClick={handleClick}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <InitialsAvatar name="Dr. Sarah Wells" size={36} fontSize={12} />
        <Box>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0px',
              color: '#09121f',
            }}
          >
            Dr. Sarah Wells
          </Typography>
          <Typography sx={{ fontSize: '11px', color: '#7a8a9a', lineHeight: 1.3 }}>
            Riverside Dental
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            border: '1px solid #e2e8f0',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            mt: 1,
            minWidth: 160,
            borderRadius: '6px',
            '& .MuiMenuItem-root': {
              fontFamily: 'Inter',
              fontSize: '13px',
              fontWeight: 500,
              color: '#09121f',
              py: 1,
              px: 2,
            },
            '& .MuiMenuItem-root:hover': {
              backgroundColor: '#f8fafc',
            }
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/account/profile')}>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/account/change-password')}>
          Change Password
        </MenuItem>
        <Divider sx={{ my: '4px !important' }} />
        <MenuItem onClick={handleLogout} sx={{ color: '#ef4444 !important' }}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default DoctorProfile;
