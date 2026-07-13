import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Assignment as CustomFormsIcon,
  FolderOutlined as AdditionalDocsIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { documentService } from "../../services/document.service";
import { usePatientDocuments } from "../../hooks/redux/usePatientDocuments";
import { usePatient } from "../../hooks/redux/usePatient";
import PatientSectionTabs from "../../components/patients/PatientSectionTabs";
import PatientSignatureCard from "../../components/patients/PatientSignatureCard";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";
import SectionCard from "../../components/shared/SectionCard";
import TaskList from "../../components/appointments/right-panel/TaskList";
import Messages from "../../components/appointments/right-panel/Messages";
import { CustomFormsSection, DocumentThumbnail, DocumentTable, EditDocumentDialog } from "../../components/patients";
import { MOCK_ADDITIONAL_DOCUMENTS } from "../../components/patients/utils/mockAdditionalDocuments";
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

const radioSx = {
  p: 0.5,
  color: COLORS.BORDER,
  "&.Mui-checked": { color: COLORS.ACCENT },
};

const PatientAdditionalDocumentsPage = () => {
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();

  const { currentPatient: patient, fetchById: fetchPatient } = usePatient();
  const {
    documents: reduxDocuments,
    loading: docsLoading,
    fetch: fetchDocuments,
    refresh: refreshDocuments,
    remove: deleteDocumentThunk,
  } = usePatientDocuments(patientId);

  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("thumbnails");
  const [sortMode, setSortMode] = useState("category");
  const [signature, setSignature] = useState(null);

  const claimAttachments = documents.filter(d => d.category.includes('claim') || d.category === 'attachment');
  const consents = documents.filter(d => d.category.includes('consent'));
  const forms = documents.filter(d => d.category.includes('form') || d.category === 'custom_form');
  const otherDocs = documents.filter(d => !d.category.includes('claim') && d.category !== 'attachment' && !d.category.includes('consent') && !d.category.includes('form') && d.category !== 'custom_form');

  // No real documents uploaded yet — show dummy attachments so the section
  // reads as designed instead of an empty state.
  const additionalDocs = [...claimAttachments, ...consents, ...otherDocs];
  const displayDocs = additionalDocs.length > 0 ? additionalDocs : MOCK_ADDITIONAL_DOCUMENTS;
  const usingMockDocs = additionalDocs.length === 0;

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

  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
      fetchDocuments();
    }
  }, [patientId, fetchPatient, fetchDocuments]);

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
          title: doc.documentName || "Unknown Form",
          fileUrl: doc.fileUrl || doc.documentUrl,
          documentUrl: doc.fileUrl || doc.documentUrl
        }));
      setDocuments(nonHipaaDocs);
    }
  }, [reduxDocuments]);

  const isActuallyLoading = docsLoading && documents.length === 0;

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
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("patientId", patientId);
          formData.append("documentType", "other");
          formData.append("documentName", file.name || `Additional document ${i + 1}`);
          await documentService.uploadDocument(formData);
        }
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

  const handleOpenDocument = (row) => {
    if (row.id.startsWith("demo-")) {
      showSnackbar(`Opening ${row.name}...`, "info");
      return;
    }
    const url = row.fileUrl || row.documentUrl;
    if (!url) {
      showSnackbar("Error: File URL is missing", "error");
      return;
    }
    window.open(url, "_blank");
  };

  const handleDownloadDocument = (row) => {
    if (row.id.startsWith("demo-")) {
      showSnackbar(`Downloading ${row.name}...`, "info");
      return;
    }
    const url = row.fileUrl || row.documentUrl;
    if (!url) {
      showSnackbar("Error: File URL is missing", "error");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = row.name || "document";
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
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("patientId", patientId);
          formData.append("documentType", "custom_form");
          formData.append("documentName", file.name || `Custom form ${i + 1}`);
          await documentService.uploadDocument(formData);
        }
        await refreshDocuments();
        showSnackbar(`Uploaded ${files.length} custom form document(s)`, "success");
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
    } catch {
      showSnackbar("Failed to update document details", "error");
    } finally {
      setEditDialog((prev) => ({ ...prev, open: false }));
    }
  };

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
    <Box sx={{ bgcolor: COLORS.SURFACE_PAGE, minHeight: "100%", pb: 4 }}>
      <PatientSectionTabs activeTab="additional_docs" patientId={patientId} />

      {/* Page header */}
      <Box
        sx={{
          mt: 1.5,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          bgcolor: COLORS.SURFACE_CARD,
          border: `1px solid ${COLORS.BORDER}`,
          borderRadius: radius.lg,
          px: 2.5,
          py: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontFamily: "Inter", fontWeight: fontWeight.bold, fontSize: fontSize.xl, color: COLORS.TEXT_PRIMARY }}>
            Additional Docs
          </Typography>
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mt: 0.25 }}>
            Check the custom forms and additional documents
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="contained" size="small" sx={shareButtonSx}>
            Share via Text
          </Button>
          <Button variant="contained" size="small" sx={shareButtonSx}>
            Share via email
          </Button>
        </Box>
      </Box>

      {/* Main column + sidebar */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "3fr 1fr" }, gap: 2, alignItems: "start" }}>
        <Box>
          <SectionCard
            icon={CustomFormsIcon}
            title="Custom Forms"
            action={
              <AddIcon
                onClick={uploading ? undefined : handleUploadCustomFormDocument}
                sx={{ fontSize: "20px", color: COLORS.TEXT_MUTED, cursor: uploading ? "default" : "pointer", "&:hover": uploading ? undefined : { color: COLORS.ACCENT } }}
              />
            }
          >
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
          </SectionCard>

          <SectionCard icon={AdditionalDocsIcon} title="Additional Docs" sx={{ minHeight: 560 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <RadioGroup
                  row
                  value={viewMode}
                  onChange={(_, v) => setViewMode(v)}
                  sx={{ gap: 0.5 }}
                >
                  <FormControlLabel
                    value="thumbnails"
                    control={<Radio size="small" sx={radioSx} />}
                    label={<Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY }}>Thumbnails</Typography>}
                  />
                  <FormControlLabel
                    value="list"
                    control={<Radio size="small" sx={radioSx} />}
                    label={<Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY }}>List View</Typography>}
                  />
                </RadioGroup>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
                    Sort by:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value)}
                      sx={{
                        height: 32,
                        fontFamily: "Inter",
                        fontSize: fontSize.base,
                        bgcolor: COLORS.SURFACE_CARD,
                        "& fieldset": { borderColor: COLORS.BORDER },
                        "&:hover fieldset": { borderColor: COLORS.ACCENT },
                      }}
                    >
                      <MenuItem value="category">Category</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="name">Name</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon fontSize="small" />}
                onClick={uploading ? undefined : handleUploadAdditionalDocument}
                disabled={uploading}
                sx={shareButtonSx}
              >
                Upload New Document
              </Button>
            </Box>

            {isActuallyLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : viewMode === "thumbnails" ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {displayDocs.map((doc) => (
                  <DocumentThumbnail key={doc.id} document={doc} onOpen={handleOpenDocument} />
                ))}
              </Box>
            ) : usingMockDocs ? (
              <DocumentTable
                title="Other Documents"
                tooltipTitle="Additional uncategorized documents"
                documents={displayDocs}
                sortMode={sortMode}
                onEdit={() => {}}
                onOpen={handleOpenDocument}
                onDownload={handleDownloadDocument}
                onShare={handleShareWithPatient}
                onDelete={() => {}}
              />
            ) : (
              <Box>
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
                      setDeleteDialog({ open: true, documentId: row.id, documentName: row.name })
                    }
                  />
                )}

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
                      setDeleteDialog({ open: true, documentId: row.id, documentName: row.name })
                    }
                  />
                )}

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
                      setDeleteDialog({ open: true, documentId: row.id, documentName: row.name })
                    }
                  />
                )}
              </Box>
            )}
          </SectionCard>
        </Box>

        {/* Sidebar — same Task List / Messages / Signature cards used across
            the other patient tabs, so this column reads as one consistent
            shell rather than a one-off for Additional Docs. */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TaskList />
          <Messages />
          <PatientSignatureCard value={signature} onChange={setSignature} reviewedWithPatient />

        </Box>
      </Box>

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

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, documentId: null, documentName: "" })}
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
        onClose={() => setCustomFormDeleteDialog({ open: false, formId: null, formTitle: "" })}
        onConfirm={handleConfirmDeleteCustomForm}
        title="Remove Custom Form"
        message={`Are you sure you want to remove "${customFormDeleteDialog.formTitle}" from this list?`}
        confirmText="Remove"
        cancelText="Cancel"
        confirmColor="error"
        loading={false}
      />
    </Box>
  );
};

export default PatientAdditionalDocumentsPage;
