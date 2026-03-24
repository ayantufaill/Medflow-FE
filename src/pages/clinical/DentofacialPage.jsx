import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DiagnosticNavbar from '../../components/clinical/DiagnosticNavbar';

const DentofacialPage = () => {
  const [risks, setRisks] = useState({});
  const [otherText, setOtherText] = useState('');

  const handleToggleRisk = (id, color) => {
    // Only one risk level per item - toggle between colors or clear if same color clicked
    setRisks(prev => ({ 
      ...prev, 
      [id]: prev[id] === color ? null : color 
    }));
  };

  const RiskCircle = ({ color, active, onClick }) => {
    const colors = { green: '#a3e635', yellow: '#fbbf24', red: '#f87171' };
    return (
      <Box
        onClick={onClick}
        sx={{
          width: 13, height: 13, borderRadius: '50%', border: `1.5px solid ${colors[color]}`,
          cursor: 'pointer', backgroundColor: active ? colors[color] : 'transparent',
          transition: 'background-color 0.1s ease'
        }}
      />
    );
  };

  const InputRow = ({ label, id, indent = 0 }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '4px', ml: indent }}>
      <Typography sx={{ fontSize: '13px', color: '#333', minWidth: 'fit-content' }}>{label}</Typography>
      <Box sx={{ borderBottom: '1px solid #9ca3af', flexGrow: 1, mx: 1, minWidth: '50px' }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        {['green', 'yellow', 'red'].map((color) => (
          <RiskCircle 
            key={color} 
            color={color} 
            active={risks[id] === color} 
            onClick={() => handleToggleRisk(id, color)} 
          />
        ))}
      </Box>
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

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        {/* Timeline Visualization */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>May 18, 2022</Typography>
            <Box sx={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#5b84c1' }} />
          </Box>
        </Box>

        {/* Legend Header */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 'bold', mr: 1 }}>Risk Assessment</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px', color: '#666' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#a3e635' }} /> Low
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px', color: '#666' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#fbbf24' }} /> Moderate
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px', color: '#666' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f87171' }} /> High
            </Box>
          </Box>
        </Box>

        {/* Form Content */}
        <Box sx={{ ml: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: '13px', color: '#333' }}>Teeth color</Typography>
            <Box sx={{ borderBottom: '1px solid #9ca3af', width: '300px' }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <Typography sx={{ fontSize: '13px', color: '#333' }}>Teeth Position (step 1-4)</Typography>
          </Box>

          {/* Sections 1-4 */}
          <Typography sx={{ fontSize: '13px', color: '#333', mt: 1 }}>1. Maxillary Incisal Edge Position:</Typography>
          <InputRow label="Vertical Position" id="max-inc-vert" indent={2} />
          <InputRow label="Horizontal Position" id="max-inc-horiz" indent={2} />

          <Typography sx={{ fontSize: '13px', color: '#333', mt: 2 }}>2. Maxillary Posterior Occlusal Plane</Typography>
          <InputRow label="Position" id="max-post-pos" indent={2} />

          <Typography sx={{ fontSize: '13px', color: '#333', mt: 2 }}>3. Mandibular Incisal Edge Position:</Typography>
          <InputRow label="Vertical Position" id="man-inc-vert" indent={2} />
          <InputRow label="Horizontal Position" id="man-inc-horiz" indent={2} />

          <Typography sx={{ fontSize: '13px', color: '#333', mt: 2 }}>4. Mandibular Posterior Occlusal Plane</Typography>
          <InputRow label="Position" id="man-post-pos" indent={2} />

          {/* Section 5 Alignment */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 3, mb: 1 }}>
            <Typography sx={{ fontSize: '13px', color: '#333' }}>5. Intra Arch Tooth Position (Alignment)</Typography>
          </Box>
          <InputRow label="Midline" id="align-midline" indent={2} />
          <InputRow label="Axial Inclination" id="align-axial" indent={2} />
          <InputRow label="Crowding/Overlap" id="align-crowd" indent={2} />
          <InputRow label="Diastema" id="align-diastema" indent={2} />
          <InputRow label="Rotation" id="align-rotation" indent={2} />

          {/* Section 6.a Maxillary */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 3, mb: 1 }}>
            <Typography sx={{ fontSize: '13px', color: '#333' }}>6.a. Gingival Tissue Assessment Maxillary</Typography>
          </Box>
          <InputRow label="Lip Dynamic (Mobility)" id="gin-max-lip" indent={4} />
          <InputRow label="Position" id="gin-max-pos" indent={4} />
          <InputRow label="Horizontal Symmetry" id="gin-max-sym" indent={4} />
          <InputRow label="Scallop/Form" id="gin-max-form" indent={4} />

          {/* Section 6.b Mandibular */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 3, mb: 1 }}>
            <Typography sx={{ fontSize: '13px', color: '#333' }}>6.b. Gingival Tissue Assessment Mandibular</Typography>
          </Box>
          <InputRow label="Lip Dynamic (Mobility)" id="gin-man-lip" indent={4} />
          <InputRow label="Position" id="gin-man-pos" indent={4} />
          <InputRow label="Horizontal Symmetry" id="gin-man-sym" indent={4} />
          <InputRow label="Scallop/Form" id="gin-man-form" indent={4} />

          {/* Other section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4 }}>
            <Typography sx={{ fontSize: '13px', color: '#333' }}>Other:</Typography>
          </Box>
          <TextField
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Enter additional notes"
            sx={{
              width: 220,
              mt: 0.5,
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

export default DentofacialPage;