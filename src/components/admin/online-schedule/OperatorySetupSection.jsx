import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box, Typography, Button, Checkbox, FormControlLabel, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip
} from '@mui/material';
import { GridView as GridViewIcon } from '@mui/icons-material';
import SectionHeader from './SectionHeader';
import AddOperatoryDialog from './AddOperatoryDialog';
import DeleteSvg from '../../../assets/practicesetupicon/deleteicon.svg';
import { fetchRooms, invalidateRooms, fetchAllRoomsForDropdown } from '../../../store/slices/roomSlice';

const OperatorySetupSection = ({ operatories, onDeleteOperatory, onSectionChange }) => {
  const [addOpen, setAddOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const dispatch = useDispatch();

  const refreshOperatories = () => {
    dispatch(invalidateRooms());
    dispatch(fetchRooms({ page: 1, limit: 100 }));
    dispatch(fetchAllRoomsForDropdown());
    onSectionChange?.();
  };

  const displayedOperatories = operatories.filter(op => showDeleted || op.isActive !== false);

  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
    >
      <SectionHeader
        number={4}
        icon={GridViewIcon}
        title="Operatory Setup"
        subtitle="Rooms and chairs available for online booking"
      />

      <Box sx={{ px: 3, py: 2.5 }}>
        {/* Actions bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
              />
            }
            label={<Typography variant="body2" color="text.secondary">Show deleted operatories</Typography>}
          />
          <Button
            variant="contained"
            onClick={() => setAddOpen(true)}
            sx={{
              backgroundColor: '#2563eb',
              textTransform: 'none',
              borderRadius: 5,
              px: 3,
              fontSize: '0.8rem',
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            + Add Operatory
          </Button>
        </Box>

        {/* Operatory Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                {['OPERATORY', 'STATUS', 'ORDER', 'NOTE', ''].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '2px solid', borderColor: 'divider' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedOperatories.map((op, i) => {
                const isActive = op.isActive !== false;
                return (
                  <TableRow key={op._id || i} sx={{ '&:hover': { backgroundColor: '#f8fafc' }, opacity: isActive ? 1 : 0.6 }}>
                    <TableCell sx={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 500 }}>
                      {op.name || op.roomNumber}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isActive ? (op.status || 'Active') : 'Deleted'}
                        size="small"
                        sx={{
                          backgroundColor: isActive ? '#dcfce7' : '#fee2e2',
                          color: isActive ? '#16a34a' : '#ef4444',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 22,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: '#2563eb' }}>{op.order || i + 1}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{op.note || '—'}</TableCell>
                    <TableCell align="right">
                      {isActive && (
                        <IconButton size="small" onClick={() => onDeleteOperatory(op._id || op.roomNumber)} sx={{ p: 0.5 }}>
                          <img src={DeleteSvg} alt="delete" width="16" height="16" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add Operatory Dialog */}
      {addOpen && (
        <AddOperatoryDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSuccess={refreshOperatories}
        />
      )}
    </Paper>
  );
};

export default OperatorySetupSection;

