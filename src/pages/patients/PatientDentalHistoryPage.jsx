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
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import {
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import { useSnackbar } from "../../contexts/SnackbarContext";
import { useDentalHistory } from "../../hooks/redux/useDentalHistory";
import { usePatient } from "../../hooks/redux/usePatient";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import PatientSignatureSection from "../../components/patients/PatientSignatureSection";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import { DentalGeneralInfo, DentalHistorySummary, DentalHistoryFullView } from "../../components/dental-history";

const EMPTY_HISTORY = {
  generalInfo: {
    mouthCondition: "",
    previousDentist: "",
    recentExamDate: "",
    recentTreatmentDate: "",
    immediateConcern: "",
    patientSince: "",
    recentXrayDate: "",
    dentistVisitFrequency: "6mo",
  },
  personalHistory: [],
  gumAndBone: [],
  biteAndJawJoint: [],
  reviewStatus: false,
  lastUpdateDate: null,
  review: {
    reviewedWithPatient: false,
    reviewedAt: null,
    signatureDataUrl: null,
  },
  visitDates: [],
};

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const dateInputValue = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const groupDentalHistoryRows = (rows = []) => {
  const grouped = new Map();
  rows.forEach((item) => {
    const key = item?.group || "General";
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(item);
  });
  return Array.from(grouped.entries());
};

const PersonalHistoryForm = () => {
  // Styles for the header risk indicators
  const riskLevels = [
    { label: 'Low', color: '#4caf50' },
    { label: 'Moderate', color: '#ffeb3b' },
    { label: 'High', color: '#f44336' },
  ];

  const QuestionRow = ({ number, question, children }) => (
    <Box sx={{ py: 2 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#424242', minWidth: '25px' }}>
          {number}.
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#424242', mb: 1 }}>
            {question}
          </Typography>
          {children}
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" sx={{ color: '#999' }} />
          </IconButton>
          <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic' }}>
            not answered
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  return (
    <Box sx={{ width: '100%', p: 3, bgcolor: '#fff' }}>
      {/* Header Section */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#616161', textTransform: 'uppercase' }}>
          PERSONAL HISTORY
        </Typography>
        {riskLevels.map((risk) => (
          <Stack key={risk.label} direction="row" alignItems="center" spacing={0.5}>
            <CircleIcon sx={{ color: risk.color, fontSize: 14 }} variant="outline" />
            <Typography variant="caption" sx={{ color: '#666' }}>{risk.label}</Typography>
          </Stack>
        ))}
      </Stack>
      <Divider sx={{ mb: 2, height: 2, bgcolor: '#1976d2' }} />

      {/* Question 1 */}
      <QuestionRow number={1} question="Are you fearful of dental treatment?">
        <Typography variant="body2" sx={{ color: '#666' }}>
          on a scale of 1 (least) to 10 (most):
        </Typography>
        {/* You could add a Slider or RadioGroup here */}
      </QuestionRow>

      {/* Question 2 */}
      <QuestionRow number={2} question="Have you had an unfavorable dental experience?" />

      {/* Question 3 */}
      <QuestionRow number={3} question="Have you ever had complications from past dental treatment?" />

      {/* Question 4 */}
      <QuestionRow number={4} question="Have you ever had trouble getting numb or had any reactions to local anesthetic?" />

      {/* Question 5 */}
      <QuestionRow 
        number={5} 
        question="Did you ever have braces, orthodontic treatment or had your bite adjusted, and at what age?"
      >
        <RadioGroup sx={{ mt: 1 }}>
          <FormControlLabel 
            value="before16" 
            control={<Radio size="small" />} 
            label="Before 16 years old" 
            slotProps={{ typography: { variant: 'body2', sx: { color: '#666' } } }}
          />
          <FormControlLabel 
            value="after16" 
            control={<Radio size="small" />} 
            label="After 16 years old" 
            slotProps={{ typography: { variant: 'body2', sx: { color: '#666' } } }}
          />
          <FormControlLabel 
            value="both" 
            control={<Radio size="small" />} 
            label="Both" 
            slotProps={{ typography: { variant: 'body2', sx: { color: '#666' } } }}
          />
        </RadioGroup>
      </QuestionRow>

      {/* Question 6 */}
      <QuestionRow 
        number={6} 
        question="Have you had any teeth removed, missing teeth that never developed, or lost teeth due to injury or facial trauma?"
      >
        <Stack spacing={0.5} sx={{ mt: 1, pl: 1 }}>
          {[
            'Gum (periodontal) disease', 'Teeth that never developed', 'Wisdom teeth',
            'Crowding or Lack Of Space', 'Dental caries - non-restorative', 'Infection', 'Fracture or crack'
          ].map((text) => (
            <Typography key={text} variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>{text}</Typography>
          ))}
          <Typography variant="body2" sx={{ color: 'green', fontWeight: 'bold', cursor: 'pointer', mt: 1, fontSize: '0.85rem' }}>
            Edit
          </Typography>
        </Stack>
      </QuestionRow>
    </Box>
  );
};

const PatientDentalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();

  const { dentalHistory, loading, error, fetch, update } = useDentalHistory();
  const { currentPatient: patient, fetchById } = usePatient();

  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [visitDates, setVisitDates] = useState([]);
  const [signature, setSignature] = useState(null);

  // Local draft state to prevent UI freezing
  const [localGeneralInfo, setLocalGeneralInfo] = useState(EMPTY_HISTORY.generalInfo);
  const [localPersonalHistory, setLocalPersonalHistory] = useState([]);
  const [localGumAndBone, setLocalGumAndBone] = useState([]);
  const [localBiteAndJawJoint, setLocalBiteAndJawJoint] = useState([]);

  // isActuallyLoading flag like Medical History
  const isActuallyLoading = loading || (!dentalHistory && !error);

  useEffect(() => {
    if (!patientId) return;
    
    // Fetch both concurrently
    fetchById(patientId);

    fetch(patientId).unwrap()
      .then((data) => {
        // Initialize local drafting state with fetched data or empty defaults
        setLocalGeneralInfo({
          ...EMPTY_HISTORY.generalInfo,
          ...(data?.generalInfo || {}),
        });
        setLocalPersonalHistory(Array.isArray(data?.personalHistory) ? data.personalHistory : []);
        setLocalGumAndBone(Array.isArray(data?.gumAndBone) ? data.gumAndBone : []);
        setLocalBiteAndJawJoint(Array.isArray(data?.biteAndJawJoint) ? data.biteAndJawJoint : []);
        
        // Process visitDates
        const labels = Array.isArray(data?.visitDates)
          ? data.visitDates
              .map((item, index) => {
                const dateStr = typeof item === 'string' ? item : item?.date;
                const existingLabel = typeof item === 'object' ? item?.label : null;
                if (existingLabel) return existingLabel;
                if (!dateStr || dateStr === "" || dateStr === null) return null;
                const formatted = formatDate(dateStr);
                return formatted || null;
              })
              .filter(Boolean)
          : [];

        // Fallback to today's date if no visit dates exist so the timeline doesn't disappear
        const fallbackDates = labels.length > 0 ? labels : [
          formatDate(new Date())
        ];
        
        setVisitDates(fallbackDates);
        setSignature(data?.review?.signatureDataUrl || null);
      })
      .catch((err) => {
        if (err?.name === 'ConditionError') return;
        showSnackbar(typeof err === 'string' ? err : err?.message || "Failed to load dental history", "error");
      });
  }, [patientId, fetchById, fetch, showSnackbar]);

  const updateGeneralInfo = (field, value) => {
    setLocalGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updatePersonalHistory = (id, field, value) => {
    setLocalPersonalHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const updateGumAndBone = (id, field, value) => {
    setLocalGumAndBone((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const updateBiteAndJawJoint = (id, field, value) => {
    setLocalBiteAndJawJoint((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };



  const saveDentalHistory = async (reviewedWithPatient = false) => {
    if (!patientId) return;
    try {
      setSaving(true);
      const review = reviewedWithPatient
        ? {
            ...(dentalHistory?.review || {}),
            reviewedWithPatient: true,
            reviewedAt: new Date().toISOString(),
            signatureDataUrl: signature || dentalHistory?.review?.signatureDataUrl || null,
          }
        : {
            ...(dentalHistory?.review || {}),
            signatureDataUrl: signature || dentalHistory?.review?.signatureDataUrl || null,
          };

      const data = await update(patientId, {
        generalInfo: localGeneralInfo,
        personalHistory: localPersonalHistory,
        gumAndBone: localGumAndBone,
        biteAndJawJoint: localBiteAndJawJoint,
        review,
      }).unwrap();

      setLocalGeneralInfo({
        ...EMPTY_HISTORY.generalInfo,
        ...(data?.generalInfo || {}),
      });
      setLocalPersonalHistory(Array.isArray(data?.personalHistory) ? data.personalHistory : []);
      setLocalGumAndBone(Array.isArray(data?.gumAndBone) ? data.gumAndBone : []);
      setLocalBiteAndJawJoint(Array.isArray(data?.biteAndJawJoint) ? data.biteAndJawJoint : []);
      
      setSignature(data?.review?.signatureDataUrl || signature || null);
      showSnackbar(reviewedWithPatient ? "Dental history reviewed" : "Dental history updated", "success");
    } catch (err) {
      showSnackbar(typeof err === 'string' ? err : err?.message || "Failed to update dental history", "error");
    } finally {
      setSaving(false);
    }
  };

  const showContent = !isActuallyLoading || patient;

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateItem = (section, id, field, value) => {
    if (section === 'personalHistory') {
      updatePersonalHistory(id, field, value);
    } else if (section === 'gumAndBone') {
      updateGumAndBone(id, field, value);
    } else if (section === 'biteAndJawJoint') {
      updateBiteAndJawJoint(id, field, value);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100%",
        pb: 4,
        position: "relative",
      }}
    >
      <PatientSectionTabs activeTab="dental" patientId={patientId} />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {!showContent ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                  sx={{ fontWeight: 700, color: "#424242", fontSize: "1.1rem" }}
                >
                  Dental History
                </Typography>
                <Typography variant="body2" sx={{ color: "#757575", mt: 0.25 }}>
                  {patient?.firstName || ""} {patient?.lastName || ""} · DOB:{" "}
                  {patient?.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="small"
                disabled={saving}
                onClick={() => saveDentalHistory(false)}
                sx={{
                  textTransform: "none",
                  borderRadius: 1,
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
              >
                <RefreshIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Update Hx
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<CheckIcon />}
                disabled={saving}
                onClick={() => saveDentalHistory(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: 1,
                  bgcolor: "#43a047",
                  "&:hover": { bgcolor: "#388e3c" },
                }}
              >
                Reviewed With Patient
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                sx={{
                  textTransform: "none",
                  borderRadius: 1,
                  borderColor: "#9e9e9e",
                  color: "#616161",
                  "&:hover": { borderColor: "#616161" },
                }}
              >
                Print
              </Button>
            </Box>
          </Box>

          <VisitDatesTimeline 
            visitDates={visitDates}
            onRemoveDate={(index) => setVisitDates((prev) => prev.slice(0, index).concat(prev.slice(index + 1)))}
          />

          <Paper
            variant="outlined"
            sx={{
              p: 0,
              mb: 2,
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              bgcolor: "#ffffff",
            }}
          >
            <DentalGeneralInfo 
              info={localGeneralInfo} 
              onChange={updateGeneralInfo} 
            />
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} TabIndicatorProps={{ style: { height: 3 } }}>
                <Tab label="Summary" sx={{ textTransform: "none", fontWeight: 600, fontSize: 14, minHeight: 40 }} />
                <Tab label="Full Dental History" sx={{ textTransform: "none", fontWeight: 600, fontSize: 14, minHeight: 40 }} />
              </Tabs>
            </Box>
          </Paper>

          {tabValue === 0 && (
            <DentalHistorySummary
              personalHistory={localPersonalHistory}
              gumAndBone={localGumAndBone}
              biteAndJawJoint={localBiteAndJawJoint}
              onUpdateItem={handleUpdateItem}
            />
          )}

          {tabValue === 1 && (
            <PersonalHistoryForm />
          )}

          <Box sx={{ mt: 2 }}>
            <PatientSignatureSection
              value={signature}
              onChange={setSignature}
              reviewedWithPatient={Boolean(dentalHistory?.reviewStatus)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default PatientDentalHistoryPage;