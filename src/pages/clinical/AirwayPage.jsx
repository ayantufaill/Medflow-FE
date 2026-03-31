import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Divider,
  Button,
  Chip,
  Checkbox,
  TextField
} from "@mui/material";
import { Add as AddIcon, CalendarToday as CalendarIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { fontSize, fontWeight } from "../../constants/styles";

// Custom styles to match the UI precisely
const labelStyle = {
  fontSize: fontSize.sm,
  fontWeight: fontWeight.semibold,
  textDecoration: "underline",
  color: "#333",
  cursor: "pointer",
  "&:hover": { color: "#000" },
  wordWrap: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
  lineHeight: 1.2,
  margin:"1rem"
};

const optionLabelStyle = {
  margin: 0,
  "& .MuiFormControlLabel-label": {
    fontSize: fontSize.sm,
    color: "#555",
    lineHeight: 1,
    paddingLeft: "2px"
  },
  "& .MuiRadio-root": {
    padding: "2px",
  }
};

// Helper component for smaller radio buttons
const SmallRadio = (props) => (
  <Radio size="small" sx={{ transform: "scale(0.8)", ...props.sx }} {...props} />
);

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
      field: "facialProfile",
      label: "Facial Profile",
      options: [
        { value: "Normal", label: "Normal" },
        { value: "Convex", label: "Convex" },
        { value: "Concave", label: "Concave" }
      ]
    },
    {
      field: "dentalProfile",
      label: "Dental Profile",
      options: [
        { value: "Class I", label: "Class I" },
        { value: "Class II", label: "Class II" },
        { value: "Class III", label: "Class III" }
      ]
    },
    {
      field: "tongueROMRatio",
      label: "Tongue Range of Motion Ratio (TRMR)",
      options: [
        { value: "Grade 1", label: "Grade 1 (>80%)" },
        { value: "Grade 2", label: "Grade 2 (50-80%)" },
        { value: "Grade 3", label: "Grade 3 (<50%)" },
        { value: "Grade 4", label: "Grade 4 (<25%)" }
      ]
    },
    {
      field: "kotlowTongueTie",
      label: "Kotlow Tongue Tie",
      options: [
        { value: "Normal", label: "Normal or mild (12-16mm)" },
        { value: "Moderate", label: "Moderate (8-12mm)" },
        { value: "Severe", label: "Severe (4-8mm)" },
        { value: "Complete", label: "Complete (0-4mm)" }
      ]
    },
    {
      field: "kotlowLipTie",
      label: "Kotlow Lip Tie Attachment",
      type: "checkbox",
      options: [
        { value: "mucosal", label: "Mucosal" },
        { value: "gingival", label: "Gingival" },
        { value: "interdentalPapilla", label: "Interdental papilla" },
        { value: "palatinePapilla", label: "Palatine papilla" }
      ]
    },
    {
      field: "mentalisStrain",
      label: "Mentalis Strain",
      options: [
        { value: "No", label: "No chin strain" },
        { value: "Mild", label: "Mild chin strain" },
        { value: "Moderate", label: "Moderate chin strain" },
        { value: "Severe", label: "Severe chin strain" }
      ]
    },
    {
      field: "mallampati",
      label: "Mallampati",
      options: [
        { value: "1", label: "Class 1" },
        { value: "2", label: "Class 2" },
        { value: "3", label: "Class 3" },
        { value: "4", label: "Class 4" }
      ]
    }
  ],
  rightColumn: [
    {
      field: "tonsilSize",
      label: "Tonsil size (Brodsky scale)",
      options: [
        { value: "1", label: "Grade 1 (<25%)" },
        { value: "2", label: "Grade 2 (26-50%)" },
        { value: "3", label: "Grade 3 (51-75%)" },
        { value: "4", label: "Grade 4 (>75%)" }
      ]
    },
    {
      field: "maxillaryIntercanine",
      label: "Maxillary Intercanine Distance",
      options: [
        { value: "Wide", label: "Wide (>37mm)" },
        { value: "Neutral", label: "Neutral (31-37mm)" },
        { value: "Narrow", label: "Narrow (<31mm)" }
      ]
    },
    {
      field: "maxillaryIntermolar",
      label: "Maxillary Intermolar Distance (Mesiobuccal cusp)",
      options: [
        { value: "Wide", label: "Wide (>52mm)" },
        { value: "Neutral", label: "Neutral (46-52mm)" },
        { value: "Narrow", label: "Narrow (<46mm)" }
      ]
    },
    {
      field: "incisorDisplay",
      label: "Incisor Display at Rest",
      options: [
        { value: "0-25", label: "0-25%" },
        { value: "26-50", label: "26-50%" },
        { value: "51-75", label: "51-75%" },
        { value: "76-100", label: "76-100%" }
      ]
    },
    {
      field: "bruxism",
      label: "Bruxism",
      options: [
        { value: "No", label: "No wear detected" },
        { value: "Mild", label: "Mild dental wear" },
        { value: "Moderate", label: "Moderate dental wear" },
        { value: "Severe", label: "Severe dental wear" }
      ]
    },
    {
      field: "swallowingTest",
      label: "Swallowing Tongue Thrust Compensation Test",
      options: [
        { value: "Ease", label: "Swallow with ease" },
        { value: "Difficulty", label: "Swallow with difficulty" },
        { value: "Unable", label: "Unable to swallow without tongue thrust compensation" }
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

const SectionRow = ({ label, children }) => (
  <Grid container spacing={0} sx={{ mb: 2, alignItems: "center", flexWrap: 'nowrap' }}>
    <Grid item xs={5}>
      <Typography sx={labelStyle}>{label}</Typography>
    </Grid>
    <Grid item xs={7}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {children}
      </Box>
    </Grid>
  </Grid>
);

// Reusable Form Field Component
const FormField = ({ fieldConfig, value, onChange, onCheckboxChange }) => {
  if (fieldConfig.type === "checkbox") {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {fieldConfig.options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                size="small"
                checked={value[option.value] || false}
                onChange={(e) => onCheckboxChange(option.value, e.target.checked)}
              />
            }
            label={option.label}
            sx={optionLabelStyle}
          />
        ))}
      </Box>
    );
  }

  return (
    <RadioGroup
      row
      value={value || ""}
      onChange={(e) => onChange(fieldConfig.field, e.target.value)}
    >
      {fieldConfig.options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<SmallRadio />}
          label={option.label}
          sx={optionLabelStyle}
        />
      ))}
    </RadioGroup>
  );
};

