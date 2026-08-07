import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Button,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  EmailOutlined,
  LocalPhoneOutlined,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { fetchUserById, updateUser } from '../../store/slices/userSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import UserForm from '../../components/users/UserForm';
import editIcon from '../../assets/usermanagement icons/edit.svg';

const EditUserModal = ({ open, onClose, user: propUser, onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userId = propUser?._id || propUser?.id;

  const [userDetails, setUserDetails] = useState(propUser || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fetchInProgressRef = useRef(false);

  useEffect(() => {
    setUserDetails(propUser || null);
    setError('');
  }, [propUser, open]);

  // Fetch full user details when modal opens
  useEffect(() => {
    if (!open || !userId) return;
    if (fetchInProgressRef.current) return;
    fetchInProgressRef.current = true;

    const load = async () => {
      try {
        setLoading(true);
        const result = await dispatch(fetchUserById(userId)).unwrap();
        const userData = result?.user || result;
        if (userData) {
          setUserDetails(userData);
        }
      } catch (err) {
        if (err?.name === 'ConditionError') return;
        const errorMsg = typeof err === 'string' ? err : 
          (err?.message || 'Failed to load user data.');
        setError(errorMsg);
      } finally {
        setLoading(false);
        fetchInProgressRef.current = false;
      }
    };

    load();
  }, [open, userId, dispatch]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      const userData = { ...data };
      delete userData.password;
      delete userData.confirmPassword;

      await dispatch(updateUser({ userId, updates: userData })).unwrap();
      showSnackbar('User updated successfully', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = typeof err === 'string' ? err : 
        (err?.message || 'Failed to update user. Please try again.');
      setError(errorMsg);
      showSnackbar(errorMsg, 'error');
    } finally {
      setSaving(false);
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

  const isLocked = userDetails?.accountLockedUntil && new Date(userDetails.accountLockedUntil) > new Date();

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
          maxHeight: '88vh',
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
            <img src={editIcon} alt="Edit User" style={{ width: 22, height: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0f172a', lineHeight: 1 }}>
              Edit User Profile
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: '#64748b', mt: '4px', lineHeight: 1 }}>
              Update contact information, preferred language, and account activity status
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" disabled={saving} sx={{ color: '#64748b', '&:hover': { color: '#0f172a', bgcolor: 'rgba(0,0,0,0.05)' } }}>
          <CloseIcon sx={{ fontSize: '20px' }} />
        </IconButton>
      </Box>

      {/* Modal Body */}
      <DialogContent sx={{ p: '24px', bgcolor: '#ffffff', flex: 1, overflowY: 'auto' }}>
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
          <Alert severity="warning">No user details available to edit.</Alert>
        ) : (
          <>
            {/* User Summary Card */}
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
                      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0f172a', mb: '6px', lineHeight: 1 }}>
                        {`${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || userDetails.email}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={userDetails.isActive !== false ? 'Active' : 'Inactive'}
                          size="small"
                          sx={{
                            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', height: 24,
                            bgcolor: userDetails.isActive !== false ? '#DCFCE7' : '#F3F4F6',
                            color: userDetails.isActive !== false ? '#166534' : '#475569',
                            border: `1px solid ${userDetails.isActive !== false ? '#BBF7D0' : '#E2E8F0'}`,
                            borderRadius: '20px', px: 0.5
                          }}
                        />
                        {isLocked && (
                          <Chip
                            icon={<LockIcon sx={{ fontSize: '0.85rem !important' }} />}
                            label="Locked"
                            size="small"
                            sx={{
                              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', height: 24,
                              bgcolor: '#FEE2E2', color: '#B91C1C', border: '1px solid #FECACA',
                              borderRadius: '20px', px: 0.5
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    gap: 1.5, pl: { md: 3 },
                    borderLeft: { md: '1px solid #e2e8f0' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Box sx={{ p: '8px', bgcolor: '#eff6ff', borderRadius: '8px', display: 'flex' }}>
                        <EmailOutlined sx={{ fontSize: '18px', color: '#3b82f6' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', mb: '2px', lineHeight: 1 }}>Email Address</Typography>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#0f172a', fontWeight: 600, lineHeight: 1 }}>{userDetails.email || '-'}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Box sx={{ p: '8px', bgcolor: '#eff6ff', borderRadius: '8px', display: 'flex' }}>
                        <LocalPhoneOutlined sx={{ fontSize: '18px', color: '#3b82f6' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', mb: '2px', lineHeight: 1 }}>Phone Number</Typography>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#0f172a', fontWeight: 600, lineHeight: 1 }}>{userDetails.phone || '-'}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* User Form Paper Container */}
            <Paper
              elevation={0}
              sx={{
                p: '24px', bgcolor: '#ffffff', borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            >
              <UserForm
                onSubmit={onSubmit}
                initialData={userDetails}
                loading={saving}
                isEditMode={true}
                hideButtons={true}
                formId="edit-user-form"
              />
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
          variant="outlined"
          onClick={onClose}
          disabled={saving}
          sx={{
            textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
            borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '6px',
            px: '16px', height: '36px',
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-user-form"
          variant="contained"
          disableElevation
          disabled={saving || !userDetails}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon sx={{ fontSize: '17px !important' }} />}
          sx={{
            textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
            bgcolor: '#1d4ed8', color: '#ffffff', borderRadius: '6px',
            px: '24px', height: '36px',
            '&:hover': { bgcolor: '#1e40af' }
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditUserModal;
