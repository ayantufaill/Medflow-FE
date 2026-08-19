import { Box, Typography, IconButton, Button, ButtonGroup, Select, MenuItem, InputAdornment, Autocomplete, TextField, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, Refresh, ArrowDropDown } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { radius } from '../../../constants/styles';
import dayjs from 'dayjs';
import DateNavigation from '../../../components/appointments/schedule/DateNavigation';

import { MOCK_DAY_TASKS } from './mockDayTasks';

const DayTasksHeader = ({ 
  selectedDate, onPrev, onNext, onToday, onDateSelect,
  selectedTask, onTaskChange,
  selectedPatient, onPatientChange,
  taskOptions,
  isRefreshing, onRefresh,
  viewMode, onViewModeChange
}) => {
  // Extract unique patients from mock data
  const uniquePatients = Array.from(
    new Set(MOCK_DAY_TASKS.flatMap(category => category.items.map(item => item.name)))
  ).sort();

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 1.5,
      px: 2,
      py: 1.5,
      mb: 2,
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.9rem', color: '#445164', fontWeight: 600, mr: 1 }}>
          Filter Tasks:
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', mr: 20}}>
        {/* Date Navigator - pushed slightly off the right edge */}
        <DateNavigation
          date={dayjs(selectedDate)}
          onPrev={onPrev}
          onNext={onNext}
          onDateSelect={onDateSelect}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        <IconButton size="small" sx={{ color: COLORS.TEXT_SECONDARY, ml: 2 }} onClick={onRefresh}>
          {isRefreshing ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
        </IconButton>

        {/* Filters */}
        <Autocomplete
          options={['All Tasks', ...taskOptions]}
          value={selectedTask}
          onChange={(e, newValue) => onTaskChange(newValue || 'All Tasks')}
          disableClearable
          size="small"
          componentsProps={{ popper: { sx: { zIndex: 1600 } } }}
          sx={{ 
            width: 150,
            '& .MuiOutlinedInput-root': {
              height: '36px',
              bgcolor: '#fafbfe',
              color: '#09121f',
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '13px',
              borderRadius: '4px',
              padding: '0 32px 0 16px !important',
              '& .MuiAutocomplete-input': {
                padding: '0 !important',
                height: '36px',
                lineHeight: '36px',
              }
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.PRIMARY },
          }}
          renderInput={(params) => <TextField {...params} />}
          renderOption={(props, option) => (
            <li {...props} style={{ fontFamily: 'Inter', fontSize: '13px' }}>
              {option}
            </li>
          )}
        />

        <Autocomplete
          options={['All Patients', ...uniquePatients]}
          value={selectedPatient || 'All Patients'}
          onChange={(e, newValue) => onPatientChange(newValue === 'All Patients' ? null : newValue)}
          size="small"
          disableClearable
          componentsProps={{ popper: { sx: { zIndex: 1600 } } }}
          sx={{ 
            minWidth: 160,
            '& .MuiOutlinedInput-root': {
              height: '36px',
              bgcolor: '#fafbfe',
              color: '#09121f',
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '13px',
              borderRadius: '4px',
              padding: '0 32px 0 16px !important',
              '& .MuiAutocomplete-input': {
                padding: '0 !important',
                height: '36px',
                lineHeight: '36px',
              }
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.PRIMARY },
          }}
          renderInput={(params) => <TextField {...params} placeholder="Filter Patients" />}
          renderOption={(props, option) => (
            <li {...props} style={{ fontFamily: 'Inter', fontSize: '13px' }}>
              {option}
            </li>
          )}
        />

        {/* View Toggle */}
        <ButtonGroup disableElevation sx={{ height: '32px' }}>
          <Button 
            variant={viewMode === 'task' ? "contained" : "outlined"}
            onClick={() => onViewModeChange('task')}
            sx={{ 
              bgcolor: viewMode === 'task' ? COLORS.ACCENT : 'transparent', 
              color: viewMode === 'task' ? 'white' : COLORS.ACCENT,
              borderColor: viewMode === 'task' ? COLORS.ACCENT : COLORS.BORDER,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              borderTopLeftRadius: radius.md,
              borderBottomLeftRadius: radius.md,
              '&:hover': { 
                bgcolor: viewMode === 'task' ? COLORS.ACCENT : COLORS.SURFACE_HOVER,
                borderColor: viewMode === 'task' ? COLORS.ACCENT : COLORS.BORDER,
              },
            }}
          >
            Task View
          </Button>
          <Button 
            variant={viewMode === 'patient' ? "contained" : "outlined"}
            onClick={() => onViewModeChange('patient')}
            sx={{ 
              bgcolor: viewMode === 'patient' ? COLORS.ACCENT : 'transparent', 
              color: viewMode === 'patient' ? 'white' : COLORS.ACCENT,
              borderColor: viewMode === 'patient' ? COLORS.ACCENT : COLORS.BORDER,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              borderTopRightRadius: radius.md,
              borderBottomRightRadius: radius.md,
              '&:hover': { 
                bgcolor: viewMode === 'patient' ? COLORS.ACCENT : COLORS.SURFACE_HOVER,
                borderColor: viewMode === 'patient' ? COLORS.ACCENT : COLORS.BORDER,
              }
            }}
          >
            Patient View
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default DayTasksHeader;
