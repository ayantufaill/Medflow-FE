import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { DocumentForm } from '../../components/documents';

const UploadDocumentPage = () => {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patientId');
  const appointmentIdParam = searchParams.get('appointmentId');

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Upload Document
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Add a new document to patient records
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <DocumentForm
          mode="create"
          patientIdParam={patientIdParam}
          appointmentIdParam={appointmentIdParam}
        />
      </Paper>
    </Box>
  );
};

export default UploadDocumentPage;
