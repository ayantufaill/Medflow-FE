import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  IconButton
} from '@mui/material';
import {
  FileUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const AddConsentDialog = ({
  isAddDialogOpen,
  setAddDialogOpen,
  newConsentDraft,
  setNewConsentDraft,
  handleFileChange,
  fileInputRef,
  handleSaveConsent
}) => {
  return (
    <Dialog 
      open={isAddDialogOpen} 
      onClose={() => setAddDialogOpen(false)} 
      maxWidth="md" 
      fullWidth 
      sx={{ zIndex: 9999 }}
      PaperProps={{ 
        sx: { 
          borderRadius: 3,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        } 
      }}
    >
      <DialogTitle sx={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: 700, pb: 2, pt: 3, px: 4, borderBottom: '1px solid #f1f5f9' }}>
        Add New Informed Consent
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Box sx={{ mb: 4, mt: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>File Type:</Typography>
          <RadioGroup 
            row 
            value={newConsentDraft.fileType} 
            onChange={(e) => setNewConsentDraft({ ...newConsentDraft, fileType: e.target.value })}
          >
            <FormControlLabel 
              value="Upload PDF" 
              control={<Radio size="small" sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.9rem', color: '#475569' }}>Upload PDF</Typography>} 
            />
            <FormControlLabel 
              value="Create Form" 
              control={<Radio size="small" sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontSize: '0.9rem', color: '#475569' }}>Create Form</Typography>} 
            />
          </RadioGroup>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', mb: 1.5 }}>
            Upload PDF <Typography component="span" sx={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 400 }}>(The system only accepts .pdf files)</Typography>
          </Typography>
          
          <Box 
            sx={{ 
              border: '2px dashed #cbd5e1', 
              borderRadius: 2, 
              p: 5, 
              textAlign: 'center', 
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#94a3b8' }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <UploadIcon sx={{ fontSize: '2.5rem', color: '#94a3b8', mb: 1.5 }} />
            
            {newConsentDraft.selectedFile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#3b82f6' }}>
                  {newConsentDraft.selectedFile.name}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setNewConsentDraft({ ...newConsentDraft, selectedFile: null });
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  sx={{ color: '#ef4444', backgroundColor: '#fef2f2', '&:hover': { backgroundColor: '#fee2e2' } }}
                >
                  <DeleteIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            ) : (
              <>
                <Typography sx={{ fontSize: '0.95rem', color: '#64748b', mb: 0.5 }}>
                  Drop items here or <Typography component="span" sx={{ color: '#3b82f6', fontWeight: 600 }}>Browse Files</Typography>
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Up to 3MB • Filename without special characters
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', mb: 1 }}>
            Informed Consent Name
          </Typography>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="e.g., General Extraction Consent" 
            value={newConsentDraft.name} 
            onChange={(e) => setNewConsentDraft({ ...newConsentDraft, name: e.target.value })} 
            sx={{ 
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' } 
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', mb: 1 }}>
            Procedures
          </Typography>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="e.g., D7140 - Extraction, erupted tooth or exposed root" 
            value={newConsentDraft.procedures} 
            onChange={(e) => setNewConsentDraft({ ...newConsentDraft, procedures: e.target.value })} 
            sx={{ 
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' } 
            }}
          />
        </Box>

        <Divider sx={{ my: 4, borderColor: '#e2e8f0' }} />

        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', mb: 2 }}>
            Signature Requirements
          </Typography>
          <Grid container spacing={2}>
            {['Guardian', 'Office', 'Patient', 'Witness', 'Doctor', 'Other'].map((item) => (
              <Grid item xs={4} sm={4} key={item}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small" 
                      checked={newConsentDraft.signatures[item.toLowerCase()]} 
                      onChange={(e) => setNewConsentDraft({ ...newConsentDraft, signatures: { ...newConsentDraft.signatures, [item.toLowerCase()]: e.target.checked } })} 
                      sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>{item}</Typography>}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
        <Button
          onClick={() => setAddDialogOpen(false)}
          variant="outlined"
          sx={{ 
            borderColor: '#cbd5e1', 
            color: '#475569', 
            textTransform: 'none', 
            px: 4, 
            borderRadius: 1.5,
            fontWeight: 600,
            '&:hover': { backgroundColor: '#f8fafc', borderColor: '#94a3b8' } 
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveConsent}
          variant="contained"
          disabled={!newConsentDraft.name}
          sx={{ 
            backgroundColor: '#3b82f6', 
            color: '#fff', 
            textTransform: 'none', 
            px: 4, 
            borderRadius: 1.5,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#2563eb', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' },
            '&.Mui-disabled': { backgroundColor: '#94a3b8', color: '#f1f5f9' }
          }}
        >
          Add Consent
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddConsentDialog;
