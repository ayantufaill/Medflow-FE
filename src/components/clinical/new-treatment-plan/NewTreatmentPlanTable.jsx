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
  DragIndicator as DragIndicatorIcon,
  Sync as SyncIcon,
  EventNoteOutlined as EventIcon,
  EditOutlined as EditOutlineIcon,
  MenuBookOutlined as HistoryIcon,
  RequestQuoteOutlined as EstimateIcon,
  AssignmentIndOutlined as RouteSlipIcon,
  MoveToInboxOutlined as HoldIcon,
  DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import { OutlinedInput } from '../../patients/form-components/formInputs';

import documentSvg from '../../../assets/treatmentplan/document_1.svg';
import uploadSvg from '../../../assets/treatmentplan/upload.svg';
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

const NewTreatmentPlanTable = ({ treatmentPlans, onDeleteItems, onMoveToTop, onUpdateItemStatus, selectedRows, setSelectedRows }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentVisitStatus, setCurrentVisitStatus] = useState('Unconfirmed');
  const [selectedNewTemplate, setSelectedNewTemplate] = useState('New Patient Exam 12yo+');
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
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
    <Box sx={{ height: '100%' }}>
      {/* Phase / Visit Header Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
        <DragIndicatorIcon sx={{ color: '#cbd5e1', cursor: 'grab', fontSize: '1.2rem' }} />
        
        <ReportSelect 
          options={STATUS_OPTIONS} 
          value={currentVisitStatus} 
          onChange={(e) => setCurrentVisitStatus(e.target.value)} 
          width={130}
        />
        
        <ReportSelect 
          options={NEW_TEMPLATE_OPTIONS} 
          value={selectedNewTemplate} 
          onChange={(e) => setSelectedNewTemplate(e.target.value)} 
          width={190}
        />
        
        <Box sx={{ 
          bgcolor: '#f8fafc', color: '#475569', 
          borderRadius: '4px', px: 1.5, py: 0.5, fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap'
        }}>
          Mon Aug 10, 9:00 am
        </Box>
        
        <Box sx={{ 
          display: 'flex', alignItems: 'center', gap: 0.5, 
          bgcolor: '#f8fafc', color: '#475569', 
          borderRadius: '4px', px: 1, py: 0.5, fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap'
        }}>
          60 min <SyncIcon sx={{ fontSize: '0.9rem' }} />
        </Box>
        
        <IconButton size="small" sx={{ ml: 1 }} onClick={(e) => setActionMenuAnchor(e.currentTarget)}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={() => setActionMenuAnchor(null)}
          sx={{ '& .MuiPaper-root': { width: 220, py: 1, px: 0 } }}
        >
          <MenuItem onClick={() => setActionMenuAnchor(null)} sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}>
            <EventIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> View on Schedule
          </MenuItem>
          <MenuItem onClick={() => setActionMenuAnchor(null)} sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}>
            <EditOutlineIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> Edit
          </MenuItem>
          <MenuItem onClick={() => setActionMenuAnchor(null)} sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}>
            <HistoryIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> History
          </MenuItem>
          <MenuItem onClick={() => setActionMenuAnchor(null)} sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}>
            <EstimateIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> Print Estimate
          </MenuItem>
          <MenuItem onClick={() => setActionMenuAnchor(null)} sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}>
            <RouteSlipIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> Print Route Slip
          </MenuItem>
          <MenuItem onClick={() => setActionMenuAnchor(null)} sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}>
            <HoldIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> Save As Hold
          </MenuItem>
          <MenuItem onClick={() => setActionMenuAnchor(null)} sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#ef4444', gap: 1.5 }}>
            <DeleteOutlineIcon sx={{ fontSize: '1.25rem', color: '#ef4444' }} /> Delete
          </MenuItem>
        </Menu>
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
    </Box>
  );
};

export default NewTreatmentPlanTable;
