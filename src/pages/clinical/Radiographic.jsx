import React, { useState } from "react";
import {
  Box, Typography, Chip, Button, Stack, Divider, Grid
} from "@mui/material";
import {
  CalendarMonth,
  Add as AddIcon,
  KeyboardDoubleArrowUp,
  VisibilityOutlined,
  ElectricBolt
} from "@mui/icons-material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import {
  GeneralToothSurvey,
  CoronalToothStructure,
  RadicularToothStructure,
  SupportingStructure,
  Tooth
} from "../../components/radiographic";
import { fontSize, fontWeight } from "../../constants/styles";

const Radiographic = () => {
  const [selectedTeeth, setSelectedTeeth] = React.useState([]);
  const [missingTeeth, setMissingTeeth] = React.useState([]);

  const handleToothClick = (num) => {
    setSelectedTeeth(prev => 
      prev.includes(num) ? prev.filter(t => t !== num) : [...prev, num]
    );
  };

  const UPPER_TEETH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const LOWER_TEETH = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

  const handleMaxToggle = () => {
    const allUpperSelected = UPPER_TEETH.every(t => selectedTeeth.includes(t));
    setSelectedTeeth(prev => allUpperSelected ? prev.filter(t => !UPPER_TEETH.includes(t)) : [...new Set([...prev, ...UPPER_TEETH])]);
  };

  const handleManToggle = () => {
    const allLowerSelected = LOWER_TEETH.every(t => selectedTeeth.includes(t));
    setSelectedTeeth(prev => allLowerSelected ? prev.filter(t => !LOWER_TEETH.includes(t)) : [...new Set([...prev, ...LOWER_TEETH])]);
  };

  const handleMarkMissing = () => {
    if (selectedTeeth.length === 0) return;
    setMissingTeeth(prev => {
      const allSelectedAreMissing = selectedTeeth.every(t => prev.includes(t));
      if (allSelectedAreMissing) {
        return prev.filter(t => !selectedTeeth.includes(t));
      } else {
        return [...new Set([...prev, ...selectedTeeth])];
      }
    });
    setSelectedTeeth([]);
  };

  // State for managing section collapse/expand
  const [expandedSections, setExpandedSections] = React.useState({
    generalToothSurvey: true,
    coronalToothStructure: true,
    radicularToothStructure: true,
    supportingStructure: true
  });

  // State for visit dates timeline
  const [visitDates, setVisitDates] = useState([
    'Sep 29, 2023',
    'Apr 26, 2024',
    'Jul 03, 2024'
  ]);

  // Toggle function for sections
  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Handle new exam
  const handleNewExam = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setVisitDates([...visitDates, today]);
  };

  // Handle delete exam
  const handleDeleteExam = () => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      console.log('Delete exam');
    }
  };

  // Handle remove date from timeline
  const handleRemoveDate = (indexToRemove) => {
    setVisitDates(visitDates.filter((_, index) => index !== indexToRemove));
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
      
      {/* Timeline and Status Section */}
      <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        
        {/* 1. Top Navigation / Timeline */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, overflowX: 'auto' }}>
          <VisitDatesTimeline
            visitDates={visitDates}
            onRemoveDate={handleRemoveDate}
          />
          <Button 
            startIcon={<AddIcon />} 
            sx={{ textTransform: 'none', color: '#777', fontSize: fontSize.xs, whiteSpace: 'nowrap', flexShrink: 0 }}
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
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', p: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>{selectedTeeth.length > 0 ? "Unerupted" : "Erupted"} | Resolve</Typography>
              <VisibilityOutlined sx={{ fontSize: 16, color: '#1976d2', ml: 0.5 }} />
              <Box sx={{ flexGrow: 1 }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>Tooth First</Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 1.5, borderColor: '#ddd' }} />
              <ElectricBolt sx={{ fontSize: 16, color: '#fbc02d', ml: 0.5 }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500, ml: 0.5 }}>Condition First</Typography>
            </Stack>

        {/* Section Components */}
        <GeneralToothSurvey 
          expanded={expandedSections.generalToothSurvey}
          onToggle={() => toggleSection('generalToothSurvey')}
          missingTeeth={missingTeeth}
          onMissingTeethClick={handleMarkMissing}
        />
        
        <CoronalToothStructure 
          expanded={expandedSections.coronalToothStructure}
          onToggle={() => toggleSection('coronalToothStructure')}
        />
        
        <RadicularToothStructure 
          expanded={expandedSections.radicularToothStructure}
          onToggle={() => toggleSection('radicularToothStructure')}
        />
        
        <SupportingStructure 
          expanded={expandedSections.supportingStructure}
          onToggle={() => toggleSection('supportingStructure')}
        />
      </Box>
          </Box>

          {/* Right Column - Tooth Chart */}
          <Grid size={8.5} sx={{ position: 'relative', bgcolor: '#fff', ml: 2 }}>
            
            {/* Surface Selection Sidebar */}
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
              <Box sx={{ display: 'flex', position: 'relative', width: '100%', alignItems: 'stretch' }}>
                
                {/* Column 1: Q1 / Q4 */}
                <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {/* Upper Row (Roots / Crowns) */}
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <Tooth 
                        key={n} 
                        num={n} 
                        isActive={selectedTeeth.includes(n)} 
                        isMissing={missingTeeth.includes(n)}
                        onClick={() => handleToothClick(n)} 
                      />
                    ))}
                  </Stack>
                  
                  {/* Upper Label */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mb: 2 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>Q1</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>UR</Typography>
                  </Box>
                  
                  {/* Lower Label */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mt: 2, mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>Q4</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>LR</Typography>
                  </Box>
                  
                  {/* Lower Row (Crowns / Roots) */}
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {[32, 31, 30, 29, 28].map(n => (
                      <Tooth 
                        key={n} 
                        num={n} 
                        isActive={selectedTeeth.includes(n)} 
                        isMissing={missingTeeth.includes(n)}
                        onClick={() => handleToothClick(n)} 
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
                      <Tooth 
                        key={n} 
                        num={n} 
                        isActive={selectedTeeth.includes(n)} 
                        isMissing={missingTeeth.includes(n)}
                        onClick={() => handleToothClick(n)} 
                      />
                    ))}
                  </Stack>
                  
                  {/* Upper Label */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>UA</Typography>
                  </Box>
                  
                  {/* Lower Label */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>LA</Typography>
                  </Box>
                  
                  {/* Lower Row */}
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {[27, 26, 25, 24, 23, 22].map(n => (
                      <Tooth 
                        key={n} 
                        num={n} 
                        isActive={selectedTeeth.includes(n)} 
                        isMissing={missingTeeth.includes(n)}
                        onClick={() => handleToothClick(n)} 
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
                      <Tooth 
                        key={n} 
                        num={n} 
                        isActive={selectedTeeth.includes(n)} 
                        isMissing={missingTeeth.includes(n)}
                        onClick={() => handleToothClick(n)} 
                      />
                    ))}
                  </Stack>
                  
                  {/* Upper Label */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mb: 2, position: 'relative' }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>UL</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>Q2</Typography>
                    <Typography 
                      onClick={handleMaxToggle}
                      sx={{ 
                        position: 'absolute', 
                        right: -32, 
                        top: 0, 
                        fontSize: '0.75rem', 
                        color: selectedTeeth.some(t => UPPER_TEETH.includes(t)) ? '#3b82f6' : '#666', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                        '&:hover': { color: '#3b82f6' }
                      }}
                    >
                      Max
                    </Typography>
                  </Box>
                  
                  {/* Lower Label */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, mt: 2, mb: 1.5, position: 'relative' }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>LL</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 'bold' }}>Q3</Typography>
                    <Typography 
                      onClick={handleManToggle}
                      sx={{ 
                        position: 'absolute', 
                        right: -32, 
                        top: 0, 
                        fontSize: '0.75rem', 
                        color: selectedTeeth.some(t => LOWER_TEETH.includes(t)) ? '#3b82f6' : '#666', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                        '&:hover': { color: '#3b82f6' }
                      }}
                    >
                      Man
                    </Typography>
                  </Box>
                  
                  {/* Lower Row */}
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {[21, 20, 19, 18, 17].map(n => (
                      <Tooth 
                        key={n} 
                        num={n} 
                        isActive={selectedTeeth.includes(n)} 
                        isMissing={missingTeeth.includes(n)}
                        onClick={() => handleToothClick(n)} 
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

              {/* Additional Footer Controls */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 20, ml: 2, color: '#6b7cb4' }}>
                <AddCircleIcon fontSize="small" />
                <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>Additional teeth</Typography>
              </Stack>
            </Box>
          </Grid>
        </Box>

      {/* Delete Exam Button */}
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

export default Radiographic;