import React from 'react';
import { Dialog, Box, Typography, IconButton } from "@mui/material";

const SelectToothDialog = ({ open, onClose, selectedTeeth = [], onToggle }) => {
  const topTeeth = ['1', '2', '3', '4', '5', '6', '7', '8', 'Q1', 'Q2', '9', '10', '11', '12', '13', '14', '15', '16'];
  const bottomTeeth = ['32', '31', '30', '29', '28', '27', '26', '25', 'Q4', 'Q3', '24', '23', '22', '21', '20', '19', '18', '17'];

  // Safe selected teeth array parsing (handles both array and comma-separated string)
  const getSelectedArray = () => {
    if (Array.isArray(selectedTeeth)) {
      return selectedTeeth.map(t => String(t).trim()).filter(Boolean);
    }
    if (typeof selectedTeeth === 'string') {
      return selectedTeeth.split(',').map(t => t.trim()).filter(Boolean);
    }
    return [];
  };

  const selectedArray = getSelectedArray();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <Box sx={{ position: 'relative', p: 2, minWidth: '400px' }}>
        <Typography variant="subtitle1" align="center" sx={{ mb: 2, fontWeight: 500, color: '#444' }}>
          Select Tooth
        </Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 4, right: 4, p: 0.5 }}>
          <Typography sx={{ fontSize: '1rem', color: '#888' }}>x</Typography>
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            {topTeeth.map(t => {
              const isSelected = selectedArray.includes(t);
              const isQ = t.startsWith('Q');
              return (
                <Typography
                  key={t}
                  onClick={() => onToggle && onToggle(t)}
                  sx={{ 
                    fontSize: '0.75rem', 
                    width: '24px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    color: isSelected ? '#1976d2' : '#555',
                    fontWeight: isSelected ? 800 : (isQ ? 700 : 400),
                    userSelect: 'none',
                    ml: (t === 'Q1' || t === '9') ? 3 : 0,
                    mr: (t === 'Q2') ? 3 : 0
                  }}
                >
                  {t}
                </Typography>
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            {bottomTeeth.map(t => {
              const isSelected = selectedArray.includes(t);
              const isQ = t.startsWith('Q');
              return (
                <Typography
                  key={t}
                  onClick={() => onToggle && onToggle(t)}
                  sx={{ 
                    fontSize: '0.75rem', 
                    width: '24px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    color: isSelected ? '#1976d2' : '#555',
                    fontWeight: isSelected ? 800 : (isQ ? 700 : 400),
                    userSelect: 'none',
                    ml: (t === 'Q4' || t === '24') ? 3 : 0,
                    mr: (t === 'Q3') ? 3 : 0
                  }}
                >
                  {t}
                </Typography>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SelectToothDialog;
