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
  Delete as DeleteIcon,
  Close as CloseIcon,
  DescriptionOutlined as DescriptionIcon
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
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "20px", py: "16px",
        borderBottom: "1px solid #e0e5eb",
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f" }}>
            Add New Informed Consent
          </Typography>
          <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
            Create a new informed consent document.
          </Typography>
        </Box>
        <IconButton onClick={() => setAddDialogOpen(false)} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Box sx={{ mb: 4, mt: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151" }}>File Type:</Typography>
          <RadioGroup 
            row 
            value={newConsentDraft.fileType} 
            onChange={(e) => setNewConsentDraft({ ...newConsentDraft, fileType: e.target.value })}
          >
            <FormControlLabel 
              value="Upload PDF" 
              control={<Radio size="small" sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>Upload PDF</Typography>} 
            />
            <FormControlLabel 
              value="Create Form" 
              control={<Radio size="small" sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }} />} 
              label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>Create Form</Typography>} 
            />
          </RadioGroup>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
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
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
            Informed Consent Name
          </Typography>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="e.g., General Extraction Consent" 
            value={newConsentDraft.name} 
            onChange={(e) => setNewConsentDraft({ ...newConsentDraft, name: e.target.value })} 
            sx={{ 
              '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#fff' },
              '& .MuiInputBase-input': { fontFamily: 'Inter', fontSize: '13px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } 
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
            Procedures
          </Typography>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="e.g., D7140 - Extraction, erupted tooth or exposed root" 
            value={newConsentDraft.procedures} 
            onChange={(e) => setNewConsentDraft({ ...newConsentDraft, procedures: e.target.value })} 
            sx={{ 
              '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#fff' },
              '& .MuiInputBase-input': { fontFamily: 'Inter', fontSize: '13px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } 
            }}
          />
        </Box>

        <Divider sx={{ my: 4, borderColor: '#e2e8f0' }} />

        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
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
                  label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>{item}</Typography>}
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
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveConsent}
          variant="contained"
          disabled={!newConsentDraft.name}
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
            "&.Mui-disabled": { backgroundColor: "#e0e5eb", color: "#9aa3ae" }
          }}
        >
          Add Consent
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddConsentDialog;
