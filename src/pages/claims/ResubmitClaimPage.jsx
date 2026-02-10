import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { claimService } from '../../services/claim.service';
import dayjs from 'dayjs';

const ResubmitClaimPage = () => {
  const navigate = useNavigate();
  const { claimId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [workflowType, setWorkflowType] = useState('correction'); // 'correction' or 'appeal'
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [correctedFields, setCorrectedFields] = useState({
    diagnosisCodes: '',
    procedureCodes: '',
    patientInfo: '',
    insuranceInfo: '',
    other: '',
  });

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
        const claimData = await claimService.getClaimById(claimId);
        setClaim(claimData);
        // Pre-fill correction notes with denial reason
        if (claimData.denialReason) {
          setCorrectionNotes(`Original denial reason: ${claimData.denialReason}\n\n`);
        }
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load claim.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchClaim();
  }, [claimId]);

  const handleSubmit = async () => {
    if (workflowType === 'correction' && !correctionNotes.trim()) {
      showSnackbar('Please provide correction notes', 'error');
      return;
    }

    if (workflowType === 'appeal' && !appealReason.trim()) {
      showSnackbar('Please provide appeal reason', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const corrections = {
        workflowType,
        correctionNotes: workflowType === 'correction' ? correctionNotes : undefined,
        appealReason: workflowType === 'appeal' ? appealReason : undefined,
        correctedFields: workflowType === 'correction' ? correctedFields : undefined,
      };

      await claimService.resubmitClaim(claimId, corrections);
      showSnackbar('Claim resubmitted successfully', 'success');
      navigate(`/claims/${claimId}`);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to resubmit claim',
        'error'
      );
    } finally {
      setSubmitting(false);
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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/claims/${claimId}`)} sx={{ mb: 2 }}>
          Back to Claim
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!claim) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/claims')} sx={{ mb: 2 }}>
          Back to Claims
        </Button>
        <Alert severity="warning">Claim not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/claims/${claimId}`)}>
          Back to Claim
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Manage Denial Workflow
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {claim.claimNumber || claim.claimCode || 'Claim'} - Denial Management
          </Typography>
        </Box>
      </Box>

      {claim.denialReason && (
        <Alert severity="error" icon={<WarningIcon />} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Denial Reason
          </Typography>
          <Typography variant="body2">{claim.denialReason}</Typography>
          {claim.deniedDate && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Denied on: {formatDate(claim.deniedDate)}
            </Typography>
          )}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Claim Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Claim Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Claim Number
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {claim.claimNumber || claim.claimCode || '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Patient
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {claim.patient?.firstName && claim.patient?.lastName
                      ? `${claim.patient.firstName} ${claim.patient.lastName}`
                      : claim.patientId?.firstName && claim.patientId?.lastName
                      ? `${claim.patientId.firstName} ${claim.patientId.lastName}`
                      : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Insurance Company
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {claim.insuranceCompany?.name || claim.insuranceCompanyId?.name || '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Claim Amount
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(claim.claimAmount || claim.totalAmount || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Workflow Management */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Workflow Type
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Workflow Type</FormLabel>
              <RadioGroup
                value={workflowType}
                onChange={(e) => setWorkflowType(e.target.value)}
                row
              >
                <FormControlLabel
                  value="correction"
                  control={<Radio />}
                  label="Correction - Fix errors and resubmit"
                />
                <FormControlLabel
                  value="appeal"
                  control={<Radio />}
                  label="Appeal - Dispute the denial"
                />
              </RadioGroup>
            </FormControl>

            {workflowType === 'correction' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Correction Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Diagnosis Codes (if corrected)"
                      value={correctedFields.diagnosisCodes}
                      onChange={(e) =>
                        setCorrectedFields({ ...correctedFields, diagnosisCodes: e.target.value })
                      }
                      placeholder="e.g., E11.9, I10"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Procedure Codes (if corrected)"
                      value={correctedFields.procedureCodes}
                      onChange={(e) =>
                        setCorrectedFields({ ...correctedFields, procedureCodes: e.target.value })
                      }
                      placeholder="e.g., 99213, 36415"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Patient Information (if corrected)"
                      value={correctedFields.patientInfo}
                      onChange={(e) =>
                        setCorrectedFields({ ...correctedFields, patientInfo: e.target.value })
                      }
                      placeholder="e.g., DOB correction, name spelling"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Insurance Information (if corrected)"
                      value={correctedFields.insuranceInfo}
                      onChange={(e) =>
                        setCorrectedFields({ ...correctedFields, insuranceInfo: e.target.value })
                      }
                      placeholder="e.g., Policy number, group number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Other Corrections"
                      value={correctedFields.other}
                      onChange={(e) =>
                        setCorrectedFields({ ...correctedFields, other: e.target.value })
                      }
                      placeholder="Any other corrections..."
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Correction Notes *"
                  multiline
                  rows={6}
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="Describe the corrections made to the claim..."
                  required
                  helperText="Explain what was corrected and why the claim should be approved"
                />
              </Box>
            )}

            {workflowType === 'appeal' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Appeal Information
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Use this option if you believe the denial was incorrect and want to dispute it.
                    Provide a detailed reason for the appeal.
                  </Typography>
                </Alert>
                <TextField
                  fullWidth
                  label="Appeal Reason *"
                  multiline
                  rows={8}
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Provide a detailed explanation of why the denial should be overturned..."
                  required
                  helperText="Explain why the claim should be approved despite the denial reason"
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate(`/claims/${claimId}`)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : workflowType === 'correction' ? 'Resubmit Claim' : 'Submit Appeal'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResubmitClaimPage;
