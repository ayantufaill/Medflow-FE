import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { eraService } from '../../services/era.service';

const ImportERAPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (.835, .txt, .edi, or .csv for demo)
    const validExtensions = ['.835', '.txt', '.edi', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      showSnackbar('Please select a valid ERA file (.835, .txt, .edi, or .csv)', 'error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showSnackbar('File size must be less than 10MB', 'error');
      return;
    }

    setSelectedFile(file);
    setError('');
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showSnackbar('Please select a file to import', 'error');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setImportResult(null);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileName', selectedFile.name);

      const result = await eraService.importERAFile(formData);
      setImportResult(result);
      showSnackbar('ERA file imported successfully', 'success');
      
      // Auto-post payments if enabled
      if (result.autoPosted) {
        showSnackbar(`Auto-posted ${result.postedCount || 0} payment(s)`, 'success');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to import ERA file';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/era')}>
          Back to ERA
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Import ERA/EOB File
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload and process Electronic Remittance Advice (ERA) or Explanation of Benefits (EOB) files
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select ERA File
            </Typography>
            <Box sx={{ mt: 3 }}>
              <input
                accept=".835,.txt,.edi,.csv,text/csv,text/plain,application/csv"
                style={{ display: 'none' }}
                id="era-file-upload"
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <label htmlFor="era-file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  size="large"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                  sx={{ py: 3, borderStyle: 'dashed' }}
                >
                  {selectedFile ? selectedFile.name : 'Click to select ERA file (.835, .txt, .edi, .csv)'}
                </Button>
              </label>
              {selectedFile && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    File: {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedFile(null);
                  setImportResult(null);
                  setError('');
                }}
                disabled={uploading}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={uploading || !selectedFile}
                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              >
                {uploading ? 'Importing...' : 'Import ERA File'}
              </Button>
            </Box>
          </Paper>

          {importResult && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Import Results
              </Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  ERA file processed successfully!
                </Typography>
                {importResult.message && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {importResult.message}
                  </Typography>
                )}
              </Alert>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Records"
                    secondary={importResult.totalRecords || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Matched Payments"
                    secondary={importResult.matchedCount || 0}
                  />
                </ListItem>
                {importResult.unmatchedCount > 0 && (
                  <ListItem>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Unmatched Items"
                      secondary={importResult.unmatchedCount}
                    />
                  </ListItem>
                )}
                {importResult.autoPosted && (
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Auto-Posted Payments"
                      secondary={importResult.postedCount || 0}
                    />
                  </ListItem>
                )}
              </List>
              {importResult.unmatchedCount > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/era/unmatched')}
                  >
                    View Unmatched Items
                  </Button>
                </Box>
              )}
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About ERA/EOB Import
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Electronic Remittance Advice (ERA) files contain payment information from insurance companies.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Supported formats:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary=".835 (X12 835 format)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary=".txt (Text format)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary=".edi (EDI format)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary=".csv (CSV format for demo)" />
                </ListItem>
              </List>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Features:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Automatic payment matching
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Auto-posting to invoices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Unmatched item tracking
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImportERAPage;
