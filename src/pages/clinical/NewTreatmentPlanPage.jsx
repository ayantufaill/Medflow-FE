import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Snackbar, Alert, Tabs, Tab, Grid, Paper, IconButton, Divider, MenuItem, Menu, Button, Tooltip, GlobalStyles } from '@mui/material';
import { COLORS } from '../../constants/colors';
import dayjs from 'dayjs';
import {
  ShieldOutlined as ShieldIcon,
  IosShare as ShareIcon,
  PrintOutlined as PrintIcon,
  ArchiveOutlined as ArchiveIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { OutlinedSelect } from '../../components/patients/form-components/formInputs';
import plusSvg from '../../assets/timeclock/add.svg';
import deleteSvg from '../../assets/practicesetupicon/deleteicon.svg';
import addClaimSvg from '../../assets/finance icons/addclaim.svg';
import shareSvg from '../../assets/finance icons/share.svg';
import printSvg from '../../assets/clinicalicons/print icon.svg';
import archiveSvg from '../../assets/clinicalicons/saveexamicon.svg';
import medflowLogo from '../../assets/medflow-logo.png';

import PreAuthModal from '../../components/clinical/new-treatment-plan/PreAuthModal';
import NewTreatmentPlanHeader from '../../components/clinical/new-treatment-plan/NewTreatmentPlanHeader';
import NewTreatmentPlanOdontogram from '../../components/clinical/new-treatment-plan/NewTreatmentPlanOdontogram';
import NewTreatmentPlanProcedures from '../../components/clinical/new-treatment-plan/NewTreatmentPlanProcedures';
import NewTreatmentPlanTable from '../../components/clinical/new-treatment-plan/NewTreatmentPlanTable';
import ChartTable from '../../components/clinical/new-treatment-plan/ChartTable';
import UnplannedProceduresSidebar from '../../components/clinical/new-treatment-plan/UnplannedProceduresSidebar';
import ArchiveDrawer from '../../components/clinical/new-treatment-plan/ArchiveDrawer';
import NotesDrawer from '../../components/clinical/new-treatment-plan/NotesDrawer';
import PeriodontalExamPage from './PeriodontalExamPage';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentPatient } from '../../store/slices/patientSlice';
import { setSelectedAppointmentId, fetchAppointmentById } from '../../store/slices/appointmentSlice';
import { treatmentPlanService } from '../../services/treatment-plan.service';
import { authorizationService } from '../../services/authorization.service';
import { calculatePortionsForCategory } from '../../utils/cdtCategoryHelper';

const formatMoney = (val, fallback = '-') => {
  if (typeof val === 'number') return `$${val.toFixed(2)}`;
  if (typeof val === 'string' && val.trim() && val !== '-') {
    const num = Number(val.replace(/[^0-9.-]+/g, ''));
    return !isNaN(num) ? `$${num.toFixed(2)}` : val;
  }
  return fallback;
};

const mapPlanItems = (items, createdAt) => {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item, idx) => {
    const feeVal = item.charge ?? item.fee ?? item.negRate;
    const insVal = item.insPortion ?? item.insuranceAmount ?? item.insEst;
    const ptVal = item.ptPortion ?? item.patientAmount ?? item.ptEst;

    return {
      id: item.id || idx + 1,
      priority: item.priority || '- -',
      status: item.status === 'P' ? 'Planned' : (item.status === 'EO' ? 'Existing' : (item.status === 'R' ? 'Referred' : (item.status === 'D' ? 'Completed' : (item.status === 'S' ? 'Scheduled' : (item.status || 'Planned'))))),
      created: item.created || (createdAt ? dayjs(createdAt).format('MM/DD/YYYY') : dayjs().format('MM/DD/YYYY')),
      scheduled: item.scheduled || '-',
      site: item.site || (item.tooth ? `#${item.tooth}` : '-'),
      code: item.procedureCode || item.code || '-',
      description: item.description || '-',
      icd: item.icd || '-',
      provider: item.provider || '-',
      negRate: formatMoney(feeVal, '-'),
      insEst: formatMoney(insVal, '-'),
      ptEst: formatMoney(ptVal, '-'),
      preAuth: item.preAuth || '-',
      labCase: item.labCase || '-'
    };
  });
};

