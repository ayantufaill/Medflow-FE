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
    if (open) {
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  // Step-by-step for "close on click anywhere else (header/layout/rest of page)":
  // 1. MUI's <Menu> is built on <Popover>, which renders an invisible full-screen
  //    backdrop in a portal at theme.zIndex.modal (1300) whenever `open` is true.
  // 2. That backdrop sits above the rest of the page, so any click outside the menu's
  //    Paper (including clicks on the header/navbar/sidebar) hits the backdrop first.
  // 3. The backdrop's click handler invokes the `onClose` prop we pass below
  //    (`onClose={handleClose}`), which just nulls out anchorEl -> `open` becomes false.
  // 4. This is automatic MUI behavior and needs no extra document-level listener,
  //    PROVIDED no ancestor (header/layout wrapper) sets a zIndex >= 1300 that would let
  //    it sit above the backdrop and swallow the click before it reaches it.
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
        // `Header.jsx` renders the whole header Box with `zIndex: 1302` (fixed position,
        // so it stays above scrolling content). MUI's Menu/Popover uses an invisible
        // backdrop at the default `theme.zIndex.modal` (1300) to detect outside clicks
        // and call `onClose`. Since 1300 < 1302, the header band painted ON TOP of that
        // backdrop, swallowing clicks anywhere on the header (including re-clicks on this
        // profile trigger) before they could reach it — so outside-click-to-close never
        // fired while the pointer was over the header. Bumping this Menu's own stacking
        // context above the header (1500, matching the same pattern already used by
        // PatientDropdown.jsx for header-level overlays) puts the backdrop back on top of
        // the header, restoring click-away-to-close everywhere. Kept local to this
        // component instead of lowering Header.jsx's z-index, since other header overlays
        // may depend on the header staying above general page content.
        sx={{ zIndex: 1500 }}
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
