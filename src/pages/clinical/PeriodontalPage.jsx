import React, { useState } from 'react';
import { 
  Box, Typography, Stack, Radio, Checkbox, 
  Divider, TextField 
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DiagnosticNavbar from '../../components/clinical/DiagnosticNavbar';

const PeriodontalPage = () => {
  const [selectedRisks, setSelectedRisks] = useState({});
  const [otherText, setOtherText] = useState('');
  const [radioValue, setRadioValue] = useState(null); // 'found' or 'not-found'

  const RiskCircle = ({ color, active, onClick }) => {
    const colors = { grey: '#e0e0e0', green: '#a3e635', yellow: '#fbbf24', red: '#f87171' };
    return (
      <Box
        onClick={onClick}
        sx={{
          width: 13, height: 13, borderRadius: '50%', 
          border: `1.5px solid ${colors[color]}`,
          cursor: 'pointer', backgroundColor: active ? colors[color] : 'transparent',
          transition: 'background-color 0.1s ease'
        }}
      />
    );
  };

  const FindingItem = ({ label, hasInfo = true, children }) => (
    <Box sx={{ mb: 0.8 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Radio size="small" sx={{ p: 0.5, color: '#bbb', '&.Mui-checked': { color: '#bbb' } }} />
        <Typography sx={{ fontSize: '13px', color: '#333' }}>{label}</Typography>
        {hasInfo && <InfoOutlinedIcon sx={{ fontSize: 13, color: '#ccc' }} />}
      </Stack>
      {children && (
        <Box sx={{ ml: 4, mt: 0.5 }}>
          {children}
        </Box>
      )}
    </Box>
  );

  return (
    <Box>
      <ClinicalNavbar />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Diagnostic Opinion
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Detailed diagnostic opinions and clinical assessments
        </Typography>
      </Box>
      <DiagnosticNavbar />

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%', position: 'relative' }}>
        {/* Timeline Visualization (Matched to DentofacialPage) */}
        <Box sx={{ position: 'absolute', left: '32px', top: '32px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>May 06, 2026</Typography>
            <Box sx={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#5b84c1' }} />
          </Box>
        </Box>

        {/* Legend Header (Matched to DentofacialPage style) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, mt: 6 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 'bold', mr: 1 }}>Risk Assessment</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '11px', color: '#666' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#e0e0e0' }} /> Minimal
            </Box>
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

        {/* Found/Not Found Indicators (Matched style) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
           <Stack direction="row" spacing={3} alignItems="center">
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  cursor: 'pointer',
                  opacity: radioValue === 'found' ? 1 : 0.7
                }}
                onClick={() => setRadioValue('found')}
              >
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: radioValue === 'found' ? '#4b5563' : '#e5e7eb', border: radioValue === 'found' ? 'none' : '1px solid #9ca3af' }} />
                <Typography sx={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>Found</Typography>
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  cursor: 'pointer',
                  opacity: radioValue === 'not-found' ? 1 : 0.7
                }}
                onClick={() => setRadioValue('not-found')}
              >
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: radioValue === 'not-found' ? '#4b5563' : '#e5e7eb', border: radioValue === 'not-found' ? 'none' : '1px solid #9ca3af' }} />
                <Typography sx={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>Not Found</Typography>
              </Box>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Checkbox size="small" sx={{ p: 0, color: '#bbb' }} />
                <Typography sx={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>Risk modified by shared risk factors</Typography>
              </Stack>
           </Stack>
        </Box>

        {/* Form Content */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: '800px', ml: 10 }}>
            <FindingItem label="Gingivitis (Gum)" />
            
            <FindingItem label="Attachment Loss / Chronic Periodontitis (Bone Loss)">
              <Stack direction="row" spacing={3} sx={{ mb: 1, mt: 0.5 }}>
                <Typography sx={{ fontSize: '12px', color: '#bbb', cursor: 'pointer', '&:hover': { color: '#5b84c1' } }}>Mild (Stage 1)</Typography>
                <Typography sx={{ fontSize: '12px', color: '#bbb', cursor: 'pointer', '&:hover': { color: '#5b84c1' } }}>Moderate (Stage 2)</Typography>
                <Typography sx={{ fontSize: '12px', color: '#bbb', cursor: 'pointer', '&:hover': { color: '#5b84c1' } }}>Advanced (Stage 3/4)</Typography>
              </Stack>
              <Stack direction="row" spacing={3}>
                <Typography sx={{ fontSize: '12px', color: '#bbb', cursor: 'pointer', '&:hover': { color: '#5b84c1' } }}>Infrabony</Typography>
                <Typography sx={{ fontSize: '12px', color: '#bbb', cursor: 'pointer', '&:hover': { color: '#5b84c1' } }}>Horizontal Bone Loss</Typography>
              </Stack>
            </FindingItem>

            <FindingItem label="Aggressive Periodontitis" />
            <FindingItem label="Secondary occlusal Traumatism" />
            <FindingItem label="Recession" />
            <FindingItem label="Posterior Bite Collapse" />
            <FindingItem label="Oral Pathology" />
            <FindingItem label="Impaction" />
            <FindingItem label="Missing Teeth" />

            <Box sx={{ mt: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '13px', color: '#333' }}>Other:</Typography>
                <InfoOutlinedIcon sx={{ fontSize: 13, color: '#ccc' }} />
              </Stack>
              <TextField
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                variant="standard"
                placeholder="Enter additional notes"
                sx={{
                  width: '300px',
                  '& .MuiInputBase-input': {
                    fontSize: '12px',
                    color: '#333',
                    p: '4px 0',
                  },
                  '& .MuiUnderlinedInput-root': {
                    '&::before': { borderBottom: '1px solid #9ca3af' },
                    '&:hover:not(.Mui-disabled, .Mui-error)::before': { borderBottom: '1px solid #6b7280' },
                    '&.Mui-focused::after': { borderBottom: '2px solid #5b84c1' },
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

export default PeriodontalPage;