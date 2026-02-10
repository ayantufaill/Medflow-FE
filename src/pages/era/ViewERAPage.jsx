import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { eraService } from '../../services/era.service';

const ViewERAPage = () => {
  const navigate = useNavigate();
  const { eraId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [era, setERA] = useState(null);
  const [eraItems, setERAItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchERA = async () => {
      try {
        setLoading(true);
        const [eraData, items] = await Promise.all([
          eraService.getERAById(eraId),
          eraService.getERAItems(eraId).catch(() => []),
        ]);
        setERA(eraData);
        setERAItems(Array.isArray(items) ? items : []);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load ERA record.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchERA();
  }, [eraId]);

  const handleAutoPost = async () => {
    try {
      setPosting(true);
      const result = await eraService.autoPostPayments(eraId);
      showSnackbar(
        result.message || `Successfully posted ${result.posted ?? 0} payment(s)`,
        'success'
      );
      // Refresh ERA data and items
      const [eraData, items] = await Promise.all([
        eraService.getERAById(eraId),
        eraService.getERAItems(eraId).catch(() => []),
      ]);
      setERA(eraData);
      setERAItems(Array.isArray(items) ? items : []);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to auto-post payments',
        'error'
      );
    } finally {
      setPosting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY') : '-';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/era')} sx={{ mb: 2 }}>
          Back to ERA
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!era) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/era')} sx={{ mb: 2 }}>
          Back to ERA
        </Button>
        <Alert severity="warning">ERA record not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/era')}>
          Back to ERA
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            ERA Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {era.fileName || era.filename || 'ERA Information'}
          </Typography>
        </Box>
        {era.status !== 'processed' && (era.matchedCount > 0 || era.totalRecords > 0) && (
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={handleAutoPost}
            disabled={posting}
          >
            {posting ? 'Posting...' : 'Auto-Post Payments'}
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ERA File Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  File Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {era.fileName || era.filename || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Import Date
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(era.importDate || era.createdAt)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Records
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {era.totalRecords || 0}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={era.status ? era.status.charAt(0).toUpperCase() + era.status.slice(1) : 'Unknown'}
                  color={
                    era.status === 'processed'
                      ? 'success'
                      : era.status === 'processing'
                      ? 'warning'
                      : era.status === 'error'
                      ? 'error'
                      : 'default'
                  }
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>

          {eraItems.length > 0 && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Lines
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Claim #</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eraItems.map((item) => (
                      <TableRow key={item._id || item.id}>
                        <TableCell>{item.patientName || '-'}</TableCell>
                        <TableCell>{item.claimNumber || '-'}</TableCell>
                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                        <TableCell>{formatDate(item.paymentDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.status === 'matched' ? 'Matched' : 'Unmatched'}
                            size="small"
                            color={item.status === 'matched' ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(era.totalAmount || 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Matched Payments
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {era.matchedCount || 0}
                </Typography>
              </Grid>
              {era.unmatchedCount > 0 && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Unmatched Items
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {era.unmatchedCount}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/era/unmatched')}
                    sx={{ mt: 1 }}
                  >
                    View Unmatched Items
                  </Button>
                </Grid>
              )}
              {era.postedCount > 0 && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Auto-Posted
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {era.postedCount}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {era.status !== 'processed' && (era.matchedCount > 0 || era.totalRecords > 0) && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CheckCircleIcon />}
                  onClick={handleAutoPost}
                  disabled={posting}
                >
                  {posting ? 'Posting...' : 'Auto-Post Payments'}
                </Button>
              )}
              {era.unmatchedCount > 0 && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/era/unmatched')}
                >
                  View Unmatched Items
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewERAPage;
