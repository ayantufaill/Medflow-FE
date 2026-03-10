import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DocIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { documentService } from '../../services/document.service';
import { patientService } from '../../services/patient.service';
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';

const isHipaDocument = (doc) => {
  const type = (doc.documentType || '').toLowerCase();
  const name = (doc.documentName || '').toLowerCase();
  return type === 'hipaa' || name.includes('hipaa');
};

const formatDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

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
          showSnackbar(err.response?.data?.error?.message || 'Failed to load signed documents', 'error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [patientId, showSnackbar]);

  const hipaaDocs = documents.filter(isHipaDocument);
  const signedDocs = documents.filter((d) => !isHipaDocument(d));

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName) return `${patient.firstName} ${patient.lastName}`;
    return 'Patient';
  };

  const DocCard = ({ doc }) => (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
      }}
      onClick={() => navigate(`/documents/${doc._id}`)}
    >
      <Box sx={{ color: 'success.main', mt: 0.25 }}>
        <DocIcon sx={{ fontSize: 28 }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {doc.documentName || 'Document'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(doc.createdAt)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="caption" color="text.secondary">
            Signed
          </Typography>
        </Box>
      </Box>
      <Tooltip title="View">
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/documents/${doc._id}`); }}>
          <ViewIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );

  if (loading && !patient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PatientSectionTabs activeTab="signed_docs" patientId={patientId} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/patients/details/${patientId}`)}
          size="small"
        >
          Back to patient
        </Button>
        <Typography variant="h6" fontWeight="bold">
          Signed Documents — {getPatientName()}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Alert severity="info">No signed documents for this patient.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {hipaaDocs.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                HIPAA Document:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {hipaaDocs.map((doc) => (
                  <DocCard key={doc._id} doc={doc} />
                ))}
              </Box>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Signed Documents:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {signedDocs.map((doc) => (
                <Box key={doc._id} sx={{ minWidth: 280, maxWidth: 360 }}>
                  <DocCard doc={doc} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PatientSignedDocumentsPage;
