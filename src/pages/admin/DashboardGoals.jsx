import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Divider,
  IconButton,
  Collapse,
  Breadcrumbs,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  KeyboardArrowDown as ChevronDownIcon,
  KeyboardArrowRight as ChevronRightIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectDashboardGoals,
  fetchDashboardGoals,
  updateDashboardGoalField
} from '../../store/slices/dashboardGoalsSlice';

const DebouncedGoalInput = ({ label, value, unit, subtext, width = 60, subtextWidth = 'auto', onChange }) => {
  const [localVal, setLocalVal] = React.useState(value);
  React.useEffect(() => { setLocalVal(value); }, [value]);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 500 }}>
          {label}
        </Typography>
        <TextField
          variant="standard"
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onBlur={() => onChange(localVal)}
          sx={{ width, '& input': { textAlign: 'center', fontSize: '0.85rem', py: 0.2 } }}
        />
        <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 500 }}>
          {unit}
        </Typography>
      </Box>
      {subtext && (
        <Typography sx={{ color: '#888', fontSize: '0.7rem', ml: 0, mt: 0.2, width: subtextWidth }}>
          {subtext}
        </Typography>
      )}
    </Box>
  );
};

const DebouncedProviderRow = ({ name, value, unit, onChange }) => {
  const [localVal, setLocalVal] = React.useState(value);
  React.useEffect(() => { setLocalVal(value); }, [value]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography sx={{ color: '#003366', fontSize: '0.85rem', minWidth: 100 }}>
        {name}
      </Typography>
      <TextField
        variant="standard"
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={() => onChange(localVal)}
        placeholder="Value"
        sx={{ width: 60, '& input': { textAlign: 'center', fontSize: '0.85rem', py: 0.2 } }}
      />
      <Typography sx={{ color: '#003366', fontSize: '0.85rem' }}>
        {unit}
      </Typography>
    </Box>
  );
};

