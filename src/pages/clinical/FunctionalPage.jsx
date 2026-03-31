import React, { useState } from 'react';
import { Box, Typography, Checkbox, Divider, TextField } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DiagnosticNavbar from '../../components/clinical/DiagnosticNavbar';

const FunctionalAssessmentPage = () => {
  const [findings, setFindings] = useState({});
  const [risks, setRisks] = useState({});
  const [otherText, setOtherText] = useState('');
  const [radioValue, setRadioValue] = useState(null); // 'found' or 'not-found'

  // Section definitions for dynamic rendering
  const sectionGroups = [
    {
      key: 'mainFindings',
      title: 'Main Findings',
      fields: [
        { id: 'attrition_normal', label: "Attrition / Normal Force" },
        { id: 'attrition_abnormal', label: "Abnormal Attrition/Bruxism/Excessive Force" },
        { id: 'abfraction', label: "Abfraction" },
        { id: 'occlusal_trauma', label: "Primary Occlusal Traumatism" },
        { id: 'tmd', label: "TMD" },
        { id: 'muscle', label: "Muscle" },
        { id: 'neuromuscular', label: "Abnormal Neuromuscular Habits" },
        { id: 'missing_teeth', label: "Missing teeth" },
      ]
    },
    {
      key: 'functionalAssessment',
      title: 'Functional Assessment',
      isFunctional: true,
      fields: [
        { id: 'acceptable', label: "Acceptable Function", riskOptions: ['green', 'yellow'] },
        { id: 'frictional', label: "Frictional", riskOptions: ['yellow', 'red'] },
        { id: 'constricted', label: "Constricted Chewing Pattern", riskOptions: ['yellow', 'red'] },
        { id: 'dysfunction', label: "Occlusal Dysfunction (OSA, UARS)", riskOptions: ['yellow', 'red'] },
        { id: 'parafunction', label: "Parafunction (Sleep Bruxism)", riskOptions: ['red'] },
        { id: 'neurologic', label: "Neurologic Disorders", riskOptions: ['red'] },
      ]
    },
    {
      key: 'additionalFindings',
      title: 'Additional Findings',
      fields: [
        { id: 'labial_frenum', label: "Labial Frenum" },
        { id: 'lingual_frenum', label: "Lingual Frenum" },
      ]
    }
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

  const FieldRow = ({ field, isFunctional }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', py: isFunctional ? '6px' : '2px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <Box 
          onClick={() => handleToggleFinding(field.id)}
          sx={{ 
            width: 13, height: 13, borderRadius: '50%', border: '1px solid #9ca3af', cursor: 'pointer',
            backgroundColor: findings[field.id] ? '#4b5563' : '#fff',
            transition: 'background-color 0.2s'
          }} 
        />
        <Typography sx={{ fontSize: '13px', color: '#333', fontWeight: 400 }}>{field.label}</Typography>
        <Typography sx={{ color: '#9ca3af', fontSize: '10px', cursor: 'help' }}>ⓘ</Typography>
      </Box>

      {isFunctional && field.riskOptions && (
        <Box sx={{ display: 'flex', gap: 1.5, mr: '20%' }}>
          {field.riskOptions.map(color => (
            <RiskCircle key={color} color={color} active={risks[field.id] === color} onClick={() => handleToggleRisk(field.id, color)} />
          ))}
        </Box>
      )}
    </Box>
  );

  const SectionRenderer = ({ section }) => (
    <Box>
      {section.title && (
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: '#333', mt: 1, mb: 1 }}>
          {section.title}
        </Typography>
      )}
      {section.fields.map((field, index) => (
        <FieldRow key={field.id || index} field={field} isFunctional={section.isFunctional} />
      ))}
    </Box>
  );

  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Diagnostic Opinion
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Detailed diagnostic opinions and clinical assessments
        </Typography>
      </Box>
      <DiagnosticNavbar />

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%', position: 'relative' }}>
        {/* Timeline Visualization - Positioned on Left */}
        <Box sx={{ position: 'absolute', left: '32px', top: '32px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>Jan 06, 2023</Typography>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#8fb3d3' }} />
          </Box>
        </Box>

        {/* Risk Assessment Legend - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, mt: 6 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Risk Assessment</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Color Legend */}
              <Box sx={{ display: 'flex', gap: 1.5, fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 12, height: 12, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }} /> Minimal</Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 12, height: 12, bgcolor: '#a3e635' }} /> Low</Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 12, height: 12, bgcolor: '#fbbf24' }} /> Moderate</Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box sx={{ width: 12, height: 12, bgcolor: '#f87171' }} /> High</Box>
              </Box>
              
              {/* Radio Legend */}
              <Box sx={{ display: 'flex', gap: 2, ml: 1, fontSize: '11px', color: '#666' }}>
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
        </Box>

        {/* Checkbox Line - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3 }}>
          <Checkbox size="small" sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 16 } }} />
          <Typography sx={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
            Risk modified by shared risk factors
          </Typography>
        </Box>

        {/* Form Content - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '900px' }}>
            <Box sx={{ ml: 2 }}>
              {/* Dynamic Section Rendering */}
              {sectionGroups.map((section, index) => (
                <Box key={section.key}>
                  <SectionRenderer section={section} />
                  {index < sectionGroups.length - 1 && (
                    <Divider sx={{ my: 1.5, borderColor: '#e5e7eb' }} />
                  )}
                </Box>
              ))}

              <Divider sx={{ my: 4, borderColor: '#333', borderWidth: '0.5px' }} />
              
              {/* Other Section */}
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
      </Box>
    </Box>
  );
};

export default FunctionalAssessmentPage;