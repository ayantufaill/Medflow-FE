import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';

const ClickableReportImage = ({ src = "/report_visual.png", sx = {} }) => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  return (
    <Box sx={{ position: 'relative', width: '100%', ...sx }}>
      <img 
        src={src} 
        alt="Dental Assessment Visualization"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      
      {/* Clickable Overlay Grid */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        cursor: 'pointer',
        zIndex: 10
      }}>
        {/* Top Left - Side 4 (Showcase) */}
        <Box 
          onClick={() => navigate(`/patients/${patientId}/report/showcase`)}
          sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          title="Showcase"
        />
        
        {/* Top Right - Side 1 (Risk Assessment) */}
        <Box 
          onClick={() => navigate(`/patients/${patientId}/report/risk`)}
          sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          title="Risk Assessment"
        />
        
        {/* Bottom Left - Side 3 (Concerns) */}
        <Box 
          onClick={() => navigate(`/patients/${patientId}/report/concerns`)}
          sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          title="Concerns"
        />
        
        {/* Bottom Right - Side 2 (Home Care) */}
        <Box 
          onClick={() => navigate(`/patients/${patientId}/report/homecare`)}
          sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          title="Home Care"
        />
      </Box>
    </Box>
  );
};

export default ClickableReportImage;
