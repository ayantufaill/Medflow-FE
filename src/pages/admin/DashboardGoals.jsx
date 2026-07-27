import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectDashboardGoals,
  fetchDashboardGoals,
  updateDashboardGoalField
} from '../../store/slices/dashboardGoalsSlice';

import ProductionGoalsSection from '../../components/admin/finance-management/dashboard-goals/ProductionGoalsSection';
import CollectionGoalsSection from '../../components/admin/finance-management/dashboard-goals/CollectionGoalsSection';
import NewPatientsSection from '../../components/admin/finance-management/dashboard-goals/NewPatientsSection';
import VisitsSection from '../../components/admin/finance-management/dashboard-goals/VisitsSection';
import ReappointmentsSection from '../../components/admin/finance-management/dashboard-goals/ReappointmentsSection';
import AcceptanceRateSection from '../../components/admin/finance-management/dashboard-goals/AcceptanceRateSection';
import ProcedureGroupDialog from '../../components/admin/finance-management/dashboard-goals/ProcedureGroupDialog';

const DashboardGoals = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectDashboardGoals);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null); // 'hygieneGroups' or 'treatmentGroups'
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#000000', percentage: '', codes: '' });

  useEffect(() => {
    dispatch(fetchDashboardGoals());
  }, [dispatch]);

  const handleUpdate = (fieldPath, value) => {
    dispatch(updateDashboardGoalField({ fieldPath, value }));
  };

  const handleOpenDialog = (type, index = null) => {
    setEditingType(type);
    setEditingIndex(index);
    if (index !== null) {
      const group = data[type][index];
      setFormData({
        name: group.name,
        color: group.color,
        percentage: group.percentage,
        codes: group.codes.join(', ')
      });
    } else {
      setFormData({ name: '', color: '#000000', percentage: '', codes: '' });
    }
    setDialogOpen(true);
  };

  const handleSaveGroup = () => {
    const updatedGroups = [...data[editingType]];
    const newGroup = {
      name: formData.name,
      color: formData.color,
      percentage: parseInt(formData.percentage) || 0,
      codes: formData.codes.split(',').map(c => c.trim()).filter(Boolean),
      hasMore: false,
    };
    if (editingIndex !== null) {
      updatedGroups[editingIndex] = newGroup;
    } else {
      updatedGroups.push(newGroup);
    }
    handleUpdate(editingType, updatedGroups);
    setDialogOpen(false);
  };

  const handleDeleteGroup = (type, index) => {
    const updatedGroups = data[type].filter((_, i) => i !== index);
    handleUpdate(type, updatedGroups);
  };

  if (!data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, minHeight: '100vh', backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2' }}>
        <CircularProgress />
      </Box>
    );
  }

  const dividerStyle = { my: 4, borderColor: '#e2e8f0', opacity: 0.6 };

  return (
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1e293b' }}>
          Dashboard Goals
        </Typography>
      </Box>

      <ProductionGoalsSection
        data={data}
        handleUpdate={handleUpdate}
        handleOpenDialog={handleOpenDialog}
        handleDeleteGroup={handleDeleteGroup}
      />

      <Divider sx={dividerStyle} />

      <CollectionGoalsSection
        data={data}
        handleUpdate={handleUpdate}
      />

      <Divider sx={dividerStyle} />

      <NewPatientsSection
        data={data}
        handleUpdate={handleUpdate}
      />

      <Divider sx={dividerStyle} />

      <VisitsSection
        data={data}
        handleUpdate={handleUpdate}
      />

      <Divider sx={dividerStyle} />

      <ReappointmentsSection
        data={data}
        handleUpdate={handleUpdate}
      />

      <Divider sx={dividerStyle} />

      <AcceptanceRateSection
        data={data}
        handleUpdate={handleUpdate}
      />

      <ProcedureGroupDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isEdit={editingIndex !== null}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveGroup}
      />
    </Box>
  );
};

export default DashboardGoals;
