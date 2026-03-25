import { Box, Typography, Checkbox, Divider, TextField } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DiagnosticNavbar from '../../components/clinical/DiagnosticNavbar';
import React, { useState } from 'react';

const BiomechanicalPage = () => {
  const [selected, setSelected] = useState({ 'Structural Compromises': true });
  const [otherText, setOtherText] = useState('');
  const [radioValue, setRadioValue] = useState(null); // 'found' or 'not-found'

  const assessments = [
    { label: "Caries" },
    { label: "White Spot Lesion (WSL)" },
    { label: "Xerostomia" },
    { label: "Erosion" },
    { label: "Abrasion" },
    { label: "Defective Restorations" },
    { label: "Questionable Restorations" },
    { label: "Structural Compromises", badge: "3 MODL", badgeColor: "#f87171" },
    { label: "Restoration Margin Location Concerns" },
  ];

  const pulpalSection = [
    { label: "Pulpal Pathology" },
    { label: "Future Pulpal Risk" },
    { label: "Root Canal Treatment Concerns" },
  ];

  // Reusable Row Component using MUI
  const Row = ({ label, badge, badgeColor }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: '2px' }}>
      <Box 
        onClick={() => setSelected(prev => ({...prev, [label]: !prev[label]}))}
        sx={{ 
          width: 13, 
          height: 13, 
          borderRadius: '50%', 
          border: '1px solid #9ca3af', 
          cursor: 'pointer',
          backgroundColor: selected[label] ? '#4b5563' : '#fff',
          transition: 'background-color 0.2s'
        }} 
      />
      <Typography sx={{ fontSize: '13px', color: '#333', fontWeight: 400 }}>
        {label}
      </Typography>
      <Typography sx={{ color: '#9ca3af', fontSize: '10px', cursor: 'help' }}>ⓘ</Typography>
      {badge && (
        <Box sx={{ 
          backgroundColor: badgeColor, 
          color: '#fff', 
          fontSize: '10px', 
          px: 0.8, 
          py: '1px', 
          borderRadius: '2px', 
          fontWeight: 'bold',
          ml: 0.5 
        }}>
          {badge}
        </Box>
      )}
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
      
      {/* Risk Assessment Container */}
      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        
        {/* Timeline Visualization */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>Jan 06, 2023</Typography>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#8fb3d3' }} />
          </Box>
          <Box sx={{ height: '2px', width: 60, backgroundColor: '#8fb3d3', mt: '21px', position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute', right: -12, top: -9, 
              width: 20, height: 20, borderRadius: '50%', 
              backgroundColor: '#5b84c1' 
            }} />
            <Box sx={{ position: 'absolute', right: -15, top: 25, whiteSpace: 'nowrap' }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: '#000' }}>Feb 21, 2023</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, mt: 4 }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Risk Assessment</Typography>
          
          {/* Legend */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Color Legend */}
            <Box sx={{ display: 'flex', gap: 1.5, fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }} /> Minimal
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#a3e635' }} /> Low
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#fbbf24' }} /> Moderate
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#f87171' }} /> High
              </Box>
            </Box>
            {/* Radio Legend */}
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

        {/* Checkbox Line */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, ml: '180px' }}>
          <Checkbox size="small" sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 16 } }} />
          <Typography sx={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
            Risk modified by shared risk factors
          </Typography>
        </Box>

        {/* Form Sections */}
        <Box sx={{ ml: 2 }}>
          {assessments.map(item => <Row key={item.label} {...item} />)}
          
          <Divider sx={{ my: 1.5, borderColor: '#e5e7eb' }} />
          
          {pulpalSection.map(item => <Row key={item.label} {...item} />)}
          
          <Divider sx={{ my: 1.5, borderColor: '#e5e7eb' }} />
          
          <Row label="Missing Teeth" />
          
          <Divider sx={{ my: 1.5, borderColor: '#e5e7eb' }} />

          <Row label="Appliances:" />
          <Row label="Trauma:" />

          <Divider sx={{ my: 4, borderColor: '#333', borderWidth: '0.5px' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography sx={{ fontSize: '13px', color: '#333' }}>Other:</Typography>
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

export default BiomechanicalPage;