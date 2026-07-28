import { useState } from 'react';
import { Box, Typography, Menu, MenuItem, Divider, ListItemIcon, Avatar } from '@mui/material';
import { Person, Lock, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import InitialsAvatar from '../../shared/InitialsAvatar';
import { getRoleNames } from '../../../utils/auth-routing';

const UserProfile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.firstName || user?.lastName
    ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
    : user?.email || 'User';
  const roleLabel = getRoleNames(user).join(', ') || '—';

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
        {user?.avatarUrl ? (
          <Avatar src={user.avatarUrl} sx={{ width: 36, height: 36 }} />
        ) : (
          <InitialsAvatar name={displayName} size={36} fontSize={12} />
        )}
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
            {displayName}
          </Typography>
          <Typography sx={{ fontSize: '11px', color: '#7a8a9a', lineHeight: 1.3 }}>
            {roleLabel}
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
        <MenuItem onClick={() => navigate('/profile')}>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/change-password')}>
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

export default UserProfile;
