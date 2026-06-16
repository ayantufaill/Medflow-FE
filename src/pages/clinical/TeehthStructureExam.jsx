import React, { useState } from "react";
import {
  Box, Typography, Button, Stack, Divider, Grid, Card, Checkbox, FormControlLabel,
  Dialog, IconButton, TextField, Popover
} from "@mui/material";
import {
  CalendarMonth,
  Add as AddIcon,
  VisibilityOutlined,
  ElectricBolt
} from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
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
  Appliances
} from "../../components/teeth-structure-exam";
import { SelectToothDialog } from "../../components/radiographic";
import { fontSize, fontWeight } from "../../constants/styles";

const TeethStructureExam = () => {
  // State for selected teeth
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  
  // State for missing teeth, starting empty
  const [missingTeeth, setMissingTeeth] = useState([]);

  // State for tooth findings
  const [toothFindings, setToothFindings] = useState({});
  // State for active tooth in selection / badge click
  const [activeToothNum, setActiveToothNum] = useState(null);
  
  const [detailModalTooth, setDetailModalTooth] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Additional Teeth selection states
  const [additionalTeeth, setAdditionalTeeth] = useState([]);
  const [additionalTeethAnchorEl, setAdditionalTeethAnchorEl] = useState(null);
  const [showSelectToothDialog, setShowSelectToothDialog] = useState(false);

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

  // Tooth click handler
  const handleToothClick = (num) => {
    if (toothFindings[num] && (toothFindings[num].findings || []).length > 0) {
      setDetailModalTooth(num);
      setActiveToothNum(num);
      return;
    }
    setSelectedTeeth(prev => 
      prev.includes(num) ? prev.filter(t => t !== num) : [...prev, num]
    );
  };

  const handleAddNewNote = () => {
    if (!newNoteText.trim() || detailModalTooth === null) return;
    
    setToothFindings(prev => {
      const updated = { ...prev };
      const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      
      const existingNotes = updated[detailModalTooth]?.notes || [];
      updated[detailModalTooth] = {
        ...updated[detailModalTooth],
        notes: [...existingNotes, { date: today, text: newNoteText }]
      };
      return updated;
    });
    
    setNewNoteText('');
  };

  // Toggle missing status for selected teeth
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

  return (
    <Box>
      <ClinicalNavbar />
      <Box sx={{ mb: 3, px: 4, mt: 3 }}>
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
          {/* Left Column - Sidebar (30% Width) */}
          <Box sx={{ width: '30%', flex: '0 0 30%' }}>
            <Box sx={{ width: '100%', bgcolor: "#fff", p: 0, height: 'calc(100vh - 250px)', overflowY: "auto", border: "1px solid #ccc" }}>
            
              {/* Top Filter Bar */}
              <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', p: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>
                  {selectedTeeth.length > 0 ? "Unerupted" : "Erupted"} | Resolve
                </Typography>
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
                missingTeeth={missingTeeth}
                onMissingTeethClick={handleMarkMissing}
              />
              
              <Lesions 
                expanded={expandedSections.lesions}
                onToggle={() => toggleSection('lesions')}
                toothFindings={toothFindings}
                setToothFindings={setToothFindings}
                selectedTeeth={selectedTeeth}
                setSelectedTeeth={setSelectedTeeth}
                activeToothNum={activeToothNum}
                setActiveToothNum={setActiveToothNum}
              />
              
              <Watch 
                expanded={expandedSections.watch}
                onToggle={() => toggleSection('watch')}
                toothFindings={toothFindings}
                setToothFindings={setToothFindings}
                selectedTeeth={selectedTeeth}
                setSelectedTeeth={setSelectedTeeth}
                activeToothNum={activeToothNum}
                setActiveToothNum={setActiveToothNum}
                setDetailModalTooth={setDetailModalTooth}
              />
              
              <ExistingRestorations 
                expanded={expandedSections.existingRestorations}
                onToggle={() => toggleSection('existingRestorations')}
                toothFindings={toothFindings}
                setToothFindings={setToothFindings}
                selectedTeeth={selectedTeeth}
                setSelectedTeeth={setSelectedTeeth}
                activeToothNum={activeToothNum}
                setActiveToothNum={setActiveToothNum}
              />
              
              <Wear />
              <Concerns />
              <Appliances />
            </Box>
          </Box>

          {/* Right Column - Tooth Chart (70% Width) */}
          <Grid item xs={8.5} sx={{ position: 'relative', bgcolor: '#fff', ml: 2, flexGrow: 1 }}>
            
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
                  {/* Upper Row */}
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1.5 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <Tooth 
                        key={n} 
                        num={n} 
                        isActive={selectedTeeth.includes(n)} 
                        isMissing={missingTeeth.includes(n)}
                        hasRadiolucency={Boolean(toothFindings[n]?.findings?.includes('Coronal cavitation (Caries)'))}
                        hasWatch={Boolean(toothFindings[n]?.findings?.includes('Watch'))}
                        surfaces={toothFindings[n]?.surfaces || []}
                        depth={toothFindings[n]?.depth || 'Limited to enamel'}
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
                  
                  {/* Lower Row */}
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {[32, 31, 30, 29, 28].map(n => (
                      <Tooth 
                        key={n} 
                        num={n} 
                        isActive={selectedTeeth.includes(n)} 
                        isMissing={missingTeeth.includes(n)}
                        hasRadiolucency={Boolean(toothFindings[n]?.findings?.includes('Coronal cavitation (Caries)'))}
                        hasWatch={Boolean(toothFindings[n]?.findings?.includes('Watch'))}
                        surfaces={toothFindings[n]?.surfaces || []}
                        depth={toothFindings[n]?.depth || 'Limited to enamel'}
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
                        hasRadiolucency={Boolean(toothFindings[n]?.findings?.includes('Coronal cavitation (Caries)'))}
                        hasWatch={Boolean(toothFindings[n]?.findings?.includes('Watch'))}
                        surfaces={toothFindings[n]?.surfaces || []}
                        depth={toothFindings[n]?.depth || 'Limited to enamel'}
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
                        hasRadiolucency={Boolean(toothFindings[n]?.findings?.includes('Coronal cavitation (Caries)'))}
                        hasWatch={Boolean(toothFindings[n]?.findings?.includes('Watch'))}
                        surfaces={toothFindings[n]?.surfaces || []}
                        depth={toothFindings[n]?.depth || 'Limited to enamel'}
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
                        hasRadiolucency={Boolean(toothFindings[n]?.findings?.includes('Coronal cavitation (Caries)'))}
                        hasWatch={Boolean(toothFindings[n]?.findings?.includes('Watch'))}
                        surfaces={toothFindings[n]?.surfaces || []}
                        depth={toothFindings[n]?.depth || 'Limited to enamel'}
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
                        hasRadiolucency={Boolean(toothFindings[n]?.findings?.includes('Coronal cavitation (Caries)'))}
                        hasWatch={Boolean(toothFindings[n]?.findings?.includes('Watch'))}
                        surfaces={toothFindings[n]?.surfaces || []}
                        depth={toothFindings[n]?.depth || 'Limited to enamel'}
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
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 10, ml: 2 }}>
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

        {/* Tooth Details Modal */}
        <Dialog
          open={detailModalTooth !== null}
          onClose={() => setDetailModalTooth(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              p: 4,
              borderRadius: '8px',
              position: 'relative',
              minHeight: '350px'
            }
          }}
        >
          <IconButton
            onClick={() => setDetailModalTooth(null)}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#aaa' }}
          >
            <CloseIcon />
          </IconButton>

          {detailModalTooth !== null && toothFindings[detailModalTooth] && (
            <Grid container spacing={4}>
              {/* Left Column: Findings & Diagnosis */}
              <Grid item xs={6} sx={{ pr: 2 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#1a2735',
                    borderBottom: '2px solid #0f766e',
                    pb: 1,
                    display: 'inline-block',
                    minWidth: '150px',
                    fontFamily: "'Manrope', sans-serif"
                  }}
                >
                  Tooth #{detailModalTooth}
                </Typography>

                <Typography sx={{ mt: 3, fontWeight: 'bold', fontSize: '0.95rem', color: '#333' }}>
                  Initial Findings {toothFindings[detailModalTooth].notes?.[0]?.date || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </Typography>
                
                <Box sx={{ mt: 1, pl: 1 }}>
                  {toothFindings[detailModalTooth].findings.map(finding => {
                    const depth = toothFindings[detailModalTooth].depth || 'Limited to enamel';
                    const surfacesStr = (toothFindings[detailModalTooth].surfaces || []).map(s => s === 'O/I' ? 'O' : s).join('');
                    
                    // Capitalize depth
                    const depthCapitalized = depth.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    
                    // Determine finding display string
                    let displayStr = '';
                    if (finding === 'Coronal cavitation (Caries)') {
                      displayStr = `Caries Active ${depthCapitalized}: ${surfacesStr}`;
                    } else if (finding === 'Watch') {
                      displayStr = `Watch`;
                    } else if (finding === 'Existing Restoration (Direct)') {
                      const rType = toothFindings[detailModalTooth].restorationType || 'Composite';
                      displayStr = `Existing Restoration (${rType}): ${surfacesStr}`;
                    } else {
                      displayStr = finding;
                    }
                    
                    return (
                      <Typography key={finding} sx={{ fontSize: '0.85rem', color: '#555', mb: 0.5 }}>
                        - {displayStr}
                      </Typography>
                    );
                  })}
                  <Typography sx={{ fontSize: '0.85rem', color: '#555', mb: 0.5 }}>
                    - Pulpal Concern
                  </Typography>
                </Box>

                <Typography sx={{ mt: 3, fontWeight: 'bold', fontSize: '0.95rem', color: '#333' }}>
                  Diagnosis
                </Typography>
                <Box sx={{ mt: 1, pl: 1 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>
                    - Caries
                  </Typography>
                </Box>
              </Grid>

              {/* Vertical Divider & Right Column: Notes */}
              <Grid item xs={6} sx={{ borderLeft: '1px solid #0f766e', pl: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a2735', mb: 2, fontFamily: "'Manrope', sans-serif" }}>
                  Notes
                </Typography>

                <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2, pr: 1 }}>
                  {(toothFindings[detailModalTooth].notes || []).map((note, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>
                        {note.date}
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#666', pl: 1, mt: 0.5 }}>
                        - {note.text}
                      </Typography>
                    </Box>
                  ))}
                  {(!toothFindings[detailModalTooth].notes || toothFindings[detailModalTooth].notes.length === 0) && (
                    <Typography sx={{ fontSize: '0.85rem', color: '#bbb', fontStyle: 'italic' }}>
                      No notes added yet.
                    </Typography>
                  )}
                </Box>

                {/* New Note input */}
                <Box sx={{ mt: 4 }}>
                  <TextField
                    variant="standard"
                    placeholder="New Note"
                    fullWidth
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewNote();
                      }
                    }}
                    sx={{
                      '& .MuiInput-underline:before': { borderBottomColor: '#ccc' },
                      '& .MuiInput-underline:after': { borderBottomColor: '#0f766e' },
                      '& input': { fontSize: '0.9rem', color: '#555' }
                    }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddNewNote}
                    sx={{ 
                      mt: 1.5, 
                      bgcolor: '#0f766e', 
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#0d5e58' }
                    }}
                  >
                    Save Note
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default TeethStructureExam;