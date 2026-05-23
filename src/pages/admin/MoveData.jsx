import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem
} from '@mui/material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

const MoveData = () => {
  // Left Column (Patient) state
  const [fromPatient, setFromPatient] = useState('');
  const [toPatient, setToPatient] = useState('');
  const [patientChecklist, setPatientChecklist] = useState({
    medicalHistory: false,
    notes: false,
    insurance: false,
    billing: false,
    treatmentPlan: false,
    exam: false,
  });

  // Right Column (Provider) state
  const [fromProvider, setFromProvider] = useState('Select Provider');
  const [toProvider, setToProvider] = useState('Select Provider');

  const handlePatientCheckboxChange = (name) => {
    setPatientChecklist(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleMovePatientData = () => {
    alert(`Moving patient data from "${fromPatient}" to "${toPatient}"...`);
  };

  const handleMoveProviderData = () => {
    alert(`Moving provider future data from "${fromProvider}" to "${toProvider}"...`);
  };

  const btnBg = '#c5a059';
  const btnHover = '#b08c48';

  return (
    <Box sx={{ p: 4, minHeight: '80vh', backgroundColor: '#fff' }}>
      <Grid container spacing={8} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto', mt: 2 }}>
        
        {/* Left Column: Move Patient Data */}
        <Grid item xs={12} md={5}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#1a3a6b', 
              fontWeight: 500,
              fontSize: '2rem',
              mb: 3
            }}
          >
            Move Patient Data
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 350 }}>
            {/* From Patient */}
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                From patient:
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="From Patient"
                value={fromPatient}
                onChange={(e) => setFromPatient(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 },
                  '& .MuiOutlinedInput-root': { borderRadius: '4px' }
                }}
              />
            </Box>

            {/* To Patient */}
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                To patient:
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="To Patient"
                value={toPatient}
                onChange={(e) => setToPatient(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1 },
                  '& .MuiOutlinedInput-root': { borderRadius: '4px' }
                }}
              />
            </Box>

            {/* Checklist */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small" 
                    checked={patientChecklist.medicalHistory} 
                    onChange={() => handlePatientCheckboxChange('medicalHistory')}
                  />
                }
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Medical And Dental History</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small" 
                    checked={patientChecklist.notes} 
                    onChange={() => handlePatientCheckboxChange('notes')}
                  />
                }
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Notes</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small" 
                    checked={patientChecklist.insurance} 
                    onChange={() => handlePatientCheckboxChange('insurance')}
                  />
                }
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Insurance</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small" 
                    checked={patientChecklist.billing} 
                    onChange={() => handlePatientCheckboxChange('billing')}
                  />
                }
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Billing</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small" 
                    checked={patientChecklist.treatmentPlan} 
                    onChange={() => handlePatientCheckboxChange('treatmentPlan')}
                  />
                }
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Treatment Plan</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    size="small" 
                    checked={patientChecklist.exam} 
                    onChange={() => handlePatientCheckboxChange('exam')}
                  />
                }
                label={<Typography sx={{ fontSize: '0.85rem', color: '#333' }}>Exam</Typography>}
              />
            </Box>

            {/* Action Button */}
            <Button
              variant="contained"
              onClick={handleMovePatientData}
              sx={{
                backgroundColor: btnBg,
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                py: 0.8,
                px: 3,
                mt: 1,
                alignSelf: 'flex-start',
                borderRadius: '4px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: btnHover,
                  boxShadow: 'none'
                }
              }}
            >
              Move Patient Data
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Move Provider Future Data */}
        <Grid item xs={12} md={5}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#1a3a6b', 
              fontWeight: 500,
              fontSize: '2rem',
              mb: 0.5
            }}
          >
            Move Provider Future Data
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#333', 
              fontSize: '0.95rem',
              mb: 3
            }}
          >
            (future appointments & procedures, preferred DDS, etc.)
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 350 }}>
            {/* From Provider */}
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                From provider:
              </Typography>
              <Select
                fullWidth
                size="small"
                value={fromProvider}
                onChange={(e) => setFromProvider(e.target.value)}
                sx={{ height: 38, fontSize: '0.85rem' }}
              >
                <MenuItem value="Select Provider">Select Provider</MenuItem>
                <MenuItem value="Dr. John Doe">Dr. John Doe</MenuItem>
                <MenuItem value="Dr. Jane Smith">Dr. Jane Smith</MenuItem>
                <MenuItem value="Dr. Robert Lee">Dr. Robert Lee</MenuItem>
              </Select>
            </Box>

            {/* To Provider */}
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', mb: 0.5 }}>
                To provider:
              </Typography>
              <Select
                fullWidth
                size="small"
                value={toProvider}
                onChange={(e) => setToProvider(e.target.value)}
                sx={{ height: 38, fontSize: '0.85rem' }}
              >
                <MenuItem value="Select Provider">Select Provider</MenuItem>
                <MenuItem value="Dr. John Doe">Dr. John Doe</MenuItem>
                <MenuItem value="Dr. Jane Smith">Dr. Jane Smith</MenuItem>
                <MenuItem value="Dr. Robert Lee">Dr. Robert Lee</MenuItem>
              </Select>
            </Box>

            {/* Action Button */}
            <Button
              variant="contained"
              onClick={handleMoveProviderData}
              sx={{
                backgroundColor: btnBg,
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                py: 0.8,
                px: 3,
                mt: 1.5,
                alignSelf: 'flex-start',
                borderRadius: '4px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: btnHover,
                  boxShadow: 'none'
                }
              }}
            >
              Move Provider Data
            </Button>

            {/* Book Icon */}
            <Box sx={{ mt: 1 }}>
              <MenuBookOutlinedIcon sx={{ color: '#4a5568', fontSize: '1.8rem' }} />
            </Box>
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
};

export default MoveData;
