import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import { clinicalNoteService } from '../../services/clinical-note.service';
import { documentService } from '../../services/document.service';
import { getCachedPatient, setCachedPatient } from '../../utils/patientCache';
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';
import SignaturePad from '../../components/shared/SignaturePad';

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

const MOCK_VISIT_DATES = [
  'Feb 20, 2025',
  'Feb 25, 2025',
  'Apr 08, 2025',
  'Jun 17, 2025',
  'Sep 04, 2025',
];

const GENERAL_INFO = {
  healthEstimate: 'Good',
  physicianName: 'Chad Hogan, MD',
  lastExamDate: '02/20/2025',
  purpose: 'Routine checkup',
  weight: '132',
  weightUnit: 'LBS',
  height: '5.5',
  heightUnit: 'FT/IN',
  physicianSpecialty: 'Internal Medicine',
};

const MOCK_MEDICAL_HISTORY = {
  personalHistory: [
    { id: 1, question: 'Hospitalization for illness or injury', answer: 'No', note: 'Chad Hogen', additionalInfo: 'Hospitalized in 2022 for knee surgery. No complications; full recovery. Verify that previous hospitalization is consistent with any other "yes" answers in Medical History Form. If head and neck injury, concern for TMD co-morbidity for 1-3 years post-injury.' },
    { id: 2, question: 'Heart disease or heart attack', answer: 'Yes', note: '', additionalInfo: 'Assess cardiac risk before dental procedures. May require antibiotic prophylaxis or consultation with physician.' },
    { id: 3, question: 'High blood pressure', answer: 'Yes', note: '', additionalInfo: 'Monitor blood pressure at each visit. Some medications may cause dry mouth or gingival hyperplasia.' },
    { id: 4, question: 'Diabetes', answer: 'No', note: '', additionalInfo: 'Diabetic patients may have delayed wound healing and increased risk of infection. Monitor glycemic control.' },
    { id: 5, question: 'Asthma or breathing problems', answer: 'Yes', note: '', additionalInfo: 'Avoid aspirin if asthma is aspirin-sensitive. Consider stress reduction techniques for anxious patients.' },
    { id: 6, question: 'Taking any of the following Supplements', answer: 'Yes', note: '', additionalInfo: 'Taking dietary supplements, vitamins, and/or probiotics. Risk factor for sleep disorder if medication was for weight loss. Vitamin C, iron tonic, and amino-acid supplements have been implicated in Bohar Maes...' },
  ],
};

const INITIAL_MEDICATIONS = [
  { id: 1, drug: 'Lisinopril', dosage: '10 mg', purpose: 'Blood pressure' },
  { id: 2, drug: 'Metformin', dosage: '500 mg', purpose: 'Type 2 diabetes' },
  { id: 3, drug: 'Atorvastatin', dosage: '20 mg', purpose: 'Cholesterol' },
];

