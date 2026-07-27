import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Close as CloseIcon, Check as CheckIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

const BLOCK_COLORS = [
  '#94a3b8', '#fca5a5', '#fde047', '#86efac', '#5eead4', '#67e8f9', 
  '#7dd3fc', '#c4b5fd', '#f472b6', '#fb7185', '#cbd5e1', '#e2e8f0'
];

const getDayjsTime = (timeStr) => {
  if (!timeStr) return dayjs();
  const [h, m] = timeStr.split(':');
  return dayjs().hour(parseInt(h, 10)).minute(parseInt(m, 10)).second(0);
};

const BlockSlotModal = ({ open, onClose, onSave, onDelete, initialData }) => {
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
      id: initialData?.id || initialData?._id,
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
          width: '380px',
          maxWidth: '100%',
          borderRadius: radius.lg,
          p: 0,
        }
      }}
    >
      {/* Header — SURFACE_TINT + BORDER is the same header treatment SectionCard/RightPanelCard use across patient pages and the appointments sidebar, kept here for visual consistency */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.25,
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
      }}>
        <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
          Block Slot
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: COLORS.TEXT_MUTED, p: '4px' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* Time Inputs */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
          <Box sx={{ flex: '0 0 auto' }}>
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
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
                      width: '163px',
                      '& .MuiInputBase-root': {
                        fontSize: fontSize.md,
                        borderRadius: radius.md,
                        height: '36px',
                        paddingRight: '4px',
                      },
                      '& .MuiInputAdornment-positionStart': { display: 'none' },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ flex: '0 0 auto' }}>
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
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
                      width: '163px',
                      '& .MuiInputBase-root': {
                        fontSize: fontSize.md,
                        borderRadius: radius.md,
                        height: '36px',
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
        <Box sx={{ mb: 2.5 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Notes"
            value={notes}
            onChange={(e) => {
              if (e.target.value.length <= 254) {
                setNotes(e.target.value);
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: radius.md, fontSize: fontSize.md },
            }}
          />
          <Typography sx={{ fontSize: fontSize.xs, color: COLORS.TEXT_MUTED, textAlign: 'right', mt: 0.5 }}>
            {notes.length}/254 characters
          </Typography>
        </Box>

        {/* Color Selection */}
        <Box>
          <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, mb: 1 }}>
            Select Color
          </Typography>

          <Box sx={{
            width: '100%',
            height: '30px',
            backgroundColor: selectedColor,
            borderRadius: radius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1.5,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
          }}>
            <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: 'rgba(0,0,0,0.55)' }}>
              Selected Color Preview
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {BLOCK_COLORS.map(color => {
              const isSelected = selectedColor === color;
              return (
                <Box
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected
                      ? `0 0 0 2px ${COLORS.SURFACE_CARD}, 0 0 0 3.5px ${COLORS.ACCENT}`
                      : 'inset 0 0 0 1px rgba(0,0,0,0.08)',
                    transition: 'box-shadow 0.12s ease, transform 0.12s ease',
                    '&:hover': { transform: 'scale(1.12)' },
                  }}
                >
                  {isSelected && (
                    <CheckIcon sx={{ fontSize: 12, color: 'rgba(0,0,0,0.55)' }} />
                  )}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.BORDER_LIGHT}`,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1,
        backgroundColor: COLORS.SURFACE_FOOTER,
      }}>
         <Button
          variant="outlined"
          onClick={onClose}
          size="small"
          sx={{
            borderRadius: radius.sm,
            textTransform: 'none',
            fontSize: fontSize.md,
            fontWeight: fontWeight.medium,
            px: 2,
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            '&:hover': { borderColor: COLORS.TEXT_MUTED, backgroundColor: 'rgba(0,0,0,0.02)' },
          }}
        >
          Cancel
        </Button>
        {(initialData?.id || initialData?._id) && onDelete && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(initialData.id || initialData._id)}
            size="small"
            sx={{
              borderRadius: radius.sm,
              textTransform: 'none',
              fontSize: fontSize.md,
              fontWeight: fontWeight.medium,
              px: 2,
            }}
          >
            Delete
          </Button>
        )}
        <Button
          variant="contained"
            onClick={handleSave}
            disableElevation
            size="small"
            sx={{
              borderRadius: radius.sm,
              textTransform: 'none',
              fontSize: fontSize.md,
              fontWeight: fontWeight.medium,
              px: 2,
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
            }}
          >
            Save
          </Button>
      </Box>
    </Dialog>
  );
};

export default BlockSlotModal;
