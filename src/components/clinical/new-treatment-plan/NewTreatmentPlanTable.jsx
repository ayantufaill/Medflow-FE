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
  MonetizationOnOutlined as FeesIcon,
  PostAddOutlined as PreAuthIcon,
  MenuBookOutlined as HistoryIcon,
  RequestQuoteOutlined as EstimateIcon,
  AssignmentIndOutlined as RouteSlipIcon,
  MoveToInboxOutlined as HoldIcon,
  DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import { OutlinedInput } from '../../patients/form-components/formInputs';
import dayjs from 'dayjs';

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

const PROCEDURE_TABLE_MIN_WIDTH = 1120;

const NewTreatmentPlanTable = ({ appointment, appointmentTypes, onUpdateAppointment, treatmentPlans, totals, formatMoney, onDeleteItems, onEditItem, onEditFees, onMoveToTop, onPrintEstimate, onPrintRouteSlip, onViewHistory, onViewSchedule, onEditAppointment, onSendPreAuth, onUpdateItemStatus, onSaveAsHold, onDeleteDraft, selectedRows, setSelectedRows }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const currentVisitStatus = appointment?.status || 'Unconfirmed';
  const getCatId = (val) => (typeof val === 'object' && val !== null ? (val._id || val.id || val.name) : val);
  const selectedNewTemplate = getCatId(appointment?.appointmentTypeId) || getCatId(appointment?.category) || 'New Patient Exam 12yo+';

  const handleStatusChange = (e) => {
    if (onUpdateAppointment) onUpdateAppointment({ status: e.target.value });
  };

  const handleCategoryChange = (e) => {
    if (onUpdateAppointment) onUpdateAppointment({ appointmentTypeId: e.target.value });
  };

  const handleRecalculateTime = () => {
    if (appointment && onUpdateAppointment && treatmentPlans) {
      const calculatedDuration = treatmentPlans
        .filter(p => String(p.appointmentId || p._appointmentId) === String(appointment._id || appointment.id))
        .reduce((sum, p) => sum + (Number(p.duration) || 15), 0) || 60;
      onUpdateAppointment({ durationMinutes: calculatedDuration });
    }
  };

  const appointmentTypeOptions = appointmentTypes?.length > 0 
    ? appointmentTypes.map(t => ({ label: t.name || t.label || t, value: t._id || t.id || t.name || t }))
    : NEW_TEMPLATE_OPTIONS;

  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [procedureMenu, setProcedureMenu] = useState({ anchorEl: null, row: null });
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

  const handleProcedureMenuOpen = (event, row) => {
    setProcedureMenu({ anchorEl: event.currentTarget, row });
  };

  const handleProcedureMenuClose = () => {
    setProcedureMenu({ anchorEl: null, row: null });
  };

  const handleEditProcedure = () => {
    if (procedureMenu.row && onEditItem) {
      onEditItem(procedureMenu.row);
    }
    handleProcedureMenuClose();
  };

  const handleEditFees = () => {
    if (procedureMenu.row && onEditFees) onEditFees(procedureMenu.row);
    handleProcedureMenuClose();
  };

  const handleSendPreAuth = () => {
    if (procedureMenu.row && onSendPreAuth) {
      onSendPreAuth(procedureMenu.row);
    }
    handleProcedureMenuClose();
  };

  const handleDeleteProcedure = () => {
    const rowId = procedureMenu.row?.id;
    handleProcedureMenuClose();
    if (rowId && onDeleteItems) {
      onDeleteItems([rowId]);
      setSelectedRows(selectedRows.filter((selectedId) => selectedId !== rowId));
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
          onChange={handleStatusChange}
          width={130}
        />

        <ReportSelect
          options={appointmentTypeOptions}
          value={selectedNewTemplate}
          onChange={handleCategoryChange}
          width={190}
        />

        <Box sx={{
          bgcolor: '#f8fafc', color: '#475569',
          borderRadius: '4px', px: 1.5, py: 0.5, fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap'
        }}>
          {appointment?.appointmentDate ? dayjs(appointment.appointmentDate).format('ddd MMM D, h:mm a') : '-'}
        </Box>

        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 0.5,
          bgcolor: '#f8fafc', color: '#475569',
          borderRadius: '4px', px: 1, py: 0.5, fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: 'pointer'
        }} onClick={handleRecalculateTime}>
          {appointment?.durationMinutes || 0} min <SyncIcon sx={{ fontSize: '0.9rem' }} />
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
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null);
              onViewSchedule?.();
            }}
            sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}
          >
            <EventIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> View on Schedule
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null);
              onEditAppointment?.();
            }}
            sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}
          >
            <EditOutlineIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null);
              onViewHistory?.();
            }}
            sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}
          >
            <HistoryIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> History
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null);
              onPrintEstimate?.();
            }}
            sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}
          >
            <EstimateIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> Print Estimate
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null);
              onPrintRouteSlip?.();
            }}
            sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}
          >
            <RouteSlipIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> Print Route Slip
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null);
              onSaveAsHold?.();
            }}
            sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#334155', gap: 1.5 }}
          >
            <HoldIcon sx={{ fontSize: '1.25rem', color: '#0f172a' }} /> Save As Hold
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActionMenuAnchor(null);
              onDeleteDraft?.();
            }}
            sx={{ minHeight: 'auto', py: 1, px: 2, fontSize: '13px', fontFamily: 'Inter', color: '#ef4444', gap: 1.5 }}
          >
            <DeleteOutlineIcon sx={{ fontSize: '1.25rem', color: '#ef4444' }} /> Delete
          </MenuItem>
        </Menu>
      </Box>

      {/* Table + total block share the same scroll frame. */}
      <Box sx={{ maxHeight: 340, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
        <Box sx={{ minWidth: PROCEDURE_TABLE_MIN_WIDTH }}>
          <TableContainer>
            <Table size="small" sx={{ minWidth: PROCEDURE_TABLE_MIN_WIDTH }}>
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
                        <MenuItem value="Planned" sx={{ fontSize: '0.8rem' }}>Planned</MenuItem>
                        <MenuItem value="Scheduled" sx={{ fontSize: '0.8rem' }}>Scheduled</MenuItem>
                        <MenuItem value="Unplanned" sx={{ fontSize: '0.8rem' }}>Unplanned</MenuItem>
                        <MenuItem value="Rejected" sx={{ fontSize: '0.8rem' }}>Rejected</MenuItem>
                        <MenuItem value="Existing Current" sx={{ fontSize: '0.8rem' }}>Existing Current</MenuItem>
                        <MenuItem value="Existing Other" sx={{ fontSize: '0.8rem' }}>Existing Other</MenuItem>
                        <MenuItem value="Referred" sx={{ fontSize: '0.8rem' }}>Referred</MenuItem>
                        <MenuItem value="Completed" sx={{ fontSize: '0.8rem' }}>Completed</MenuItem>
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
                      <IconButton
                        size="small"
                        aria-label={`Procedure actions for ${row.code || 'procedure'}`}
                        aria-haspopup="menu"
                        aria-expanded={procedureMenu.row?.id === row.id ? 'true' : undefined}
                        onClick={(event) => handleProcedureMenuOpen(event, row)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              m: 2,
              px: 4,
              py: 2.5,
              bgcolor: '#f8fafc',
              borderRadius: '4px',
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 1fr) repeat(3, minmax(120px, 150px))',
              gap: 3,
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
              <Box sx={{ width: 15, height: 15, borderRadius: '50%', bgcolor: '#cbd5e1', flexShrink: 0 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#475569' }}>
                  Total
                </Typography>
                <Typography sx={{ mt: 1, fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#64748b' }}>
                  Entire treatment plan
                </Typography>
              </Box>
            </Box>

            {[
              ['Negotiated', totals?.negotiated || 0],
              ['Insurance', totals?.insurance || 0],
              ['Patient', totals?.patient || 0],
            ].map(([label, value]) => (
              <Box key={label} sx={{ minWidth: 0 }}>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#475569' }}>
                  {label}
                </Typography>
                <Typography sx={{ mt: 1, fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#64748b' }}>
                  {formatMoney ? formatMoney(value, '$0.00') : `$${Number(value || 0).toFixed(2)}`}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Menu
        anchorEl={procedureMenu.anchorEl}
        open={Boolean(procedureMenu.anchorEl)}
        onClose={handleProcedureMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 160,
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)',
            '& .MuiMenuItem-root': {
              gap: 1.1,
              minHeight: 32,
              py: 0.75,
              px: 1.5,
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              color: '#0f172a',
            },
          },
        }}
      >
        <MenuItem onClick={handleEditProcedure}>
          <EditOutlineIcon sx={{ fontSize: 18, color: '#0f172a' }} />
          Edit Procedure
        </MenuItem>
        <MenuItem onClick={handleEditFees}>
          <FeesIcon sx={{ fontSize: 18, color: '#0f172a' }} />
          Edit Fees
        </MenuItem>
        <MenuItem onClick={handleSendPreAuth}>
          <PreAuthIcon sx={{ fontSize: 18, color: '#0f172a' }} />
          Send Pre-Auth
        </MenuItem>
        <MenuItem onClick={handleDeleteProcedure} sx={{ color: '#dc2626 !important' }}>
          <DeleteOutlineIcon sx={{ fontSize: 18, color: '#dc2626' }} />
          Delete Procedure
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default NewTreatmentPlanTable;
