import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const ShareByEmail = ({ onClose }) => {
  const [startDate, setStartDate] = useState(dayjs('2023-09-20'));
  const [endDate, setEndDate] = useState(dayjs('2026-04-15'));
  const [onlyOpen, setOnlyOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', border: `1px solid ${COLORS.BORDER}`, bgcolor: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      <DialogTitle
        sx={{
          boxSizing: 'border-box',
          px: '25px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <EmailOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Share Statement
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: '25px', py: '20px', pt: '25px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          {/* Top Row: Checkbox */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={<Checkbox size="small" checked={onlyOpen} onChange={() => setOnlyOpen(!onlyOpen)} />}
              label={<Typography sx={{ fontSize: '13px' }}>Only Open Invoices</Typography>}
              sx={{ m: 0 }}
            />
          </Box>
          
          {/* Bottom Row: Start Date and End Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Start Date</Typography>
              <DatePicker
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  popper: { sx: { zIndex: 1500 } },
                  textField: { 
                    size: 'small', 
                    sx: { 
                      width: '180px', 
                      '& .MuiInputBase-root': { 
                        fontSize: '13px', 
                        borderRadius: '4px', 
                        height: '36px', 
                        bgcolor: COLORS.SURFACE_TINT, 
                        color: COLORS.TEXT_PRIMARY 
                      }, 
                      '& .MuiInputBase-input': { padding: '4px 10px' }, 
                      '& fieldset': { borderColor: COLORS.BORDER } 
                    } 
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>End Date</Typography>
              <DatePicker
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="MM/DD/YYYY"
                slotProps={{ 
                  popper: { sx: { zIndex: 1500 } },
                  textField: { 
                    size: 'small', 
                    sx: { 
                      width: '180px', 
                      '& .MuiInputBase-root': { 
                        fontSize: '13px', 
                        borderRadius: '4px', 
                        height: '36px', 
                        bgcolor: COLORS.SURFACE_TINT, 
                        color: COLORS.TEXT_PRIMARY 
                      }, 
                      '& .MuiInputBase-input': { padding: '4px 10px' }, 
                      '& fieldset': { borderColor: COLORS.BORDER } 
                    } 
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: '16px 25px', borderTop: `1px solid ${COLORS.BORDER}`, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_PRIMARY,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            '&:hover': { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: 'transparent' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: COLORS.ACCENT,
            color: COLORS.WHITE,
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: fontWeight.medium,
            borderRadius: radius.sm,
            height: '36px',
            boxShadow: 'none',
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
          }}
        >
          Share
        </Button>
      </DialogActions>
    </Box>
  );
};

export default ShareByEmail;
