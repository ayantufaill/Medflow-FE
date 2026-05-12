import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const UploadFeeGuideDialog = ({ open, onClose, onUpload }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = React.useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}>
      <DialogTitle sx={{ bgcolor: '#4b71a1', color: 'white', py: 1.5, fontSize: '1rem', textAlign: 'center' }}>
        Upload Fee Guide
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
          Select a CSV or Excel file to upload the new fees. Ensure the column headers match the required format.
        </Typography>
        
        <Box 
          sx={{ 
            border: '2px dashed #e0e0e0', 
            borderRadius: 2, 
            p: 4, 
            textAlign: 'center',
            bgcolor: '#fcfcfc',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f5f5', borderColor: '#4b71a1' }
          }}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv, .xlsx, .xls"
          />
          <CloudUploadIcon sx={{ fontSize: 40, color: '#4b71a1', mb: 1 }} />
          <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
            {fileName || 'Click to select or drag and drop file'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            Supported formats: .CSV, .XLSX, .XLS
          </Typography>
        </Box>

        {fileName && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: '#4b71a1', fontWeight: 600 }}>
              Selected File: {fileName}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="contained" 
          disabled={!fileName}
          onClick={() => onUpload(fileName)}
          sx={{ bgcolor: '#4b71a1', '&:hover': { bgcolor: '#3d5c85' }, textTransform: 'none', px: 4 }}
        >
          Upload
        </Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ bgcolor: '#9e9e9e', '&:hover': { bgcolor: '#8e8e8e' }, textTransform: 'none', px: 4 }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadFeeGuideDialog;
