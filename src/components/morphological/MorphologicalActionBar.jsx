import React from 'react';
import { Box, Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const MorphologicalActionBar = ({ isSigned, handleSaveExam, handleSignExam, handleDeleteExam }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button
        startIcon={<DeleteOutlineIcon sx={{ fontSize: 18 }} />}
        disabled={isSigned}
        sx={{ 
          color: '#ef4444', 
          textTransform: 'none', 
          fontWeight: 600, 
          fontSize: '0.85rem',
          '&:hover': { bgcolor: '#fee2e2' }
        }}
        onClick={handleDeleteExam}
      >
        Delete Exam
      </Button>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleSaveExam}
          disabled={isSigned}
          sx={{ 
            textTransform: 'none', 
            px: 4, 
            py: 1, 
            color: '#374151', 
            borderColor: '#d1d5db',
            fontWeight: 600,
            borderRadius: '6px',
            '&:hover': { bgcolor: '#f9fafb', borderColor: '#9ca3af' }
          }}
        >
          Save Draft
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignExam}
          disabled={isSigned}
          sx={{ 
            textTransform: 'none', 
            px: 4, 
            py: 1, 
            bgcolor: '#2563eb',
            boxShadow: 'none',
            fontWeight: 600,
            borderRadius: '6px',
            '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Complete Exam
        </Button>
      </Box>
    </Box>
  );
};

export default MorphologicalActionBar;
