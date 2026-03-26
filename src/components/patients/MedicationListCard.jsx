import React from 'react';
import { Box, Typography, TextField, Button, Divider, Paper } from "@mui/material";

/**
 * MedicationListCard - Minimalist styled medication list matching the screenshot
 */
const MedicationListCard = ({ title, rows, onChangeRow, onAddRow }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 4,
      borderRadius: 1,
      border: "1px solid #e0e0e0",
      bgcolor: "#ffffff",
      width: '100%',
    }}
  >
    {/* Section Title */}
    <Typography
      variant="body1"
      sx={{
        mb: 0.5,
        color: "#424242",
        fontSize: "1rem",
      }}
    >
      {title}
    </Typography>

    {/* Header Underline */}
    <Divider sx={{ mb: 2, borderColor: '#9e9e9e' }} />

    {rows.map((row, index) => (
      <Box
        key={row.id || index}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 4,
          mb: 1.5,
          width: '100%'
        }}
      >
        {/* Drug Field with Numbering */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', flex: 1, gap: 1 }}>
          <Typography sx={{ fontSize: 14, color: '#424242', pb: 0.5, minWidth: '20px' }}>
            {index + 1}.
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            placeholder="drug"
            value={row.drug}
            onChange={(e) => onChangeRow(row.id, "drug", e.target.value)}
            InputProps={{
              disableUnderline: false,
              sx: { 
                fontSize: 14, 
                color: '#424242',
                '&:before': { borderBottom: '1px solid #e0e0e0' },
                '&:after': { borderBottom: '1px solid #9e9e9e' }
              }
            }}
          />
        </Box>

        {/* Dosage Field */}
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="dosage"
            value={row.dosage}
            onChange={(e) => onChangeRow(row.id, "dosage", e.target.value)}
            InputProps={{
              sx: { 
                fontSize: 14, 
                color: '#424242',
                '&:before': { borderBottom: '1px solid #e0e0e0' },
                '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #424242' },
                '&:after': { borderBottom: '1px solid #424242' }
              }
            }}
          />
        </Box>

        {/* Purpose Field */}
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="purpose"
            value={row.purpose}
            onChange={(e) => onChangeRow(row.id, "purpose", e.target.value)}
            InputProps={{
              sx: { 
                fontSize: 14, 
                color: '#424242',
                '&:before': { borderBottom: '1px solid #e0e0e0' },
                '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #424242' },
                '&:after': { borderBottom: '1px solid #424242' }
              }
            }}
          />
        </Box>
        
        {/* Empty Spacer to match the wide layout of the screenshot */}
        <Box sx={{ flex: 1 }} />
      </Box>
    ))}

    {/* Add More Button */}
    <Button
      onClick={onAddRow}
      sx={{
        mt: 1,
        p: 0,
        color: "#424242",
        textTransform: 'lowercase',
        fontSize: '0.875rem',
        minWidth: 'auto',
        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
      }}
    >
      + add more
    </Button>
  </Paper>
);

export default MedicationListCard;