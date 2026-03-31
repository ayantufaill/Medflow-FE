import { Box, Typography, Checkbox, Divider, TextField } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DiagnosticNavbar from '../../components/clinical/DiagnosticNavbar';
import React, { useState } from 'react';

const BiomechanicalPage = () => {
  const [selected, setSelected] = useState({ 'Structural Compromises': true });
  const [otherText, setOtherText] = useState('');
  const [radioValue, setRadioValue] = useState(null); // 'found' or 'not-found'

  // Dynamic data structure for assessments
  const assessmentGroups = [
    {
      title: 'Assessments',
      items: [
        { label: "Caries" },
        { label: "White Spot Lesion (WSL)" },
        { label: "Xerostomia" },
        { label: "Erosion" },
        { label: "Abrasion" },
        { label: "Defective Restorations" },
        { label: "Questionable Restorations" },
        { label: "Structural Compromises", badge: "3 MODL", badgeColor: "#f87171" },
        { label: "Restoration Margin Location Concerns" },
      ]
    },
    {
      title: 'Pulpal Section',
      items: [
        { label: "Pulpal Pathology" },
        { label: "Future Pulpal Risk" },
        { label: "Root Canal Treatment Concerns" },
      ],
      showDivider: true
    },
    {
      title: 'Additional Items',
      items: [
        { label: "Missing Teeth" },
      ],
      showDivider: true
    },
    {
      title: 'Special Items',
      items: [
        { label: "Appliances:" },
        { label: "Trauma:" }
      ],
      showThickDivider: true
    }
  ];

  const handleToggleSelection = (label) => {
    setSelected(prev => ({...prev, [label]: !prev[label]}));
  };

  // Reusable Row Component using MUI
  const Row = ({ label, badge, badgeColor }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: '2px' }}>
      <Box 
        onClick={() => handleToggleSelection(label)}
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

  // Dynamic renderer for assessment groups
  const AssessmentGroupRenderer = ({ group }) => (
    <>
      {group.items.map((item, index) => (
        <Row key={item.label || index} {...item} />
      ))}
      
      {group.showDivider && (
        <Divider sx={{ my: 1.5, borderColor: '#e5e7eb' }} />
      )}
      
      {group.showThickDivider && (
        <Divider sx={{ my: 4, borderColor: '#333', borderWidth: '0.5px' }} />
      )}
    </>
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
              <Box sx={{ display: 'flex', gap: 2, fontSize: '11px', color: '#666' }}>
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
              {/* Dynamic Assessment Groups Rendering */}
              {assessmentGroups.map((group, groupIndex) => (
                <AssessmentGroupRenderer key={group.title || groupIndex} group={group} />
              ))}

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
      </Box>
    </Box>
  );
};

export default BiomechanicalPage;