import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { documentService } from '../../services/document.service';
import { clinicalNoteService } from '../../services/clinical-note.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';
import { COLORS } from '../../constants/colors';
import {
  DocumentHeader,
  DocumentMetadataPanel,
  DocumentPreviewPanel,
  AttachToNoteDialog,
} from '../../components/documents';

const ViewDocumentPage = () => {
  const navigate = useNavigate();
  const { documentId, patientId } = useParams();
  const { showSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [document, setDocument] = useState(null);
  
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [attachDialog, setAttachDialog] = useState(false);
  const [attachLoading, setAttachLoading] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const data = await documentService.getDocumentById(documentId);
        setDocument(data);

        // Fetch unsigned clinical notes for attaching
        const pId = data.patientId?._id || data.patientId;
        if (pId) {
          const notesResult = await clinicalNoteService.getClinicalNotesByPatient(
            pId,
            1,
            50
          );
          setClinicalNotes(
            (notesResult.clinicalNotes || []).filter((n) => !n.isSigned)
          );
        }
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load document'
        );
        showSnackbar('Failed to load document', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [documentId, showSnackbar]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await documentService.deleteDocument(documentId);
      showSnackbar('Document deleted successfully', 'success');
      navigate(patientId ? `/patients/${patientId}/signed-documents` : '/documents');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete document',
        'error'
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  const handleAttachToNote = async () => {
    if (!selectedNoteId) {
      showSnackbar('Please select a clinical note', 'warning');
      return;
    }

    try {
      setAttachLoading(true);
      await documentService.attachToNote(documentId, selectedNoteId);
      showSnackbar('Document attached to clinical note successfully', 'success');
      setAttachDialog(false);
      setSelectedNoteId('');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to attach document',
        'error'
      );
    } finally {
      setAttachLoading(false);
    }
  };

  const getPatientName = () => {
    if (document?.patientId?.firstName) {
      return `${document.patientId.firstName} ${document.patientId.lastName || ''}`.trim();
    }
    if (typeof document?.patientId === 'string') {
      return `Patient ID: ${document.patientId}`;
    }
    return 'Unknown Patient';
  };

  const getUploadedByName = () => {
    if (document?.uploadedBy?.firstName) {
      return `${document.uploadedBy.firstName} ${document.uploadedBy.lastName || ''}`.trim();
    }
    if (typeof document?.uploadedBy === 'string') {
      return document.uploadedBy;
    }
    return 'Unknown';
  };

  const backPath = patientId ? `/patients/${patientId}/signed-documents` : '/documents';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !document) {
    return (
      <Box sx={patientId ? { bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 } : {}}>
        {patientId && <PatientSectionTabs activeTab="signed_docs" patientId={patientId} />}
        <Box sx={{ p: patientId ? 3 : 0 }}>
          <Alert severity="error">{error || 'Document not found'}</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={patientId ? { bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 } : {}}>
      {patientId && <PatientSectionTabs activeTab="signed_docs" patientId={patientId} />}
      <Box sx={{ p: patientId ? 3 : 0 }}>
        <DocumentHeader
          document={document}
          patientName={getPatientName()}
          onAttach={() => setAttachDialog(true)}
          onDelete={() => setDeleteDialog(true)}
          hasNotes={clinicalNotes.length > 0}
        />

        {/* Two-column body — mirrors BulkText modal DialogContent */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            alignItems: 'stretch',
            bgcolor: '#f8fafc',
            borderRadius: '12px',
            border: `1px solid #e2e8f0`,
            p: '16px',
            minHeight: 560,
          }}
        >
          {/* Left — Document Information (~340px fixed) */}
          <Box sx={{ width: '320px', flexShrink: 0 }}>
            <DocumentMetadataPanel
              document={document}
              patientName={getPatientName()}
              uploadedByName={getUploadedByName()}
            />
          </Box>

          {/* Right — Document Preview (fills remaining space) */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <DocumentPreviewPanel document={document} />
          </Box>
        </Box>
      </Box>

      <ConfirmationDialog
        open={deleteDialog}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        severity="error"
      />

      <AttachToNoteDialog
        open={attachDialog}
        onClose={() => setAttachDialog(false)}
        clinicalNotes={clinicalNotes}
        selectedNoteId={selectedNoteId}
        onChangeNote={setSelectedNoteId}
        onConfirm={handleAttachToNote}
        loading={attachLoading}
      />
    </Box>
  );
};

export default ViewDocumentPage;
