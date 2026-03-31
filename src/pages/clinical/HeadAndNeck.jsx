import React, { useState } from 'react';
import {
  Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup,
  Button, Chip, Divider, List, ListItem, ListItemText, Grid, Container
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import VisitDatesTimeline from "../../components/patients/VisitDatesTimeline";
import { fontSize, fontWeight } from "../../constants/styles";

// Custom components to match the specific UI elements in the screenshot
const BlueHeader = ({ text }) => (
  <Box sx={{ bgcolor: '#4472c4', color: 'white', px: 2, py: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.medium }}>{text}</Typography>
    <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#bcc3ce' }} />
  </Box>
);

const AddLink = ({ text }) => (
  <ListItem sx={{ py: 0.5, pl: 4 }}>
    <ListItemText 
      primary={
        <Typography sx={{ color: '#4472c4', fontSize: fontSize.xs, fontStyle: 'italic', textDecoration: 'underline', cursor: 'pointer' }}>
          + {text}
        </Typography>
      } 
    />
  </ListItem>
);

const MallampatiRadio = ({ label }) => (
  <FormControlLabel 
    value={label.replace(' ', '')} 
    control={<Radio size="small" />} 
    label={<Typography sx={{ fontSize: fontSize.xs, color: '#333' }}>{label}</Typography>} 
    sx={{ m: 0, '& .MuiFormControlLabel-label': { ml: 0.2 } }} 
  />
);

// Placeholder Component for Anatomical Maps
const AnatomicalMapPlaceholder = ({ altText, imgSrc, position = 'absolute' }) => (
  <Box sx={{ 
    width: '100%', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, position
  }}>
    <img 
      src={imgSrc} 
      alt={altText} 
      style={{ maxWidth: '100%', height: 'auto', maxHeight: '450px', opacity: 1 }} 
    />
  </Box>
);

const DentalAnatomyExamPage = () => {
  const [visitDates, setVisitDates] = useState([
    'Sep 29, 2023'
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
      <Container maxWidth="xl" sx={{ p: 4, bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Manrope', 'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>
        
        {/* 1. Top Navbar / Timeline Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, overflowX: 'auto' }}>
          <VisitDatesTimeline
            visitDates={visitDates}
            onRemoveDate={handleRemoveDate}
          />
          <Button startIcon={<AddIcon />} sx={{ textTransform: 'none', color: '#777', ml: 2, fontSize: fontSize.xs, whiteSpace: 'nowrap', flexShrink: 0 }} onClick={handleNewExam}>
            New Exam
          </Button>
        </Box>

        {/* 2. Main Content Grid */}
        <Grid container spacing={4} sx={{ flex: 1 }}>
          
          {/* LEFT COLUMN: Controls (Fixed Width) */}
          <Grid item sx={{ width: 280, flexShrink: 0 }}>
            
            {/* Finding Options Checkboxes */}
            <Box sx={{ display: 'flex', gap: 2, mb: 1, px: 1 }}>
              <FormControlLabel 
                control={<Checkbox size="small" defaultChecked sx={{ color: '#ccc', p: 0.5 }} />} 
                label={<Typography sx={{ fontSize: fontSize.xs, color: '#333' }}>No Significant Findings</Typography>} 
                sx={{ m: 0 }} 
              />
              <FormControlLabel 
                control={<Checkbox size="small" sx={{ color: '#ccc', p: 0.5 }} />} 
                label={<Typography sx={{ fontSize: fontSize.xs, color: '#333'}}>Show Resolved Findings</Typography>} 
                sx={{ m: 0 }} 
              />
            </Box>

            {/* Left Panel Bordered Container */}
            <Box sx={{ border: '1px solid #cfd8dc', borderRadius: 0, overflow: 'hidden', mb: 3 }}>
              
              {/* Lesions Section */}
              <BlueHeader text="Lesions" />
              <List sx={{ p: 0 }}><AddLink text="Add Lesion" /></List>

              <Divider />

              {/* Bony Growth Section */}
              <BlueHeader text="Bony Growth" />
              <List sx={{ p: 0 }}>
                <AddLink text="Add Tori" />
                <Divider sx={{ ml: 4 }} />
                <AddLink text="Add Exostosis" />
              </List>

              <Divider />

              {/* Mallampati Section */}
              <Box sx={{ bgcolor: '#d9e1f2', color: '#4472c4', px: 2, py: 0.5 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>Mallampati score</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <RadioGroup row sx={{ gap: 1.5, justifyContent: 'space-between' }}>
                  <MallampatiRadio label="Class I" />
                  <MallampatiRadio label="Class II" />
                  <MallampatiRadio label="Class III" />
                  <MallampatiRadio label="Class IV" />
                </RadioGroup>
              </Box>
            </Box>

            {/* Delete Button */}
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#e74c3c', textTransform: 'none', px: 2, py: 0.5, fontSize: '13px', 
                '&:hover': { bgcolor: '#c0392b' }, ml: 1, borderRadius: 1 
              }}
            >
              Delete Exam
            </Button>
          </Grid>

          {/* RIGHT COLUMN: Anatomical Maps (Flexible Width) */}
          <Grid item xs sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            
            {/* Main Oral Anatomy Map */}
            <Box sx={{ position: 'relative', mb: 1, minHeight: '400px' }}>
               <AnatomicalMapPlaceholder altText="Oral Anatomy Map" imgSrc="/anatomy.png" position="relative" />
            </Box>

            {/* Bottom Two Diagrams Grid */}
            <Grid container spacing={0} sx={{ mt: 'auto', pt: 0 }}>
               <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ position: 'relative', width: '300px' }}>
                      <AnatomicalMapPlaceholder altText="Gingival/Floor Map" imgSrc="/gingival.png" position="relative" />
                  </Box>
               </Grid>
               <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: '220px', ml: 20 }}>
                      <AnatomicalMapPlaceholder altText="Neck/Lymph Node Map" imgSrc="/neck_lymph.png" position="relative" />
                  </Box>
               </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default DentalAnatomyExamPage;