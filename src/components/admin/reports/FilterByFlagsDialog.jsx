import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid
} from '@mui/material';

export const FLAG_GROUPS = {
  column1: [
    {
      title: 'Review',
      flags: [
        { id: 'request review', label: 'request review', color: '#e0e0e0' },
        { id: 'review requested', label: 'review requested', color: '#ffe082' },
        { id: 'reviewed', label: 'reviewed', color: '#81c784' },
      ]
    },
    {
      title: 'Patient',
      flags: [
        { id: 'TRICARE', label: 'TRICARE', color: '#00c853' },
        { id: 'Interested in Whitening', label: 'Interested in Whitening', color: '#f8bbd0' },
        { id: 'Rotated Teeth', label: 'Rotated Teeth', color: '#7e57c2' },
        { id: 'Tongue Tied', label: 'Tongue Tied', color: '#e57373' },
        { id: 'bioclear patient', label: 'Bioclear Patient', color: '#0288d1' },
      ]
    }
  ],
  column2: [
    {
      title: 'Medical',
      flags: [
        { id: 'ALLERGY', label: 'ALLERGY', color: '#d50000' },
        { id: 'NEEDS Pre-Meds!!!!!', label: 'NEEDS Pre-Meds!!!!!', color: '#2962ff' },
        { id: 'Severe anxiety', label: 'Severe anxiety', color: '#ff6e40' },
      ]
    },
    {
      title: 'Patient Status',
      flags: [
        { id: 'Active Phase I', label: 'Active Phase I', color: '#00c853' },
      ]
    }
  ],
  column3: [
    {
      title: 'Patients',
      flags: [
        { id: 'Aesthetic Patients', label: 'Aesthetic Patients', color: '#ab47bc' },
        { id: 'ASAP', label: 'ASAP', color: '#ff5722' },
      ]
    },
    {
      title: 'Billing',
      flags: [
        { id: 'alert', label: 'alert', color: '#009688' },
        { id: 'old patient', label: 'old patient', color: '#3f51b5' },
        { id: 'family & friends', label: 'family & friends', color: '#c2185b' },
        { id: 'late payment', label: 'late payment', color: '#f57c00' },
        { id: 'needs special care', label: 'needs special care', color: '#00bcd4' },
        { id: 'No insurance', label: 'No insurance', color: '#f44336' },
        { id: 'EAGLESOFT', label: 'EAGLESOFT', color: '#4caf50' },
        { id: 'Difficult Patient', label: 'Difficult Patient', color: '#000000' },
        { id: 'Pillow & Blanket', label: 'Pillow & Blanket', color: '#00c853' },
        { id: 'balance owed', label: 'Balance Owed', color: '#e65100' },
      ]
    }
  ]
};

export const ALL_FLAG_IDS = [
  ...FLAG_GROUPS.column1.flatMap(g => g.flags.map(f => f.id)),
  ...FLAG_GROUPS.column2.flatMap(g => g.flags.map(f => f.id)),
  ...FLAG_GROUPS.column3.flatMap(g => g.flags.map(f => f.id)),
];

export const ALL_FLAGS = [
  ...FLAG_GROUPS.column1.flatMap(g => g.flags),
  ...FLAG_GROUPS.column2.flatMap(g => g.flags),
  ...FLAG_GROUPS.column3.flatMap(g => g.flags),
];

const FilterByFlagsDialog = ({ open, onClose, onSave, initialSelected = [] }) => {
  const [selectedFlags, setSelectedFlags] = useState([]);

  useEffect(() => {
    if (open) {
      setSelectedFlags(initialSelected);
    }
  }, [open, initialSelected]);

  const handleToggleFlag = (id) => {
    setSelectedFlags(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleToggleGroup = (groupFlags) => {
    const groupIds = groupFlags.map(f => f.id);
    const allSelected = groupIds.every(id => selectedFlags.includes(id));
    if (allSelected) {
      setSelectedFlags(prev => prev.filter(id => !groupIds.includes(id)));
    } else {
      setSelectedFlags(prev => [...new Set([...prev, ...groupIds])]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFlags.length === ALL_FLAG_IDS.length) {
      setSelectedFlags([]);
    } else {
      setSelectedFlags([...ALL_FLAG_IDS]);
    }
  };

  const handleSave = () => {
    onSave(selectedFlags);
    onClose();
  };

  const renderGroup = (group) => {
    const groupIds = group.flags.map(f => f.id);
    const allSelected = groupIds.every(id => selectedFlags.includes(id));
    
    return (
      <Box key={group.title} sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox 
              size="small" 
              checked={allSelected}
              onChange={() => handleToggleGroup(group.flags)}
              sx={{ color: '#aaa', '&.Mui-checked': { color: '#337ab7' }, p: 0.5 }}
            />
          }
          label={<Typography sx={{ fontWeight: 600, color: '#337ab7', fontSize: '0.85rem' }}>{group.title}</Typography>}
          sx={{ mb: 1, ml: 0 }}
        />
        <Box sx={{ pl: 3 }}>
          {group.flags.map(flag => (
            <Box key={flag.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
              <Checkbox 
                size="small"
                checked={selectedFlags.includes(flag.id)}
                onChange={() => handleToggleFlag(flag.id)}
                sx={{ color: '#aaa', '&.Mui-checked': { color: '#337ab7' }, p: 0, mr: 1, mt: 0.2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: flag.color, 
                    borderRadius: '2px',
                    mr: 1 
                  }} 
                />
                <Typography sx={{ fontSize: '0.8rem', color: '#555', lineHeight: 1.2, pt: 0.2 }}>
                  {flag.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
      <DialogTitle sx={{ backgroundColor: '#4a89dc', color: '#fff', textAlign: 'center', py: 1.5, fontSize: '1.1rem', fontWeight: 500 }}>
        Filter by Flags
      </DialogTitle>
      <DialogContent sx={{ p: 4, pb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox 
              size="small" 
              checked={selectedFlags.length === ALL_FLAG_IDS.length && ALL_FLAG_IDS.length > 0}
              onChange={handleSelectAll}
              sx={{ color: '#aaa', '&.Mui-checked': { color: '#337ab7' }, p: 0.5 }}
            />
          }
          label={<Typography sx={{ fontSize: '0.85rem', color: '#555' }}>Select All</Typography>}
          sx={{ mb: 3, ml: 0 }}
        />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {FLAG_GROUPS.column1.map(renderGroup)}
          </Grid>
          <Grid item xs={12} md={4}>
            {FLAG_GROUPS.column2.map(renderGroup)}
          </Grid>
          <Grid item xs={12} md={4}>
            {FLAG_GROUPS.column3.map(renderGroup)}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, px: 4, borderTop: '1px solid #eee' }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ backgroundColor: '#aaa', '&:hover': { backgroundColor: '#999' }, textTransform: 'none', px: 3, py: 0.5 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          sx={{ backgroundColor: '#4a89dc', '&:hover': { backgroundColor: '#3b75c3' }, textTransform: 'none', px: 4, py: 0.5 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterByFlagsDialog;
