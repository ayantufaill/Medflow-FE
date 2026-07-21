import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, FormControlLabel, Checkbox, Paper, Button, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';

export const stdSx = { fontSize: '12px', color: '#11223F' };

export const inputSx = {
  bgcolor: '#FFFFFF',
  borderRadius: '7px',
  '& .MuiOutlinedInput-root': {
    height: '34px',
    borderRadius: '7px',
    '& fieldset': { borderColor: '#E6E8EC' },
    '&:hover fieldset': { borderColor: '#d1d5db' },
    '&.Mui-focused fieldset': { borderColor: '#3B63E0' },
  },
  '& .MuiOutlinedInput-input': {
    padding: '0 12px',
    height: '34px',
    boxSizing: 'border-box'
  },
  '& .MuiSelect-select': {
    padding: '0 12px',
    height: '34px !important',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  }
};

export const FieldRow = ({ label, children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
    <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500, color: '#4B5568' }}>
      {label}
    </Typography>
    <Box sx={{ width: '100%' }}>{children}</Box>
  </Box>
);

export const AddSearchList = ({ label, items, onAdd, onRemove, showDeleted, onToggleDeleted, deletedLabel, useObjects = false }) => {
  const [addVal, setAddVal] = useState('');
  const [searchVal, setSearchVal] = useState('');

  const [isAdding, setIsAdding] = useState(false);

  const filtered = items.filter((i) => {
    const nameStr = useObjects ? i.name : i;
    const isDel = useObjects ? i.isDeleted : false;
    const matchesSearch = !searchVal || nameStr.toLowerCase().includes(searchVal.toLowerCase());
    const matchesDeleted = showDeleted ? true : !isDel;
    return matchesSearch && matchesDeleted;
  });

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#3B63E0', minWidth: 200 }}>
          {label}
        </Typography>
        
        {isAdding ? (
          <TextField
            autoFocus
            variant="outlined"
            size="small"
            placeholder="Type and hit Enter..."
            value={addVal}
            onChange={(e) => setAddVal(e.target.value)}
            onBlur={() => {
              setIsAdding(false);
              if (addVal.trim()) onAdd(addVal.trim());
              setAddVal('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (addVal.trim()) onAdd(addVal.trim());
                setAddVal('');
                setIsAdding(false);
              } else if (e.key === 'Escape') {
                setIsAdding(false);
                setAddVal('');
              }
            }}
            sx={{ 
              width: '220px',
              bgcolor: '#FFFFFF',
              borderRadius: '6px',
              '& .MuiOutlinedInput-root': {
                height: '29.33px',
                borderRadius: '6px',
                '& fieldset': { borderColor: '#E6E8EC' },
                '&:hover fieldset': { borderColor: '#d1d5db' },
                '&.Mui-focused fieldset': { borderColor: '#3B63E0' },
              },
              '& .MuiOutlinedInput-input': {
                padding: '0 8px',
                height: '29.33px',
                boxSizing: 'border-box',
                fontSize: '12px'
              }
            }}
          />
        ) : (
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<AddIcon sx={{ width: 16, height: 16 }} />}
            onClick={() => setIsAdding(true)}
            sx={{ 
              borderRadius: '6px', 
              textTransform: 'none', 
              fontWeight: 600, 
              fontSize: '12px',
              height: '29.33px',
              px: 2,
              borderColor: '#3B63E0',
              color: '#3B63E0',
              '&:hover': {
                borderColor: '#2f51bd',
                bgcolor: 'rgba(59, 99, 224, 0.04)'
              }
            }}
          >
            Add
          </Button>
        )}

        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: '260px',
            bgcolor: '#FFFFFF',
            borderRadius: '6px',
            '& .MuiOutlinedInput-root': {
              height: '29.33px',
              borderRadius: '6px',
              '& fieldset': { borderColor: '#E6E8EC' },
              '&:hover fieldset': { borderColor: '#d1d5db' },
              '&.Mui-focused fieldset': { borderColor: '#3B63E0' },
            },
            '& .MuiOutlinedInput-input': {
              padding: '0 8px',
              height: '29.33px',
              boxSizing: 'border-box',
              fontSize: '12px',
              color: '#11223F'
            }
          }}
        />

        {deletedLabel && (
          <FormControlLabel
            control={<Checkbox size="small" checked={showDeleted} onChange={onToggleDeleted} />}
            label={<Typography variant="caption">{deletedLabel}</Typography>}
            sx={{ m: 0, ml: 1 }}
          />
        )}
      </Box>
      {filtered.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filtered.map((item, idx) => {
            const nameStr = useObjects ? item.name : item;
            const isDel = useObjects ? item.isDeleted : false;
            return (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1.5, py: 0.5,
                  borderRadius: '16px',
                  border: '1px solid #e0e0e0',
                  bgcolor: '#fff',
                  opacity: isDel ? 0.5 : 1,
                  textDecoration: isDel ? 'line-through' : 'none',
                }}
              >
                <Typography variant="caption" sx={{ fontSize: '11px', color: '#4B5568' }}>{nameStr}</Typography>
                {!isDel && (
                  <IconButton size="small" onClick={() => onRemove(item)} sx={{ p: 0.25, ml: 0.5, mr: -0.5 }}>
                    <CloseIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                  </IconButton>
                )}
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
