import React from 'react';
import {
  Box, Typography, Button, Checkbox, FormControlLabel, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip
} from '@mui/material';
import {
  DeleteOutline as DeleteOutlineIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';
import SectionHeader from './SectionHeader';

const OperatorySetupSection = ({ operatories, onDeleteOperatory }) => (
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
          control={<Checkbox size="small" />}
          label={<Typography variant="body2" color="text.secondary">Show deleted operatories</Typography>}
        />
        <Button
          variant="contained"
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
            {operatories.map((op, i) => (
              <TableRow key={op._id || i} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                <TableCell sx={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 500 }}>
                  {op.name || op.roomNumber}
                </TableCell>
                <TableCell>
                  <Chip
                    label={op.status || 'Active'}
                    size="small"
                    sx={{
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#2563eb' }}>{op.order || i + 1}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{op.note || '—'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onDeleteOperatory(op._id || op.roomNumber)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Paper>
);

export default OperatorySetupSection;
