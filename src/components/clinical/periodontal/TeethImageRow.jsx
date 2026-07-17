import React from 'react';
import { Box } from '@mui/material';

const getToothImage = (num) => {
  if (num >= 1 && num <= 16) {
    return new URL(`../../../assets/Teeth icons/u-${num}.png`, import.meta.url).href;
  }
  return new URL(`../../../assets/Teeth icons/d-${num}.png`, import.meta.url).href;
};

const TeethImageRow = ({ teeth = [], missingTeeth = [] }) => {
  return (
    <Box sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
      {teeth.map((num, idx) => {
        const isMissing = missingTeeth.includes(num);
        return (
          <Box 
            key={num} 
            sx={{ 
              flex: 1,
              minWidth: 0,
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: 'transparent',
              pointerEvents: isMissing ? 'none' : 'auto',
              px: 0.5,
              height: 80,
              borderRight: idx === teeth.length - 1 ? 'none' : '1px solid transparent'
            }}
          >
            <img 
              src={getToothImage(num)} 
              alt={`Tooth ${num}`} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                objectFit: 'contain',
                opacity: isMissing ? 0.3 : 1,
                transition: 'all 0.3s ease'
              }} 
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default TeethImageRow;
