import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  MenuItem,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  InputAdornment
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

import { OutlinedSelect, OutlinedInput } from '../../patients/form-components/formInputs';

import plusSvg from '../../../assets/treatmentplan/plus.svg';
import documentSvg from '../../../assets/treatmentplan/document_1.svg';
import uploadSvg from '../../../assets/treatmentplan/upload.svg';
import deleteSvg from '../../../assets/treatmentplan/delete.svg';
import editSvg from '../../../assets/treatmentplan/edit.svg';
import toggleViewSvg from '../../../assets/treatmentplan/toggle_view.svg';
import arrowUpSvg from '../../../assets/treatmentplan/Arrow_up.svg';

const NewTreatmentPlanTable = ({ treatmentPlans, onDeleteItems }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleStatusSelect = (e) => {
    const status = e.target.value;
    if (status !== 'Status' && !activeFilters.includes(status)) {
      setActiveFilters([...activeFilters, status]);
    }
  };

  const handleRemoveFilter = (statusToRemove) => {
    setActiveFilters(activeFilters.filter(s => s !== statusToRemove));
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const filteredPlans = activeFilters.length > 0
    ? treatmentPlans.filter(plan => activeFilters.includes(plan.status))
    : treatmentPlans;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredPlans.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  return (
    <Paper elevation={0} sx={{ borderRadius: '8px', border: '1px solid #e2e8f0', p: 3 }}>
      {/* Search Bar (Moved from Procedures pane if preferred, but originally was in Procedures pane. Wait, in original it was in Right Pane. Let me check the structure. Ah, the search bar was in Right Pane under Procedures grid! Let me adjust this. Let's just render the Table here.) */}
      
      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 3 }}>Treatment Plan</Typography>
      
      {/* Table Filters/Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ minWidth: 160 }}>
          <OutlinedSelect value="All Procedures">
            <MenuItem value="All Procedures">All Procedures</MenuItem>
          </OutlinedSelect>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <OutlinedSelect value="Status" onChange={handleStatusSelect}>
            <MenuItem value="Status" disabled>Status</MenuItem>
            <MenuItem value="Planned">Planned</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Referred">Referred</MenuItem>
          </OutlinedSelect>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small"><Box component="img" src={plusSvg} alt="add" sx={{ width: 18, height: 18 }} /></IconButton>
          <IconButton size="small"><Box component="img" src={toggleViewSvg} alt="toggle view" sx={{ width: 18, height: 18 }} /></IconButton>
          <IconButton size="small"><Box component="img" src={arrowUpSvg} alt="arrow up" sx={{ width: 18, height: 18 }} /></IconButton>
          <IconButton size="small"><Box component="img" src={uploadSvg} alt="upload" sx={{ width: 18, height: 18 }} /></IconButton>
          <IconButton size="small"><Box component="img" src={documentSvg} alt="copy" sx={{ width: 18, height: 18 }} /></IconButton>
          <IconButton size="small" onClick={() => {
            if (selectedRows.length > 0 && onDeleteItems) {
              onDeleteItems(selectedRows);
              setSelectedRows([]); // Clear selection
            }
          }}>
            <Box component="img" src={deleteSvg} alt="delete" sx={{ width: 18, height: 18 }} />
          </IconButton>
          
          <Chip label={`${filteredPlans.length} procedures`} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, ml: 1, borderRadius: '4px' }} />
          {activeFilters.length > 0 && (
            <>
              <Typography variant="caption" sx={{ color: '#64748b', ml: 1 }}>Filtered results</Typography>
              <Typography 
                variant="caption" 
                onClick={handleClearFilters}
                sx={{ color: '#3b82f6', ml: 1, cursor: 'pointer', fontWeight: 600 }}
              >
                Clear all filters
              </Typography>
              
              {activeFilters.map(status => (
                <Chip 
                  key={status}
                  label={status} 
                  onDelete={() => handleRemoveFilter(status)}
                  size="small" 
                  sx={{ bgcolor: '#eff6ff', color: '#2563eb', borderRadius: '4px', ml: 1, '& .MuiChip-deleteIcon': { color: '#2563eb' } }} 
                />
              ))}
            </>
          )}
        </Box>
        <IconButton size="small">
          <Box component="img" src={editSvg} alt="edit" sx={{ width: 18, height: 18 }} />
        </IconButton>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell padding="checkbox">
                <Checkbox 
                  size="small" 
                  checked={filteredPlans.length > 0 && selectedRows.length === filteredPlans.length}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < filteredPlans.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>PRIORITY</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>STATUS</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>CREATED</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>SCHEDULED</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>SITE</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>CODE</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>DESCRIPTION</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>ICD</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>PROVIDER</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>NEG RATE</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>INS EST</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>PT EST</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>PRE-AUTH</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>LAB CASE</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlans.map((row) => (
              <TableRow key={row.id} hover selected={selectedRows.includes(row.id)}>
                <TableCell padding="checkbox">
                  <Checkbox 
                    size="small" 
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.priority}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {row.status} <ExpandMoreIcon fontSize="inherit" />
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.created}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>{row.scheduled}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.site}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.code}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.description}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.icd}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
                  <Box sx={{ bgcolor: '#eff6ff', borderRadius: '4px', display: 'inline-block', px: 1 }}>{row.provider}</Box>
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.negRate}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.insEst}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.ptEst}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.preAuth}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569', textAlign: 'center' }}>
                  {row.labCase === '+' ? (
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>+</Box>
                  ) : '-'}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default NewTreatmentPlanTable;
