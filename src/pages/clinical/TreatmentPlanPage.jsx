import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedPatientId } from '../../store/slices/patientSlice';
import { useTreatmentPlansQuery, useCreateTreatmentPlan, useUpdateTreatmentPlan, useDeleteTreatmentPlan } from '../../hooks/queries';
import { 
  Box, Typography, Grid, Paper, IconButton, 
  Button, Stack, Accordion, AccordionSummary, AccordionDetails, Chip, Divider,
  Dialog, DialogContent, DialogTitle, DialogActions, TextField, Popover, Checkbox, Menu, MenuItem, Tooltip
} from '@mui/material';
import { Tooth as RadiographicTooth, SelectToothDialog } from '../../components/radiographic';

const RESTORATIVE_CODES_INFO = {
  'D2140': { name: 'amalgam - one surface, primary or permanent', fee: '$85.00', treatmentName: 'Amalgam' },
  'D2150': { name: 'amalgam - two surfaces, primary or permanent', fee: '$115.00', treatmentName: 'Amalgam' },
  'D2160': { name: 'amalgam - three surfaces, primary or permanent', fee: '$145.00', treatmentName: 'Amalgam' },
  'D2161': { name: 'amalgam - four or more surfaces, primary or permanent', fee: '$180.00', treatmentName: 'Amalgam' },
  'D2330': { name: 'resin-based composite - one surface, anterior', fee: '$120.00', treatmentName: 'Resin composite' },
  'D2331': { name: 'resin-based composite - two surfaces, anterior', fee: '$150.00', treatmentName: 'Resin composite' },
  'D2332': { name: 'resin-based composite - three surfaces, anterior', fee: '$180.00', treatmentName: 'Resin composite' },
  'D2335': { name: 'resin-based composite - four or more surfaces or involving incisal angle (anterior)', fee: '$220.00', treatmentName: 'Resin composite' },
  'D2390': { name: 'resin-based composite crown, anterior', fee: '$290.00', treatmentName: 'Resin composite crown' },
  'D2391': { name: 'resin-based composite - one surface, posterior', fee: '$130.00', treatmentName: 'Resin composite' },
  'D2392': { name: 'resin-based composite - two surfaces, posterior', fee: '$164.00', treatmentName: 'Resin composite' },
  'D2393': { name: 'resin-based composite - three surfaces, posterior', fee: '$195.00', treatmentName: 'Resin composite' },
  'D2394': { name: 'resin-based composite - four or more surfaces, posterior', fee: '$240.00', treatmentName: 'Resin composite' },
  'D2410': { name: 'gold foil - one surface', fee: '$310.00', treatmentName: 'Gold foil' },
  'D2420': { name: 'gold foil - two surfaces', fee: '$420.00', treatmentName: 'Gold foil' },
  'D2430': { name: 'gold foil - three surfaces', fee: '$530.00', treatmentName: 'Gold foil' },
  'D2960': { name: 'labial veneer (resin laminate) - direct', fee: '$650.00', treatmentName: 'Labial veneer' },
  'D2928': { name: 'prefabricated porcelain/ceramic crown - permanent tooth', fee: '$220.00', treatmentName: 'Prefabricated crown' },
  'Cinsert': { name: '0000', fee: '$0.00', treatmentName: 'Cinsert' }
};

const STATUS_OPTIONS = [
  { key: 'D', label: 'Diagnosed', color: '#94a3b8', bgColor: '#f1f5f9', textColor: '#475569' },
  { key: 'P', label: 'Presented', color: '#3b82f6', bgColor: '#eff6ff', textColor: '#1d4ed8' },
  { key: 'A', label: 'Accepted', color: '#0f766e', bgColor: '#ccfbf1', textColor: '#115e59' },
  { key: 'X', label: 'Rejected', color: '#ef4444', bgColor: '#fef2f2', textColor: '#991b1b' },
  { key: 'F', label: 'Future', color: '#f59e0b', bgColor: '#fef3c7', textColor: '#92400e' },
  { key: '!', label: 'Follow-up', color: '#eab308', bgColor: '#fef9c3', textColor: '#854d0e' },
  { key: 'EO', label: 'Existing In Office', color: '#64748b', bgColor: '#f1f5f9', textColor: '#334155' },
  { key: 'EX', label: 'Existing Out Office', color: '#475569', bgColor: '#f8fafc', textColor: '#1e293b' }
];

const DENTISTS = [
  'Joe Dentist',
  'test test',
  'Michael Cuellar (Endo)',
  'Patient Preference',
  'training1'
];

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BrushIcon from '@mui/icons-material/Brush';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ErrorBoundary from '../../components/shared/ErrorBoundary';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DentalTreatmentPlan from '../../components/clinical/DentalTreatmentPlan';
import ProcedureRow from '../../components/clinical/ProcedureRow';
import TreatmentPlanEndTable from '../../components/clinical/TreatmentPlanEndTable';
import ReEstimateMenu from '../../components/clinical/ReEstimateMenu';
import AdjustedFeeTreatmentPlan from '../../components/clinical/AdjustedFeeTreatmentPlan';
import EditProcedureFees from '../../components/clinical/EditProcedureFees';
import PredetermineProcedures from '../../components/clinical/PredetermineProcedures';
import UsedFeeGuidesDialog from '../../components/clinical/UsedFeeGuidesDialog';
import ReEstimateCompletedProceduresDialog from '../../components/clinical/ReEstimateCompletedProceduresDialog';
import { fontSize, fontWeight } from "../../constants/styles";

// --- Custom SVG Tooth Icons for Headers ---
const HeaderTooth = ({ variant }) => {
  const colors = {
    plain: "#fff",
    filled: "#f3e5ab",
    sealant: "#4db6ac",
    crown: "#e0e0e0"
  };
  
  return (
    <Box sx={{ 
      width: 22, height: 22, border: '1px solid #999', borderRadius: '4px',
      bgcolor: colors[variant] || '#fff', position: 'relative', overflow: 'hidden'
    }}>
      {variant === 'sealant' && (
        <Box sx={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', border: '2px solid #00796b', borderRadius: '50%' }} />
      )}
      {variant === 'filled' && (
        <Box sx={{ position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%', bgcolor: '#bca67a', borderRadius: '2px' }} />
      )}
    </Box>
  );
};

// --- Custom Tooth/Clinical Icons ---
const EndoToothIcon = ({ filled = false }) => (
  <Box sx={{ 
    width: 28, height: 28, border: '1px solid #ccc', borderRadius: 1, 
    position: 'relative', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', bgcolor: filled ? '#fff' : '#ddd', cursor: 'pointer' 
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
      <path d="M7 3C4 3 3 6 3 9C3 13 5 21 8 21C10 21 11 19 12 19C13 19 14 21 16 21C19 21 21 13 21 9C21 6 20 3 18 3C15 3 13 4 12 5C11 4 9 3 7 3Z" />
      {filled && <circle cx="15" cy="7" r="3" fill="black" />}
    </svg>
  </Box>
);

const PerioToolIcon = ({ color }) => (
  <Box sx={{ width: 4, height: 16, bgcolor: color, borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }} />
);

// --- Improved Tooth Icons based on the new screenshot ---
const RestorationToothIcon = ({ type = "molar", fill = "white", status = "none", sx = {} }) => {
  const isMolar = type === "molar";
  
  return (
    <Box sx={{ 
      width: 32, height: 32, position: 'relative', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...sx 
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24">
        {/* Basic Tooth Shape */}
        <path 
          d={isMolar 
            ? "M6 4C4 4 3 6 3 9C3 13 5 20 8 20C10 20 11 18 12 18C13 18 14 20 16 20C19 20 21 13 21 9C21 6 20 4 18 4H6Z" 
            : "M8 4C6 4 5 6 5 9C5 13 7 20 12 20C17 20 19 13 19 9C19 6 18 4 16 4H8Z"
          } 
          fill={fill} 
          stroke="#555" 
          strokeWidth="1"
        />
        {/* Fill Details for Restorations */}
        {status === 'occlusal' && <path d="M8 8 Q12 11 16 8 Q12 6 8 8" fill="rgba(0,0,0,0.2)" />}
        {status === 'gold' && <path d="M6 5 L18 5 L17 10 L7 10 Z" fill="#FFD700" />}
        {status === 'forbidden' && (
          <g stroke="red" strokeWidth="1.5">
            <circle cx="12" cy="11" r="7" fill="none" />
            <line x1="7" y1="6" x2="17" y2="16" />
          </g>
        )}
      </svg>
    </Box>
  );
};

// --- Custom Clinical Icons for Header ---
const DentureIcon = ({ color }) => (
  <Box sx={{ 
    width: 22, height: 18, bgcolor: color, borderRadius: '10px 10px 2px 2px',
    border: '1px solid rgba(0,0,0,0.2)', position: 'relative',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  }}>
    <Box sx={{ width: '70%', height: '2px', bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
  </Box>
);

const ImplantIcon = () => (
  <Box sx={{ width: 12, height: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ width: 10, height: 4, bgcolor: '#999', borderRadius: '1px' }} />
    <Box sx={{ width: 6, height: 12, bgcolor: '#bbb', mt: '1px', clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }} />
  </Box>
);

// --- Custom Clinical Icons for Header ---
const BridgeIcon = ({ variant }) => (
  <Box sx={{ 
    width: 28, height: 18, position: 'relative', display: 'flex', 
    justifyContent: 'space-between', opacity: variant === 'outline' ? 0.4 : 1 
  }}>
    <Box sx={{ width: 8, height: 12, border: '1px solid #333', borderRadius: '2px', bgcolor: '#fff' }} />
    <Box sx={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '2px', bgcolor: '#333' }} />
    <Box sx={{ width: 8, height: 12, border: '1px solid #333', borderRadius: '2px', bgcolor: '#fff' }} />
  </Box>
);

// --- Surgical Instrument Icons ---
const ScalpelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
    <path d="M12 2L15 5L12 8L9 5L12 2Z" fill="#ccc" />
    <path d="M12 8V22" />
    <path d="M9 12H15" />
  </svg>
);

const HemostatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
    <path d="M7 2C7 2 5 4 5 7C5 10 7 12 7 12V22" />
    <path d="M17 2C17 2 19 4 19 7C19 10 17 12 17 12V22" />
    <circle cx="7" cy="22" r="1.5" fill="#666" />
    <circle cx="17" cy="22" r="1.5" fill="#666" />
    <path d="M7 15C7 15 9 17 12 17C15 17 17 15 17 15" />
  </svg>
);

// --- Custom Clinical Icons for Header ---
const BracesIcon = () => (
  <Box sx={{ 
    width: 24, height: 18, border: '1px solid #999', borderRadius: '3px',
    bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.3
  }}>
    <Box sx={{ width: '100%', height: '2px', bgcolor: '#555', position: 'relative' }}>
      {[2, 8, 14, 20].map((left) => (
        <Box key={left} sx={{ 
          position: 'absolute', top: -3, left, width: 4, height: 8, 
          bgcolor: '#90caf9', border: '1px solid #1976d2', borderRadius: '1px' 
        }} />
      ))}
    </Box>
  </Box>
);

// --- Ortho Procedure Item ---
const OrthoProcedure = ({ code, description }) => (
  <Typography sx={{ fontSize: fontSize.sm, color: '#333', py: 0.2, pl: 2, lineHeight: 1.2 }}>
    <strong>{code}:</strong> {description}
  </Typography>
);

// --- Sub-category Header ---
const OrthoSubHeader = ({ label, expanded = false }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.5, mt: 0.5 }}>
    <Typography sx={{ 
      fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: '#333'
    }}>
      {label}
    </Typography>
    {expanded ? <KeyboardArrowUpIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
  </Stack>
);

// --- Highlighted Sub-Header (No Yellow Background) ---
const HighlightedOrthoSubHeader = ({ label, isExpanded = false }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.6, mt: 0.5 }}>
    <Typography sx={{ 
      fontSize: fontSize.sm, 
      fontWeight: fontWeight.medium, 
      color: '#333'
    }}>
      {label}
    </Typography>
    {isExpanded ? (
      <KeyboardArrowUpIcon sx={{ fontSize: 16, color: '#333' }} />
    ) : (
      <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#333' }} />
    )}
  </Stack>
);

// --- Ortho Code Item Component ---
const OrthoCodeItem = ({ code, label }) => (
  <Typography sx={{ 
    fontSize: fontSize.sm, 
    color: '#333', 
    pl: 3, 
    py: 0.25, 
    lineHeight: 1.2
  }}>
    <strong>{code}:</strong> {label}
  </Typography>
);

// --- Ortho Section Header (No Yellow Highlight) ---
const OrthoSectionHeader = ({ label, isExpanded = false }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.6 }}>
    <Typography sx={{ 
      fontSize: fontSize.sm, 
      fontWeight: fontWeight.medium, 
      color: '#333'
    }}>
      {label}
    </Typography>
    {isExpanded ? (
      <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
    ) : (
      <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
    )}
  </Stack>
);

const GlobalActionBar = ({ 
  onReEstimateOptionClick, 
  onSettingsClick, 
  onPredetermineClick, 
  onViewFeeGuideClick,
  visits = [],
  handleAddVisit,
  selectedProcedureIds = [],
  handleMoveProceduresToVisit,
  onStateClick,
  onDeleteClick,
  onReferClick,
  onDbiClick,
  onPrintClick,
  onCompleteClick
}) => {
  const [reEstimateAnchor, setReEstimateAnchor] = useState(null);
  const [visitAnchorEl, setVisitAnchorEl] = useState(null);
  const [phaseAnchorEl, setPhaseAnchorEl] = useState(null);

  const handleReEstimateClick = (event) => {
    setReEstimateAnchor(event.currentTarget);
  };

  const handleReEstimateClose = () => {
    setReEstimateAnchor(null);
  };

  const handleVisitClick = (event) => {
    setVisitAnchorEl(event.currentTarget);
  };

  const handleVisitClose = () => {
    setVisitAnchorEl(null);
    setPhaseAnchorEl(null);
  };

  const handlePhaseMouseEnter = (event) => {
    setPhaseAnchorEl(event.currentTarget);
  };

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      justifyContent="space-between" 
      sx={{ p: 1, bgcolor: '#f8f9fc', borderBottom: '1px solid #e0e0e0' }}
    >
      {/* Left Button Group */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Button 
          variant="contained" 
          size="small" 
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleVisitClick}
          sx={{ 
            bgcolor: '#2d4571', 
            color: '#fff', 
            textTransform: 'none', 
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#1e3050'
            }
          }}
        >
          Visit
        </Button>

        {/* Primary Visit Dropdown Menu */}
        <Menu
          anchorEl={visitAnchorEl}
          open={Boolean(visitAnchorEl)}
          onClose={handleVisitClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              minWidth: 160,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              py: 0.5,
              mt: 0.5
            }
          }}
        >
          <MenuItem 
            onMouseEnter={handlePhaseMouseEnter}
            onClick={handlePhaseMouseEnter}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: '0.8rem',
              py: 1,
              px: 2,
              color: '#334155',
              '&:hover': {
                bgcolor: '#f1f5f9'
              }
            }}
          >
            <Typography sx={{ fontSize: '0.8rem' }}>Phase 1</Typography>
            <ChevronRightIcon sx={{ fontSize: 16, color: '#64748b' }} />
          </MenuItem>
          <MenuItem 
            onClick={handleVisitClose}
            sx={{ 
              fontSize: '0.8rem', 
              py: 1,
              px: 2,
              color: '#1976d2',
              fontWeight: 'medium',
              '&:hover': {
                bgcolor: '#f0f7ff'
              }
            }}
          >
            +Add New Phase
          </MenuItem>
        </Menu>

        {/* Secondary Phase Dropdown Menu */}
        <Menu
          anchorEl={phaseAnchorEl}
          open={Boolean(phaseAnchorEl)}
          onClose={() => setPhaseAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              minWidth: 160,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              py: 0.5,
              ml: 0.5
            }
          }}
        >
          <MenuItem 
            onClick={handleVisitClose}
            sx={{ 
              fontSize: '0.8rem', 
              py: 1, 
              px: 2, 
              color: '#334155',
              '&:hover': { bgcolor: '#f1f5f9' } 
            }}
          >
            Recare
          </MenuItem>
          {visits.map((v) => (
            <MenuItem 
              key={v.id}
              onClick={() => {
                if (selectedProcedureIds.length > 0) {
                  handleMoveProceduresToVisit(v.id);
                } else {
                  const element = document.getElementById(v.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
                handleVisitClose();
              }}
              sx={{ 
                fontSize: '0.8rem', 
                py: 1, 
                px: 2, 
                color: '#334155',
                '&:hover': { bgcolor: '#f1f5f9' } 
              }}
            >
              {v.label}
            </MenuItem>
          ))}
          <MenuItem 
            onClick={() => {
              if (handleAddVisit) {
                handleAddVisit();
              }
              handleVisitClose();
            }}
            sx={{ 
              fontSize: '0.8rem', 
              py: 1, 
              px: 2, 
              color: '#1976d2', 
              fontWeight: 'medium',
              '&:hover': { bgcolor: '#f0f7ff' } 
            }}
          >
            +Add New Visit
          </MenuItem>
        </Menu>

        <Button 
          variant="contained" 
          size="small" 
          endIcon={<KeyboardArrowDownIcon />}
          onClick={onStateClick}
          sx={{ 
            bgcolor: '#2d4571', 
            color: '#fff', 
            textTransform: 'none', 
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#1e3050'
            }
          }}
        >
          State
        </Button>
        <IconButton 
          size="small" 
          onClick={onDeleteClick}
          sx={{ bgcolor: '#f4c7c3', mx: 1 }}
        >
          <DeleteIcon fontSize="small" sx={{ color: '#d93025' }} />
        </IconButton>
        <Button 
          variant="contained" 
          color="success" 
          size="small"
          onClick={onCompleteClick} 
          sx={{ borderRadius: 20, textTransform: 'none', px: 2, bgcolor: '#b7e1cd', color: '#137333' }}
        >
          Complete
        </Button>
        <Button 
          variant={selectedProcedureIds.length > 0 ? "contained" : "outlined"}
          size="small" 
          onClick={(e) => {
            if (selectedProcedureIds.length > 0) {
              onReferClick(e);
            }
          }}
          sx={{ 
            borderRadius: 20, 
            textTransform: 'none', 
            px: 2, 
            ...(selectedProcedureIds.length > 0 ? {
              bgcolor: '#e0e0e0',
              color: '#424242',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#cbd5e1',
                boxShadow: 'none'
              }
            } : {
              color: '#9e9e9e', 
              borderColor: '#e0e0e0',
              cursor: 'default'
            })
          }}
        >
          Refer To
        </Button>
      </Stack>

      {/* Right Action Group */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Stack direction="row">
          <Button 
            variant="contained" 
            size="small" 
            sx={{ bgcolor: '#1a237e', textTransform: 'none', borderRight: '1px solid #3f51b5', borderRadius: '4px 0 0 4px' }}
            onClick={handleReEstimateClick}
          >
            Re-Estimate
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ bgcolor: '#1a237e', minWidth: 30, borderRadius: '0 4px 4px 0' }}
            onClick={handleReEstimateClick}
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </Button>
        </Stack>
        
        <ReEstimateMenu 
          anchorEl={reEstimateAnchor}
          open={Boolean(reEstimateAnchor)}
          onClose={handleReEstimateClose}
          onOptionClick={onReEstimateOptionClick}
        />
        
        <Chip 
          label="DBI" 
          variant="outlined" 
          size="small" 
          onClick={onDbiClick}
          sx={{ 
            borderRadius: 1, 
            height: 24, 
            bgcolor: selectedProcedureIds.length > 0 ? '#2d4571' : '#a3b1d6', 
            color: selectedProcedureIds.length > 0 ? '#fff' : 'inherit',
            border: 'none',
            cursor: selectedProcedureIds.length > 0 ? 'pointer' : 'default',
            '&:hover': {
              bgcolor: selectedProcedureIds.length > 0 ? '#1e3050' : '#a3b1d6'
            }
          }} 
        />
        
        <IconButton size="small" onClick={onPrintClick}><PrintIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
        <IconButton size="small"><CreditCardIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
        <IconButton size="small" onClick={onSettingsClick}><SettingsIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
        <IconButton size="small" onClick={onPredetermineClick}><SecurityIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
        
        <Button 
          variant="outlined" 
          size="small" 
          sx={{ textTransform: 'none', color: '#1a237e', borderColor: '#1a237e' }}
          onClick={onViewFeeGuideClick}
        >
          View Used Fee Guide
        </Button>
        
        <Button 
          variant="contained" 
          size="small" 
          endIcon={<KeyboardArrowDownIcon />}
          sx={{ bgcolor: '#1a237e', textTransform: 'none' }}
        >
          INS. COVERAGE
        </Button>
      </Stack>
    </Stack>
  );
};

