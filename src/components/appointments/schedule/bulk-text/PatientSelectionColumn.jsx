import React, { useState } from 'react';
import { Box, Typography, Checkbox, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { COLORS } from '../../../../constants/colors';
import { fontWeight } from '../../../../constants/styles';
import InitialsAvatar from '../../../shared/InitialsAvatar';
import PatientFilterPopover from './PatientFilterPopover';

const PatientSelectionColumn = ({ displayPatients, selectedPatients, handleSelectAll, handleTogglePatient, filters, onApplyFilters }) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const handleOpenFilter = (e) => setFilterAnchorEl(e.currentTarget);
  const handleCloseFilter = () => setFilterAnchorEl(null);

  return (
    <Box sx={{ width: '445px', height: '559px', flexShrink: 0, border: `1px solid ${COLORS.BORDER_LIGHT}`, borderRadius: '12px', backgroundColor: COLORS.WHITE, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${COLORS.BORDER_LIGHT}` }}>
        <Box>
          <Typography sx={{ fontSize: '16px', fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
            Patients
          </Typography>
          <Typography sx={{ fontSize: '11px', fontWeight: fontWeight.bold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', mt: '4px' }}>
            SELECT PATIENTS ({selectedPatients.length} SELECTED)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              size="small"
              checked={selectedPatients.length === displayPatients.length && displayPatients.length > 0}
              onChange={handleSelectAll}
              sx={{ p: '4px', '&.Mui-checked': { color: COLORS.ACCENT } }}
            />
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>Select All</Typography>
          </Box>
          <Button onClick={handleOpenFilter} startIcon={<FilterListIcon />} sx={{ color: COLORS.TEXT_SECONDARY, textTransform: 'none', fontSize: '13px', minWidth: 0, p: '4px 8px' }}>
            Filter
          </Button>
          <PatientFilterPopover anchorEl={filterAnchorEl} onClose={handleCloseFilter} filters={filters} onApply={onApplyFilters} />
        </Box>
      </Box>
      
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {displayPatients.map((patient) => {
          const id = patient._id || patient.id;
          const isChecked = selectedPatients.includes(id);
          return (
            <Box key={id} sx={{ display: 'flex', alignItems: 'center', p: '12px 16px', borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, cursor: 'pointer', '&:hover': { backgroundColor: '#f8fafc' } }} onClick={() => handleTogglePatient(id)}>
              <Checkbox
                size="small"
                checked={isChecked}
                sx={{ p: 0, mr: '12px', '&.Mui-checked': { color: COLORS.ACCENT } }}
              />
              <Box sx={{ mr: '12px' }}>
                <InitialsAvatar name={`${patient.firstName || ''} ${patient.lastName || ''}`} size={32} fontSize={13} />
              </Box>
              <Typography sx={{ fontSize: '14px', color: COLORS.TEXT_PRIMARY }}>
                {patient.firstName} {patient.lastName}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PatientSelectionColumn;
