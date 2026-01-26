import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Stack,
  Grid,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  EmailOutlined,
  LocalPhoneOutlined,
  Lock as LockIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { userService } from '../../services/user.service';

const ViewUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
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

  // Menu state
  const [menuAnchor, setMenuAnchor] = useState(null);

  // Search and filter state for activities
  const [activitiesSearchInput, setActivitiesSearchInput] = useState('');
  const [activitiesSearch, setActivitiesSearch] = useState('');
  const [activitiesDateRange, setActivitiesDateRange] = useState([null, null]);

  // Search and filter state for login history
  const [loginHistorySearchInput, setLoginHistorySearchInput] = useState('');
  const [loginHistorySearch, setLoginHistorySearch] = useState('');
  const [loginHistoryDateRange, setLoginHistoryDateRange] = useState([null, null]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [userData, rolesData] = await Promise.all([
          userService.getUserById(userId),
          userService.getUserRoles(userId),
        ]);

        setUser(userData);
        setUserRoles(rolesData);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load user data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Fetch activities
  const fetchActivities = useCallback(
    async (page = 1, append = false) => {
      if (activitiesLoadingRef.current || !userId) return;

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
        setActivitiesHasMore(pagination.page < pagination.pages);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load activities. Please try again.'
        );
      } finally {
        setActivitiesLoading(false);
        activitiesLoadingRef.current = false;
      }
    },
    [userId, activityFilters]
  );

  // Fetch login history
  const fetchLoginHistory = useCallback(
    async (page = 1, append = false) => {
      if (loginHistoryLoadingRef.current || !userId) return;

      try {
        loginHistoryLoadingRef.current = true;
        setLoginHistoryLoading(true);

        const result = await userService.getUserLoginHistory(userId, {
          page,
          limit: 20,
          ...loginFilters,
        });

        if (append) {
          setLoginHistory((prev) => [...prev, ...(result.loginHistory || [])]);
        } else {
          setLoginHistory(result.loginHistory || []);
        }

        const { pagination } = result;
        setLoginHistoryHasMore(pagination.page < pagination.pages);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load login history. Please try again.'
        );
      } finally {
        setLoginHistoryLoading(false);
        loginHistoryLoadingRef.current = false;
      }
    },
    [userId, loginFilters]
  );

  // Load activities when tab is selected
  useEffect(() => {
    if (tabValue !== 0) return;
    setActivities([]);
    setActivitiesHasMore(true);
    setActivitiesPage(1);
    fetchActivities(1, false);
  }, [tabValue, activityFilters, fetchActivities]);

  useEffect(() => {
    if (tabValue !== 1) return;
    setLoginHistory([]);
    setLoginHistoryHasMore(true);
    setLoginHistoryPage(1);
    fetchLoginHistory(1, false);
  }, [tabValue, loginFilters, fetchLoginHistory]);

  // Infinite scroll for activities
  useEffect(() => {
    if (tabValue !== 0) return;

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

    if (activitiesObserverRef.current) {
      observer.observe(activitiesObserverRef.current);
    }

    return () => {
      if (activitiesObserverRef.current) {
        observer.unobserve(activitiesObserverRef.current);
      }
    };
  }, [tabValue, activitiesHasMore, activitiesLoading, activitiesPage, fetchActivities]);

  // Infinite scroll for login history
  useEffect(() => {
    if (tabValue !== 1) return;

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

    if (loginHistoryObserverRef.current) {
      observer.observe(loginHistoryObserverRef.current);
    }

    return () => {
      if (loginHistoryObserverRef.current) {
        observer.unobserve(loginHistoryObserverRef.current);
      }
    };
  }, [tabValue, loginHistoryHasMore, loginHistoryLoading, loginHistoryPage, fetchLoginHistory]);

  const getUserInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  const getRoleChips = (roles) => {
    if (!roles || roles.length === 0) {
      return <Chip label="No roles" size="small" color="default" />;
    }

    return roles.map((role, index) => {
      const roleName = typeof role === 'string' ? role : role?.name || 'Unknown';
      const isAdmin = roleName === 'Admin';

      return (
        <Chip
          key={index}
          label={roleName}
          size="small"
          color={isAdmin ? 'error' : 'primary'}
          sx={{ mr: 1, mb: 1 }}
        />
      );
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Alert severity="error">User not found</Alert>
      </Box>
    );
  }

  const isLocked = user.accountLockedUntil && new Date(user.accountLockedUntil) > new Date();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Navigation Header */}
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 0 }}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              User Details
            </Typography>
            {/* <Typography variant="body1" color="text.secondary">
              View user details and activity history.
            </Typography> */}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Two-Column Layout */}
        <Grid container spacing={3}>
          {/* Left Column: Primary Info (Sticky) */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box
              sx={{
                position: { xs: 'static', lg: 'sticky' },
                top: { lg: 64 },
                alignSelf: 'flex-start',
              }}
            >
              <Paper sx={{ p: 3 }}>
                {/* Profile Picture and Basic Info */}
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      bgcolor: 'primary.main',
                      fontSize: '1.8rem',
                    }}
                  >
                    {getUserInitials(user.firstName, user.lastName)}
                  </Avatar>
                  <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'start', gap: 1, flexDirection: 'column' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {user.firstName} {user.lastName}
                  </Typography>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={user.isActive ? 'success' : 'error'}
                    />
                    {isLocked && (
                      <Chip
                        icon={<LockIcon />}
                        label="Locked"
                        size="small"
                        color="error"
                      />
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Personal Information */}
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      Personal Information
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/users/${userId}/edit`)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Stack spacing={2}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1}}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <EmailOutlined />
                        
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {user.email || '-'}
                      </Typography>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1}}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <LocalPhoneOutlined />
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {user.phone || '-'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Roles */}
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      Roles
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/users/${userId}/roles`)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {getRoleChips(userRoles)}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Right Column: Tabs and Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ width: '100%' }}>
              {/* Sticky Tabs */}
              <Box
                sx={{
                  position: 'sticky',
                  top: { xs: 56, lg: 63 },
                  zIndex: 10,
                  bgcolor: 'background.paper',
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Activities" />
                  <Tab label="Login History" />
                </Tabs>
              </Box>

              {/* Tab Panel: User Activities */}
              {tabValue === 0 && (
                <Box>
                  {/* Sticky Search and Filter Section */}
                  <Box
                    sx={{
                      position: 'sticky',
                      top: 105,
                      zIndex: 9,
                      bgcolor: 'background.paper',
                      p: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          placeholder="Search activities..."
                          value={activitiesSearchInput}
                          onChange={(e) => setActivitiesSearchInput(e.target.value)}
                          size="small"
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <DatePicker
                          orientation="portrait"
                          label="From Date"
                          value={activitiesDateRange[0]}
                          maxDate={activitiesDateRange[1]}
                          onChange={(newValue) =>
                            setActivitiesDateRange(([, end]) => [newValue, end])
                          }
                          slotProps={{
                            textField: { size: 'small', fullWidth: true },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <DatePicker
                          orientation="portrait"
                          label="To Date"
                          value={activitiesDateRange[1]}
                          onChange={(newValue) =>
                            setActivitiesDateRange(([start]) => [start, newValue])
                          }
                          minDate={activitiesDateRange[0]}
                          slotProps={{
                            textField: { size: 'small', fullWidth: true },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={handleActivityFiltersReset}
                          disabled={
                            !activitiesSearchInput &&
                            !activitiesDateRange[0] &&
                            !activitiesDateRange[1]
                          }
                        >
                          Reset
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Scrollable Content */}
                  <Box sx={{ p: 3 }}>
                    {activitiesLoading && activities.length === 0 ? (
                      <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                      </Box>
                    ) : activities.length === 0 ? (
                      <Typography
                        color="text.secondary"
                        align="center"
                        sx={{ py: 4 }}
                      >
                        No activities found
                      </Typography>
                    ) : (
                      <Stack spacing={2}>
                        {activities.map((activity) => (
                          <Card key={activity._id} variant="outlined">
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  flexWrap: 'wrap',
                                  gap: 2,
                                }}
                              >
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="medium"
                                    gutterBottom
                                  >
                                    {activity.action} - {activity.tableName}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Record ID: {activity.recordId}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    IP Address: {activity.ipAddress || '-'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDate(activity.createdAt)}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={activity.riskLevel || 'low'}
                                  color={getRiskLevelColor(activity.riskLevel)}
                                  size="small"
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ py: 2 }}
                          >
                            No more activities to load
                          </Typography>
                        )}
                        <div ref={activitiesObserverRef} style={{ height: 20 }} />
                      </Stack>
                    )}
                  </Box>
                </Box>
              )}

              {/* Tab Panel: Login History */}
              {tabValue === 1 && (
                <Box>
                  {/* Sticky Search and Filter Section */}
                  <Box
                    sx={{
                      position: 'sticky',
                      top: 105,
                      zIndex: 9,
                      bgcolor: 'background.paper',
                      p: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          placeholder="Search login history..."
                          value={loginHistorySearchInput}
                          onChange={(e) => setLoginHistorySearchInput(e.target.value)}
                          size="small"
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DatePicker
                          label="From Date"
                          value={loginHistoryDateRange[0]}
                          maxDate={loginHistoryDateRange[1]}
                          onChange={(newValue) =>
                            setLoginHistoryDateRange(([, end]) => [newValue, end])
                          }
                          slotProps={{
                            textField: { size: 'small', fullWidth: true },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DatePicker
                          label="To Date"
                          value={loginHistoryDateRange[1]}
                          onChange={(newValue) =>
                            setLoginHistoryDateRange(([start]) => [start, newValue])
                          }
                          minDate={loginHistoryDateRange[0]}
                          slotProps={{
                            textField: { size: 'small', fullWidth: true },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={handleLoginFiltersReset}
                          disabled={
                            !loginHistorySearchInput &&
                            !loginHistoryDateRange[0] &&
                            !loginHistoryDateRange[1]
                          }
                        >
                          Reset
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Scrollable Content */}
                  <Box sx={{ p: 3 }}>
                    {loginHistoryLoading && loginHistory.length === 0 ? (
                      <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                      </Box>
                    ) : loginHistory.length === 0 ? (
                      <Typography
                        color="text.secondary"
                        align="center"
                        sx={{ py: 4 }}
                      >
                        No login history found
                      </Typography>
                    ) : (
                      <Stack spacing={2}>
                        {loginHistory.map((login) => (
                          <Card key={login._id} variant="outlined">
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  flexWrap: 'wrap',
                                  gap: 2,
                                }}
                              >
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="medium"
                                    gutterBottom
                                  >
                                    {login.eventType === 'login_success'
                                      ? 'Successful Login'
                                      : login.eventType}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {login.description || '-'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    IP Address: {login.ipAddress || '-'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDate(login.occurredAt)}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    alignItems: 'flex-end',
                                  }}
                                >
                                  {/* <Chip
                                    label={login.riskLevel || 'low'}
                                    color={getRiskLevelColor(login.riskLevel)}
                                    size="small"
                                  /> */}
                                  {/* {login.isResolved !== undefined && (
                                  <Chip
                                    label={login.isResolved ? 'Resolved' : 'Unresolved'}
                                    color={login.isResolved ? 'success' : 'warning'}
                                    size="small"
                                  />
                                )} */}
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ py: 2 }}
                          >
                            No more login history to load
                          </Typography>
                        )}
                        <div ref={loginHistoryObserverRef} style={{ height: 20 }} />
                      </Stack>
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate(`/users/${userId}/edit`);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit User</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </LocalizationProvider>
  );
};

export default ViewUserPage;