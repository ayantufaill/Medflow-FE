import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AssignmentOutlined as HistoryTimelineIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import { useSnackbar } from "../../contexts/SnackbarContext";
import { useDentalHistory } from "../../hooks/redux/useDentalHistory";
import { usePatient } from "../../hooks/redux/usePatient";
import { usePatientAppointments } from "../../hooks/queries/usePatientAppointments";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import PatientSignatureCard from "../../components/patients/PatientSignatureCard";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import { DentalGeneralInfo, DentalHistorySummary, DentalHistoryFullView } from "../../components/dental-history";
import TaskList from "../../components/appointments/right-panel/TaskList";
import Messages from "../../components/appointments/right-panel/Messages";
import SectionCard from "../../components/shared/SectionCard";
import UnsavedChangesPrompt from "../../components/shared/UnsavedChangesPrompt";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

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

// Matches PatientMedicalHistoryPage's timeline date format ("Dec 08, 2025")
// so the History Timeline reads identically on both pages.
const formatVisitDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
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

  const { dentalHistory, loading, error, fetch, update } = useDentalHistory();
  const { currentPatient: patient, fetchById } = usePatient();
  const { data: patientAppointments = [] } = usePatientAppointments(patientId, 20);

  const [saving, setSaving] = useState(false);
  const [signature, setSignature] = useState(null);

  // History Timeline nodes — the patient's actual appointment history
  // (oldest to newest; backend returns most-recent-first), same source as
  // the Medical History page's timeline.
  const visitDates = useMemo(
    () =>
      [...patientAppointments]
        .reverse()
        .map((apt) => formatVisitDate(apt.date))
        .filter(Boolean),
    [patientAppointments],
  );

  // Local draft state to prevent UI freezing
  const [localGeneralInfo, setLocalGeneralInfo] = useState(EMPTY_HISTORY.generalInfo);
  const [localPersonalHistory, setLocalPersonalHistory] = useState([]);
  const [localGumAndBone, setLocalGumAndBone] = useState([]);
  const [localBiteAndJawJoint, setLocalBiteAndJawJoint] = useState([]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
        setSignature(data?.review?.signatureDataUrl || null);
      })
      .catch((err) => {
        if (err?.name === 'ConditionError') return;
        showSnackbar(typeof err === 'string' ? err : err?.message || "Failed to load dental history", "error");
      });
  }, [patientId, fetchById, fetch, showSnackbar]);

  const updateGeneralInfo = (field, value) => {
    setHasUnsavedChanges(true);
    setLocalGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updatePersonalHistory = (id, field, value) => {
    setHasUnsavedChanges(true);
    setLocalPersonalHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const updateGumAndBone = (id, field, value) => {
    setHasUnsavedChanges(true);
    setLocalGumAndBone((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const updateBiteAndJawJoint = (id, field, value) => {
    setHasUnsavedChanges(true);
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
      setHasUnsavedChanges(false);
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
      <UnsavedChangesPrompt when={hasUnsavedChanges} onSave={() => saveDentalHistory(false)} />
      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {!showContent ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Header — same rounded-card treatment as the Medical History /
              Patient Details pages, with this page's own action set. */}
          <Box
            sx={{
              mt: 1.5,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              px: 2.5,
              py: 2,
              backgroundColor: COLORS.SURFACE_CARD,
              borderRadius: radius.xl,
              border: `0.8px solid ${COLORS.BORDER}`,
            }}
          >
            <Box>
              <Typography sx={{ fontFamily: "Inter", fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY }}>
                Dental History
              </Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
                {patient?.firstName || ""} {patient?.lastName || ""} · DOB:{" "}
                {patient?.dateOfBirth ? formatDate(patient.dateOfBirth) : "N/A"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant={hasUnsavedChanges ? "contained" : "outlined"}
                  size="small"
                  startIcon={<RefreshIcon fontSize="small" />}
                  onClick={() => saveDentalHistory(false)}
                  sx={hasUnsavedChanges ? {
                    textTransform: "none",
                    fontFamily: "Inter",
                    fontWeight: fontWeight.semibold,
                    fontSize: fontSize.base,
                    borderRadius: radius.md,
                    backgroundColor: '#1d4ed8',
                    color: COLORS.WHITE,
                    boxShadow: "none",
                    "&:hover": { backgroundColor: '#1e40af' },
                  } : {
                    textTransform: "none",
                    fontFamily: "Inter",
                    fontWeight: fontWeight.semibold,
                    fontSize: fontSize.base,
                    borderRadius: radius.md,
                    borderColor: COLORS.BORDER,
                    color: COLORS.TEXT_BODY,
                    backgroundColor: COLORS.SURFACE_CARD,
                    boxShadow: "none",
                    "&:hover": { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED },
                  }}
                >
                  Update Hx
                </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<CheckIcon fontSize="small" />}
                disabled={saving}
                onClick={() => saveDentalHistory(true)}
                sx={{
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: fontWeight.semibold,
                  fontSize: fontSize.base,
                  borderRadius: radius.md,
                  boxShadow: "none",
                  backgroundColor: COLORS.STATUS_SUCCESS,
                  "&:hover": { backgroundColor: COLORS.STATUS_SUCCESS, opacity: 0.9 },
                }}
              >
                Reviewed With Patient
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PrintIcon fontSize="small" />}
                onClick={handlePrint}
                sx={{
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: fontWeight.semibold,
                  fontSize: fontSize.base,
                  borderRadius: radius.md,
                  borderColor: COLORS.BORDER,
                  color: COLORS.TEXT_BODY,
                  backgroundColor: COLORS.SURFACE_CARD,
                  boxShadow: "none",
                  "&:hover": { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED },
                }}
              >
                Print
              </Button>
            </Box>
          </Box>

          {/* Main column and sidebar share one grid so the sidebar sits
              alongside the whole page, not just one section of it. History
              Timeline takes the main column's full width here — unlike
              Medical History, there's no Premedication card to share the
              row with. */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "3fr 1fr" }, gap: 2, alignItems: "start" }}>
            <Box sx={{ minWidth: 0 }}>
              <SectionCard icon={HistoryTimelineIcon} title="History Timeline">
                {visitDates.length ? (
                  <VisitDatesTimeline visitDates={visitDates} />
                ) : (
                  <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                    No appointment history recorded yet.
                  </Typography>
                )}
              </SectionCard>

              <DentalGeneralInfo
                info={localGeneralInfo}
                onChange={updateGeneralInfo}
              />

              <DentalHistorySummary
                personalHistory={localPersonalHistory}
                gumAndBone={localGumAndBone}
                biteAndJawJoint={localBiteAndJawJoint}
                onUpdateItem={handleUpdateItem}
              />


            </Box>

            {/* Sidebar — same Task List / Messages cards as the schedule
                operatory pages and the Medical History page, unmodified. */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
              <TaskList />
              <Messages />
              <PatientSignatureCard
                patient={patient}
                value={signature}
                onChange={setSignature}
                reviewedWithPatient={Boolean(dentalHistory?.reviewStatus)}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PatientDentalHistoryPage;