const INITIAL_SUPPLEMENTS = [
  { id: 1, drug: 'Vitamin D3', dosage: '1000 IU', purpose: 'Bone health' },
  { id: 2, drug: 'Omega-3', dosage: '1000 mg', purpose: 'Heart health' },
  { id: 3, drug: 'Multivitamin', dosage: '1 tab', purpose: 'General wellness' },
];

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
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [supplements, setSupplements] = useState(INITIAL_SUPPLEMENTS);
  const [visitDates, setVisitDates] = useState([]); // from backend medical history timeline
  const [generalInfo, setGeneralInfo] = useState({ ...GENERAL_INFO });
  const [premed, setPremed] = useState('no');
  const [signature, setSignature] = useState(null);

  const updateGeneralInfo = (field, value) => {
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

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
    const cached = getCachedPatient(patientId);
    if (cached) {
      setPatient(cached);
      setLoading(false);
    }

    const fetchData = async () => {
      try {
        if (!cached) setLoading(true);
        setError('');
        const [patientData, medicalHistory] = await Promise.all([
          patientService.getPatientById(patientId),
          clinicalNoteService.getPatientMedicalHistory(patientId).catch(() => null),
        ]);
        if (!cancelled) {
          setPatient(patientData);
          setCachedPatient(patientId, patientData);
        }

        if (!cancelled && medicalHistory?.timeline?.length) {
          const dateStrings = medicalHistory.timeline
            .map((t) => t.date)
            .filter((d) => d && !isNaN(new Date(d).getTime()))
            .map((d) => new Date(d).toISOString().split('T')[0]);
          const uniqueDates = [...new Set(dateStrings)];
          uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          setVisitDates(uniqueDates.map((d) => formatVisitDate(d)));
        } else if (!cancelled) {
          setVisitDates(MOCK_VISIT_DATES);
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

  const dobText = patient?.dateOfBirth
    ? `DOB: ${formatDate(patient.dateOfBirth)}`
    : 'DOB: Mar 4, 2026';

  const [uploading, setUploading] = useState(false);

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

  const showContent = !loading || patient;

  return (
    <PageContainer>
      <PatientSectionTabs activeTab="medical" patientId={patientId} />
      {error ? (
        <Card sx={{ p: 2 }}>
          <Typography color="error">{error}</Typography>
        </Card>
      ) : !showContent ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
            <TextField
              fullWidth
              size="small"
              label="What is your estimate of your general health?"
              value={generalInfo.healthEstimate}
              onChange={(e) => updateGeneralInfo('healthEstimate', e.target.value)}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Physician Name"
              value={generalInfo.physicianName}
              onChange={(e) => updateGeneralInfo('physicianName', e.target.value)}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date of most recent physical examination"
              value={generalInfo.lastExamDate ? generalInfo.lastExamDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$1-$2') : ''}
              onChange={(e) => {
                const d = e.target.value;
                if (d) {
                  const [y, m, day] = d.split('-');
                  updateGeneralInfo('lastExamDate', `${m}/${day}/${y}`);
                } else {
                  updateGeneralInfo('lastExamDate', '');
                }
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Purpose"
              value={generalInfo.purpose}
              onChange={(e) => updateGeneralInfo('purpose', e.target.value)}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Weight"
              type="number"
              value={generalInfo.weight}
              onChange={(e) => updateGeneralInfo('weight', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                      {generalInfo.weightUnit}
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Height"
              type="number"
              value={generalInfo.height}
              onChange={(e) => updateGeneralInfo('height', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                      {generalInfo.heightUnit}
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Physician specialty"
              value={generalInfo.physicianSpecialty}
              onChange={(e) => updateGeneralInfo('physicianSpecialty', e.target.value)}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
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
                value={premed}
                onChange={(e) => setPremed(e.target.value)}
                sx={{
                  '& .MuiFormControlLabel-root': { mr: 2 },
                  '& .MuiTypography-root': { fontSize: 14 },
                }}
              >
                <FormControlLabel
                  value="premed"
                  control={<Radio size="small" />}
                  label="Premed"
                />
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
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 1,
                border: '1px solid #e0e0e0',
                bgcolor: '#ffffff',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#fafafa' }}>
                    <TableCell sx={{ width: '55%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#616161' }}>Personal History</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography variant="caption">🟢 Low</Typography>
                          <Typography variant="caption">🟡 Moderate</Typography>
                          <Typography variant="caption">🔴 High</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: '10%' }} align="center" />
                    <TableCell sx={{ width: '35%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#616161' }}>
                        Additional information
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_MEDICAL_HISTORY.personalHistory.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        borderBottom: '2px solid #e0e0e0',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#424242' }}>
                          {item.id}. {item.question}
                        </Typography>
                        {item.scale && (
                          <Typography variant="caption" sx={{ display: 'block', color: '#9e9e9e', mt: 0.5 }}>
                            on a scale of 1 to 10: {item.scale}
                          </Typography>
                        )}
                        {item.note && (
                          <Typography variant="caption" display="block" sx={{ color: '#9e9e9e', mt: 0.5 }}>
                            Doctor&apos;s Note: {item.note}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#43a047',
                          }}
                        >
                          {item.answer}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          background: '#f5f5f5',
                          maxHeight: 120,
                          overflow: 'auto',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#616161' }}>
                          {item.additionalInfo}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}

        {historyTab === 1 && (
          <Typography
            variant="body2"
            sx={{ color: '#9e9e9e' }}
          >
            Full Medical History — all questions and answers will appear here.
          </Typography>
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

        {medications.map((row) => (
          <Grid
            key={row.id}
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
                onChange={(e) => updateMedication(row.id, 'drug', e.target.value)}
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
                onChange={(e) => updateMedication(row.id, 'dosage', e.target.value)}
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
                onChange={(e) => updateMedication(row.id, 'purpose', e.target.value)}
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

        {supplements.map((row) => (
          <Grid
            key={row.id}
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
                onChange={(e) => updateSupplement(row.id, 'drug', e.target.value)}
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
                onChange={(e) => updateSupplement(row.id, 'dosage', e.target.value)}
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
                onChange={(e) => updateSupplement(row.id, 'purpose', e.target.value)}
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
      <Card sx={{ mb: 0 }}>
        <Typography
          variant="caption"
          sx={{ color: '#757575', mb: 0.5, display: 'block' }}
        >
          Patient/Guardian Signature:
        </Typography>
        <SignaturePad
          width={320}
          height={80}
          value={signature}
          onChange={setSignature}
          showClearButton
          sx={{ mt: 0.5 }}
        />
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
        Layout only — hook this form up to your medical history data when ready.
      </Typography>
        </>
      )}
    </PageContainer>
  );
};

export default PatientMedicalHistoryPage;
