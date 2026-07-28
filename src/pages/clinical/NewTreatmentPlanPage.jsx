import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import dayjs from 'dayjs';

import NewTreatmentPlanHeader from '../../components/clinical/new-treatment-plan/NewTreatmentPlanHeader';
import NewTreatmentPlanOdontogram from '../../components/clinical/new-treatment-plan/NewTreatmentPlanOdontogram';
import NewTreatmentPlanProcedures from '../../components/clinical/new-treatment-plan/NewTreatmentPlanProcedures';
import NewTreatmentPlanTable from '../../components/clinical/new-treatment-plan/NewTreatmentPlanTable';

const INITIAL_MOCK_TREATMENT_PLANS = [
  { id: 1, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#1 OD', code: 'D2392', description: 'resin-based composite - two surfaces, p...', icd: '-', provider: 'CB', negRate: '$206.00', insEst: '$164.80', ptEst: '$41.20', preAuth: '-', labCase: '+' },
  { id: 2, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#J MO', code: 'D2392', description: 'resin-based composite - two surfaces, p...', icd: '-', provider: 'CB', negRate: '$206.00', insEst: '$164.80', ptEst: '$41.20', preAuth: '-', labCase: '+' },
  { id: 3, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#14', code: 'D1351', description: 'sealant - per tooth', icd: '-', provider: 'CB', negRate: '$51.00', insEst: '-', ptEst: '$51.00', preAuth: '-', labCase: '+' },
  { id: 4, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#19', code: 'D1351', description: 'sealant - per tooth', icd: '-', provider: 'CB', negRate: '$51.00', insEst: '-', ptEst: '$51.00', preAuth: '-', labCase: '+' },
];

const NewTreatmentPlanPage = () => {
  const [showOdontogram, setShowOdontogram] = useState(true);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState(INITIAL_MOCK_TREATMENT_PLANS);

  const handleToothClick = (num) => {
    if (selectedTeeth.includes(num)) {
      setSelectedTeeth(selectedTeeth.filter(n => n !== num));
    } else {
      setSelectedTeeth([...selectedTeeth, num]);
    }
  };

  const handleSidebarSurfaceClick = (lbl) => {
    if (selectedSurfaces.includes(lbl)) {
      setSelectedSurfaces(selectedSurfaces.filter(s => s !== lbl));
    } else {
      setSelectedSurfaces([...selectedSurfaces, lbl]);
    }
  };

  const handleAddProcedure = (procedure) => {
    const newId = treatmentPlans.length > 0 ? Math.max(...treatmentPlans.map(p => p.id)) + 1 : 1;
    const surfaceStr = selectedSurfaces.length > 0 ? ' ' + selectedSurfaces.join(' ') : '';
    const formattedSite = selectedTeeth.length > 0 ? selectedTeeth.map(t => `#${t}${surfaceStr}`).join(', ') : (selectedSurfaces.join(' ') || '-');
    
    const newProcedure = {
      id: newId,
      priority: '- -',
      status: 'Planned',
      created: dayjs().format('MM/DD/YYYY'),
      scheduled: '-',
      site: formattedSite,
      code: `D${Math.floor(1000 + Math.random() * 9000)}`, // Mock random code
      description: procedure.name,
      icd: '-',
      provider: 'CB',
      negRate: '$0.00',
      insEst: '-',
      ptEst: '$0.00',
      preAuth: '-',
      labCase: '-'
    };

    setTreatmentPlans([newProcedure, ...treatmentPlans]);
    setSelectedTeeth([]); // Clear selection after adding
    setSelectedSurfaces([]); // Clear surface selection too
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f4f6f8', minHeight: '100vh', width: '100%' }}>
      
      {/* Page Header Toolbar */}
      <NewTreatmentPlanHeader 
        showOdontogram={showOdontogram} 
        setShowOdontogram={setShowOdontogram} 
      />

      {/* Top Section (Odontogram + Navigation) */}
      <Grid container spacing={3} sx={{ mb: 3, flexWrap: 'nowrap', alignItems: 'stretch' }}>
        
        {/* Left Pane - Odontogram */}
        <Grid item xs={12} lg={7.5}>
          <NewTreatmentPlanOdontogram 
            selectedTeeth={selectedTeeth} 
            onToothClick={handleToothClick} 
            selectedSurfaces={selectedSurfaces}
            onSidebarSurfaceClick={handleSidebarSurfaceClick}
          />
        </Grid>

        {/* Right Pane - Navigation & Procedures */}
        <Grid item xs={12} lg={4.5}>
          <NewTreatmentPlanProcedures 
            onProcedureClick={handleAddProcedure} 
          />
        </Grid>

      </Grid>

      {/* Bottom Section (Data Table) */}
      <NewTreatmentPlanTable 
        treatmentPlans={treatmentPlans} 
      />
      
    </Box>
  );
};

export default NewTreatmentPlanPage;
