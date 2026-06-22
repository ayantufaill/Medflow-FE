import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Tooth } from '../radiographic';
import { fontSize } from "../../constants/styles";

const UPPER_TEETH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const LOWER_TEETH = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

const InteractiveToothChart = ({
  selectedTeeth = [],
  missingTeeth = [],
  uneruptedTeeth = [],
  toothFindings = {},
  toothSurfaces = {},
  onToothClick,
  onSurfaceClick,
  onSidebarSurfaceClick,
  onMaxToggle,
  onManToggle,
  isTreatmentPlan = false
}) => {

  const renderTooth = (n) => {
    // Evaluate conditions based on where the component is used
    const hasRadiolucency = !isTreatmentPlan 
      ? Boolean(toothFindings[n]?.findings?.includes('Coronal cavitation (Caries)') || toothFindings[n]?.findings?.includes('Coronal radiolucency')) 
      : false;
    const hasWatch = !isTreatmentPlan 
      ? Boolean(toothFindings[n]?.findings?.includes('Watch')) 
      : false;
    const surfaces = isTreatmentPlan 
      ? (toothSurfaces[n] || []) 
      : (toothFindings[n]?.surfaces || []);
    const depth = !isTreatmentPlan 
      ? (toothFindings[n]?.depth || 'Limited to enamel') 
      : undefined;

    return (
      <Tooth 
        key={n} 
        num={n} 
        isActive={selectedTeeth.includes(n)} 
        isMissing={missingTeeth.includes(n)}
        isUnerupted={uneruptedTeeth.includes(n)}
        uneruptedIndex={uneruptedTeeth.indexOf(n)}
        hasRadiolucency={hasRadiolucency}
        hasWatch={hasWatch}
        surfaces={surfaces}
        depth={depth}
        onClick={() => onToothClick && onToothClick(n)} 
        onSurfaceClick={onSurfaceClick ? (surf) => onSurfaceClick(n, surf) : undefined}
      />
    );
  };

  return (
    <>
      {/* Surface Selection Sidebar */}
      <Box sx={{ position: 'absolute', left: 10, top: 40, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {['V', 'C', 'B/F', 'M', 'O/I', 'D', 'L', 'MO', 'DO', 'MOD'].map(lbl => (
          <Box 
            key={lbl} 
            onClick={() => onSidebarSurfaceClick && onSidebarSurfaceClick(lbl)}
            sx={{ 
              width: 32, height: 28, border: '1px solid #ddd', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: fontSize.xs, color: '#666', borderRadius: '2px',
              cursor: 'pointer', transition: 'all 0.2s',
              '&:hover': { bgcolor: '#f0f4f8', borderColor: '#3b82f6', color: '#3b82f6' }
            }}
          >
            {lbl}
          </Box>
        ))}
      </Box>

      {/* Tooth Chart Grid */}
      <Box sx={{ ml: 6, mt: 4 }}>
        <Box sx={{ display: 'flex', position: 'relative', width: '100%', alignItems: 'stretch' }}>
          
          {/* Column 1: Q1 / Q4 */}
          <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Upper Row */}
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5 }}>
              {[1, 2, 3, 4, 5].map(n => renderTooth(n))}
            </Stack>
            
            {/* Upper Label */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mb: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>Q1</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>UR</Typography>
            </Box>
            
            {/* Lower Label */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mt: 2, mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>Q4</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>LR</Typography>
            </Box>
            
            {/* Lower Row */}
            <Stack direction="row" spacing={1} justifyContent="center">
              {[32, 31, 30, 29, 28].map(n => renderTooth(n))}
            </Stack>
          </Box>

          {/* Vertical Divider 1 */}
          <Box sx={{ borderLeft: '1px dotted #ccc', mx: 2, opacity: 0.8 }} />

          {/* Column 2: UA / LA */}
          <Box sx={{ flex: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Upper Row */}
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5 }}>
              {[6, 7, 8, 9, 10, 11].map(n => renderTooth(n))}
            </Stack>
            
            {/* Upper Label */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>UA</Typography>
            </Box>
            
            {/* Lower Label */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>LA</Typography>
            </Box>
            
            {/* Lower Row */}
            <Stack direction="row" spacing={1} justifyContent="center">
              {[27, 26, 25, 24, 23, 22].map(n => renderTooth(n))}
            </Stack>
          </Box>

          {/* Vertical Divider 2 */}
          <Box sx={{ borderLeft: '1px dotted #ccc', mx: 2, opacity: 0.8 }} />

          {/* Column 3: Q2 / Q3 */}
          <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pr: 4, position: 'relative' }}>
            {/* Upper Row */}
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5 }}>
              {[12, 13, 14, 15, 16].map(n => renderTooth(n))}
            </Stack>
            
            {/* Upper Label */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mb: 2, position: 'relative' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>UL</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>Q2</Typography>
              <Typography 
                onClick={onMaxToggle}
                sx={{ 
                  position: 'absolute', 
                  right: -32, 
                  top: 0, 
                  fontSize: '0.75rem', 
                  color: selectedTeeth.some(t => UPPER_TEETH.includes(t)) ? '#3b82f6' : '#666', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Max
              </Typography>
            </Box>
            
            {/* Lower Label */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mt: 2, mb: 1.5, position: 'relative' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>LL</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>Q3</Typography>
              <Typography 
                onClick={onManToggle}
                sx={{ 
                  position: 'absolute', 
                  right: -32, 
                  top: 0, 
                  fontSize: '0.75rem', 
                  color: selectedTeeth.some(t => LOWER_TEETH.includes(t)) ? '#3b82f6' : '#666', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Man
              </Typography>
            </Box>
            
            {/* Lower Row */}
            <Stack direction="row" spacing={1} justifyContent="center">
              {[21, 20, 19, 18, 17].map(n => renderTooth(n))}
            </Stack>
          </Box>

          {/* Horizontal Divider Line */}
          <Box sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            borderBottom: '1px dotted #ccc',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.8
          }} />
        </Box>
      </Box>
    </>
  );
};

export default InteractiveToothChart;