const INITIAL_MOCK_TREATMENT_PLANS = [
  { id: 1, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#1 OD', code: 'D2392', description: 'resin-based composite - two surfaces, p...', icd: '-', provider: 'CB', negRate: '$206.00', insEst: '$164.80', ptEst: '$41.20', preAuth: '-', labCase: '+' },
  { id: 2, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#J MO', code: 'D2392', description: 'resin-based composite - two surfaces, p...', icd: '-', provider: 'CB', negRate: '$206.00', insEst: '$164.80', ptEst: '$41.20', preAuth: '-', labCase: '+' },
  { id: 3, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#14', code: 'D1351', description: 'sealant - per tooth', icd: '-', provider: 'CB', negRate: '$51.00', insEst: '-', ptEst: '$51.00', preAuth: '-', labCase: '+' },
  { id: 4, priority: '- -', status: 'Scheduled', created: '05/15/2025', scheduled: '07/17/2026', site: '#19', code: 'D1351', description: 'sealant - per tooth', icd: '-', provider: 'CB', negRate: '$51.00', insEst: '-', ptEst: '$51.00', preAuth: '-', labCase: '+' },
];

const NewTreatmentPlanPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const appointmentId = searchParams.get('appointmentId');
    if (appointmentId) {
      dispatch(setSelectedAppointmentId(appointmentId));
      dispatch(fetchAppointmentById(appointmentId));
    }
  }, [searchParams, dispatch]);

  const [showOdontogram, setShowOdontogram] = useState(true);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [isPreAuthModalOpen, setIsPreAuthModalOpen] = useState(false);
  const [createdPreAuthId, setCreatedPreAuthId] = useState(null);
  const [createdPreAuthPatientId, setCreatedPreAuthPatientId] = useState(null);

  const currentPatient = useSelector(selectCurrentPatient);
  const currentPatientId = currentPatient?._id || currentPatient?.id;

  useEffect(() => {
    setCreatedPreAuthId(null);
    setCreatedPreAuthPatientId(null);

    if (!currentPatientId) return;

    authorizationService.getAllAuthorizations({ patientId: currentPatientId })
      .then((result) => {
        const list = result.authorizations || result.data || result || [];
        const existing = Array.isArray(list) ? list[0] : null;
        if (existing) {
          setCreatedPreAuthId(existing._id || existing.id);
          setCreatedPreAuthPatientId(currentPatientId);
        }
      })
      .catch((err) => console.error('Failed to load existing pre-auth', err));
  }, [currentPatientId]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isArchiveDrawerOpen, setIsArchiveDrawerOpen] = useState(false);
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1); // 0: Charts, 1: Treatment Plan, 2: Perio Charts
  const [showPerioChart, setShowPerioChart] = useState(false);

  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState(null);
  const handleAddMenuClick = (event) => setAddMenuAnchorEl(event.currentTarget);
  const handleAddMenuClose = () => setAddMenuAnchorEl(null);

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
          setTreatmentPlans(mapPlanItems(activePlan.items, activePlan.createdAt));
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

    const rawFee = Number(procedure.fee || procedure.charge || procedure.ProcFee || 0);
    const { insPortion: estIns, ptPortion: estPt } = calculatePortionsForCategory(procedureCode, rawFee, 0);

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
      negRate: rawFee > 0 ? `$${rawFee.toFixed(2)}` : '$0.00',
      insEst: rawFee > 0 ? `$${estIns.toFixed(2)}` : '$0.00',
      ptEst: rawFee > 0 ? `$${estPt.toFixed(2)}` : '$0.00',
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
        items: newTreatmentPlans.map(item => {
          const itemFee = item.negRate !== '-' && item.negRate ? Number(String(item.negRate).replace(/[^0-9.-]+/g, "")) : 0;
          const itemIns = item.insEst !== '-' && item.insEst ? Number(String(item.insEst).replace(/[^0-9.-]+/g, "")) : 0;
          const itemPt = item.ptEst !== '-' && item.ptEst ? Number(String(item.ptEst).replace(/[^0-9.-]+/g, "")) : 0;
          return {
            procedureCode: item.code,
            description: item.description,
            tooth: item.site?.replace('#', '')?.split(' ')[0] || '',
            site: item.site,
            fee: itemFee,
            charge: itemFee,
            priority: item.priority,
            status: item.status === 'Planned' ? 'P' : (item.status === 'Existing' ? 'EO' : (item.status === 'Referred' ? 'R' : (item.status === 'Completed' ? 'D' : 'P'))),
            icd: item.icd,
            provider: item.provider !== 'CB' ? item.provider : null,
            preAuth: item.preAuth,
            labCase: item.labCase,
            insEst: item.insEst,
            ptEst: item.ptEst,
            insPortion: itemIns,
            ptPortion: itemPt,
            insuranceAmount: `$${itemIns.toFixed(2)}`,
            patientAmount: `$${itemPt.toFixed(2)}`,
          };
        })
      };

      if (activePlanId) {
        // Update existing plan
        const res = await treatmentPlanService.update(activePlanId, { items: payload.items });
        const updatedPlan = res?.data?.treatmentPlan || res?.treatmentPlan || res?.data;
        if (updatedPlan?.items && Array.isArray(updatedPlan.items)) {
          setTreatmentPlans(mapPlanItems(updatedPlan.items, updatedPlan.createdAt));
        }
        setToast({ open: true, message: 'Treatment plan auto-saved!', type: 'success' });
      } else {
        // Create initial plan
        const res = await treatmentPlanService.create(payload);
        const createdPlan = res?.data?.treatmentPlan || res?.treatmentPlan || res?.data;
        const createdId = createdPlan?._id || res?._id;
        if (createdId) {
          setActivePlanId(createdId);
        }
        if (createdPlan?.items && Array.isArray(createdPlan.items)) {
          setTreatmentPlans(mapPlanItems(createdPlan.items, createdPlan.createdAt));
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Treatment Plan',
          text: `Check out this treatment plan for ${currentPatient?.firstName || ''} ${currentPatient?.lastName || ''}`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          setToast({ open: true, message: 'Failed to share plan.', type: 'error' });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setToast({ open: true, message: 'Link copied to clipboard!', type: 'success' });
      } catch (err) {
        setToast({ open: true, message: 'Sharing not supported on this browser.', type: 'error' });
      }
    }
  };

  return (
    <Box sx={{ p: 1, bgcolor: '#f4f6f8', minHeight: '100vh', width: '100%', '@media print': { minHeight: 'auto', p: 0 } }}>
      <GlobalStyles styles={{
        '@media print': {
          '.print-hide': { display: 'none !important' },
          '.print-only': { display: 'block !important' },
          'body, html': { backgroundColor: '#fff !important', margin: 0, padding: 0 },
          '.MuiBox-root, .MuiPaper-root': { backgroundColor: 'transparent !important', boxShadow: 'none !important', border: 'none !important' },
          '@page': { margin: '10mm' },
          '.MuiTableContainer-root': { overflow: 'visible !important' },
          'table': { width: '100% !important', zoom: '0.65' },
          '.MuiTableCell-root': { 
            padding: '2px 4px !important', 
            fontSize: '9px !important', 
            lineHeight: '1.1 !important',
            whiteSpace: 'normal !important',
            minWidth: '0 !important',
            wordBreak: 'break-word'
          },
          '.MuiTableCell-head': {
            fontSize: '9px !important',
            fontWeight: 'bold !important'
          },
          '.MuiSelect-select': {
            fontSize: '9px !important'
          },
          '.MuiCheckbox-root': { padding: '0 !important', transform: 'scale(0.7)' }
        }
      }} />

      {/* Medflow Logo for Print */}
      <Box className="print-only" sx={{ display: 'none', width: '100%', textAlign: 'center', mb: 2, mt: 1 }}>
        <Box component="img" src={medflowLogo} alt="Medflow Logo" sx={{ height: 60 }} />
      </Box>

      {/* Page Header Toolbar */}
      <Box className="print-hide">
        <NewTreatmentPlanHeader
          showOdontogram={showOdontogram}
          setShowOdontogram={setShowOdontogram}
          onNotesClick={() => setIsNotesDrawerOpen(true)}
        />
      </Box>

      {/* Top Section (Odontogram + Navigation) */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'stretch', width: '100%' }}>

        {/* Left Pane - Odontogram */}
        {showOdontogram && (
          <Box className={activeTab === 2 ? 'print-hide' : ''} sx={{ flex: 7.5, minWidth: 0 }}>
            <NewTreatmentPlanOdontogram
              selectedTeeth={selectedTeeth}
              onToothClick={handleToothClick}
              selectedSurfaces={selectedSurfaces}
              onSidebarSurfaceClick={handleSidebarSurfaceClick}
            />
          </Box>
        )}

        {/* Right Pane - Navigation & Procedures */}
        <Box className="print-hide" sx={{ flex: showOdontogram ? 4.5 : 12, minWidth: 0 }}>
          <NewTreatmentPlanProcedures
            onProcedureClick={handleAddProcedure}
          />
        </Box>

      </Box>

      {/* Bottom Section (Tabs & Data Table) */}
      <Box sx={{ width: '100%', mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Box className="print-hide" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} aria-label="treatment plan tabs">
            <Tab label="Chart" sx={{ textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem' }} />
            <Tab label="Treatment Plan" sx={{ textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem' }} />
            <Tab label="Perio Charts" sx={{ textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem' }} />
          </Tabs>
        </Box>
        {activeTab === 0 && (
          <Box sx={{ p: 0 }}>
            <ChartTable
              treatmentPlans={treatmentPlans}
              onUpdateItemStatus={handleUpdateItemStatus}
            />
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ p: 2, overflowX: 'auto' }}>
            <Paper elevation={0} sx={{ borderRadius: '8px', border: '1px solid #e2e8f0', p: 3, minWidth: 900 }}>
              {/* Top Toolbar matching screenshot */}
              <Box className="print-hide" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ width: 260 }}>
                  <OutlinedSelect
                    value="active"
                    sx={{
                      bgcolor: '#fff',
                      '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1.5, py: 0, px: 1.5, minHeight: '32px !important' },
                      '& .MuiOutlinedInput-root': { minHeight: '32px' },
                      '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' }
                    }}
                  >
                    <MenuItem value="active" sx={{ py: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 400, color: '#0f172a', fontSize: '0.875rem' }}>
                        <RadioButtonCheckedIcon sx={{ color: '#10b981', fontSize: '1rem' }} />
                        Active Treatment Plan
                      </Box>
                    </MenuItem>
                  </OutlinedSelect>
                </Box>
                
                <IconButton size="small" onClick={handleAddMenuClick} sx={{ border: '1px solid #0f172a', borderRadius: '50%', width: 24, height: 24, p: 0, ml: 2 }}>
                  <Box component="img" src={plusSvg} alt="add" sx={{ width: 14, height: 14 }} />
                </IconButton>

                <Menu
                  anchorEl={addMenuAnchorEl}
                  open={Boolean(addMenuAnchorEl)}
                  onClose={handleAddMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      minWidth: '200px'
                    }
                  }}
                >
                  <MenuItem onClick={handleAddMenuClose} sx={{ gap: 1.5, py: 1.25, fontSize: '0.875rem', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                    <AddCircleOutlineIcon sx={{ fontSize: '1.25rem', color: '#334155' }} />
                    New draft
                  </MenuItem>
                  <MenuItem onClick={handleAddMenuClose} sx={{ gap: 1.5, py: 1.25, fontSize: '0.875rem', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                    <ContentCopyIcon sx={{ fontSize: '1.15rem', color: '#334155' }} />
                    Duplicate draft
                  </MenuItem>
                </Menu>
                
                <Divider orientation="vertical" flexItem sx={{ mx: 3, my: 0.5, borderColor: '#cbd5e1' }} />

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <IconButton size="small" onClick={() => {
                    if (selectedRows.length > 0) {
                      handleDeleteItems(selectedRows);
                      setSelectedRows([]);
                    }
                  }}>
                    <Box component="img" src={deleteSvg} alt="delete" sx={{ width: 22, height: 22 }} />
                  </IconButton>
                  <Tooltip title="Pre-Auth">
                    <IconButton size="small" onClick={() => setIsPreAuthModalOpen(true)}>
                      <Box component="img" src={addClaimSvg} alt="add claim" sx={{ width: 22, height: 22 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton size="small" onClick={handleShare}>
                      <Box component="img" src={shareSvg} alt="share" sx={{ width: 22, height: 22 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print">
                    <IconButton size="small" onClick={handlePrint}>
                      <Box component="img" src={printSvg} alt="print" sx={{ width: 22, height: 22 }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <IconButton size="small" onClick={() => setIsArchiveDrawerOpen(true)}>
                  <ArchiveIcon sx={{ fontSize: '1.35rem', color: '#94a3b8' }} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ width: '100%', flexGrow: 1, minWidth: 0 }}>
                  <NewTreatmentPlanTable
                    treatmentPlans={treatmentPlans}
                    onMoveToTop={handleMoveToTop}
                    onUpdateItemStatus={handleUpdateItemStatus}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                  />
                </Box>

                <Divider className="print-hide" orientation="vertical" flexItem sx={{ borderColor: '#e2e8f0' }} />

                <Box className="print-hide" sx={{ width: '35%', minWidth: 0 }}>
                  <UnplannedProceduresSidebar procedures={treatmentPlans} />
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ p: 0, height: '800px', backgroundColor: '#f9fafb', borderRadius: 1, overflow: 'hidden', '@media print': { height: 'auto', overflow: 'visible' } }}>
            {showPerioChart ? (
              <PeriodontalExamPage 
                embedded={true} 
                selectedTeethFromParent={selectedTeeth} 
                onToothClickFromParent={handleToothClick} 
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Button 
                  variant="contained" 
                  onClick={() => setShowPerioChart(true)}
                  sx={{ 
                    textTransform: 'none', 
                    fontFamily: 'Inter, sans-serif', 
                    fontWeight: 600, 
                    borderRadius: '8px', 
                    boxShadow: 'none',
                    backgroundColor: COLORS.ACCENT,
                    '&:hover': {
                      backgroundColor: COLORS.ACCENT_HOVER,
                      boxShadow: 'none'
                    }
                  }}
                >
                  Create Perio chart
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <ArchiveDrawer open={isArchiveDrawerOpen} onClose={() => setIsArchiveDrawerOpen(false)} />
      <NotesDrawer
        open={isNotesDrawerOpen}
        onClose={() => setIsNotesDrawerOpen(false)}
        patientName={currentPatient ? `${currentPatient.firstName || ''} ${currentPatient.lastName || ''}`.trim() : ''}
        patientId={currentPatient ? (currentPatient._id || currentPatient.id) : undefined}
        currentPatient={currentPatient}
        selectedProcedures={treatmentPlans}
      />

      <PreAuthModal
        open={isPreAuthModalOpen}
        onClose={() => setIsPreAuthModalOpen(false)}
        preAuthId={createdPreAuthPatientId === currentPatientId ? createdPreAuthId : null}
        onSave={(newId) => {
          setCreatedPreAuthId(newId);
          setCreatedPreAuthPatientId(currentPatientId);
        }}
        patientId={currentPatientId}
        selectedProcedures={treatmentPlans}
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
