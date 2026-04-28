import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, IconButton, 
  Button, Stack, Accordion, AccordionSummary, AccordionDetails, Chip, Divider
} from '@mui/material';
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import DentalTreatmentPlan from '../../components/clinical/DentalTreatmentPlan';
import ProcedureRow from '../../components/clinical/ProcedureRow';
import TreatmentPlanEndTable from '../../components/clinical/TreatmentPlanEndTable';
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

// --- Global Action Bar Component ---
const GlobalActionBar = () => (
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
        sx={{ bgcolor: '#a3b1d6', textTransform: 'none', borderRadius: 1 }}
      >
        Visit
      </Button>
      <Button 
        variant="contained" 
        size="small" 
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ bgcolor: '#a3b1d6', textTransform: 'none', borderRadius: 1 }}
      >
        State
      </Button>
      <IconButton size="small" sx={{ bgcolor: '#f4c7c3', mx: 1 }}>
        <DeleteIcon fontSize="small" sx={{ color: '#d93025' }} />
      </IconButton>
      <Button 
        variant="contained" 
        color="success" 
        size="small" 
        sx={{ borderRadius: 20, textTransform: 'none', px: 2, bgcolor: '#b7e1cd', color: '#137333' }}
      >
        Complete
      </Button>
      <Button 
        variant="outlined" 
        size="small" 
        sx={{ borderRadius: 20, textTransform: 'none', px: 2, color: '#9e9e9e', borderColor: '#e0e0e0' }}
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
        >
          Re-Estimate
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          sx={{ bgcolor: '#1a237e', minWidth: 30, borderRadius: '0 4px 4px 0' }}
        >
          <KeyboardArrowDownIcon fontSize="small" />
        </Button>
      </Stack>
      
      <Chip 
        label="DBI" 
        variant="outlined" 
        size="small" 
        sx={{ borderRadius: 1, height: 24, bgcolor: '#a3b1d6', border: 'none' }} 
      />
      
      <IconButton size="small"><PrintIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
      <IconButton size="small"><CreditCardIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
      <IconButton size="small"><SettingsIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
      <IconButton size="small"><SecurityIcon fontSize="small" sx={{ color: '#1a237e' }} /></IconButton>
      
      <Button 
        variant="outlined" 
        size="small" 
        sx={{ textTransform: 'none', color: '#1a237e', borderColor: '#1a237e' }}
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

const SidebarSection = ({ title, children, expanded = false, icons = [] }) => (
  <Accordion 
    defaultExpanded={expanded} 
    disableGutters 
    elevation={0} 
    sx={{ 
      borderBottom: '1px solid #b4bedb',
      '&:before': { display: 'none' } 
    }}
  >
    <AccordionSummary 
      expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: '#333' }} />} 
      sx={{ minHeight: 40, px: 1.5, '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
    >
      <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
        {title}
      </Typography>
      <Stack direction="row" spacing={0.5} sx={{ mr: 1 }}>
        {icons}
      </Stack>
    </AccordionSummary>
    <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
      {children}
    </AccordionDetails>
  </Accordion>
);

// --- Reusable Sidebar Item ---
const SidebarItem = ({ label }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.3, cursor: 'pointer' }}>
    <Typography sx={{ 
      fontSize: fontSize.sm,
    }}>
      {label}
    </Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#999' }} />
  </Stack>
);

// --- Sub-menu Item Component ---
const SidebarSubItem = ({ label }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.4, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}>
    <Typography sx={{ fontSize: fontSize.sm, color: '#333' }}>{label}</Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#999' }} />
  </Stack>
);

const DiagnosticItem = ({ label }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.4, cursor: 'pointer' }}>
    <Typography sx={{ 
      fontSize: fontSize.sm, 
    }}>
      {label}
    </Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#666' }} />
  </Stack>
);

// --- Central Chart Tooth Component ---
const Tooth = ({ num, isActive = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 0.5,
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        zIndex: isHovered ? 1 : 'auto'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography sx={{ fontSize: fontSize.xs, color: isActive || isHovered ? '#1976d2' : '#666', fontWeight: (isActive || isHovered) ? fontWeight.bold : fontWeight.regular }}>
        {num}
      </Typography>
      <Box 
        component="img" 
        src={`/teeth${num}.png`} // Uses actual tooth images from public folder
        alt={`Tooth ${num}`}
        sx={{ 
          width: 35, 
          height: 70, 
          mt: 0.5, 
          opacity: isHovered ? 1 : 0.9,
          filter: isActive || isHovered 
            ? 'drop-shadow(0 0 4px #1976d2) brightness(1.15)' 
            : 'none',
          objectFit: 'contain',
          transition: 'all 0.2s ease-in-out'
        }} 
      />
    </Box>
  );
};

