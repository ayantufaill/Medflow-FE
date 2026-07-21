import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { ReportFilterBar, ReportSelect, ReportCheckbox, ReportSearchInput, ReportDivider } from '../ui';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const ProductionCollectionFilters = ({ dropdownProviders, onApplyFilters, onClearAll }) => {
  const [draftFilters, setDraftFilters] = useState({
    dateRange: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    provider: 'all',
    grouping: 'no-grouping',
    codeFilter: 'filter',
    codeText: '',
    showFlags: true,
    showDOB: true,
    showProvider: true,
    displayOnlyCollection: false,
    excludeProducts: false,
    filterByDOS: false,
    flagFilter: 'pts',
    sortBy: 'default'
  });

  const handleFilterChange = (key, value) => {
    setDraftFilters(prev => ({ ...prev, [key]: value }));
  };

  const getLocalDateString = (d) => {
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  };

  const handleFilterModeChange = (e) => {
    const newMode = e.target.value;
    handleFilterChange('dateRange', newMode);
    if (newMode === 'range') return;
    
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);
    
    switch (newMode) {
      case 'daily':
        break;
      case 'this_week': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'this_month':
      case 'month_to_date': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = newMode === 'this_month' ? new Date(today.getFullYear(), today.getMonth() + 1, 0) : new Date();
        break;
      }
      case 'last_7_days': {
        start.setDate(today.getDate() - 7);
        break;
      }
      case 'last_week': {
        const day = today.getDay();
        const diffToLastWeekStart = today.getDate() - day - 7 + (day === 0 ? -6 : 1);
        start = new Date(new Date().setDate(diffToLastWeekStart));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'last_4_weeks': {
        start.setDate(today.getDate() - 28);
        break;
      }
      case 'last_month': {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      case 'last_3_months': {
        start.setMonth(today.getMonth() - 3);
        break;
      }
      case 'last_12_months': {
        start.setFullYear(today.getFullYear() - 1);
        break;
      }
      case 'quarter_to_date': {
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      }
      case 'year_to_date': {
        start = new Date(today.getFullYear(), 0, 1);
        break;
      }
      case 'last_year': {
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      }
      default:
        break;
    }
    
    setDraftFilters(prev => ({
      ...prev,
      startDate: getLocalDateString(start),
      endDate: getLocalDateString(end)
    }));
  };

  const getProviderLabel = (p) => {
    if (p?.userId?.firstName || p?.userId?.lastName) {
      return `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim();
    }
    return `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || p?.name || 'Unknown';
  };

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(draftFilters);
  };

  const handleClear = () => {
    const defaultFilters = {
      dateRange: 'daily',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      provider: 'all',
      grouping: 'no-grouping',
      codeFilter: 'filter',
      codeText: '',
      showFlags: true,
      showDOB: true,
      showProvider: true,
      displayOnlyCollection: false,
      excludeProducts: false,
      filterByDOS: false,
      flagFilter: 'pts',
      sortBy: 'default'
    };
    setDraftFilters(defaultFilters);
    if (onClearAll) onClearAll();
    if (onApplyFilters) onApplyFilters(defaultFilters);
  };

  // Sync initially
  useEffect(() => {
    if (onApplyFilters) onApplyFilters(draftFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topFilters = (
    <>
      <ReportSelect 
        label="DATE RANGE"
        options={[
          { value: 'daily', label: 'Daily' },
          { value: 'range', label: 'Range' },
          { value: 'this_week', label: 'This Week' },
          { value: 'this_month', label: 'This Month' },
          { value: 'last_7_days', label: 'Last 7 days' },
          { value: 'last_week', label: 'Last Week' },
          { value: 'last_4_weeks', label: 'Last 4 Weeks' },
          { value: 'last_month', label: 'Last Month' },
          { value: 'last_3_months', label: 'Last 3 Months' },
          { value: 'last_12_months', label: 'Last 12 Months' },
          { value: 'month_to_date', label: 'Month to date' },
          { value: 'quarter_to_date', label: 'Quarter to date' },
          { value: 'year_to_date', label: 'Year to date' },
          { value: 'last_year', label: 'Last Year' },
        ]}
        value={draftFilters.dateRange}
        onChange={handleFilterModeChange}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={dayjs(draftFilters.startDate)}
          onChange={(newValue) => handleFilterChange('startDate', newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '160px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          end date
        </Typography>
        <DatePicker
          value={dayjs(draftFilters.endDate)}
          onChange={(newValue) => handleFilterChange('endDate', newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '160px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
      <ReportDivider />
      <ReportSelect 
        label="FILTER REPORT BY PROVIDER"
        options={[
          { value: 'all', label: 'All' },
          ...dropdownProviders.map((p) => ({
            value: p._id || p.id,
            label: getProviderLabel(p)
          }))
        ]}
        value={draftFilters.provider}
        onChange={(e) => handleFilterChange('provider', e.target.value)}
      />
      <ReportSelect 
        label="GROUP BY"
        options={[
          { value: 'no-grouping', label: 'No Grouping' },
          { value: 'group-provider', label: 'Group By Provider' },
        ]}
        value={draftFilters.grouping}
        onChange={(e) => handleFilterChange('grouping', e.target.value)}
      />
    </>
  );

  const middleFilters = (
    <>
      <ReportSelect 
        label="CODES FILTER"
        options={[
          { value: 'filter', label: 'Filter Codes' },
          { value: 'exclude', label: 'Enter Codes to Exclude' },
        ]}
        value={draftFilters.codeFilter}
        onChange={(e) => handleFilterChange('codeFilter', e.target.value)}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2.5 }}>
            <ReportSearchInput 
              placeholder="Enter code or procedure" 
              value={draftFilters.codeText}
              onChange={(e) => handleFilterChange('codeText', e.target.value)}
              width="250px"
            />
      </Box>
      <ReportDivider />
      <ReportSelect 
        label="Flag Filter"
        options={[
          { value: 'pts', label: 'Pts With Or Without Flags' },
          { value: 'with_flags', label: 'Pts With Flags Only' },
          { value: 'without_flags', label: 'Pts Without Flags Only' },
        ]}
        value={draftFilters.flagFilter}
        onChange={(e) => handleFilterChange('flagFilter', e.target.value)}
      />
      
      <ReportSelect 
        label="SORT REPORT BY"
        options={[
          { value: 'default', label: 'Default' },
          { value: 'date_asc', label: 'Date: Ascending' },
          { value: 'date_desc', label: 'Date: Descending' },
          { value: 'patient', label: 'Patient Name' },
          { value: 'amount_desc', label: 'Amount: High to Low' },
        ]}
        value={draftFilters.sortBy}
        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
      />
     <Box sx={{ display: 'flex', alignItems: 'center', pt: 2.5 }}>
             <ReportCheckbox 
               label="Show Flags in Report" 
               checked={draftFilters.showFlags} 
               onChange={(e) => handleFilterChange('showFlags', e.target.checked)} 
             />
      </Box>
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox 
        label="Display Only Records with Collection" 
        checked={draftFilters.displayOnlyCollection}
        onChange={(checked) => handleFilterChange('displayOnlyCollection', checked)}
      />
      <ReportCheckbox 
        label="Exclude Products" 
        checked={draftFilters.excludeProducts}
        onChange={(checked) => handleFilterChange('excludeProducts', checked)}
      />
      
      <ReportCheckbox 
        label="Show Date of Birth" 
        checked={draftFilters.showDOB}
        onChange={(checked) => handleFilterChange('showDOB', checked)}
      />
      <ReportCheckbox 
        label="Show Provider" 
        checked={draftFilters.showProvider}
        onChange={(checked) => handleFilterChange('showProvider', checked)}
      />
      <ReportCheckbox 
        label="Filter by DOS" 
        checked={draftFilters.filterByDOS}
        onChange={(checked) => handleFilterChange('filterByDOS', checked)}
      />
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters} 
      middleRowFilters={middleFilters} 
      bottomRowFilters={bottomFilters} 
      onApplyFilters={handleApply} 
      onClearAll={handleClear} 
      onCreateTemplate={() => {}}
    />
  );
};

export default ProductionCollectionFilters;
