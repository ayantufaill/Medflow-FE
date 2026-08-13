import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import {
  Assignment as ChecklistIcon,
  AssignmentOutlined as HistoryTimelineIcon,
  AutoAwesome as SmartAiIcon,
  Check as CheckIcon,
  Description as DocumentIcon,
  PhotoCamera as CameraIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  WarningAmberOutlined as PremedIcon,
} from "@mui/icons-material";
import medflowLogo from "../../assets/medflow-logo.png";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useMedicalHistory } from "../../hooks/redux/useMedicalHistory";
import { usePatient } from "../../hooks/redux/usePatient";
import { usePatientAppointments } from "../../hooks/queries/usePatientAppointments";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import PatientSignatureCard from "../../components/patients/PatientSignatureCard";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import MedicalGeneralInfoCard from "../../components/medical-history/MedicalGeneralInfoCard";
import MedicalSummarySection from "../../components/medical-history/MedicalSummarySection";
import MedicationListCard from "../../components/patients/MedicationListCard";
import TaskList from "../../components/appointments/right-panel/TaskList";
import Messages from "../../components/appointments/right-panel/Messages";
import Card from "../../components/shared/Card";
import SectionCard from "../../components/shared/SectionCard";
import UnsavedChangesPrompt from "../../components/shared/UnsavedChangesPrompt";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const formatVisitDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    // Check if date is valid
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

const PageContainer = (props) => (
  <Box
    {...props}
    sx={{
      bgcolor: "#f5f5f5",
      minHeight: "100%",
      pb: 4,
      position: "relative",
      ...(props.sx || {}),
    }}
  />
);

const FloatingActions = (props) => (
  <Box
    {...props}
    sx={{
      position: "fixed",
      right: { xs: 16, lg: 332 },
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      zIndex: 10,
      ...(props.sx || {}),
      "@media print": {
        display: "none !important",
      },
    }}
  />
);

const FloatingActionButton = (props) => (
  <IconButton
    {...props}
    sx={{
      bgcolor: "#ffffff",
      borderRadius: "50%",
      border: "1px solid #e0e0e0",
      boxShadow: "0px 1px 3px rgba(0,0,0,0.15)",
      "&:hover": {
        bgcolor: "#fafafa",
      },
      ...(props.sx || {}),
    }}
  />
);

const PatientMedicalHistoryPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();
  const { medicalHistory, loading, error, fetch, update, uploadDocument } =
    useMedicalHistory();
  const { currentPatient: patient, fetchById } = usePatient();
  const { data: patientAppointments = [] } = usePatientAppointments(
    patientId,
    20,
  );
  const location = useLocation();
  const hasPrinted = useRef(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("print") === "true" && !loading && !hasPrinted.current) {
      hasPrinted.current = true;
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [location.search, loading]);

  const [historyTab, setHistoryTab] = useState(0); // 0 = Summary, 1 = Full Medical History
  const [medications, setMedications] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [signature, setSignature] = useState(null);
  const [isStartingNewHistory, setIsStartingNewHistory] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const addMedication = () => {
    setHasUnsavedChanges(true);
    const nextId = Math.max(0, ...medications.map((m) => m.id)) + 1;
    setMedications((prev) => [
      ...prev,
      { id: nextId, drug: "", dosage: "", purpose: "" },
    ]);
  };

  const updateMedication = (id, field, value) => {
    setHasUnsavedChanges(true);
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const removeMedication = (id) => {
    setHasUnsavedChanges(true);
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const addSupplement = () => {
    setHasUnsavedChanges(true);
    const nextId = Math.max(0, ...supplements.map((s) => s.id)) + 1;
    setSupplements((prev) => [
      ...prev,
      { id: nextId, drug: "", dosage: "", purpose: "" },
    ]);
  };

  const updateSupplement = (id, field, value) => {
    setHasUnsavedChanges(true);
    setSupplements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  const removeSupplement = (id) => {
    setHasUnsavedChanges(true);
    setSupplements((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    if (!patientId) return;

    // Fetch both patient info and medical history concurrently
    fetchById(patientId);

    // The Redux fetch will return a promise we can unwrap to populate local editing state
    fetch(patientId)
      .unwrap()
      .then((data) => {
        setMedications(
          Array.isArray(data?.medications) ? data.medications : [],
        );
        setSupplements(
          Array.isArray(data?.supplements) ? data.supplements : [],
        );
        setSignature(data?.review?.signatureDataUrl || null);
      })
      .catch((err) => {
        if (err?.name === "ConditionError") return;
        showSnackbar(
          typeof err === "string"
            ? err
            : err?.message || "Failed to load medical history",
          "error",
        );
      });
  }, [patientId, fetchById, fetch, showSnackbar]);

  // History Timeline nodes — the patient's actual appointment history
  // (oldest to newest; backend returns most-recent-first).
  const visitDates = useMemo(
    () =>
      [...patientAppointments]
        .reverse()
        .map((apt) => formatVisitDate(apt.date))
        .filter(Boolean),
    [patientAppointments],
  );

  const patientName = (() => {
    if (patient?.firstName || patient?.lastName) {
      return `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
    }
    return "Ayan Tufail";
  })();

  const [localGeneralInfo, setLocalGeneralInfo] = useState(null);
  const [localSections, setLocalSections] = useState(null);
  const [localPremed, setLocalPremed] = useState(null);

  // Initialize local editing state when medical history loads
  useEffect(() => {
    if (medicalHistory) {
      setLocalGeneralInfo(medicalHistory.generalInfo || {});
      setLocalSections(medicalHistory.sections || []);
      setLocalPremed(medicalHistory.premed || {});
    }
  }, [medicalHistory]);

  const generalInfo = localGeneralInfo || {};
  const rawSections = Array.isArray(localSections) ? localSections : [];

  const summarySections = rawSections.map((section) => ({
    ...section,
    additionalInfo: Array.isArray(section.additionalInfo)
      ? section.additionalInfo.join("\n\n")
      : section.additionalInfo || "",
  }));

  const handleSummarySectionChange = (sectionId, field, value) => {
    setHasUnsavedChanges(true);
    setLocalSections((prev) => {
      const currentSections = Array.isArray(prev) ? prev : [];
      return currentSections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section,
      );
    });
  };

  const handleGeneralInfoChange = (field, value) => {
    setHasUnsavedChanges(true);
    setLocalGeneralInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePremedChange = (requiresPremed) => {
    setHasUnsavedChanges(true);
    setLocalPremed((prev) => ({
      ...prev,
      requiresPremed,
    }));
  };

  const risk = medicalHistory?.risk || {};
  const reviewedWithPatient = Boolean(
    medicalHistory?.review?.reviewedWithPatient,
  );

  // loading starts as false in Redux, so we check if medicalHistory is actually present
  const isActuallyLoading = loading || (!medicalHistory && !error);
  const isEmptyState =
    !isActuallyLoading &&
    (!medicalHistory?.sections || medicalHistory.sections.length === 0) &&
    !isStartingNewHistory;

  const dobText = patient?.dateOfBirth
    ? `DOB: ${formatDate(patient.dateOfBirth)}`
    : "DOB: Mar 4, 2026";

  const [uploading, setUploading] = useState(false);

  const markAllUnansweredAsNo = () => {
    setHasUnsavedChanges(true);
    const nextSections = (
      Array.isArray(localSections) ? localSections : []
    ).map((section) => {
      const currentAnswer = (section.answer || "").toString().trim();
      const isUnanswered =
        currentAnswer === "" || currentAnswer.toLowerCase() === "not answered";
      return isUnanswered ? { ...section, answer: "No" } : section;
    });

    setLocalSections(nextSections);
    saveMedicalHistory(false, nextSections);
  };

  const saveMedicalHistory = async (
    reviewedWithPatient = false,
    sectionsOverride = null,
  ) => {
    if (!patientId || !medicalHistory) return;
    try {
      const baseReview = medicalHistory.review || {};
      const review = reviewedWithPatient
        ? {
            ...baseReview,
            reviewedWithPatient: true,
            reviewedAt: new Date().toISOString(),
            signatureDataUrl: signature || baseReview.signatureDataUrl || null,
          }
        : {
            ...baseReview,
            signatureDataUrl: signature || baseReview.signatureDataUrl || null,
          };

      const sectionsForSave = Array.isArray(sectionsOverride)
        ? sectionsOverride
        : Array.isArray(localSections)
          ? localSections
          : summarySections;

      const payload = {
        generalInfo: localGeneralInfo || {},
        premed: localPremed || {},
        risk: medicalHistory.risk,
        sections: sectionsForSave.map((section) => ({
          ...section,
          additionalInfo: Array.isArray(section.additionalInfo)
            ? section.additionalInfo
            : section.additionalInfo
              ? [section.additionalInfo]
              : [],
        })),
        medications,
        supplements,
        review,
      };

      const data = await update(patientId, payload).unwrap();
      fetchById(patientId);
      setHasUnsavedChanges(false);
      setMedications(Array.isArray(data?.medications) ? data.medications : []);
      setSupplements(Array.isArray(data?.supplements) ? data.supplements : []);
      setSignature(data?.review?.signatureDataUrl || signature || null);
      showSnackbar(
        reviewedWithPatient
          ? "Medical history reviewed"
          : "Medical history saved successfully",
        "success",
      );
      setHistoryTab(0);
    } catch (err) {
      showSnackbar(
        typeof err === "string"
          ? err
          : err?.message || "Failed to update medical history",
        "error",
      );
    }
  };

  const handleAddDocument = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files;
      if (!files?.length || !patientId) return;
      try {
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
          const formData = new FormData();
          formData.append("file", files[i]);
          formData.append("patientId", patientId);
          formData.append("documentType", "other");
          formData.append(
            "documentName",
            files[i].name || `Medical history document ${i + 1}`,
          );
          await uploadDocument(formData).unwrap();
        }
        showSnackbar(
          `Uploaded ${files.length} document(s). View them under SIGNED DOCS tab.`,
          "success",
        );
      } catch (err) {
        showSnackbar(
          typeof err === "string"
            ? err
            : err?.message || "Failed to upload document",
          "error",
        );
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  if (loading && !patient) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handlePrint = () => {
    window.print();
  };

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
    <PageContainer id="medical-history-page-root">
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

            #medical-history-page-root, #medical-history-page-root * { 
              visibility: visible; 
            }

            #medical-history-page-root {
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

            #medical-history-header {
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
            
            #medical-history-grid {
              display: block !important;
            }
            
            #medical-history-grid > .MuiBox-root {
              width: 100% !important;
              margin-bottom: 16px !important;
            }

            #medical-history-top-row, #medical-history-meds-grid {
              display: block !important;
            }

            .MuiPaper-root {
              box-shadow: none !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 4px !important;
              page-break-inside: avoid !important;
              margin-bottom: 16px !important;
            }
          }
        `}
      </style>
      <UnsavedChangesPrompt
        when={hasUnsavedChanges}
        onSave={() => saveMedicalHistory(false)}
      />
      <Box className="no-print">
        <PatientSectionTabs activeTab="medical" patientId={patientId} />
      </Box>

      {/* <FloatingActions
        sx={{
          '@media print': {
            display: 'none !important',
          },
        }}
      >
        <FloatingActionButton onClick={handleAddDocument} disabled={uploading}>
          <CameraIcon fontSize="small" />
        </FloatingActionButton>
        <FloatingActionButton>
          <DocumentIcon fontSize="small" />
        </FloatingActionButton>
        <FloatingActionButton>
          <ChecklistIcon fontSize="small" />
        </FloatingActionButton>
      </FloatingActions> */}

      {/* Header — same rounded-card treatment as the Patient Details page
          header (PatientDetailOverview.jsx), with this page's own action set. */}
      <Box
        id="medical-history-header"
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
            Medical History
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: fontSize.base,
              color: COLORS.TEXT_MUTED,
              mt: 0.25,
            }}
          >
            {patientName} · {dobText}
          </Typography>
        </Box>

        <Box
          className="no-print"
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
            onClick={() => saveMedicalHistory(true)}
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
          <Button
            variant="contained"
            size="small"
            startIcon={<SmartAiIcon fontSize="small" />}
            sx={{
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.base,
              borderRadius: radius.md,
              boxShadow: "none",
              backgroundColor: COLORS.ACCENT,
              "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
            }}
          >
            Smart AI
          </Button>
        </Box>
      </Box>

      {/* Main column (Timeline/Premed row + General Info/Summary) and the
          sidebar share one grid so the sidebar's left edge lines up with
          both rows instead of the top row bleeding into where the sidebar
          starts below it. Ratio matches the Figma spec (~77:23 main:sidebar,
          ~69:31 Timeline:Premedication) and the same ~4:1 split the
          Task List/Messages cards use on the schedule operatory page. */}
      <Box
        id="medical-history-grid"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "3fr 1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            id="medical-history-top-row"
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "7fr 3fr" },
              gap: 2,
              mb: 2,
              alignItems: "start",
            }}
          >
            <SectionCard
              icon={HistoryTimelineIcon}
              title="History Timeline"
              sx={{ mb: 0 }}
            >
              {visitDates.length ? (
                <VisitDatesTimeline visitDates={visitDates} />
              ) : (
                <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                  No appointment history recorded yet.
                </Typography>
              )}
            </SectionCard>

            <SectionCard icon={PremedIcon} title="Premedication" sx={{ mb: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={Boolean(localPremed?.requiresPremed)}
                    onChange={(e) => handlePremedChange(e.target.checked)}
                    sx={{ p: 0.5 }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: fontSize.base,
                      fontWeight: fontWeight.medium,
                      color: COLORS.TEXT_PRIMARY,
                    }}
                  >
                    Requires premed
                  </Typography>
                }
              />
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: fontSize.base,
                  color: COLORS.TEXT_SECONDARY,
                  mt: 0.5,
                }}
              >
                Assess prior to invasive procedures based on the patient&apos;s
                medical history.
              </Typography>
            </SectionCard>
          </Box>

          {isActuallyLoading && !patient ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", py: 4, flex: 1 }}
            >
              <CircularProgress />
            </Box>
          ) : isEmptyState ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                pt: 10,
                pb: 20,
                textAlign: "center",
                flex: 1,
              }}
            >
              <Typography
                sx={{
                  mb: 2.5,
                  color: "#444",
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                Patient doesn't have a medical history:
              </Typography>
              <Button
                variant="contained"
                onClick={() => setIsStartingNewHistory(true)}
                sx={{
                  bgcolor: "#00346a",
                  color: "white",
                  px: 3.5,
                  py: 1,
                  borderRadius: "25px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#00264d", boxShadow: "none" },
                }}
              >
                Start Medical History
              </Button>
            </Box>
          ) : (
            <>
              <MedicalGeneralInfoCard
                generalInfo={generalInfo}
                onChangeField={handleGeneralInfoChange}
              />

              <MedicalSummarySection
                historyTab={historyTab}
                onChangeTab={setHistoryTab}
                summarySections={summarySections}
                onSectionChange={handleSummarySectionChange}
              />

              <Box
                id="medical-history-meds-grid"
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                  mt: 2,
                }}
              >
                <MedicationListCard
                  title="Medication List"
                  rows={medications}
                  onChangeRow={updateMedication}
                  onAddRow={addMedication}
                  onRemoveRow={removeMedication}
                />
                <MedicationListCard
                  title="Supplements & Vitamins"
                  rows={supplements}
                  onChangeRow={updateSupplement}
                  onAddRow={addSupplement}
                  onRemoveRow={removeSupplement}
                />
              </Box>

              <Typography
                variant="caption"
                className="no-print"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 2,
                  color: "#bdbdbd",
                }}
              >
                {risk?.asaClass ? `${risk.asaClass} · ` : ""}
                {risk?.level
                  ? `Risk: ${risk.level}`
                  : "Medical history loaded from patient record"}
              </Typography>
            </>
          )}
        </Box>

        {/* Sidebar — same Task List / Messages cards as the schedule
            operatory pages, plus a Signature card in the same card shell.
            One column spanning both rows above, not re-declared per row. */}
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}
        >
          <Box className="no-print">
            <TaskList />
          </Box>
          <Box className="no-print">
            <Messages />
          </Box>
          <PatientSignatureCard
            value={signature}
            onChange={setSignature}
            reviewedWithPatient={reviewedWithPatient}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default PatientMedicalHistoryPage;