export default function TreatmentPlanPage() {
  const [visits, setVisits] = useState(() => [
    {
      id: 'v-1',
      label: 'Visit 1',
      procedures: [
        {
          id: 'p-1',
          visitId: 'v-1',
          name: 'crown /bu',
          toothNumber: 15,
          surface: '',
          code: 'D0120',
          treatmentName: 'Periodic Evaluation',
          options: '',
          patientAmount: '$0.00',
          insuranceAmount: '$0.00',
          adjustmentPercent: '0%',
          adjustmentAmount: '$0.00',
          fee: '$0.00',
          billedAmount: '$0.00',
          providerInitials: 'SAB',
          status: 'A',
          date: '10/14/2025'
        }
      ]
    }
  ]);

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
            <Chip label="TP 1" color="primary" size="small" icon={<EditIcon />} sx={{ bgcolor: '#5c6bc0' }} />
            <Chip label="+ TP" variant="outlined" size="small" sx={{ borderStyle: 'dashed', color: '#fbc02d' }} />
            <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
            <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
            <IconButton size="small"><PrintIcon fontSize="small" /></IconButton>
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
              <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', p: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontSize: fontSize.xs, color: '#666', fontWeight: fontWeight.medium }}>Power Codes | Resolve</Typography>
                <Box sx={{ flexGrow: 1 }} />
              </Stack>
          
          {/* 1. Power Codes */}
          <SidebarSection title="Power Codes">
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
          <SidebarSection title="Diagnostic" expanded>
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
          <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
              sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
                Preventative
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ mr: 1 }}>
                <Box sx={{ bgcolor: '#008080', color: 'white', px: 0.5, py: 0.2, fontSize: fontSize.xs, fontWeight: fontWeight.bold, borderRadius: '3px' }}>PRV</Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
              <SidebarItem label="Prophy" />
              <SidebarItem label="Fluoride" />
              <SidebarItem label="Preventative services" />
              <SidebarItem label="Space maintenance" />
              <SidebarItem label="vaccine administration" />
            </AccordionDetails>
          </Accordion>

          {/* 4. Restorative */}
          <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
              sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
                Restorative
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
              <SidebarItem label="Direct" />
              <SidebarItem label="Indirect Adhesive" />
              <SidebarItem label="Indirect" />
              <SidebarItem label="Indirect Cohesive" />
              <SidebarItem label="Recement/Repair" />
              <SidebarItem label="Pediatric" />
              <SidebarItem label="Additional restorative" />
              <SidebarItem label="BU/P&C" />
              <SidebarItem label="Restorative" />
              <SidebarItem label="Per arch" />
              <SidebarItem label="Clip - stationary" />
            </AccordionDetails>
          </Accordion>

          {/* 5. Endodontics */}
          <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
              sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
                Endodontics
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ mr: 1 }}>
                <EndoToothIcon filled />
                <EndoToothIcon />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
              <SidebarSubItem label="Pulp capping" />
              <SidebarSubItem label="Pulpotomy" />
              <SidebarSubItem label="Root Canal" />
              <SidebarSubItem label="Apexification/recalcification" />
              <SidebarSubItem label="Pulpal Regeneration" />
              <SidebarSubItem label="Apicoectomy/Periradicular" />
              <SidebarSubItem label="Additional endo" />
              <SidebarSubItem label="Apicoectomy/Periradicular Services" />
            </AccordionDetails>
          </Accordion>

          {/* 6. Periodontics */}
          <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
              sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
                Periodontics
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mr: 1 }}>
                <Box sx={{ bgcolor: '#f08080', color: 'white', px: 0.6, py: 0.2, fontSize: fontSize.xs, fontWeight: fontWeight.bold, borderRadius: '3px' }}>LBR</Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
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
            </AccordionDetails>
          </Accordion>

          {/* 7. Prosthodontics, Removable */}
          <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
              sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
                Prosthodontics, Removable
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mr: 1 }}>
                <DentureIcon color="#9c27b0" />
                <DentureIcon color="#ef9a9a" />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
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
            </AccordionDetails>
          </Accordion>

          {/* 8. Implant Services */}
          <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
              sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
                Implant Services
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
                <ImplantIcon />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
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
            </AccordionDetails>
          </Accordion>

          {/* 9. Prosthodontics, Fixed */}
          <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
              sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
                Prosthodontics, Fixed
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ mr: 1 }}>
                <RestorationToothIcon fill="#fff" />
                <RestorationToothIcon fill="#ffd700" />
                <RestorationToothIcon fill="#eee" />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
              <SidebarSubItem label="Fixed Bridge" />
              <SidebarSubItem label="Inlay/Onlay FPD" />
              <SidebarSubItem label="Additional FPD" />
              <SidebarSubItem label="FPD repair" />
            </AccordionDetails>
          </Accordion>

          {/* 10. Oral Surgery */}
          <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
              sx={{ '& .MuiAccordionSummary-content': { justifyContent: 'space-between', alignItems: 'center' } }}
            >
              <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: '#4a69bd' }}>
                Oral Surgery
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
                <ScalpelIcon />
                <HemostatIcon />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1.5, pt: 0 }}>
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
            </AccordionDetails>
          </Accordion>

          {/* 11. Orthodontics */}
          <Accordion defaultExpanded disableGutters elevation={0} sx={{ borderBottom: '1px solid #b4bedb' }}>
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
            
            {/* Surface Selection Sidebar (V, C, B/F, etc) */}
            <Box sx={{ position: 'absolute', left: 10, top: 40, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {['V', 'C', 'B/F', 'M', 'O/I', 'D', 'L', 'MO', 'DO', 'MOD'].map(lbl => (
                <Box key={lbl} sx={{ 
                  width: 32, height: 28, border: '1px solid #ddd', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: fontSize.xs, color: '#666', borderRadius: '2px'
                }}>{lbl}</Box>
              ))}
            </Box>

            {/* Tooth Chart Grid */}
            <Box sx={{ ml: 6, mt: 4 }}>
              {/* Maxillary (Upper) */}
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(n => (
                  <Tooth key={n} num={n} isActive={n === 3} />
                ))}
              </Stack>

              <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

              {/* Mandibular (Lower) */}
              <Stack direction="row" spacing={1} justifyContent="center">
                {[32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17].map(n => (
                  <Tooth key={n} num={n} />
                ))}
              </Stack>

              {/* Additional Footer Controls */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 6, ml: 2, color: '#6b7cb4' }}>
                <AddCircleIcon fontSize="small" />
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Additional teeth</Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
        </Box>
        
        {/* Global Action Bar - Outside the columns, full width */}
        <Box sx={{ mt: 2, borderTop: '1px solid #e0e0e0', pt: 2, px: 2 }}>
          <GlobalActionBar />
        </Box>

        {/* Dental Treatment Plan - Outside the columns, full width */}
        <Box sx={{ mt: 2, borderTop: '1px solid #e0e0e0', px: 2, pb: 2 }}>
          <DentalTreatmentPlan />
          {visits.map((visit, visitIdx) => (
            <Box
              key={visit.id}
              sx={{
                mt: 2,
                border: '1px solid #d1d9e6',
                borderRadius: 1,
                bgcolor: '#fff',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  bgcolor: '#f4f7fa',
                  borderBottom: '1px solid #e8ecf1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a2735' }}>
                  {visit.label}
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => handleAddProcedure({ visitId: visit.id })}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  + Add Procedure
                </Button>
              </Box>

              {visit.procedures.length === 0 ? (
                <Box sx={{ px: 1.5, py: 2 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#7a8796' }}>
                    No procedures in this visit yet.
                  </Typography>
                </Box>
              ) : (
                visit.procedures.map((p, idx) => (
                  <ProcedureRow
                    key={p.id}
                    procedure={p}
                    defaultExpanded={visitIdx === 0 && idx === 0}
                    onAddProcedure={handleAddProcedure}
                  />
                ))
              )}
            </Box>
          ))}
          
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

          {/* End Table (Completed / Out of Office) */}
          <TreatmentPlanEndTable
            completedRows={[]}
            outOfOfficeRows={[]}
            onReEstimateCompleted={() => {}}
          />
        </Box>
        </Box>
      </Box>
    </Box>
  );
}