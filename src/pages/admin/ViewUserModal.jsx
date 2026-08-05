import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Grid,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  EmailOutlined,
  LocalPhoneOutlined,
  Lock as LockIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { fetchUserById } from '../../store/slices/userSlice';
import { userService } from '../../services/user.service';
import viewIcon from '../../assets/usermanagement icons/view.svg';
import personalInfoIcon from '../../assets/usermanagement icons/personalinformation.svg';
import assignRolesIcon from '../../assets/usermanagement icons/assignroles.svg';
import editIcon from '../../assets/usermanagement icons/edit.svg';
import rolesIcon from '../../assets/usermanagement icons/roles.svg';

const sharedInputRootSx = {
  height: '36px',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  color: '#09121f',
  '& fieldset': { borderWidth: '1px', borderColor: '#e2e8f0' },
  '&:hover fieldset': { borderColor: '#cbd5e1' },
  '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
};

const filterInputSx = {
  '& .MuiOutlinedInput-root': sharedInputRootSx,
  '& .MuiOutlinedInput-input': { padding: '8px 12px', fontSize: '13px', color: '#09121f' },
  '& .MuiOutlinedInput-input::placeholder': { color: '#94a3b8', opacity: 1 },
};

const dateInputSx = {
  width: '165px',
  '& .MuiInputBase-root': {
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    color: '#09121f',
  },
  '& fieldset': { borderWidth: '1px', borderColor: '#e2e8f0' },
  '& .MuiOutlinedInput-root:hover fieldset': { borderColor: '#cbd5e1' },
  '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
  '& .MuiOutlinedInput-input': { padding: '8px 10px', fontSize: '13px', color: '#09121f' },
  '& .MuiOutlinedInput-input::placeholder': { color: '#94a3b8', opacity: 1 },
  '& .MuiInputAdornment-root .MuiIconButton-root': { padding: '4px' },
};

