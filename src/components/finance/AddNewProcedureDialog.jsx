import React, { useState } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel, TextField, Grid, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AddNewProcedureDialog = ({ onClose }) => {
  const maxillaryUR = [1, 2, 3, 4, 5];
  const maxillaryUA = [6, 7, 8, 'Q1', '', 'Q2', 9, 10, 11];
  const maxillaryUL = [12, 13, 14, 15, 16];
  
  const mandibularLR = [32, 31, 30, 29, 28];
  const mandibularLA = [27, 26, 25, 'Q4', '', 'Q3', 24, 23, 22];
  const mandibularLL = [21, 20, 19, 18, 17];

  const surfaces = ['M', 'D', 'O/I', 'L', 'B/F', 'C', 'V'];

  const ToothButton = ({ label }) => (
    <Box
      sx={{
        width: '30px',
        height: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#4b5563',
        cursor: 'pointer',
        '&:hover': { bgcolor: '#f3f4f6' },
        visibility: label === '' ? 'hidden' : 'visible'
      }}
    >
      {label}
    </Box>
  );

  const HeaderBox = ({ label }) => (
    <Box sx={{ bgcolor: '#f9fafb', py: 0.5, textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#6b7280' }}>
      {label}
    </Box>
  );

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#5c7bb5',
          color: 'white',
          padding: '12px',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'normal', fontSize: '16px' }}>
          Add new procedure
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8, color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2 }}>
        {/* Select Tooth Section */}
        <Typography sx={{ color: '#5c7bb5', fontSize: '14px', mb: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          Select Tooth
        </Typography>

        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '4px', mb: 2, overflow: 'hidden' }}>
          <HeaderBox label="Maxillary Arch" />
          <Grid container sx={{ borderBottom: '1px solid #f3f4f6' }}>
            <Grid item xs={3}>
              <HeaderBox label="UR" />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {maxillaryUR.map(t => <ToothButton key={t} label={t} />)}
              </Box>
            </Grid>
            <Grid item xs={6} sx={{ borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
              <HeaderBox label="UA" />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {maxillaryUA.map((t, i) => <ToothButton key={i} label={t} />)}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <HeaderBox label="UL" />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {maxillaryUL.map(t => <ToothButton key={t} label={t} />)}
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={{ borderBottom: '1px solid #f3f4f6' }}>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {mandibularLR.map(t => <ToothButton key={t} label={t} />)}
              </Box>
              <HeaderBox label="LR" />
            </Grid>
            <Grid item xs={6} sx={{ borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {mandibularLA.map((t, i) => <ToothButton key={i} label={t} />)}
              </Box>
              <HeaderBox label="LA" />
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {mandibularLL.map(t => <ToothButton key={t} label={t} />)}
              </Box>
              <HeaderBox label="LL" />
            </Grid>
          </Grid>
          <HeaderBox label="Mandibular Arch" />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          {['Supernumerary Adult Teeth', 'Retained Primary Teeth', 'Supernumerary Primary Teeth'].map(label => (
            <Button
              key={label}
              variant="contained"
              size="small"
              sx={{
                bgcolor: '#003380',
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '12px',
                px: 2,
                '&:hover': { bgcolor: '#002660' }
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#5c7bb5' }} />

        {/* Select Surface */}
        <Typography sx={{ color: '#5c7bb5', fontSize: '14px', mb: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          Select Surface
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 3 }}>
          {surfaces.map(s => (
            <Box
              key={s}
              sx={{
                border: '1px solid #9ca3af',
                width: '25px',
                height: '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f3f4f6' }
              }}
            >
              {s}
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#5c7bb5' }} />

        {/* Enter Code */}
        <Typography sx={{ color: '#5c7bb5', fontSize: '14px', mb: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          Enter Code
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <TextField
            placeholder="Enter code or procedure"
            variant="standard"
            sx={{ width: '250px', '& .MuiInput-input': { fontSize: '14px' } }}
          />
          <Typography sx={{ color: '#5c7bb5', fontSize: '14px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            Select Procedure
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, borderColor: '#5c7bb5' }} />

        {/* Footer Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={<Checkbox size="small" />}
            label="Don't Change Code"
            sx={{ '& .MuiTypography-root': { fontSize: '13px', fontWeight: 'bold', color: '#374151' } }}
          />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#d2b48c',
                color: 'white',
                textTransform: 'none',
                boxShadow: 'none',
                px: 4,
                '&:hover': { bgcolor: '#c1a37b', boxShadow: 'none' }
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                bgcolor: '#9ca3af',
                color: 'white',
                textTransform: 'none',
                boxShadow: 'none',
                px: 4,
                '&:hover': { bgcolor: '#8b949e', boxShadow: 'none' }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddNewProcedureDialog;
