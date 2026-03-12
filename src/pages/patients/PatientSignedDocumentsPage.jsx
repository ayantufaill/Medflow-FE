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
import { documentService } from "../../services/document.service";
import { patientService } from "../../services/patient.service";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";

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

const Card = (props) => (
  <Paper
    elevation={0}
    {...props}
    sx={{
      p: 3,
      mb: 2,
      borderRadius: 1,
      border: "1px solid #e0e0e0",
      bgcolor: "#ffffff",
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
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientData, result] = await Promise.all([
          patientService.getPatientById(patientId),
          documentService.getDocumentsByPatient(patientId, 1, 100),
        ]);
        if (!cancelled) {
          setPatient(patientData);
          setDocuments(result?.documents || []);
        }
      } catch (err) {
        if (!cancelled) {
          showSnackbar(
            err.response?.data?.error?.message ||
              "Failed to load signed documents",
            "error",
          );
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

  const hipaaDocs = documents.filter(isHipaDocument);
  const signedDocs = documents.filter((d) => !isHipaDocument(d));

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName)
      return `${patient.firstName} ${patient.lastName}`;
    return "Patient";
  };

  const allSignedDocs = [...hipaaDocs, ...signedDocs];

  if (loading && !patient) {
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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#424242", fontSize: "1.05rem" }}
            >
              Signed Documents
            </Typography>
            <Typography variant="body2" sx={{ color: "#757575", mt: 0.25 }}>
              {getPatientName()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 1,
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            Share Via Email
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 1,
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            Share Via Text
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Alert severity="info">No signed documents for this patient.</Alert>
      ) : (
        <>
          {/* HIPAA section always visible, even if empty */}
          <Card>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              HIPAA Document:
            </Typography>

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
                    onClick={() => navigate(`/documents/${doc._id}`)}
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
                        <Box
                          sx={{
                            position: "absolute",
                            top: -6,
                            left: -6,
                            width: 12,
                            height: 12,
                            bgcolor: "#ffffff",
                            border: "1px solid #bdbdbd",
                            borderRadius: 0.5,
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-line",
                        fontWeight: 600,
                        color: "#424242",
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
          </Card>

          {/* Signed forms (non-HIPAA) */}
          <Card>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Signed Forms:
            </Typography>

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
                    onClick={() => navigate(`/documents/${doc._id}`)}
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
                        <Box
                          sx={{
                            position: "absolute",
                            top: -6,
                            left: -6,
                            width: 12,
                            height: 12,
                            bgcolor: "#ffffff",
                            border: "1px solid #bdbdbd",
                            borderRadius: 0.5,
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-line",
                        fontWeight: 600,
                        color: "#424242",
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
          </Card>
        </>
      )}
    </PageContainer>
  );
};

export default PatientSignedDocumentsPage;
