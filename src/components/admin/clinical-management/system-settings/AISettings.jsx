import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const AISettings = ({ aiPrompt, setAiPrompt, isEditingPrompt, handleToggleEditPrompt, handleResetPrompt, isAiPromptModified }) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 0.5 }}>
          AI Settings
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
          Configure the prompt used by the AI clinical assistant for exam summaries.
        </Typography>
      </Box>

      <Box sx={{ backgroundColor: '#f8fafc', p: 3, borderRadius: 2, border: '1px solid #f1f5f9' }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1.5, color: '#475569' }}>Exam Summary AI Prompt:</Typography>
        <TextField
          fullWidth
          multiline
          rows={8}
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          InputProps={{
            readOnly: !isEditingPrompt,
          }}
          sx={{
            backgroundColor: isEditingPrompt ? '#fff' : '#f1f5f9',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
            '& .MuiInputBase-input': { fontSize: '0.85rem', color: '#334155', fontFamily: 'monospace' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: isEditingPrompt ? '#3b82f6' : '#e2e8f0', borderWidth: isEditingPrompt ? 2 : 1 }
          }}
        />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleToggleEditPrompt}
            disabled={isEditingPrompt && !isAiPromptModified}
            sx={{
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: isEditingPrompt ? "#10b981" : "#2262ef",
              color: "#fff",
              px: "20px", py: "7px",
              boxShadow: "none",
              "&:hover": { backgroundColor: isEditingPrompt ? "#059669" : "#1a50cc", boxShadow: "none" },
              "&.Mui-disabled": { backgroundColor: "#e0e5eb", color: "#9aa3ae" }
            }}
          >
            {isEditingPrompt ? 'Save Prompt' : 'Edit Prompt'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleResetPrompt}
            sx={{
              fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              border: "1px solid #d0d5dd", color: "#374151",
              px: "16px", py: "7px",
              "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
            }}
          >
            Reset to Default
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AISettings;
