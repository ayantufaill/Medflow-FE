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
} from '@mui/icons-material';

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
      <DialogTitle sx={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: 700, pb: 2, pt: 3, px: 4, borderBottom: '1px solid #f1f5f9' }}>
        {editingId ? 'Edit Pre/Post Operation Document' : 'Add New Pre/Post Operation Document'}
      </DialogTitle>
      
      <DialogContent sx={{ px: 4, py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* Type Selection */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', mb: 1.5 }}>
              Type
            </Typography>
            <RadioGroup
              row
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <FormControlLabel 
                value="Post Operation" 
                control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>Post Operation</Typography>} 
              />
              <FormControlLabel 
                value="Pre Operation" 
                control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>Pre Operation</Typography>} 
              />
            </RadioGroup>
          </Box>

          {/* Send form to patient */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', mb: 1 }}>
              Send form to patient
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TextField 
                size="small"
                value={sendHours}
                onChange={(e) => setSendHours(e.target.value)}
                sx={{ 
                  width: 80,
                  '& .MuiInputBase-input': { textAlign: 'center', py: 0.8, fontSize: '0.9rem' },
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' }
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
                  '& .MuiInputBase-input': { py: 0.8, fontSize: '0.9rem' },
                  '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' }
                }}
              >
                <option value="hours">hours</option>
                <option value="days">days</option>
              </TextField>
              <Typography sx={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                after appointment.
              </Typography>
            </Box>
          </Box>

          {/* File Option Selection */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', mb: 1.5 }}>
              File Type
            </Typography>
            <RadioGroup
              row
              value={fileOption}
              onChange={(e) => setFileOption(e.target.value)}
            >
              <FormControlLabel 
                value="Upload PDF" 
                control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>Upload PDF</Typography>} 
              />
              <FormControlLabel 
                value="Create Form" 
                control={<Radio size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#3b82f6' } }} />} 
                label={<Typography sx={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>Create Form</Typography>} 
              />
            </RadioGroup>
          </Box>

          {/* Dotted Upload Box */}
          {fileOption === 'Upload PDF' && (
            <Box>
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
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', mb: 1 }}>
              Document Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g., Post-Extraction Instructions"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              sx={{ 
                '& .MuiInputBase-input': { fontSize: '0.9rem', py: 0.8 },
                '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' }
              }}
            />
          </Box>

          {/* Procedures */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', mb: 1 }}>
              Procedures
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g., General Extraction"
              value={procedures}
              onChange={(e) => setProcedures(e.target.value)}
              sx={{ 
                '& .MuiInputBase-input': { fontSize: '0.9rem', py: 0.8 },
                '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' }
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
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            borderRadius: 1.5,
            px: 4,
            py: 1,
            borderColor: '#cbd5e1',
            color: '#475569',
            '&:hover': {
              backgroundColor: '#f8fafc',
              borderColor: '#94a3b8'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveDocument}
          disabled={!docName}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            borderRadius: 1.5,
            px: 4,
            py: 1,
            backgroundColor: '#3b82f6',
            color: '#fff',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#2563eb',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            },
            '&.Mui-disabled': {
              backgroundColor: '#cbd5e1',
              color: '#f8fafc'
            }
          }}
        >
          {editingId ? 'Update Pre/Post-Op' : 'Add Pre/Post-Op'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrePostOpsForm;
