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
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Link,
} from "@mui/material";
import {
  Description as DocIcon,
  PhotoCamera as CameraIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  InfoOutlined as InfoIcon,
  Add as AddIcon,
  Assignment as ChecklistIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { documentService } from "../../services/document.service";
import { patientService } from "../../services/patient.service";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";

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

const INITIAL_CUSTOM_FORMS = [
  {
    id: "form-1",
    title: "Consent for Braces\nRemoval -Orthodontic\nRetention - 02/18/2026",
    status: "Not Signed",
  },
  {
    id: "form-2",
    title: "Retainer Consent Form\n02/18/2026",
    status: "Signed",
  },
  {
    id: "form-3",
    title: "TDS Form",
    status: "Signed",
  },
];

const INITIAL_DEMO_CLAIM_ATTACHMENTS = [
  {
    id: "demo-1",
    name: "Progress Notes 1",
    uploadedBy: "B.M",
    uploadedDate: "03/18/2026",
    status: "Open",
    type: "IMAGE",
  },
  {
    id: "demo-2",
    name: "Perio Chart 1",
    uploadedBy: "B.M",
    uploadedDate: "02/19/2026",
    status: "Open",
    type: "PDF",
  },
];

const INITIAL_DEMO_CONSENTS = [
  {
    id: "demo-c1",
    name: "Invisalign consent",
    uploadedBy: "K.H",
    uploadedDate: "02/19/2026",
    status: "Open",
    type: "PDF",
  },
];

const EDIT_NAME_SUGGESTIONS = [
  "BOB (Breakdown of benefits)",
  "Insurance Fax Back",
  "Treatment consent",
  "N2O Consent",
  "Signed Treatment Plan",
  "Pre-D",
];

const EDIT_CATEGORY_SUGGESTIONS = [
  "Insurance",
  "Consent",
  "Medical/Dental History",
  "Treatment Plan",
  "Referral",
  "Signed Receipt",
  "Medications",
  "ID",
  "Lab",
  "Invoices",
  "Consult",
];

const PatientAdditionalDocumentsPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    documentId: null,
    documentName: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewMode, setViewMode] = useState("thumbnails");
  const [sortMode, setSortMode] = useState("category");

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
          // Filter out HIPAA documents - show only additional/non-signed docs
          const allDocs = result?.documents || [];
          const nonHipaaDocs = allDocs.filter((doc) => {
            const type = (doc.documentType || "").toLowerCase();
            const name = (doc.documentName || "").toLowerCase();
            return type !== "hipaa" && !name.includes("hipaa");
          });
          setDocuments(nonHipaaDocs);
        }
      } catch (err) {
        if (!cancelled) {
          showSnackbar(
            err.response?.data?.error?.message ||
              "Failed to load additional documents",
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

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName)
      return `${patient.firstName} ${patient.lastName}`;
    return "Patient";
  };

  const handleUploadAdditionalDocument = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files;
      if (!files?.length || !patientId) return;
      try {
        setUploading(true);
        const now = new Date();
        const uploadedBy = patient?.lastName?.[0]
          ? `${patient.lastName[0]}.`
          : "U";
        const uploadedDate = now.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });

        const newRows = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("patientId", patientId);
          formData.append("documentType", "other");
          const displayName = file.name || `Additional document ${i + 1}`;
          formData.append("documentName", displayName);
          await documentService.uploadDocument(formData);

          const ext = (file.name || "").split(".").pop() || "";
          const type =
            ext.toLowerCase() === "pdf"
              ? "PDF"
              : ext
                ? ext.toUpperCase()
                : "IMAGE";

          newRows.push({
            id: `demo-upload-${Date.now()}-${i}`,
            name: displayName,
            uploadedBy,
            uploadedDate,
            status: "Open",
            type,
          });
        }

        if (newRows.length) {
          setDemoClaimAttachments((prev) => [...newRows, ...prev]);
        }

        showSnackbar(`Uploaded ${files.length} document(s)`, "success");
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

  const handleDelete = async () => {
    const { documentId } = deleteDialog;
    if (!documentId) {
      setDeleteDialog({ open: false, documentId: null, documentName: "" });
      return;
    }

    // Demo rows: delete locally without hitting API
    if (documentId.startsWith("demo-")) {
      setDeleteLoading(true);
      try {
        if (documentId.startsWith("demo-c")) {
          setDemoConsents((prev) =>
            prev.filter((row) => row.id !== documentId),
          );
        } else {
          setDemoClaimAttachments((prev) =>
            prev.filter((row) => row.id !== documentId),
          );
        }
        showSnackbar("Document removed", "success");
      } finally {
        setDeleteLoading(false);
        setDeleteDialog({ open: false, documentId: null, documentName: "" });
      }
      return;
    }

    // Real documents: call API
    try {
      setDeleteLoading(true);
      await documentService.deleteDocument(documentId);
      showSnackbar("Document deleted successfully", "success");
      setDeleteDialog({ open: false, documentId: null, documentName: "" });
      // Refresh documents
      const result = await documentService.getDocumentsByPatient(
        patientId,
        1,
        100,
      );
      const allDocs = result?.documents || [];
      const nonHipaaDocs = allDocs.filter((doc) => {
        const type = (doc.documentType || "").toLowerCase();
        const name = (doc.documentName || "").toLowerCase();
        return type !== "hipaa" && !name.includes("hipaa");
      });
      setDocuments(nonHipaaDocs);
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to delete document",
        "error",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const [demoClaimAttachments, setDemoClaimAttachments] = useState(
    INITIAL_DEMO_CLAIM_ATTACHMENTS,
  );
  const [demoConsents, setDemoConsents] = useState(INITIAL_DEMO_CONSENTS);
  const [customForms, setCustomForms] = useState(INITIAL_CUSTOM_FORMS);
  const [customFormDeleteDialog, setCustomFormDeleteDialog] = useState({
    open: false,
    formId: null,
    formTitle: "",
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    section: null, // "claim" | "consent"
    docId: null,
    name: "",
    type: "",
    category: "",
  });

  const handleConfirmDeleteCustomForm = () => {
    if (!customFormDeleteDialog.formId) {
      setCustomFormDeleteDialog({ open: false, formId: null, formTitle: "" });
      return;
    }
    setCustomForms((prev) =>
      prev.filter((item) => item.id !== customFormDeleteDialog.formId),
    );
    setCustomFormDeleteDialog({ open: false, formId: null, formTitle: "" });
    showSnackbar("Custom form removed", "success");
  };

  const handleUploadCustomFormDocument = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files;
      if (!files?.length || !patientId) return;
      try {
        setUploading(true);
        const newForms = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const displayName = file.name || `Custom form ${i + 1}`;

          const formData = new FormData();
          formData.append("file", file);
          formData.append("patientId", patientId);
          formData.append("documentType", "custom_form");
          formData.append("documentName", displayName);
          await documentService.uploadDocument(formData);

          newForms.push({
            id: `form-upload-${Date.now()}-${i}`,
            title: displayName,
            status: "Not Signed",
          });
        }

        if (newForms.length) {
          setCustomForms((prev) => [...newForms, ...prev]);
        }

        showSnackbar(
          `Uploaded ${files.length} custom form document(s)`,
          "success",
        );
      } catch (err) {
        showSnackbar(
          err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            "Failed to upload custom form document",
          "error",
        );
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const handleOpenEditDialog = (section, row) => {
    setEditDialog({
      open: true,
      section,
      docId: row.id,
      name: row.name,
      type: row.type,
      category: row.type || "",
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialog((prev) => ({ ...prev, open: false }));
  };

  const handleSaveEditDialog = () => {
    const { section, docId, name, category } = editDialog;
    if (!section || !docId) {
      handleCloseEditDialog();
      return;
    }

    if (section === "claim") {
      setDemoClaimAttachments((prev) =>
        prev.map((row) =>
          row.id === docId ? { ...row, name, type: category || row.type } : row,
        ),
      );
    } else {
      setDemoConsents((prev) =>
        prev.map((row) =>
          row.id === docId ? { ...row, name, type: category || row.type } : row,
        ),
      );
    }

    showSnackbar("Document details updated", "success");
    handleCloseEditDialog();
  };

  const sortRowsForView = (rows) => {
    const copy = [...rows];
    if (sortMode === "name") {
      copy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortMode === "date") {
      copy.sort((a, b) => {
        const da = new Date(a.uploadedDate || 0).getTime();
        const db = new Date(b.uploadedDate || 0).getTime();
        return db - da;
      });
    } else if (sortMode === "category") {
      copy.sort((a, b) => (a.type || "").localeCompare(b.type || ""));
    }
    return copy;
  };

  const sortedClaimAttachments = sortRowsForView(demoClaimAttachments);
  const sortedConsents = sortRowsForView(demoConsents);

  if (loading && !patient) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer>
      <PatientSectionTabs activeTab="additional_docs" patientId={patientId} />

      <FloatingActions>
        <FloatingActionButton
          onClick={handleUploadCustomFormDocument}
          disabled={uploading}
        >
          <CameraIcon fontSize="small" />
        </FloatingActionButton>
        <FloatingActionButton>
          <DocIcon fontSize="small" />
        </FloatingActionButton>
        <FloatingActionButton>
          <ChecklistIcon fontSize="small" />
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
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#424242", fontSize: "1.05rem" }}
        >
          Additional Documents
        </Typography>

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

      <Card>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Custom Forms:
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {customForms.map((f) => (
            <Box
              key={f.id}
              sx={{
                width: 190,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                showSnackbar(
                  `Opening form: ${f.title.replace(/\n/g, " ")}`,
                  "info",
                )
              }
            >
              <Box sx={{ height: 92, display: "grid", placeItems: "center" }}>
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
                      border:
                        customFormDeleteDialog.open &&
                        customFormDeleteDialog.formId === f.id
                          ? "1px solid #1976d2"
                          : "1px solid #bdbdbd",
                      borderRadius: 0.5,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomFormDeleteDialog({
                        open: true,
                        formId: f.id,
                        formTitle: f.title.replace(/\n/g, " "),
                      });
                    }}
                  >
                    {customFormDeleteDialog.open &&
                      customFormDeleteDialog.formId === f.id && (
                        <CheckIcon sx={{ fontSize: 10, color: "#1976d2" }} />
                      )}
                  </Box>
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
                {truncateLabel(f.title.replace(/\n/g, " "))}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {f.status}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      <Card>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          Additional Documents:
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, v) => v && setViewMode(v)}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1,
                  borderColor: "grey.200",
                  bgcolor: "grey.100",
                },
                "& .MuiToggleButton-root.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <ToggleButton value="thumbnails">Thumbnails</ToggleButton>
              <ToggleButton value="list">List View</ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#616161", fontSize: "0.8rem" }}
              >
                Sort By:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                  sx={{
                    height: 32,
                    fontSize: "0.8rem",
                    bgcolor: "grey.100",
                    "& .MuiSelect-select": {
                      py: 0.75,
                      display: "flex",
                      alignItems: "center",
                    },
                    "& fieldset": { borderColor: "grey.300" },
                    "&:hover fieldset": { borderColor: "grey.400" },
                  }}
                >
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Paper
            variant="outlined"
            onClick={uploading ? undefined : handleUploadAdditionalDocument}
            sx={{
              cursor: uploading ? "not-allowed" : "pointer",
              py: 1.25,
              px: 2,
              minWidth: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              bgcolor: "#fff",
              "&:hover": uploading ? undefined : { bgcolor: "grey.50" },
            }}
          >
            <AddIcon fontSize="small" />
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ fontSize: "0.8rem" }}
            >
              Upload new document
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 2 }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : documents.length === 0 ? (
          <Alert severity="info">
            No additional documents for this patient. Click “Upload new
            document” to add one.
          </Alert>
        ) : viewMode === "thumbnails" ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {sortedClaimAttachments.concat(sortedConsents).map((row) => (
              <Box key={row.id} sx={{ minWidth: 280, maxWidth: 360 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box sx={{ color: "primary.main", mt: 0.25 }}>
                    <DocIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {row.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Uploaded by {row.uploadedBy} — {row.uploadedDate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.type}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        ) : (
          <Box>
            {/* Claim Attachment section – demo data */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.75,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#616161",
                    fontSize: "0.8rem",
                  }}
                >
                  Claim Attachment
                </Typography>
                <Tooltip title="Uploaded claim-related attachments">
                  <InfoIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                </Tooltip>
              </Box>

              <Table
                size="small"
                sx={{
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 1,
                }}
              >
                <TableBody>
                  {sortedClaimAttachments.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleOpenEditDialog("claim", row)}
                          >
                            {truncateLabel(row.name)}
                          </Typography>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditDialog("claim", row)}
                            >
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: 220 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.8rem", color: "#757575" }}
                        >
                          Uploaded by {row.uploadedBy} — {row.uploadedDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.8rem", color: "#616161" }}
                        >
                          {row.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            color: "#1976d2",
                            cursor: "pointer",
                          }}
                        >
                          {row.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            color: "#1976d2",
                            cursor: "pointer",
                          }}
                        >
                          Download
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            color: "#1976d2",
                            cursor: "pointer",
                          }}
                        >
                          Share with patient
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ width: 60 }}>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            sx={{ color: "#e53935" }}
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                documentId: row.id,
                                documentName: row.name,
                              })
                            }
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* Consent section – demo data */}
            <Box sx={{ mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.75,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#616161",
                    fontSize: "0.8rem",
                  }}
                >
                  Consent
                </Typography>
                <Tooltip title="Uploaded consent documents">
                  <InfoIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                </Tooltip>
              </Box>

              <Table
                size="small"
                sx={{
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 1,
                }}
              >
                <TableBody>
                  {sortedConsents.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleOpenEditDialog("consent", row)}
                          >
                            {truncateLabel(row.name)}
                          </Typography>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleOpenEditDialog("consent", row)
                              }
                            >
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: 220 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.8rem", color: "#757575" }}
                        >
                          Uploaded by {row.uploadedBy} — {row.uploadedDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.8rem", color: "#616161" }}
                        >
                          {row.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            color: "#1976d2",
                            cursor: "pointer",
                          }}
                        >
                          {row.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            color: "#1976d2",
                            cursor: "pointer",
                          }}
                        >
                          Download
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            color: "#1976d2",
                            cursor: "pointer",
                          }}
                        >
                          Share with patient
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ width: 60 }}>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            sx={{ color: "#e53935" }}
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                documentId: row.id,
                                documentName: row.name,
                              })
                            }
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        )}
      </Card>

      {/* Edit Additional Document dialog (demo only) */}
      <Dialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 1,
            minWidth: 420,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            bgcolor: "#3f5f98",
            color: "#ffffff",
            py: 1,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Edit Additional Document</span>
          <IconButton
            size="small"
            onClick={handleCloseEditDialog}
            sx={{ color: "#ffffff" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 2,
            pb: 1,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1.5, color: "#616161" }}>
            Please enter a name and category
          </Typography>

          {/* Name row */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#333333", mr: 0.5 }}
              >
                Name:
              </Typography>
              <TextField
                variant="standard"
                fullWidth
                value={editDialog.name}
                onChange={(e) =>
                  setEditDialog((prev) => ({ ...prev, name: e.target.value }))
                }
                InputProps={{
                  disableUnderline: false,
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "0.9rem",
                    py: 0.25,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    pr: 1,
                    maxHeight: 140,
                    overflowY: "auto",
                  }}
                >
                  {EDIT_NAME_SUGGESTIONS.map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      size="small"
                      onClick={() =>
                        setEditDialog((prev) => ({ ...prev, name: label }))
                      }
                      sx={{
                        bgcolor: "#b0b0b0",
                        color: "#ffffff",
                        borderRadius: 0.5,
                        fontSize: "0.7rem",
                        px: 1,
                        "& .MuiChip-label": {
                          px: 1,
                          py: 0.25,
                          whiteSpace: "normal",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  minWidth: 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    px: 2,
                    bgcolor: "#3f5f98",
                    "&:hover": { bgcolor: "#344a7c" },
                  }}
                >
                  Save to Defaults
                </Button>
                <Link
                  component="button"
                  variant="caption"
                  underline="hover"
                  sx={{ color: "#3f5f98" }}
                >
                  Re-order
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Category row */}
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#333333", mr: 0.5 }}
              >
                Category:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  borderBottom: "1px solid #cccccc",
                  minWidth: 180,
                  pb: 0.25,
                  fontSize: "0.9rem",
                  color: "#333333",
                }}
              >
                {editDialog.category || "Claim Attachment"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    pr: 1,
                    maxHeight: 160,
                    overflowY: "auto",
                  }}
                >
                  {EDIT_CATEGORY_SUGGESTIONS.map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      size="small"
                      onClick={() =>
                        setEditDialog((prev) => ({ ...prev, category: label }))
                      }
                      sx={{
                        bgcolor: "#b0b0b0",
                        color: "#ffffff",
                        borderRadius: 0.5,
                        fontSize: "0.7rem",
                        px: 1,
                        "& .MuiChip-label": {
                          px: 1,
                          py: 0.25,
                          whiteSpace: "normal",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  minWidth: 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    px: 2,
                    bgcolor: "#3f5f98",
                    "&:hover": { bgcolor: "#344a7c" },
                  }}
                >
                  Save to Defaults
                </Button>
                <Link
                  component="button"
                  variant="caption"
                  underline="hover"
                  sx={{ color: "#3f5f98" }}
                >
                  Re-order
                </Link>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseEditDialog}
            size="small"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEditDialog}
            variant="contained"
            size="small"
            sx={{
              textTransform: "none",
              bgcolor: "#3f5f98",
              "&:hover": { bgcolor: "#344a7c" },
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={() =>
          setDeleteDialog({ open: false, documentId: null, documentName: "" })
        }
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteDialog.documentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
      <ConfirmationDialog
        open={customFormDeleteDialog.open}
        onClose={() =>
          setCustomFormDeleteDialog({
            open: false,
            formId: null,
            formTitle: "",
          })
        }
        onConfirm={handleConfirmDeleteCustomForm}
        title="Remove Custom Form"
        message={`Are you sure you want to remove "${customFormDeleteDialog.formTitle}" from this list?`}
        confirmText="Remove"
        cancelText="Cancel"
        confirmColor="error"
        loading={false}
      />
    </PageContainer>
  );
};

export default PatientAdditionalDocumentsPage;
