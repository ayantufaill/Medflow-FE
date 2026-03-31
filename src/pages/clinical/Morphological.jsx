import React, { useState } from 'react';
import {
  Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup,
  Select, MenuItem, Button, Grid, IconButton, Divider, Chip, TextField, InputAdornment
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import { fontSize, fontWeight } from "../../constants/styles";

// Custom Radio with the grey/dark theme from the image
const StyledRadio = (props) => (
  <Radio
    {...props}
    size="small"
    sx={{ 
      color: '#999', 
      '&.Mui-checked': { color: '#555' },
      '& .MuiSvgIcon-root': { fontSize: 20 } 
    }}
  />
);

const SectionTitle = ({ children, underlined }) => (
  <Typography variant="body1" sx={{ 
    fontWeight: fontWeight.medium, 
    color: '#455a64', 
    mb: 1, 
    borderBottom: underlined ? '1px solid #cfd8dc' : 'none',
    width: underlined ? 'fit-content' : 'auto',
    pr: underlined ? 4 : 0,
    fontSize: fontSize.sm
  }}>
    {children}
  </Typography>
);

// Helper for the Right/Left rows
const SideRow = ({ label, options, value, onChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', ml: 4, mb: 0.5 }}>
    <Typography sx={{ width: 80, fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: '#333' }}>{label}</Typography>
    <RadioGroup row value={value || ''} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <FormControlLabel
          key={opt.value}
          value={opt.value}
          control={<StyledRadio />}
          label={<Typography variant="caption" sx={{ fontStyle: 'italic', fontSize: fontSize.sm }}>{opt.label}</Typography>}
          sx={{ mr: 3 }}
        />
      ))}
    </RadioGroup>
  </Box>
);

