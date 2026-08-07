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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ zIndex: 1400, '& .MuiDialog-paper': { borderRadius: '12px', overflow: 'hidden' } }}>
      <DialogTitle sx={{ backgroundColor: '#F1F5FD', color: '#111', py: 2, px: 3, fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Upload Fee Guide
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
          Select a CSV or Excel file to upload the new fees. Ensure the column headers match the required format.
        </Typography>

        <Box
          sx={{
            border: '2px dashed #cbd5e1',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            bgcolor: '#f8fafc',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#2262ef' }
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
          <CloudUploadIcon sx={{ fontSize: 40, color: '#2262ef', mb: 1 }} />
          <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
            {fileName || 'Click to select or drag and drop file'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            Supported formats: .CSV, .XLSX, .XLS
          </Typography>
        </Box>

        {fileName && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: '#2262ef', fontWeight: 600 }}>
              Selected File: {fileName}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ color: '#64748b', borderColor: '#cbd5e1', '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' }, textTransform: 'none', px: 3, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!fileName}
          onClick={() => onUpload(fileName)}
          sx={{ bgcolor: '#2262ef', color: '#fff', '&:hover': { bgcolor: '#1d4ed8' }, textTransform: 'none', px: 3, fontWeight: 600, boxShadow: 'none' }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadFeeGuideDialog;
