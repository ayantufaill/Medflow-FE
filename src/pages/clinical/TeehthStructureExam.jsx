import React, { useState } from "react";
import {
  Box, Typography, Checkbox, IconButton, Stack, 
  Divider, Accordion, AccordionSummary, AccordionDetails,
  Button, FormControlLabel, Chip, Grid, Card
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  VisibilityOutlined as VisibilityIcon,
  ChatBubbleOutline as ChatIcon,
  ElectricBolt as BoltIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardDoubleArrowUp as KeyboardDoubleArrowUpIcon,
  PhotoCamera,
  MedicalServices,
  SelfImprovement,
  Psychology,
  Spa,
  Nightlight,
  WaterDrop,
  Healing,
  Science,
  Accessibility,
  Face,
  BrightnessHigh
} from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import { fontSize, fontWeight } from "../../constants/styles";

// --- Custom Dental SVG Icons ---
const ToothIcon = ({ color = "#ddd", type = "normal", label = "" }) => (
  <Box sx={{ 
    width: 28, height: 28, border: '1px solid #ccc', borderRadius: 1, 
    position: 'relative', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', bgcolor: color, cursor: 'pointer' 
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
      <path d="M7 3C4 3 3 6 3 9C3 13 5 21 8 21C10 21 11 19 12 19C13 19 14 21 16 21C19 21 21 13 21 9C21 6 20 3 17 3C15 3 13 4 12 5C11 4 9 3 7 3Z" />
      {type === 'caries' && <circle cx="15" cy="7" r="3" fill="black" />}
      {type === 'watch' && <path d="M8 8 L16 16 M16 8 L8 16" stroke="red" strokeWidth="2" />}
    </svg>
    {label && <Typography sx={{ position: 'absolute', bottom: -2, right: 1, fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>{label}</Typography>}
  </Box>
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

// --- Number Badge Component ---
const ToothNumber = ({ label, active = false, disabled = false }) => (
  <Box sx={{ 
    px: 0.6, py: 0.1, border: '1px solid',
    borderColor: active ? '#4a69bd' : '#ddd',
    bgcolor: active ? '#4a69bd' : 'white',
    color: active ? 'white' : (disabled ? '#ccc' : '#333'),
    fontSize: fontSize.xs, fontWeight: active ? fontWeight.bold : fontWeight.regular,
    borderRadius: '2px', minWidth: '20px', textAlign: 'center'
  }}>
    {label}
  </Box>
);

const Row = ({ label, children, hasChat = false, isGray = false }) => (
  <Box sx={{ py: 1 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography sx={{ 
          fontSize: fontSize.sm, 
          color: isGray ? '#ccc' : '#444',
          fontWeight: isGray ? fontWeight.regular : fontWeight.medium 
        }}>
          {label}
        </Typography>
        {hasChat && <ChatIcon sx={{ fontSize: 13, color: '#bbb' }} />}
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 0.5, maxWidth: '70%' }}>
        {children}
      </Box>
    </Stack>
  </Box>
);

const HeaderLabel = ({ children }) => (
  <Typography variant="caption" sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>
    {children}
  </Typography>
);

const DentalSection = ({ title, children, noFindingsLabel = "no findings", badge }) => (
  <Card variant="outlined" sx={{ mb: 1, borderRadius: '4px', border: '1px solid #b4bedb' }}>
    <Box sx={{ 
      bgcolor: '#6b7cb4', color: 'white', px: 1.5, py: 0.3, 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
    }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold }}>{title}</Typography>
        {badge && (
          <Box sx={{ bgcolor: '#e57373', px: 0.5, borderRadius: '2px', fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>{badge}</Box>
        )}
      </Stack>
      <FormControlLabel
        control={<Checkbox size="small" sx={{ p: 0.5, color: 'white', '&.Mui-checked': { color: 'white' } }} />}
        label={<Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic', ml: 0.5 }}>{noFindingsLabel}</Typography>}
        labelPlacement="start"
      />
    </Box>
    <Box sx={{ p: 1.5 }}>{children}</Box>
  </Card>
);

const SidebarItem = ({ title, color = "#5c7cba", children, hasNoFindings = true }) => (
  <Box sx={{ mb: 0.5 }}>
    <Box sx={{ 
      bgcolor: color, 
      color: "#fff", 
      px: 1, 
      py: 0.5, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>{title}</Typography>
      {hasNoFindings && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Checkbox size="small" sx={{ p: 0, color: "#fff", '&.Mui-checked': { color: "#fff" } }} />
          <Typography sx={{ fontSize: fontSize.xs }}>no findings</Typography>
        </Box>
      )}
    </Box>
    <Box sx={{ p: 1, border: "1px solid #e0e0e0", borderTop: 0, bgcolor: "#fff" }}>
      {children}
    </Box>
  </Box>
);

const Pill = ({ label, color = "#e0e0e0", textColor = "#333", selected = false }) => (
  <Box sx={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    px: 1, 
    py: 0.2, 
    borderRadius: '4px', 
    bgcolor: selected ? color : "#fff", 
    border: `1px solid ${color}`,
    minWidth: 20,
    cursor: 'pointer'
  }}>
    <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: textColor }}>{label}</Typography>
  </Box>
);

// Reusable component for the wear category rows (Abrasion, Erosion, etc.)
const WearRow = ({ label, options, buttons = ["≤1", "1-2", ">2"] }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
      <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: '#333' }}>{label}</Typography>
      <Stack direction="row" spacing={0.5}>
        {buttons.map((btn) => (
          <Button
            key={btn}
            variant="outlined"
            sx={{
              minWidth: 35,
              height: 24,
              fontSize: fontSize.xs,
              color: '#333',
              borderColor: '#ccc',
              textTransform: 'none',
              px: 0.5,
            }}
          >
            {btn}
          </Button>
        ))}
      </Stack>
    </Box>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 12px' }}>
      {options.map((opt) => (
        <FormControlLabel
          key={opt}
          control={<Checkbox size="small" sx={{ p: 0.5 }} />}
          label={<Typography sx={{ fontSize: fontSize.xs, color: '#666' }}>{opt}</Typography>}
          sx={{ m: 0 }}
        />
      ))}
    </Box>
  </Box>
);

const SectionHeader = ({ title, color = "#5c7cba", tag = "DH" }) => (
  <Box
    sx={{
      bgcolor: color,
      color: "#fff",
      px: 1,
      py: 0.5,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>{title}</Typography>
      <Box sx={{ bgcolor: "#ef5350", px: 0.4, borderRadius: "2px" }}>
        <Typography sx={{ fontSize: "0.55rem", fontWeight: fontWeight.bold }}>{tag}</Typography>
      </Box>
    </Stack>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>
      <Checkbox size="small" sx={{ p: 0, color: "#fff", "&.Mui-checked": { color: "#fff" } }} />
    </Box>
  </Box>
);

// --- Appliance Icon Component with Real MUI Icons ---
const ApplianceIcon = ({ name }) => {
  // Map appliance names to actual MUI icons
  const getIconForAppliance = (applianceName) => {
    const iconMap = {
      'Denture': <MedicalServices sx={{ fontSize: 24, color: '#5c6bc0' }} />,
      'Partial': <Healing sx={{ fontSize: 24, color: '#78909c' }} />,
      'Retainer': <Psychology sx={{ fontSize: 24, color: '#26a69a' }} />,
      'Guard': <SelfImprovement sx={{ fontSize: 24, color: '#ffa726' }} />,
      'Expander': <Science sx={{ fontSize: 24, color: '#ef5350' }} />,
      'Space M.': <Accessibility sx={{ fontSize: 20, color: '#42a5f5' }} />,
      'Invisalign': <BrightnessHigh sx={{ fontSize: 24, color: '#66bb6a' }} />,
      'Bleach': <WaterDrop sx={{ fontSize: 24, color: '#4fc3f7' }} />,
      'Palate': <Face sx={{ fontSize: 24, color: '#ab47bc' }} />,
      'Braces': <MedicalServices sx={{ fontSize: 24, color: '#ec407a' }} />,
      'Bridge': <Healing sx={{ fontSize: 24, color: '#8d6e63' }} />,
      'Sleep': <Nightlight sx={{ fontSize: 24, color: '#5c6bc0' }} />,
    };
    return iconMap[applianceName] || <MedicalServices sx={{ fontSize: 24 }} />;
  };

  return (
    <Box
      sx={{
        width: 45,
        height: 35,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.1s',
        '&:hover': { transform: 'scale(1.1)' },
        border: '1px solid #e0e0e0', 
        borderRadius: '6px',
        bgcolor: '#fafafa'
      }}
    >
      {getIconForAppliance(name)}
    </Box>
  );
};

const TeethStructureExam = () => {
  // State for managing section collapse/expand
  const [expandedSections, setExpandedSections] = useState({
    existingRestorations: true
  });

  // Toggle function for sections
  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Form state for API submission
  const [formData, setFormData] = useState({
    // Status flags
    analysisRequired: false,
    analysisReferred: false,
    noFindings: false
  });

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle new exam
  const handleNewExam = () => {
    console.log('Create new exam');
    // TODO: Navigate to new exam form or reset form
  };

  // Handle delete exam
  const handleDeleteExam = () => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      console.log('Delete exam');
      // TODO: API call to delete exam
    }
  };

  // Handle show photos
  const handleShowPhotos = () => {
    console.log('Show patient photos');
    // TODO: Open photo gallery modal
  };

  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          Exam
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Patient examination records and clinical findings
        </Typography>
      </Box>
      <ExamNavbar />
      
      {/* Timeline and Status Section - Like Morphological.jsx */}
      <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        
        {/* 1. Top Navigation / Timeline */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#00bcd4' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#00bcd4', mr: 1 }} />
            <Typography variant="body2" sx={{ fontSize: fontSize.xs }}>09/29/2023</Typography>
            <Box sx={{ width: 40, height: 2, bgcolor: '#00bcd4', mx: 1 }} />
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#00bcd4', mr: 1 }} />
            <Typography variant="body2" sx={{ fontSize: fontSize.xs }}>04/26/2024</Typography>
            <Box sx={{ width: 40, height: 2, bgcolor: '#00bcd4', mx: 1 }} />
          </Box>
          <Chip 
            icon={<CalendarMonth fontSize="small" />} 
            label="07/03/2024" 
            sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: fontWeight.bold, fontSize: fontSize.xs }}  
          />
          <Button 
            startIcon={<AddIcon />} 
            sx={{ textTransform: 'none', color: '#777', fontSize: fontSize.xs }}
            onClick={handleNewExam}
          >
            New Exam
          </Button>
        </Box>

        {/* 2-Column Layout: Sidebar on left (30%), Image on right (50%) */}
        <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'space-between' }}>
          {/* Left Column - Sidebar (30% Width) */}
          <Box sx={{ width: '30%', flex: '0 0 30%' }}>
            <Box sx={{ width: '100%', bgcolor: "#fff", p: 0, height: 'calc(100vh - 250px)', overflowY: "auto", border: "1px solid #ccc" }}>
            
            {/* Top Filter Bar */}
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', p: 1, bgcolor: '#f5f7fa' }}>
            <Typography sx={{ fontSize: fontSize.xs, color: '#666' }}>Erupted | Resolve</Typography>
              <VisibilityIcon sx={{ fontSize: 16, color: '#999' }} />
              <Box sx={{ flexGrow: 1 }} />
              <Typography sx={{ fontSize: fontSize.xs, color: '#666' }}>Tooth First</Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#ccc' }} />
              <BoltIcon sx={{ fontSize: 16, color: '#fbc02d' }} />
              <Typography sx={{ fontSize: fontSize.xs, color: '#666' }}>Condition First</Typography>
            </Stack>

        {/* 1. General Tooth Survey - New Style */}
        <DentalSection title="General Tooth Survey">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <HeaderLabel>Missing Teeth</HeaderLabel>
              <ChatIcon sx={{ fontSize: 14, color: '#999' }} />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              {[
                { l: 'EX', c: '#f3e5ab' }, { l: 'P', c: '#e8f5e9' }, { l: 'B', c: '#fce4ec' },
                { l: 'F', c: '#fffde7' }, { l: 'C', c: '#e0f7fa' }, { l: 'T', c: '#e0f2f1' }
              ].map((item) => (
                <Box key={item.l} sx={{ 
                  width: 22, height: 22, border: '1px solid #ccc', bgcolor: item.c,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, borderRadius: '3px'
                }}>
                  {item.l}
                </Box>
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mt={1}>
            {[1, 2, 3, 12, 16, 17, '30'].map((n, i) => (
              <Box key={i} sx={{ px: 0.8, border: '1px solid #eee', fontSize: 12, bgcolor: 'white' }}>{n}</Box>
            ))}
          </Stack>
        </DentalSection>

        {/* 2. Lesions - New Style */}
        <DentalSection title="Lesions" badge="DH">
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={0.5} alignItems="flex-start">
              <HeaderLabel>Coronal Cavitation (Caries)</HeaderLabel>
              <ChatIcon sx={{ fontSize: 14, color: '#999' }} />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <ToothIcon type="caries" color="#fff" />
              <ToothIcon type="caries" color="#f3e5ab" />
              <ToothIcon type="caries" color="#d7ccc8" />
            </Stack>
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#bca67a', cursor: 'pointer' }}>
            <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>
              Radicular Cavitation, White Spot Lesion
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
          </Stack>
        </DentalSection>

        {/* 3. Watch - New Section */}
        <DentalSection title="Watch">
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={0.5} alignItems="flex-start">
              <HeaderLabel>Watch</HeaderLabel>
              <ChatIcon sx={{ fontSize: 14, color: '#999' }} />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <ToothIcon type="caries" color="#fff" />
              <ToothIcon type="caries" color="#eee" />
              <ToothIcon type="watch" color="#fff" />
              <ToothIcon label="W" color="#b39ddb" />
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" mt={1}>
            <Box sx={{ px: 1, border: '1px solid #eee', fontSize: 12, bgcolor: 'white' }}>9</Box>
          </Stack>
        </DentalSection>

        {/* Existing Restorations Section - Improved Design */}
        <DentalSection title="Existing Restorations" badge="DH">
          {expandedSections.existingRestorations && (
          <>
          {/* Direct Section */}
          <Row label="Direct">
            <Stack direction="row" spacing={0.2}>
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#666" />
              <RestorationToothIcon fill="#eee" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#add8e6" />
            </Stack>
          </Row>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mb={1}>
            <ToothNumber label="4 OM" disabled />
            <ToothNumber label="5 DO" disabled />
            <ToothNumber label="10 MFLD" />
            <ToothNumber label="31 O" active />
            <ToothNumber label="31" />
            <ToothNumber label="32 O" active />
            <ToothNumber label="32" />
          </Stack>

          <Divider />

          {/* Indirect Section */}
          <Row label="Indirect">
            <Stack direction="row" spacing={0.2}>
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#444" />
              <RestorationToothIcon fill="#eee" />
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon fill="#fff" />
              <RestorationToothIcon type="incisor" fill="#eee" />
              <RestorationToothIcon fill="#b39ddb" />
            </Stack>
          </Row>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mb={1}>
            <ToothNumber label="14" />
            <ToothNumber label="19" active />
            <ToothNumber label="20" />
            <ToothNumber label="20" active />
          </Stack>

          <Divider />

          {/* Isthmus Section */}
          <Row label="Isthmus" isGray>
            <Stack direction="row" spacing={0.2}>
              <RestorationToothIcon fill="#e8f5e9" />
              <RestorationToothIcon fill="#fffde7" />
              <RestorationToothIcon fill="#ffebee" />
            </Stack>
          </Row>

          <Divider />

          {/* Restoration Concerns Section */}
          <Row label="Restoration Concerns">
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.2 }}>
              <RestorationToothIcon status="occlusal" />
              <RestorationToothIcon status="gold" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#eee" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon type="incisor" fill="#fff" />
              <RestorationToothIcon fill="#fff" />
              {/* Row 2 of icons */}
              <Box /> <Box /> <Box /> <Box />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon status="forbidden" fill="#999" />
              <RestorationToothIcon fill="#ffd700" />
              <RestorationToothIcon fill="#ffd700" />
            </Box>
          </Row>

          <Divider />

          {/* Bridge Section */}
          <Row label="Bridge" hasChat>
            <Stack direction="row" spacing={0.5}>
              {[
                { c1: '#fff', c2: '#fff' },
                { c1: '#fff', c2: '#999' },
                { c1: '#ffd700', c2: '#ffd700' },
                { c1: '#999', c2: '#999' },
                { c1: '#add8e6', c2: '#add8e6' },
                { c1: '#b39ddb', c2: '#b39ddb' }
              ].map((b, i) => (
                <Box key={i} sx={{ 
                  width: 24, height: 24, borderRadius: '4px', border: '1px solid #999',
                  background: `linear-gradient(135deg, ${b.c1} 50%, ${b.c2} 50%)`
                }} />
              ))}
            </Stack>
          </Row>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mb={1}>
            <ToothNumber label="11 13" />
            <ToothNumber label="11 13" />
            <ToothNumber label="12" />
          </Stack>

          <Divider />

          {/* Denture Section */}
          <Row label="Denture" hasChat />
          
          {/* Footer Expand Icon - Only show when expanded */}
          <Box 
            sx={{ display: 'flex', justifyContent: 'center', mt: 1, cursor: 'pointer' }}
            onClick={() => toggleSection('existingRestorations')}
          >
            <KeyboardDoubleArrowUpIcon 
              sx={{ 
                fontSize: 20, 
                color: '#666',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </Box>
          </>
          )}
          {!expandedSections.existingRestorations && (
            <Box 
              sx={{ display: 'flex', justifyContent: 'center', p: 1, cursor: 'pointer', bgcolor: '#fafafa' }}
              onClick={() => toggleSection('existingRestorations')}
            >
              <KeyboardDoubleArrowUpIcon 
                sx={{ 
                  fontSize: 20, 
                  color: '#666',
                  transform: 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }} 
              />
            </Box>
          )}
        </DentalSection>
        
        {/* Wear (Tooth Structure Loss) Section - Added after Existing Restorations */}
        <Box sx={{ mb: 0.5 }}>
          <SectionHeader title="Wear (Tooth Structure Loss)" tag="DH" />
          
          <Box sx={{ p: 1.5, border: "1px solid #e0e0e0", borderTop: 0, bgcolor: "#fff" }}>
            <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, mb: 1, color: '#444' }}>
              Wear matching the opposing dentition
            </Typography>
            
            <WearRow label="Attrition/Chewing Envelope" options={[]} />
            
            <Box sx={{ mb: 2 }}>
              <WearRow label="Abnormal Attrition/horizontal (lateral) linear" options={["Sleep bruxism"]} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, mb: 1, color: '#444' }}>
              Non-cervical wear not matching the opposing dentition
            </Typography>

            <WearRow label="Abrasion" options={["Toothpaste", "Tongue", "Cheek", "Opposing Restoration"]} />
            <WearRow label="Erosion" options={["Extrinsic: Dietary", "Intrinsic: GERD", "Intrinsic: Bulimia"]} />

            <Divider sx={{ mb: 2 }} />

            <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, mb: 1, color: '#444' }}>
              Cervical Wear - NCCL
            </Typography>
            
            <WearRow label="Cervical abrasion" options={["Toothpaste", "Habits", "Cheek"]} />
            <WearRow label="Abfraction" options={["Extrinsic: Dietary", "Intrinsic: Bulimia", "Intrinsic: GERD", "Biomechanical loading force"]} />
          </Box>
        </Box>

        {/* Concerns Section */}
        <Box sx={{ mb: 0.5 }}>
          <SectionHeader title="Concerns" tag="DH" />
          <Box sx={{ p: 1, textAlign: 'center', bgcolor: '#fff', border: "1px solid #e0e0e0", borderTop: 0 }}>
            <Typography sx={{ fontSize: fontSize.xs, fontStyle: "italic", color: "#d4b483", fontWeight: fontWeight.medium }}>
              Pulpal Concern, Fracture, Future Pulpal Concern ∨
            </Typography>
          </Box>
        </Box>

        {/* Appliances Section - Improved Design */}
        <DentalSection title="Appliances" badge="DH">
          <Box sx={{ p: 2, bgcolor: 'white' }}>
            {/* Row 1 */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1.5, 
              mb: 2,
              flexWrap: 'wrap' 
            }}>
              {[
                { id: 1, name: 'Denture' },
                { id: 2, name: 'Partial' },
                { id: 3, name: 'Retainer' },
                { id: 4, name: 'Guard' },
                { id: 5, name: 'Expander' },
              ].map((item) => (
                <ApplianceIcon key={item.id} name={item.name} />
              ))}
            </Box>

            {/* Row 2 */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1.5,
              flexWrap: 'wrap' 
            }}>
              {[
                { id: 7, name: 'Invisalign' },
                { id: 8, name: 'Bleach' },
                { id: 9, name: 'Palate' },
                { id: 10, name: 'Braces' },
                { id: 11, name: 'Bridge' },
              ].map((item) => (
                <ApplianceIcon key={item.id} name={item.name} />
              ))}
            </Box>
          </Box>
        </DentalSection>
      </Box>
          </Box>

          {/* Right Column - Image (50% Width) */}
          <Box sx={{ width: '50%', flex: '0 0 50%' }}>
            <Box sx={{ 
              width: '100%', 
              height: 'calc(100vh - 400px)', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Placeholder for dental image - replace src with actual image path */}
              <img 
                src="/tooth_structure.png" 
                alt="Teeth Structure" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }} 
              />
              
              {/* Action Buttons Below Image */}
              <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 1 }}>
                <Button
                  variant="text"
                  startIcon={<MedicalServices />}
                  onClick={() => console.log('Add additional teeth')}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: fontSize.xs,
                    px: 2,
                    py: 0.75,
                    color: '#5c7cba',
                    '&:hover': {
                      bgcolor: 'rgba(92, 124, 186, 0.04)'
                    }
                  }}
                >
                  + Additional Teeth
                </Button>
                
                <Button
                  variant="text"
                  startIcon={<PhotoCamera />}
                  onClick={handleShowPhotos}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: fontSize.xs,
                    px: 2,
                    py: 0.75,
                    color: '#5c7cba',
                    '&:hover': {
                      bgcolor: 'rgba(92, 124, 186, 0.04)'
                    }
                  }}
                >
                  Show Patient Photos
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>

      {/* Delete Exam Button - Outside Sidebar */}
      <Button 
        variant="contained" 
        sx={{ mt: 4, bgcolor: '#e74c3c', '&:hover': { bgcolor: '#c0392b' }, textTransform: 'none' }}
        onClick={handleDeleteExam}
      >
        Delete Exam
      </Button>
    </Box>
    </Box>
  );
};

export default TeethStructureExam;