const ViewUserModal = ({ open, onClose, user: propUser, onEditUser, onAssignRolesUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = propUser?._id || propUser?.id;

  const [userDetails, setUserDetails] = useState(propUser || null);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Activities state
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesHasMore, setActivitiesHasMore] = useState(true);
  const activitiesObserverRef = useRef(null);
  const activitiesLoadingRef = useRef(false);

  // Login history state
  const [loginHistory, setLoginHistory] = useState([]);
  const [loginHistoryLoading, setLoginHistoryLoading] = useState(false);
  const [loginHistoryPage, setLoginHistoryPage] = useState(1);
  const [loginHistoryHasMore, setLoginHistoryHasMore] = useState(true);
  const loginHistoryObserverRef = useRef(null);
  const loginHistoryLoadingRef = useRef(false);

  // Search and filter state for activities
  const [activitiesSearchInput, setActivitiesSearchInput] = useState('');
  const [activitiesSearch, setActivitiesSearch] = useState('');
  const [activitiesDateRange, setActivitiesDateRange] = useState([null, null]);

  // Search and filter state for login history
  const [loginHistorySearchInput, setLoginHistorySearchInput] = useState('');
  const [loginHistorySearch, setLoginHistorySearch] = useState('');
  const [loginHistoryDateRange, setLoginHistoryDateRange] = useState([null, null]);

  const userFetchInProgressRef = useRef(false);

  useEffect(() => {
    setUserDetails(propUser || null);
    setTabValue(0);
  }, [propUser, open]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setActivitiesSearch(activitiesSearchInput.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [activitiesSearchInput]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setLoginHistorySearch(loginHistorySearchInput.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [loginHistorySearchInput]);

  const formatDateParam = (value) =>
    value ? dayjs(value).format('YYYY-MM-DD') : undefined;

  const activityFilters = useMemo(() => {
    const [start, end] = activitiesDateRange;
    return {
      search: activitiesSearch || undefined,
      startDate: formatDateParam(start),
      endDate: formatDateParam(end),
    };
  }, [activitiesSearch, activitiesDateRange]);

  const loginFilters = useMemo(() => {
    const [start, end] = loginHistoryDateRange;
    return {
      search: loginHistorySearch || undefined,
      startDate: formatDateParam(start),
      endDate: formatDateParam(end),
    };
  }, [loginHistorySearch, loginHistoryDateRange]);

  const handleActivityFiltersReset = () => {
    setActivitiesSearchInput('');
    setActivitiesSearch('');
    setActivitiesDateRange([null, null]);
  };

  const handleLoginFiltersReset = () => {
    setLoginHistorySearchInput('');
    setLoginHistorySearch('');
    setLoginHistoryDateRange([null, null]);
  };

  // Fetch complete user details & roles when modal opens
  useEffect(() => {
    if (!open || !userId) return;
    if (userFetchInProgressRef.current) return;
    userFetchInProgressRef.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [userData, rolesData] = await Promise.all([
          dispatch(fetchUserById(userId)).unwrap(),
          userService.getUserRoles(userId),
        ]);
        if (userData) setUserDetails(userData);
        setUserRoles(rolesData || []);
      } catch (err) {
        if (err?.name === 'ConditionError') return;
        const errorMsg = typeof err === 'string' ? err : 
          (err?.message || 'Failed to load user data.');
        setError(errorMsg);
      } finally {
        setLoading(false);
        userFetchInProgressRef.current = false;
      }
    };

    fetchData();
  }, [open, userId, dispatch]);

  // Fetch activities
  const fetchActivities = useCallback(
    async (page = 1, append = false) => {
      if (activitiesLoadingRef.current || !userId || !open) return;
      try {
        activitiesLoadingRef.current = true;
        setActivitiesLoading(true);
        const result = await userService.getUserActivity(userId, {
          page,
          limit: 20,
          ...activityFilters,
        });
        if (append) {
          setActivities((prev) => [...prev, ...(result.activities || [])]);
        } else {
          setActivities(result.activities || []);
        }
        const { pagination } = result;
        if (pagination) {
          setActivitiesHasMore(pagination.page < pagination.pages);
        } else {
          setActivitiesHasMore(false);
        }
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load activities.'
        );
      } finally {
        setActivitiesLoading(false);
        activitiesLoadingRef.current = false;
      }
    },
    [userId, open, activityFilters]
  );

  // Fetch login history
  const fetchLoginHistory = useCallback(
    async (page = 1, append = false) => {
      if (loginHistoryLoadingRef.current || !userId || !open) return;
      try {
        loginHistoryLoadingRef.current = true;
        setLoginHistoryLoading(true);
        const result = await userService.getUserLoginHistory(userId, {
          page,
          limit: 20,
          ...loginFilters,
        });
        if (append) {
          setLoginHistory((prev) => [...prev, ...(result.loginHistory || result.history || [])]);
        } else {
          setLoginHistory(result.loginHistory || result.history || []);
        }
        const { pagination } = result;
        if (pagination) {
          setLoginHistoryHasMore(pagination.page < pagination.pages);
        } else {
          setLoginHistoryHasMore(false);
        }
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load login history.'
        );
      } finally {
        setLoginHistoryLoading(false);
        loginHistoryLoadingRef.current = false;
      }
    },
    [userId, open, loginFilters]
  );

  // Load activities when tab 1 is selected
  useEffect(() => {
    if (tabValue !== 1 || !open) return;
    setActivities([]);
    setActivitiesHasMore(true);
    setActivitiesPage(1);
    fetchActivities(1, false);
  }, [tabValue, open, activityFilters, fetchActivities]);

  // Load login history when tab 2 is selected
  useEffect(() => {
    if (tabValue !== 2 || !open) return;
    setLoginHistory([]);
    setLoginHistoryHasMore(true);
    setLoginHistoryPage(1);
    fetchLoginHistory(1, false);
  }, [tabValue, open, loginFilters, fetchLoginHistory]);

  // Infinite scroll for activities
  useEffect(() => {
    if (tabValue !== 1 || !open) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && activitiesHasMore && !activitiesLoading) {
          const nextPage = activitiesPage + 1;
          setActivitiesPage(nextPage);
          fetchActivities(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );
    const currentObserver = activitiesObserverRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }
    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [tabValue, open, activitiesHasMore, activitiesLoading, activitiesPage, fetchActivities]);

  // Infinite scroll for login history
  useEffect(() => {
    if (tabValue !== 2 || !open) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loginHistoryHasMore && !loginHistoryLoading) {
          const nextPage = loginHistoryPage + 1;
          setLoginHistoryPage(nextPage);
          fetchLoginHistory(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );
    const currentObserver = loginHistoryObserverRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }
    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [tabValue, open, loginHistoryHasMore, loginHistoryLoading, loginHistoryPage, fetchLoginHistory]);

  const getUserInitials = (firstName, lastName, email) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (email && typeof email === 'string') {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getRoleChips = (roles) => {
    const rolesToRender = (roles && roles.length > 0) ? roles : (userDetails?.roles || []);
    if (!rolesToRender || rolesToRender.length === 0) {
      return <Chip label="No roles" size="small" color="default" sx={{ fontWeight: 500 }} />;
    }
    return rolesToRender.map((role, index) => {
      const roleName = typeof role === 'string' ? role : role?.name || 'Unknown';
      const isAdmin = roleName === 'Admin';
      return (
        <Chip
          key={index}
          label={roleName}
          size="small"
          sx={{
            mr: 1, mb: 1, fontWeight: 600, fontSize: '0.75rem', height: 26, px: 0.5,
            bgcolor: isAdmin ? '#FEE2E2' : '#EFF6FF',
            color: isAdmin ? '#DC2626' : '#2563EB',
            border: `1px solid ${isAdmin ? '#FECACA' : '#BFDBFE'}`
          }}
        />
      );
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (!open) return null;

  const isLocked = userDetails?.accountLockedUntil && new Date(userDetails.accountLockedUntil) > new Date();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <img src={viewIcon} alt="View User" style={{ width: 22, height: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0f172a', lineHeight: 1 }}>
                User Details
              </Typography>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: '#64748b', mt: '4px', lineHeight: 1 }}>
                View account status, personal information, assigned roles, and security audit logs
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#64748b', '&:hover': { color: '#0f172a', bgcolor: 'rgba(0,0,0,0.05)' } }}>
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

          {!userDetails ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Top User Summary Card */}
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
                            label={userDetails.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', height: 24,
                              bgcolor: userDetails.isActive ? '#DCFCE7' : '#F3F4F6',
                              color: userDetails.isActive ? '#166534' : '#475569',
                              border: `1px solid ${userDetails.isActive ? '#BBF7D0' : '#E2E8F0'}`,
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

              {/* Tabbed Content Sections */}
              <Paper
                elevation={0}
                sx={{
                  bgcolor: '#ffffff', borderRadius: '12px',
                  border: '1px solid #e2e8f0', overflow: 'hidden'
                }}
              >
                <Box sx={{ borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', px: '20px' }}>
                  <Tabs
                    value={tabValue}
                    onChange={(e, v) => setTabValue(v)}
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
                        color: '#64748b', minWidth: 110, py: '14px'
                      },
                      '& .Mui-selected': { color: '#1d4ed8' },
                      '& .MuiTabs-indicator': { backgroundColor: '#1d4ed8', height: 2 }
                    }}
                  >
                    <Tab label="Overview" />
                    <Tab label="Activities" />
                    <Tab label="Login History" />
                  </Tabs>
                </Box>

                {/* Tab 0: Overview */}
                {tabValue === 0 && (
                  <Box sx={{ p: 3.5 }}>
                    {loading ? (
                      <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress size={30} />
                      </Box>
                    ) : (
                      <Stack spacing={3.5}>
                        {/* Personal Information Section */}
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Box sx={{
                              width: 34, height: 34, borderRadius: '8px', bgcolor: '#EFF6FF',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <img src={personalInfoIcon} alt="Personal Info" style={{ width: 18, height: 18 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B' }}>
                              Personal Information
                            </Typography>
                          </Box>

                          <Grid container spacing={2.5} sx={{ pl: 1 }}>
                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 0.5, fontWeight: 500 }}>First Name</Typography>
                              <Typography sx={{ fontSize: '0.95rem', color: '#1E293B', fontWeight: 600 }}>{userDetails.firstName || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 0.5, fontWeight: 500 }}>Last Name</Typography>
                              <Typography sx={{ fontSize: '0.95rem', color: '#1E293B', fontWeight: 600 }}>{userDetails.lastName || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 0.5, fontWeight: 500 }}>Email</Typography>
                              <Typography sx={{ fontSize: '0.95rem', color: '#1E293B', fontWeight: 600 }}>{userDetails.email || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 0.5, fontWeight: 500 }}>Phone Number</Typography>
                              <Typography sx={{ fontSize: '0.95rem', color: '#1E293B', fontWeight: 600 }}>{userDetails.phone || '-'}</Typography>
                            </Grid>
                          </Grid>
                        </Box>

                        <Divider sx={{ borderColor: '#F1F5F9' }} />

                        {/* Assigned Roles Section */}
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Box sx={{
                              width: 34, height: 34, borderRadius: '8px', bgcolor: '#EFF6FF',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <img src={assignRolesIcon} alt="Assigned Roles" style={{ width: 18, height: 18 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B' }}>
                              Assigned Roles & Permissions
                            </Typography>
                          </Box>

                          <Box sx={{ pl: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {getRoleChips(userRoles)}
                          </Box>
                        </Box>
                      </Stack>
                    )}
                  </Box>
                )}

                {/* Tab 1: Activities */}
                {tabValue === 1 && (
                  <Box>
                    <Box sx={{
                      p: '16px 20px',
                      borderBottom: '1px solid #E2E8F0',
                      bgcolor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}>
                      <Box sx={{ flex: '1 1 200px', minWidth: '180px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', fontFamily: 'Inter, sans-serif' }}>
                          Search
                        </Typography>
                        <TextField
                          size="small"
                          placeholder="Search by action, table, IP..."
                          value={activitiesSearchInput}
                          onChange={(e) => setActivitiesSearchInput(e.target.value)}
                          fullWidth
                          sx={filterInputSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8', fontSize: '18px' }} />
                              </InputAdornment>
                            ),
                            endAdornment: activitiesSearchInput && (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setActivitiesSearchInput('')}>
                                  <CloseIcon sx={{ fontSize: '15px', color: '#94a3b8' }} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', fontFamily: 'Inter, sans-serif' }}>
                          Start Date
                        </Typography>
                        <DatePicker
                          value={activitiesDateRange[0]}
                          maxDate={activitiesDateRange[1]}
                          onChange={(val) => setActivitiesDateRange(([, end]) => [val, end])}
                          format="MM/DD/YYYY"
                          slotProps={{
                            textField: {
                              variant: 'outlined',
                              size: 'small',
                              placeholder: 'Start Date',
                              sx: dateInputSx,
                            },
                            popper: {
                              sx: { zIndex: 10005 }
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', fontFamily: 'Inter, sans-serif' }}>
                          End Date
                        </Typography>
                        <DatePicker
                          value={activitiesDateRange[1]}
                          minDate={activitiesDateRange[0]}
                          onChange={(val) => setActivitiesDateRange(([start]) => [start, val])}
                          format="MM/DD/YYYY"
                          slotProps={{
                            textField: {
                              variant: 'outlined',
                              size: 'small',
                              placeholder: 'End Date',
                              sx: dateInputSx,
                            },
                            popper: {
                              sx: { zIndex: 10005 }
                            }
                          }}
                        />
                      </Box>

                      <Button
                        variant="outlined"
                        onClick={handleActivityFiltersReset}
                        disabled={!activitiesSearchInput && !activitiesDateRange[0] && !activitiesDateRange[1]}
                        sx={{
                          textTransform: 'none',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '13px',
                          height: '36px',
                          borderRadius: '8px',
                          px: '18px',
                          minWidth: '85px',
                          borderColor: '#e2e8f0',
                          color: '#1e293b',
                          bgcolor: '#fff',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                          '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1', color: '#0f172a' },
                          '&.Mui-disabled': { bgcolor: '#f8fafc', borderColor: '#f1f5f9', color: '#cbd5e1', boxShadow: 'none' },
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Box>

                    <Box sx={{ p: 3, maxHeight: '380px', overflowY: 'auto' }}>
                      {activitiesLoading && activities.length === 0 ? (
                        <Box display="flex" justifyContent="center" p={4}>
                          <CircularProgress size={28} />
                        </Box>
                      ) : activities.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{ py: 4, fontSize: '0.9rem' }}>
                          No activities found for this period.
                        </Typography>
                      ) : (
                        <Stack spacing={1.5}>
                          {activities.map((act) => (
                            <Card key={act._id || Math.random()} variant="outlined" sx={{ borderRadius: 2, borderColor: '#E2E8F0' }}>
                              <CardContent sx={{ p: '14px 18px !important' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>
                                      {act.action} - {act.tableName}
                                    </Typography>
                                    {act.recordId && (
                                      <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 0.5 }}>
                                        Record ID: {act.recordId}
                                      </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                                      <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                                        IP: {act.ipAddress || '-'}
                                      </Typography>
                                      <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                                        {formatDate(act.occurredAt || act.createdAt)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Chip
                                    label={act.riskLevel || 'low'}
                                    color={getRiskLevelColor(act.riskLevel)}
                                    size="small"
                                    sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.75rem' }}
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                          {activitiesLoading && (
                            <Box display="flex" justifyContent="center" p={2}>
                              <CircularProgress size={24} />
                            </Box>
                          )}
                          {!activitiesHasMore && activities.length > 0 && (
                            <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center', py: 1 }}>
                              No more activities to load
                            </Typography>
                          )}
                          <div ref={activitiesObserverRef} style={{ height: 16 }} />
                        </Stack>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Tab 2: Login History */}
                {tabValue === 2 && (
                  <Box>
                    <Box sx={{
                      p: '16px 20px',
                      borderBottom: '1px solid #E2E8F0',
                      bgcolor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}>
                      <Box sx={{ flex: '1 1 200px', minWidth: '180px', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', fontFamily: 'Inter, sans-serif' }}>
                          Search
                        </Typography>
                        <TextField
                          size="small"
                          placeholder="Search login events, IP..."
                          value={loginHistorySearchInput}
                          onChange={(e) => setLoginHistorySearchInput(e.target.value)}
                          fullWidth
                          sx={filterInputSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8', fontSize: '18px' }} />
                              </InputAdornment>
                            ),
                            endAdornment: loginHistorySearchInput && (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setLoginHistorySearchInput('')}>
                                  <CloseIcon sx={{ fontSize: '15px', color: '#94a3b8' }} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', fontFamily: 'Inter, sans-serif' }}>
                          Start Date
                        </Typography>
                        <DatePicker
                          value={loginHistoryDateRange[0]}
                          maxDate={loginHistoryDateRange[1]}
                          onChange={(val) => setLoginHistoryDateRange(([, end]) => [val, end])}
                          format="MM/DD/YYYY"
                          slotProps={{
                            textField: {
                              variant: 'outlined',
                              size: 'small',
                              placeholder: 'Start Date',
                              sx: dateInputSx,
                            },
                            popper: {
                              sx: { zIndex: 10005 }
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', fontFamily: 'Inter, sans-serif' }}>
                          End Date
                        </Typography>
                        <DatePicker
                          value={loginHistoryDateRange[1]}
                          minDate={loginHistoryDateRange[0]}
                          onChange={(val) => setLoginHistoryDateRange(([start]) => [start, val])}
                          format="MM/DD/YYYY"
                          slotProps={{
                            textField: {
                              variant: 'outlined',
                              size: 'small',
                              placeholder: 'End Date',
                              sx: dateInputSx,
                            },
                            popper: {
                              sx: { zIndex: 10005 }
                            }
                          }}
                        />
                      </Box>

                      <Button
                        variant="outlined"
                        onClick={handleLoginFiltersReset}
                        disabled={!loginHistorySearchInput && !loginHistoryDateRange[0] && !loginHistoryDateRange[1]}
                        sx={{
                          textTransform: 'none',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: '13px',
                          height: '36px',
                          borderRadius: '8px',
                          px: '18px',
                          minWidth: '85px',
                          borderColor: '#e2e8f0',
                          color: '#1e293b',
                          bgcolor: '#fff',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                          '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1', color: '#0f172a' },
                          '&.Mui-disabled': { bgcolor: '#f8fafc', borderColor: '#f1f5f9', color: '#cbd5e1', boxShadow: 'none' },
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Box>

                    <Box sx={{ p: 3, maxHeight: '380px', overflowY: 'auto' }}>
                      {loginHistoryLoading && loginHistory.length === 0 ? (
                        <Box display="flex" justifyContent="center" p={4}>
                          <CircularProgress size={28} />
                        </Box>
                      ) : loginHistory.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{ py: 4, fontSize: '0.9rem' }}>
                          No login history found for this period.
                        </Typography>
                      ) : (
                        <Stack spacing={1.5}>
                          {loginHistory.map((login) => (
                            <Card key={login._id || Math.random()} variant="outlined" sx={{ borderRadius: 2, borderColor: '#E2E8F0' }}>
                              <CardContent sx={{ p: '14px 18px !important' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>
                                      {login.eventType === 'login_success' ? 'Successful Login' : (login.eventType || 'Login Event')}
                                    </Typography>
                                    {login.description && (
                                      <Typography sx={{ fontSize: '0.8rem', color: '#64748B', mb: 0.5 }}>
                                        {login.description}
                                      </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                                      <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                                        IP: {login.ipAddress || '-'}
                                      </Typography>
                                      <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                                        {formatDate(login.occurredAt)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                          {loginHistoryLoading && (
                            <Box display="flex" justifyContent="center" p={2}>
                              <CircularProgress size={24} />
                            </Box>
                          )}
                          {!loginHistoryHasMore && loginHistory.length > 0 && (
                            <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center', py: 1 }}>
                              No more login history to load
                            </Typography>
                          )}
                          <div ref={loginHistoryObserverRef} style={{ height: 16 }} />
                        </Stack>
                      )}
                    </Box>
                  </Box>
                )}
              </Paper>
            </>
          )}
        </DialogContent>

        {/* Modal Footer Actions */}
        <Box sx={{
          height: '57px', px: '24px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0'
        }}>
          <Box sx={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outlined"
              startIcon={<img src={editIcon} alt="edit" style={{ width: 15, height: 15 }} />}
              onClick={() => { onClose(); onEditUser ? onEditUser(userDetails || propUser) : navigate(`/users/${userId}/edit`); }}
              sx={{
                textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
                borderColor: '#2262EF', color: '#2262EF', borderRadius: '6px',
                px: '16px', height: '36px',
                '&:hover': { bgcolor: '#eff6ff', borderColor: '#1D4ED8', color: '#1D4ED8' }
              }}
            >
              Edit User
            </Button>
            <Button
              variant="outlined"
              startIcon={<img src={rolesIcon} alt="roles" style={{ width: 15, height: 15 }} />}
              onClick={() => { onClose(); onAssignRolesUser ? onAssignRolesUser(userDetails || propUser) : navigate(`/users/${userId}/roles`); }}
              sx={{
                textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
                borderColor: '#2262EF', color: '#2262EF', borderRadius: '6px',
                px: '16px', height: '36px',
                '&:hover': { bgcolor: '#eff6ff', borderColor: '#1D4ED8', color: '#1D4ED8' }
              }}
            >
              Manage Roles
            </Button>
          </Box>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
              borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '6px',
              px: '20px', height: '36px',
              '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ViewUserModal;
