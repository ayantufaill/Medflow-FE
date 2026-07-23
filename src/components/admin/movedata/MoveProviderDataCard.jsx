import React from 'react';
import { Box, Typography, Button, Select, MenuItem } from '@mui/material';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

const MoveProviderDataCard = ({
  fromProvider,
  setFromProvider,
  toProvider,
  setToProvider,
  handleMoveProviderData
}) => {
  return (
    <Box sx={{
      width: '100%',
      borderRadius: '10px',
      border: '1px solid #E2E8F0',
      bgcolor: '#FFFFFF',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{
        width: '100%',
        bgcolor: '#F2F6FC',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 2,
        py: 1.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FileCopyOutlinedIcon sx={{ color: '#2F6FED', fontSize: '1.2rem', mr: 1 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#11223F', fontSize: '12px' }}>
            MOVE PROVIDER DATA
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '12px', color: '#6B7280', ml: 3.5, mt: 0.5 }}>
          Future appointment & procedures,preferred DDS,etc
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* From Provider */}
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', mb: 0.5 }}>
            From Provider
          </Typography>
          <Select
            fullWidth
            size="small"
            value={fromProvider}
            onChange={(e) => setFromProvider(e.target.value)}
            displayEmpty
            sx={{
              height: 40,
              fontSize: '14px',
              borderRadius: '8px',
              color: fromProvider === 'Select Provider' ? '#9CA3AF' : '#11223F',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E2E8F0',
              }
            }}
          >
            <MenuItem value="Select Provider" disabled>Select Provider</MenuItem>
            <MenuItem value="Dr. John Doe">Dr. John Doe</MenuItem>
            <MenuItem value="Dr. Jane Smith">Dr. Jane Smith</MenuItem>
            <MenuItem value="Dr. Robert Lee">Dr. Robert Lee</MenuItem>
          </Select>
        </Box>

        {/* To Provider */}
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', mb: 0.5 }}>
            To Provider
          </Typography>
          <Select
            fullWidth
            size="small"
            value={toProvider}
            onChange={(e) => setToProvider(e.target.value)}
            displayEmpty
            sx={{
              height: 40,
              fontSize: '14px',
              borderRadius: '8px',
              color: toProvider === 'Select Provider' ? '#9CA3AF' : '#11223F',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E2E8F0',
              }
            }}
          >
            <MenuItem value="Select Provider" disabled>Select Provider</MenuItem>
            <MenuItem value="Dr. John Doe">Dr. John Doe</MenuItem>
            <MenuItem value="Dr. Jane Smith">Dr. Jane Smith</MenuItem>
            <MenuItem value="Dr. Robert Lee">Dr. Robert Lee</MenuItem>
          </Select>
        </Box>

        {/* Action Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleMoveProviderData}
            sx={{
              bgcolor: '#2F6FED',
              color: '#fff',
              textTransform: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#2558be',
                boxShadow: 'none'
              }
            }}
          >
            Move Provider Data
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MoveProviderDataCard;
