import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';

const GenerateStatementsDialog = ({ onClose, onGenerate }) => {
  const [statementType, setStatementType] = useState('Family');
  const [shareWithPatients, setShareWithPatients] = useState(true);

  const handleGenerate = () => {
    onGenerate?.({
      type: statementType,
      share: shareWithPatients,
    });
  };

  const headerBackground = '#4a70b0';
  const generateButtonBg = '#d4c197';
  const generateButtonHover = '#c5b396';

  return (
    <Box sx={{ width: '100%', minWidth: '400px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ bgcolor: headerBackground, py: 1.5, textAlign: 'center' }}>
        <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>
          Generate Statements
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ p: 3 }}>
        {/* Radio options */}
        <RadioGroup
          row
          value={statementType}
          onChange={(e) => setStatementType(e.target.value)}
          sx={{ mb: 2, gap: 3 }}
        >
          <FormControlLabel
            value="Family"
            control={<Radio size="small" />}
            label={<Typography sx={{ fontSize: '0.875rem' }}>Family</Typography>}
          />
          <FormControlLabel
            value="Individual"
            control={<Radio size="small" />}
            label={<Typography sx={{ fontSize: '0.875rem' }}>Individual</Typography>}
          />
        </RadioGroup>

        {/* Checkbox */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={shareWithPatients}
                onChange={(e) => setShareWithPatients(e.target.checked)}
              />
            }
            label={<Typography sx={{ fontSize: '0.875rem' }}>Share With Patients</Typography>}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            variant="contained"
            onClick={handleGenerate}
            sx={{
              bgcolor: generateButtonBg,
              color: '#fff',
              textTransform: 'none',
              boxShadow: 'none',
              px: 3,
              fontSize: '0.8125rem',
              '&:hover': { bgcolor: generateButtonHover },
            }}
          >
            Generate
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: '#a9a9a9',
              color: '#fff',
              textTransform: 'none',
              boxShadow: 'none',
              px: 3,
              fontSize: '0.8125rem',
              '&:hover': { bgcolor: '#999' },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GenerateStatementsDialog;
