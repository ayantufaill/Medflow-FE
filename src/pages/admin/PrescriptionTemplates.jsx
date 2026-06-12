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
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Sync as SyncIcon,
  ContentCopy as CopyIcon,
  ImportExport as SortIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const INITIAL_PRESCRIPTIONS = [
  {
    name: 'Amoxicillin - Odontogenic Infection',
    description: 'Odontogenic Infection- Amoxicillin',
    medication: 'AMOXICILLIN',
    dose: '875MG',
    duration: '7 Day',
    longTerm: 'Odontogenic Infection- Amoxicillin',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Amoxicillin Premed',
    description: 'Premed Amoxicillin',
    medication: 'AMOXICILLIN',
    dose: '500MG',
    duration: 'Day',
    longTerm: 'Premed Amoxicillin',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Amoxicillin/Clavulanate',
    description: 'Amoxicillin/Clavulanate',
    medication: 'AMOXICILLIN AND CLAVULANATE POTASSIUM',
    dose: '875MG',
    duration: '7 Day',
    longTerm: 'Amoxicillin/Clavulanate',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Amoxicillin - Periodontal Disease/ Peri-Implantitis',
    description: 'Periodontal Disease/ Peri-Implantitis- Amoxicillin',
    medication: 'AMOXICILLIN',
    dose: '875mg',
    duration: '7 Day',
    longTerm: 'Periodontal Disease/ Peri-Implantitis- Amoxicillin',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Analgesia',
    description: 'Non-narcotic analgesia',
    medication: 'Tylenol + Advil',
    dose: 'Ibuprofen 400mg, Acetaminophen 500mg',
    duration: '',
    longTerm: 'Non-narcotic analgesia',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Cephalexin',
    description: 'Cephalexin',
    medication: 'CEPHALEXIN',
    dose: '500MG',
    duration: '7 Day',
    longTerm: 'Cephalexin',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Ciprofloxacin',
    description: 'Ciprofloxacin',
    medication: 'CIPROFLOXACIN',
    dose: '500MG',
    duration: '7 Day',
    longTerm: 'Ciprofloxacin',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Diflucan',
    description: 'Fungal Infection',
    medication: 'DIFLUCAN',
    dose: '200MG',
    duration: '1 Week',
    longTerm: 'Fungal Infection',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Doxycycline Premed-PCN allergy',
    description: 'PCN allergy premed',
    medication: 'DOXYCYCLINE',
    dose: 'EQ 100MG BASE',
    duration: '',
    longTerm: 'PCN allergy premed',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Metronidazole',
    description: 'Metronidazole',
    medication: 'METRONIDAZOLE',
    dose: '500MG',
    duration: '8 Day',
    longTerm: 'Metronidazole',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Peridex',
    description: 'Chlorhexidine Gluconate 0.12%',
    medication: 'CHLORHEXIDINE GLUCONATE',
    dose: '0.12%',
    duration: '1 Week',
    longTerm: 'Chlorhexidine Gluconate 0.12%',
    refills: '0',
    provider: 'Clinic Doctor',
  },
  {
    name: 'Valacyclovir',
    description: 'Valacyclovir',
    medication: 'VALTREX',
    dose: 'EQ 500MG BASE',
    duration: '10 Day',
    longTerm: 'Valacyclovir',
    refills: '0',
    provider: 'Clinic Doctor',
  },
];

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
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          onClick={() => navigate('/admin/clinical-management')}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>
          Prescription Templates
        </Typography>
      </Box>

      {/* Sync Action */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Box
          onClick={handleOpenSyncDialog}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#1a3a6b',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <SyncIcon sx={{ fontSize: '1.1rem' }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Sync</Typography>
        </Box>
      </Box>

      {/* Main Table */}
      <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1a3a6b', py: 1 }}>
                Name <SortIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle', ml: 0.5 }} />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1a3a6b', py: 1 }}>
                Description <SortIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle', ml: 0.5 }} />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1a3a6b', py: 1 }}>
                Medication <SortIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle', ml: 0.5 }} />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1a3a6b', py: 1 }}>Dose</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1a3a6b', py: 1 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1a3a6b', py: 1 }}>Long Term</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1a3a6b', py: 1 }}>Refills</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1a3a6b', py: 1 }}>Provider</TableCell>
              <TableCell sx={{ width: 80 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': { backgroundColor: '#f8f9fa' },
                  '& td': { py: 1, borderBottom: '1px solid #f0f0f0' }
                }}
              >
                <TableCell sx={{ fontSize: '0.75rem', color: '#333' }}>
                  {editingIndex === index ? (
                    <TextField
                      size="small"
                      value={editDraft.name}
                      onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
                    />
                  ) : row.name}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#666' }}>
                  {editingIndex === index ? (
                    <TextField
                      size="small"
                      value={editDraft.description}
                      onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
                    />
                  ) : row.description}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#333', fontWeight: 500 }}>
                  {editingIndex === index ? (
                    <TextField
                      size="small"
                      value={editDraft.medication}
                      onChange={(e) => setEditDraft({ ...editDraft, medication: e.target.value })}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
                    />
                  ) : row.medication}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#666' }}>
                  {editingIndex === index ? (
                    <TextField
                      size="small"
                      value={editDraft.dose}
                      onChange={(e) => setEditDraft({ ...editDraft, dose: e.target.value })}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
                    />
                  ) : row.dose}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#666' }}>
                  {editingIndex === index ? (
                    <TextField
                      size="small"
                      value={editDraft.duration}
                      onChange={(e) => setEditDraft({ ...editDraft, duration: e.target.value })}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
                    />
                  ) : row.duration}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#666' }}>
                  {editingIndex === index ? (
                    <TextField
                      size="small"
                      value={editDraft.longTerm}
                      onChange={(e) => setEditDraft({ ...editDraft, longTerm: e.target.value })}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
                    />
                  ) : row.longTerm}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#666', textAlign: 'center' }}>
                  {editingIndex === index ? (
                    <TextField
                      size="small"
                      value={editDraft.refills}
                      onChange={(e) => setEditDraft({ ...editDraft, refills: e.target.value })}
                      sx={{ width: 40, '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5, textAlign: 'center' } }}
                    />
                  ) : row.refills}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 500 }}>{row.provider}</TableCell>
                <TableCell align="right" sx={{ width: 100 }}>
                  {editingIndex === index ? (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button size="small" variant="contained" onClick={handleSaveEdit} sx={{ fontSize: '0.65rem', minWidth: 40, py: 0.2 }}>Save</Button>
                      <Button size="small" variant="outlined" onClick={handleCancelEdit} sx={{ fontSize: '0.65rem', minWidth: 40, py: 0.2 }}>Exit</Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ p: 0.2, color: '#1a3a6b' }} onClick={() => handleStartEdit(index)}>
                          <EditIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                        <IconButton size="small" sx={{ p: 0.2, color: '#1a3a6b' }} onClick={() => handleRefreshRow(index)}>
                          <RefreshIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" sx={{ p: 0.2, color: '#e57373' }} onClick={() => handleDelete(index)}>
                          <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                        <Typography
                          onClick={handleOpenSyncDialog}
                          sx={{
                            fontSize: '0.7rem',
                            color: '#1a3a6b',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          Sync
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Action */}
      <Box sx={{ mt: 2, pl: 1 }}>
        <Typography
          onClick={handleAddTemplate}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          +Add Template
        </Typography>
      </Box>

      {/* Sync Dialog */}
      <Dialog
        open={isSyncDialogOpen}
        onClose={handleCloseSyncDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1, overflow: 'hidden' }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#0c345d',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            py: 2,
            px: 3,
            lineHeight: 1.3,
          }}
        >
          Select the offices you would like to sync with the source office
        </DialogTitle>
        <DialogContent sx={{ mt: 3, px: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Source Office:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value="thedentalstudio"
              disabled
              sx={{
                '& .MuiInputBase-input': { backgroundColor: '#f0f0f0', fontSize: '0.85rem' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              Target Offices
            </Typography>
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, backgroundColor: '#fafafa', textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Select target offices from the list below...
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseSyncDialog}
            sx={{
              textTransform: 'none',
              backgroundColor: '#e0e0e0',
              color: '#333',
              fontSize: '0.85rem',
              px: 3,
              '&:hover': { backgroundColor: '#d0d0d0' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCloseSyncDialog}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#6b8fb9',
              color: '#fff',
              fontSize: '0.85rem',
              px: 4,
              '&:hover': { backgroundColor: '#5a7ca8' }
            }}
          >
            Sync
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Template Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1, overflow: 'hidden' }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#335377ff',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 500,
            py: 1.5,
            px: 3,
            textAlign: 'center'
          }}
        >
          Add Prescription Template
        </DialogTitle>
        <DialogContent sx={{ mt: 2, px: 3, pb: 2 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Template Name</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.name}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, name: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid size={6}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Template Description</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.description}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, description: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>

            <Grid size={6}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Drug*</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.medication}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, medication: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid size={6}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Dose</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.dose}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, dose: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>

            <Grid size={6}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Route</Typography>
              <Select
                fullWidth size="small"
                value={newTemplateDraft.route}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, route: e.target.value })}
                sx={{ fontSize: '0.85rem' }}
              >
                <MenuItem value="Oral">Oral</MenuItem>
                <MenuItem value="Topical">Topical</MenuItem>
              </Select>
            </Grid>
            <Grid size={6}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Forms</Typography>
              <Select
                fullWidth size="small"
                value={newTemplateDraft.forms}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, forms: e.target.value })}
                sx={{ fontSize: '0.85rem' }}
              >
                <MenuItem value="Tablet">Tablet</MenuItem>
                <MenuItem value="Capsule">Capsule</MenuItem>
                <MenuItem value="Liquid">Liquid</MenuItem>
              </Select>
            </Grid>

            <Grid size={3}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Frequency</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.frequency}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, frequency: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid size={1}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Duration</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.duration}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, duration: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid size={2}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Duration Unit</Typography>
              <Select
                fullWidth size="small"
                value={newTemplateDraft.durationUnit}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, durationUnit: e.target.value })}
                sx={{ fontSize: '0.85rem' }}
              >
                <MenuItem value="Day">Day</MenuItem>
                <MenuItem value="Week">Week</MenuItem>
                <MenuItem value="Month">Month</MenuItem>
              </Select>
            </Grid>
            <Grid size={3}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Quantity*</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.quantity}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, quantity: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid size={3}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Spelled out quantity</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.spelledOutQuantity}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, spelledOutQuantity: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>

            <Grid size={4}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Refills*</Typography>
              <TextField
                fullWidth size="small"
                value={newTemplateDraft.refills}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, refills: e.target.value })}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid size={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <FormControlLabel
                control={<Checkbox size="small" checked={newTemplateDraft.maySubstitute} onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, maySubstitute: e.target.checked })} />}
                label={<Typography sx={{ fontSize: '0.75rem' }}>May substitute generic</Typography>}
              />
              <FormControlLabel
                control={<Checkbox size="small" checked={newTemplateDraft.isLongTerm} onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, isLongTerm: e.target.checked })} />}
                label={<Typography sx={{ fontSize: '0.75rem' }}>Long Term</Typography>}
              />
            </Grid>
            <Grid size={4}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Provider*</Typography>
              <Select
                fullWidth size="small"
                value={newTemplateDraft.provider}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, provider: e.target.value })}
                sx={{ fontSize: '0.85rem' }}
              >
                <MenuItem value="Clinic Doctor">Clinic Doctor</MenuItem>
                <MenuItem value="Christina Sabour">Christina Sabour</MenuItem>
              </Select>
            </Grid>

            <Grid size={6}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Patient Instructions</Typography>
              <TextField
                fullWidth multiline rows={3}
                value={newTemplateDraft.patientInstructions}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, patientInstructions: e.target.value })}
                sx={{ '& .MuiInputBase-root': { fontSize: '0.85rem' } }}
              />
            </Grid>
            <Grid size={6}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5, color: '#333' }}>Rx Instructions</Typography>
              <TextField
                fullWidth multiline rows={3}
                value={newTemplateDraft.rxInstructions}
                onChange={(e) => setNewTemplateDraft({ ...newTemplateDraft, rxInstructions: e.target.value })}
                sx={{ '& .MuiInputBase-root': { fontSize: '0.85rem' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleSaveNewTemplate}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#d9a36d',
              color: '#fff',
              fontSize: '0.85rem',
              px: 4,
              '&:hover': { backgroundColor: '#c28e5a' }
            }}
          >
            Save
          </Button>
          <Button
            onClick={handleCloseAddDialog}
            sx={{
              textTransform: 'none',
              backgroundColor: '#a0aec0',
              color: '#fff',
              fontSize: '0.85rem',
              px: 3,
              '&:hover': { backgroundColor: '#8a99a8' }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrescriptionTemplates;
