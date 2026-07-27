import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox, TextField, Tooltip } from '@mui/material';

const ProgressNotesSettings = ({ progressNotes, handleProgressNotesChange }) => {
  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1.05rem', mb: 0.5 }}>
          Progress Notes
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', width: '100%' }}>
        <Box sx={{ flex: 1, backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9' }}>
          <FormControlLabel
            control={<Checkbox size="small" checked={progressNotes.showWarning} onChange={(e) => handleProgressNotesChange({ showWarning: e.target.checked })} sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />}
            label={<Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Always show warning when creating a new progress note</Typography>}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, backgroundColor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #f1f5f9' }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>Progress notes will be locked after</Typography>
          <TextField
            size="small"
            value={progressNotes.lockDays}
            onChange={(e) => handleProgressNotesChange({ lockDays: e.target.value })}
            sx={{ 
              width: 50, 
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
              '& .MuiInputBase-input': { fontSize: '0.85rem', textAlign: 'center', py: 0.8 } 
            }}
          />
          <Typography sx={{ fontSize: '0.85rem', color: '#334155' }}>days from creation</Typography>
          <Tooltip title="This will prevent users from editing or deleting progress notes after the specified number of days." placement="top">
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help', ml: 0.5 }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>i</Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressNotesSettings;
