import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { documentService } from "../../services/document.service";
import { usePatientDocuments } from "../../hooks/redux/usePatientDocuments";
import { usePatient } from "../../hooks/redux/usePatient";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";
import { CustomFormsSection, DocumentThumbnail, DocumentTable, EditDocumentDialog, FloatingActions } from "../../components/patients";

// Utility functions
const formatDate = (dateVal) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

// Styled components
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

const PatientAdditionalDocumentsPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();
  
  // State management
  // Redux hooks
  const { currentPatient: patient, fetchById: fetchPatient } = usePatient();
  const { 
    documents: reduxDocuments, 
    loading: docsLoading, 
    fetch: fetchDocuments,
    refresh: refreshDocuments,
    remove: deleteDocumentThunk 
  } = usePatientDocuments(patientId);

  // Local state for demo data
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("thumbnails");
  const [sortMode, setSortMode] = useState("category");
  
  console.log("Documents:", documents);
  const claimAttachments = documents.filter(d => d.category.includes('claim') || d.category === 'attachment');
  const consents = documents.filter(d => d.category.includes('consent'));
  const forms = documents.filter(d => d.category.includes('form') || d.category === 'custom_form');
  const otherDocs = documents.filter(d => !d.category.includes('claim') && d.category !== 'attachment' && !d.category.includes('consent') && !d.category.includes('form') && d.category !== 'custom_form');

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    documentId: null,
    documentName: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [customFormDeleteDialog, setCustomFormDeleteDialog] = useState({
    open: false,
    formId: null,
    formTitle: "",
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    section: "",
    docId: null,
    name: "",
    type: "",
    category: "",
  });

  // Fetch patient and documents on mount
  // Fetch data on mount using Redux thunks
  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
      fetchDocuments();
    }
  }, [patientId, fetchPatient, fetchDocuments]);

  // Sync documents from Redux to local state for filtering
  useEffect(() => {
    if (reduxDocuments) {
      const nonHipaaDocs = reduxDocuments
        .filter((doc) => {
          const type = (doc.documentType || "").toLowerCase();
          const name = (doc.documentName || "").toLowerCase();
          return type !== "hipaa" && !name.includes("hipaa");
        })
        .map(doc => ({
          id: doc._id || doc.id,
          name: doc.documentName || "Unknown Document",
          uploadedBy: doc.uploadedBy?.name || "System",
          uploadedDate: new Date(doc.uploadDate || doc.createdAt || new Date()).toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' }),
          status: doc.status || "Completed",
          type: (doc.fileType || "PDF").toUpperCase(),
          category: (doc.documentType || "Other").toLowerCase(),
          title: doc.documentName || "Unknown Form"
        }));
      setDocuments(nonHipaaDocs);
    }
  }, [reduxDocuments]);

  // Loading state (only show loading if we don't have data in cache yet)
  const isActuallyLoading = docsLoading && documents.length === 0;

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName)
      return `${patient.firstName} ${patient.lastName}`;
    return "Patient";
  };

  // Upload document handler
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
        }

        // Fetch documents to refresh UI instead of locally mocking
        await refreshDocuments();

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

  // Document action handlers
  const handleOpenDocument = (row) => {
    if (row.id.startsWith("demo-")) {
      showSnackbar(`Opening ${row.name}...`, "info");
      return;
    }
    window.open(row.fileUrl || row.documentUrl, "_blank");
  };

  const handleDownloadDocument = (row) => {
    if (row.id.startsWith("demo-")) {
      showSnackbar(`Downloading ${row.name}...`, "info");
      return;
    }
    const link = document.createElement("a");
    link.href = row.fileUrl || row.documentUrl;
    link.download = row.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSnackbar("Document downloaded", "success");
  };

  const handleShareWithPatient = (row) => {
    if (row.id.startsWith("demo-")) {
      showSnackbar(`Sharing ${row.name} with patient...`, "info");
      return;
    }
    showSnackbar(`${row.name} shared with patient via portal`, "success");
  };

  const handleConfirmDeleteCustomForm = async () => {
    if (!customFormDeleteDialog.formId) {
      setCustomFormDeleteDialog({ open: false, formId: null, formTitle: "" });
      return;
    }
    try {
      await deleteDocumentThunk(customFormDeleteDialog.formId).unwrap();
      await refreshDocuments();
      showSnackbar("Custom form removed", "success");
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to remove custom form",
        "error"
      );
    } finally {
      setCustomFormDeleteDialog({ open: false, formId: null, formTitle: "" });
    }
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
          const formData = new FormData();
          formData.append("file", file);
          formData.append("patientId", patientId);
          formData.append("documentType", "custom_form");
          formData.append("documentName", file.name || `Custom form ${i + 1}`);
          
          await documentService.uploadDocument(formData);
        }

        // Fetch documents to refresh UI instead of locally mocking
        await refreshDocuments();

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

  const handleEditDocument = (section, row) => {
    setEditDialog({
      open: true,
      section,
      docId: row.id,
      name: row.name,
      type: row.type,
      category: row.category || "",
    });
  };

  const handleSaveEditDialog = async () => {
    const { docId, name, category } = editDialog;
    if (!docId) {
      setEditDialog((prev) => ({ ...prev, open: false }));
      return;
    }

    try {
      await documentService.updateDocument(docId, {
        documentName: name,
        documentType: category || "other"
      });
      await refreshDocuments();
      showSnackbar("Document details updated", "success");
    } catch (err) {
      showSnackbar("Failed to update document details", "error");
    } finally {
      setEditDialog((prev) => ({ ...prev, open: false }));
    }
  };

  // Delete document handler
  const handleDelete = async () => {
    const { documentId } = deleteDialog;
    if (!documentId) {
      setDeleteDialog({ open: false, documentId: null, documentName: "" });
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteDocumentThunk(documentId).unwrap();
      await refreshDocuments();
      showSnackbar("Document deleted successfully", "success");
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to delete document",
        "error",
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialog({ open: false, documentId: null, documentName: "" });
    }
  };

  if (isActuallyLoading && !patient) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer>
      <PatientSectionTabs activeTab="additional_docs" patientId={patientId} />

      <FloatingActions onUploadCustomForm={handleUploadCustomFormDocument} />

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

      {/* Custom Forms Section */}
      <CustomFormsSection
        customForms={forms}
        selectedFormId={customFormDeleteDialog.formId}
        onFormClick={(f) =>
          showSnackbar(
            `Opening form: ${(f.title || f.name || "Unknown Form").replace(/\n/g, " ")}`,
            "info",
          )
        }
        onFormDeleteClick={(f) =>
          setCustomFormDeleteDialog({
            open: true,
            formId: f.id,
            formTitle: (f.title || f.name || "Unknown Form").replace(/\n/g, " "),
          })
        }
      />

      {/* Additional Documents Section */}
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

        <Box sx={{ mt: 2 }}>
          {isActuallyLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : documents.length === 0 ? (
            <Alert severity="info">
              No additional documents for this patient. Click "Upload new
              document" to add one.
            </Alert>
          ) : viewMode === "thumbnails" ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {[...claimAttachments, ...consents, ...otherDocs].map((doc) => (
                <DocumentThumbnail
                  key={doc.id}
                  document={doc}
                  onOpen={handleOpenDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareWithPatient}
                />
              ))}
            </Box>
          ) : (
            <Box>
              {/* Claim Attachment section */}
              {claimAttachments.length > 0 && (
                <DocumentTable
                  title="Claim Attachment"
                  tooltipTitle="Uploaded claim-related attachments"
                  documents={claimAttachments}
                  sortMode={sortMode}
                  onEdit={(row) => handleEditDocument("claim", row)}
                  onOpen={handleOpenDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareWithPatient}
                  onDelete={(row) =>
                    setDeleteDialog({
                      open: true,
                      documentId: row.id,
                      documentName: row.name,
                    })
                  }
                />
              )}

              {/* Consent section */}
              {consents.length > 0 && (
                <DocumentTable
                  title="Consent"
                  tooltipTitle="Uploaded consent documents"
                  documents={consents}
                  sortMode={sortMode}
                  onEdit={(row) => handleEditDocument("consent", row)}
                  onOpen={handleOpenDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareWithPatient}
                  onDelete={(row) =>
                    setDeleteDialog({
                      open: true,
                      documentId: row.id,
                      documentName: row.name,
                    })
                  }
                />
              )}

              {/* Other Documents section */}
              {otherDocs.length > 0 && (
                <DocumentTable
                  title="Other Documents"
                  tooltipTitle="Additional uncategorized documents"
                  documents={otherDocs}
                  sortMode={sortMode}
                  onEdit={(row) => handleEditDocument("other", row)}
                  onOpen={handleOpenDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareWithPatient}
                  onDelete={(row) =>
                    setDeleteDialog({
                      open: true,
                      documentId: row.id,
                      documentName: row.name,
                    })
                  }
                />
              )}
            </Box>
          )}
        </Box>
      </Card>

      {/* Edit Document Dialog */}
      <EditDocumentDialog
        open={editDialog.open}
        section={editDialog.section}
        docId={editDialog.docId}
        name={editDialog.name}
        type={editDialog.type}
        category={editDialog.category}
        onClose={() => setEditDialog((prev) => ({ ...prev, open: false }))}
        onSave={handleSaveEditDialog}
      />

      {/* Delete Confirmation Dialogs */}
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