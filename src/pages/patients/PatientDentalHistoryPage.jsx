import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { patientService } from "../../services/patient.service";
import { getCachedPatient, setCachedPatient } from "../../utils/patientCache";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import SignaturePad from "../../components/shared/SignaturePad";

const MOCK_DENTAL_HISTORY = {
  generalInfo: {
    mouthCondition: "good",
    previousDentist: "Dr. John Smith",
    recentExamDate: "2020-01-15",
    recentTreatmentDate: "2019-11-20",
    immediateConcern: "General checkup",
    patientSince: "5 years",
    recentXrayDate: "2020-02-01",
    dentistVisitFrequency: "6mo",
  },

  personalHistory: [
    {
      id: 1,
      question: "Are you fearful of dental treatment?",
      answer: "Yes",
      scale: 5,
      note: "patient anxiety",
      additionalInfo:
        "The scale represents a Visual Analog Scale (VAS). A number higher than 8 represents a higher probability that perceived prognosis will be lower. These patients are more likely to complain about post-operative discomfort.",
    },
    {
      id: 2,
      question: "Have you had an unfavorable dental experience?",
      answer: "Yes",
      note: "",
      additionalInfo:
        "Ensure the incident is acknowledged and not repeated. 'We are more often frightened than hurt.'",
    },
    {
      id: 3,
      question: "Have you ever had complications from past dental treatment?",
      answer: "Yes",
      note: "",
      additionalInfo:
        "List problems such as pain management, TMD, or sensitivity following treatment.",
    },
    {
      id: 4,
      question: "Do you grind or clench your teeth?",
      answer: "No",
      note: "",
      additionalInfo:
        "Bruxism can cause tooth wear, fractures, and TMJ problems.",
    },
    {
      id: 5,
      question: "Have you had any oral surgery?",
      answer: "Yes",
      note: "Wisdom teeth extraction 2018",
      additionalInfo: "Note type of surgery, date and complications.",
    },
    {
      id: 6,
      question:
        "Have you had any teeth removed or missing teeth due to trauma?",
      answer: "Yes",
      note: "Gum disease",
      additionalInfo:
        "Note which teeth and reason for removal.",
    },
  ],

  reviewStatus: false,
  lastUpdateDate: "Mar 26, 2020",
};

const MOCK_VISIT_DATES = [
  "Feb 20, 2025",
  "Feb 25, 2025",
  "Apr 08, 2025",
  "Jun 17, 2025",
  "Sep 04, 2025",
];

const PatientDentalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [dentalHistory, setDentalHistory] = useState(MOCK_DENTAL_HISTORY);
  const [visitDates, setVisitDates] = useState(MOCK_VISIT_DATES);
  const [signature, setSignature] = useState(null);

  const updateGeneralInfo = (field, value) => {
    setDentalHistory((prev) => ({
      ...prev,
      generalInfo: { ...prev.generalInfo, [field]: value },
    }));
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
        const patientData = await patientService.getPatientById(patientId);
        if (!cancelled) {
          setPatient(patientData);
          setCachedPatient(patientId, patientData);
        }
      } catch {
        if (!cancelled) setPatient(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const showContent = !loading || patient;

  return (
    <Box
      sx={{
        bgcolor: '#f5f5f5',
        minHeight: '100%',
        pb: 4,
        position: 'relative',
      }}
    >
      <PatientSectionTabs activeTab="dental" patientId={patientId} />
      {!showContent ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
      {/* HEADER */}

      <Box
        sx={{
          mt: 1.5,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: '#424242', fontSize: '1.1rem' }}
            >
              Dental History
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#757575', mt: 0.25 }}
            >
              {patient?.firstName || ''} {patient?.lastName || ''} · DOB: {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
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

      {/* Timeline – visit dates */}
      <Paper
        variant="outlined"
        sx={{
          py: 1.5,
          px: 2,
          mb: 2,
          borderRadius: 1,
          border: "1px solid #e0e0e0",
          bgcolor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {visitDates.map((label, index) => {
            const isLast = index === visitDates.length - 1;
            return (
              <Box
                key={`${label}-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: isLast ? 14 : 10,
                    height: isLast ? 14 : 10,
                    borderRadius: "50%",
                    bgcolor: isLast ? "#1976d2" : "#bdbdbd",
                  }}
                />
                <Typography variant="body2" sx={{ color: "#757575" }}>
                  {label}
                </Typography>
                {isLast && (
                  <CloseIcon
                    sx={{ fontSize: 14, color: "#e53935", cursor: "pointer" }}
                    onClick={() =>
                      setVisitDates((prev) => prev.slice(0, -1))
                    }
                  />
                )}
              </Box>
            );
          })}
          {visitDates.length === 0 && (
            <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
              No visit dates from dental history
            </Typography>
          )}
        </Box>
      </Paper>

      {/* GENERAL INFORMATION */}

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          bgcolor: '#ffffff',
        }}
      >

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
              label="How would you rate the condition of your mouth?"
              value={dentalHistory.generalInfo.mouthCondition}
              onChange={(e) => updateGeneralInfo('mouthCondition', e.target.value)}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Previous Dentist"
              value={dentalHistory.generalInfo.previousDentist}
              onChange={(e) => updateGeneralInfo('previousDentist', e.target.value)}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Date of most recent dental exam"
              value={dentalHistory.generalInfo.recentExamDate || ''}
              onChange={(e) => updateGeneralInfo('recentExamDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Recent treatment date"
              value={dentalHistory.generalInfo.recentTreatmentDate || ''}
              onChange={(e) => updateGeneralInfo('recentTreatmentDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Immediate concern"
              value={dentalHistory.generalInfo.immediateConcern}
              onChange={(e) => updateGeneralInfo('immediateConcern', e.target.value)}
              sx={{ '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiInputBase-input': { fontSize: 13 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Patient since"
              value={dentalHistory.generalInfo.patientSince}
              onChange={(e) => updateGeneralInfo('patientSince', e.target.value)}
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
                I routinely see my dentist every:
              </Typography>
              <RadioGroup
                row
                value={dentalHistory.generalInfo.dentistVisitFrequency}
                onChange={(e) => updateGeneralInfo('dentistVisitFrequency', e.target.value)}
                sx={{
                  '& .MuiFormControlLabel-root': { mr: 2 },
                  '& .MuiTypography-root': { fontSize: 14 },
                }}
              >
                <FormControlLabel
                  value="3mo"
                  control={<Radio size="small" />}
                  label="3 Mo."
                />
                <FormControlLabel
                  value="4mo"
                  control={<Radio size="small" />}
                  label="4 Mo."
                />
                <FormControlLabel
                  value="6mo"
                  control={<Radio size="small" />}
                  label="6 Mo."
                />
                <FormControlLabel
                  value="12mo"
                  control={<Radio size="small" />}
                  label="12 Mo."
                />
                <FormControlLabel
                  value="not"
                  control={<Radio size="small" />}
                  label="Not routinely"
                />
              </RadioGroup>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">
            Date of this medical history update: {dentalHistory.lastUpdateDate}
          </Typography>

          {dentalHistory.reviewStatus && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon color="success" />
              <Typography variant="caption">
                Reviewed with patient
              </Typography>
            </Box>
          )}
        </Box>

      </Paper>

      {/* TABS */}

      <Paper
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          bgcolor: '#ffffff',
        }}
      >
        <Box sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
          <Tabs
         value={tabValue}
            onChange={(e, v) => setTabValue(v)}
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
              label="Full Dental History"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                minHeight: 40,
              }}
            />
          </Tabs>
        </Box>
      </Paper>

      {/* SUMMARY */}

      {tabValue === 0 && (

        <Box>


          {/* TABLE */}

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
                <TableRow sx={{ background: "#fafafa" }}>
                  <TableCell sx={{ width: "55%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#616161' }}>Personal History</Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="caption">🟢 Low</Typography>
                        <Typography variant="caption">🟡 Moderate</Typography>
                        <Typography variant="caption">🔴 High</Typography>
                      </Box>
                    </Box>
                  </TableCell>
              
                  <TableCell sx={{ width: "10%" }} align="center">
                  </TableCell>
              
                  <TableCell sx={{ width: "35%" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#616161' }}>
                      Additional information
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>

                {dentalHistory.personalHistory.map((item) => (

                  <TableRow
                    key={item.id}
                    sx={{
                      borderBottom: "2px solid #e0e0e0",
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
                          Doctor's Note: {item.note}
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
                        background: "#f5f5f5",
                        maxHeight: 120,
                        overflow: "auto",
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

      {tabValue === 1 && (
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Typography color="text.secondary">
            Full dental history will appear here
          </Typography>
        </Box>
      )}

      {/* Signature */}
      <Box sx={{ mt: 2 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 0,
            borderRadius: 1,
            border: '1px solid #e0e0e0',
            bgcolor: '#ffffff',
          }}
        >
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
        </Paper>
      </Box>

        </>
      )}
    </Box>
  );
};

export default PatientDentalHistoryPage;