import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Menu, MenuItem, Divider, ListItemIcon, Avatar } from '@mui/material';
import { Person, Lock, Logout, Check } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import InitialsAvatar from '../../shared/InitialsAvatar';
import { getRoleNames } from '../../../utils/auth-routing';
import { navMenuItems, hasRequiredRole, hasRequiredPermission, BRANCH_SWITCH_ROLES } from '../../../config/navMenuItems';
import { useBranch } from '../../../hooks/redux';
import {
  fetchClinicAnalytics,
  selectClinicAnalyticsData,
  selectClinicAnalyticsLoading,
} from '../../../store/slices/clinicAnalyticsSlice';

const UserProfile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const analyticsData = useSelector(selectClinicAnalyticsData);
  const analyticsLoading = useSelector(selectClinicAnalyticsLoading);
  const { branches, currentBranchId, currentBranch, setBranch, fetchBranches: loadBranches } = useBranch();

  const displayName = user?.firstName || user?.lastName
    ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
    : user?.email || 'User';
  const roleLabel = getRoleNames(user).join(', ') || '—';

  // "Manage" card: only the sections this user's role can actually reach — reuses the
  // same role list/filter Sidebar.jsx uses, via the shared src/config/navMenuItems.js,
  // so this list can't silently drift out of sync with the real sidebar nav.
  const manageItems = navMenuItems.filter((item) => hasRequiredRole(user, item.requiredRoles));
  // "Analytics" card links to /admin/analytics, which now also admits Group Admins via
  // their real `group:view_analytics` permission (see adminRoutes.jsx's adminOrPermission
  // helper) — mirror that same Admin-OR-permission check here so this card doesn't show
  // a link a Group Admin would then get an access-denied page from.
  const canViewAnalytics = hasRequiredRole(user, ['Admin']) || hasRequiredPermission(user, ['group:view_analytics']);
  // No backend concept of per-employee branch assignment exists, so branch switching is
  // role-based like every other access check here — any staff role, not Patient portal.
  const canSwitchBranch = hasRequiredRole(user, BRANCH_SWITCH_ROLES);

  // Load the branch list once, lazily — same trigger point as the analytics preview
  // fetch below, so an idle header does no unnecessary work.
  useEffect(() => {
    if (canSwitchBranch && branches.length === 0) {
      loadBranches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSwitchBranch]);

  const handleClick = (event) => {
    if (open) {
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
      // Lightweight fetch for the popover's quick preview stat — full branch
      // selection/breakdown lives on the dedicated /admin/analytics page. Reflects
      // whichever branch is currently active, so the preview stays consistent with
      // the trigger's "· <Branch Name>" subtitle.
      if (canViewAnalytics) {
        dispatch(fetchClinicAnalytics({ branchId: currentBranchId || 'all' }));
      }
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
            {roleLabel}{canSwitchBranch && currentBranch ? ` · ${currentBranch.name}` : ''}
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
            minWidth: 260,
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
        {canSwitchBranch && branches.length > 0 && [
          <Box key="branch-label" sx={{ px: 2, pt: 1, pb: 0.5 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#7a8a9a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Branch
            </Typography>
          </Box>,
          ...branches.map((branch) => (
            <MenuItem key={branch.id} onClick={() => setBranch(branch.id)}>
              <ListItemIcon sx={{ minWidth: 32, color: '#09121f' }}>
                {branch.id === currentBranchId ? <Check sx={{ fontSize: '18px' }} /> : null}
              </ListItemIcon>
              {branch.name}
            </MenuItem>
          )),
          <Divider key="branch-divider" sx={{ my: '4px !important' }} />,
        ]}

        {manageItems.length > 0 && [
          <Box key="manage-label" sx={{ px: 2, pt: 1, pb: 0.5 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#7a8a9a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Manage
            </Typography>
          </Box>,
          ...manageItems.map((item) => (
            <MenuItem key={item.path} onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ minWidth: 32, color: '#09121f', '& svg': { fontSize: '18px' } }}>
                {item.icon}
              </ListItemIcon>
              {item.text}
            </MenuItem>
          )),
          <Divider key="manage-divider" sx={{ my: '4px !important' }} />,
        ]}

        {canViewAnalytics && [
          <Box key="analytics-label" sx={{ px: 2, pt: 1, pb: 0.5 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#7a8a9a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Analytics
            </Typography>
          </Box>,
          <Box key="analytics-preview" sx={{ px: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: '#7a8a9a' }}>
              Appointments ({currentBranch ? currentBranch.name : 'all branches'})
            </Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#09121f' }}>
              {analyticsLoading || !analyticsData ? '—' : analyticsData.totalAppointments.toLocaleString('en-US')}
            </Typography>
          </Box>,
          <MenuItem key="view-analytics" onClick={() => navigate('/admin/analytics')} sx={{ color: '#2362EF !important', fontWeight: 600 }}>
            View full analytics →
          </MenuItem>,
          <Divider key="analytics-divider" sx={{ my: '4px !important' }} />,
        ]}

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
