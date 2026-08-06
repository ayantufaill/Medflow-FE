import React, { useState } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel, TextField, IconButton, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { COLORS } from '../../constants/colors';
import { radius, fontWeight } from '../../constants/styles';

const PrintReceiptDialog = ({ onClose, initialIncludeFamily = false }) => {
  const [startDate, setStartDate] = useState('05/06/2026');
  const [endDate, setEndDate] = useState('05/06/2026');
  const [includeFamily, setIncludeFamily] = useState(initialIncludeFamily);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '14px', overflow: 'hidden' }}>
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
        <PrintOutlinedIcon sx={{ fontSize: '20px', color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Print Receipt
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: '25px', py: '20px', pt: '25px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Start Date */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', mr: 2, width: '80px', fontWeight: fontWeight.medium }}>
            Start Date:
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ width: '200px' }}
          />
        </Box>

        {/* End Date */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '13px', mr: 2, width: '80px', fontWeight: fontWeight.medium }}>
            End Date:
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ width: '200px' }}
          />
        </Box>

        {/* Include Family Payments */}
        <Box>
          <FormControlLabel
            control={
              <Checkbox 
                checked={includeFamily} 
                onChange={(e) => setIncludeFamily(e.target.checked)}
                size="small"
                sx={{ color: COLORS.TEXT_PRIMARY, '&.Mui-checked': { color: COLORS.ACCENT } }}
              />
            }
            label={<Typography sx={{ fontSize: '13px', color: COLORS.TEXT_PRIMARY }}>Include Family Payments</Typography>}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: '16px 25px', borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, gap: 1 }}>
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
          Prepare Receipt
        </Button>
      </DialogActions>
    </Box>
  );
};

export default PrintReceiptDialog;
