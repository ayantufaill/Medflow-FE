import React, { useState } from 'react';
import {
  Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup,
  Divider, Button, Grid, Chip, IconButton, Container, TextField
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import { fontSize, fontWeight } from "../../constants/styles";

// Custom Ring Radio to match the "Acceptable/Warning/Issue" style
const StatusRadio = ({ color, ...props }) => (
  <Radio
    {...props}
    sx={{
      color: color,
      '&.Mui-checked': { color: color },
      '& .MuiSvgIcon-root': { fontSize: 18 },
      padding: '4px'
    }}
  />
);

const SectionHeader = ({ title, status = 'green' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Box sx={{ 
      width: 10, height: 10, borderRadius: '50%', 
      border: `2px solid ${status === 'green' ? '#2ecc71' : '#e74c3c'}`, 
      mr: 1 
    }} />
    <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{title}</Typography>
  </Box>
);

// 1. Theme and Custom styled components for status icons and inputs
const getStatusIconStyle = (color) => ({
  width: 12, height: 12, borderRadius: '50%', border: `2px solid ${color}`, mr: 1, display: 'inline-block'
});

const CustomLabel = ({ text, subText, italic = false }) => (
  <Box>
    <Typography sx={{ fontWeight: fontWeight.regular, fontSize: fontSize.xs, color: '#333', lineHeight: 1.2 }}>
      {text}
    </Typography>
    {subText && (
      <Typography sx={{ fontSize: fontSize.xs, color: '#666', fontStyle: italic ? 'italic' : 'normal' }}>
        {subText}
      </Typography>
    )}
  </Box>
);

const MMInput = ({ value, onChange }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'baseline', ml: 1 }}>
    <TextField
      variant="standard"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ 
        width: 35,
        '& input': { textAlign: 'center', fontSize: fontSize.xs, padding: '2px 0' },
        '& .MuiInput-root:before': { borderBottom: '1px solid #9ca3af !important' },
        '& .MuiInput-root:after': { borderBottom: '1px solid #1976d2 !important' }
      }}
    />
    <Typography variant="caption" sx={{ ml: 0.5, fontSize: fontSize.xs, color: '#333' }}>mm</Typography>
  </Box>
);

const SectionIcon = ({ color }) => (
  <Box sx={{ 
    width: 10, height: 10, borderRadius: '50%', border: `1.5px solid ${color}`, 
    display: 'inline-block', mr: 1, verticalAlign: 'middle' 
  }} />
);

