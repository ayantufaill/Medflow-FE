import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FileUploadOutlined as UploadIcon,
  Close as CloseIcon,
  DescriptionOutlined as DescriptionIcon
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

const PrePostOpsForm = ({
  open,
  type,
  setType,
  sendHours,
  setSendHours,
  sendUnit,
  setSendUnit,
  fileOption,
  setFileOption,
  docName,
  setDocName,
  procedures,
  setProcedures,
  handleSaveDocument,
  handleClose,
  editingId
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
            {editingId ? 'Edit Pre/Post Operation Document' : 'Add New Pre/Post Operation Document'}
          </Typography>
          <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
            Create or edit a pre/post operation document.
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* Type Selection */}
          <Box>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
              Type
            </Typography>
            <RadioGroup
              row
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <FormControlLabel 
                value="Post Operation" 
                control={<Radio size="small" sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>Post Operation</Typography>} 
              />
              <FormControlLabel 
                value="Pre Operation" 
                control={<Radio size="small" sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>Pre Operation</Typography>} 
              />
            </RadioGroup>
          </Box>

          {/* Send form to patient */}
          <Box>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
              Send form to patient
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TextField 
                size="small"
                value={sendHours}
                onChange={(e) => setSendHours(e.target.value)}
                sx={{ 
                  width: 80,
                  '& .MuiInputBase-input': { fontFamily: "Inter", fontSize: "13px", textAlign: 'center' },
                  '& .MuiOutlinedInput-root': { borderRadius: "8px", backgroundColor: '#fff' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
                }} 
              />
              <TextField 
                select
                size="small"
                SelectProps={{ native: true }}
                value={sendUnit} 
                onChange={(e) => setSendUnit(e.target.value)}
                sx={{ 
                  width: 120,
                  '& .MuiInputBase-input': { fontFamily: "Inter", fontSize: "13px" },
                  '& .MuiOutlinedInput-root': { borderRadius: "8px", backgroundColor: '#fff' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
                }}
              >
                <option value="hours">hours</option>
                <option value="days">days</option>
              </TextField>
              <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#475569" }}>
                after appointment.
              </Typography>
            </Box>
          </Box>

          {/* File Option Selection */}
          <Box>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
              File Type
            </Typography>
            <RadioGroup
              row
              value={fileOption}
              onChange={(e) => setFileOption(e.target.value)}
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

          {/* Dotted Upload Box */}
          {fileOption === 'Upload PDF' && (
            <Box>
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
                  '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: '#f1f5f9'
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5
                }}
              >
                <UploadIcon sx={{ color: '#94a3b8', fontSize: '2.5rem', mb: 1 }} />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography sx={{ fontSize: '0.95rem', color: '#64748b' }}>
                    Drop items here or <Typography component="span" sx={{ color: '#3b82f6', fontWeight: 600 }}>Browse Files</Typography>
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.5 }}>
                    Up to 1MB • File name without special characters
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Document Name */}
          <Box>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
              Document Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g., Post-Extraction Instructions"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              sx={{ 
                '& .MuiInputBase-input': { fontFamily: "Inter", fontSize: "13px" },
                '& .MuiOutlinedInput-root': { borderRadius: "8px", backgroundColor: '#fff' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
              }}
            />
          </Box>

          {/* Procedures */}
          <Box>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "6px" }}>
              Procedures
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g., General Extraction"
              value={procedures}
              onChange={(e) => setProcedures(e.target.value)}
              sx={{ 
                '& .MuiInputBase-input': { fontFamily: "Inter", fontSize: "13px" },
                '& .MuiOutlinedInput-root': { borderRadius: "8px", backgroundColor: '#fff' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' }
              }}
            />
          </Box>

        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
        <Button
          onClick={handleClose}
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
          variant="contained"
          onClick={handleSaveDocument}
          disabled={!docName}
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
          {editingId ? 'Update Pre/Post-Op' : 'Add Pre/Post-Op'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrePostOpsForm;
