import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import {
  FileUploadOutlined as UploadIcon,
} from '@mui/icons-material';

const PrePostOpsForm = ({
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
  setView,
  editingId
}) => {
  return (
    <Box sx={{ p: 0, backgroundColor: '#FBFCFE', minHeight: '80vh' }}>
      
      {/* Heading */}
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#1e293b', 
          fontWeight: 700, 
          fontSize: '1.25rem', 
          mb: 4 
        }}
      >
        {editingId ? 'Edit Pre/Post Operation Document' : 'Add New Pre/Post Operation Document'}
      </Typography>

      {/* Form Inputs Container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, maxWidth: 800 }}>
        
        {/* Type Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', minWidth: 60 }}>
            Type:
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
            Send form to patient
          </Typography>
          <TextField 
            size="small"
            value={sendHours}
            onChange={(e) => setSendHours(e.target.value)}
            sx={{ 
              width: 60,
              '& .MuiInputBase-input': { textAlign: 'center', py: 0.6, fontSize: '0.9rem' },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, borderColor: '#ef4444' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ef4444' }
            }} 
          />
          <TextField 
            select
            size="small"
            SelectProps={{ native: true }}
            value={sendUnit} 
            onChange={(e) => setSendUnit(e.target.value)}
            sx={{ 
              width: 90,
              '& .MuiInputBase-input': { py: 0.6, fontSize: '0.9rem' },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' }
            }}
          >
            <option value="hours">hours</option>
            <option value="days">days</option>
          </TextField>
          <Typography sx={{ fontSize: '0.9rem', color: '#475569' }}>
            after appointment.
          </Typography>
        </Box>

        {/* File Option Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', minWidth: 60 }}>
            File:
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
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', mb: 1 }}>
              Upload PDF <span style={{ fontWeight: 400, color: '#94a3b8' }}>(The system only accepts .pdf files)</span>
            </Typography>
            <Box
              sx={{
                border: '2px dashed #cbd5e1',
                borderRadius: 2,
                p: 4,
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
                gap: 1.5,
                maxWidth: 500
              }}
            >
              <UploadIcon sx={{ color: '#94a3b8', fontSize: '1.6rem' }} />
              <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>
                Drop items here or <span style={{ fontWeight: 600, color: '#3b82f6' }}>Browse Files</span>
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 1 }}>
              Up to 1MB • File name without special characters
            </Typography>
          </Box>
        )}

        {/* Document Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', minWidth: 120 }}>
            Document Name:
          </Typography>
          <TextField
            size="small"
            placeholder="Enter Name"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            sx={{ 
              width: 300,
              '& .MuiInputBase-input': { fontSize: '0.9rem', py: 0.8 },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' }
            }}
          />
        </Box>

        {/* Procedures */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', minWidth: 120 }}>
            Procedures:
          </Typography>
          <TextField
            size="small"
            placeholder="Enter code or procedure"
            value={procedures}
            onChange={(e) => setProcedures(e.target.value)}
            sx={{ 
              width: 300,
              '& .MuiInputBase-input': { fontSize: '0.9rem', py: 0.8 },
              '& .MuiOutlinedInput-root': { borderRadius: 1.5, backgroundColor: '#fff' }
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-start', maxWidth: 650 }}>
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
          <Button
            variant="outlined"
            onClick={() => setView('list')}
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
        </Box>

      </Box>
    </Box>
  );
};

export default PrePostOpsForm;
