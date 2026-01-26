import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Stack,
  Button,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  EmailOutlined,
  LocalPhoneOutlined,
} from '@mui/icons-material';
import { practiceInfoService } from '../../services/practice-info.service';

const ViewPracticeInfoPage = () => {
  const navigate = useNavigate();
  const { practiceInfoId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [practiceInfo, setPracticeInfo] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await practiceInfoService.getPracticeInfoById(
          practiceInfoId
        );
        setPracticeInfo(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load practice info. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (practiceInfoId) {
      fetchData();
    }
  }, [practiceInfoId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !practiceInfo) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!practiceInfo) {
    return (
      <Box>
        <Alert severity="error">Practice info not found</Alert>
      </Box>
    );
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Box>
      {/* Navigation Header */}
      <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 1 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Practice Details
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Primary Details Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          {/* Left: Logo and Info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flex: 1,
              minWidth: 300,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              {practiceInfo.logoPath ? (
                <Avatar
                  src={practiceInfo.logoPath}
                  alt={practiceInfo.practiceName}
                  variant="rounded"
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    margin: '-10px',
                  }}
                />
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: 'primary.main',
                    fontSize: '1.8rem',
                  }}
                >
                  <BusinessIcon />
                </Avatar>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {practiceInfo.practiceName || '-'}
              </Typography>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailOutlined fontSize="small" color="action" />
                  <Typography variant="body2">
                    {practiceInfo.email || '-'}
                  </Typography>
                </Box>
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalPhoneOutlined fontSize="small" color="action" />
                  <Typography variant="body2">
                    {practiceInfo.phone || '-'}
                  </Typography>
                </Box> */}
              </Stack>
            </Box>
          </Box>
          {/* Edit Button */}
          <Button
            variant="contained"
            size="small"
            disableElevation
            startIcon={<EditIcon />}
            onClick={() => navigate(`/practice-info/${practiceInfoId}/edit`)}
          >
            Edit
          </Button>
        </Box>
      </Paper>

      {/* Tabs Section */}
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
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Practice Information" />
            <Tab label="Business Hours" />
          </Tabs>
        </Box>

        {/* Tab Panel: Practice Information */}
        {tabValue === 0 && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {practiceInfo.phone || '-'}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tax ID
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {practiceInfo.taxId || '-'}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  NPI Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {practiceInfo.npiNumber || '-'}
                </Typography>
              </Grid>
              {practiceInfo.billingContactEmail && (
                <Grid size={6}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Billing Contact Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {practiceInfo.billingContactEmail}
                  </Typography>
                </Grid>
              )}
              {practiceInfo.address && (
                <Grid size={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Address
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {[
                      practiceInfo.address.line1,
                      practiceInfo.address.line2,
                      practiceInfo.address.city,
                      practiceInfo.address.state,
                      practiceInfo.address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </Typography>
                </Grid>
              )}
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Timezone
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {practiceInfo.timezone || 'UTC'}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Appointment Buffer
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {practiceInfo.appointmentBufferMinutes || 0} minutes
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Panel: Business Hours */}
        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            {practiceInfo.businessHours &&
            Object.keys(practiceInfo.businessHours).length > 0 ? (
              <Grid container spacing={2}>
                {[
                  { key: 'monday', label: 'Monday' },
                  { key: 'tuesday', label: 'Tuesday' },
                  { key: 'wednesday', label: 'Wednesday' },
                  { key: 'thursday', label: 'Thursday' },
                  { key: 'friday', label: 'Friday' },
                  { key: 'saturday', label: 'Saturday' },
                  { key: 'sunday', label: 'Sunday' },
                ].map((day) => {
                  const dayHours = practiceInfo.businessHours[day.key];
                  const isClosed =
                    !dayHours || !dayHours.open || !dayHours.close;

                  return (
                    <Grid size={6} key={day.key}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {day.label}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {isClosed
                          ? 'Closed'
                          : `${dayHours.open} - ${dayHours.close}`}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No business hours configured.
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ViewPracticeInfoPage;
