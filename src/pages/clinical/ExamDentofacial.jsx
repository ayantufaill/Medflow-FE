import React, { useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup, IconButton, Paper, Divider, Button, Grid, Chip } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import { 
  Add as AddIcon, 
  CalendarToday as CalendarIcon
} from "@mui/icons-material";
import { fontSize, fontWeight } from "../../constants/styles";

// --- THEME & STYLES ---
const COLORS = {
  blue: "#4A90E2",
  lightBlue: "#f0f7ff",
  border: "#e0e0e0",
  textHeader: "#1a2735",
  textMain: "#333",
  textSecondary: "#555",
  danger: "#d32f2f"
};

const styles = {
  header: { fontWeight: fontWeight.bold, fontSize: fontSize.sm, color: COLORS.textHeader, mb: 1 }
};

// Helper function for color-coded radio buttons
const getRadioStyle = (color) => ({
  color: color,
  '&.Mui-checked': { color: color },
});

// Data arrays for dynamic form rendering - API-ready structure
const DENTAL_EXAM_DATA = {
  checkboxes: [
    { id: 'analysis_not_required', label: 'Analysis not required' },
    { id: 'analysis_required', label: 'Analysis required' },
    { id: 'data_collected', label: 'Data collected' },
    { id: 'further_data_required', label: 'Further data required' }
  ],
  sections: [
    {
      id: 'tooth_color',
      label: 'Tooth color:',
      type: 'radio',
      options: [
        { value: 'acceptable', label: 'Acceptable', color: '#2ecc71' },
        { value: 'not-white', label: 'not white enough', color: '#f1c40f' },
        { value: 'too-white', label: 'too white', color: '#f39c12' },
        { value: 'no-match', label: 'do not match', color: '#e74c3c' }
      ],
      additionalNote: '+ Developmental Disturbances:'
    },
    {
      id: 'tooth_position',
      label: 'Tooth position:',
      type: 'radio',
      expandable: true,
      options: [
        { value: 'pos-acc', label: 'Acceptable', color: '#2ecc71' },
        { value: 'pos-imp', label: 'Possible improvement', color: '#f1c40f' }
      ]
    },
    {
      id: 'tooth_alignment',
      label: 'Tooth Alignment:',
      type: 'radio',
      expandable: true,
      options: [
        { value: 'well', label: 'Well aligned', color: '#2ecc71' },
        { value: 'mis', label: 'Mis-aligned', color: '#f1c40f' },
        { value: 'sig-mis', label: 'Significantly mis-aligned', color: '#e74c3c' }
      ]
    },
    {
      id: 'gum_displays',
      type: 'gum_display_group',
      subsections: [
        {
          label: 'Maxillary gum display with excessive smiling:',
          expandable: true,
          options: [
            { value: 'm-none', label: 'No gum display', color: '#2ecc71' },
            { value: 'm-mod', label: 'Moderate gum display', color: '#f1c40f' },
            { value: 'm-sig', label: 'Significant gum display', color: '#e74c3c' }
          ],
          hasAcceptableCheckbox: true
        },
        {
          label: 'Mandibular gum display when speaking:',
          expandable: false,
          options: [
            { value: 'man-none', label: 'No gum display', color: '#2ecc71' },
            { value: 'man-mod', label: 'Moderate gum display', color: '#f1c40f' },
            { value: 'man-sig', label: 'Significant gum display', color: '#e74c3c' }
          ],
          hasAcceptableCheckbox: true
        }
      ]
    }
  ]
};

// Dental Exam Form Component
const DentalExamForm = () => {
  return (
    <Box sx={{ maxWidth: '100%' }}>
      {/* Top Header Row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>
          DH
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {DENTAL_EXAM_DATA.checkboxes.map((checkbox) => (
            <FormControlLabel
              key={checkbox.id}
              control={<Checkbox size="small" sx={{ p: 0 }} />}
              label={<Typography variant="caption">{checkbox.label}</Typography>}
              sx={{ '& .MuiFormControlLabel-label': { fontSize: fontSize.xs } }}
            />
          ))}
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 0 }}>
        {/* Render each section dynamically */}
        {DENTAL_EXAM_DATA.sections.map((section, index) => (
          <React.Fragment key={section.id}>
            {index > 0 && <Divider />}
            
            {section.type === 'gum_display_group' ? (
              // Special handling for gum display group
              <Box sx={{ p: 1 }}>
                {section.subsections.map((subsec, subIndex) => (
                  <React.Fragment key={subIndex}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.sm }}>{subsec.label}</Typography>
                      {subsec.expandable && (
                        <IconButton size="small" sx={{ p: 0.2 }}><ExpandMoreIcon sx={{ fontSize: 14 }} /></IconButton>
                      )}
                    </Box>
                    <RadioGroup row sx={{ gap: 0.5, mb: subsec.hasAcceptableCheckbox ? 1 : 0 }}>
                      {subsec.options.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio size="small" sx={getRadioStyle(option.color)} />}
                          label={<Typography variant="caption">{option.label}</Typography>}
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: fontSize.xs } }}
                        />
                      ))}
                      {subsec.hasAcceptableCheckbox && (
                        <FormControlLabel
                          control={<Checkbox size="small" sx={{ p: 0 }} />}
                          label={<Typography variant="caption">Acceptable</Typography>}
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: fontSize.xs } }}
                        />
                      )}
                    </RadioGroup>
                  </React.Fragment>
                ))}
              </Box>
            ) : (
              // Standard radio button sections
              <Box sx={{ p: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: fontWeight.semibold, mb: 0.5, fontSize: fontSize.sm }}>{section.label}</Typography>
                <RadioGroup row sx={{ gap: 1 }}>
                  {section.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" sx={getRadioStyle(option.color)} />}
                      label={<Typography variant="caption">{option.label}</Typography>}
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: fontSize.xs } }}
                    />
                  ))}
                </RadioGroup>
                {section.additionalNote && (
                  <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: fontSize.xs }}>
                    {section.additionalNote}
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Add expandable icon for sections that need it */}
            {section.expandable && section.type !== 'gum_display_group' && (
              <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                <IconButton size="small" sx={{ p: 0.2 }}><ExpandMoreIcon sx={{ fontSize: 14 }} /></IconButton>
              </Box>
            )}
          </React.Fragment>
        ))}
      </Paper>

      {/* Delete Button */}
      <Button 
        variant="contained" 
        sx={{ 
          mt: 2, 
          bgcolor: '#e74c3c', 
          '&:hover': { bgcolor: '#c0392b' }, 
          textTransform: 'none', 
          px: 3,
          fontWeight: fontWeight.semibold,
          fontSize: fontSize.sm
        }} 
      >
        Delete Exam
      </Button>
    </Box>
  );
};

