import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPrescriptionTemplates,
  addPrescriptionTemplate,
  updatePrescriptionTemplate,
  deletePrescriptionTemplate,
  selectPrescriptionTemplates,
  selectLoadingPrescriptions
} from '../../store/slices/clinicalManagementSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { Box, Typography, Button } from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';

import { radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

import PrescriptionTemplatesTable from '../../components/admin/clinical-management/prescriptions/PrescriptionTemplatesTable';
import AddPrescriptionDialog from '../../components/admin/clinical-management/prescriptions/AddPrescriptionDialog';
import SyncOfficesDialog from '../../components/admin/clinical-management/products/SyncOfficesDialog';



const mapBackendToFrontend = (backend) => {
  let sigData = {};
  const isJsonSig = backend.sig && backend.sig.trim().startsWith('{');
  try {
    if (backend.sig) {
      sigData = JSON.parse(backend.sig);
    }
  } catch (e) {
    sigData = { description: backend.sig || '' };
  }
  return {
    id: backend.id,
    name: backend.name || '',
    medication: backend.drug || '',
    refills: backend.refills || '0',
    description: isJsonSig ? (sigData.description || '') : (backend.sig || ''),
    dose: sigData.dose || '',
    duration: sigData.duration || '',
    longTerm: isJsonSig ? (sigData.longTerm || sigData.description || '') : (backend.sig || ''),
    provider: sigData.provider || 'Clinic Doctor',
    route: sigData.route || 'Oral',
    forms: sigData.forms || 'Tablet',
    frequency: sigData.frequency || '',
    quantity: sigData.quantity || '',
    spelledOutQuantity: sigData.spelledOutQuantity || '',
    maySubstitute: sigData.maySubstitute !== undefined ? sigData.maySubstitute : true,
    isLongTerm: sigData.isLongTerm !== undefined ? sigData.isLongTerm : false,
    patientInstructions: sigData.patientInstructions || '',
    rxInstructions: sigData.rxInstructions || '',
  };
};

const mapFrontendToBackend = (frontend) => {
  const sigObj = {
    description: frontend.description,
    dose: frontend.dose,
    duration: frontend.duration,
    longTerm: frontend.longTerm || frontend.description,
    provider: frontend.provider,
    route: frontend.route || 'Oral',
    forms: frontend.forms || 'Tablet',
    frequency: frontend.frequency || '',
    quantity: frontend.quantity || '',
    spelledOutQuantity: frontend.spelledOutQuantity || '',
    maySubstitute: frontend.maySubstitute !== undefined ? frontend.maySubstitute : true,
    isLongTerm: frontend.isLongTerm !== undefined ? frontend.isLongTerm : false,
    patientInstructions: frontend.patientInstructions || '',
    rxInstructions: frontend.rxInstructions || '',
  };
  return {
    name: frontend.name,
    drug: frontend.medication,
    sig: JSON.stringify(sigObj),
    disp: frontend.quantity || '',
    refills: frontend.refills || '0'
  };
};

const PrescriptionTemplates = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const templates = useSelector(selectPrescriptionTemplates);
  const loading = useSelector(selectLoadingPrescriptions);

  const [prescriptions, setPrescriptions] = useState([]);
  const [isSyncDialogOpen, setSyncDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newTemplateDraft, setNewTemplateDraft] = useState({
    name: '',
    description: '',
    medication: '',
    dose: '',
    route: 'Oral',
    forms: 'Tablet',
    frequency: '',
    duration: '',
    durationUnit: 'Day',
    quantity: '',
    spelledOutQuantity: '',
    refills: '0',
    maySubstitute: true,
    isLongTerm: false,
    provider: 'Clinic Doctor',
    patientInstructions: '',
    rxInstructions: '',
  });

  useEffect(() => {
    dispatch(fetchPrescriptionTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (templates) {
      setPrescriptions(templates.map(mapBackendToFrontend));
    } else {
      setPrescriptions([]);
    }
  }, [templates]);

  const handleOpenSyncDialog = () => {
    setSyncDialogOpen(true);
  };

  const handleCloseSyncDialog = () => {
    setSyncDialogOpen(false);
  };

  const handleOpenAddDialog = () => {
    setNewTemplateDraft({
      name: '',
      description: '',
      medication: '',
      dose: '',
      route: 'Oral',
      forms: 'Tablet',
      frequency: '',
      duration: '',
      durationUnit: 'Day',
      quantity: '',
      spelledOutQuantity: '',
      refills: '0',
      maySubstitute: true,
      isLongTerm: false,
      provider: 'Clinic Doctor',
      patientInstructions: '',
      rxInstructions: '',
    });
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleSaveNewTemplate = async () => {
    try {
      const fullDraft = {
        ...newTemplateDraft,
        duration: `${newTemplateDraft.duration} ${newTemplateDraft.durationUnit}`,
        longTerm: newTemplateDraft.description
      };
      const payload = mapFrontendToBackend(fullDraft);
      await dispatch(addPrescriptionTemplate(payload)).unwrap();
      dispatch(fetchPrescriptionTemplates());
      setAddDialogOpen(false);
      showSnackbar('Prescription template created successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to create prescription template', 'error');
    }
  };

  const handleDelete = async (index) => {
    try {
      const templateToDelete = prescriptions[index];
      await dispatch(deletePrescriptionTemplate(templateToDelete.id)).unwrap();
      dispatch(fetchPrescriptionTemplates());
      showSnackbar('Prescription template deleted successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to delete prescription template', 'error');
    }
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditDraft({ ...prescriptions[index] });
  };

  const handleSaveEdit = async () => {
    try {
      const templateToUpdate = prescriptions[editingIndex];
      const payload = mapFrontendToBackend(editDraft);
      await dispatch(updatePrescriptionTemplate({ templateId: templateToUpdate.id, updates: payload })).unwrap();
      dispatch(fetchPrescriptionTemplates());
      setEditingIndex(null);
      showSnackbar('Prescription template updated successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to update prescription template', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleRefreshRow = async (index) => {
    try {
      await dispatch(fetchPrescriptionTemplates()).unwrap();
      showSnackbar('Row refreshed from server', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to refresh row', 'error');
    }
  };

  const handleAddTemplate = () => {
    handleOpenAddDialog();
  };

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 4, pt: 4, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
            Prescription Templates
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={handleOpenSyncDialog}
            sx={{
              textTransform: 'none',
              borderRadius: radius.md,
              fontFamily: 'Inter',
              fontSize: fontSize.base,
              fontWeight: fontWeight.semibold,
              color: COLORS.TEXT_MUTED,
              borderColor: COLORS.BORDER,
              '&:hover': { backgroundColor: COLORS.BACKGROUND, borderColor: COLORS.TEXT_MUTED }
            }}
          >
            Sync
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleAddTemplate}
            sx={{
              textTransform: 'none',
              borderRadius: radius.md,
              fontFamily: 'Inter',
              fontSize: fontSize.base,
              fontWeight: fontWeight.semibold,
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              '&:hover': { backgroundColor: COLORS.ACCENT_HOVER }
            }}
          >
            + Add Template
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ px: 4 }}>
        <PrescriptionTemplatesTable 
          prescriptions={prescriptions}
          editingIndex={editingIndex}
          editDraft={editDraft}
          setEditDraft={setEditDraft}
          handleStartEdit={handleStartEdit}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          handleDelete={handleDelete}
          handleRefreshRow={handleRefreshRow}
          handleOpenSyncDialog={handleOpenSyncDialog}
        />
      </Box>

      <SyncOfficesDialog 
        open={isSyncDialogOpen}
        onClose={handleCloseSyncDialog}
      />

      <AddPrescriptionDialog 
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
        newTemplateDraft={newTemplateDraft}
        setNewTemplateDraft={setNewTemplateDraft}
        handleSaveNewTemplate={handleSaveNewTemplate}
      />
    </Box>
  );
};

export default PrescriptionTemplates;
