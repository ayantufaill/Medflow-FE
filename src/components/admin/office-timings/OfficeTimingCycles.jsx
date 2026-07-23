import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import AddIcon from '@mui/icons-material/Add';

const SECTION_HEADER_BG = '#eef4ff';

const OfficeTimingCycles = ({
  cycles = [],
  showAddCycle,
  newCycle,
  onShowAddCycle,
  onCycleFieldChange,
  onAddCycle,
  onCancelAddCycle,
  onDeleteCycle,
}) => (
  <Paper
    elevation={0}
    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: '#fff', overflow: 'hidden' }}
  >
    {/* Header strip */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1.5,
        backgroundColor: SECTION_HEADER_BG,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RepeatIcon sx={{ color: '#1d4ed8', fontSize: '1.1rem' }} />
        <Typography fontWeight={700} fontSize="0.9rem">
          Cycles
        </Typography>
      </Box>

      <Button
        size="small"
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: '0.95rem' }} />}
        onClick={onShowAddCycle}
        sx={{ textTransform: 'none', fontSize: '0.85rem', backgroundColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8' } }}
      >
        Add Cycle
      </Button>
    </Box>

    {/* Content */}
    <Box sx={{ px: 2, py: 2 }}>
      {cycles.map((cycle) => (
        <Box
          key={cycle.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.25,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography fontWeight={700} fontSize="0.85rem" sx={{ minWidth: 120 }}>
            {cycle.name}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexGrow: 1 }}>
            {cycle.fromDate && (
              <Typography variant="body2" color="text.secondary">
                From <Typography component="span" fontWeight={700} fontSize="inherit">{cycle.fromDate}</Typography>
              </Typography>
            )}
            {cycle.toDate && (
              <Typography variant="body2" color="text.secondary">
                To <Typography component="span" fontWeight={700} fontSize="inherit">{cycle.toDate}</Typography>
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDeleteCycle(cycle.id)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}

      {showAddCycle && (
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', py: 1.5, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Name (e.g. Summer)"
            value={newCycle.name}
            onChange={(e) => onCycleFieldChange('name', e.target.value)}
          />
          <TextField
            size="small"
            placeholder="From (e.g. Jun 1)"
            value={newCycle.fromDate}
            onChange={(e) => onCycleFieldChange('fromDate', e.target.value)}
          />
          <TextField
            size="small"
            placeholder="To (e.g. Aug 31)"
            value={newCycle.toDate}
            onChange={(e) => onCycleFieldChange('toDate', e.target.value)}
          />
          <Button size="small" variant="contained" onClick={onAddCycle} sx={{ textTransform: 'none', backgroundColor: '#1a3a6b', '&:hover': { backgroundColor: '#142d52' } }}>
            Add
          </Button>
          <Button size="small" variant="outlined" onClick={onCancelAddCycle} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
        </Box>
      )}

      <Typography
        sx={{ color: '#2563eb', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', mt: cycles.length ? 0 : 1 }}
      >
        + Add Exception
      </Typography>
    </Box>
  </Paper>
);

export default OfficeTimingCycles;