// Data arrays for form fields
const examFields = {
  leftColumn: [
    {
      field: "facialPattern",
      label: "Facial Pattern",
      options: [
        { value: "Mesofacial", label: "Mesofacial" },
        { value: "Brachyfacial", label: "Brachyfacial (wide)" },
        { value: "Dolichofacial", label: "Dolichofacial (long)" }
      ]
    },
    {
      field: "tongueROMRatio",
      label: "Tongue ROM Ratio (TRMR)",
      options: [
        { value: "Grade 1", label: "Grade 1 (>80%)" },
        { value: "Grade 2", label: "Grade 2 (50-80%)" },
        { value: "Grade 3", label: "Grade 3 (<50%)" },
        { value: "Grade 4", label: "Grade 4 (<25%)" }
      ]
    }
  ],
  rightColumn: [
    {
      field: "tonsilSize",
      label: "Tonsil size (Brodsky)",
      options: [
        { value: "1", label: "Grade 1 (<25%)" },
        { value: "2", label: "Grade 2 (26-50%)" },
        { value: "3", label: "Grade 3 (51-75%)" },
        { value: "4", label: "Grade 4 (>75%)" }
      ]
    },
    {
      field: "nasalBreathing",
      label: "Nasal Breathing Test",
      options: [
        { value: "3+", label: "3+ min" },
        { value: "2-3", label: "2-3 min" },
        { value: "1-2", label: "1-2 min" },
        { value: "<1", label: "< 1min" }
      ]
    }
  ]
};

const ExamDentofacial = () => {
  const [visitDates, setVisitDates] = useState([
    'Mar 26, 2026'
  ]);

  const handleNewExam = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setVisitDates([...visitDates, today]);
  };

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
      
      <Box sx={{ p: 2, bgcolor: "#fff", maxWidth: "100%", fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
        
        {/* 1. TOP UTILITY BAR */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, overflowX: 'auto' }}>
          <VisitDatesTimeline
            visitDates={visitDates}
            onRemoveDate={handleRemoveDate}
          />
          <Button 
            startIcon={<AddIcon />} 
            size="small" 
            sx={{ textTransform: "none", color: COLORS.textSecondary, fontSize: fontSize.sm, whiteSpace: 'nowrap', flexShrink: 0 }}
            onClick={handleNewExam}
          >
            New Exam
          </Button>
        </Box>

        
        <Grid container spacing={2}>
          {/* LEFT COLUMN - DENTAL EXAM FORM */}
          <Grid item xs={12} md={6} sx={{ flex: '0 0 50%', maxWidth: '60%' }}>
            
            <DentalExamForm />
          </Grid>

          {/* RIGHT COLUMN - VISUAL IMAGES */}
          <Grid item xs={12} md={6} sx={{ flex: '0 0 40%', maxWidth: '40%' }}>
            
            <Box 
              sx={{ 
                marginTop: '1.5rem',
                width: '100%', 
                height: '410px', 
                mb: 1, 
                overflow: 'hidden', 
                borderRadius: '4px',
                border: `1px solid ${COLORS.border}`
              }}
            >
              <img 
                src="/white_teeth.png" 
                alt="Frontal View" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            
            <Box 
              sx={{ 
                width: '100%', 
                height: '410px', 
                mb: 1, 
                overflow: 'hidden', 
                borderRadius: '4px',
                border: `1px solid ${COLORS.border}`
              }}
            >
              <img 
                src="/before_treatment.png" 
                alt="Profile View" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            
            <Box 
              sx={{ 
                width: '100%', 
                height: '410px', 
                overflow: 'hidden', 
                borderRadius: '4px',
                border: `1px solid ${COLORS.border}`
              }}
            >
              <img 
                src="/repaired_teeth.png" 
                alt="Occlusal View" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ExamDentofacial;