// --- Styled Components for Clinical Badges ---
const ActionBadge = ({ label, color, textColor = "black" }) => (
  <Box sx={{ 
    bgcolor: color, color: textColor, px: 0.6, py: 0.2, 
    fontSize: fontSize.xs, fontWeight: fontWeight.medium, borderRadius: '3px',
    border: '1px solid rgba(0,0,0,0.1)', minWidth: '32px', textAlign: 'center'
  }}>
    {label}
  </Box>
);

const SidebarSection = ({ title, children, expanded: defaultExpanded = false, icons = [], titleSx = {}, disabled = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <Accordion 
      expanded={isExpanded} 
      onChange={(e, expanded) => !disabled && setIsExpanded(expanded)}
      disableGutters 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid #b4bedb',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        '&:before': { display: 'none' } 
      }}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: '#333' }} />} 
        sx={{ minHeight: 40, px: 1.5, '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
      >
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#4a69bd', ...titleSx }}>
          {title}
        </Typography>
        {isExpanded && (
          <Stack direction="row" spacing={0.5} sx={{ mr: 1, alignItems: 'center' }}>
            {icons}
          </Stack>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

// --- Reusable Sidebar Item ---
const SidebarItem = ({ label, disabled = false }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.3, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
    <Typography sx={{ 
      fontSize: fontSize.sm,
    }}>
      {label}
    </Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#999' }} />
  </Stack>
);

// --- Sub-menu Item Component ---
const SidebarSubItem = ({ label, disabled = false }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.4, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto', '&:hover': { opacity: disabled ? 0.5 : 0.7 } }}>
    <Typography sx={{ fontSize: fontSize.sm, color: '#333' }}>{label}</Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#999' }} />
  </Stack>
);

const DiagnosticItem = ({ label, disabled = false }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.4, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
    <Typography sx={{ 
      fontSize: fontSize.sm, 
    }}>
      {label}
    </Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#666' }} />
  </Stack>
);



export default function TreatmentPlanPage() {
  const sessionState = useSelector(state => state.clinicalExamSession.treatmentPlan);
  const dispatch = useDispatch();

  const [showAdjustedFeePlan, setShowAdjustedFeePlan] = useState(false);
  const [showEditFeesModal, setShowEditFeesModal] = useState(false);
  const [showPredetermineModal, setShowPredetermineModal] = useState(false);
  const [showUsedFeeGuideModal, setShowUsedFeeGuideModal] = useState(false);
  const [showReEstimateDialog, setShowReEstimateDialog] = useState(false);
  const [paymentOptionType, setPaymentOptionType] = useState(null);
  const [showGroupingSection, setShowGroupingSection] = useState(false);

  const selectedTeeth = sessionState.selectedTeeth;
  const setSelectedTeeth = (val) => {
    const newVal = typeof val === 'function' ? val(selectedTeeth) : val;
    dispatch({ type: 'clinicalExamSession/setTreatmentPlanSession', payload: { selectedTeeth: newVal } });
  };
  
  const missingTeeth = sessionState.missingTeeth;
  const setMissingTeeth = (val) => {
    const newVal = typeof val === 'function' ? val(missingTeeth) : val;
    dispatch({ type: 'clinicalExamSession/setTreatmentPlanSession', payload: { missingTeeth: newVal } });
  };
  
  const additionalTeeth = sessionState.additionalTeeth || [];
  const setAdditionalTeeth = (val) => {
    const newVal = typeof val === 'function' ? val(additionalTeeth) : val;
    dispatch({ type: 'clinicalExamSession/setTreatmentPlanSession', payload: { additionalTeeth: newVal } });
  };
  
  const uneruptedTeeth = sessionState.uneruptedTeeth || [];
  const setUneruptedTeeth = (val) => {
    const newVal = typeof val === 'function' ? val(uneruptedTeeth) : val;
    dispatch({ type: 'clinicalExamSession/setTreatmentPlanSession', payload: { uneruptedTeeth: newVal } });
  };
  
  const [additionalTeethAnchorEl, setAdditionalTeethAnchorEl] = useState(null);
  const [showSelectToothDialog, setShowSelectToothDialog] = useState(false);
  
  const handleToggleUnerupted = () => {
    if (selectedTeeth.length === 0) return;
    setUneruptedTeeth(prev => {
      const allSelectedAreUnerupted = selectedTeeth.every(t => prev.includes(t));
      if (allSelectedAreUnerupted) {
        return prev.filter(t => !selectedTeeth.includes(t));
      } else {
        return [...new Set([...prev, ...selectedTeeth])];
      }
    });
    setSelectedTeeth([]);
  };
  
  const toothSurfaces = sessionState.toothSurfaces;
  const setToothSurfaces = (val) => {
    const newVal = typeof val === 'function' ? val(toothSurfaces) : val;
    dispatch({ type: 'clinicalExamSession/setTreatmentPlanSession', payload: { toothSurfaces: newVal } });
  };
  
  const activeRestorativeCode = sessionState.activeRestorativeCode;
  const setActiveRestorativeCode = (val) => dispatch({ type: 'clinicalExamSession/setTreatmentPlanSession', payload: { activeRestorativeCode: val } });
  
  const selectedProcedureIds = sessionState.selectedProcedureIds;
  const setSelectedProcedureIds = (val) => {
    const newVal = typeof val === 'function' ? val(selectedProcedureIds) : val;
    dispatch({ type: 'clinicalExamSession/setTreatmentPlanSession', payload: { selectedProcedureIds: newVal } });
  };
  
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState(null);
  const [statusMenuVisitId, setStatusMenuVisitId] = useState(null);
  
  const selectedVisitIds = sessionState.selectedVisitIds;
  const setSelectedVisitIds = (val) => {
    const newVal = typeof val === 'function' ? val(selectedVisitIds) : val;
    dispatch({ type: 'clinicalExamSession/setTreatmentPlanSession', payload: { selectedVisitIds: newVal } });
  };
  
  const [statusMenuProcId, setStatusMenuProcId] = useState(null);
  const [stateMenuAnchorEl, setStateMenuAnchorEl] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [referMenuAnchorEl, setReferMenuAnchorEl] = useState(null);
  const [showReferConfirm, setShowReferConfirm] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState('');
  const [showDbiConfirm, setShowDbiConfirm] = useState(false);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpReason, setFollowUpReason] = useState('');
  const [followUpTargetOptions, setFollowUpTargetOptions] = useState({});

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [showDeletePlanConfirm, setShowDeletePlanConfirm] = useState(false);
  const [printMenuAnchorEl, setPrintMenuAnchorEl] = useState(null);
  const [showPrintPreviewDialog, setShowPrintPreviewDialog] = useState(false);
  const [showPrintNotes, setShowPrintNotes] = useState(false);
  const [printNotesText, setPrintNotesText] = useState('');
  const [paymentOptionSelections, setPaymentOptionSelections] = useState({
    payInAdvance: false,
    payAsYouGo: false,
    paymentPlan: false,
    financing: false
  });

  const parseAmount = (val) => {
    if (typeof val === 'number') return val;
    return Number(String(val).replace(/[^0-9.]/g, '')) || 0;
  };

  const formatAmount = (val) => {
    return '$' + Number(val).toFixed(2);
  };

  const getVisitTotals = (visit) => {
    let ptTotal = 0;
    let insTotal = 0;
    let woTotal = 0;
    let feeTotal = 0;

    visit.procedures.forEach(p => {
      ptTotal += parseAmount(p.patientAmount);
      insTotal += parseAmount(p.insuranceAmount);
      woTotal += parseAmount(p.adjustmentAmount);
      feeTotal += parseAmount(p.fee);
    });

    return {
      pt: formatAmount(ptTotal),
      ins: formatAmount(insTotal),
      wo: formatAmount(woTotal),
      fee: formatAmount(feeTotal)
    };
  };

  const UPPER_TEETH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const LOWER_TEETH = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

  const handleRestorativeCodeSelect = (code) => {
    setActiveRestorativeCode(code);
    
    if (selectedTeeth.length > 0) {
      selectedTeeth.forEach(toothNum => {
        const surfaces = toothSurfaces[toothNum] || [];
        const sortedSurfaces = [...surfaces].sort((a, b) => {
          const order = { 'M': 1, 'O': 2, 'D': 3, 'B': 4, 'L': 5 };
          return (order[a] || 99) - (order[b] || 99);
        });
        const surfaceStr = sortedSurfaces.join('');
        handleAddOrUpdateProcedure(toothNum, surfaceStr, code, false);
      });
      setSelectedTeeth([]);
    }
  };

  const handleToothClick = (num) => {
    setSelectedTeeth(prev => 
      prev.includes(num) ? prev.filter(t => t !== num) : [...prev, num]
    );
    if (activeRestorativeCode) {
      const isNonSurfaceCode = ['D2960', 'D2928', 'D2390', 'Cinsert'].includes(activeRestorativeCode);
      if (isNonSurfaceCode) {
        handleAddOrUpdateProcedure(num, '', activeRestorativeCode, false);
      }
    }
  };

  const handleMaxToggle = () => {
    const allUpperSelected = UPPER_TEETH.every(t => selectedTeeth.includes(t));
    setSelectedTeeth(prev => allUpperSelected ? prev.filter(t => !UPPER_TEETH.includes(t)) : [...new Set([...prev, ...UPPER_TEETH])]);
  };

  const handleManToggle = () => {
    const allLowerSelected = LOWER_TEETH.every(t => selectedTeeth.includes(t));
    setSelectedTeeth(prev => allLowerSelected ? prev.filter(t => !LOWER_TEETH.includes(t)) : [...new Set([...prev, ...LOWER_TEETH])]);
  };

  const handleSurfaceClick = (toothNum, surfaceCode) => {
    if (!activeRestorativeCode) return;
    
    setToothSurfaces(prev => {
      const current = prev[toothNum] || [];
      const updated = current.includes(surfaceCode)
        ? current.filter(s => s !== surfaceCode)
        : [...current, surfaceCode];
      
      const sortedSurfaces = [...updated].sort((a, b) => {
        const order = { 'M': 1, 'O': 2, 'D': 3, 'B': 4, 'L': 5 };
        return (order[a] || 99) - (order[b] || 99);
      });
      const surfaceStr = sortedSurfaces.join('');
      
      handleAddOrUpdateProcedure(toothNum, surfaceStr, activeRestorativeCode, true);
      
      return {
        ...prev,
        [toothNum]: updated
      };
    });
  };

  const handleSidebarSurfaceClick = (surfaceLabel) => {
    if (selectedTeeth.length === 0 || !activeRestorativeCode) return;

    let mappedSurfaces = [];
    if (surfaceLabel === 'MO') mappedSurfaces = ['M', 'O'];
    else if (surfaceLabel === 'DO') mappedSurfaces = ['D', 'O'];
    else if (surfaceLabel === 'MOD') mappedSurfaces = ['M', 'O', 'D'];
    else if (surfaceLabel === 'O/I') mappedSurfaces = ['O'];
    else if (surfaceLabel === 'B/F') mappedSurfaces = ['B'];
    else mappedSurfaces = [surfaceLabel];
    
    selectedTeeth.forEach(toothNum => {
      setToothSurfaces(prev => {
        const current = prev[toothNum] || [];
        const updated = [...new Set([...current, ...mappedSurfaces])];
        
        const sortedSurfaces = [...updated].sort((a, b) => {
          const order = { 'M': 1, 'O': 2, 'D': 3, 'B': 4, 'L': 5 };
          return (order[a] || 99) - (order[b] || 99);
        });
        const surfaceStr = sortedSurfaces.join('');
        
        handleAddOrUpdateProcedure(toothNum, surfaceStr, activeRestorativeCode, true);
        
        return {
          ...prev,
          [toothNum]: updated
        };
      });
    });
  };

  const handleAddOrUpdateProcedure = (toothNum, surfaceStr, code, allowDelete = false) => {
    const codeInfo = RESTORATIVE_CODES_INFO[code] || { name: 'Procedure', fee: '$0.00', treatmentName: 'Procedure' };
    
    setVisits((prev) => {
      let currentVisits = [...prev];
      if (currentVisits.length === 0) {
        currentVisits = [
          {
            id: 'v-1',
            label: 'Visit 1',
            procedures: []
          }
        ];
      }
      
      const targetVisit = currentVisits[currentVisits.length - 1];
      
      // Look for exact code match on the tooth
      let existingProcIdx = targetVisit.procedures.findIndex(
        (p) => p.toothNumber === toothNum && p.code === code
      );
      
      // Look for a placeholder row in the visit (e.g. D0120 / D0000 with a $0.00 fee)
      let isPlaceholderUpdate = false;
      if (existingProcIdx === -1) {
        existingProcIdx = targetVisit.procedures.findIndex(
          (p) => (p.code === 'D0120' || p.code === 'D0000') && 
                 (p.fee === '$0.00' || p.fee === '0.00' || !p.fee)
        );
        if (existingProcIdx >= 0) {
          isPlaceholderUpdate = true;
        }
      }
      
      const todayStr = '07/15/2022';
      
      if (allowDelete && surfaceStr === '' && toothNum !== '' && !isPlaceholderUpdate) {
        const updatedProcs = targetVisit.procedures.filter(
          (p) => !(p.toothNumber === toothNum && p.code === code)
        );
        return currentVisits.map((v) => {
          if (v.id === targetVisit.id) {
            return { ...v, procedures: updatedProcs };
          }
          return v;
        });
      }
      
      if (existingProcIdx >= 0) {
        const updatedProcs = [...targetVisit.procedures];
        if (isPlaceholderUpdate) {
          // Overwrite the placeholder row details in-place
          updatedProcs[existingProcIdx] = {
            ...updatedProcs[existingProcIdx],
            name: codeInfo.treatmentName.toLowerCase(),
            code: code,
            treatmentName: codeInfo.treatmentName,
            toothNumber: toothNum || updatedProcs[existingProcIdx].toothNumber,
            surface: surfaceStr,
            patientAmount: codeInfo.fee,
            fee: codeInfo.fee,
            billedAmount: codeInfo.fee,
            status: 'D'
          };
        } else {
          // Standard surface update
          updatedProcs[existingProcIdx] = {
            ...updatedProcs[existingProcIdx],
            surface: surfaceStr
          };
        }
        
        return currentVisits.map((v) => {
          if (v.id === targetVisit.id) {
            return { ...v, procedures: updatedProcs };
          }
          return v;
        });
      } else {
        // Append a brand new row
        const newId = `${targetVisit.id}-p-${targetVisit.procedures.length + 1}`;
        const newProc = {
          id: newId,
          visitId: targetVisit.id,
          name: codeInfo.treatmentName.toLowerCase(),
          toothNumber: toothNum,
          surface: surfaceStr,
          code: code,
          treatmentName: codeInfo.treatmentName,
          options: code === 'D2740-d' ? 'Porcelain' : '',
          patientAmount: codeInfo.fee,
          insuranceAmount: '$0.00',
          adjustmentPercent: '0%',
          adjustmentAmount: '$0.00',
          fee: codeInfo.fee,
          billedAmount: codeInfo.fee,
          providerInitials: 'BAL',
          status: 'D',
          date: todayStr
        };
        
        return currentVisits.map((v) => {
          if (v.id === targetVisit.id) {
            return {
              ...v,
              procedures: [...v.procedures, newProc]
            };
          }
          return v;
        });
      }
    });
  };

  const handleReEstimateOptionClick = (option) => {
    if (option === 'Adjusted Fee Treatment Plan') {
      setPaymentOptionType(null);
      setShowGroupingSection(false);
      setShowAdjustedFeePlan(true);
    } else if (option === '15% Friends + Family') {
      setPaymentOptionType('15_percent');
      setShowGroupingSection(false);
      setShowAdjustedFeePlan(true);
    } else if (option === 'No Grouping') {
      setPaymentOptionType('no_grouping');
      setShowGroupingSection(false);
      setShowAdjustedFeePlan(true);
    } else if (option === 'Grouped By Tooth/Area') {
      setPaymentOptionType('no_grouping');
      setShowGroupingSection(true);
      setShowAdjustedFeePlan(true);
    } else if (option === 'Grouped By Code - Non-Contracted Ins') {
      setPaymentOptionType('no_grouping');
      setShowGroupingSection(false);
      setShowAdjustedFeePlan(true);
    } else if (option === 'Without Insurance Estimates - Itemized') {
      setPaymentOptionType('no_grouping');
      setShowGroupingSection(false);
      setShowAdjustedFeePlan(true);
    } else if (option === 'Grouped By Code - Contracted Ins') {
      setPaymentOptionType('no_grouping');
      setShowGroupingSection(false);
      setShowAdjustedFeePlan(true);
    } else if (option === 'With Insurance Estimates Itemized') {
      setPaymentOptionType('no_grouping');
      setShowGroupingSection(false);
      setShowAdjustedFeePlan(true);
    }
  };

  const handleMoveProceduresToVisit = (targetVisitId) => {
    if (selectedProcedureIds.length === 0) return;
    
    setVisits(prev => {
      const proceduresToMove = [];
      const updatedVisits = prev.map(visit => {
        const remainingProcedures = visit.procedures.filter(p => {
          if (selectedProcedureIds.includes(p.id)) {
            proceduresToMove.push({
              ...p,
              visitId: targetVisitId
            });
            return false;
          }
          return true;
        });
        return {
          ...visit,
          procedures: remainingProcedures
        };
      });

      return updatedVisits.map(visit => {
        if (visit.id === targetVisitId) {
          const updatedProcs = [...visit.procedures];
          proceduresToMove.forEach(p => {
            const newId = `${targetVisitId}-p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            updatedProcs.push({
              ...p,
              id: newId
            });
          });
          return {
            ...visit,
            procedures: updatedProcs
          };
        }
        return visit;
      });
    });

    setSelectedProcedureIds([]);
  };

  const handleApplyStatus = (newStatus, options = {}) => {
    if (newStatus === '!') {
      setFollowUpTargetOptions(options);
      setFollowUpReason('');
      const today = new Date();
      const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
      setFollowUpDate(todayStr);
      setShowFollowUpDialog(true);
      setStatusMenuAnchorEl(null);
      setStatusMenuVisitId(null);
      setStatusMenuProcId(null);
      setStateMenuAnchorEl(null);
      return;
    }

    setVisits(prev => 
      prev.map(v => {
        let proceduresChanged = false;
        const updatedProcs = v.procedures.map(p => {
          if (options.procId && p.id === options.procId) {
            proceduresChanged = true;
            return { ...p, status: newStatus };
          }
          if (options.visitId && v.id === options.visitId) {
            proceduresChanged = true;
            return { ...p, status: newStatus };
          }
          if (options.batch && selectedProcedureIds.includes(p.id)) {
            proceduresChanged = true;
            return { ...p, status: newStatus };
          }
          return p;
        });

        let nextVisitStatus = v.status;
        if (options.visitId && v.id === options.visitId) {
          nextVisitStatus = newStatus;
        } else if (proceduresChanged) {
          const firstStatus = updatedProcs[0]?.status || 'D';
          const allSame = updatedProcs.every(p => p.status === firstStatus);
          if (allSame) {
            nextVisitStatus = firstStatus;
          }
        }

        return {
          ...v,
          status: nextVisitStatus,
          procedures: updatedProcs
        };
      })
    );

    setStatusMenuAnchorEl(null);
    setStatusMenuVisitId(null);
    setStatusMenuProcId(null);
    setStateMenuAnchorEl(null);
  };

  const handleSaveFollowUp = () => {
    const options = followUpTargetOptions;
    setVisits(prev => 
      prev.map(v => {
        let proceduresChanged = false;
        const updatedProcs = v.procedures.map(p => {
          const matches = 
            (options.procId && p.id === options.procId) ||
            (options.visitId && v.id === options.visitId) ||
            (options.batch && selectedProcedureIds.includes(p.id));
          
          if (matches) {
            proceduresChanged = true;
            return { 
              ...p, 
              status: '!', 
              followUpDate: followUpDate, 
              followUpReason: followUpReason 
            };
          }
          return p;
        });

        let nextVisitStatus = v.status;
        if (options.visitId && v.id === options.visitId) {
          nextVisitStatus = '!';
        } else if (proceduresChanged) {
          const firstStatus = updatedProcs[0]?.status || 'D';
          const allSame = updatedProcs.every(p => p.status === firstStatus);
          if (allSame) {
            nextVisitStatus = firstStatus;
          }
        }

        return {
          ...v,
          status: nextVisitStatus,
          procedures: updatedProcs
        };
      })
    );

    setSelectedProcedureIds([]);
    setSelectedVisitIds([]);
    setShowFollowUpDialog(false);
  };

  const handleConfirmDbi = () => {
    setVisits(prev => 
      prev.map(v => ({
        ...v,
        procedures: v.procedures.map(p => {
          if (selectedProcedureIds.includes(p.id)) {
            return {
              ...p,
              dbi: true
            };
          }
          return p;
        })
      }))
    );
    setSelectedProcedureIds([]);
    setSelectedVisitIds([]);
    setShowDbiConfirm(false);
  };

  const handleStatusBadgeClick = (event, visitId) => {
    setStatusMenuAnchorEl(event.currentTarget);
    setStatusMenuVisitId(visitId);
    setStatusMenuProcId(null);
  };

  const handleProcStatusBadgeClick = (event, procId) => {
    setStatusMenuAnchorEl(event.currentTarget);
    setStatusMenuProcId(procId);
    setStatusMenuVisitId(null);
  };

  const handleDeleteSelected = () => {
    setVisits(prev => {
      const filteredVisits = prev.filter(v => !selectedVisitIds.includes(v.id));
      return filteredVisits.map(v => ({
        ...v,
        procedures: v.procedures.filter(p => !selectedProcedureIds.includes(p.id))
      }));
    });

    setSelectedProcedureIds([]);
    setSelectedVisitIds([]);
    setShowDeleteConfirm(false);
  };

  const handleConfirmRefer = () => {
    setVisits(prev => 
      prev.map(v => ({
        ...v,
        procedures: v.procedures.map(p => {
          if (selectedProcedureIds.includes(p.id)) {
            return {
              ...p,
              referredTo: selectedDentist,
              status: 'P'
            };
          }
          return p;
        })
      }))
    );
    setSelectedProcedureIds([]);
    setSelectedVisitIds([]);
    setShowReferConfirm(false);
  };

  const handleCompleteSelected = () => {
    setVisits(prev => {
      const proceduresToComplete = new Set(selectedProcedureIds);
      if (selectedVisitIds.length > 0) {
        prev.forEach(v => {
          if (selectedVisitIds.includes(v.id)) {
            v.procedures.forEach(p => proceduresToComplete.add(p.id));
          }
        });
      }
      
      if (proceduresToComplete.size === 0) return prev;

      return prev.map(v => ({
        ...v,
        procedures: v.procedures.map(p => {
          if (proceduresToComplete.has(p.id)) {
            return { ...p, status: 'EO' };
          }
          return p;
        })
      }));
    });

    setSelectedProcedureIds([]);
    setSelectedVisitIds([]);
  };
  const activePlanId = sessionState.activePlanId;
  const setActivePlanId = (val) => dispatch({ type: 'clinicalExamSession/setTreatmentPlanSession', payload: { activePlanId: val } });

  const patientId = useSelector(selectSelectedPatientId) || "1";
  const { data: tpData, isLoading } = useTreatmentPlansQuery(patientId);
  const createMutation = useCreateTreatmentPlan(patientId);
  const updateMutation = useUpdateTreatmentPlan(patientId);
  const deleteMutation = useDeleteTreatmentPlan(patientId);

  const plans = tpData?.data?.treatmentPlans || [];
  const activePlan = (activePlanId ? plans.find(p => p._id === activePlanId) : plans[0]) || plans[0];

  // Auto-select the first plan when plans load, or after deletion
  useEffect(() => {
    if (plans.length > 0 && (!activePlanId || !plans.find(p => p._id === activePlanId))) {
      setActivePlanId(plans[0]._id);
    }
  }, [plans, activePlanId]);

  const [visits, rawSetVisits] = useState(() => [
    {
      id: 'v-1',
      label: 'Visit 1',
      procedures: []
    }
  ]);

  const setVisits = (updater) => {
    rawSetVisits(updater);
  };

  const isServerUpdate = React.useRef(false);
  const hasInitialized = React.useRef(false);

  useEffect(() => {
    if (activePlan?.items && Array.isArray(activePlan.items) && activePlan.items.length > 0) {
      isServerUpdate.current = true;
      rawSetVisits(activePlan.items);
      hasInitialized.current = true;
      // Reset after a short delay to allow the state update to propagate
      setTimeout(() => {
        isServerUpdate.current = false;
      }, 50);
    } else if (activePlan) {
        hasInitialized.current = true;
    }
    setPrintNotesText(activePlan?.notes || '');
  }, [activePlan]);

  useEffect(() => {
    if (!isServerUpdate.current && hasInitialized.current && activePlan?._id) {
      // Avoid firing on initial empty load if it hasn't been set by server yet
      updateMutation.mutate({
        id: activePlan._id,
        data: {
          items: visits
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visits]);

  useEffect(() => {
    if (tpData && plans.length === 0) {
      createMutation.mutate({
        patientId: patientId.toString(),
        title: 'Phase 1 Restorative Plan',
        status: 'active',
        totalAmount: 0,
        items: [
          {
            id: 'v-1',
            label: 'Visit 1',
            procedures: []
          }
        ]
      });
    }
  }, [tpData, plans.length, patientId]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <ClinicalNavbar />
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', bgcolor: '#fff' }}>
          <Typography sx={{ fontSize: '1.2rem', color: '#6b7cb4', fontWeight: 'bold' }}>
            Loading Treatment Plan...
          </Typography>
        </Box>
      </Box>
    );
  }

  const totalProcedures = visits.reduce((sum, v) => sum + (v.procedures?.length || 0), 0);

  const handleAddProcedure = (parentProcedureOrMeta) => {
    setVisits((prev) => {
      const explicitVisitId = parentProcedureOrMeta?.visitId;
      const visitIdFromId =
        typeof parentProcedureOrMeta?.id === 'string' && parentProcedureOrMeta.id.startsWith('v-')
          ? parentProcedureOrMeta.id
          : undefined;

      const targetVisitId = explicitVisitId || visitIdFromId || prev?.[prev.length - 1]?.id;
      const fallbackBase = prev?.[0]?.procedures?.[0];

      return prev.map((v) => {
        if (v.id !== targetVisitId) return v;
        const nextIndex = v.procedures.length + 1;
        const nextId = `${v.id}-p-${nextIndex}`;
        const base =
          (parentProcedureOrMeta && parentProcedureOrMeta.code ? parentProcedureOrMeta : null) ||
          v.procedures[v.procedures.length - 1] ||
          fallbackBase ||
          {};

        return {
          ...v,
          procedures: [
            ...v.procedures,
            {
              ...base,
              id: nextId,
              visitId: v.id,
              name: base?.name ?? 'New procedure',
              code: base?.code ?? 'D0000',
              treatmentName: base?.treatmentName ?? 'Procedure',
              date: base?.date ?? ''
            }
          ]
        };
      });
    });
  };

  const handleAddVisit = () => {
    setVisits((prev) => {
      const nextIdx = prev.length + 1;
      const newVisitId = `v-${nextIdx}`;
      return [
        ...prev,
        {
          id: newVisitId,
          label: `Visit ${nextIdx}`,
          procedures: []
        }
      ];
    });
  };

  const handleCreatePlan = () => {
    const nextNum = plans.length + 1;
    createMutation.mutate({
      patientId: patientId.toString(),
      title: `TP ${nextNum}`,
      status: 'active',
      totalAmount: 0,
      items: [
        {
          id: 'v-1',
          label: 'Visit 1',
          procedures: []
        }
      ]
    }, {
      onSuccess: (response) => {
        const newId = response?.data?._id || response?._id;
        if (newId) {
          setActivePlanId(newId);
        }
      }
    });
  };

  const handleRenamePlan = () => {
    if (!activePlan?._id || !renameValue.trim()) return;
    updateMutation.mutate({
      id: activePlan._id,
      data: { title: renameValue.trim() }
    });
    setShowRenameDialog(false);
  };

  const handleDeletePlan = () => {
    if (!activePlan?._id) return;
    const deletingId = activePlan._id;
    const remaining = plans.filter(p => p._id !== deletingId);
    if (remaining.length > 0) {
      setActivePlanId(remaining[0]._id);
    } else {
      setActivePlanId(null);
    }
    deleteMutation.mutate(deletingId);
    setShowDeletePlanConfirm(false);
  };

  const handleSwitchPlan = (planId) => {
    if (planId === activePlanId) return;
    setActivePlanId(planId);
    const targetPlan = plans.find(p => p._id === planId);
    if (targetPlan?.items && Array.isArray(targetPlan.items) && targetPlan.items.length > 0) {
      rawSetVisits(targetPlan.items);
    } else {
      rawSetVisits([{ id: 'v-1', label: 'Visit 1', procedures: [] }]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ClinicalNavbar />
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Treatment Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Comprehensive treatment plans and procedures
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#fff', fontFamily: "'Manrope', 'Segoe UI', sans-serif", mb: 2, minHeight: 'calc(100vh - 200px)' }}>
        
        {/* Scrollable Content Wrapper */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          {/* Top Toolbar */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, mb: 1, px: 2 }}>
            {/* Dynamic Plan Tabs */}
            {plans.map((plan, idx) => {
              const isActive = plan._id === activePlan?._id;
              return (
                <Chip
                  key={plan._id}
                  label={plan.title || `TP ${idx + 1}`}
                  size="small"
                  icon={isActive ? <EditIcon sx={{ fontSize: '0.85rem !important', color: '#fff !important' }} /> : undefined}
                  onClick={() => handleSwitchPlan(plan._id)}
                  sx={{
                    bgcolor: isActive ? '#5c6bc0' : '#e8eaf6',
                    color: isActive ? '#fff' : '#3f51b5',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: isActive ? '#4a5ab5' : '#c5cae9'
                    }
                  }}
                />
              );
            })}
            {/* + TP Button */}
            <Chip
              label="+ TP"
              variant="outlined"
              size="small"
              onClick={handleCreatePlan}
              disabled={createMutation.isPending}
              sx={{
                borderStyle: 'dashed',
                color: '#fbc02d',
                borderColor: '#fbc02d',
                cursor: 'pointer',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#fff8e1',
                  borderColor: '#f9a825'
                }
              }}
            />
            {/* Edit (Rename) */}
            <IconButton
              size="small"
              onClick={() => {
                setRenameValue(activePlan?.title || '');
                setShowRenameDialog(true);
              }}
              disabled={!activePlan}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            {/* Delete */}
            <IconButton
              size="small"
              color="error"
              onClick={() => setShowDeletePlanConfirm(true)}
              disabled={!activePlan}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={(e) => setPrintMenuAnchorEl(e.currentTarget)}>
              <PrintIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={printMenuAnchorEl}
              open={Boolean(printMenuAnchorEl)}
              onClose={() => setPrintMenuAnchorEl(null)}
              PaperProps={{
                sx: {
                  minWidth: 150,
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: '6px'
                }
              }}
            >
              <MenuItem onClick={() => {
                setPrintMenuAnchorEl(null);
                setShowPrintPreviewDialog(true);
              }}>
                <Typography sx={{ fontSize: '0.85rem' }}>Print Treatment Plan</Typography>
              </MenuItem>
              <MenuItem onClick={() => setPrintMenuAnchorEl(null)}>
                <Typography sx={{ fontSize: '0.85rem' }}>Email Treatment Plan</Typography>
              </MenuItem>
            </Menu>
            <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleAddProcedure({ visitId: visits[visits.length - 1]?.id })}
              sx={{ textTransform: 'none' }}
            >
              Add Procedure
            </Button>
            <Button variant="outlined" size="small" endIcon={<ExpandMoreIcon />}>Phase 1</Button>
            <Chip label="#15 c..." color="primary" size="small" sx={{ bgcolor: '#3f51b5' }} />
          </Stack>

          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'space-between' }}>
            {/* Left Column - Sidebar (30% Width) */}
            <Box sx={{ width: '30%', flex: '0 0 30%' }}>
              <Box sx={{ width: '100%', bgcolor: "#fff", p: 0, height: 'calc(100vh - 250px)', overflowY: "auto", border: "1px solid #ccc" }}>
              
              {/* Top Filter Bar */}
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', p: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontSize: fontSize.xs, color: '#666', fontWeight: fontWeight.medium }}>Power Codes | Resolve</Typography>
                <Box sx={{ flexGrow: 1 }} />
              </Stack>

              <SidebarSection 
                title="No Charge" 
                disabled
                icons={[
                  <Box key="1" sx={{ position: 'relative', width: 22, height: 22, borderRadius: '50%', border: '2px solid #f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}>$</Typography>
                    <Box sx={{ position: 'absolute', width: '100%', height: '2px', bgcolor: '#f44336', transform: 'rotate(-45deg)' }} />
                  </Box>,
                  <Box key="2" sx={{ position: 'relative', width: 22, height: 22, borderRadius: '50%', border: '2px solid #ffb300', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold', color: '#000' }}>$</Typography>
                    <Box sx={{ position: 'absolute', width: '100%', height: '2px', bgcolor: '#ffb300', transform: 'rotate(-45deg)' }} />
                  </Box>,
                  <Box key="3" sx={{ position: 'relative', width: 22, height: 22 }}>
                    <Box component="img" src="/white_teeth.png" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    <Box sx={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', border: '1px solid red', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>$</Typography>
                      <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'red', transform: 'rotate(-45deg)' }} />
                    </Box>
                  </Box>,
                  <Box key="4" sx={{ position: 'relative', px: 0.5, py: 0.2, bgcolor: '#ffcdd2', border: '1px solid #ef9a9a', borderRadius: '4px' }}>
                    <Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: '#000' }}>P-OP</Typography>
                    <Box sx={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: '50%', border: '1px solid red', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '7px', fontWeight: 'bold' }}>$</Typography>
                      <Box sx={{ position: 'absolute', width: '100%', height: '1px', bgcolor: 'red', transform: 'rotate(-45deg)' }} />
                    </Box>
                  </Box>,
                  <BracesIcon key="5" />
                ]}
              >
                <Typography sx={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                  No charge items will appear here.
                </Typography>
              </SidebarSection>
           
          {/* 1. Power Codes */}
          <SidebarSection title="Power Codes" disabled>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
              <ActionBadge label="New" color="#40e0d0" />
              <ActionBadge label="Kid" color="#ccff00" />
              <ActionBadge label="SRP" color="#9370db" />
              <ActionBadge label="Gin" color="#f08080" />
              <ActionBadge label="DEP" color="#90ee90" />
              <ActionBadge label="CBC" color="#f5f5f5" />
            </Stack>
          </SidebarSection>

          {/* 2. Diagnostic (Expanded with Yellow Highlights) */}
          <SidebarSection title="Diagnostic" disabled>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              <ActionBadge label="Scr" color="#f08080" />
              <ActionBadge label="FULL" color="#e6e6fa" />
              <ActionBadge label="LTD" color="#ffc0cb" />
              <ActionBadge label="RCR" color="#afeeee" />
              <ActionBadge label="Pano" color="#696969" textColor="white" />
              <ActionBadge label="FMX" color="#333" textColor="white" />
              <ActionBadge label="Xray" color="#333" textColor="white" />
              <ActionBadge label="AdX" color="#696969" textColor="white" />
              <ActionBadge label="SCN" color="#40e0d0" />
              <ActionBadge label="Con" color="#afeeee" />
              <ActionBadge label="Vir" color="#00ced1" />
            </Stack>

            <Box sx={{ mt: 1 }}>
              <DiagnosticItem label="Oral evaluation" />
              <DiagnosticItem label="Diagnostic imaging" />
              <DiagnosticItem label="Additional imaging" />
              <DiagnosticItem label="CBCT" />
              <DiagnosticItem label="Diagnostic Tests" />
              <DiagnosticItem label="Oral pathology" />
              <DiagnosticItem label="Tests" />
              <DiagnosticItem label="Caries assessment" />
              <DiagnosticItem label="$$" />
              <DiagnosticItem label="Diagnostic Mock-Up" />
              <DiagnosticItem label="redo prev tx" />
              <DiagnosticItem label="Diagnostic" />
            </Box>
          </SidebarSection>

          {/* 3. Preventative */}
          <SidebarSection 
            title="Preventative" 
            disabled
            icons={[
              <Box key="1" sx={{ bgcolor: '#008080', color: 'white', px: 0.5, py: 0.2, fontSize: fontSize.xs, fontWeight: fontWeight.bold, borderRadius: '3px' }}>PRV</Box>
            ]}
          >
            <SidebarItem label="Prophy" />
            <SidebarItem label="Fluoride" />
            <SidebarItem label="Preventative services" />
            <SidebarItem label="Space maintenance" />
            <SidebarItem label="vaccine administration" />
          </SidebarSection>

          {/* 4. Restorative */}
          <SidebarSection 
            title="Restorative" 
            expanded
            icons={[
              <Box key="d23" sx={{ bgcolor: '#0020dd', color: '#fff', px: 0.8, py: 0.2, fontSize: '0.65rem', fontWeight: 'bold', borderRadius: '2px', mr: 0.5 }}>D23</Box>
            ]}
          >
            {/* Top row of design icons */}
            <Box sx={{ py: 1, borderBottom: '1px solid #f0f0f0', mb: 1 }}>
              <Stack direction="row" spacing={0.6} sx={{ mb: 0.6, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ bgcolor: '#0020dd', color: 'white', px: 0.6, py: 0.2, fontSize: '10px', fontWeight: 'bold', borderRadius: '2px', display: 'flex', alignItems: 'center', height: 22 }}>D23</Box>
                <RestorationToothIcon fill="#fff" />
                <RestorationToothIcon fill="#777" />
                <RestorationToothIcon fill="#ffd700" />
                <RestorationToothIcon fill="#eee" />
                <RestorationToothIcon fill="#fff" />
                <RestorationToothIcon fill="#ffd700" />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #777', borderRadius: '2px', px: 0.3, py: 0.1, fontSize: '8px', fontWeight: 'bold', height: 22, bgcolor: '#fff' }}>CAD</Box>
              </Stack>
              <Stack direction="row" spacing={0.6} sx={{ pl: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                <RestorationToothIcon type="incisor" fill="#fff" />
                <RestorationToothIcon fill="#fff" />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #777', borderRadius: '2px', px: 0.3, py: 0.1, fontSize: '8px', fontWeight: 'bold', height: 22, bgcolor: '#fff' }}>CAD</Box>
                <RestorationToothIcon fill="#ddd" />
                <RestorationToothIcon status="occlusal" fill="#add8e6" />
                <Box sx={{ width: 28, height: 28, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M6 4C4 4 3 6 3 9C3 13 5 20 8 20C10 20 11 18 12 18C13 18 14 20 16 20C19 20 21 13 21 9C21 6 20 4 18 4H6Z" fill="#fff" stroke="#555" strokeWidth="1"/>
                    <line x1="12" y1="2" x2="12" y2="10" stroke="#777" strokeWidth="2" />
                    <line x1="10" y1="10" x2="14" y2="10" stroke="#777" strokeWidth="1" />
                  </svg>
                </Box>
              </Stack>
            </Box>

            {/* Direct Accordion */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ border: 'none', '&:before': { display: 'none' } }}>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
                sx={{ 
                  minHeight: 28, 
                  py: 0, 
                  px: 0,
                  '& .MuiAccordionSummary-content': { my: 0, alignItems: 'center' } 
                }}
              >
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#333' }}>
                  Direct
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, pt: 0.5 }}>
                <Stack spacing={0.3}>
                  {Object.entries(RESTORATIVE_CODES_INFO).map(([code, info]) => {
                    const isSel = activeRestorativeCode === code;
                    return (
                      <Box
                        key={code}
                        onClick={() => handleRestorativeCodeSelect(code)}
                        sx={{
                          py: 0.4,
                          px: 1,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: isSel ? '#0020dd' : 'transparent',
                          color: isSel ? '#fff' : '#333',
                          transition: 'all 0.15s',
                          '&:hover': {
                            bgcolor: isSel ? '#0020dd' : '#f0f4f9',
                            color: isSel ? '#fff' : '#0020dd'
                          }
                        }}
                      >
                        <strong>{code}:</strong> &nbsp; {info.name}
                      </Box>
                    );
                  })}
                </Stack>
              </AccordionDetails>
            </Accordion>

            <SidebarItem label="Indirect Adhesive" disabled />
            <SidebarItem label="Indirect" disabled />
            <SidebarItem label="Indirect Cohesive" disabled />
            <SidebarItem label="Recement/Repair" disabled />
            <SidebarItem label="Pediatric" disabled />
            <SidebarItem label="Additional restorative" disabled />
            <SidebarItem label="BU/P&C" disabled />
            <SidebarItem label="Restorative" disabled />
            <SidebarItem label="Per arch" disabled />
            <SidebarItem label="Clip - stationary" disabled />
          </SidebarSection>

          {/* 5. Endodontics */}
          <SidebarSection 
            title="Endodontics" 
            disabled
            icons={[
              <EndoToothIcon key="1" filled />,
              <EndoToothIcon key="2" />
            ]}
          >
            <SidebarSubItem label="Pulp capping" />
            <SidebarSubItem label="Pulpotomy" />
            <SidebarSubItem label="Root Canal" />
            <SidebarSubItem label="Apexification/recalcification" />
            <SidebarSubItem label="Pulpal Regeneration" />
            <SidebarSubItem label="Apicoectomy/Periradicular" />
            <SidebarSubItem label="Additional endo" />
            <SidebarSubItem label="Apicoectomy/Periradicular Services" />
          </SidebarSection>

          {/* 6. Periodontics */}
          <SidebarSection 
            title="Periodontics" 
            disabled
            icons={[
              <Box key="1" sx={{ bgcolor: '#f08080', color: 'white', px: 0.6, py: 0.2, fontSize: fontSize.xs, fontWeight: fontWeight.bold, borderRadius: '3px' }}>LBR</Box>
            ]}
          >
            <SidebarSubItem label="Crown Exposure" />
            <SidebarSubItem label="Pocket Reduction" />
            <SidebarSubItem label="Gingival Flap Procedure" />
            <SidebarSubItem label="Periodontal Regeneration" />
            <SidebarSubItem label="Membrane Placement" />
            <SidebarSubItem label="Surgical" />
            <SidebarSubItem label="Gingival Grafting" />
            <SidebarSubItem label="Hygiene" />
            <SidebarSubItem label="Adjunctive" />
            <SidebarSubItem label="Additional perio" />
            <SidebarSubItem label="Splinting" />
          </SidebarSection>

          {/* 7. Prosthodontics, Removable */}
          <SidebarSection 
            title="Prosthodontics, Removable" 
            disabled
            icons={[
              <DentureIcon key="1" color="#9c27b0" />,
              <DentureIcon key="2" color="#ef9a9a" />
            ]}
          >
            <SidebarSubItem label="Complete Denture" />
            <SidebarSubItem label="RPD" />
            <SidebarSubItem label="Denture adjustment" />
            <SidebarSubItem label="Denture repair" />
            <SidebarSubItem label="Denture rebase" />
            <SidebarSubItem label="Denture reline" />
            <SidebarSubItem label="Additional removable denture" />
            <SidebarSubItem label="Precision Attachment" />
            <SidebarSubItem label="CD" />
            <SidebarSubItem label="Duplication of Complete Denture" />
            <SidebarSubItem label="Maxillary Guidance Prosthesis" />
          </SidebarSection>

          {/* 8. Implant Services */}
          <SidebarSection 
            title="Implant Services" 
            disabled
            icons={[<ImplantIcon key="1" />]}
          >
            <SidebarSubItem label="Surgical Placement" />
            <SidebarSubItem label="Re-entry/Uncovery" />
            <SidebarSubItem label="Abutment" />
            <SidebarSubItem label="Implant removable prosthetics" />
            <SidebarSubItem label="Implant-Restorative" />
            <SidebarSubItem label="Implant fixed prosthetics" />
            <SidebarSubItem label="Implant maintenance" />
            <SidebarSubItem label="Surgical services" />
            <SidebarSubItem label="Peri-implantitis Treatment" />
            <SidebarSubItem label="Bone Graft" />
          </SidebarSection>

          {/* 9. Prosthodontics, Fixed */}
          <SidebarSection 
            title="Prosthodontics, Fixed" 
            disabled
            icons={[
              <RestorationToothIcon key="1" fill="#fff" />,
              <RestorationToothIcon key="2" fill="#ffd700" />,
              <RestorationToothIcon key="3" fill="#eee" />
            ]}
          >
            <SidebarSubItem label="Fixed Bridge" />
            <SidebarSubItem label="Inlay/Onlay FPD" />
            <SidebarSubItem label="Additional FPD" />
            <SidebarSubItem label="FPD repair" />
          </SidebarSection>

          {/* 10. Oral Surgery */}
          <SidebarSection 
            title="Oral Surgery" 
            disabled
            icons={[
              <ScalpelIcon key="1" />,
              <HemostatIcon key="2" />
            ]}
          >
            <SidebarSubItem label="Extraction" />
            <SidebarSubItem label="Other" />
            <SidebarSubItem label="corticotomy" />
            <SidebarSubItem label="Alveoloplasty" />
            <SidebarSubItem label="Vestibuloplasty" />
            <SidebarSubItem label="Excision of soft tissue lesion" />
            <SidebarSubItem label="Bony tumor excision" />
            <SidebarSubItem label="Excision of bone tissue" />
            <SidebarSubItem label="Incision and drain" />
            <SidebarSubItem label="TMJ surgeries" />
            <SidebarSubItem label="Site Preparation" />
            <SidebarSubItem label="Frenulectomy" />
            <SidebarSubItem label="Marsupialization" />
            <SidebarSubItem label="GTR" />
          </SidebarSection>

          {/* 11. Orthodontics */}
          <Accordion expanded={false} disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb', opacity: 0.5, pointerEvents: 'none' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
              sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
                Orthodontics
              </Typography>
              <Stack direction="row" spacing={0.8} sx={{ mr: 1 }}>
                <Box sx={{ 
                  bgcolor: '#c8e6c9', color: '#2e7d32', px: 0.6, py: 0.2, 
                  fontSize: fontSize.xs, fontWeight: fontWeight.bold, borderRadius: '3px', border: '1px solid #a5d6a7' 
                }}>
                  DEP
                </Box>
                <BracesIcon />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
              {/* Limited Ortho Section */}
              <OrthoSubHeader label="Limited ortho" expanded />
              <Stack spacing={0.5} sx={{ mb: 1 }}>
                <OrthoProcedure code="D8010" description="limited orthodontic treatment of the primary dentition" />
                <OrthoProcedure code="D8020" description="limited orthodontic treatment of the transitional dentition" />
                <OrthoProcedure code="D8030" description="limited orthodontic treatment of the adolescent dentition" />
                <OrthoProcedure code="D8040" description="limited orthodontic treatment of the adult dentition" />
              </Stack>

              {/* Interceptive Ortho Section */}
              <OrthoSubHeader label="Interceptive Ortho" expanded />
              <Stack spacing={0.5} sx={{ mb: 1 }}>
                <OrthoProcedure code="D8050" description="interceptive orthodontic treatment of the primary dentition" />
                <OrthoProcedure code="D8060" description="interceptive orthodontic treatment of the transitional dentition" />
              </Stack>

              {/* Comprehensive Ortho Section (Expanded with Yellow Highlight) */}
              <HighlightedOrthoSubHeader label="Comprehensive Ortho" isExpanded={true} />
              <Stack spacing={0.4} sx={{ mb: 1.5 }}>
                <OrthoProcedure code="D8070" description="comprehensive orthodontic treatment of the transitional dentition" />
                <OrthoProcedure code="D8080" description="comprehensive orthodontic treatment of the adolescent dentition" />
                <OrthoProcedure code="D8090" description="comprehensive orthodontic treatment of the adult dentition" />
                <OrthoProcedure code="D8091" description="Comprehensive orthodontic treatment with orthognathic surgery" />
              </Stack>

              {/* Appliances Section (Expanded with Yellow Highlight) */}
              <HighlightedOrthoSubHeader label="Appliances" isExpanded={true} />
              <Stack spacing={0.4} sx={{ mb: 1.5 }}>
                <OrthoProcedure code="D8210" description="removable appliance therapy" />
                <OrthoProcedure code="D8220" description="fixed appliance therapy" />
                <OrthoProcedure code="D8680" description="orthodontic retention (removal of appliances, construction and placement of retainer(s))" />
                <OrthoProcedure code="Cd8999.1" description="Delivery of ortho appliance, typically retainer" />
              </Stack>

              {/* Other ortho (Collapsed) */}
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.6 }}>
                <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.medium, color: '#333' }}>Other ortho</Typography>
                <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#999' }} />
              </Stack>

              {/* Ortho repair (Expanded) */}
              <OrthoSectionHeader label="Ortho repair" isExpanded={true} />
              <Box sx={{ mb: 1.5 }}>
                <OrthoCodeItem code="D8695" label="removal of fixed orthodontic appliances for reasons other than completion of treatment" />
                <OrthoCodeItem code="D8696" label="repair of orthodontic appliance - maxillary" />
                <OrthoCodeItem code="D8697" label="repair of orthodontic appliance - mandibular" />
                <OrthoCodeItem code="D8698" label="re-cement or re-bond fixed retainer - maxillary" />
                <OrthoCodeItem code="D8699" label="re-cement or re-bond fixed retainer - mandibular" />
                <OrthoCodeItem code="D8701" label="repair of fixed retainer, includes reattachment - maxillary" />
                <OrthoCodeItem code="D8702" label="repair of fixed retainer, includes reattachment - mandibular" />
                <OrthoCodeItem code="D8703" label="replacement of lost or broken retainer - maxillary" />
                <OrthoCodeItem code="D8704" label="replacement of lost or broken retainer - mandibular" />
              </Box>

              {/* Delivery (Expanded) */}
              <OrthoSectionHeader label="Delivery" isExpanded={true} />
              <Box sx={{ mb: 1.5 }}>
                <OrthoCodeItem code="Cd9944.1" label="Occlusal Guard Delivery" />
              </Box>

              {/* Ortho (Expanded) */}
              <OrthoSectionHeader label="Ortho" isExpanded={true} />
              <Box>
                <OrthoCodeItem code="D8671" label="Periodic Orthodontic treatment visit associated with orthognathic surgery" />
              </Box>
            </AccordionDetails>
          </Accordion>
          
              </Box>
            </Box>

            {/* Right Column - Image (matches Radiographic.jsx) */}
            <Box sx={{ width: '70%', flex: '0 0 70%', position: 'relative', bgcolor: '#fff', ml: 2 }}>
          
          {/* Central Dental Chart Area */}
          <Box sx={{ position: 'relative', bgcolor: '#fff', flexShrink: 0 }}>
            {/* Top Filter Bar for Tooth Chart */}
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', p: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
              <Typography 
                onClick={selectedTeeth.length > 0 ? handleToggleUnerupted : undefined}
                sx={{ 
                  fontSize: '0.75rem', 
                  color: '#666', 
                  fontWeight: 500,
                  cursor: selectedTeeth.length > 0 ? 'pointer' : 'default',
                  '&:hover': { color: selectedTeeth.length > 0 ? '#1976d2' : '#666' }
                }}
              >
                {selectedTeeth.length > 0 ? "Unerupted" : "Erupted"}
              </Typography>
            </Stack>
            
            {/* Surface Selection Sidebar (V, C, B/F, etc) */}
            <Box sx={{ position: 'absolute', left: 10, top: 40, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {['V', 'C', 'B/F', 'M', 'O/I', 'D', 'L', 'MO', 'DO', 'MOD'].map(lbl => (
                <Box 
                  key={lbl} 
                  onClick={() => handleSidebarSurfaceClick(lbl)}
                  sx={{ 
                    width: 32, height: 28, border: '1px solid #ddd', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: fontSize.xs, color: '#666', borderRadius: '2px',
                    cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#f0f4f8', borderColor: '#3b82f6', color: '#3b82f6' }
                  }}
                >
                  {lbl}
                </Box>
              ))}
            </Box>

            {/* Tooth Chart Grid */}
            <Box sx={{ ml: 6, mt: 4 }}>
              <ErrorBoundary>
                <Box sx={{ display: 'flex', position: 'relative', width: '100%', alignItems: 'stretch' }}>
                  
                  {/* Column 1: Q1 / Q4 */}
                  <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* Upper Row */}
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <RadiographicTooth 
                          key={n} 
                          num={n} 
                          isActive={selectedTeeth.includes(n)} 
                          isMissing={missingTeeth.includes(n)}
                          isUnerupted={uneruptedTeeth.includes(n)}
                          uneruptedIndex={uneruptedTeeth.indexOf(n)}
                          surfaces={toothSurfaces[n] || []}
                          onClick={() => handleToothClick(n)} 
                          onSurfaceClick={(surf) => handleSurfaceClick(n, surf)}
                        />
                      ))}
                    </Stack>
                    
                    {/* Upper Label */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mb: 2 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>Q1</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>UR</Typography>
                    </Box>
                    
                    {/* Lower Label */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mt: 2, mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>Q4</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>LR</Typography>
                    </Box>
                    
                    {/* Lower Row */}
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {[32, 31, 30, 29, 28].map(n => (
                        <RadiographicTooth 
                          key={n} 
                          num={n} 
                          isActive={selectedTeeth.includes(n)} 
                          isMissing={missingTeeth.includes(n)}
                          isUnerupted={uneruptedTeeth.includes(n)}
                          uneruptedIndex={uneruptedTeeth.indexOf(n)}
                          surfaces={toothSurfaces[n] || []}
                          onClick={() => handleToothClick(n)} 
                          onSurfaceClick={(surf) => handleSurfaceClick(n, surf)}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Vertical Divider 1 */}
                  <Box sx={{ borderLeft: '1px dotted #ccc', mx: 2, opacity: 0.8 }} />

                  {/* Column 2: UA / LA */}
                  <Box sx={{ flex: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* Upper Row */}
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5 }}>
                      {[6, 7, 8, 9, 10, 11].map(n => (
                        <RadiographicTooth 
                          key={n} 
                          num={n} 
                          isActive={selectedTeeth.includes(n)} 
                          isMissing={missingTeeth.includes(n)}
                          isUnerupted={uneruptedTeeth.includes(n)}
                          uneruptedIndex={uneruptedTeeth.indexOf(n)}
                          surfaces={toothSurfaces[n] || []}
                          onClick={() => handleToothClick(n)} 
                          onSurfaceClick={(surf) => handleSurfaceClick(n, surf)}
                        />
                      ))}
                    </Stack>
                    
                    {/* Upper Label */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>UA</Typography>
                    </Box>
                    
                    {/* Lower Label */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1.5 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>LA</Typography>
                    </Box>
                    
                    {/* Lower Row */}
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {[27, 26, 25, 24, 23, 22].map(n => (
                        <RadiographicTooth 
                          key={n} 
                          num={n} 
                          isActive={selectedTeeth.includes(n)} 
                          isMissing={missingTeeth.includes(n)}
                          isUnerupted={uneruptedTeeth.includes(n)}
                          uneruptedIndex={uneruptedTeeth.indexOf(n)}
                          surfaces={toothSurfaces[n] || []}
                          onClick={() => handleToothClick(n)} 
                          onSurfaceClick={(surf) => handleSurfaceClick(n, surf)}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Vertical Divider 2 */}
                  <Box sx={{ borderLeft: '1px dotted #ccc', mx: 2, opacity: 0.8 }} />

                  {/* Column 3: Q2 / Q3 */}
                  <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pr: 4, position: 'relative' }}>
                    {/* Upper Row */}
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5 }}>
                      {[12, 13, 14, 15, 16].map(n => (
                        <RadiographicTooth 
                          key={n} 
                          num={n} 
                          isActive={selectedTeeth.includes(n)} 
                          isMissing={missingTeeth.includes(n)}
                          isUnerupted={uneruptedTeeth.includes(n)}
                          uneruptedIndex={uneruptedTeeth.indexOf(n)}
                          surfaces={toothSurfaces[n] || []}
                          onClick={() => handleToothClick(n)} 
                          onSurfaceClick={(surf) => handleSurfaceClick(n, surf)}
                        />
                      ))}
                    </Stack>
                    
                    {/* Upper Label */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mb: 2, position: 'relative' }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>UL</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>Q2</Typography>
                      <Typography 
                        onClick={handleMaxToggle}
                        sx={{ 
                          position: 'absolute', 
                          right: -32, 
                          top: 0, 
                          fontSize: '0.75rem', 
                          color: selectedTeeth.some(t => UPPER_TEETH.includes(t)) ? '#6b7cb4' : '#666', 
                          fontWeight: 'bold', 
                          cursor: 'pointer',
                          transition: 'color 0.2s',
                          '&:hover': { color: '#6b7cb4' }
                        }}
                      >
                        Max
                      </Typography>
                    </Box>
                    
                    {/* Lower Label */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mt: 2, mb: 1.5, position: 'relative' }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>LL</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7cb4', fontWeight: 'bold' }}>Q3</Typography>
                      <Typography 
                        onClick={handleManToggle}
                        sx={{ 
                          position: 'absolute', 
                          right: -32, 
                          top: 0, 
                          fontSize: '0.75rem', 
                          color: selectedTeeth.some(t => LOWER_TEETH.includes(t)) ? '#6b7cb4' : '#666', 
                          fontWeight: 'bold', 
                          cursor: 'pointer',
                          transition: 'color 0.2s',
                          '&:hover': { color: '#6b7cb4' }
                        }}
                      >
                        Man
                      </Typography>
                    </Box>
                    
                    {/* Lower Row */}
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {[21, 20, 19, 18, 17].map(n => (
                        <RadiographicTooth 
                          key={n} 
                          num={n} 
                          isActive={selectedTeeth.includes(n)} 
                          isMissing={missingTeeth.includes(n)}
                          isUnerupted={uneruptedTeeth.includes(n)}
                          uneruptedIndex={uneruptedTeeth.indexOf(n)}
                          surfaces={toothSurfaces[n] || []}
                          onClick={() => handleToothClick(n)} 
                          onSurfaceClick={(surf) => handleSurfaceClick(n, surf)}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Horizontal Divider Line */}
                  <Box sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderBottom: '1px dotted #ccc',
                    zIndex: 0,
                    pointerEvents: 'none',
                    opacity: 0.8
                  }} />
                </Box>
              </ErrorBoundary>

              {/* Additional Footer Controls */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 6, ml: 2 }}>
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center" 
                  onClick={(e) => setAdditionalTeethAnchorEl(e.currentTarget)}
                  sx={{ cursor: 'pointer', color: '#6b7cb4', '&:hover': { opacity: 0.8 } }}
                >
                  <AddCircleIcon fontSize="small" />
                  <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Additional teeth</Typography>
                </Stack>
                
                {/* Badges for selected additional teeth */}
                <Stack direction="row" spacing={0.5}>
                  {additionalTeeth.map(tooth => (
                    <Box
                      key={tooth}
                      sx={{
                        position: 'relative',
                        '&:hover .delete-btn': {
                          display: 'flex'
                        }
                      }}
                    >
                      <Box sx={{ 
                        px: 0.6, py: 0.1, border: '1px solid',
                        borderColor: '#4a69bd',
                        bgcolor: '#f8fafc',
                        color: '#4a69bd',
                        fontSize: '0.75rem', fontWeight: 'bold',
                        borderRadius: '2px', minWidth: '20px', textAlign: 'center',
                        userSelect: 'none'
                      }}>
                        {tooth}
                      </Box>
                      
                      <Box
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdditionalTeeth(prev => prev.filter(t => t !== tooth));
                        }}
                        sx={{
                          display: 'none',
                          position: 'absolute',
                          top: -9,
                          right: -6,
                          width: 14,
                          height: 14,
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: '#e74c3c',
                          fontWeight: 'bold',
                          lineHeight: 1,
                          zIndex: 10,
                          '&:hover': {
                            color: '#c0392b'
                          }
                        }}
                      >
                        ×
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Box>

            {/* Popover Menu for Additional Teeth Options */}
            <Popover
              open={Boolean(additionalTeethAnchorEl)}
              anchorEl={additionalTeethAnchorEl}
              onClose={() => setAdditionalTeethAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  width: 220,
                  boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  mt: 0.5
                }
              }}
            >
              <Stack spacing={0.5} sx={{ p: 0.5 }}>
                {[
                  'Supernumerary adult teeth',
                  'Retained Primary teeth',
                  'Supernumerary primary teeth'
                ].map(opt => (
                  <Box
                    key={opt}
                    onClick={() => {
                      setAdditionalTeethAnchorEl(null);
                      setShowSelectToothDialog(true);
                    }}
                    sx={{
                      px: 1.5,
                      py: 1,
                      fontSize: '0.8rem',
                      color: '#334155',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      transition: 'background-color 0.15s',
                      '&:hover': {
                        bgcolor: '#f1f5f9',
                        color: '#1976d2'
                      }
                    }}
                  >
                    {opt}
                  </Box>
                ))}
              </Stack>
            </Popover>

            {/* Dialog for selecting additional teeth */}
            <SelectToothDialog
              open={showSelectToothDialog}
              onClose={() => setShowSelectToothDialog(false)}
              selectedTeeth={additionalTeeth}
              onSelect={(tooth) => {
                setAdditionalTeeth(prev => 
                  prev.includes(tooth) ? prev.filter(t => t !== tooth) : [...prev, tooth]
                );
                setShowSelectToothDialog(false);
              }}
            />
          </Box>
        </Box>
        </Box>
        
        {/* Global Action Bar - Outside the columns, full width */}
        <Box sx={{ mt: 2, borderTop: '1px solid #e0e0e0', pt: 2, px: 2 }}>
          <GlobalActionBar 
            onReEstimateOptionClick={handleReEstimateOptionClick} 
            onSettingsClick={() => setShowEditFeesModal(true)}
            onPredetermineClick={() => setShowPredetermineModal(true)}
            onViewFeeGuideClick={() => setShowUsedFeeGuideModal(true)}
            visits={visits}
            handleAddVisit={handleAddVisit}
            selectedProcedureIds={selectedProcedureIds}
            handleMoveProceduresToVisit={handleMoveProceduresToVisit}
            onStateClick={(e) => setStateMenuAnchorEl(e.currentTarget)}
            onDeleteClick={() => setShowDeleteConfirm(true)}
            onReferClick={(e) => setReferMenuAnchorEl(e.currentTarget)}
            onDbiClick={() => {
              if (selectedProcedureIds.length > 0) {
                setShowDbiConfirm(true);
              }
            }}
            onPrintClick={(e) => setPrintMenuAnchorEl(e.currentTarget)}
            onCompleteClick={handleCompleteSelected}
          />
        </Box>

        <Dialog 
          open={showEditFeesModal} 
          onClose={() => setShowEditFeesModal(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 0, p: 0, maxWidth: '1000px' } }}
        >
          <DialogContent sx={{ p: 0 }}>
            <EditProcedureFees onClose={() => setShowEditFeesModal(false)} />
          </DialogContent>
        </Dialog>

        <Dialog 
          open={showAdjustedFeePlan} 
          onClose={() => setShowAdjustedFeePlan(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 0, p: 0, maxWidth: '900px' } }}
        >
          <DialogContent sx={{ p: 0 }}>
            <AdjustedFeeTreatmentPlan 
              onClose={() => setShowAdjustedFeePlan(false)} 
              paymentOptionType={paymentOptionType}
              showGroupingSection={showGroupingSection}
            />
          </DialogContent>
        </Dialog>

        <Dialog 
          open={showPredetermineModal} 
          onClose={() => setShowPredetermineModal(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { borderRadius: 0, p: 0, maxWidth: '1200px' } }}
        >
          <DialogContent sx={{ p: 0 }}>
            <PredetermineProcedures onClose={() => setShowPredetermineModal(false)} />
          </DialogContent>
        </Dialog>

        <UsedFeeGuidesDialog
          open={showUsedFeeGuideModal}
          onClose={() => setShowUsedFeeGuideModal(false)}
        />

        <ReEstimateCompletedProceduresDialog
          open={showReEstimateDialog}
          onClose={() => setShowReEstimateDialog(false)}
        />

        {/* Custom Status Selection Menu */}
        <Menu
          anchorEl={statusMenuAnchorEl}
          open={Boolean(statusMenuAnchorEl)}
          onClose={() => setStatusMenuAnchorEl(null)}
          PaperProps={{
            sx: {
              minWidth: 220,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              py: 0.5
            }
          }}
        >
          {STATUS_OPTIONS.map(opt => (
            <MenuItem 
              key={opt.key}
              onClick={() => handleApplyStatus(opt.key, { visitId: statusMenuVisitId, procId: statusMenuProcId })}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                fontSize: '0.8rem', 
                py: 1, 
                px: 2,
                color: '#334155',
                '&:hover': {
                  bgcolor: '#f1f5f9'
                }
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: opt.color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}
              >
                {opt.key === 'EO' ? 'E' : opt.key === 'EX' ? 'O' : opt.key}
              </Box>
              <Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>
                {opt.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>

        {/* Batch Status Selection Menu */}
        <Menu
          anchorEl={stateMenuAnchorEl}
          open={Boolean(stateMenuAnchorEl)}
          onClose={() => setStateMenuAnchorEl(null)}
          PaperProps={{
            sx: {
              minWidth: 220,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              py: 0.5
            }
          }}
        >
          {STATUS_OPTIONS.map(opt => (
            <MenuItem 
              key={opt.key}
              onClick={() => handleApplyStatus(opt.key, { batch: true })}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                fontSize: '0.8rem', 
                py: 1, 
                px: 2,
                color: '#334155',
                '&:hover': {
                  bgcolor: '#f1f5f9'
                }
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: opt.color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}
              >
                {opt.key === 'EO' ? 'E' : opt.key === 'EX' ? 'O' : opt.key}
              </Box>
              <Typography sx={{ fontSize: '0.8rem', color: '#334155' }}>
                {opt.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={showDeleteConfirm} 
          onClose={() => setShowDeleteConfirm(false)}
          PaperProps={{
            sx: {
              borderRadius: '8px',
              p: 3,
              maxWidth: '450px',
              width: '100%',
              border: '1.5px solid #ef4444'
            }
          }}
        >
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', textAlign: 'center', mb: 2 }}>
            Are you sure you want to delete the selected procedure?
          </Typography>
          <Stack spacing={0.5} sx={{ mb: 3, px: 2 }}>
            {selectedVisitIds.map(vId => {
              const v = visits.find(visit => visit.id === vId);
              return v ? (
                <Typography key={vId} sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>
                  - {v.label} (Entire Visit)
                </Typography>
              ) : null;
            })}
            {selectedProcedureIds.map(pId => {
              let foundProc = null;
              let isVisitSelected = false;
              visits.forEach(v => {
                const p = v.procedures.find(proc => proc.id === pId);
                if (p) {
                  foundProc = p;
                  if (selectedVisitIds.includes(v.id)) {
                    isVisitSelected = true;
                  }
                }
              });
              if (foundProc && !isVisitSelected) {
                return (
                  <Typography key={pId} sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                    - {foundProc.treatmentName}
                  </Typography>
                );
              }
              return null;
            })}
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              onClick={handleDeleteSelected}
              sx={{ 
                bgcolor: '#e53935', 
                color: '#fff', 
                textTransform: 'none',
                px: 3,
                '&:hover': { bgcolor: '#c62828' }
              }}
            >
              Delete
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setShowDeleteConfirm(false)}
              sx={{ 
                bgcolor: '#78909c', 
                color: '#fff', 
                textTransform: 'none',
                px: 3,
                '&:hover': { bgcolor: '#546e7a' }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Dialog>

        {/* Refer Dentist Dropdown Menu */}
        <Menu
          anchorEl={referMenuAnchorEl}
          open={Boolean(referMenuAnchorEl)}
          onClose={() => setReferMenuAnchorEl(null)}
          PaperProps={{
            sx: {
              minWidth: 220,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              py: 0.5
            }
          }}
        >
          {DENTISTS.map(dentist => (
            <MenuItem 
              key={dentist}
              onClick={() => {
                setSelectedDentist(dentist);
                setShowReferConfirm(true);
                setReferMenuAnchorEl(null);
              }}
              sx={{ 
                fontSize: '0.8rem', 
                py: 1, 
                px: 2,
                color: '#334155',
                '&:hover': {
                  bgcolor: '#f1f5f9'
                }
              }}
            >
              {dentist}
            </MenuItem>
          ))}
        </Menu>

        {/* Refer Confirmation Dialog */}
        <Dialog 
          open={showReferConfirm} 
          onClose={() => setShowReferConfirm(false)}
          PaperProps={{
            sx: {
              borderRadius: '8px',
              p: 3,
              maxWidth: '450px',
              width: '100%',
              border: '1.5px solid #f59e0b'
            }
          }}
        >
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', textAlign: 'center', mb: 2 }}>
            Are you sure you want to REFER the following procedures to '{selectedDentist}':
          </Typography>
          <Stack spacing={0.5} sx={{ mb: 3, px: 2 }}>
            {selectedProcedureIds.map(pId => {
              let foundProc = null;
              visits.forEach(v => {
                const p = v.procedures.find(proc => proc.id === pId);
                if (p) foundProc = p;
              });
              if (foundProc) {
                return (
                  <Typography key={pId} sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                    - {foundProc.treatmentName}{foundProc.toothNumber ? `(${foundProc.toothNumber})` : ''}
                  </Typography>
                );
              }
              return null;
            })}
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              onClick={handleConfirmRefer}
              sx={{ 
                bgcolor: '#f59e0b', 
                color: '#fff', 
                textTransform: 'none',
                px: 3,
                '&:hover': { bgcolor: '#d97706' }
              }}
            >
              Refer
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setShowReferConfirm(false)}
              sx={{ 
                bgcolor: '#78909c', 
                color: '#fff', 
                textTransform: 'none',
                px: 3,
                '&:hover': { bgcolor: '#546e7a' }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Dialog>

        {/* DBI Confirmation Dialog */}
        <Dialog 
          open={showDbiConfirm} 
          onClose={() => setShowDbiConfirm(false)}
          PaperProps={{
            sx: {
              borderRadius: '8px',
              p: 3,
              maxWidth: '450px',
              width: '100%',
              border: '1.5px solid #f59e0b'
            }
          }}
        >
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', textAlign: 'center', mb: 2 }}>
            Are you sure you want to NOT bill all the selected procedures
          </Typography>
          <Stack spacing={0.5} sx={{ mb: 3, px: 2 }}>
            {selectedProcedureIds.map(pId => {
              let foundProc = null;
              visits.forEach(v => {
                const p = v.procedures.find(proc => proc.id === pId);
                if (p) foundProc = p;
              });
              if (foundProc) {
                const suffix = foundProc.toothNumber || foundProc.surface 
                  ? `(${foundProc.toothNumber ?? ''}${foundProc.surface ? ' ' + foundProc.surface : ''})`
                  : '';
                return (
                  <Typography key={pId} sx={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                    -{foundProc.treatmentName}{suffix}
                  </Typography>
                );
              }
              return null;
            })}
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              onClick={handleConfirmDbi}
              sx={{ 
                bgcolor: '#f59e0b', 
                color: '#fff', 
                textTransform: 'none',
                px: 3,
                '&:hover': { bgcolor: '#d97706' }
              }}
            >
              Update
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setShowDbiConfirm(false)}
              sx={{ 
                bgcolor: '#78909c', 
                color: '#fff', 
                textTransform: 'none',
                px: 3,
                '&:hover': { bgcolor: '#546e7a' }
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Dialog>

        {/* Follow-up Procedure Dialog */}
        <Dialog 
          open={showFollowUpDialog} 
          onClose={() => setShowFollowUpDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: '8px',
              p: 0,
              maxWidth: '450px',
              width: '100%',
              overflow: 'hidden'
            }
          }}
        >
          {/* Header */}
          <Box sx={{ bgcolor: '#2d4571', px: 2, py: 1.5 }}>
            <Typography sx={{ color: '#fff', fontSize: '0.95rem', fontWeight: 'bold' }}>
              Follow Up Procedure:
            </Typography>
          </Box>
          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium', color: '#334155' }}>
                Follow-up Date:
              </Typography>
              <Box 
                component="input"
                type="text"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                sx={{
                  border: 'none',
                  borderBottom: '1px solid #ccc',
                  outline: 'none',
                  fontSize: '0.875rem',
                  color: '#334155',
                  width: '120px',
                  pb: 0.2
                }}
              />
            </Stack>

            <Box 
              component="textarea"
              placeholder="Reason"
              value={followUpReason}
              onChange={(e) => setFollowUpReason(e.target.value)}
              rows={4}
              sx={{
                width: '100%',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                p: 1,
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'none',
                mb: 3
              }}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button 
                variant="contained" 
                onClick={handleSaveFollowUp}
                sx={{ 
                  bgcolor: '#bca67a', 
                  color: '#fff', 
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { bgcolor: '#aa956b' }
                }}
              >
                Save
              </Button>
              <Button 
                variant="contained" 
                onClick={() => setShowFollowUpDialog(false)}
                sx={{ 
                  bgcolor: '#94a3b8', 
                  color: '#fff', 
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { bgcolor: '#64748b' }
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Dialog>

        {/* Dental Treatment Plan - Outside the columns, full width */}
        <Box sx={{ mt: 2, borderTop: '1px solid #e0e0e0', px: 2, pb: 2 }}>
          <DentalTreatmentPlan />
          {visits.map((visit, visitIdx) => {
            const totals = getVisitTotals(visit);
            return (
              <Box
                key={visit.id}
                id={visit.id}
                sx={{
                  mt: 2,
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  bgcolor: '#fff',
                  overflow: 'hidden',
                  fontFamily: "'Manrope', 'Segoe UI', sans-serif"
                }}
              >
                {/* Visit Header */}
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  justifyContent="space-between"
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Checkbox 
                      size="small" 
                      checked={selectedVisitIds.includes(visit.id)}
                      indeterminate={!selectedVisitIds.includes(visit.id) && visit.procedures.length > 0 && visit.procedures.some(p => selectedProcedureIds.includes(p.id))}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const procIds = visit.procedures.map(p => p.id);
                        setSelectedVisitIds(prev => 
                          isChecked ? [...new Set([...prev, visit.id])] : prev.filter(id => id !== visit.id)
                        );
                        setSelectedProcedureIds(prev => {
                          if (isChecked) {
                            return [...new Set([...prev, ...procIds])];
                          } else {
                            return prev.filter(id => !procIds.includes(id));
                          }
                        });
                      }}
                    />
                    <IconButton size="small">
                      <EditIcon sx={{ fontSize: '0.9rem', color: '#64748b' }} />
                    </IconButton>
                    <Typography sx={{ fontSize: '0.825rem', fontWeight: 700, color: '#1e293b' }}>
                      {visit.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#1976d2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                      set duration min
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#1976d2', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                      +add note
                    </Typography>
                    {(() => {
                      const currentStatus = visit.status || 'A';
                      const statusOpt = STATUS_OPTIONS.find(opt => opt.key === currentStatus) || STATUS_OPTIONS.find(opt => opt.key === 'A');
                      const displayLabel = currentStatus === 'EO' ? 'E' : currentStatus === 'EX' ? 'O' : currentStatus;
                      return (
                        <Chip 
                          label={displayLabel} 
                          size="small" 
                          onClick={(e) => handleStatusBadgeClick(e, visit.id)}
                          sx={{ 
                            bgcolor: statusOpt.bgColor, 
                            color: statusOpt.textColor, 
                            height: 18, 
                            width: 18, 
                            minWidth: 18, 
                            fontSize: '0.65rem', 
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8
                            },
                            '& .MuiChip-label': { px: 0, display: 'flex', justifyContent: 'center' }
                          }} 
                        />
                      );
                    })()}
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small">
                      <PrintIcon sx={{ fontSize: '1rem', color: '#64748b' }} />
                    </IconButton>
                    <IconButton size="small">
                      <SendIcon sx={{ fontSize: '0.9rem', color: '#64748b', transform: 'rotate(-45deg)' }} />
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Table Header Row */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '40px 60px 60px 80px 1.5fr 1fr 1fr 1fr 1fr 100px 90px 60px 100px 70px',
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: '#fff',
                    borderBottom: '1px solid #e2e8f0',
                    alignItems: 'center'
                  }}
                >
                  <Box></Box>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Tooth#</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Surf</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Code</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Treatment</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Options</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>Pt: {totals.pt}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>Ins: {totals.ins}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>WO: {totals.wo}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#1e293b', fontWeight: 800 }}>Fee: {totals.fee}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Provider</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Status</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Date</Typography>
                  <Box></Box>
                </Box>

                {/* Table Data Rows */}
                {(() => {
                  const renderProcedureRow = (p, idx, isLast) => (
                    <Box
                      key={p.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '40px 60px 60px 80px 1.5fr 1fr 1fr 1fr 1fr 100px 90px 60px 100px 70px',
                        gap: 1,
                        px: 2,
                        py: 0.8,
                        alignItems: 'center',
                        borderBottom: isLast ? 'none' : '1px solid #e2e8f0',
                        '&:hover': { bgcolor: '#f8fafc' }
                      }}
                    >
                      <Checkbox 
                        size="small" 
                        checked={selectedProcedureIds.includes(p.id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSelectedProcedureIds(prev => 
                            isChecked ? [...prev, p.id] : prev.filter(id => id !== p.id)
                          );
                        }}
                      />
                      
                      {/* Tooth# Box */}
                      <Box sx={{ display: 'flex' }}>
                        {p.toothNumber ? (
                          <Box sx={{ 
                            px: 0.8, 
                            py: 0.2, 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '4px', 
                            fontSize: '0.7rem', 
                            fontWeight: 'bold',
                            color: '#475569',
                            bgcolor: '#f8fafc',
                            minWidth: '22px',
                            textAlign: 'center'
                          }}>
                            {p.toothNumber}
                          </Box>
                        ) : (
                          <Box sx={{ minHeight: '20px' }}></Box>
                        )}
                      </Box>

                      {/* Surf Box */}
                      <Box sx={{ display: 'flex' }}>
                        {p.surface ? (
                          <Box sx={{ 
                            px: 0.8, 
                            py: 0.2, 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '4px', 
                            fontSize: '0.7rem', 
                            fontWeight: 'bold',
                            color: '#475569',
                            bgcolor: '#f8fafc',
                            minWidth: '30px',
                            textAlign: 'center'
                          }}>
                            {p.surface}
                          </Box>
                        ) : (
                          <Box sx={{ minHeight: '20px' }}></Box>
                        )}
                      </Box>

                      {/* Code */}
                      <Typography sx={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                        {p.code}
                      </Typography>

                      {/* Treatment (with chevron) */}
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ cursor: 'pointer' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: 600 }}>
                          {p.treatmentName}
                        </Typography>
                        <KeyboardArrowDownIcon sx={{ fontSize: '0.8rem', color: '#94a3b8' }} />
                      </Stack>

                      {/* Options */}
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {p.options || ''}
                      </Typography>

                      {/* Pt */}
                      <Typography sx={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                        {p.patientAmount || '$0.00'}
                      </Typography>

                      {/* Ins */}
                      <Typography sx={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                        {p.insuranceAmount || '$0.00'}
                      </Typography>

                      {/* WO */}
                      <Typography sx={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                        {p.adjustmentAmount || '$0.00'}
                      </Typography>

                      {/* Fee Input Box */}
                      <Box
                        component="input"
                        type="text"
                        value={p.fee || '$0.00'}
                        readOnly
                        sx={{
                          width: '75px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          px: 1,
                          py: 0.2,
                          fontSize: '0.75rem',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          color: '#334155',
                          outline: 'none',
                          bgcolor: '#fff'
                        }}
                      />

                      {/* Provider Chip */}
                      <Box sx={{ display: 'flex' }}>
                        <Chip
                          label={p.providerInitials || 'BAL'}
                          size="small"
                          onDelete={() => {}}
                          deleteIcon={<KeyboardArrowDownIcon style={{ color: '#b91c1c', fontSize: '0.8rem' }} />}
                          sx={{
                            bgcolor: '#fee2e2',
                            color: '#b91c1c',
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            border: 'none',
                            '& .MuiChip-label': { px: 0.8 },
                            '& .MuiChip-deleteIcon': { margin: '0 4px 0 -2px' }
                          }}
                        />
                      </Box>

                      {/* Status badge */}
                      <Box sx={{ display: 'flex' }}>
                        {(() => {
                          const currentStatus = p.status || 'D';
                          const statusOpt = STATUS_OPTIONS.find(opt => opt.key === currentStatus) || STATUS_OPTIONS[0];
                          const displayChar = currentStatus === 'EO' ? 'E' : currentStatus === 'EX' ? 'O' : currentStatus;
                          return (
                            <Box
                              onClick={(e) => handleProcStatusBadgeClick(e, p.id)}
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: statusOpt.color,
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': {
                                  opacity: 0.85
                                }
                              }}
                            >
                              {displayChar}
                            </Box>
                          );
                        })()}
                      </Box>

                      {/* Date */}
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {p.date || '07/15/2022'}
                        </Typography>
                        {p.dbi && (
                          <Typography sx={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 'bold' }}>
                            DBI
                          </Typography>
                        )}
                      </Stack>

                      {/* Referral badge and checkmark */}
                      <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                        {p.referredTo && (
                          <Tooltip title={`Referred to ${p.referredTo}`} arrow>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: '#7c4dff',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
                            >
                              R
                            </Box>
                          </Tooltip>
                        )}
                        <IconButton size="small">
                          <CheckCircleIcon sx={{ fontSize: '1.1rem', color: '#cbd5e1' }} />
                        </IconButton>
                      </Stack>
                    </Box>
                  );

                  const activeProcs = visit.procedures.filter(p => !p.referredTo && !['!', 'EO', 'EX'].includes(p.status));
                  const referredProcs = visit.procedures.filter(p => p.referredTo && !['!', 'EO', 'EX'].includes(p.status));

                  if (activeProcs.length === 0 && referredProcs.length === 0) {
                    return (
                      <Box sx={{ px: 2, py: 2 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                          No procedures in this visit yet.
                        </Typography>
                      </Box>
                    );
                  }

                  return (
                    <>
                      {activeProcs.map((p, idx) => 
                        renderProcedureRow(p, idx, idx === activeProcs.length - 1 && referredProcs.length === 0)
                      )}

                      {referredProcs.length > 0 && (
                        <Box 
                          sx={{ 
                            px: 2, 
                            py: 1, 
                            bgcolor: '#f8fafc', 
                            borderBottom: '1px solid #e2e8f0',
                            borderTop: activeProcs.length > 0 ? '1px solid #cbd5e1' : 'none'
                          }}
                        >
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>
                            Referred Procedures:
                          </Typography>
                        </Box>
                      )}

                      {referredProcs.map((p, idx) => 
                        renderProcedureRow(p, idx, idx === referredProcs.length - 1)
                      )}
                    </>
                  );
                })()}

                {/* Bottom Add Procedure link */}
                <Box sx={{ px: 2, py: 1.2, borderTop: '1px solid #e2e8f0' }}>
                  <Typography 
                    onClick={() => handleAddProcedure({ visitId: visit.id })}
                    sx={{ 
                      fontSize: '0.75rem', 
                      color: '#1976d2', 
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'inline-block',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    +Add Procedure
                  </Typography>
                </Box>
              </Box>
            );
          })}
          
          {/* Add Visit Button */}
          <Button
            startIcon={<AddCircleIcon />}
            onClick={handleAddVisit}
            sx={{ 
              mt: 2,
              textTransform: 'none',
              color: '#1976d2',
              fontSize: '0.875rem',
              fontWeight: 600,
              p: 1,
              minWidth: 'auto'
            }}
          >
           Add Visit Here
          </Button>

          {/* End Table (Completed / Out of Office / Follow-up) */}
          {(() => {
            const allProcedures = visits.flatMap(v => 
              v.procedures.map(p => ({
                ...p,
                visitLabel: v.label,
                phaseNumber: p.phaseNumber || 1
              }))
            );
            const completedProcs = allProcedures.filter(p => p.status === 'EO');
            const followUpProcs = allProcedures.filter(p => p.status === '!');
            const outOfOfficeProcs = allProcedures.filter(p => p.status === 'EX');

            const handleApplyStatusForEndTable = (newStatus, selectedIds) => {
              setVisits(prev => 
                prev.map(v => ({
                  ...v,
                  procedures: v.procedures.map(p => {
                    if (selectedIds.includes(p.id)) {
                      const extra = !['!', 'EO', 'EX'].includes(newStatus)
                        ? { followUpDate: undefined, followUpReason: undefined }
                        : {};
                      return { ...p, status: newStatus, ...extra };
                    }
                    return p;
                  })
                }))
              );
            };

            return (
              <TreatmentPlanEndTable
                completedRows={completedProcs}
                outOfOfficeRows={outOfOfficeProcs}
                followUpRows={followUpProcs}
                onApplyStatus={handleApplyStatusForEndTable}
                onReEstimateCompleted={() => setShowReEstimateDialog(true)}
              />
            );
          })()}
        </Box>
        </Box>
      </Box>

      {/* Rename Treatment Plan Dialog */}
      <Dialog
        open={showRenameDialog}
        onClose={() => setShowRenameDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            maxWidth: '420px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 600, color: '#334155', pb: 1 }}>
          Rename Treatment Plan
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRenamePlan(); }}
            placeholder="Enter plan name"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleRenamePlan}
            disabled={!renameValue.trim()}
            sx={{
              bgcolor: '#5c6bc0',
              textTransform: 'none',
              '&:hover': { bgcolor: '#4a5ab5' }
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowRenameDialog(false)}
            sx={{ textTransform: 'none', color: '#64748b', borderColor: '#cbd5e1' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Treatment Plan Confirmation Dialog */}
      <Dialog
        open={showDeletePlanConfirm}
        onClose={() => setShowDeletePlanConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            p: 3,
            maxWidth: '420px',
            width: '100%',
            border: '1.5px solid #ef4444'
          }
        }}
      >
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', textAlign: 'center', mb: 1 }}>
          Delete Treatment Plan
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', mb: 3 }}>
          Are you sure you want to delete "{activePlan?.title || 'this plan'}"? This action cannot be undone.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={handleDeletePlan}
            sx={{
              bgcolor: '#ef4444',
              color: '#fff',
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: '#dc2626' }
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowDeletePlanConfirm(false)}
            sx={{
              bgcolor: '#78909c',
              color: '#fff',
              textTransform: 'none',
              px: 3,
              '&:hover': { bgcolor: '#546e7a' }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog
        open={showPrintPreviewDialog}
        onClose={() => setShowPrintPreviewDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#f8fafc',
            minHeight: '80vh',
            '@media print': {
              bgcolor: '#fff',
              boxShadow: 'none',
              margin: 0,
              padding: 0,
            }
          }
        }}
      >
        <Box sx={{ p: 4, '@media print': { p: 0 } }} id="printable-area">
          {/* Action Bar (Hidden when printing) */}
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mb: 3, '@media print': { display: 'none' } }}>
            <Button variant="outlined" onClick={() => setShowPrintPreviewDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => window.print()} sx={{ bgcolor: '#1a237e' }}>Print</Button>
          </Stack>

          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>Medflow</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>Dental Clinic Management</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>Treatment Plan Estimate</Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>Date: {new Date().toLocaleDateString()}</Typography>
            </Box>
          </Box>

          {/* Visits Tables */}
          {visits.map((visit, vIdx) => (
            <Box key={visit.id || vIdx} sx={{ mb: 4 }}>
              <Typography sx={{ fontWeight: 600, bgcolor: '#e2e8f0', p: 1, borderRadius: '4px 4px 0 0', border: '1px solid #cbd5e1' }}>
                {visit.label || `Visit ${vIdx + 1}`}
              </Typography>
              <Box sx={{ border: '1px solid #cbd5e1', borderTop: 'none', borderRadius: '0 0 4px 4px', overflow: 'hidden' }}>
                <Grid container sx={{ bgcolor: '#f1f5f9', p: 1, borderBottom: '1px solid #cbd5e1' }}>
                  <Grid item xs={2}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Code</Typography></Grid>
                  <Grid item xs={4}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Description</Typography></Grid>
                  <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Tooth</Typography></Grid>
                  <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Surf</Typography></Grid>
                  <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Fee</Typography></Grid>
                  <Grid item xs={1.5}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Ins</Typography></Grid>
                  <Grid item xs={1.5}><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Pt</Typography></Grid>
                </Grid>
                {visit.procedures && visit.procedures.map((p, pIdx) => (
                  <Grid container key={p.id || pIdx} sx={{ p: 1, borderBottom: pIdx < visit.procedures.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                    <Grid item xs={2}><Typography sx={{ fontSize: '0.8rem' }}>{p.code}</Typography></Grid>
                    <Grid item xs={4}><Typography sx={{ fontSize: '0.8rem' }}>{p.treatmentName}</Typography></Grid>
                    <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem' }}>{p.toothNumber}</Typography></Grid>
                    <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem' }}>{p.surface}</Typography></Grid>
                    <Grid item xs={1}><Typography sx={{ fontSize: '0.8rem' }}>{p.fee || '$0.00'}</Typography></Grid>
                    <Grid item xs={1.5}><Typography sx={{ fontSize: '0.8rem' }}>{p.insuranceAmount || '$0.00'}</Typography></Grid>
                    <Grid item xs={1.5}><Typography sx={{ fontSize: '0.8rem' }}>{p.patientAmount || '$0.00'}</Typography></Grid>
                  </Grid>
                ))}
              </Box>
            </Box>
          ))}

          {/* Payment Options */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5, '@media print': { display: 'none' } }}>
               <Typography sx={{ fontSize: '0.8rem', color: '#7a8fb8', cursor: 'pointer' }}>↻ Refresh Payment Options</Typography>
            </Box>
            <Box sx={{ border: '1px solid #cbd5e1', borderRadius: '4px' }}>
              <Box sx={{ bgcolor: '#7a8fb8', p: 1, display: 'flex', justifyContent: 'center' }}>
                 <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Payment Options</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Checkbox size="small" sx={{ p: 0.5 }} checked={paymentOptionSelections.payInAdvance} onChange={(e) => setPaymentOptionSelections({...paymentOptionSelections, payInAdvance: e.target.checked})} />
                    <Typography sx={{ fontSize: '0.85rem', mt: 0.5, ml: 1 }}><strong>Pay In Advance:</strong> Receive a 5 % courtesy discount by paying your treatment in full today</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Checkbox size="small" sx={{ p: 0.5 }} checked={paymentOptionSelections.payAsYouGo} onChange={(e) => setPaymentOptionSelections({...paymentOptionSelections, payAsYouGo: e.target.checked})} />
                    <Typography sx={{ fontSize: '0.85rem', mt: 0.5, ml: 1 }}><strong>Pay As You Go:</strong> Payment at each appointment as treatment progresses. Payment: As showing above in treatment presentation.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Checkbox size="small" sx={{ p: 0.5 }} checked={paymentOptionSelections.paymentPlan} onChange={(e) => setPaymentOptionSelections({...paymentOptionSelections, paymentPlan: e.target.checked})} />
                    <Typography sx={{ fontSize: '0.85rem', mt: 0.5, ml: 1 }}><strong>Payment Plan:</strong> For 12 months, paying 5 % Mgmt fee. <br/>Down payment: $ 263.34 <br/>Monthly payment: $ 87.78</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Checkbox size="small" sx={{ p: 0.5 }} checked={paymentOptionSelections.financing} onChange={(e) => setPaymentOptionSelections({...paymentOptionSelections, financing: e.target.checked})} />
                    <Typography sx={{ fontSize: '0.85rem', mt: 0.5, ml: 1 }}><strong>Financing - Care Credit:</strong> No interest rate financing through care credit.</Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>

          {/* Treatment Plan Notes */}
          {!showPrintNotes && (
             <Box sx={{ mb: 2, '@media print': { display: 'none' } }}>
                <Button size="small" onClick={() => setShowPrintNotes(true)} sx={{ textTransform: 'none' }}>+ Add Notes</Button>
             </Box>
          )}
          {showPrintNotes && (
            <Box sx={{ mb: 4, border: '1px solid #cbd5e1', borderRadius: '4px' }}>
              <Box sx={{ bgcolor: '#7a8fb8', p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Treatment Plan Notes:</Typography>
                 <Box sx={{ '@media print': { display: 'none' } }}>
                   <Typography sx={{ color: '#fff', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }} onClick={() => setShowPrintNotes(false)}>×</Typography>
                 </Box>
              </Box>
              <Box sx={{ p: 2 }}>
                 <Box
                   component="textarea"
                   placeholder="Write notes"
                   value={printNotesText}
                   onChange={(e) => setPrintNotesText(e.target.value)}
                   sx={{
                     width: '100%',
                     minHeight: '100px',
                     border: '1px solid #e2e8f0',
                     borderRadius: '4px',
                     p: 1,
                     fontFamily: 'inherit',
                     fontSize: '0.85rem',
                     resize: 'vertical',
                     '@media print': {
                        border: 'none',
                        resize: 'none',
                     }
                   }}
                 />
                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, '@media print': { display: 'none' } }}>
                    <Button variant="contained" size="small" onClick={() => {
                      if (activePlan?._id) {
                        updateMutation.mutate({
                          id: activePlan._id,
                          data: { notes: printNotesText }
                        });
                      }
                      setShowPrintNotes(false);
                    }} sx={{ bgcolor: '#1e293b', textTransform: 'none' }}>Done</Button>
                 </Box>
              </Box>
            </Box>
          )}

          {/* Acknowledgments & Signatures */}
          <Box sx={{ mb: 4 }}>
             <Typography sx={{ fontSize: '0.85rem', mb: 1 }}>Acknowledgment:</Typography>
             <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 1, lineHeight: 1.5 }}>
               This treatment plan and alternatives have been described to me. I fully understand the risks, benefits, and alternatives of the recommended treatment. My questions have been answered.
             </Typography>
             <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 1, lineHeight: 1.5 }}>
               I understand that as the treatment progresses, modifications may be necessary and these may affect the fee. Should this occur, I further understand that the modification of treatment and the change in fee will be discussed with me at the earliest possible time.
             </Typography>
             <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 1, lineHeight: 1.5 }}>
               I understand that I am responsible to pay up front for all my treatment. The treatment will be submitted to my dental insurance company on my behalf, but our office will not accept assignment payments from my dental insurance company on my behalf.
             </Typography>
             <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 1, lineHeight: 1.5, fontWeight: 'bold' }}>
               This estimate is valid for 90 days from the date of this letter.
             </Typography>
             <Typography sx={{ fontSize: '0.8rem', color: '#334155', mb: 4, lineHeight: 1.5 }}>
               If treatment commences, but the entire treatment plan is not completed, I acknowledge that the expected outcome for whatever procedures are completed may be compromised.
             </Typography>
             
             <Stack direction="row" spacing={4} sx={{ mt: 6 }}>
                <Box sx={{ flex: 1 }}>
                   <Box sx={{ borderBottom: '1px solid #000', pb: 0.5, mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.85rem' }}>{new Date().toLocaleDateString()}</Typography>
                   </Box>
                   <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>Date</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                   <Box sx={{ borderBottom: '1px solid #000', pb: 0.5, mb: 0.5, minHeight: '20px' }}>
                   </Box>
                   <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>Signature</Typography>
                </Box>
             </Stack>
          </Box>
        </Box>
      </Dialog>

    </Box>
  );
}