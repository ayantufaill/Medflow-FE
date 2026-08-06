import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProviderDropdownList } from '../../../store/slices/providerSlice';
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
  InputAdornment,
  Select,
  Divider,
  Menu
} from '@mui/material';
import { ReportSelect } from '../../reports/ui/ReportInputs';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  ScienceOutlined as ScienceIcon,
  ShieldOutlined as ShieldIcon,
  IosShare as ShareIcon,
  PrintOutlined as PrintIcon,
  DragIndicator as DragIndicatorIcon,
  Sync as SyncIcon
} from '@mui/icons-material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import { OutlinedSelect, OutlinedInput } from '../../patients/form-components/formInputs';

import plusSvg from '../../../assets/treatmentplan/plus.svg';
import documentSvg from '../../../assets/treatmentplan/document_1.svg';
import uploadSvg from '../../../assets/treatmentplan/upload.svg';
import deleteSvg from '../../../assets/treatmentplan/delete.svg';
import editSvg from '../../../assets/treatmentplan/edit.svg';
import toggleViewSvg from '../../../assets/treatmentplan/toggle_view.svg';
import arrowUpSvg from '../../../assets/treatmentplan/Arrow_up.svg';

const STATUS_OPTIONS = [
  'Unconfirmed',
  'Confirmed',
  'Arrived',
  'Ready',
  'In Chair',
  'Checkout',
  'Ask for Review',
  'Completed',
  'Canceled'
];

const NEW_TEMPLATE_OPTIONS = [
  'New Patient Exam 12yo+',
  'New Pediatric Patient Exam <12yo',
  'Periodic Exam 12yo+',
  'Periodic Exam <12yo',
  'Referral / Consultation',
  'Limited Exam',
  'Emergency Exam',
  'SDF',
  'N2O Operative',
  'Operative 1- No N2O',
  'Operative 2- Quick Resto',
  'OR Follow Up'
];

const NewTreatmentPlanTable = ({ treatmentPlans, onDeleteItems, onMoveToTop, onUpdateItemStatus }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentVisitStatus, setCurrentVisitStatus] = useState('Unconfirmed');
  const [selectedNewTemplate, setSelectedNewTemplate] = useState('New Patient Exam 12yo+');
  const providersList = useSelector(selectProviderDropdownList) || [];

  const getProviderName = (providerId) => {
    if (!providerId) return '-';
    if (providerId === 'CB') return 'CB'; // Keep fallback for existing mock items
    const provider = providersList.find(p => p._id === providerId || p.providerCode === providerId);
    if (!provider) return providerId;
    
    const first = provider.userId?.firstName || provider.firstName || provider.FName || '';
    const last = provider.userId?.lastName || provider.lastName || provider.LName || '';
    
    if (first || last) {
      return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`;
    }
    return provider.providerCode || provider._id || 'Unknown';
  };

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
      {/* Top Toolbar matching screenshot */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ width: 260 }}>
          <OutlinedSelect 
            value="active"
            sx={{ 
              bgcolor: '#fff',
              '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1.5, py: 0, px: 1.5, minHeight: '32px !important' },
              '& .MuiOutlinedInput-root': { minHeight: '32px' },
              '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' }
            }}
          >
            <MenuItem value="active" sx={{ py: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 400, color: '#0f172a', fontSize: '0.875rem' }}>
                <RadioButtonCheckedIcon sx={{ color: '#10b981', fontSize: '1rem' }} />
                Active Treatment Plan
              </Box>
            </MenuItem>
          </OutlinedSelect>
        </Box>
        
        <IconButton size="small" sx={{ border: '1px solid #0f172a', borderRadius: '50%', width: 24, height: 24, p: 0, ml: 2 }}>
          <Box component="img" src={plusSvg} alt="add" sx={{ width: 14, height: 14 }} />
        </IconButton>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 3, my: 0.5, borderColor: '#cbd5e1' }} />
        
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <IconButton size="small" onClick={() => {
            if (selectedRows.length > 0 && onDeleteItems) {
              onDeleteItems(selectedRows);
              setSelectedRows([]);
            }
          }}>
            <Box component="img" src={deleteSvg} alt="delete" sx={{ width: 22, height: 22 }} />
          </IconButton>
          <IconButton size="small">
            <ShieldIcon sx={{ fontSize: '1.35rem', color: '#94a3b8' }} />
          </IconButton>
          <IconButton size="small">
            <ShareIcon sx={{ fontSize: '1.35rem', color: '#94a3b8' }} />
          </IconButton>
          <IconButton size="small">
            <PrintIcon sx={{ fontSize: '1.35rem', color: '#94a3b8' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Phase / Visit Header Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
        <DragIndicatorIcon sx={{ color: '#cbd5e1', cursor: 'grab', fontSize: '1.2rem' }} />
        
        <ReportSelect 
          options={STATUS_OPTIONS} 
          value={currentVisitStatus} 
          onChange={(e) => setCurrentVisitStatus(e.target.value)} 
          width={180}
        />
        
        <ReportSelect 
          options={NEW_TEMPLATE_OPTIONS} 
          value={selectedNewTemplate} 
          onChange={(e) => setSelectedNewTemplate(e.target.value)} 
          width={240}
        />
        
        <Box sx={{ 
          bgcolor: '#f8fafc', color: '#475569', 
          borderRadius: '4px', px: 2, py: 0.5, fontWeight: 500
        }}>
          Mon Aug 10, 9:00 am
        </Box>
        
        <Box sx={{ 
          display: 'flex', alignItems: 'center', gap: 1, 
          bgcolor: '#f8fafc', color: '#475569', 
          borderRadius: '4px', px: 1.5, py: 0.5, fontWeight: 500
        }}>
          60 min <SyncIcon sx={{ fontSize: '1rem' }} />
        </Box>
        
        <IconButton size="small" sx={{ ml: 1 }}>
          <MoreVertIcon />
        </IconButton>

      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 240, overflowY: 'auto' }}>
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
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textAlign: 'center' }}>
                <ScienceIcon sx={{ fontSize: '1.2rem', color: '#64748b' }} />
              </TableCell>
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
                  <Select
                    value={row.status}
                    onChange={(e) => onUpdateItemStatus && onUpdateItemStatus(row.id, e.target.value)}
                    variant="standard"
                    disableUnderline
                    IconComponent={ExpandMoreIcon}
                    sx={{ 
                      fontSize: '0.8rem', 
                      color: '#475569',
                      '& .MuiSelect-select': { py: 0, px: 0, display: 'flex', alignItems: 'center' },
                      '& .MuiSvgIcon-root': { fontSize: '1rem', ml: 0.5, color: '#94a3b8' }
                    }}
                  >
                    <MenuItem value="Unplanned" sx={{ fontSize: '0.8rem' }}>Unplanned</MenuItem>
                    <MenuItem value="Rejected" sx={{ fontSize: '0.8rem' }}>Rejected</MenuItem>
                    <MenuItem value="Existing Current" sx={{ fontSize: '0.8rem' }}>Existing Current</MenuItem>
                    <MenuItem value="Existing Other" sx={{ fontSize: '0.8rem' }}>Existing Other</MenuItem>
                    <MenuItem value="Referred" sx={{ fontSize: '0.8rem' }}>Referred</MenuItem>
                  </Select>
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.created}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>{row.scheduled}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.site}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.code}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.description}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#475569' }}>{row.icd}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
                  <Box sx={{ bgcolor: '#eff6ff', borderRadius: '4px', display: 'inline-block', px: 1 }}>{getProviderName(row.provider)}</Box>
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
