import React, { useState } from "react";
import {
  Box, Typography, Chip, Button, Stack, Divider, Grid, Card, Checkbox, FormControlLabel
} from "@mui/material";
import {
  CalendarMonth,
  Add as AddIcon,
  VisibilityOutlined,
  ElectricBolt,
  KeyboardArrowDown,
  KeyboardDoubleArrowUp,
  ChatBubbleOutline
} from "@mui/icons-material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import {
  Tooth,
  GeneralToothSurvey,
  Lesions,
  Watch,
  ExistingRestorations,
  Wear,
  Concerns,
  Appliances,
  ToothIcon,
  RestorationToothIcon,
  ToothNumber
} from "../../components/teeth-structure-exam";
import { fontSize, fontWeight } from "../../constants/styles";

const TeethStructureExam = () => {
  // State for managing section collapse/expand
  const [expandedSections, setExpandedSections] = useState({
    generalToothSurvey: true,
    lesions: true,
    watch: true,
    existingRestorations: true
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
      
      <Box sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        
        {/* Timeline */}
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

        {/* 2-Column Layout */}
        <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'space-between' }}>
          {/* Left Column - Sidebar */}
          <Box sx={{ width: '30%', flex: '0 0 30%' }}>
            <Box sx={{ width: '100%', bgcolor: "#fff", p: 0, height: 'calc(100vh - 250px)', overflowY: "auto", border: "1px solid #ccc" }}>
            
            {/* Top Filter Bar */}
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', p: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>Erupted | Resolve</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <VisibilityOutlined sx={{ fontSize: 16, color: '#1976d2', mr: 0.5 }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>Tooth First</Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 1.5, borderColor: '#ddd' }} />
              <ElectricBolt sx={{ fontSize: 16, color: '#fbc02d', ml: 0.5 }} />
              <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500, ml: 0.5 }}>Condition First</Typography>
            </Stack>

        {/* Section Components */}
        <GeneralToothSurvey 
          expanded={expandedSections.generalToothSurvey}
          onToggle={() => toggleSection('generalToothSurvey')}
        />
        
        <Lesions 
          expanded={expandedSections.lesions}
          onToggle={() => toggleSection('lesions')}
        />
        
        <Watch 
          expanded={expandedSections.watch}
          onToggle={() => toggleSection('watch')}
        />
        
        <ExistingRestorations 
          expanded={expandedSections.existingRestorations}
          onToggle={() => toggleSection('existingRestorations')}
        />
        
        <Wear />
        <Concerns />
        <Appliances />
      </Box>
          </Box>

          {/* Right Column - Tooth Chart */}
          <Grid item xs={8.5} sx={{ position: 'relative', bgcolor: '#fff', ml: 2 }}>
            
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

export default TeethStructureExam;