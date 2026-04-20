import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
} from "@mui/material";
import {
  Assignment as ChecklistIcon,
  Check as CheckIcon,
  Description as DocumentIcon,
  PhotoCamera as CameraIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { patientService } from "../../services/patient.service";
import { documentService } from "../../services/document.service";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import PatientSignatureSection from "../../components/patients/PatientSignatureSection";
import MedicationListCard from "../../components/patients/MedicationListCard";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import MedicalGeneralInfoCard from "../../components/medical-history/MedicalGeneralInfoCard";
import MedicalSummarySection from "../../components/medical-history/MedicalSummarySection";
import Card from "../../components/shared/Card";

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
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      zIndex: 10,
      ...(props.sx || {}),
      '@media print': {
        display: 'none !important',
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

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyTab, setHistoryTab] = useState(0); // 0 = Summary, 1 = Full Medical History
  const [medications, setMedications] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [visitDates, setVisitDates] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [signature, setSignature] = useState(null);
  const [isStartingNewHistory, setIsStartingNewHistory] = useState(false);

  const addMedication = () => {
    const nextId = Math.max(0, ...medications.map((m) => m.id)) + 1;
    setMedications((prev) => [
      ...prev,
      { id: nextId, drug: "", dosage: "", purpose: "" },
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
      { id: nextId, drug: "", dosage: "", purpose: "" },
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
        setError("");
        const data =
          await patientService.getStructuredMedicalHistory(patientId);
        if (!cancelled) {
          setPatient(data?.patient || null);
          setMedicalHistory(data || null);
          setMedications(
            Array.isArray(data?.medications) ? data.medications : [],
          );
          setSupplements(
            Array.isArray(data?.supplements) ? data.supplements : [],
          );
          setSignature(data?.review?.signatureDataUrl || null);

          // Debug: Log the raw visitDates from backend
          console.log('Raw visitDates from backend:', data?.visitDates);

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

                const formatted = formatVisitDate(dateStr);
                if (!formatted) {
                  console.warn(`Failed to format visit date at index ${index}:`, item);
                }
                // Only include valid formatted dates
                return formatted || null;
              })
              .filter(Boolean)
            : [];
          setVisitDates(labels);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            "Failed to load medical history",
          );
          showSnackbar("Failed to load medical history", "error");
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
      return `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
    }
    return "Ayan Tufail";
  })();

  const generalInfo = medicalHistory?.generalInfo || {};

  // Medical history questions come from the canonical `sections` array
  // provided by /patients/:id/medical-history.
  const rawSections = Array.isArray(medicalHistory?.sections)
    ? medicalHistory.sections
    : [];

  // Normalize additionalInfo for UI: backend stores it as an array, but
  // the UI edits a single multiline string.
  const summarySections = rawSections.map((section) => ({
    ...section,
    additionalInfo: Array.isArray(section.additionalInfo)
      ? section.additionalInfo.join("\n\n")
      : section.additionalInfo || "",
  }));
  const risk = medicalHistory?.risk || {};
  const reviewedWithPatient = Boolean(
    medicalHistory?.review?.reviewedWithPatient,
  );

  const isEmptyState = !loading && !medicalHistory?.sections?.length && !isStartingNewHistory;

  const dobText = patient?.dateOfBirth
    ? `DOB: ${formatDate(patient.dateOfBirth)}`
    : "DOB: Mar 4, 2026";

  const [uploading, setUploading] = useState(false);

  const updateMedicalHistoryState = (updater) => {
    setMedicalHistory((prev) =>
      typeof updater === "function" ? updater(prev) : updater,
    );
  };

  const handleSummarySectionChange = (sectionId, field, value) => {
    updateMedicalHistoryState((prev) => {
      const currentSections = Array.isArray(prev?.sections)
        ? prev.sections
        : [];
      const updatedSections = currentSections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section,
      );

      return {
        ...prev,
        summary: {
          ...(prev?.summary || {}),
          sections: updatedSections,
        },
        sections: updatedSections,
      };
    });
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

      const sectionsForSave = Array.isArray(medicalHistory.sections)
        ? medicalHistory.sections
        : summarySections;

      const data = await patientService.updateStructuredMedicalHistory(
        patientId,
        {
          generalInfo: medicalHistory.generalInfo,
          premed: medicalHistory.premed,
          risk: medicalHistory.risk,
          // Backend expects additionalInfo to be an array; UI edits a single
          // multiline string, so convert it before sending.
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
        },
      );

      setMedicalHistory(data || null);
      setMedications(Array.isArray(data?.medications) ? data.medications : []);
      setSupplements(Array.isArray(data?.supplements) ? data.supplements : []);
      setSignature(data?.review?.signatureDataUrl || signature || null);
      showSnackbar(
        reviewedWithPatient
          ? "Medical history reviewed"
          : "Medical history updated",
        "success",
      );
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Failed to update medical history",
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
          await documentService.uploadDocument(formData);
        }
        showSnackbar(
          `Uploaded ${files.length} document(s). View them under SIGNED DOCS tab.`,
          "success",
        );
      } catch (err) {
        showSnackbar(
          err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to upload document",
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
    <PageContainer>
      <PatientSectionTabs activeTab="medical" patientId={patientId} />

      <FloatingActions
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
      </FloatingActions>

      {/* Header */}
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
              Medical History
            </Typography>
            <Typography variant="body2" sx={{ color: "#757575", mt: 0.25 }}>
              {patientName} · {dobText}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => saveMedicalHistory(false)}
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
            onClick={() => saveMedicalHistory(true)}
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

      {/* Timeline with Start AI Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <VisitDatesTimeline
            visitDates={visitDates}
            onRemoveDate={(indexToRemove) => {
              setVisitDates((prev) => prev.slice(0, indexToRemove));
            }}
          />
        </Box>
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            bgcolor: "#ffffff",
            color: "#40B5AD",
            fontWeight: 700,
            fontSize: '0.85rem',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            "&:hover": { bgcolor: "#f5f5f5", boxShadow: '0px 4px 12px rgba(0,0,0,0.15)' },
            minWidth: '100px',
            whiteSpace: 'nowrap',
            py: 0.5,
            px: 2
          }}
        >
          Start AI
        </Button>
      </Box>

      {isEmptyState ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'flex-start', 
            pt: 10,
            pb: 20,
            textAlign: 'center',
            flex: 1
          }}
        >
          <Typography sx={{ mb: 2.5, color: '#444', fontSize: '1rem', fontWeight: 500 }}>
            Patient doesn't have a medical history:
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsStartingNewHistory(true)}
            sx={{
              bgcolor: '#00346a',
              color: 'white',
              px: 3.5,
              py: 1,
              borderRadius: '25px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#00264d', boxShadow: 'none' }
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
            premedRequires={Boolean(medicalHistory?.premed?.requiresPremed)}
            onPremedChange={handlePremedChange}
          />

          <MedicalSummarySection
            historyTab={historyTab}
            onChangeTab={setHistoryTab}
            summarySections={summarySections}
            onSectionChange={handleSummarySectionChange}
            medications={medications}
            onChangeMedication={updateMedication}
            onAddMedication={addMedication}
            supplements={supplements}
            onChangeSupplement={updateSupplement}
            onAddSupplement={addSupplement}
          />

          {/* Signature – aligned to the right like dental page */}
          <PatientSignatureSection
            value={signature}
            onChange={setSignature}
            reviewedWithPatient={reviewedWithPatient}
          />

          <Typography
            variant="caption"
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
    </PageContainer>
  );
};

export default PatientMedicalHistoryPage;
