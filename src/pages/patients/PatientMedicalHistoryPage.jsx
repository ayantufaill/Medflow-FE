import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  Assignment as ChecklistIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Description as DocumentIcon,
  PhotoCamera as CameraIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { patientService } from '../../services/patient.service';
import { documentService } from '../../services/document.service';
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';

const formatVisitDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

const PageContainer = (props) => (
  <Box
    {...props}
    sx={{
      bgcolor: '#f5f5f5',
      minHeight: '100%',
      pb: 4,
      position: 'relative',
      ...(props.sx || {}),
    }}
  />
);

const Card = (props) => (
  <Paper
    elevation={0}
    {...props}
    sx={{
      p: 3,
      mb: 2,
      borderRadius: 1,
      border: '1px solid #e0e0e0',
      bgcolor: '#ffffff',
      ...(props.sx || {}),
    }}
  />
);

const FloatingActions = (props) => (
  <Box
    {...props}
    sx={{
      position: 'fixed',
      right: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      zIndex: 10,
      ...(props.sx || {}),
    }}
  />
);

const FloatingActionButton = (props) => (
  <IconButton
    {...props}
    sx={{
      bgcolor: '#ffffff',
      borderRadius: '50%',
      border: '1px solid #e0e0e0',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.15)',
      '&:hover': {
        bgcolor: '#fafafa',
      },
      ...(props.sx || {}),
    }}
  />
);

const PatientMedicalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [historyTab, setHistoryTab] = useState(0); // 0 = Summary, 1 = Full Medical History
  const [medications, setMedications] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [visitDates, setVisitDates] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState(null);

  const addMedication = () => {
    const nextId = Math.max(0, ...medications.map((m) => m.id)) + 1;
    setMedications((prev) => [
      ...prev,
      { id: nextId, drug: '', dosage: '', purpose: '' },
    ]);
  };

  const updateMedication = (id, field, value) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const addSupplement = () => {
    const nextId = Math.max(0, ...supplements.map((s) => s.id)) + 1;
    setSupplements((prev) => [
      ...prev,
      { id: nextId, drug: '', dosage: '', purpose: '' },
    ]);
  };

  const updateSupplement = (id, field, value) => {
    setSupplements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await patientService.getStructuredMedicalHistory(patientId);
        if (!cancelled) {
          setPatient(data?.patient || null);
          setMedicalHistory(data || null);
          setMedications(Array.isArray(data?.medications) ? data.medications : []);
          setSupplements(Array.isArray(data?.supplements) ? data.supplements : []);
          const labels = Array.isArray(data?.visitDates)
            ? data.visitDates.map((date) => formatVisitDate(date)).filter(Boolean)
            : [];
          setVisitDates(labels);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.error?.message ||
              err?.response?.data?.message ||
              'Failed to load medical history',
          );
          showSnackbar('Failed to load medical history', 'error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [patientId, showSnackbar]);

  const patientName = (() => {
    if (patient?.firstName || patient?.lastName) {
      return `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
    }
    return 'Ayan Tufail';
  })();

  const generalInfo = medicalHistory?.generalInfo || {};
  const summarySections = Array.isArray(medicalHistory?.summary?.sections)
    ? medicalHistory.summary.sections
    : [];
  const firstSection = summarySections[0] || null;
  const secondSection = summarySections[1] || null;
  const risk = medicalHistory?.risk || {};
  const reviewedWithPatient = Boolean(medicalHistory?.review?.reviewedWithPatient);

  const dobText = patient?.dateOfBirth
    ? `DOB: ${formatDate(patient.dateOfBirth)}`
    : 'DOB: Mar 4, 2026';

  const [uploading, setUploading] = useState(false);

  const updateMedicalHistoryState = (updater) => {
    setMedicalHistory((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  };

  const handleGeneralInfoChange = (field, value) => {
    updateMedicalHistoryState((prev) => ({
      ...prev,
      generalInfo: {
        ...(prev?.generalInfo || {}),
        [field]: value,
      },
    }));
  };

  const handlePremedChange = (requiresPremed) => {
    updateMedicalHistoryState((prev) => ({
      ...prev,
      premed: {
        ...(prev?.premed || {}),
        requiresPremed,
      },
    }));
  };

  const saveMedicalHistory = async (reviewedWithPatient = false) => {
    if (!patientId || !medicalHistory) return;
    try {
      const review = reviewedWithPatient
        ? {
            ...(medicalHistory.review || {}),
            reviewedWithPatient: true,
            reviewedAt: new Date().toISOString(),
          }
        : medicalHistory.review;

      const data = await patientService.updateStructuredMedicalHistory(patientId, {
        generalInfo: medicalHistory.generalInfo,
        premed: medicalHistory.premed,
        risk: medicalHistory.risk,
        sections: medicalHistory.sections || medicalHistory.summary?.sections || [],
        medications,
        supplements,
        review,
      });

      setMedicalHistory(data);
      setMedications(Array.isArray(data?.medications) ? data.medications : []);
      setSupplements(Array.isArray(data?.supplements) ? data.supplements : []);
      showSnackbar(reviewedWithPatient ? 'Medical history reviewed' : 'Medical history updated', 'success');
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          'Failed to update medical history',
        'error'
      );
    }
  };

  const handleAddDocument = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files;
      if (!files?.length || !patientId) return;
      try {
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append('file', files[i]);
          formData.append('patientId', patientId);
          formData.append('documentType', 'other');
          formData.append('documentName', files[i].name || `Medical history document ${i + 1}`);
          await documentService.uploadDocument(formData);
        }
        showSnackbar(
          `Uploaded ${files.length} document(s). View them under SIGNED DOCS tab.`,
          'success',
        );
      } catch (err) {
        showSnackbar(
          err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            'Failed to upload document',
          'error',
        );
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  if (loading && !patient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Card>
          <Typography color="error">{error}</Typography>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PatientSectionTabs activeTab="medical" patientId={patientId} />

      <FloatingActions>
        <FloatingActionButton onClick={handleAddDocument} disabled={uploading}>
          <CameraIcon fontSize="small" />
        </FloatingActionButton>
        <FloatingActionButton>
          <DocumentIcon fontSize="small" />
        </FloatingActionButton>
        <FloatingActionButton>
          <ChecklistIcon fontSize="small" />
        </FloatingActionButton>
      </FloatingActions>

      {/* Header */}
      <Box
        sx={{
          mt: 1.5,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: '#424242', fontSize: '1.1rem' }}
            >
              Medical History
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#757575', mt: 0.25 }}
            >
              {patientName} · {dobText}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => saveMedicalHistory(false)}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#1565c0' },
            }}
          >
            Update Hx
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckIcon />}
            onClick={() => saveMedicalHistory(true)}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              bgcolor: '#43a047',
              '&:hover': { bgcolor: '#388e3c' },
            }}
          >
            Reviewed With Patient
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              borderColor: '#9e9e9e',
              color: '#616161',
              '&:hover': { borderColor: '#616161' },
            }}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Timeline – visit dates from backend */}
      <Card
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          {visitDates.map((label, index) => {
            const isLast = index === visitDates.length - 1;
            return (
              <Box
                key={`${label}-${index}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: isLast ? 14 : 10,
                    height: isLast ? 14 : 10,
                    borderRadius: '50%',
                    bgcolor: isLast ? '#1976d2' : '#bdbdbd',
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: '#757575' }}
                >
                  {label}
                </Typography>
                {isLast && (
                  <CloseIcon
                    sx={{ fontSize: 14, color: '#e53935', cursor: 'pointer' }}
                    onClick={() =>
                      setVisitDates((prev) => prev.slice(0, -1))
                    }
                  />
                )}
              </Box>
            );
          })}
          {visitDates.length === 0 && (
            <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
              No visit dates from medical history
            </Typography>
          )}
        </Box>
      </Card>

      {/* General Information */}
      <Card>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: '#424242',
            fontSize: '1.05rem',
          }}
        >
          General Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: '#757575', mb: 0.5 }}
              >
                What is your estimate of your general health?
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={generalInfo.healthEstimate || ''}
                onChange={(e) => handleGeneralInfoChange('healthEstimate', e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: '#757575', mb: 0.5 }}
              >
                Physician Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={generalInfo.physicianName || ''}
                onChange={(e) => handleGeneralInfoChange('physicianName', e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: '#757575', mb: 0.5 }}
              >
                Date of most recent physical examination
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={generalInfo.lastExamDate ? new Date(generalInfo.lastExamDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleGeneralInfoChange('lastExamDate', e.target.value || null)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: '#757575', mb: 0.5 }}
              >
                Purpose
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={generalInfo.purpose || ''}
                onChange={(e) => handleGeneralInfoChange('purpose', e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: '#757575', mb: 0.5 }}
              >
                Weight
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={generalInfo.weight || ''}
                onChange={(e) => handleGeneralInfoChange('weight', e.target.value)}
                placeholder={generalInfo.weightUnit || 'LBS'}
              />
            </Box>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: '#757575', mb: 0.5 }}
              >
                Height
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={generalInfo.height || ''}
                onChange={(e) => handleGeneralInfoChange('height', e.target.value)}
                placeholder={generalInfo.heightUnit || 'FT/IN'}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: '#757575', mb: 0.5 }}
              >
                Physician specialty
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={generalInfo.physicianSpecialty || ''}
                onChange={(e) => handleGeneralInfoChange('physicianSpecialty', e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mt: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#616161' }}
              >
                Premed
              </Typography>
              <RadioGroup
                row
                value={medicalHistory?.premed?.requiresPremed ? 'yes' : 'no'}
                onChange={(_, value) => handlePremedChange(value === 'yes')}
                sx={{
                  '& .MuiFormControlLabel-root': { mr: 2 },
                  '& .MuiTypography-root': { fontSize: 14 },
                }}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" />}
                  label="Requires premed"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" />}
                  label="No"
                />
              </RadioGroup>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Summary / Full Medical History */}
      <Card>
        <Box sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
          <Tabs
            value={historyTab}
            onChange={(_, v) => setHistoryTab(v)}
            TabIndicatorProps={{ style: { height: 3 } }}
          >
            <Tab
              label="Summary"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                minHeight: 40,
              }}
            />
            <Tab
              label="Full Medical History"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                minHeight: 40,
              }}
            />
          </Tabs>
        </Box>

        {historyTab === 0 && (
          <Box>
            {/* Q1 block – header row + content row */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  borderBottom: '1px solid #ef9a9a',
                  pb: 0.5,
                  mb: 0.75,
                }}
              >
                <Box sx={{ flex: 1, pr: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#616161' }}
                  >
                    Do you have or have you ever had:
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, pl: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#616161' }}
                  >
                    Additional information
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box
                  sx={{
                    flex: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    bgcolor: '#ffffff',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#424242' }}>
                        {firstSection?.number ? `${firstSection.number}. ` : ''}{firstSection?.question || 'No medical history summary available'}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: '#9e9e9e',
                          mt: 0.5,
                        }}
                      >
                        Doctor&apos;s Note: {firstSection?.doctorNote || '—'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#616161', mt: 1 }}
                      >
                        {firstSection?.comment || 'No additional note'}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#43a047',
                        flexShrink: 0,
                      }}
                    >
                      {firstSection?.answer || '—'}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    bgcolor: '#ffffff',
                  }}
                >
                  <Box component="ul" sx={{ m: 0, pl: 3 }}>
                    {(firstSection?.additionalInfo?.length ? firstSection.additionalInfo : ['No additional information']).map((item, index) => (
                      <Typography
                        key={index}
                        component="li"
                        variant="body2"
                        sx={{ color: '#616161', mb: 0.5 }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Q50 block – header row + content row (Are you? + Additional info aligned) */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  borderBottom: '1px solid #ef9a9a',
                  pb: 0.5,
                  mb: 0.75,
                }}
              >
                <Box sx={{ flex: 1, pr: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#616161' }}
                  >
                    Are you?
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, pl: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#616161' }}
                  >
                    Additional information
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box
                  sx={{
                    flex: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    bgcolor: '#ffffff',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#424242' }}>
                      {secondSection?.number ? `${secondSection.number}. ` : ''}{secondSection?.question || 'No secondary summary item'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#43a047',
                        flexShrink: 0,
                      }}
                    >
                      {secondSection?.answer || '—'}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    bgcolor: '#ffffff',
                  }}
                >
                  <Box component="ul" sx={{ m: 0, pl: 3 }}>
                    {(secondSection?.additionalInfo?.length ? secondSection.additionalInfo : ['No additional information']).map((item, index) => (
                      <Typography
                        key={index}
                        component="li"
                        variant="body2"
                        sx={{ color: '#616161', mb: 0.5 }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {historyTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {summarySections.length ? summarySections.map((section) => (
              <Paper key={`${section.number}-${section.question}`} variant="outlined" sx={{ p: 2, borderColor: 'grey.300' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {section.number ? `${section.number}. ` : ''}{section.question}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Answer: {section.answer || '—'}
                </Typography>
                {section.comment ? (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {section.comment}
                  </Typography>
                ) : null}
                {section.doctorNote ? (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Doctor&apos;s Note: {section.doctorNote}
                  </Typography>
                ) : null}
              </Paper>
            )) : (
              <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                Full medical history is not available for this patient yet.
              </Typography>
            )}
          </Box>
        )}
      </Card>

      {/* Medication List */}
      <Card>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: '#424242',
            fontSize: '1.05rem',
          }}
        >
          Medication List
        </Typography>

        <Grid
          container
          spacing={0}
          sx={{
            borderBottom: '1px solid #eeeeee',
            pb: 1,
            mb: 1,
          }}
        >
          <Grid item xs={5}>
            <Typography
              variant="caption"
              sx={{ color: '#9e9e9e', fontWeight: 600 }}
            >
              Drug
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              variant="caption"
              sx={{ color: '#9e9e9e', fontWeight: 600 }}
            >
              Dosage
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="caption"
              sx={{ color: '#9e9e9e', fontWeight: 600 }}
            >
              Purpose
            </Typography>
          </Grid>
        </Grid>

        {medications.map((row, index) => (
          <Grid
            key={row.id || index}
            container
            spacing={0}
            sx={{
              py: 1,
              borderBottom: '1px solid #f0f0f0',
              fontSize: 14,
            }}
          >
            <Grid item xs={5}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Drug"
                value={row.drug}
                onChange={(e) => updateMedication(row.id || index + 1, 'drug', e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{ '& input': { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Dosage"
                value={row.dosage}
                onChange={(e) => updateMedication(row.id || index + 1, 'dosage', e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{ '& input': { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Purpose"
                value={row.purpose}
                onChange={(e) => updateMedication(row.id || index + 1, 'purpose', e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{ '& input': { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
          </Grid>
        ))}

        <Link
          component="button"
          variant="body2"
          onClick={addMedication}
          sx={{
            mt: 1,
            color: '#1976d2',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          + add more
        </Link>
      </Card>

      {/* Supplements & Vitamins */}
      <Card>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: '#424242',
            fontSize: '1.05rem',
          }}
        >
          Supplements &amp; Vitamins
        </Typography>

        <Grid
          container
          spacing={0}
          sx={{
            borderBottom: '1px solid #eeeeee',
            pb: 1,
            mb: 1,
          }}
        >
          <Grid item xs={5}>
            <Typography
              variant="caption"
              sx={{ color: '#9e9e9e', fontWeight: 600 }}
            >
              Drug
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              variant="caption"
              sx={{ color: '#9e9e9e', fontWeight: 600 }}
            >
              Dosage
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="caption"
              sx={{ color: '#9e9e9e', fontWeight: 600 }}
            >
              Purpose
            </Typography>
          </Grid>
        </Grid>

        {supplements.map((row, index) => (
          <Grid
            key={row.id || index}
            container
            spacing={0}
            sx={{
              py: 1,
              borderBottom: '1px solid #f0f0f0',
              fontSize: 14,
            }}
          >
            <Grid item xs={5}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Drug"
                value={row.drug}
                onChange={(e) => updateSupplement(row.id || index + 1, 'drug', e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{ '& input': { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Dosage"
                value={row.dosage}
                onChange={(e) => updateSupplement(row.id || index + 1, 'dosage', e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{ '& input': { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                placeholder="Purpose"
                value={row.purpose}
                onChange={(e) => updateSupplement(row.id || index + 1, 'purpose', e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{ '& input': { py: 0.5, fontSize: 14 } }}
              />
            </Grid>
          </Grid>
        ))}

        <Link
          component="button"
          variant="body2"
          onClick={addSupplement}
          sx={{
            mt: 1,
            color: '#1976d2',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          + add more
        </Link>
      </Card>

      {/* Signature */}
      <Card
        sx={{
          mb: 0,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: '#9e9e9e', mb: 0.5, display: 'block' }}
            >
              Patient/Guardian Signature:
            </Typography>
            <Box
              sx={{
                width: 240,
                height: 72,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
                bgcolor: '#fafafa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: '#bdbdbd' }}
              >
                {reviewedWithPatient ? 'Reviewed' : 'Signature'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          mt: 2,
          color: '#bdbdbd',
        }}
      >
        {risk?.asaClass ? `${risk.asaClass} · ` : ''}{risk?.level ? `Risk: ${risk.level}` : 'Medical history loaded from patient record'}
      </Typography>
    </PageContainer>
  );
};

export default PatientMedicalHistoryPage;
