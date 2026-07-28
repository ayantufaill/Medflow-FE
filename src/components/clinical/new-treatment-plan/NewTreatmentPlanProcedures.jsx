import React, { useState } from 'react';
import { Box, Paper, MenuItem, Button, InputAdornment } from '@mui/material';
import { KeyboardArrowDown as ExpandMoreIcon } from '@mui/icons-material';
import { OutlinedSelect, OutlinedInput } from '../../patients/form-components/formInputs';

const PROCEDURE_CATEGORIES = [
  'Exam', 'Xray', 'Posterior Restorative', 'Ant Composite', 'Appliance', 'Oral Surgery', 'Implantology', 'Periodontics',
];

const MOCK_PROCEDURES = [
  { id: '1', name: 'Comp Ex' },
  { id: '2', name: 'Periodic' },
  { id: '3', name: 'Exam<3y' },
  { id: '4', name: 'Limited Ex' },
  { id: '5', name: 'Consultation' },
  { id: '6', name: 'Fluor Varnish' },
  { id: '7', name: 'ReEvaluation' },
  { id: '8', name: 'Prophy Child' },
  { id: '9', name: 'Prophy Adult' },
  { id: '10', name: 'Prophy Child' },
  { id: '11', name: 'Prophy Adult' },
  { id: '12', name: 'Prophy Child' },
  { id: '13', name: 'Prophy Adult' },
  { id: '14', name: 'Prophy Child' },
  { id: '15', name: 'Prophy Adult' },
  { id: '16', name: 'Prophy Child' },
  { id: '17', name: 'Prophy Adult' },
  { id: '18', name: 'Prophy Child' },
  { id: '19', name: 'Prophy Adult' },
];

const NewTreatmentPlanProcedures = ({ onProcedureClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('Exam');
  const [selectedProcedureType, setSelectedProcedureType] = useState('Planned');

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: '8px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ width: '35%' }}>
          <OutlinedSelect
            value={selectedProcedureType}
            onChange={(e) => setSelectedProcedureType(e.target.value)}
            fullWidth
          >
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </OutlinedSelect>
        </Box>
        
        <Box sx={{ width: '65%' }}>
          <OutlinedSelect
            value={selectedProcedureType}
            fullWidth
          >
            <MenuItem value="Planned">Planned</MenuItem>
          </OutlinedSelect>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
        {/* Category Column */}
        <Box sx={{ width: '35%', height: '100%', maxHeight: '280px' }}>
          <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', height: '100%', overflowY: 'auto' }}>
            {PROCEDURE_CATEGORIES.map((cat, idx) => (
              <Box 
                key={idx} 
                onClick={() => setSelectedCategory(cat)}
                sx={{ 
                  p: 1.5, 
                  cursor: 'pointer', 
                  fontSize: '0.85rem',
                  color: selectedCategory === cat ? '#2563eb' : '#475569',
                  bgcolor: selectedCategory === cat ? '#eff6ff' : 'transparent',
                  borderLeft: selectedCategory === cat ? '3px solid #2563eb' : '3px solid transparent',
                  '&:hover': { bgcolor: '#f8fafc' }
                }}
              >
                {cat}
              </Box>
            ))}
          </Paper>
        </Box>

        {/* Procedures Grid */}
        <Box sx={{ 
          width: '65%', 
          height: '100%', 
          maxHeight: '280px', // Constrain height to force separate scrolling
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          alignContent: 'start',
          pr: 1 // Add padding for scrollbar
        }}>
          {MOCK_PROCEDURES.map((proc, idx) => (
            <Button
              key={idx}
              onClick={() => onProcedureClick(proc)}
              variant="outlined"
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                color: '#475569',
                borderColor: '#e2e8f0',
                bgcolor: '#fff',
                py: 2,
                px: 1.5,
                minHeight: '60px',
                textAlign: 'left',
                fontSize: '0.8rem',
                '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' }
              }}
            >
              {proc.name}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mt: 2 }}>
        <OutlinedInput 
          placeholder="Search/Select Procedure Code"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <ExpandMoreIcon />
              </InputAdornment>
            )
          }}
          fullWidth
        />
      </Box>

    </Paper>
  );
};

export default NewTreatmentPlanProcedures;