const DentalTmdExamPage = () => {
  // Form state for TMJ exam
  const [formData, setFormData] = useState({
    // Range of Motion
    maxOpening: '',
    deviationOnOpening: 'no',
    restrictedHorizontal: 'no',
    leftLateral: '',
    rightLateral: '',
    deviationDirection: [],
    painWhenInMotion: 'no',
    painTypes: []
  });

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox array changes
  const handleCheckboxArrayChange = (field, item, checked) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, item] };
      } else {
        return { ...prev, [field]: currentArray.filter(i => i !== item) };
      }
    });
  };

  const [visitDates, setVisitDates] = useState([
    'Sep 29, 2023',
    'May 22, 2025'
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
      <Container maxWidth="xl" sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh' }}>
      
      {/* 2. Timeline and Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, overflowX: 'auto' }}>
        <VisitDatesTimeline
          visitDates={visitDates}
          onRemoveDate={handleRemoveDate}
        />
        <Button startIcon={<AddIcon />} sx={{ textTransform: 'none', color: '#777', ml: 2, whiteSpace: 'nowrap', flexShrink: 0 }} onClick={handleNewExam}>New Exam</Button>
      </Box>

      {/* 3. MH/DH Badges */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>MH</Typography>
        <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>DH</Typography>
      </Box>

      {/* 4. Section 1: Range of Motion (Card) */}
      <Box sx={{ border: '1px solid #cfd8dc', borderRadius: 1, mb: 3 }}>
        {/* Point 1: Range of Motion */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#455a64' }}>1. Range of Motion</Typography>
            <IconButton size="small"><KeyboardArrowUpIcon sx={{ color: '#555' }}/></IconButton>
          </Box>

          {/* Outer Section Summaries */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={getStatusIconStyle('#2ecc71')} /> {/* Green Circle */}
            <CustomLabel text="Max opening:" />
            <Typography variant="body2" sx={{ ml: 1 }}>60 mm</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={getStatusIconStyle('#e74c3c')} /> {/* Red Circle */}
            <CustomLabel text="Deviation upon opening:" />
            <RadioGroup row sx={{ ml: 2, gap: 1 }}>
              <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} sx={{ mr: 1 }}/>
              <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked/>} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
            </RadioGroup>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={getStatusIconStyle('#2ecc71')} /> {/* Green Circle */}
            <CustomLabel text="Restricted Horizontal movement:" />
            <RadioGroup row sx={{ ml: 2, gap: 1 }}>
              <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked/>} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} sx={{ mr: 1 }}/>
              <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
            </RadioGroup>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Inner Detailed Grid Layout */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* LEFT FORM COLUMN */}
            <Grid item xs={9}>
              
              {/* Row 1: Maximum Opening */}
              <Grid container alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={3.5}>
                  <CustomLabel text="Maximum Opening"  italic />
                </Grid>
                <Grid item xs={1.5}>
                  <Typography sx={{ fontSize: '13px' }}>60 mm</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <Chip 
                      label="WNL" 
                      variant="outlined" 
                      size="small" 
                      sx={{ height: 18, fontSize: '0.65rem', fontWeight: 'bold', color: '#2ecc71', borderColor: '#2ecc71', borderRadius: '8px' }} 
                    />
                    <Typography sx={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                      Restricted (&lt; 35 mm) &nbsp;&nbsp; Excessive (&gt; 65 mm)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Row 2: Left to Right Movement */}
              <Grid container alignItems="flex-start" sx={{ mb: 2 }}>
                <Grid item xs={3.5}>
                  <CustomLabel text="Left to Right Movement"  italic />
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '13px', minWidth: 70 }}>Left Lateral</Typography>
                    <Box sx={{ borderBottom: '1px solid #333', width: 10, mx: 1, textAlign: 'center' }}>&nbsp;</Box>
                    <Typography sx={{ fontSize: '13px' }}>mm</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '13px', minWidth: 70 }}>Right Lateral</Typography>
                    <Box sx={{ borderBottom: '1px solid #333', width: 50, mx: 1, textAlign: 'center' }}>&nbsp;</Box>
                    <Typography sx={{ fontSize: '13px' }}>mm</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4.5}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#aaa', fontStyle: 'italic' }}>
                    WNL &nbsp; Restricted (&lt; 10 mm)
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#aaa', fontStyle: 'italic' }}>
                    WNL &nbsp; Restricted (&lt; 10 mm)
                  </Typography>
                </Grid>
              </Grid>

              {/* Row 3: Deviation Upon Opening */}
              <Grid container alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={3.5}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>Deviation Upon Opening</Typography>
                </Grid>
                <Grid item xs={2.5}>
                  <RadioGroup row sx={{ gap: 1 }}>
                    <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '14px' }} />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
                    <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked />} label={<Typography sx={{ fontSize: '13px' }}>Yes:</Typography>} />
                  </RadioGroup>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px', fontWeight: 400 }}>Left</Typography>} sx={{ mr: 1 }} />
                    <Typography sx={{ fontSize: '13px', fontStyle: 'italic', color: '#ccc', mr: 2 }}>w/ Reduction</Typography>
                    <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px', fontWeight: 400 }}>Right</Typography>} sx={{ mr: 1 }} />
                    <Typography sx={{ fontSize: '13px', fontStyle: 'italic', color: '#ccc' }}>w/ Reduction</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Row 4: Pain When in Motion */}
              <Grid container alignItems="center">
                <Grid item xs={3.5}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>Pain When in Motion</Typography>
                </Grid>
                <Grid item xs={2.5}>
                  <RadioGroup row sx={{ gap: 1 }}>
                    <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '14px' }} defaultChecked />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
                    <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '2px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Yes:</Typography>} />
                  </RadioGroup>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['Sharp', 'Dull', 'Muscle', 'Right TMJ', 'Left TMJ'].map((text) => (
                      <FormControlLabel 
                        key={text} 
                        control={<Checkbox size="small" />} 
                        label={<Typography sx={{ fontSize: '13px', color: '#ccc', fontStyle: 'italic' }}>{text}</Typography>} 
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* RIGHT DIAGRAM COLUMN */}
            <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', width: 100, height: 100 }}>
                <Typography sx={{ position: 'absolute', left: 0, top: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>R</Typography>
                <Typography sx={{ position: 'absolute', right: 0, top: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>L</Typography>
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <line x1="15" y1="20" x2="85" y2="20" stroke="#333" strokeWidth="2.5" />
                  <line x1="50" y1="20" x2="50" y2="85" stroke="#333" strokeWidth="2.5" />
                  <path d="M42 75 L50 85 L58 75" fill="none" stroke="#333" strokeWidth="2.5" />
                </svg>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Divider between Point 1 and Point 2 */}
        <Divider />

        {/* Point 2: Muscle Evaluation Summary */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#455a64' }}>2. Muscle Evaluation</Typography>
            <IconButton size="small"><KeyboardDoubleArrowDownIcon sx={{ color: '#555', fontSize: 18 }}/></IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 1 }}>
            <Box sx={getStatusIconStyle('#2ecc71')} />
            <Typography variant="body2" sx={{ mr: 2, minWidth: 200 }}>Tenderness (Masseter/Temporalis):</Typography>
            <RadioGroup row sx={{ gap: 1 }}>
              <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked/>} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} sx={{ mr: 1 }}/>
              <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>}/>
            </RadioGroup>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 1 }}>
            <Box sx={getStatusIconStyle('#2ecc71')} />
            <Typography variant="body2" sx={{ mr: 2, minWidth: 200 }}>Immobilization Test:</Typography>
            <RadioGroup row sx={{ gap: 1 }}>
              <FormControlLabel value="neg" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked/>} label={<Typography sx={{ fontSize: '13px' }}>Negative</Typography>} sx={{ mr: 1 }}/>
              <FormControlLabel value="pos" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Positive</Typography>}/>
            </RadioGroup>
          </Box>
        </Box>

        {/* Divider between Point 2 and Point 3 */}
        <Divider />

        {/* Point 3: Joint Evaluation Summary */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#455a64' }}>3. Joint Evaluation</Typography>
            <IconButton size="small"><KeyboardDoubleArrowDownIcon sx={{ color: '#555', fontSize: 18 }}/></IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 1 }}>
            <Box sx={getStatusIconStyle('#2ecc71')} />
            <Typography variant="body2" sx={{ mr: 2, minWidth: 200 }}>Joint Sounds:</Typography>
            <RadioGroup row sx={{ gap: 1 }}>
              <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked/>} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} sx={{ mr: 1 }}/>
              <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>}/>
            </RadioGroup>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 1 }}>
            <Box sx={getStatusIconStyle('#2ecc71')} />
            <Typography variant="body2" sx={{ mr: 2, minWidth: 200 }}>Load Test:</Typography>
            <RadioGroup row sx={{ gap: 1 }}>
              <FormControlLabel value="neg" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked/>} label={<Typography sx={{ fontSize: '13px' }}>Negative</Typography>} sx={{ mr: 1 }}/>
              <FormControlLabel value="pos" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }}/>} label={<Typography sx={{ fontSize: '13px' }}>Positive</Typography>}/>
            </RadioGroup>
          </Box>
        </Box>
      </Box>

      {/* 6. Footer section */}
      <Box sx={{ ml: 1, mb: 3 }}>
        <Typography variant="body2" sx={{ display: 'inline', mr: 2, fontSize: '13px' }}>Additional Imaging required:</Typography>
        <Typography variant="body2" sx={{ display: 'inline', color: '#ccc', fontStyle: 'italic', mr: 1, fontSize: '13px' }}>MRI:</Typography>
        <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#888' }}>Left</Typography>} sx={{ mr: 1 }}/>
        <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#888' }}>Right</Typography>} sx={{ mr: 4 }}/>
        <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#888' }}>CBCT</Typography>}/>
      </Box>

      <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#888' }}>Further analysis necessary</Typography>} sx={{ mb: 2, ml: 1 }}/>

      <Box sx={{ ml: 1 }}>
        <Button variant="contained" sx={{ bgcolor: '#e74c3c', textTransform: 'none', px: 2, '&:hover': { bgcolor: '#c0392b' } }}>Delete Exam</Button>
      </Box>

      {/* 2. MUSCLE EVALUATION & JOINT EVALUATION (Card) */}
      <Box sx={{ border: '1px solid #cfd8dc', borderRadius: 1, mb: 3, mt: 4 }}>
        {/* Point 2: Muscle Evaluation Detailed */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 600, color: '#455a64' }}>2. Muscle Evaluation</Typography>
            <IconButton size="small"><KeyboardArrowUpIcon /></IconButton>
          </Box>

          <SectionHeader title="Tenderness (Masseter/Temporalis):" status="green" />
          <RadioGroup row sx={{ ml: 3, mb: 1, gap: 1 }}>
            <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
            <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
          </RadioGroup>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={4}>
            <Grid item xs={7}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', mb: 2 }}>Temporalis/Masseter Only</Typography>
              <RadioGroup>
                <FormControlLabel value="asymp" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Asymptomatic</Typography>} />
                <FormControlLabel value="symp" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked />} label={<Typography sx={{ fontSize: '13px' }}>Symptomatic</Typography>} />
              </RadioGroup>
              
              <Box sx={{ ml: 4, mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '13px' }}>Frequency __________</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" sx={{ fontSize: '13px' }}>Timing:</Typography>
                      <RadioGroup row sx={{ ml: 1, gap: 1 }}>
                        <FormControlLabel value="am" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>AM</Typography>} />
                        <FormControlLabel value="pm" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>PM</Typography>} />
                      </RadioGroup>
                      <TextField
                        variant="standard"
                        sx={{ 
                          width: 80,
                          ml: 1,
                          '& input': { fontSize: '13px', padding: '2px 0' },
                          '& .MuiInput-root:before': { borderBottom: '1px solid #9ca3af !important' },
                          '& .MuiInput-root:after': { borderBottom: '1px solid #1976d2 !important' }
                        }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '13px' }}>Duration __________</Typography>
                    <Box sx={{ display: 'flex', mt: 1 }}>
                      <RadioGroup row sx={{ gap: 1 }}>
                        <FormControlLabel value="chewing" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Chewing</Typography>} />
                        <FormControlLabel value="constant" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Constant</Typography>} />
                      </RadioGroup>
                    </Box>
                  </Box>
                </Box>
              
                <Typography variant="body1" sx={{ display: 'block', mb: 1, fontWeight: 500, fontSize: '13px' }}>Intensity/Pain Level: &nbsp; 
                  <RadioGroup row sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <FormControlLabel value="1" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>1</Typography>} />
                    <FormControlLabel value="2" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>2</Typography>} />
                    <FormControlLabel value="3" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>3</Typography>} />
                    <FormControlLabel value="4" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>4</Typography>} />
                    <FormControlLabel value="5" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>5</Typography>} />
                  </RadioGroup>
                </Typography>
                            
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Pain on muscle palpation</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Rigidity of jaw on manipulation</Typography>} />
                </Box>
                <Box sx={{ ml: 2 }}>
                  <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: '13px' }}>Reproducible</Typography>} />
                </Box>
              </Box>
            </Grid>

           {/*  Column */}
  <Grid item xs={3.5} sx={{ textAlign: 'center', mt: -2 }}>
    <Box sx={{ display: 'inline-block' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
         <img src="/left_muscle.png" alt="Left" style={{ width: '300px' }} />
         <img src="/right_muscle.png" alt="Right" style={{ width: '300px' }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 0.5 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Right</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Left</Typography>
      </Box>
      <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: '#888', mt: 0.5 }}>
        select the joint
      </Typography>
    </Box>
  </Grid>

          </Grid>
                  <Divider />
          <Typography sx={{ fontSize: '0.75rem', marginTop: "1rem", fontWeight: 500, mb: 2, color: '#333' }}>Possible Concern</Typography>
           <Box sx={{ display: 'flex', gap: 10 }}>
            {/* Reflex Splinting Column */}
            <Box>
              <Typography sx={{ fontSize: '0.75rem', mb: 0.5, color: '#455a64' }}>
                - Reflex Splinting
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', ml: 2, color: '#666' }}>
                Pain on muscle palpation:
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', ml: 2, color: '#666' }}>
                Rigidity of jaw on manipulation
              </Typography>
            </Box>

            {/* Myofascial Pain Column */}
            <Box>
              <Typography sx={{ fontSize: '0.75rem', mb: 0.5, color: '#455a64' }}>
                - Myofascial Pain
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', ml: 2, color: '#666' }}>
                Pain on muscle palpation:
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', ml: 2, color: '#666' }}>
                Pain referred reproducibly on
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', ml: 2, color: '#666' }}>
                palpation of trigger points
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Divider between Point 2 and Point 3 */}
        <Divider />
        

        {/* Point 3: Joint Evaluation Detailed */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 600, color: '#455a64' }}>3. Joint Evaluation</Typography>
            <IconButton size="small"><KeyboardArrowUpIcon /></IconButton>
          </Box>

          <SectionHeader title="Joint Sounds:" status="green" />
          <RadioGroup row sx={{ ml: 3, mb: 1, gap: 1 }}>
            <FormControlLabel value="no" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked />} label={<Typography sx={{ fontSize: '13px' }}>No</Typography>} />
            <FormControlLabel value="yes" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Yes</Typography>} />
          </RadioGroup>

          <SectionHeader title="Load Test:" status="green" />
          <RadioGroup row sx={{ ml: 3, mb: 2, gap: 1 }}>
            <FormControlLabel value="negative" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} defaultChecked />} label={<Typography sx={{ fontSize: '13px' }}>Negative</Typography>} />
            <FormControlLabel value="positive" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 }, padding: '4px' }} />} label={<Typography sx={{ fontSize: '13px' }}>Positive</Typography>} />
          </RadioGroup>

          <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} sx={{ mt: 1 }}>
  <Grid item xs={8.5}>
    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 1, color: '#333' }}>
      Joint Sounds
    </Typography>
    
    <Box sx={{ ml: 0.5 }}>
      {/* Negative Row */}
      <FormControlLabel 
        control={<Checkbox size="small" sx={{ p: '4px' }} />} 
        label={<Typography sx={{ fontSize: '0.8rem', color: '#333' }}>Negative</Typography>} 
      />

      {/* Crepitus Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
        <FormControlLabel 
          control={<Checkbox size="small" sx={{ p: '4px' }} />} 
          label={<Typography sx={{ fontSize: '0.8rem', color: '#333', minWidth: '70px' }}>Crepitus</Typography>} 
        />
        
        {/* Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Left: Grade</Typography>
          <RadioGroup row sx={{ gap: 0.5 }}>
            {[1, 2, 3].map((v) => (
              <FormControlLabel key={v} value={v} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
            ))}
          </RadioGroup>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Right: Grade</Typography>
          <RadioGroup row sx={{ gap: 0.5 }}>
            {[1, 2, 3].map((v) => (
              <FormControlLabel key={v} value={v} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
            ))}
          </RadioGroup>
        </Box>
      </Box>

      {/* Clicking Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <FormControlLabel 
          control={<Checkbox size="small" sx={{ p: '4px' }} />} 
          label={<Typography sx={{ fontSize: '0.8rem', color: '#333', minWidth: '70px' }}>Clicking</Typography>} 
        />
        
        {/* Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Left: Grade</Typography>
          <RadioGroup row sx={{ gap: 0.5 }}>
            {[1, 2, 3].map((v) => (
              <FormControlLabel key={v} value={v} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
            ))}
          </RadioGroup>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#888', mr: 1 }}>Right: Grade</Typography>
          <RadioGroup row sx={{ gap: 0.5 }}>
            {[1, 2, 3].map((v) => (
              <FormControlLabel key={v} value={v} control={<Radio size="small" sx={{ p: '2px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#888' }}>{v}</Typography>} sx={{ m: 0 }} />
            ))}
          </RadioGroup>
        </Box>
      </Box>

      {/* Clicking Child Checkboxes Row 1 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
        <Box sx={{ minWidth: '70px' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#ccc' }}>Opening</Typography>} />
          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px', ml: 1 }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#ccc' }}>Closing</Typography>} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#ccc' }}>Opening</Typography>} />
          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px', ml: 1 }} defaultChecked />} label={<Typography sx={{ fontSize: '0.75rem', color: '#333' }}>Closing</Typography>} />
        </Box>
      </Box>

      {/* Clicking Child Checkboxes Row 2 - Reproducible */}
      <Box sx={{ display: 'flex', ml: 9, mt: 0.5 }}>
        <Box sx={{ display: 'flex', minWidth: '220px' }}>
          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#ccc' }}>Reproducible</Typography>} />
        </Box>
        <Box sx={{ display: 'flex', ml: 2 }}>
          <FormControlLabel control={<Checkbox size="small" sx={{ p: '4px' }} />} label={<Typography sx={{ fontSize: '0.75rem', color: '#ccc' }}>Reproducible</Typography>} />
        </Box>
      </Box>
    </Box>
  </Grid>

    {/* Diagram Column */}
  <Grid item xs={3.5} sx={{ textAlign: 'center', mt: 5 }}>
    <Box sx={{ display: 'inline-block' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
         <img src="/left_joint.png" alt="Left" style={{ width: '250px' }} />
         <img src="/right_joint.png" alt="Right" style={{ width: '250px' }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 0.5 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Right</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Left</Typography>
      </Box>
      <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: '#888', mt: 0.5 }}>
        select the joint
      </Typography>
    </Box>
  </Grid>
        </Grid>
        </Box>
      </Box>

      </Container>
    </Box>
  );
};

export default DentalTmdExamPage;