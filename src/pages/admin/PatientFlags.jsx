import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentPracticeInfo,
  createPracticeInfo,
  updatePatientFlags,
  selectPracticeInfo,
} from '../../store/slices/practiceInfoSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { Box, Grid, Paper } from '@mui/material';
import PatientFlagsHeader from '../../components/admin/patient-flags/PatientFlagsHeader';
import PatientFlagCategorySection from '../../components/admin/patient-flags/PatientFlagCategorySection';
import PatientFlagsDialog from '../../components/admin/patient-flags/PatientFlagsDialog';

const defaultFlags = [
  { id: '1', category: 'Patient Communication', name: 'Send appointment reminder earlier than scheduled time', color: '#22c55e' },
  { id: '2', category: 'Billing', name: 'alert', color: '#3b82f6' },
  { id: '3', category: 'Billing', name: 'old patient', color: '#8b5cf6' },
  { id: '4', category: 'Billing', name: 'family & friends', color: '#ef4444' },
  { id: '5', category: 'Billing', name: 'late payment', color: '#ef4444' },
  { id: '6', category: 'Billing', name: 'needs special care', color: '#3b82f6' },
  { id: '7', category: 'Billing', name: 'TDS Member', color: '#22c55e' },
];

const PatientFlags = () => {
  const [flags, setFlags] = useState(defaultFlags);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [editFlagId, setEditFlagId] = useState(null);
  const [formData, setFormData] = useState({ categoryName: '', name: '', color: '#3b82f6' });

  const practiceInfo = useSelector(selectPracticeInfo);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  useEffect(() => {
    if (practiceInfo?.patientFlags && practiceInfo.patientFlags.length > 0) {
      setFlags(practiceInfo.patientFlags);
    }
  }, [practiceInfo?.patientFlags]);

  const handleSave = async () => {
    try {
      let id = practiceInfo?._id || practiceInfo?.id;
      if (!id) {
        const newPractice = await dispatch(createPracticeInfo({
          practiceName: 'Default Practice',
          phone: '555-000-0000',
          email: 'info@defaultpractice.com',
          address: { line1: '123 St', city: 'Metropolis', state: 'NY', postalCode: '10001', country: 'US' },
        })).unwrap();
        id = newPractice._id || newPractice.id;
      }
      await dispatch(updatePatientFlags({
        practiceInfoId: id,
        patientFlagsData: flags,
      })).unwrap();
      showSnackbar('Patient Flags saved successfully', 'success');
    } catch (error) {
      console.error(error);
      showSnackbar(error || 'Failed to save flags', 'error');
    }
  };

  const openAddCategoryDialog = () => {
    setDialogMode('addCategory');
    setFormData({ categoryName: '', name: '', color: '#3b82f6' });
    setDialogOpen(true);
  };

  const openAddFlagDialog = (category) => {
    setActiveCategory(category);
    setDialogMode('addFlag');
    setFormData({ categoryName: '', name: '', color: '#3b82f6' });
    setDialogOpen(true);
  };

  const openEditFlagDialog = (flag) => {
    setEditFlagId(flag.id);
    setDialogMode('editFlag');
    setFormData({ categoryName: '', name: flag.name, color: flag.color });
    setDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    if (dialogMode === 'addCategory') {
      if (!formData.categoryName) return;
      setFlags((prev) => [
        ...prev,
        { id: Date.now().toString(), category: formData.categoryName, name: 'New Flag', color: '#3b82f6' },
      ]);
    } else if (dialogMode === 'addFlag') {
      if (!formData.name || !formData.color) return;
      setFlags((prev) => [
        ...prev,
        { id: Date.now().toString(), category: activeCategory, name: formData.name, color: formData.color },
      ]);
    } else if (dialogMode === 'editFlag') {
      if (!formData.name || !formData.color) return;
      setFlags((prev) => prev.map((f) =>
        f.id === editFlagId ? { ...f, name: formData.name, color: formData.color } : f
      ));
    }
    setDialogOpen(false);
  };

  const handleDeleteFlag = (id) => {
    if (!window.confirm('Are you sure you want to delete this flag?')) return;
    setFlags((prev) => prev.filter((f) => f.id !== id));
  };

  const categories = [...new Set(flags.map((f) => f.category))];

  return (
    <Box sx={{ bgcolor: '#f4f6fb', minHeight: '100vh', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      <Box sx={{ p: 4, maxWidth: 1600, mx: 'auto' }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#ffffff', border: '1px solid #e8eaf0' }}>
          <PatientFlagsHeader
            onAddCategory={openAddCategoryDialog}
            onSave={handleSave}
            onSync={() => showSnackbar('Sync is not available yet.', 'info')}
          />
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid
                item
                xs={12}
                sm={12}
                md={category === 'Billing' ? 8 : 6}
                lg={category === 'Billing' ? 8 : 6}
                key={category}
              >
                <PatientFlagCategorySection
                  category={category}
                  flags={flags.filter((flag) => flag.category === category)}
                  onAddFlag={openAddFlagDialog}
                  onEditFlag={openEditFlagDialog}
                  onDeleteFlag={handleDeleteFlag}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      <PatientFlagsDialog
        open={dialogOpen}
        mode={dialogMode}
        formData={formData}
        onFormChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
    </Box>
  );
};

export default PatientFlags;