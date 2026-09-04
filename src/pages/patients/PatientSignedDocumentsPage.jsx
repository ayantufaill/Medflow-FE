import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Description as DocIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { fetchCurrentPracticeInfo } from "../../store/slices/practiceInfoSlice";
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
import { DocumentThumbnail, DocumentTable, EditDocumentDialog, UploadAdditionalDocumentDialog } from "../../components/patients";
import { downloadDocumentFile } from "../../utils/downloadUtils";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius, roundedSelectMenuProps } from "../../constants/styles";

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

const isHipaDocument = (doc) => {
  const combined =
    `${doc.documentType || ""} ${doc.documentName || ""} ${doc.category || ""}`.toLowerCase();
  return combined.includes("hipaa");
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

const PatientSignedDocumentsPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  // Redux hooks
  const { currentPatient: patient, fetchById: fetchPatient } = usePatient();
  const {
    documents: reduxDocuments,
    loading: docsLoading,
    fetch: fetchDocuments,
    refresh: refreshDocuments,
    remove,
  } = usePatientDocuments(patientId);

  const [viewMode, setViewMode] = useState("thumbnails");
  const [sortMode, setSortMode] = useState("category");
  const [signature, setSignature] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [uploadDialog, setUploadDialog] = useState({ open: false, files: [] });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    documentId: null,
    documentName: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editDialog, setEditDialog] = useState({
    open: false,
    section: "",
    docId: null,
    name: "",
    type: "",
    category: "",
  });

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  useEffect(() => {
    if (patientId) {
      fetchPatient(patientId);
      fetchDocuments();
    }
  }, [patientId, fetchPatient, fetchDocuments]);

  const isActuallyLoading = docsLoading && (!reduxDocuments || reduxDocuments.length === 0);

  // Map raw documents to standardized UI documents
  const mappedDocs = (reduxDocuments || []).map((doc) => ({
    id: doc._id || doc.id,
    name: doc.documentName || doc.title || "Signed Document",
    uploadedBy: doc.uploadedBy?.name || (doc.uploadedBy?.firstName ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}` : "System"),
    uploadedDate: new Date(doc.uploadDate || doc.createdAt || new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    status: doc.status || "Completed",
    type: (doc.fileType || "PDF").toUpperCase(),
    category: (doc.documentType || "Signed Form").toLowerCase(),
    title: doc.documentName || "Signed Form",
    fileUrl: doc.fileUrl || doc.documentUrl || doc.storagePath,
    documentUrl: doc.fileUrl || doc.documentUrl || doc.storagePath,
    rawDoc: doc,
  }));

  const hipaaDocs = mappedDocs.filter((doc) => isHipaDocument(doc.rawDoc));
  const signedDocs = mappedDocs.filter((doc) => {
    const type = (doc.rawDoc.documentType || doc.rawDoc.type || "").toLowerCase();
    const name = (doc.rawDoc.documentName || doc.rawDoc.title || doc.rawDoc.name || "").toLowerCase();
    const category = (doc.rawDoc.category || "").toLowerCase();
    const isConsentOrSigned =
      type === "consent_form" ||
      type === "consent" ||
      type.includes("signed") ||
      name.includes("consent") ||
      name.includes("signed") ||
      category.includes("consent");
    return isConsentOrSigned && !isHipaDocument(doc.rawDoc);
  });

  const allSignedDocs = mappedDocs.filter(d => isHipaDocument(d.rawDoc) || d.category.includes('consent') || d.category.includes('signed') || d.name.toLowerCase().includes('signed'));

  const displaySignedDocs = allSignedDocs.length > 0 ? allSignedDocs : mappedDocs;

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName)
      return `${patient.firstName} ${patient.lastName}`;
    return "Patient";
  };

  const handleUploadSignedDocument = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";
    input.multiple = true;
    input.onchange = () => {
      const files = input.files;
      if (!files?.length || !patientId) return;
      setUploadDialog({ open: true, files: Array.from(files) });
    };
    input.click();
  };

  const handleConfirmUpload = async ({ name, category, files }) => {
    try {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("patientId", patientId);
        formData.append("documentType", category || "consent_form");
        formData.append("documentName", name || file.name || `Signed document ${i + 1}`);
        await documentService.uploadDocument(formData);
      }
      await refreshDocuments();
      showSnackbar(`Uploaded ${files.length} signed document(s)`, "success");
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to upload signed document",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleOpenDocument = (row) => {
    if (row.id && String(row.id).startsWith("demo-")) {
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
    downloadDocumentFile(row, showSnackbar);
  };

  const handleShareWithPatient = (row) => {
    if (row.id && String(row.id).startsWith("demo-")) {
      showSnackbar(`Sharing ${row.name} with patient...`, "info");
      return;
    }
    showSnackbar(`${row.name} shared with patient via portal`, "success");
  };

  const handleEditDocument = (section, row) => {
    setEditDialog({
      open: true,
      section,
      docId: row.id,
      name: row.name,
      type: row.type,
      category: row.category,
    });
  };

  const handleSaveEditDialog = async ({ docId, name, type, category }) => {
    try {
      if (docId && !String(docId).startsWith("demo-")) {
        await documentService.updateDocument(docId, {
          documentName: name,
          documentType: category,
          fileType: type,
        });
        await refreshDocuments();
        showSnackbar("Document updated successfully", "success");
      } else {
        showSnackbar("Updated local document preview", "info");
      }
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message || "Failed to update document",
        "error"
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.documentId) return;
    try {
      setDeleteLoading(true);
      await remove(deleteDialog.documentId).unwrap();
      showSnackbar("Signed document deleted", "success");
    } catch (err) {
      showSnackbar(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Failed to delete document",
        "error"
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialog({ open: false, documentId: null, documentName: "" });
    }
  };

  return (
    <PageContainer>
      <PatientSectionTabs activeTab="signed_docs" patientId={patientId} />

      {/* Header Bar matching Additional Docs Page */}
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

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => showSnackbar("Text sharing feature ready", "info")}
            sx={shareButtonSx}
          >
            Share via Text
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => showSnackbar("Email sharing feature ready", "info")}
            sx={shareButtonSx}
          >
            Share via email
          </Button>
        </Box>
      </Box>

      {/* Main Grid: Left Documents Panel + Right Sidebar */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <SectionCard icon={DocIcon} title="Signed Forms">
            {/* View controls toolbar identical to Additional Docs */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mb: 2,
                pb: 1.5,
                borderBottom: `1px solid ${COLORS.BORDER}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                  >
                    <FormControlLabel
                      value="thumbnails"
                      control={<Radio size="small" sx={radioSx} />}
                      label={
                        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_BODY }}>
                          Thumbnails
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="list"
                      control={<Radio size="small" sx={radioSx} />}
                      label={
                        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_BODY }}>
                          List View
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
                    Sort by:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value)}
                      MenuProps={roundedSelectMenuProps}
                      sx={{
                        fontFamily: "Inter",
                        fontSize: fontSize.base,
                        borderRadius: radius.md,
                        height: 32,
                        backgroundColor: COLORS.SURFACE_CARD,
                        "& fieldset": { borderColor: COLORS.BORDER },
                        "&:hover fieldset": { borderColor: COLORS.ACCENT },
                      }}
                    >
                      <MenuItem value="category" sx={{ fontFamily: "Inter", fontSize: fontSize.base }}>Category</MenuItem>
                      <MenuItem value="name" sx={{ fontFamily: "Inter", fontSize: fontSize.base }}>Name</MenuItem>
                      <MenuItem value="date" sx={{ fontFamily: "Inter", fontSize: fontSize.base }}>Date</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleUploadSignedDocument}
                disabled={uploading}
                sx={{
                  textTransform: "none",
                  borderRadius: radius.md,
                  bgcolor: COLORS.ACCENT,
                  fontWeight: fontWeight.semibold,
                  fontSize: fontSize.base,
                  boxShadow: "none",
                  "&:hover": { bgcolor: COLORS.ACCENT_HOVER, boxShadow: "none" },
                }}
              >
                + Upload New Document
              </Button>
            </Box>

            {isActuallyLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : displaySignedDocs.length === 0 ? (
              <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_MUTED, py: 2 }}>
                No signed documents uploaded yet. Click the upload button to add one.
              </Typography>
            ) : viewMode === "thumbnails" ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {displaySignedDocs.map((doc) => (
                  <DocumentThumbnail key={doc.id} document={doc} onOpen={handleOpenDocument} />
                ))}
              </Box>
            ) : (
              <Box>
                {hipaaDocs.length > 0 && (
                  <DocumentTable
                    title="HIPAA Document"
                    tooltipTitle="Signed HIPAA & Compliance Forms"
                    documents={hipaaDocs}
                    sortMode={sortMode}
                    onEdit={(row) => handleEditDocument("hipaa", row)}
                    onOpen={handleOpenDocument}
                    onDownload={handleDownloadDocument}
                    onShare={handleShareWithPatient}
                    onDelete={(row) =>
                      setDeleteDialog({ open: true, documentId: row.id, documentName: row.name })
                    }
                  />
                )}

                {signedDocs.length > 0 && (
                  <DocumentTable
                    title="Signed Forms"
                    tooltipTitle="Signed Consent & Treatment Forms"
                    documents={signedDocs}
                    sortMode={sortMode}
                    onEdit={(row) => handleEditDocument("signed", row)}
                    onOpen={handleOpenDocument}
                    onDownload={handleDownloadDocument}
                    onShare={handleShareWithPatient}
                    onDelete={(row) =>
                      setDeleteDialog({ open: true, documentId: row.id, documentName: row.name })
                    }
                  />
                )}

                {hipaaDocs.length === 0 && signedDocs.length === 0 && (
                  <DocumentTable
                    title="Signed Forms"
                    tooltipTitle="Signed Forms"
                    documents={displaySignedDocs}
                    sortMode={sortMode}
                    onEdit={(row) => handleEditDocument("signed", row)}
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

        {/* Sidebar: Task List / Messages / Patient Signature Card */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TaskList />
          <Messages />
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

      <UploadAdditionalDocumentDialog
        open={uploadDialog.open}
        files={uploadDialog.files}
        onClose={() => setUploadDialog({ open: false, files: [] })}
        onSave={handleConfirmUpload}
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
    </PageContainer>
  );
};

export default PatientSignedDocumentsPage;