const ProcedureGroupTable = ({ groups, onAdd, onEdit, onDelete }) => (
  <Box sx={{ mt: 2, mb: 3 }}>
    <Box sx={{ display: 'flex', px: 2, py: 1, borderBottom: '1.5px solid #7a96b5' }}>
      <Typography sx={{ width: '60px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Color</Typography>
      <Typography sx={{ width: '180px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Group Name</Typography>
      <Typography sx={{ width: '120px', fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Percentage</Typography>
      <Typography sx={{ flex: 1, fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Codes</Typography>
      <Typography sx={{ width: '80px', fontSize: '0.8rem', fontWeight: 700, color: '#333', textAlign: 'center' }}>Actions</Typography>
    </Box>
    {groups.map((group, idx) => (
      <Box 
        key={idx} 
        sx={{ 
          display: 'flex', 
          px: 2, 
          py: 1.2, 
          borderBottom: '1px solid #f1f5f9', 
          alignItems: 'center',
          backgroundColor: group.name === 'Adjunctive' ? '#f0f7ff' : 'transparent',
          '&:hover': { backgroundColor: '#f8fafc' }
        }}
      >
        <Box sx={{ width: '60px' }}>
          <Box sx={{ width: 20, height: 20, bgcolor: group.color, borderRadius: '2px' }} />
        </Box>
        <Typography sx={{ width: '180px', fontSize: '0.85rem', color: '#333' }}>{group.name}</Typography>
        <Box sx={{ width: '120px', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField 
            variant="standard" 
            value={group.percentage}
            disabled 
            sx={{ width: 30, '& input': { textAlign: 'center', fontSize: '0.85rem' } }} 
          />
          <Typography sx={{ fontSize: '0.85rem', color: '#333' }}>%</Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {group.codes.map((code, cidx) => (
            <Typography key={cidx} sx={{ fontSize: '0.85rem', color: '#333' }}>{code}</Typography>
          ))}
          {group.hasMore && <Typography sx={{ fontSize: '0.85rem', color: '#4a89dc', cursor: 'pointer' }}>Show more codes...</Typography>}
        </Box>
        <Box sx={{ width: '80px', display: 'flex', justifyContent: 'center', gap: 1 }}>
          <IconButton size="small" onClick={() => onEdit(idx)} sx={{ color: '#4a89dc' }}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => onDelete(idx)} sx={{ color: '#f56565' }}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </Box>
    ))}
    <Button 
      onClick={onAdd}
      startIcon={<span>+</span>} 
      sx={{ color: '#4a89dc', textTransform: 'none', fontSize: '0.85rem', fontWeight: 600, mt: 1, px: 2 }}
    >
      Add new group
    </Button>
  </Box>
);

const DashboardGoals = () => {
  const dispatch = useDispatch();
  const [expandedSection, setExpandedSection] = React.useState('');
  const data = useSelector(selectDashboardGoals);

  // Dialog State
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState(null); // 'hygieneGroups' or 'treatmentGroups'
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [formData, setFormData] = React.useState({ name: '', color: '#000000', percentage: '', codes: '' });

  React.useEffect(() => {
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

  if (!data) return null;

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: '#003366' } }}>
        <Link underline="hover" color="#7a96b5" component={RouterLink} to="/admin/finance-management" sx={{ fontSize: '0.85rem' }}>
          Finance Management
        </Link>
        <Typography color="#003366" sx={{ fontSize: '0.85rem' }}>
          Goals
        </Typography>
      </Breadcrumbs>

      {/* Production Goals */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Production Goals:
      </Typography>

      <Box sx={{ pl: 4 }}>
        <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 600, mb: 1.5 }}>
          Provider production per hour
        </Typography>

        <Box sx={{ display: 'flex', gap: 15, mb: 3 }}>
          <Box>
            <Typography sx={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, mb: 1 }}>Dentist</Typography>
            {data.providerProduction?.dentist?.map((p, i) => (
              <DebouncedProviderRow key={p.id} name={p.name} value={p.value} unit="$/hr" onChange={(val) => handleUpdate(`providerProduction.dentist.${i}.value`, val)} />
            ))}
          </Box>
          <Box>
            <Typography sx={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, mb: 1 }}>Hygienist</Typography>
            {data.providerProduction?.hygienist?.map((p, i) => (
              <DebouncedProviderRow key={p.id} name={p.name} value={p.value} unit="$/hr" onChange={(val) => handleUpdate(`providerProduction.hygienist.${i}.value`, val)} />
            ))}
          </Box>
        </Box>

        <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 600, mb: 1 }}>
          Production per procedure group
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', py: 0.5 }} onClick={() => setExpandedSection(expandedSection === 'hygiene' ? '' : 'hygiene')}>
            {expandedSection === 'hygiene' ? <ChevronDownIcon sx={{ fontSize: '1.2rem', color: '#4a89dc' }} /> : <ChevronRightIcon sx={{ fontSize: '1.2rem', color: '#4a89dc' }} />}
            <Typography sx={{ fontSize: '0.85rem', color: '#4a89dc', fontWeight: 500 }}>Hygiene production per procedure group</Typography>
          </Box>
          <Collapse in={expandedSection === 'hygiene'}>
            <ProcedureGroupTable 
              groups={data.hygieneGroups} 
              onAdd={() => handleOpenDialog('hygieneGroups')}
              onEdit={(idx) => handleOpenDialog('hygieneGroups', idx)}
              onDelete={(idx) => handleDeleteGroup('hygieneGroups', idx)}
            />
          </Collapse>

          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', py: 0.5 }} onClick={() => setExpandedSection(expandedSection === 'treatment' ? '' : 'treatment')}>
            {expandedSection === 'treatment' ? <ChevronDownIcon sx={{ fontSize: '1.2rem', color: '#4a89dc' }} /> : <ChevronRightIcon sx={{ fontSize: '1.2rem', color: '#4a89dc' }} />}
            <Typography sx={{ fontSize: '0.85rem', color: '#4a89dc', fontWeight: 500 }}>Treatment production per procedure group</Typography>
          </Box>
          <Collapse in={expandedSection === 'treatment'}>
            <ProcedureGroupTable 
              groups={data.treatmentGroups} 
              onAdd={() => handleOpenDialog('treatmentGroups')}
              onEdit={(idx) => handleOpenDialog('treatmentGroups', idx)}
              onDelete={(idx) => handleDeleteGroup('treatmentGroups', idx)}
            />
          </Collapse>
        </Box>
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* Collection Goals */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Collection Goals:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <DebouncedGoalInput label="Collection Percent" value={data.collectionPercent} unit="%" subtext="(% out of total prod.)" subtextWidth="120px" onChange={(val) => handleUpdate('collectionPercent', val)} />
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* New Patients */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        New Patients:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <DebouncedGoalInput label="Number of new patients per office" value={data.newPatientsTotal} unit="#" onChange={(val) => handleUpdate('newPatientsTotal', val)} />
        
        <Typography sx={{ color: '#003366', fontSize: '0.85rem', fontWeight: 600, mb: 1.5, mt: 2 }}>
          Number of new patients per provider
        </Typography>

        <Box sx={{ display: 'flex', gap: 15 }}>
          <Box>
            <Typography sx={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, mb: 1 }}>Dentist</Typography>
            {data.newPatientsProvider?.dentist?.map((p, i) => (
              <DebouncedProviderRow key={p.id} name={p.name} value={p.value} unit="New Pts #" onChange={(val) => handleUpdate(`newPatientsProvider.dentist.${i}.value`, val)} />
            ))}
          </Box>
          <Box>
            <Typography sx={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, mb: 1 }}>Hygienist</Typography>
            {data.newPatientsProvider?.hygienist?.map((p, i) => (
              <DebouncedProviderRow key={p.id} name={p.name} value={p.value} unit="New Pts #" onChange={(val) => handleUpdate(`newPatientsProvider.hygienist.${i}.value`, val)} />
            ))}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* Number of Visits */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Number of Visits:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <DebouncedGoalInput label="Total Visits Per Month" value={data.visitsTotal} unit="#" onChange={(val) => handleUpdate('visitsTotal', val)} />
        <DebouncedGoalInput label="Hygiene Visits Per Month" value={data.visitsHygienePercent} unit="%" subtext="(% out of total visits)" onChange={(val) => handleUpdate('visitsHygienePercent', val)} />
        <DebouncedGoalInput label="Treatment Visits Per Month" value={data.visitsTreatmentPercent} unit="%" subtext="(100% - Percentage of Hygiene Visits Per Month)" onChange={(val) => handleUpdate('visitsTreatmentPercent', val)} />
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* Re-appointments */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Re-appointments:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <DebouncedGoalInput label="Re-Appointment Percent" value={data.reappointmentPercent} unit="%" subtext="(% out of total visits)" onChange={(val) => handleUpdate('reappointmentPercent', val)} />
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#7a96b5' }} />

      {/* Acceptance Rate */}
      <Typography variant="body1" sx={{ color: '#003366', fontWeight: 600, mb: 2, textDecoration: 'underline' }}>
        Acceptance Rate:
      </Typography>
      <Box sx={{ pl: 4, mb: 4 }}>
        <DebouncedGoalInput label="New Pt Case Accept Percent" value={data.acceptanceNewPt} unit="%" onChange={(val) => handleUpdate('acceptanceNewPt', val)} />
        <DebouncedGoalInput label="Existing Pt Case Accept Percent" value={data.acceptanceExistingPt} unit="%" onChange={(val) => handleUpdate('acceptanceExistingPt', val)} />
      </Box>

      {/* Group Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#003366', borderBottom: '1px solid #e0e0e0', pb: 1.5 }}>
          {editingIndex !== null ? 'Edit Procedure Group' : 'Add Procedure Group'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              label="Group Name"
              variant="outlined"
              size="small"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Percentage (%)"
                variant="outlined"
                size="small"
                type="number"
                sx={{ width: '50%' }}
                value={formData.percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
              />
              <TextField
                label="Color Hex"
                variant="outlined"
                size="small"
                type="color"
                sx={{ width: '50%' }}
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </Box>
            <TextField
              label="Procedure Codes (comma separated)"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={formData.codes}
              onChange={(e) => setFormData(prev => ({ ...prev, codes: e.target.value }))}
              placeholder="e.g. D1110, D1120"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', color: '#666' }}>Cancel</Button>
          <Button onClick={handleSaveGroup} variant="contained" sx={{ textTransform: 'none', bgcolor: '#4a89dc', '&:hover': { bgcolor: '#3b75c4' } }}>
            Save Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardGoals;
