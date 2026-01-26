import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, IconButton, CircularProgress, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { DocumentForm } from '../../components/documents';
import { documentService } from '../../services/document.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

const EditDocumentPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const doc = await documentService.getDocumentById(documentId);
        setDocument(doc);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load document');
        showSnackbar('Failed to load document', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId, showSnackbar]);

  const handleSuccess = () => {
    const patientId = typeof document?.patientId === 'object' 
      ? document.patientId._id 
      : document?.patientId;
    if (patientId) {
      navigate(`/patients/${patientId}`);
    } else {
      navigate('/documents');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Edit Document
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Update document information
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <DocumentForm
          mode="edit"
          initialData={document}
          onSuccess={handleSuccess}
        />
      </Paper>
    </Box>
  );
};

export default EditDocumentPage;
