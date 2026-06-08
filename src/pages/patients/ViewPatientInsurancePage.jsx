import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

// Redux hooks
import { usePatient } from '../../hooks/redux/usePatient';
import { usePatientInsurance } from '../../hooks/redux/usePatientInsurance';
import { insuranceCompanyService } from '../../services/insurance.service';

const ViewPatientInsurancePage = () => {
  const navigate = useNavigate();
  const { patientId, insuranceId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [companyName, setCompanyName] = useState('');

  const { currentPatient: patient, fetchById: fetchPatient } = usePatient();
  const { insurances, fetch: fetchInsurances } = usePatientInsurance(patientId);

  // Find the exact insurance from Redux store
  const insurance = useMemo(() => {
    return insurances?.find(ins => (ins._id || ins.id) === insuranceId) || null;
  }, [insurances, insuranceId]);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Fetch patient and insurances via Redux concurrently
        await Promise.all([
          fetchPatient(patientId),
          fetchInsurances()
        ]);
      } catch (err) {
        setError('Failed to load insurance details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (patientId) {
      initData();
    }
  }, [patientId, fetchPatient, fetchInsurances]);

  // Load company name once insurance is found
  useEffect(() => {
    if (!insurance?.insuranceCompanyId) return;
    
    if (typeof insurance.insuranceCompanyId === 'object') {
      setCompanyName(insurance.insuranceCompanyId.name || 'Unknown');
    } else {
      insuranceCompanyService.getInsuranceCompanyById(insurance.insuranceCompanyId)
        .then((company) => {
          setCompanyName(company?.name || 'Unknown');
        })
        .catch(() => {
          setCompanyName('Unknown');
        });
    }
  }, [insurance]);

  const handleBack = () => {
    navigate(`/patients/${patientId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('MM/DD/YYYY');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !insurance) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!insurance) {
    return (
      <Box>
        <Alert severity="error">Insurance record not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Insurance Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'} - {companyName}
          </Typography>
        </Box>
        {/* <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/patients/${patientId}/insurance/${insuranceId}/edit`)}
        >
          Edit Insurance
        </Button> */}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 3 }}>
          Insurance Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Insurance Company
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {companyName}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Insurance Type
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {insurance.insuranceType?.toUpperCase() || '-'}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Policy Number
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {insurance.policyNumber || '-'}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Group Number
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {insurance.groupNumber || '-'}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Subscriber Name
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {insurance.subscriberName || '-'}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Subscriber Date of Birth
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(insurance.subscriberDateOfBirth)}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Relationship to Patient
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {insurance.relationshipToPatient
                ? insurance.relationshipToPatient.charAt(0).toUpperCase() +
                  insurance.relationshipToPatient.slice(1)
                : '-'}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={insurance.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={insurance.isActive ? 'success' : 'default'}
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Effective Date
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(insurance.effectiveDate)}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Expiration Date
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(insurance.expirationDate)}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Copay Amount
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {insurance.copayAmount ? `$${insurance.copayAmount}` : '-'}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Deductible Amount
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {insurance.deductibleAmount ? `$${insurance.deductibleAmount}` : '-'}
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Verification Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={
                  insurance.verificationStatus
                    ? insurance.verificationStatus.charAt(0).toUpperCase() +
                      insurance.verificationStatus.slice(1)
                    : 'Pending'
                }
                size="small"
                color={
                  insurance.verificationStatus === 'verified'
                    ? 'success'
                    : insurance.verificationStatus === 'failed'
                    ? 'error'
                    : 'default'
                }
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Verification Date
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(insurance.verificationDate)}
            </Typography>
          </Grid>

          {insurance.notes && (
            <Grid item size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {insurance.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewPatientInsurancePage;
