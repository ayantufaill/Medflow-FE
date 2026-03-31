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
} from "@mui/material";
import {
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import { patientService } from "../../services/patient.service";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import PatientSignatureSection from "../../components/patients/PatientSignatureSection";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import { DentalGeneralInfo, DentalHistorySummary, DentalHistoryFullView } from "../../components/dental-history";
import { useSnackbar } from "../../contexts/SnackbarContext";

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

const PatientDentalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState("");
  const [dentalHistory, setDentalHistory] = useState(EMPTY_HISTORY);
  const [visitDates, setVisitDates] = useState([]);
  const [signature, setSignature] = useState(null);

  const fetchDentalHistory = async (cancelled = false) => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getDentalHistory(patientId);
      if (cancelled) return;
      setPatient(data?.patient || null);
      setDentalHistory({
        generalInfo: {
          ...EMPTY_HISTORY.generalInfo,
          ...(data?.generalInfo || {}),
        },
        personalHistory: Array.isArray(data?.personalHistory) ? data.personalHistory : [],
        gumAndBone: Array.isArray(data?.gumAndBone) ? data.gumAndBone : [],
        biteAndJawJoint: Array.isArray(data?.biteAndJawJoint) ? data.biteAndJawJoint : [],
        reviewStatus: Boolean(data?.reviewStatus),
        lastUpdateDate: data?.lastUpdateDate || null,
        review: {
          ...EMPTY_HISTORY.review,
          ...(data?.review || {}),
        },
        visitDates: Array.isArray(data?.visitDates) ? data.visitDates : [],
      });
      
      // Process visitDates the same way as medical history
      const labels = Array.isArray(data?.visitDates)
        ? data.visitDates
            .map((item, index) => {
              // Handle both string dates and objects with date/label properties
              const dateStr = typeof item === 'string' ? item : item?.date;
              const existingLabel = typeof item === 'object' ? item?.label : null;
              
              // If there's already a formatted label, use it
              if (existingLabel) {
                return existingLabel;
              }
              
              // Log for debugging
              if (!dateStr || dateStr === "" || dateStr === null) {
                console.warn(`Visit date at index ${index} is empty or null:`, item);
                return null;
              }
              
              const formatted = formatDate(dateStr);
              if (!formatted) {
                console.warn(`Failed to format visit date at index ${index}:`, item);
              }
              // Only include valid formatted dates
              return formatted || null;
            })
            .filter(Boolean)
        : [];
      
      // TEMPORARY: Add mock dates for testing if no data from backend
      const testDates = labels.length > 0 ? labels : [
        'Jan 15, 2025',
        'Feb 20, 2025',
        'Mar 10, 2025',
      ];
      setVisitDates(testDates);
      
      setSignature(data?.review?.signatureDataUrl || null);
    } catch (err) {
      if (cancelled) return;
      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to load dental history"
      );
      setPatient(null);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchDentalHistory(cancelled);
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const updateGeneralInfo = (field, value) => {
    setDentalHistory((prev) => ({
      ...prev,
      generalInfo: { ...prev.generalInfo, [field]: value },
    }));
  };

  const updatePersonalHistory = (id, field, value) => {
    setDentalHistory((prev) => ({
      ...prev,
      personalHistory: prev.personalHistory.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateGumAndBone = (id, field, value) => {
    setDentalHistory((prev) => ({
      ...prev,
      gumAndBone: prev.gumAndBone.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateBiteAndJawJoint = (id, field, value) => {
    setDentalHistory((prev) => ({
      ...prev,
      biteAndJawJoint: prev.biteAndJawJoint.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const dentalGroups = groupDentalHistoryRows(dentalHistory.personalHistory);
  const gumAndBoneGroups = groupDentalHistoryRows(dentalHistory.gumAndBone);
  const biteAndJawJointGroups = groupDentalHistoryRows(dentalHistory.biteAndJawJoint);

  const saveDentalHistory = async (reviewedWithPatient = false) => {
    if (!patientId) return;
    try {
      setSaving(true);
      const review = reviewedWithPatient
        ? {
            ...(dentalHistory.review || {}),
            reviewedWithPatient: true,
            reviewedAt: new Date().toISOString(),
            signatureDataUrl: signature || dentalHistory.review?.signatureDataUrl || null,
          }
        : {
            ...(dentalHistory.review || {}),
            signatureDataUrl: signature || dentalHistory.review?.signatureDataUrl || null,
          };

      const data = await patientService.updateDentalHistory(patientId, {
        generalInfo: dentalHistory.generalInfo,
        personalHistory: dentalHistory.personalHistory,
        gumAndBone: dentalHistory.gumAndBone,
        biteAndJawJoint: dentalHistory.biteAndJawJoint,
        review,
      });

      setPatient(data?.patient || null);
      setDentalHistory({
        generalInfo: {
          ...EMPTY_HISTORY.generalInfo,
          ...(data?.generalInfo || {}),
        },
        personalHistory: Array.isArray(data?.personalHistory) ? data.personalHistory : [],
        gumAndBone: Array.isArray(data?.gumAndBone) ? data.gumAndBone : [],
        biteAndJawJoint: Array.isArray(data?.biteAndJawJoint) ? data.biteAndJawJoint : [],
        reviewStatus: Boolean(data?.reviewStatus),
        lastUpdateDate: data?.lastUpdateDate || null,
        review: {
          ...EMPTY_HISTORY.review,
          ...(data?.review || {}),
        },
        visitDates: Array.isArray(data?.visitDates) ? data.visitDates : [],
      });
      setVisitDates(Array.isArray(data?.visitDates) ? data.visitDates : []);
      setSignature(data?.review?.signatureDataUrl || signature || null);
      showSnackbar(reviewedWithPatient ? "Dental history reviewed" : "Dental history updated", "success");
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to update dental history",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const showContent = !loading || patient;

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
              info={dentalHistory.generalInfo} 
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
              personalHistory={dentalHistory.personalHistory}
              gumAndBone={dentalHistory.gumAndBone}
              biteAndJawJoint={dentalHistory.biteAndJawJoint}
              onUpdateItem={handleUpdateItem}
            />
          )}

          {tabValue === 1 && (
            <DentalHistoryFullView
              groupedHistory={dentalGroups}
              gumAndBoneGrouped={gumAndBoneGroups}
              biteAndJawJointGrouped={biteAndJawJointGroups}
              onUpdateItem={handleUpdateItem}
            />
          )}

          <Box sx={{ mt: 2 }}>
            <PatientSignatureSection
              value={signature}
              onChange={setSignature}
              reviewedWithPatient={dentalHistory.reviewStatus}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default PatientDentalHistoryPage;