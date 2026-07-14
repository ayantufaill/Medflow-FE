import React from "react";
import { Box, TextField, Button, Typography, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';

import saveExamIcon from '../../assets/clinicalicons/saveexamicon.svg';

const ExamToolbar = ({ onCollapseAll, onSaveExam, isSigned, searchQuery, onSearchChange }) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 2
    }}>
      {/* Search findings input */}
      <TextField
        size="small"
        placeholder="Search findings..."
        value={searchQuery || ''}
        onChange={(e) => onSearchChange?.(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          width: 224,
          '& .MuiOutlinedInput-root': {
            height: 32,
            borderRadius: '6px',
            fontSize: '0.8rem',
            bgcolor: '#fff',
            '& fieldset': { borderColor: '#e5e7eb' },
            '&:hover fieldset': { borderColor: '#d1d5db' },
            '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
          },
          '& input::placeholder': { color: '#9ca3af', opacity: 1 }
        }}
      />

      {/* Collapse all */}
      <Box
        onClick={onCollapseAll}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          color: '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          px: 1.5,
          py: 0.7,
          bgcolor: '#fff',
          '&:hover': { bgcolor: '#f9fafb' }
        }}
      >
        <UnfoldLessIcon sx={{ fontSize: 16 }} />
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Collapse all</Typography>
      </Box>

      {/* Save Exam button */}
      <Button
        variant="contained"
        disabled={isSigned}
        onClick={onSaveExam}
        startIcon={<img src={saveExamIcon} alt="Save Exam" style={{ width: 14, height: 14, filter: 'brightness(0) invert(1)', opacity: isSigned ? 0.5 : 1 }} />}
        sx={{
          bgcolor: '#2563eb',
          color: '#fff',
          textTransform: 'none',
          fontSize: '0.8rem',
          fontWeight: 600,
          borderRadius: '8px',
          px: 2.5,
          py: 0.7,
          boxShadow: 'none',
          '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' },
          '&.Mui-disabled': { bgcolor: '#93c5fd', color: '#fff' }
        }}
      >
        Save Exam
      </Button>
    </Box>
  );
};

export default ExamToolbar;
