import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AccessTime } from '@mui/icons-material';
import dayjs from 'dayjs';
import { COLORS } from '../../../constants/colors';
import { fontWeight } from '../../../constants/styles';

const BLOCK_COLORS = [
  '#94a3b8', '#fca5a5', '#fde047', '#86efac', '#5eead4', '#67e8f9', 
  '#7dd3fc', '#c4b5fd', '#f472b6', '#fb7185', '#cbd5e1', '#e2e8f0'
];

const getDayjsTime = (timeStr) => {
  if (!timeStr) return dayjs();
  const [h, m] = timeStr.split(':');
  return dayjs().hour(parseInt(h, 10)).minute(parseInt(m, 10)).second(0);
};

const BlockSlotModal = ({ open, onClose, onSave, initialData }) => {
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:30');
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState(BLOCK_COLORS[0]);

  useEffect(() => {
    if (open && initialData) {
      const { startTime: initStart, endTime: initEnd } = initialData;
      if (initStart) setStartTime(initStart);
      if (initEnd) setEndTime(initEnd);
      setNotes('');
      setSelectedColor(BLOCK_COLORS[0]);
    }
  }, [open, initialData]);

  const handleSave = () => {
    onSave({
      startTime,
      endTime,
      notes,
      color: selectedColor,
      roomId: initialData?.roomId,
      date: initialData?.date || dayjs().format('YYYY-MM-DD')
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          width: '400px',
          maxWidth: '100%',
          borderRadius: '12px',
          p: 0,
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Time Inputs */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY, mb: 1 }}>
              Start Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={getDayjsTime(startTime)}
                onChange={(v) => {
                  if (v) setStartTime(v.format('HH:mm'));
                }}
                slotProps={{
                  popper: { sx: { zIndex: 10000 } },
                  textField: {
                    size: 'small',
                    sx: {
                      width: '160px',
                      '& .MuiInputBase-root': {
                        fontSize: '14px',
                        borderRadius: '8px',
                        height: '40px',
                        paddingRight: '4px',
                      },
                      '& .MuiInputAdornment-positionStart': { display: 'none' },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY, mb: 1 }}>
              End Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={getDayjsTime(endTime)}
                onChange={(v) => {
                  if (v) setEndTime(v.format('HH:mm'));
                }}
                slotProps={{
                  popper: { sx: { zIndex: 10000 } },
                  textField: {
                    size: 'small',
                    sx: {
                      width: '160px',
                      '& .MuiInputBase-root': {
                        fontSize: '14px',
                        borderRadius: '8px',
                        height: '40px',
                        paddingRight: '4px',
                      },
                      '& .MuiInputAdornment-positionStart': { display: 'none' },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {/* Notes */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Notes"
            value={notes}
            onChange={(e) => {
              if (e.target.value.length <= 254) {
                setNotes(e.target.value);
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '8px' }
            }}
          />
          <Typography sx={{ fontSize: '11px', color: COLORS.TEXT_MUTED, textAlign: 'right', mt: 0.5 }}>
            {notes.length}/254 characters
          </Typography>
        </Box>

        {/* Color Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: fontWeight.medium, mb: 1.5 }}>
            Select Color
          </Typography>
          
          <Box sx={{ 
            width: '100%', 
            height: '40px', 
            backgroundColor: selectedColor, 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}>
            <Typography sx={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)' }}>
              Selected Color Preview
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {BLOCK_COLORS.map(color => {
              const isSelected = selectedColor === color;
              return (
                <Box
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isSelected ? '2px solid #2563eb' : '2px solid transparent',
                  }}
                >
                  {isSelected && (
                    <Box sx={{ width: '10px', height: '6px', border: '2px solid rgba(0,0,0,0.5)', borderTop: 'none', borderRight: 'none', transform: 'rotate(-45deg)', mt: '-2px' }} />
                  )}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 1.5,
        backgroundColor: '#f8fafc'
      }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            borderRadius: '6px', 
            textTransform: 'none', 
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            '&:hover': { borderColor: COLORS.TEXT_MUTED, backgroundColor: 'rgba(0,0,0,0.02)' }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disableElevation
          sx={{ 
            borderRadius: '6px', 
            textTransform: 'none',
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }
          }}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};

export default BlockSlotModal;