const AirwayPage = () => {
  const [risk, setRisk] = useState("High");
  const [formData, setFormData] = useState({
    // Left Column
    facialPattern: "Mesofacial",
    facialProfile: "Normal",
    dentalProfile: "Class I",
    tongueROMRatio: "Grade 2",
    kotlowTongueTie: "",
    kotlowLipTie: {
      mucosal: false,
      gingival: true,
      interdentalPapilla: false,
      palatinePapilla: false
    },
    mentalisStrain: "Severe",
    mallampati: "4",
    
    // Right Column
    tonsilSize: "",
    maxillaryIntercanine: "",
    maxillaryIntermolar: "",
    incisorDisplay: "",
    bruxism: "Moderate",
    swallowingTest: "Difficulty",
    nasalBreathing: "",
    
    // Notes
    notes: ""
  });

  // Update form field handler
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox changes for Kotlow Lip Tie
  const handleLipTieChange = (subField, checked) => {
    setFormData(prev => ({
      ...prev,
      kotlowLipTie: {
        ...prev.kotlowLipTie,
        [subField]: checked
      }
    }));
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
      <Box sx={{ p: 2, bgcolor: "#fff", minHeight: "100vh", fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      {/* Header Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Chip
          icon={<CalendarIcon sx={{ fontSize: "12px !important" }} />}
          label="05/22/2025"
          variant="outlined"
          sx={{ borderRadius: "16px", bgcolor: "#f0f7ff", border: "none", color: "#1976d2", height: 28 }}
        />
        <Button startIcon={<AddIcon />} sx={{ textTransform: "none", color: "#555", minWidth: "auto", px: 1.5, py: 0.5, fontSize: fontSize.sm }}>
          New Exam
        </Button>
      </Box>

      {/* Airway Risk Selector */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>Airway Risk:</Typography>
        <RadioGroup row value={risk} onChange={(e) => setRisk(e.target.value)}>
          <FormControlLabel
            value="Low"
            control={<SmallRadio sx={{ color: "green", "&.Mui-checked": { color: "green" } }} />}
            label="Low"
            sx={optionLabelStyle}
          />
          <FormControlLabel
            value="Moderate"
            control={<SmallRadio sx={{ color: "#ffd700", "&.Mui-checked": { color: "#ffd700" } }} />}
            label="Moderate"
            sx={optionLabelStyle}
          />
          <FormControlLabel
            value="High"
            control={<SmallRadio sx={{ color: "red", "&.Mui-checked": { color: "red" } }} />}
            label="High"
            sx={optionLabelStyle}
          />
        </RadioGroup>
      </Box>

      <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.sm, mb: 1 }}>FAirEST 15 Exam</Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container sx={{ display: 'flex', flexWrap: 'nowrap', width: '100%' }}>
        {/* LEFT COLUMN */}
        <Grid 
          item 
          sx={{ 
            flex: '0 0 50%',
            borderRight: "1px solid #e0e0e0", 
            pr: 2, 
            boxSizing: 'border-box',
            minWidth: 0
          }}
        >
          {examFields.leftColumn.map((fieldConfig) => (
            <SectionRow key={fieldConfig.field} label={fieldConfig.label}>
              <FormField
                fieldConfig={fieldConfig}
                value={formData[fieldConfig.field]}
                onChange={handleFieldChange}
                onCheckboxChange={handleLipTieChange}
              />
            </SectionRow>
          ))}
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid 
          item 
          sx={{ 
            flex: '0 0 50%',
            pl: 2, 
            boxSizing: 'border-box',
            minWidth: 0
          }}
        >
          {examFields.rightColumn.map((fieldConfig) => (
            <SectionRow key={fieldConfig.field} label={fieldConfig.label}>
              <FormField
                fieldConfig={fieldConfig}
                value={formData[fieldConfig.field]}
                onChange={handleFieldChange}
              />
            </SectionRow>
          ))}
        </Grid>
      </Grid>

      {/* Notes Section */}
      <Box sx={{ mt: 4, maxWidth: '50%', pr: 2 }}>
        <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, textDecoration: "underline", color: "#333", mb: 1, lineHeight: 1.2 }}>Notes:</Typography>
        <TextField 
          fullWidth 
          multiline 
          rows={4} 
          placeholder="Enter clinical notes here..."
          variant="outlined"
          value={formData.notes}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: fontSize.sm,
            },
          }}
        />
        <Button 
          variant="contained" 
          sx={{ 
            mt: 2, 
            bgcolor: '#e74c3c', 
            '&:hover': { bgcolor: '#c0392b' }, 
            textTransform: 'none', 
            px: 3,
            fontWeight: fontWeight.bold,
            fontSize: fontSize.sm
          }} 
        >
          Delete Exam
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default AirwayPage;