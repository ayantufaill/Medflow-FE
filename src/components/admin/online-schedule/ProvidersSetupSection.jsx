import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box, Typography, TextField, Button, Checkbox, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, InputAdornment, MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  PeopleAlt as PeopleAltIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import SectionHeader from './SectionHeader';
import EditSvg from '../../../assets/practicesetupicon/editicon.svg';
import ViewSvg from '../../../assets/usermanagement icons/view.svg';
import AddProviderDialog from '../../providers/AddProviderDialog';
import EditProviderDialog from '../../providers/EditProviderDialog';
import ViewProviderDialog from '../../providers/ViewProviderDialog';
import { fetchProviders, invalidateProviders, fetchAllProvidersForDropdown } from '../../../store/slices/providerSlice';

const ProvidersSetupSection = ({
  providers,
  providerSearch,
  providerSpecialty,
  onSearchChange,
  onSpecialtyChange,
  onSectionChange,
}) => {
  // Dialog state
  const [addDialog, setAddDialog] = useState({ open: false });
  const [editDialog, setEditDialog] = useState({ open: false, providerId: null, providerName: '' });
  const [viewDialog, setViewDialog] = useState({ open: false, providerId: null, providerName: '' });

  // Drag and drop state
  const [dragEnabled, setDragEnabled] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [reorderedProviders, setReorderedProviders] = useState(null);

  const dispatch = useDispatch();

  const filteredProviders = providers.filter(p => {
    const name = p.userId
      ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`
      : `${p.firstName || ''} ${p.lastName || ''}`;
    const specialty = p.specialty?.length ? p.specialty.join(', ') : '';
    const matchesSearch = name.toLowerCase().includes(providerSearch.toLowerCase());
    const matchesSpecialty = !providerSpecialty || specialty.includes(providerSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  // Use reordered list when drag is enabled, otherwise use filtered
  const displayProviders = (dragEnabled && reorderedProviders) ? reorderedProviders : filteredProviders;

  // Clear reorder when drag is disabled
  useEffect(() => {
    if (!dragEnabled) {
      setReorderedProviders(null);
      setDraggedId(null);
    }
  }, [dragEnabled]);

  // Drag handlers
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    if (!reorderedProviders) {
      setReorderedProviders([...filteredProviders]);
    }
  };

  const handleDragOver = (e, overId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!draggedId || draggedId === overId || !reorderedProviders) return;

    const dragIndex = reorderedProviders.findIndex((p) => (p._id || p.id) === draggedId);
    const overIndex = reorderedProviders.findIndex((p) => (p._id || p.id) === overId);
    if (dragIndex === -1 || overIndex === -1 || dragIndex === overIndex) return;

    const updated = [...reorderedProviders];
    const [draggedItem] = updated.splice(dragIndex, 1);
    updated.splice(overIndex, 0, draggedItem);
    setReorderedProviders(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedId(null);
    onSectionChange?.();
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleResetOrder = () => {
    setReorderedProviders(null);
    setDraggedId(null);
    onSectionChange?.();
  };

  // Refresh providers after add/edit
  const refreshProviders = () => {
    dispatch(invalidateProviders());
    dispatch(fetchProviders({ page: 1, limit: 100 }));
    dispatch(fetchAllProvidersForDropdown());
    onSectionChange?.();
  };

  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', overflow: 'hidden' }}
    >
      <SectionHeader
        number={3}
        icon={PeopleAltIcon}
        title="Providers Setup"
        subtitle="Active Providers - In office providers available for online booking"
      />

      <Box sx={{ px: 3, py: 2.5 }}>
        {/* Search & Actions Bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={2} flexWrap="wrap">
          <Box display="flex" gap={1} flex={1} minWidth={300}>
            <TextField
              placeholder="Search by provider name"
              size="small"
              value={providerSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{
                width: 260,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#9ca3af' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#111827',
                }
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: '#9ca3af' }} /></InputAdornment>
              }}
            />
            <TextField
              select
              value={providerSpecialty}
              onChange={(e) => onSpecialtyChange(e.target.value)}
              size="small"
              sx={{
                width: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  '& fieldset': { borderColor: '#d1d5db' },
                  '&:hover fieldset': { borderColor: '#9ca3af' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#111827',
                }
              }}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="">Filter by Specialty</MenuItem>
              <MenuItem value="General Dentistry">General Dentistry</MenuItem>
              <MenuItem value="Orthodontics">Orthodontics</MenuItem>
              <MenuItem value="Periodontics">Periodontics</MenuItem>
              <MenuItem value="Oral Surgery">Oral Surgery</MenuItem>
              <MenuItem value="Endodontics">Endodontics</MenuItem>
              <MenuItem value="Dental Hygiene">Dental Hygiene</MenuItem>
              <MenuItem value="Dental Assisting">Dental Assisting</MenuItem>
            </TextField>
          </Box>

          <Box display="flex" alignItems="center" gap={1.5}>
            <Box display="flex" alignItems="center">
              <Checkbox
                size="small"
                checked={dragEnabled}
                onChange={(e) => setDragEnabled(e.target.checked)}
              />
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                Drag and drop order to reorder
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => setAddDialog({ open: true })}
              sx={{
                backgroundColor: '#2563eb',
                textTransform: 'none',
                borderRadius: 5,
                px: 3,
                fontSize: '0.8rem',
                '&:hover': { backgroundColor: '#1d4ed8' },
              }}
            >
              + Add Provider
            </Button>
            <Button
              variant="outlined"
              onClick={handleResetOrder}
              sx={{
                borderColor: '#d1d5db',
                color: 'text.primary',
                textTransform: 'none',
                borderRadius: 5,
                px: 2,
                fontSize: '0.8rem',
                '&:hover': { backgroundColor: '#f3f4f6' },
              }}
            >
              Reset Providers Order
            </Button>
          </Box>
        </Box>

        {/* Provider Table */}
        <TableContainer sx={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                {dragEnabled && (
                  <TableCell sx={{ width: 40, fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }} />
                )}
                {['PROVIDER', 'SPECIALTY', 'PROVIDER TYPE', 'EMAIL', 'MOBILE PHONE', 'FEDERAL TAX #', 'LICENSE #', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '2px solid', borderColor: 'divider' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayProviders.map((p, i) => {
                const name = p.userId
                  ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`
                  : `${p.firstName || ''} ${p.lastName || ''}`;
                const specialty = p.specialty?.length ? p.specialty.join(', ') : '';
                const type = p.providerClass || 'Dentist';
                const email = p.userId?.email || p.email || '';
                const phone = p.phone || '';
                const tax = p.npiNumber || '';
                const license = p.licenseNumber || '';
                const id = p._id || p.id;
                const isDragged = draggedId === id;

                return (
                  <TableRow
                    key={id || i}
                    draggable={dragEnabled}
                    onDragStart={dragEnabled ? (e) => handleDragStart(e, id) : undefined}
                    onDragOver={dragEnabled ? (e) => handleDragOver(e, id) : undefined}
                    onDrop={dragEnabled ? (e) => handleDrop(e) : undefined}
                    onDragEnd={dragEnabled ? () => handleDragEnd() : undefined}
                    sx={{
                      '&:hover': { backgroundColor: '#f8fafc' },
                      cursor: dragEnabled ? 'grab' : 'default',
                      ...(isDragged && { opacity: 0.5, backgroundColor: '#e8f0fe' }),
                      '&:active': { cursor: dragEnabled ? 'grabbing' : 'default' },
                    }}
                  >
                    {dragEnabled && (
                      <TableCell sx={{ cursor: 'grab', color: 'text.disabled', width: 40 }}>
                        <DragIndicatorIcon fontSize="small" />
                      </TableCell>
                    )}
                    <TableCell sx={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 500 }}>{name}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{specialty}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{type}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{email}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{phone || '—'}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{tax}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{license}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <IconButton
                        size="small"
                        onClick={() => setViewDialog({ open: true, providerId: id, providerName: name.trim() })}
                        sx={{ p: 0.5 }}
                      >
                        <img src={ViewSvg} alt="view" width="16" height="16" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setEditDialog({ open: true, providerId: id, providerName: name.trim() })}
                        sx={{ p: 0.5 }}
                      >
                        <img src={EditSvg} alt="edit" width="16" height="16" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Dialogs */}
      {addDialog.open && (
        <AddProviderDialog
          open={addDialog.open}
          onClose={() => setAddDialog({ open: false })}
          title="Add Provider"
          providerCategory={null}
          onSuccess={refreshProviders}
        />
      )}

      {editDialog.open && (
        <EditProviderDialog
          open={editDialog.open}
          providerId={editDialog.providerId}
          providerName={editDialog.providerName}
          onClose={() => setEditDialog({ open: false, providerId: null, providerName: '' })}
          onSaved={refreshProviders}
        />
      )}

      {viewDialog.open && (
        <ViewProviderDialog
          open={viewDialog.open}
          providerId={viewDialog.providerId}
          providerName={viewDialog.providerName}
          onClose={() => setViewDialog({ open: false, providerId: null, providerName: '' })}
        />
      )}
    </Paper>
  );
};

export default ProvidersSetupSection;