// Data arrays for API integration
const MORPHOLOGICAL_DATA = {
  canineClassification: [
    { value: '1', label: 'Class I' },
    { value: '2', label: 'Class II' },
    { value: '3', label: 'Class III' }
  ],
  posteriorCrossbite: [
    { value: 'none', label: 'None' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' }
  ],
  molarClassification: [
    { value: '1', label: 'Class I' },
    { value: '2', label: 'Class II' },
    { value: '3', label: 'Class III' }
  ],
  primaryMolarRelationship: [
    { value: 'straight', label: 'Straight' },
    { value: 'mesialStep', label: 'Mesial Step' },
    { value: 'distalStep', label: 'Distal Step' },
    { value: 'primateSpace', label: 'Primate Space' }
  ],
  anteriorToothShape: [
    { value: 'oval', label: 'Oval' },
    { value: 'rectangular', label: 'Rectangular' },
    { value: 'triangular', label: 'Triangular' }
  ],
  midline: [
    { value: 'acceptable', label: 'Acceptable' },
    { value: 'right', label: 'Right' },
    { value: 'left', label: 'Left' }
  ],
  axialInclination: [
    { value: 'vertical', label: 'Vertical in the face' },
    { value: 'right', label: 'Right' },
    { value: 'left', label: 'Left' }
  ],
  toothPosition: [
    { id: 'crossBite', label: 'Cross Bite' },
    { id: 'openBite', label: 'Open Bite' },
    { id: 'crowdingOverlap', label: 'Crowding/Overlap' },
    { id: 'diastema', label: 'Diastema' },
    { id: 'rotation', label: 'Rotation' }
  ]
};

const Morphological = () => {
  // State for visit dates timeline
  const [visitDates, setVisitDates] = useState([
    'Sep 29, 2023',
    'Apr 26, 2024',
    'Jul 03, 2024'
  ]);

  // Form state for API submission
  const [formData, setFormData] = useState({
    // Canine Classification
    canineRight: '',
    canineLeft: '',
    
    // Posterior Crossbite
    posteriorCrossbite: [],
    
    // Orthodontic Classification
    overbite: 2,
    overbitePercent: '',
    overjet: 1,
    
    // Molar Classification
    molarRight: '',
    molarLeft: '',
    
    // Primary Molar Relationship
    primaryMolarRight: '',
    primaryMolarLeft: '',
    
    // Anterior Tooth Shape
    anteriorToothShape: '',
    
    // Midline
    midline: '',
    midlineMm: '',
    
    // Axial Inclination
    axialInclination: '',
    
    // Tooth Position (right column)
    toothPosition: {
      crossBite: { value: '', selectedTeeth: [] },
      openBite: { value: '', selectedTeeth: [] },
      crowdingOverlap: { value: '', selectedTeeth: [] },
      diastema: { value: '', selectedTeeth: [] },
      rotation: { value: '', selectedTeeth: [] }
    },
    
    // Status flags
    analysisRequired: false,
    analysisReferred: false,
    noFindings: false
  });

  // Handle remove date from timeline
  const handleRemoveDate = (indexToRemove) => {
    setVisitDates(visitDates.filter((_, index) => index !== indexToRemove));
  };

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox changes for arrays
  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, field] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== field) };
      }
    });
  };

  // Handle tooth position changes
  const handleToothPositionChange = (itemId, changeType, value) => {
    setFormData(prev => ({
      ...prev,
      toothPosition: {
        ...prev.toothPosition,
        [itemId]: {
          ...prev.toothPosition[itemId],
          [changeType]: value
        }
      }
    }));
  };

  // Handle adding selected teeth
  const handleAddTeeth = (itemId) => {
    // This would open a dialog to select teeth numbers
    console.log('Add teeth for:', itemId);
    // TODO: Implement tooth selection dialog
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Form data:', formData);
    // TODO: API call to save morphological data
  };

  // Handle delete exam
  const handleDeleteExam = () => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      console.log('Delete exam');
      // TODO: API call to delete exam
    }
  };

  // Handle new exam
  const handleNewExam = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setVisitDates([...visitDates, today]);
    console.log('Create new exam');
    // TODO: Navigate to new exam form or reset form
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
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: fontSize.sm }}>
          Patient examination records and clinical findings
        </Typography>
      </Box>
      <ExamNavbar />
      
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

        {/* 2. Status Row */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, mr: 2, fontSize: fontSize.xs }}>DH</Typography>
          <FormControlLabel 
            control={
              <Checkbox 
                size="small" 
                checked={formData.analysisRequired}
                onChange={(e) => handleFieldChange('analysisRequired', e.target.checked)}
              />
            } 
            label={<Typography variant="body2" sx={{ fontSize: fontSize.xs }}>Analysis required</Typography>} 
          />
          <FormControlLabel 
            control={
              <Checkbox 
                size="small" 
                checked={formData.analysisReferred}
                onChange={(e) => handleFieldChange('analysisReferred', e.target.checked)}
              />
            } 
            label={<Typography variant="body2" sx={{ fontSize: fontSize.xs }}>Analysis referred</Typography>} 
          />
        </Box>

        <SectionTitle underlined>Short morphological analysis</SectionTitle>

        <Grid container spacing={8} sx={{ mt: 1 }}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={7}>
            
            {/* Canine Classification */}
            <Typography variant="body2" sx={{ fontWeight: fontWeight.bold, mt: 2, fontSize: fontSize.xs }}>Canine Classification</Typography>
            {['Right:', 'Left:'].map((side, index) => (
              <Box key={side} sx={{ display: 'flex', alignItems: 'center', ml: 4, mt: 0.5 }}>
                <Typography sx={{ width: 60, fontSize: fontSize.xs }}>{side}</Typography>
                <RadioGroup row 
                  value={formData[index === 0 ? 'canineRight' : 'canineLeft'] || ''}
                  onChange={(e) => handleFieldChange(index === 0 ? 'canineRight' : 'canineLeft', e.target.value)}
                >
                  {MORPHOLOGICAL_DATA.canineClassification.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<StyledRadio />}
                      label={<Typography variant="caption" sx={{ fontSize: fontSize.sm }}>{option.label}</Typography>}
                    />
                  ))}
                </RadioGroup>
              </Box>
            ))}

            {/* Posterior Crossbite */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography sx={{ fontWeight: fontWeight.bold, fontSize: fontSize.xs, mr: 2 }}>Posterior Crossbite:</Typography>
              {MORPHOLOGICAL_DATA.posteriorCrossbite.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      size="small"
                      checked={formData.posteriorCrossbite.includes(option.value)}
                      onChange={(e) => {
                        const current = formData.posteriorCrossbite;
                        if (e.target.checked) {
                          handleFieldChange('posteriorCrossbite', [...current, option.value]);
                        } else {
                          handleFieldChange('posteriorCrossbite', current.filter(v => v !== option.value));
                        }
                      }}
                    />
                  }
                  label={<Typography variant="caption" sx={{ fontSize: fontSize.sm }}>{option.label}</Typography>}
                />
              ))}
            </Box>

            <Box sx={{ mt: 4 }}>
              <SectionTitle underlined>Orthodontic Classification</SectionTitle>
              
              {/* Overbite/Overjet Selects */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Typography sx={{ width: 80, fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>Overbite</Typography>
                <Select 
                  size="small" 
                  value={formData.overbite}
                  onChange={(e) => handleFieldChange('overbite', e.target.value)}
                  sx={{ 
                    height: 30, 
                    width: 80,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInput-underline': { '&:before': { borderBottom: '1px solid rgba(0, 0, 0, 0.23)' }, '&:after': { borderBottom: '1px solid #1976d2' } },
                    '& fieldset': { border: 'none' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #000' }
                  }} 
                  variant="standard"
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
                <TextField 
                  variant="standard" 
                  value={formData.overbitePercent}
                  onChange={(e) => handleFieldChange('overbitePercent', e.target.value)}
                  sx={{ 
                    width: 60, 
                    '& input': { textAlign: 'center', fontSize: fontSize.xs, padding: '4px 0' },
                    '& .MuiInput-root:before': { borderBottom: '1px solid rgba(0, 0, 0, 0.23) !important' },
                    '& .MuiInput-root:after': { borderBottom: '1px solid #1976d2 !important' },
                    '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #000 !important' }
                  }}
                  InputProps={{ 
                    endAdornment: <InputAdornment position="end"><Typography variant="caption">%</Typography></InputAdornment> 
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Typography sx={{ width: 80, fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>Overjet</Typography>
                <Select 
                  size="small" 
                  value={formData.overjet}
                  onChange={(e) => handleFieldChange('overjet', e.target.value)}
                  sx={{ 
                    height: 30, 
                    width: 80,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiInput-underline': { '&:before': { borderBottom: '1px solid rgba(0, 0, 0, 0.23)' }, '&:after': { borderBottom: '1px solid #1976d2' } },
                    '& fieldset': { border: 'none' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #000' }
                  }} 
                  variant="standard"
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </Box>

              {/* Molar Classification */}
              <Typography variant="body2" sx={{ fontWeight: fontWeight.bold, mt: 3, fontSize: fontSize.xs }}>Molar Classification</Typography>
              {['Right:', 'Left:'].map((side, index) => (
                <Box key={side} sx={{ display: 'flex', alignItems: 'center', ml: 4, mt: 0.5 }}>
                  <Typography sx={{ width: 60, fontSize: fontSize.xs }}>{side}</Typography>
                  <RadioGroup row 
                    value={formData[index === 0 ? 'molarRight' : 'molarLeft'] || ''}
                    onChange={(e) => handleFieldChange(index === 0 ? 'molarRight' : 'molarLeft', e.target.value)}
                  >
                    {MORPHOLOGICAL_DATA.molarClassification.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<StyledRadio />}
                        label={<Typography variant="caption" sx={{ fontSize: fontSize.sm }}>{option.label}</Typography>}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ))}

              {/* Primary Molar Relationship */}
              <Typography variant="body2" sx={{ fontWeight: fontWeight.bold, mt: 3, mb: 1, fontSize: fontSize.xs }}>
                Primary Molar Relationship
              </Typography>
              <SideRow 
                label="Right:" 
                options={MORPHOLOGICAL_DATA.primaryMolarRelationship}
                value={formData.primaryMolarRight}
                onChange={(value) => handleFieldChange('primaryMolarRight', value)}
              />
              <SideRow 
                label="Left:" 
                options={MORPHOLOGICAL_DATA.primaryMolarRelationship}
                value={formData.primaryMolarLeft}
                onChange={(value) => handleFieldChange('primaryMolarLeft', value)}
              />

              {/* Anterior Tooth Shape */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                <Typography sx={{ width: 150, fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>
                  Anterior Tooth Shape
                </Typography>
                <RadioGroup row 
                  value={formData.anteriorToothShape || ''}
                  onChange={(e) => handleFieldChange('anteriorToothShape', e.target.value)}
                >
                  {MORPHOLOGICAL_DATA.anteriorToothShape.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<StyledRadio />}
                      label={<Typography variant="caption" sx={{ fontSize: '0.8rem' }}>{option.label}</Typography>}
                      sx={{ mr: 6 }}
                    />
                  ))}
                </RadioGroup>
              </Box>

              {/* Midline */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography sx={{ width: 150, fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>
                  Midline
                </Typography>
                <RadioGroup row sx={{ alignItems: 'center' }}
                  value={formData.midline || ''}
                  onChange={(e) => handleFieldChange('midline', e.target.value)}
                >
                  {MORPHOLOGICAL_DATA.midline.map((option, index) => (
                    <FormControlLabel 
                      key={option.value}
                      value={option.value}
                      control={<StyledRadio />} 
                      label={
                        option.value === 'left' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption">Left</Typography>
                            <TextField 
                              variant="standard" 
                              value={formData.midlineMm}
                              onChange={(e) => handleFieldChange('midlineMm', e.target.value)}
                              sx={{ 
                                width: 50, 
                                '& input': { textAlign: 'center', fontSize: fontSize.xs, padding: '4px 0' },
                                '& .MuiInput-root:before': { borderBottom: '1px solid rgba(0, 0, 0, 0.23) !important' },
                                '& .MuiInput-root:after': { borderBottom: '1px solid #1976d2 !important' },
                                '& .MuiInput-root:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #000 !important' }
                              }}
                              InputProps={{ 
                                endAdornment: <InputAdornment position="end"><Typography variant="caption">mm</Typography></InputAdornment> 
                              }}
                            />
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ fontSize: fontSize.sm }}>{option.label}</Typography>
                        )
                      } 
                      sx={index < 2 ? { mr: 6 } : {}}
                    />
                  ))}
                </RadioGroup>
              </Box>

              {/* Axial Inclination */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography sx={{ width: 150, fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>
                  Axial Inclination
                </Typography>
                <RadioGroup row
                  value={formData.axialInclination || ''}
                  onChange={(e) => handleFieldChange('axialInclination', e.target.value)}
                >
                  {MORPHOLOGICAL_DATA.axialInclination.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<StyledRadio />}
                      label={<Typography variant="caption" sx={{ fontSize: fontSize.sm }}>{option.label}</Typography>}
                      sx={{ mr: option.value === 'vertical' ? 4 : 6 }}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={5} sx={{ borderLeft: '1px solid #eee', pl: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #cfd8dc', mb: 2 }}>
              <Typography sx={{ fontWeight: fontWeight.medium, color: '#455a64', fontSize: fontSize.xs }}>Tooth Position</Typography>
              <FormControlLabel 
                control={
                  <Checkbox 
                    size="small" 
                    checked={formData.noFindings}
                    onChange={(e) => handleFieldChange('noFindings', e.target.checked)}
                  />
                } 
                label={<Typography variant="caption" sx={{ fontStyle: 'italic', fontSize: fontSize.sm }}>no findings</Typography>} 
              />
            </Box>

            {MORPHOLOGICAL_DATA.toothPosition.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
                <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, minWidth: '120px' }}>{item.label}</Typography>
                <RadioGroup row sx={{ flex: 1, justifyContent: 'flex-end' }}
                  value={formData.toothPosition[item.id].value || ''}
                  onChange={(e) => handleToothPositionChange(item.id, 'value', e.target.value)}
                >
                  <FormControlLabel 
                    value="none" 
                    control={<StyledRadio />} 
                    label={<Typography variant="caption" sx={{ fontSize: fontSize.sm }}>none</Typography>} 
                  />
                  <FormControlLabel 
                    value="select" 
                    control={<StyledRadio />} 
                    label={<Typography variant="caption" sx={{ fontSize: fontSize.sm }}>select teeth</Typography>} 
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => handleAddTeeth(item.id)}
                    disabled={!formData.toothPosition[item.id].value}
                  >
                    <AddIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                  </IconButton>
                </RadioGroup>
              </Box>
            ))}

            <Button 
              variant="outlined" 
              startIcon={<PhotoCameraIcon sx={{ bgcolor: '#0d47a1', color: 'white', p: 0.5, borderRadius: 1 }} />}
              sx={{ mt: 4, textTransform: 'none', color: '#999', borderColor: '#eee' }}
              onClick={handleShowPhotos}
            >
              Show Patient Photos
            </Button>
          </Grid>
        </Grid>

        <Button 
          variant="contained" 
          sx={{ mt: 6, bgcolor: '#e74c3c', '&:hover': { bgcolor: '#c0392b' }, textTransform: 'none' }}
          onClick={handleDeleteExam}
        >
          Delete Exam
        </Button>
      </Box>
    </Box>
  );
};

export default Morphological;