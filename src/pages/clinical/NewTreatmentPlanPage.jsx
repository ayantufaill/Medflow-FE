import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import dayjs from 'dayjs';

import NewTreatmentPlanHeader from '../../components/clinical/new-treatment-plan/NewTreatmentPlanHeader';
import NewTreatmentPlanOdontogram from '../../components/clinical/new-treatment-plan/NewTreatmentPlanOdontogram';
import NewTreatmentPlanProcedures from '../../components/clinical/new-treatment-plan/NewTreatmentPlanProcedures';
import NewTreatmentPlanTable from '../../components/clinical/new-treatment-plan/NewTreatmentPlanTable';
import { useSelector } from 'react-redux';
import { selectCurrentPatient } from '../../store/slices/patientSlice';
import { treatmentPlanService } from '../../services/treatment-plan.service';

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
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  
  const currentPatient = useSelector(selectCurrentPatient);
  const [activePlanId, setActivePlanId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTreatmentPlans = async () => {
      if (!currentPatient) {
        setTreatmentPlans([]);
        setActivePlanId(null);
        return;
      }
      try {
        setIsLoading(true);
        const res = await treatmentPlanService.getAll({ patientId: currentPatient._id || currentPatient.id });
        const plans = res?.data?.treatmentPlans || [];
        
        if (plans.length > 0) {
          const activePlan = plans[0]; // Load the most recent plan
          setActivePlanId(activePlan._id);
          
          if (activePlan.items && Array.isArray(activePlan.items)) {
            const mappedItems = activePlan.items.map((item, idx) => ({
              id: item.id || idx + 1,
              priority: item.priority || '- -',
              status: item.status === 'P' ? 'Planned' : (item.status === 'EO' ? 'Existing' : (item.status === 'R' ? 'Referred' : (item.status === 'D' ? 'Completed' : (item.status === 'S' ? 'Scheduled' : 'Planned')))),
              created: item.created || dayjs(activePlan.createdAt).format('MM/DD/YYYY') || dayjs().format('MM/DD/YYYY'),
              scheduled: item.scheduled || '-',
              site: item.site || '-',
              code: item.procedureCode || item.code || '-',
              description: item.description || '-',
              icd: item.icd || '-',
              provider: item.provider || '-',
              negRate: typeof item.charge === 'number' ? `$${item.charge.toFixed(2)}` : (item.negRate || '-'),
              insEst: typeof item.insPortion === 'number' ? `$${item.insPortion.toFixed(2)}` : (item.insEst || '-'),
              ptEst: typeof item.ptPortion === 'number' ? `$${item.ptPortion.toFixed(2)}` : (item.ptEst || '-'),
              preAuth: item.preAuth || '-',
              labCase: item.labCase || '-'
            }));
            setTreatmentPlans(mappedItems);
          } else {
            setTreatmentPlans([]);
          }
        } else {
          setActivePlanId(null);
          setTreatmentPlans([]);
        }
      } catch (err) {
        console.error('Failed to fetch treatment plans:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTreatmentPlans();
  }, [currentPatient]);

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

  const handleAddProcedure = async (procedure) => {
    if (!currentPatient) {
      setToast({ open: true, message: 'Please select a patient first.', type: 'error' });
      return;
    }

    const newId = treatmentPlans.length > 0 ? Math.max(...treatmentPlans.map(p => p.id)) + 1 : 1;
    const surfaceStr = selectedSurfaces.length > 0 ? ' ' + selectedSurfaces.join(' ') : '';
    const formattedSite = selectedTeeth.length > 0 ? selectedTeeth.map(t => `#${t}${surfaceStr}`).join(', ') : (selectedSurfaces.join(' ') || '-');
    const procedureCode = procedure.code || procedure.procedureCode || `D${Math.floor(1000 + Math.random() * 9000)}`;
    const procedureDescription = procedure.description || procedure.name || procedureCode;
    
    const newProcedure = {
      id: newId,
      priority: '- -',
      status: procedure.status || 'Planned',
      created: dayjs().format('MM/DD/YYYY'),
      scheduled: '-',
      site: formattedSite,
      code: procedureCode,
      description: procedureDescription,
      icd: '-',
      provider: procedure.provider || 'CB',
      negRate: '$0.00',
      insEst: '-',
      ptEst: '$0.00',
      preAuth: '-',
      labCase: '-'
    };

    const newTreatmentPlans = [newProcedure, ...treatmentPlans];

    // Optimistic UI Update
    setTreatmentPlans(newTreatmentPlans);
    setSelectedTeeth([]); // Clear selection after adding
    setSelectedSurfaces([]); // Clear surface selection too

    // Auto-save logic
    try {
      setIsSaving(true);
      
      const payload = {
        patientId: currentPatient._id || currentPatient.id,
        title: `Treatment Plan - ${dayjs().format('MM/DD/YYYY')}`,
        status: 'A',
        totalAmount: 0,
        items: newTreatmentPlans.map(item => ({
          procedureCode: item.code,
          description: item.description,
          tooth: item.site?.replace('#', '')?.split(' ')[0] || '',
          site: item.site,
          fee: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
          charge: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
          priority: item.priority,
          status: item.status === 'Planned' ? 'P' : (item.status === 'Existing' ? 'EO' : (item.status === 'Referred' ? 'R' : (item.status === 'Completed' ? 'D' : 'P'))), 
          icd: item.icd,
          provider: item.provider !== 'CB' ? item.provider : null,
          preAuth: item.preAuth,
          labCase: item.labCase,
          insEst: item.insEst,
          ptEst: item.ptEst,
        }))
      };

      if (activePlanId) {
        // Update existing plan instead of creating a new one
        await treatmentPlanService.update(activePlanId, { items: payload.items });
        setToast({ open: true, message: 'Treatment plan auto-saved!', type: 'success' });
      } else {
        // Create initial plan
        const res = await treatmentPlanService.create(payload);
        const createdId = res?.data?.treatmentPlan?._id || res?._id;
        if (createdId) {
          setActivePlanId(createdId);
        }
        setToast({ open: true, message: 'Treatment plan created and saved!', type: 'success' });
      }
    } catch (error) {
      console.error('Failed to auto-save treatment plan:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to auto-save plan.');
      setToast({ open: true, message: errMsg, type: 'error' });
      // Revert optimistic update
      setTreatmentPlans(treatmentPlans);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItems = async (itemIdsToDelete) => {
    if (!currentPatient || !activePlanId) return;
    
    const newTreatmentPlans = treatmentPlans.filter(item => !itemIdsToDelete.includes(item.id));
    
    // Optimistic UI update
    setTreatmentPlans(newTreatmentPlans);

    // Auto-save logic
    try {
      setIsSaving(true);
      
      const payloadItems = newTreatmentPlans.map(item => ({
        procedureCode: item.code,
        description: item.description,
        tooth: item.site?.replace('#', '')?.split(' ')[0] || '',
        site: item.site,
        fee: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
        charge: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
        priority: item.priority,
        status: item.status === 'Planned' ? 'P' : (item.status === 'Existing' ? 'EO' : (item.status === 'Referred' ? 'R' : (item.status === 'Completed' ? 'D' : 'P'))), 
        icd: item.icd,
        provider: item.provider !== 'CB' ? item.provider : null,
        preAuth: item.preAuth,
        labCase: item.labCase,
        insEst: item.insEst,
        ptEst: item.ptEst,
      }));

      await treatmentPlanService.update(activePlanId, { items: payloadItems });
      setToast({ open: true, message: 'Procedures removed and plan auto-saved!', type: 'success' });
    } catch (error) {
      console.error('Failed to auto-save treatment plan after deletion:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to auto-save plan.');
      setToast({ open: true, message: errMsg, type: 'error' });
      // Revert optimistic update
      setTreatmentPlans(treatmentPlans);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveToTop = async (itemIdsToMove) => {
    if (!currentPatient || !activePlanId || itemIdsToMove.length === 0) return;

    const itemsToMove = treatmentPlans.filter(item => itemIdsToMove.includes(item.id));
    const remainingItems = treatmentPlans.filter(item => !itemIdsToMove.includes(item.id));
    const newTreatmentPlans = [...itemsToMove, ...remainingItems];

    // Optimistic UI update
    setTreatmentPlans(newTreatmentPlans);

    // Auto-save logic
    try {
      setIsSaving(true);
      
      const payloadItems = newTreatmentPlans.map(item => ({
        procedureCode: item.code,
        description: item.description,
        tooth: item.site?.replace('#', '')?.split(' ')[0] || '',
        site: item.site,
        fee: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
        charge: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
        priority: item.priority,
        status: item.status === 'Planned' ? 'P' : (item.status === 'Existing' ? 'EO' : (item.status === 'Referred' ? 'R' : (item.status === 'Completed' ? 'D' : 'P'))), 
        icd: item.icd,
        provider: item.provider !== 'CB' ? item.provider : null,
        preAuth: item.preAuth,
        labCase: item.labCase,
        insEst: item.insEst,
        ptEst: item.ptEst,
      }));

      await treatmentPlanService.update(activePlanId, { items: payloadItems });
      setToast({ open: true, message: 'Procedures moved to top and plan auto-saved!', type: 'success' });
    } catch (error) {
      console.error('Failed to auto-save treatment plan after reordering:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to auto-save plan.');
      setToast({ open: true, message: errMsg, type: 'error' });
      // Revert optimistic update
      setTreatmentPlans(treatmentPlans);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateItemStatus = async (itemId, newStatus) => {
    if (!currentPatient || !activePlanId) return;

    const newTreatmentPlans = treatmentPlans.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    );

    // Optimistic UI update
    setTreatmentPlans(newTreatmentPlans);

    // Auto-save logic
    try {
      setIsSaving(true);
      
      const payloadItems = newTreatmentPlans.map(item => ({
        procedureCode: item.code,
        description: item.description,
        tooth: item.site?.replace('#', '')?.split(' ')[0] || '',
        site: item.site,
        fee: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
        charge: item.negRate !== '-' && item.negRate ? Number(item.negRate.replace(/[^0-9.-]+/g, "")) : 0,
        priority: item.priority,
        status: item.status === 'Planned' ? 'P' : (item.status === 'Existing' ? 'EO' : (item.status === 'Referred' ? 'R' : (item.status === 'Completed' ? 'D' : 'P'))), 
        icd: item.icd,
        provider: item.provider !== 'CB' ? item.provider : null,
        preAuth: item.preAuth,
        labCase: item.labCase,
        insEst: item.insEst,
        ptEst: item.ptEst,
      }));

      await treatmentPlanService.update(activePlanId, { items: payloadItems });
      setToast({ open: true, message: 'Status updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to update item status:', error);
      const errData = error.response?.data?.error;
      const errMsg = typeof errData === 'string' ? errData : (errData?.message || error.message || 'Failed to update status.');
      setToast({ open: true, message: errMsg, type: 'error' });
      // Revert optimistic update
      setTreatmentPlans(treatmentPlans);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ p: 1, bgcolor: '#f4f6f8', minHeight: '100vh', width: '100%' }}>
      
      {/* Page Header Toolbar */}
      <NewTreatmentPlanHeader 
        showOdontogram={showOdontogram} 
        setShowOdontogram={setShowOdontogram} 
      />

      {/* Top Section (Odontogram + Navigation) */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'stretch', width: '100%' }}>
        
        {/* Left Pane - Odontogram */}
        {showOdontogram && (
          <Box sx={{ flex: 7.5, minWidth: 0 }}>
            <NewTreatmentPlanOdontogram 
              selectedTeeth={selectedTeeth} 
              onToothClick={handleToothClick} 
              selectedSurfaces={selectedSurfaces}
              onSidebarSurfaceClick={handleSidebarSurfaceClick}
            />
          </Box>
        )}

        {/* Right Pane - Navigation & Procedures */}
        <Box sx={{ flex: showOdontogram ? 4.5 : 12, minWidth: 0 }}>
          <NewTreatmentPlanProcedures 
            onProcedureClick={handleAddProcedure} 
          />
        </Box>

      </Box>

      {/* Bottom Section (Data Table) */}
      <NewTreatmentPlanTable 
        treatmentPlans={treatmentPlans} 
        onDeleteItems={handleDeleteItems}
        onMoveToTop={handleMoveToTop}
        onUpdateItemStatus={handleUpdateItemStatus}
      />
      
      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.type} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewTreatmentPlanPage;
