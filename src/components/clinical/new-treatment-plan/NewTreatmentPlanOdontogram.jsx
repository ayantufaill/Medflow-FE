import React from 'react';
import { Box, Paper } from '@mui/material';
import InteractiveToothChart from '../../clinical/InteractiveToothChart';

const NewTreatmentPlanOdontogram = ({ selectedTeeth, onToothClick, selectedSurfaces, onSidebarSurfaceClick }) => {

  const toothSurfacesObj = {};
  selectedTeeth.forEach(tooth => {
    toothSurfacesObj[tooth] = selectedSurfaces;
  });

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: '8px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
        <InteractiveToothChart 
          selectedTeeth={selectedTeeth}
          onToothClick={onToothClick}
          selectedSidebarSurfaces={selectedSurfaces}
          onSidebarSurfaceClick={onSidebarSurfaceClick}
          isTreatmentPlan={true}
          toothSurfaces={toothSurfacesObj}
        />
      </Box>
    </Paper>
  );
};

export default NewTreatmentPlanOdontogram;
