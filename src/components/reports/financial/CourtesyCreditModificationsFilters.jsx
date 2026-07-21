import React from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportCheckbox, ReportSearchInput, ReportDivider } from '../ui';

const CourtesyCreditModificationsFilters = ({
  startDate, setStartDate,
  endDate, setEndDate,
  adjustmentType, setAdjustmentType,
  action, setAction,
  patients, setPatients,
  flags, setFlags,
  users, setUsers,
  groupByAdj, setGroupByAdj,
  searchText, setSearchText,
  adjustmentTypes, dropdownProviders,
  handleApply, handleClear
}) => {
  const topFilters = (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={dayjs(startDate)}
          onChange={(newValue) => setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { width: '160px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '4px', height: '32px', backgroundColor: '#fafbfe', color: '#09121f' }, '& fieldset': { borderColor: '#e2e8f0' } } 
            }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          end date
        </Typography>
        <DatePicker
          value={dayjs(endDate)}
          onChange={(newValue) => setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { width: '160px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '4px', height: '32px', backgroundColor: '#fafbfe', color: '#09121f' }, '& fieldset': { borderColor: '#e2e8f0' } } 
            }
          }}
        />
      </Box>
      <ReportDivider />
      <ReportSelect 
        label="FLAGS"
        value={flags}
        onChange={(e) => setFlags(e.target.value)}
        options={[
          { value: 'pts', label: 'Patients with or without flags' },
          { value: 'with_flags', label: 'Only patients with flags' },
          { value: 'without_flags', label: 'Only patients without flags' }
        ]} 
        width="240px" 
      />
      <ReportSelect 
        label="ADJUSTMENT TYPE"
        value={adjustmentType}
        onChange={(e) => setAdjustmentType(e.target.value)}
        options={[
          { value: 'all', label: 'All' },
          ...(adjustmentTypes || []).map((t) => ({ value: t.type, label: t.type }))
        ]}
        width="200px" 
      />

    </>
  );

  const middleFilters = (
    <>
      <ReportSelect 
        label="ACTION"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        options={[
          { value: 'all', label: 'All' },
          { value: 'created', label: 'Created' },
          { value: 'updated', label: 'Updated' },
          { value: 'deleted', label: 'Deleted' }
        ]} 
        width="160px" 
      />
      <ReportSelect 
        label="PATIENTS"
        value={patients}
        onChange={(e) => setPatients(e.target.value)}
        options={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active Patients' },
          { value: 'inactive', label: 'Inactive Patients' }
        ]} 
        width="160px" 
      />
      <ReportSelect 
        label="USERS"
        value={users}
        onChange={(e) => setUsers(e.target.value)}
        options={[
          { value: 'all', label: 'All' },
          ...(dropdownProviders || []).map((p) => ({ value: p._id || p.id, label: `${p.userId?.firstName || p.firstName || ''} ${p.userId?.lastName || p.lastName || ''}`.trim() || p.name || 'Unknown' }))
        ]} 
        width="160px" 
      />
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <ReportSearchInput 
          placeholder="Search by patient name" 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          width="300px" 
        />
      </Box>
      <ReportDivider />
     
      
        <ReportCheckbox 
          label="Group By Adjustment Type" 
          checked={groupByAdj}
          onChange={(e) => setGroupByAdj(typeof e === 'boolean' ? e : e?.target?.checked)}
        />    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      middleRowFilters={middleFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={handleApply}
      onClearAll={handleClear}
      onCreateTemplate={() => console.log('Create Template clicked')}
    />
  );
};

export default CourtesyCreditModificationsFilters;
