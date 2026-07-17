import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Description as DocIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
  PhotoCamera as CameraIcon,
  Assignment as ChecklistIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { usePatientDocuments } from "../../hooks/redux/usePatientDocuments";
import { usePatient } from "../../hooks/redux/usePatient";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import SectionCard from "../../components/shared/SectionCard";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const shareButtonSx = {
  textTransform: "none",
  borderRadius: radius.md,
  bgcolor: COLORS.ACCENT,
  fontWeight: fontWeight.semibold,
  fontSize: fontSize.base,
  boxShadow: "none",
  "&:hover": { bgcolor: COLORS.ACCENT_HOVER, boxShadow: "none" },
};

const isHipaDocument = (doc) => {
  const combined =
    `${doc.documentType || ""} ${doc.documentName || ""}`.toLowerCase();
  return combined.includes("hipaa");
};

const formatDate = (dateVal) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const truncateLabel = (value, max = 30) => {
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
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

const PatientSignedDocumentsPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();
  // Redux hooks
  const { currentPatient: patient, fetchById: fetchPatient } = usePatient();
  const { documents, loading: docsLoading, fetch: fetchDocuments } = usePatientDocuments(patientId);

  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
      fetchDocuments();
    }
  }, [patientId, fetchPatient, fetchDocuments]);

  const isActuallyLoading = docsLoading && documents.length === 0;

  const hipaaDocs = documents.filter(isHipaDocument);
  const signedDocs = documents.filter((d) => !isHipaDocument(d));

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName)
      return `${patient.firstName} ${patient.lastName}`;
    return "Patient";
  };

  const allSignedDocs = [...hipaaDocs, ...signedDocs];

  if (isActuallyLoading && !patient) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer>
      <PatientSectionTabs activeTab="signed_docs" patientId={patientId} />
      <FloatingActions>
        <FloatingActionButton
          onClick={() => navigate(`/documents/upload?patientId=${patientId}`)}
        >
          <CameraIcon fontSize="small" />
        </FloatingActionButton>
      </FloatingActions>

      <Box
        sx={{
          mt: 1.5,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          backgroundColor: COLORS.SURFACE_CARD,
          borderRadius: radius.xl,
          border: `0.8px solid ${COLORS.BORDER}`,
          px: 2.5,
          py: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontFamily: "Inter", fontWeight: fontWeight.semibold, fontSize: fontSize.lg, color: COLORS.TEXT_PRIMARY }}>
            Signed Documents
          </Typography>
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 0.25 }}>
            {getPatientName()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="small"
            sx={shareButtonSx}
          >
            Share Via Email
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={shareButtonSx}
          >
            Share Via Text
          </Button>
        </Box>
      </Box>

      {isActuallyLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Alert severity="info">No signed documents for this patient.</Alert>
      ) : (
        <>
          {/* HIPAA section always visible, even if empty */}
          <SectionCard icon={DocIcon} title="HIPAA Document">
            {hipaaDocs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No HIPAA documents for this patient.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {hipaaDocs.map((doc) => (
                  <Box
                    key={doc._id}
                    sx={{
                      width: 190,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/patients/${patientId}/signed-documents/${doc._id}`)}
                  >
                    <Box
                      sx={{ height: 92, display: "grid", placeItems: "center" }}
                    >
                      <Box sx={{ position: "relative", width: 72, height: 72 }}>
                        <DocIcon sx={{ fontSize: 68, color: "primary.main" }} />
                        <ChecklistIcon
                          sx={{
                            position: "absolute",
                            right: -4,
                            bottom: -6,
                            fontSize: 26,
                            color: "#64b5f6",
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-line",
                        fontWeight: 600,
                        color: COLORS.TEXT_PRIMARY,
                      }}
                    >
                      {truncateLabel(doc.documentName || "Document")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Signed · {formatDate(doc.createdAt)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </SectionCard>

          {/* Signed forms (non-HIPAA) */}
          <SectionCard icon={ChecklistIcon} title="Signed Forms">
            {signedDocs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No non-HIPAA signed documents for this patient.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {signedDocs.map((doc) => (
                  <Box
                    key={doc._id}
                    sx={{
                      width: 190,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/patients/${patientId}/signed-documents/${doc._id}`)}
                  >
                    <Box
                      sx={{ height: 92, display: "grid", placeItems: "center" }}
                    >
                      <Box sx={{ position: "relative", width: 72, height: 72 }}>
                        <DocIcon sx={{ fontSize: 68, color: "primary.main" }} />
                        <ChecklistIcon
                          sx={{
                            position: "absolute",
                            right: -4,
                            bottom: -6,
                            fontSize: 26,
                            color: "#64b5f6",
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-line",
                        fontWeight: 600,
                        color: COLORS.TEXT_PRIMARY,
                      }}
                    >
                      {truncateLabel(doc.documentName || "Document")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Signed · {formatDate(doc.createdAt)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </SectionCard>
        </>
      )}
    </PageContainer>
  );
};

export default PatientSignedDocumentsPage;