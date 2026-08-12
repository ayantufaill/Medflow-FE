import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
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
import medflowLogo from "../../assets/medflow-logo.png";
import PatientSignatureCard from "../../components/patients/PatientSignatureCard";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import {
  DentalGeneralInfo,
  DentalHistorySummaryTab,
  DentalHistoryFullView,
} from "../../components/dental-history";
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
  toothStructure: [],
  smileCharacteristics: [],
  sectionSummaries: {},
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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
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

  const { dentalHistory, loading, error, fetch, update } = useDentalHistory();
  const { currentPatient: patient, fetchById } = usePatient();
  const { data: patientAppointments = [] } = usePatientAppointments(
    patientId,
    20,
  );

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
  const [localGeneralInfo, setLocalGeneralInfo] = useState(
    EMPTY_HISTORY.generalInfo,
  );
  const [localPersonalHistory, setLocalPersonalHistory] = useState([]);
  const [localGumAndBone, setLocalGumAndBone] = useState([]);
  const [localBiteAndJawJoint, setLocalBiteAndJawJoint] = useState([]);
  const [localToothStructure, setLocalToothStructure] = useState([]);
  const [localSmileCharacteristics, setLocalSmileCharacteristics] = useState(
    [],
  );
  const [localSectionSummaries, setLocalSectionSummaries] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // isActuallyLoading flag like Medical History
  const isActuallyLoading = loading || (!dentalHistory && !error);

  useEffect(() => {
    if (!patientId) return;

    // Fetch both concurrently
    fetchById(patientId);

    fetch(patientId)
      .unwrap()
      .then((data) => {
        // Initialize local drafting state with fetched data or empty defaults
        setLocalGeneralInfo({
          ...EMPTY_HISTORY.generalInfo,
          ...(data?.generalInfo || {}),
        });
        setLocalPersonalHistory(
          Array.isArray(data?.personalHistory) ? data.personalHistory : [],
        );
        setLocalGumAndBone(
          Array.isArray(data?.gumAndBone) ? data.gumAndBone : [],
        );
        setLocalBiteAndJawJoint(
          Array.isArray(data?.biteAndJawJoint) ? data.biteAndJawJoint : [],
        );
        setLocalToothStructure(
          Array.isArray(data?.toothStructure) ? data.toothStructure : [],
        );
        setLocalSmileCharacteristics(
          Array.isArray(data?.smileCharacteristics)
            ? data.smileCharacteristics
            : [],
        );
        setLocalSectionSummaries(data?.sectionSummaries || {});
        setSignature(data?.review?.signatureDataUrl || null);
      })
      .catch((err) => {
        if (err?.name === "ConditionError") return;
        showSnackbar(
          typeof err === "string"
            ? err
            : err?.message || "Failed to load dental history",
          "error",
        );
      });
  }, [patientId, fetchById, fetch, showSnackbar]);

  const updateGeneralInfo = (field, value) => {
    setHasUnsavedChanges(true);
    setLocalGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updatePersonalHistory = (id, field, value) => {
    setHasUnsavedChanges(true);
    setLocalPersonalHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const updateGumAndBone = (id, field, value) => {
    setHasUnsavedChanges(true);
    setLocalGumAndBone((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const updateBiteAndJawJoint = (id, field, value) => {
    setHasUnsavedChanges(true);
    setLocalBiteAndJawJoint((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const updateToothStructure = (id, field, value) => {
    setHasUnsavedChanges(true);
    setLocalToothStructure((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const updateSmileCharacteristics = (id, field, value) => {
    setHasUnsavedChanges(true);
    setLocalSmileCharacteristics((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleUpdateSectionSummary = (sectionKey, newData) => {
    setHasUnsavedChanges(true);
    setLocalSectionSummaries((prev) => ({
      ...prev,
      [sectionKey]: newData,
    }));
  };

  const markAllUnansweredAsNo = () => {
    setHasUnsavedChanges(true);

    const applyToItems = (items = []) =>
      items.map((item) => {
        const currentAnswer = (item.answer || "").toString().trim();
        const isUnanswered =
          currentAnswer === "" ||
          currentAnswer.toLowerCase() === "not answered";
        return isUnanswered ? { ...item, answer: "No" } : item;
      });

    const nextPersonalHistory = applyToItems(localPersonalHistory);
    const nextGumAndBone = applyToItems(localGumAndBone);
    const nextBiteAndJawJoint = applyToItems(localBiteAndJawJoint);
    const nextToothStructure = applyToItems(localToothStructure);
    const nextSmileCharacteristics = applyToItems(localSmileCharacteristics);

    setLocalPersonalHistory(nextPersonalHistory);
    setLocalGumAndBone(nextGumAndBone);
    setLocalBiteAndJawJoint(nextBiteAndJawJoint);
    setLocalToothStructure(nextToothStructure);
    setLocalSmileCharacteristics(nextSmileCharacteristics);

    saveDentalHistory(false, {
      personalHistory: nextPersonalHistory,
      gumAndBone: nextGumAndBone,
      biteAndJawJoint: nextBiteAndJawJoint,
      toothStructure: nextToothStructure,
      smileCharacteristics: nextSmileCharacteristics,
    });
  };

  const saveDentalHistory = async (
    reviewedWithPatient = false,
    overrideDraft = null,
  ) => {
    if (!patientId) return;
    try {
      setSaving(true);
      const review = reviewedWithPatient
        ? {
            ...(dentalHistory?.review || {}),
            reviewedWithPatient: true,
            reviewedAt: new Date().toISOString(),
            signatureDataUrl:
              signature || dentalHistory?.review?.signatureDataUrl || null,
          }
        : {
            ...(dentalHistory?.review || {}),
            signatureDataUrl:
              signature || dentalHistory?.review?.signatureDataUrl || null,
          };

      const data = await update(patientId, {
        generalInfo: localGeneralInfo,
        personalHistory: overrideDraft?.personalHistory ?? localPersonalHistory,
        gumAndBone: overrideDraft?.gumAndBone ?? localGumAndBone,
        biteAndJawJoint: overrideDraft?.biteAndJawJoint ?? localBiteAndJawJoint,
        toothStructure: overrideDraft?.toothStructure ?? localToothStructure,
        smileCharacteristics:
          overrideDraft?.smileCharacteristics ?? localSmileCharacteristics,
        sectionSummaries: localSectionSummaries,
        review,
      }).unwrap();

      setLocalGeneralInfo({
        ...EMPTY_HISTORY.generalInfo,
        ...(data?.generalInfo || {}),
      });
      setLocalPersonalHistory(
        Array.isArray(data?.personalHistory) ? data.personalHistory : [],
      );
      setLocalGumAndBone(
        Array.isArray(data?.gumAndBone) ? data.gumAndBone : [],
      );
      setLocalBiteAndJawJoint(
        Array.isArray(data?.biteAndJawJoint) ? data.biteAndJawJoint : [],
      );
      setLocalToothStructure(
        Array.isArray(data?.toothStructure) ? data.toothStructure : [],
      );
      setLocalSmileCharacteristics(
        Array.isArray(data?.smileCharacteristics)
          ? data.smileCharacteristics
          : [],
      );
      setLocalSectionSummaries(data?.sectionSummaries || {});

      setSignature(data?.review?.signatureDataUrl || signature || null);
      setHasUnsavedChanges(false);
      showSnackbar(
        reviewedWithPatient
          ? "Dental history reviewed"
          : "Dental history updated",
        "success",
      );
    } catch (err) {
      showSnackbar(
        typeof err === "string"
          ? err
          : err?.message || "Failed to update dental history",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const showContent = !isActuallyLoading || patient;

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateItem = (section, id, field, value) => {
    if (section === "personalHistory") {
      updatePersonalHistory(id, field, value);
    } else if (section === "gumAndBone") {
      updateGumAndBone(id, field, value);
    } else if (section === "biteAndJawJoint") {
      updateBiteAndJawJoint(id, field, value);
    } else if (section === "toothStructure") {
      updateToothStructure(id, field, value);
    } else if (section === "smileCharacteristics") {
      updateSmileCharacteristics(id, field, value);
    }
  };

  return (
    <Box
      id="dental-history-page-root"
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100%",
        pb: 4,
        position: "relative",
      }}
    >
      <Box
        className="print-only"
        sx={{ display: "none", textAlign: "center", mb: 3 }}
      >
        <img src={medflowLogo} alt="Medflow" style={{ height: "40px" }} />
      </Box>
      <style>
        {`
          @media print {
            @page {
              size: letter portrait;
              margin: 15mm;
            }

            body {
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body * { 
              visibility: hidden; 
            }

            #dental-history-page-root, #dental-history-page-root * { 
              visibility: visible; 
            }

            #dental-history-page-root {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background-color: white !important;
            }

            .no-print, .no-print * {
              display: none !important;
            }

            .section-card-icon, .legend-dot {
              display: none !important;
            }
            .section-card-text, .section-card-text * {
              display: block !important;
              visibility: visible !important;
            }

            .print-only {
              display: block !important;
              margin-bottom: 32px !important;
            }

            .section-card {
              border-radius: 4px !important;
              border: 1px solid #cbd5e1 !important;
              margin-bottom: 16px !important;
              page-break-inside: avoid !important;
            }
            .section-card > .MuiBox-root:first-of-type {
              border-top-left-radius: 4px !important;
              border-top-right-radius: 4px !important;
              padding-left: 12px !important;
            }
            .section-card-body {
              padding: 16px !important;
            }

            #dental-history-header {
              border-radius: 4px !important;
              border: 1px solid #cbd5e1 !important;
              margin-bottom: 16px !important;
              padding: 12px 16px !important;
              page-break-inside: avoid !important;
            }

            /* Professional Form Fields */
            .MuiOutlinedInput-root {
              background: transparent !important;
            }
            .MuiOutlinedInput-notchedOutline {
              border: 1px solid #cbd5e1 !important;
              border-radius: 4px !important;
            }
            .MuiInputBase-input {
              padding: 6px 10px !important;
              font-size: 13px !important;
              color: black !important;
              -webkit-text-fill-color: black !important;
            }
            .MuiSelect-icon {
              display: none !important;
            }
            
            #dental-history-grid, .print-stack {
              display: block !important;
            }
            #dental-history-grid > .MuiBox-root, .print-stack > .MuiBox-root {
              width: 100% !important;
              margin-bottom: 16px !important;
            }
          }
        `}
      </style>
      <Box className="no-print">
        <PatientSectionTabs activeTab="dental" patientId={patientId} />
      </Box>
      <UnsavedChangesPrompt
        when={hasUnsavedChanges}
        onSave={() => saveDentalHistory(false)}
      />
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      {!showContent ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Header — same rounded-card treatment as the Medical History /
              Patient Details pages, with this page's own action set. */}
          <Box
            id="dental-history-header"
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
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: fontWeight.semibold,
                  fontSize: fontSize.lg,
                  color: COLORS.TEXT_PRIMARY,
                }}
              >
                Dental History
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: fontSize.base,
                  color: COLORS.TEXT_MUTED,
                  mt: 0.25,
                }}
              >
                {patient?.firstName || ""} {patient?.lastName || ""} · DOB:{" "}
                {patient?.dateOfBirth ? formatDate(patient.dateOfBirth) : "N/A"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckIcon fontSize="small" />}
                onClick={markAllUnansweredAsNo}
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
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  lineHeight: 1.2,
                  "&:hover": {
                    backgroundColor: COLORS.SURFACE_HOVER,
                    borderColor: COLORS.TEXT_MUTED,
                  },
                }}
              >
                MARK ALL UNANSWERED AS NO
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
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  lineHeight: 1.2,
                  "&:hover": {
                    backgroundColor: COLORS.STATUS_SUCCESS,
                    opacity: 0.9,
                  },
                }}
              >
                MARK AS REVIEWED WITH PATIENT
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
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  lineHeight: 1.2,
                  "&:hover": {
                    backgroundColor: COLORS.SURFACE_HOVER,
                    borderColor: COLORS.TEXT_MUTED,
                  },
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
          <Box
            id="dental-history-grid"
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "3fr 1fr" },
              gap: 2,
              alignItems: "start",
            }}
          >
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

              <SectionCard
                icon={HistoryTimelineIcon}
                title={
                  <Tabs
                    value={activeTab}
                    onChange={(e, val) => setActiveTab(val)}
                    aria-label="dental history tabs"
                    TabIndicatorProps={{
                      sx: { backgroundColor: COLORS.ACCENT, height: 3 },
                    }}
                    sx={{ minHeight: 40, ml: -1 }}
                  >
                    <Tab
                      label="Summary"
                      sx={{
                        textTransform: "none",
                        fontWeight:
                          activeTab === 0
                            ? fontWeight.semibold
                            : fontWeight.medium,
                        fontFamily: "Inter",
                        fontSize: fontSize.lg,
                        color:
                          activeTab === 0
                            ? COLORS.TEXT_PRIMARY
                            : COLORS.TEXT_SECONDARY,
                        "&.Mui-selected": { color: COLORS.TEXT_PRIMARY },
                        minHeight: 40,
                      }}
                    />
                    <Tab
                      label="Full Dental History"
                      sx={{
                        textTransform: "none",
                        fontWeight:
                          activeTab === 1
                            ? fontWeight.semibold
                            : fontWeight.medium,
                        fontFamily: "Inter",
                        fontSize: fontSize.lg,
                        color:
                          activeTab === 1
                            ? COLORS.TEXT_PRIMARY
                            : COLORS.TEXT_SECONDARY,
                        "&.Mui-selected": { color: COLORS.TEXT_PRIMARY },
                        minHeight: 40,
                      }}
                    />
                  </Tabs>
                }
                sx={{ p: 0 }}
              >
                {activeTab === 0 && (
                  <DentalHistorySummaryTab
                    sectionSummaries={localSectionSummaries}
                    onUpdateSectionSummary={handleUpdateSectionSummary}
                    personalHistory={localPersonalHistory}
                    gumAndBone={localGumAndBone}
                    biteAndJawJoint={localBiteAndJawJoint}
                    toothStructure={localToothStructure}
                    smileCharacteristics={localSmileCharacteristics}
                  />
                )}

                {activeTab === 1 && (
                  <DentalHistoryFullView
                    groupedHistory={groupDentalHistoryRows(
                      localPersonalHistory,
                    )}
                    gumAndBoneGrouped={groupDentalHistoryRows(localGumAndBone)}
                    biteAndJawJointGrouped={groupDentalHistoryRows(
                      localBiteAndJawJoint,
                    )}
                    toothStructureGrouped={groupDentalHistoryRows(
                      localToothStructure,
                    )}
                    smileCharacteristicsGrouped={groupDentalHistoryRows(
                      localSmileCharacteristics,
                    )}
                    onUpdateItem={handleUpdateItem}
                    sectionSummaries={localSectionSummaries}
                    onUpdateSectionSummary={handleUpdateSectionSummary}
                  />
                )}
              </SectionCard>
            </Box>

            {/* Sidebar — same Task List / Messages cards as the schedule
                operatory pages and the Medical History page, unmodified. */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 0,
              }}
            >
              <Box className="no-print">
                <TaskList />
              </Box>
              <Box className="no-print">
                <Messages />
              </Box>
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
