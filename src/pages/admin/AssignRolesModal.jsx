import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Avatar,
  Stack,
  Button,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  EmailOutlined,
  ShieldOutlined as ShieldIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { fetchUserById, assignRole, removeRole } from '../../store/slices/userSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { roleService } from '../../services/role.service';
import rolesIcon from '../../assets/usermanagement icons/roles.svg';

const AssignRolesModal = ({ open, onClose, user: propUser, onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userId = propUser?._id || propUser?.id;

  const [userDetails, setUserDetails] = useState(propUser || null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [allRoles, setAllRoles] = useState([]);
  const [userRoles, setUserRoles] = useState(propUser?.roles || []);
  const fetchInProgressRef = useRef(false);

  useEffect(() => {
    setUserDetails(propUser || null);
    setUserRoles(propUser?.roles || []);
    setError('');
  }, [propUser, open]);

  useEffect(() => {
    if (!open || !userId) return;
    if (fetchInProgressRef.current) return;
    fetchInProgressRef.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [userResult, rolesData] = await Promise.all([
          dispatch(fetchUserById(userId)).unwrap(),
          roleService.getAllRoles(),
        ]);

        const userData = userResult?.user || userResult;
        if (userData) {
          setUserDetails(userData);
          setUserRoles(userData.roles || []);
        }
        setAllRoles(rolesData || []);
      } catch (err) {
        if (err?.name === 'ConditionError') return;
        const errorMsg = typeof err === 'string' ? err : 
          (err?.message || 'Failed to load roles data. Please try again.');
        setError(errorMsg);
      } finally {
        setLoading(false);
        fetchInProgressRef.current = false;
      }
    };

    fetchData();
  }, [open, userId, dispatch]);

  const isRoleAssigned = (roleId) => {
    return userRoles.some((role) => role._id === roleId || role.id === roleId || role === roleId);
  };

  const handleRoleToggle = async (role) => {
    const roleId = role._id || role.id;
    const isAssigned = isRoleAssigned(roleId);

    try {
      setUpdating(true);
      setError('');

      if (isAssigned) {
        await dispatch(removeRole({ userId, roleId })).unwrap();
        setUserRoles((prev) => prev.filter((r) => {
          const rId = r._id || r.id || r;
          return rId !== roleId;
        }));
        showSnackbar(`Role "${role.name}" removed successfully`, 'success');
      } else {
        await dispatch(assignRole({ userId, roleId })).unwrap();
        setUserRoles((prev) => [...prev, role]);
        showSnackbar(`Role "${role.name}" assigned successfully`, 'success');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : 
        (err?.message || `Failed to ${isAssigned ? 'remove' : 'assign'} role.`);
      setError(errorMsg);
      showSnackbar(errorMsg, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getUserInitials = (firstName, lastName, email) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (email && typeof email === 'string') {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: '14px',
          boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      {/* Modal Header */}
      <Box sx={{
        px: '24px', height: '73px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mr: '16px', flexShrink: 0
          }}>
            <img src={rolesIcon} alt="Assign Roles" style={{ width: 22, height: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0f172a', lineHeight: 1 }}>
              Assign & Manage Roles
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: '#64748b', mt: '4px', lineHeight: 1 }}>
              Configure access level and practice permissions for this user account
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" disabled={updating} sx={{ color: '#64748b', '&:hover': { color: '#0f172a', bgcolor: 'rgba(0,0,0,0.05)' } }}>
          <CloseIcon sx={{ fontSize: '20px' }} />
        </IconButton>
      </Box>

      {/* Modal Body */}
      <DialogContent sx={{ p: '24px', bgcolor: '#ffffff', flex: 1, overflowY: 'auto', position: 'relative' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px', fontFamily: 'Inter, sans-serif' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading && !userDetails ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        ) : !userDetails ? (
          <Alert severity="warning">No user details available.</Alert>
        ) : (
          <>
            {/* User Profile Summary Card */}
            <Paper
              elevation={0}
              sx={{
                p: '20px', bgcolor: '#ffffff', borderRadius: '12px',
                border: '1px solid #e2e8f0', mb: '20px'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 56, height: 56,
                        bgcolor: '#1d4ed8', fontSize: '20px', fontWeight: 600, mr: '16px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {getUserInitials(userDetails.firstName, userDetails.lastName, userDetails.email)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0f172a', mb: '4px', lineHeight: 1 }}>
                        {`${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || userDetails.email}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#64748b' }}>
                        {userDetails.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    gap: 1.25, pl: { md: 3 },
                    borderLeft: { md: '1px solid #e2e8f0' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Box sx={{ p: '8px', bgcolor: '#eff6ff', borderRadius: '8px', display: 'flex' }}>
                        <ShieldIcon sx={{ fontSize: '18px', color: '#3b82f6' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', mb: '2px', lineHeight: 1 }}>Current Assigned Roles</Typography>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#0f172a', fontWeight: 700, lineHeight: 1 }}>
                          {userRoles.length} {userRoles.length === 1 ? 'Role Assigned' : 'Roles Assigned'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Interactive Roles Selection Section */}
            <Paper
              elevation={0}
              sx={{
                p: '24px', bgcolor: '#ffffff', borderRadius: '12px',
                border: '1px solid #e2e8f0',
                position: 'relative',
              }}
            >
              {updating && (
                <Box
                  sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10, borderRadius: '12px', backdropFilter: 'blur(1px)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#ffffff', px: 3, py: 1.5, borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                    <CircularProgress size={20} sx={{ color: '#1d4ed8' }} />
                    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>Updating Permissions...</Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ mb: '20px' }}>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: '#0f172a', mb: '4px', lineHeight: 1.2 }}>
                  Available Practice Roles
                </Typography>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748b' }}>
                  Click on any role chip below to toggle assignment. Changes take effect in real-time.
                </Typography>
              </Box>

              {loading && allRoles.length === 0 ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={28} sx={{ color: '#1d4ed8' }} />
                </Box>
              ) : allRoles.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: '8px', fontFamily: 'Inter, sans-serif' }}>No roles found in the system.</Alert>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1.5} sx={{ pt: 0.5 }}>
                  {allRoles.map((role) => {
                    const isAssigned = isRoleAssigned(role._id || role.id);
                    return (
                      <Chip
                        key={role._id || role.id}
                        label={role.name}
                        onClick={() => handleRoleToggle(role)}
                        icon={isAssigned ? <CheckCircleIcon sx={{ color: '#3b82f6 !important', fontSize: '18px' }} /> : undefined}
                        sx={{
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '13px',
                          height: 36,
                          px: 1,
                          borderRadius: '6px',
                          transition: 'all 0.15s ease',
                          bgcolor: isAssigned ? '#eff6ff' : '#f8fafc',
                          color: isAssigned ? '#1d4ed8' : '#475569',
                          border: `1px solid ${isAssigned ? '#3b82f6' : '#e2e8f0'}`,
                          boxShadow: 'none',
                          '&:hover': {
                            bgcolor: isAssigned ? '#dbeafe' : '#f1f5f9',
                            borderColor: isAssigned ? '#1d4ed8' : '#cbd5e1',
                          },
                        }}
                        disabled={updating}
                      />
                    );
                  })}
                </Stack>
              )}
            </Paper>
          </>
        )}
      </DialogContent>

      {/* Modal Footer Actions */}
      <Box sx={{
        height: '57px', px: '24px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0'
      }}>
        <Button
          variant="contained"
          disableElevation
          onClick={onClose}
          disabled={updating}
          sx={{
            textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
            bgcolor: '#1d4ed8', color: '#ffffff', borderRadius: '6px',
            px: '24px', height: '36px',
            '&:hover': { bgcolor: '#1e40af' }
          }}
        >
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default AssignRolesModal;
