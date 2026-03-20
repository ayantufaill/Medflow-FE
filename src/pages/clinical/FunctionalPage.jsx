import React, { useState } from 'react';
import { Box, Typography, Checkbox, Divider, TextField } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DiagnosticNavbar from '../../components/clinical/DiagnosticNavbar';

const FunctionalAssessmentPage = () => {
  const [findings, setFindings] = useState({ 'attrition_normal': true });
  const [risks, setRisks] = useState({});
  const [otherText, setOtherText] = useState('');
  const [radioValue, setRadioValue] = useState(null); // 'found' or 'not-found'

  const mainSection = [
    { id: 'attrition_normal', label: "Attrition / Normal Force" },
    { id: 'attrition_abnormal', label: "Abnormal Attrition/Bruxism/Excessive Force" },
    { id: 'abfraction', label: "Abfraction" },
    { id: 'occlusal_trauma', label: "Primary Occlusal Traumatism" },
    { id: 'tmd', label: "TMD" },
    { id: 'muscle', label: "Muscle" },
    { id: 'neuromuscular', label: "Abnormal Neuromuscular Habits" },
    { id: 'missing_teeth', label: "Missing teeth" },
  ];

  const functionalSection = [
    { id: 'acceptable', label: "Acceptable Function", options: ['green', 'yellow'] },
    { id: 'frictional', label: "Frictional", options: ['yellow', 'red'] },
    { id: 'constricted', label: "Constricted Chewing Pattern", options: ['yellow', 'red'] },
    { id: 'dysfunction', label: "Occlusal Dysfunction (OSA, UARS)", options: ['yellow', 'red'] },
    { id: 'parafunction', label: "Parafunction (Sleep Bruxism)", options: ['red'] },
    { id: 'neurologic', label: "Neurologic Disorders", options: ['red'] },
  ];

  const handleToggleFinding = (id) => {
    setFindings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleRisk = (id, color) => {
    setRisks(prev => ({ ...prev, [id]: prev[id] === color ? null : color }));
  };

  const RiskCircle = ({ color, active, onClick }) => {
    const colors = { green: '#a3e635', yellow: '#fbbf24', red: '#f87171' };
    return (
      <Box
        onClick={onClick}
        sx={{
          width: 15, height: 15, borderRadius: '50%', border: `1.8px solid ${colors[color]}`,
          cursor: 'pointer', backgroundColor: active ? colors[color] : 'transparent',
          transition: 'background-color 0.1s ease'
        }}
      />
    );
  };

  const Row = ({ id, label, isFunctional, options }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', py: isFunctional ? '6px' : '2px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <Box 
          onClick={() => handleToggleFinding(id)}
          sx={{ 
            width: 13, height: 13, borderRadius: '50%', border: '1px solid #9ca3af', cursor: 'pointer',
            backgroundColor: findings[id] ? '#4b5563' : '#fff',
            transition: 'background-color 0.2s'
          }} 
        />
        <Typography sx={{ fontSize: '13px', color: '#333', fontWeight: 400 }}>{label}</Typography>
        <Typography sx={{ color: '#9ca3af', fontSize: '10px', cursor: 'help' }}>ⓘ</Typography>
      </Box>

      {isFunctional && (
        <Box sx={{ display: 'flex', gap: 1.5, mr: '20%' }}>
          {options.map(color => (
            <RiskCircle key={color} color={color} active={risks[id] === color} onClick={() => handleToggleRisk(id, color)} />
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
      <ClinicalNavbar />
      <Box sx={{ px: 4, py: 2 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Diagnostic Opinion
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Detailed diagnostic opinions and clinical assessments
        </Typography>
      </Box>
      <DiagnosticNavbar />

      <Box sx={{ p: 4, maxWidth: 800 }}>
        {/* Timeline Visualization */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>Jan 06, 2023</Typography>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#8fb3d3' }} />
          </Box>
          <Box sx={{ height: '2px', width: 60, backgroundColor: '#8fb3d3', mt: '21px', position: 'relative' }}>
            <Box sx={{ position: 'absolute', right: -12, top: -9, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#5b84c1' }} />
            <Box sx={{ position: 'absolute', right: -15, top: 25, whiteSpace: 'nowrap' }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: '#000' }}>Feb 21, 2023</Typography>
            </Box>
          </Box>
        </Box>

        {/* Legend Header - Updated to match screenshot perfectly */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, mt: 4 }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Risk Assessment</Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1.5, fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 12, height: 12, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }} /> Minimal</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 12, height: 12, bgcolor: '#a3e635' }} /> Low</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 12, height: 12, bgcolor: '#fbbf24' }} /> Moderate</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 12, height: 12, bgcolor: '#f87171' }} /> High</Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, ml: 2, fontSize: '11px', color: '#666' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  cursor: 'pointer',
                  opacity: radioValue === 'found' ? 1 : 0.6
                }}
                onClick={() => setRadioValue('found')}
              >
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: radioValue === 'found' ? '#4b5563' : '#e5e7eb', border: radioValue === 'found' ? 'none' : '1px solid #9ca3af' }} /> 
                Found
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  cursor: 'pointer',
                  opacity: radioValue === 'not-found' ? 1 : 0.6
                }}
                onClick={() => setRadioValue('not-found')}
              >
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: radioValue === 'not-found' ? '#4b5563' : '#e5e7eb', border: radioValue === 'not-found' ? 'none' : '1px solid #9ca3af' }} /> 
                Not Found
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Checkbox Line - Positioned to match Biomechanical exactly */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, ml: '180px' }}>
          <Checkbox size="small" sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 16 } }} />
          <Typography sx={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
            Risk modified by shared risk factors
          </Typography>
        </Box>

        <Box sx={{ ml: 2 }}>
          {mainSection.map((item) => <Row key={item.id} {...item} />)}
          <Divider sx={{ my: 1.5, borderColor: '#e5e7eb' }} />
          {functionalSection.map((item) => <Row key={item.id} {...item} isFunctional={true} />)}
          <Divider sx={{ my: 1.5, borderColor: '#e5e7eb' }} />
          <Row id="labial_frenum" label="Labial Frenum" />
          <Row id="lingual_frenum" label="Lingual Frenum" />
          <Divider sx={{ my: 4, borderColor: '#333', borderWidth: '0.5px' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography sx={{ fontSize: '13px', color: '#333', fontWeight: 400 }}>Other:</Typography>
            <Typography sx={{ color: '#9ca3af', fontSize: '10px' }}>ⓘ</Typography>
          </Box>
          <TextField
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Enter additional notes"
            sx={{
              width: 220,
              mt: 0.5,
              ml: 0.5,
              '& .MuiInputBase-input': {
                fontSize: '13px',
                color: '#333',
                p: '8px 0',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
                borderBottom: '1px solid #9ca3af',
                borderRadius: 0,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FunctionalAssessmentPage;