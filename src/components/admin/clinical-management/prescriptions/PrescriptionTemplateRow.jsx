import React from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  Box,
  Button,
  IconButton,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const PrescriptionTemplateRow = ({
  row,
  index,
  isEditing,
  editDraft,
  setEditDraft,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete,
  handleRefreshRow,
  handleOpenSyncDialog
}) => {
  return (
    <TableRow sx={{ 
      '&:hover': { backgroundColor: '#f8fafc' },
      transition: 'background-color 0.2s'
    }}>
      <TableCell sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={editDraft.name}
            onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 } }}
          />
        ) : row.name}
      </TableCell>
      <TableCell sx={{ fontSize: '0.85rem', color: '#475569', py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={editDraft.medication}
            onChange={(e) => setEditDraft({ ...editDraft, medication: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 } }}
          />
        ) : row.medication}
      </TableCell>
      <TableCell sx={{ fontSize: '0.85rem', color: '#475569', py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={editDraft.dose}
            onChange={(e) => setEditDraft({ ...editDraft, dose: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 } }}
          />
        ) : row.dose}
      </TableCell>
      <TableCell sx={{ fontSize: '0.85rem', color: '#475569', py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={editDraft.duration}
            onChange={(e) => setEditDraft({ ...editDraft, duration: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 } }}
          />
        ) : row.duration}
      </TableCell>
      <TableCell sx={{ fontSize: '0.85rem', color: '#475569', py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={editDraft.longTerm}
            onChange={(e) => setEditDraft({ ...editDraft, longTerm: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 } }}
          />
        ) : row.longTerm}
      </TableCell>
      <TableCell sx={{ fontSize: '0.85rem', color: '#475569', textAlign: 'center', py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
        {isEditing ? (
          <TextField
            size="small"
            value={editDraft.refills}
            onChange={(e) => setEditDraft({ ...editDraft, refills: e.target.value })}
            sx={{ width: 50, '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8, textAlign: 'center' } }}
          />
        ) : row.refills}
      </TableCell>
      <TableCell sx={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
        {row.provider}
      </TableCell>
      <TableCell align="right" sx={{ width: 120, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button size="small" variant="contained" onClick={handleSaveEdit} sx={{ fontSize: '0.7rem', minWidth: 50, py: 0.5, borderRadius: 1.5, boxShadow: 'none', backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669', boxShadow: 'none' } }}>Save</Button>
            <Button size="small" variant="outlined" onClick={handleCancelEdit} sx={{ fontSize: '0.7rem', minWidth: 50, py: 0.5, borderRadius: 1.5, borderColor: '#cbd5e1', color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#94a3b8' } }}>Cancel</Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton size="small" sx={{ p: 0.5, color: '#64748b', '&:hover': { color: '#3b82f6', backgroundColor: '#eff6ff' } }} onClick={() => handleStartEdit(index)}>
                <EditIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton size="small" sx={{ p: 0.5, color: '#64748b', '&:hover': { color: '#3b82f6', backgroundColor: '#eff6ff' } }} onClick={() => handleRefreshRow(index)}>
                <RefreshIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" sx={{ p: 0.5, color: '#64748b', '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' } }} onClick={() => handleDelete(index)}>
                <DeleteIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Tooltip>
            <Typography
              onClick={handleOpenSyncDialog}
              sx={{
                fontSize: '0.8rem',
                color: '#3b82f6',
                fontWeight: 600,
                cursor: 'pointer',
                ml: 1,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Sync
            </Typography>
          </Box>
        )}
      </TableCell>
    </TableRow>
  );
};

export default PrescriptionTemplateRow;
