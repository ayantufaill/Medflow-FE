import React from 'react';
import { Box } from '@mui/material';

const ClickableReportImage = ({ src = "/report_visual.png", sx = {}, onQuadrantClick }) => {
  return (
    <Box sx={{ position: 'relative', width: '100%', ...sx }}>
      <img 
        src={src} 
        alt="Dental Assessment Visualization"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      
      {/* Clickable Overlay Grid */}
      {onQuadrantClick && (
        <Box sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          cursor: 'pointer',
          zIndex: 10
        }}>
          {/* Top Left - Side 4 (Showcase / Appearance) */}
          <Box 
            onClick={() => onQuadrantClick('topLeft')}
            sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            title="Appearance"
          />
          
          {/* Top Right - Side 1 (Risk Assessment / Periodontal Health) */}
          <Box 
            onClick={() => onQuadrantClick('topRight')}
            sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            title="Periodontal Health"
          />
          
          {/* Bottom Left - Side 3 (Concerns / Bite & Jaw Joint) */}
          <Box 
            onClick={() => onQuadrantClick('bottomLeft')}
            sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            title="Bite & Jaw Joint"
          />
          
          {/* Bottom Right - Side 2 (Home Care / Tooth Structure) */}
          <Box 
            onClick={() => onQuadrantClick('bottomRight')}
            sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            title="Tooth Structure"
          />
        </Box>
      )}
    </Box>
  );
};

export default ClickableReportImage;
