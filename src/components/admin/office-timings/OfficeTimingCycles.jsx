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
import { COLORS } from '../../../constants/colors';

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
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onShowAddCycle}
        sx={{
          textTransform: 'none',
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '8px',
          px: 2,
          height: '30.67px',
          bgcolor: COLORS.ACCENT,
          boxShadow: 'none',
          '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' },
        }}
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
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'flex-end',
            p: 2,
            bgcolor: COLORS.SURFACE_TINT,
            borderRadius: '8px',
            border: `1px solid ${COLORS.BORDER_LIGHT}`,
            flexWrap: 'wrap',
            mt: 2,
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: COLORS.TEXT_SECONDARY, mb: '4px' }}>Name</Typography>
            <TextField
              size="small"
              placeholder="e.g. Summer"
              value={newCycle.name}
              onChange={(e) => onCycleFieldChange('name', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { height: '36px', bgcolor: '#ffffff', borderRadius: '6px', fontSize: '13px' } }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: COLORS.TEXT_SECONDARY, mb: '4px' }}>From</Typography>
            <TextField
              size="small"
              placeholder="e.g. Jun 1"
              value={newCycle.fromDate}
              onChange={(e) => onCycleFieldChange('fromDate', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { height: '36px', bgcolor: '#ffffff', borderRadius: '6px', fontSize: '13px' } }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: COLORS.TEXT_SECONDARY, mb: '4px' }}>To</Typography>
            <TextField
              size="small"
              placeholder="e.g. Aug 31"
              value={newCycle.toDate}
              onChange={(e) => onCycleFieldChange('toDate', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { height: '36px', bgcolor: '#ffffff', borderRadius: '6px', fontSize: '13px' } }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={onAddCycle}
              sx={{ textTransform: 'none', bgcolor: COLORS.ACCENT, borderRadius: '6px', fontWeight: 600, fontSize: '12px', boxShadow: 'none', height: '36px', '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' } }}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              onClick={onCancelAddCycle}
              sx={{ textTransform: 'none', borderColor: COLORS.BORDER, color: COLORS.TEXT_SECONDARY, borderRadius: '6px', fontWeight: 600, fontSize: '12px', height: '36px', '&:hover': { borderColor: COLORS.TEXT_SECONDARY } }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <Typography
        sx={{ color: COLORS.ACCENT, fontWeight: 600, fontSize: '12px', cursor: 'pointer', mt: cycles.length ? 2 : 1 }}
      >
        + Add Exception
      </Typography>
    </Box>
  </Paper>
);

export default OfficeTimingCycles;