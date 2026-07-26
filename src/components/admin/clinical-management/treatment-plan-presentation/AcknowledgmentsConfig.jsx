import React from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const AcknowledgmentsConfig = ({ acknowledgments, setAcknowledgments, handleDeleteParagraph, handleAddParagraph }) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 2 }}>
        Acknowledgments
      </Typography>
      
      {acknowledgments.map((text, idx) => (
        <Box 
          key={idx} 
          sx={{ 
            mb: 2.5, 
            display: 'flex', 
            gap: 2, 
            alignItems: 'flex-start',
            backgroundColor: '#f8fafc',
            p: 2,
            borderRadius: 2,
            border: '1px solid #f1f5f9'
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={3}
            value={text}
            onChange={(e) => {
              const updated = [...acknowledgments];
              updated[idx] = e.target.value;
              setAcknowledgments(updated);
            }}
            placeholder="Enter acknowledgment paragraph..."
            sx={{ 
              '& .MuiInputBase-root': { backgroundColor: '#fff', borderRadius: 1.5 },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '& .MuiInputBase-input': { fontSize: '0.85rem', lineHeight: 1.6, color: '#334155' } 
            }}
          />
          <Box sx={{ pt: 1 }}>
            <IconButton 
              size="small"
              onClick={() => handleDeleteParagraph(idx)}
              sx={{ 
                color: '#ef4444', 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: 1.5,
                '&:hover': { color: '#dc2626', backgroundColor: '#fee2e2' } 
              }}
            >
              <DeleteIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Box>
        </Box>
      ))}
      
      <Box 
        onClick={handleAddParagraph}
        sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 0.5, 
          cursor: 'pointer', 
          mt: 1, 
          color: '#3b82f6',
          '&:hover': { color: '#2563eb' }
        }}
      >
        <AddIcon sx={{ fontSize: '1.1rem' }} />
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
          Add New Paragraph
        </Typography>
      </Box>
    </Box>
  );
};

export default AcknowledgmentsConfig;
