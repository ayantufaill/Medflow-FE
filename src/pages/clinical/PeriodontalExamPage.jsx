import React from 'react';
import {
  Box, Typography, Radio, RadioGroup, FormControlLabel,
  Button, Select, MenuItem, Grid, Divider, Tabs, Tab, IconButton, Checkbox,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PrintIcon from '@mui/icons-material/Print';
import MicIcon from '@mui/icons-material/Mic';
import ClinicalNavbar from "../../components/clinical/ClinicalNavbar";
import ExamNavbar from "../../components/clinical/ExamNavbar";
import { fontSize, fontWeight } from "../../constants/styles";

const SummaryData = [
  { label: '# of sites', bleeding: '50', p4: '150', p5: '0', p6: '0', recession: '43' },
  { label: '% of sites', bleeding: '33%', p4: '100%', p5: '0%', p6: '0%', recession: '28%' },
  { label: '# of teeth', bleeding: '15', p4: '25', p5: '0', p6: '0', recession: '14' },
  { label: '% of teeth', bleeding: '60%', p4: '100%', p5: '0%', p6: '0%', recession: '56%' },
];

const DiagnosticHeader = () => (
  <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e0e0e0' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>MH</Typography>
        <Typography variant="caption" sx={{ bgcolor: '#e74c3c', color: 'white', px: 0.5, fontWeight: fontWeight.bold, fontSize: fontSize.xs }}>DH</Typography>
      </Box>
      <IconButton size="small"><PrintIcon sx={{ fontSize: 18, color: '#999' }} /></IconButton>
    </Box>

    <Grid container spacing={4}>
      {/* Classification Column */}
      <Grid item xs={12} md={5}>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <FormControlLabel control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Healthy</Typography>} />
          <FormControlLabel control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Gingivitis</Typography>} />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.xs }}>Periodontitis:</Typography>
          <Select 
            size="small" 
            value="stage2" 
            sx={{ 
              height: 24, 
              fontSize: fontSize.xs, 
              minWidth: 100,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              borderBottom: '1px solid #9ca3af',
              borderRadius: 0,
              '& .MuiSvgIcon-root': { fontSize: '1rem' }
            }} 
          >
            <MenuItem value="stage2" sx={{ fontSize: fontSize.xs }}>stage II</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
          <FormControlLabel control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Localized (&lt; 30% of teeth)</Typography>} />
          <FormControlLabel control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Generalized</Typography>} />
          <FormControlLabel control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Molar/Incisor</Typography>} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: fontWeight.semibold, fontSize: fontSize.xs }}>Periodontal Grading:</Typography>
          <Select 
            size="small" 
            value="gradeB" 
            sx={{ 
              height: 24, 
              fontSize: fontSize.xs, 
              minWidth: 100,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              borderBottom: '1px solid #9ca3af',
              borderRadius: 0,
              '& .MuiSvgIcon-root': { fontSize: '1rem' }
            }} 
          >
            <MenuItem value="gradeB" sx={{ fontSize: fontSize.xs }}>grade B</MenuItem>
          </Select>
        </Box>
      </Grid>

      {/* Summary Table Column */}
      <Grid item xs={12} md={7}>
        <Typography variant="caption" sx={{ fontWeight: fontWeight.semibold, display: 'block', mb: 1, fontSize: fontSize.xs }}>Summary</Typography>
        <Table size="small" sx={{ '& .MuiTableCell-root': { fontSize: fontSize.xs, py: 0.5, borderBottom: 'none' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }} />
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Bleeding</TableCell>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Probing ≤ 4mm</TableCell>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Probing 5mm</TableCell>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Probing ≥ 6mm</TableCell>
              <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>Recession</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {SummaryData.map((row, idx) => (
              <TableRow key={idx} sx={{ borderTop: (idx === 0 || idx === 2) ? '1px solid #f0f0f0' : 'none' }}>
                <TableCell sx={{ color: '#999', fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.label}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.bleeding}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.p4}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.p5}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.p6}</TableCell>
                <TableCell sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.regular }}>{row.recession}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  </Box>
);

const PeriodontalExamPage = () => {
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
      <Box sx={{ p: 3, bgcolor: '#fff', minHeight: '100vh' }}>
        
        {/* 1. TIMELINE HEADER - Refined SVG Timeline */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 2 }}>
          <IconButton size="small"><ArrowBackIosNewIcon sx={{ fontSize: 16 }} /></IconButton>
          <Box sx={{ flex: 1, overflowX: 'auto' }}>
            <svg 
              width="100%" 
              height="80" 
              viewBox="0 0 900 80"
              preserveAspectRatio="xMidYMid meet"
              style={{ display: 'block' }}
            >
              {/* Connector Line */}
              <line 
                x1="50" 
                y1="25" 
                x2="750" 
                y2="25" 
                stroke="#a2b9d6" 
                strokeWidth="2" 
              />

              {['Dec 22, 2023', 'Mar 29, 2024', 'Jun 28, 2024', 'Oct 18, 2024', 'Feb 13, 2025', 'May 22, 2025', 'Dec 16, 2025'].map((date, index) => {
                const isLast = index === 6;
                const xPos = 50 + index * 116.67;
                return (
                  <g key={date}>
                    {/* Circle */}
                    <circle 
                      cx={xPos} 
                      cy="25" 
                      r={isLast ? 16 : 6} 
                      fill={isLast ? "#5b6d96" : "#a2b9d6"} 
                    />
                    {/* Date Label */}
                    <text 
                      x={xPos} 
                      y="65" 
                      textAnchor="middle" 
                      fontFamily="'Manrope', 'Segoe UI', sans-serif"
                      fontSize="12px"
                      fontWeight={isLast ? fontWeight.bold : fontWeight.regular}
                      fill={isLast ? "#333" : "#7a869a"}
                    >
                      {date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Box>
          <IconButton size="small"><ArrowForwardIosIcon sx={{ fontSize: 16 }} /></IconButton>
          
          <Box sx={{ ml: 4, display: 'flex', gap: 1 }}>
            <Button variant="contained" sx={{ bgcolor: '#d4a373', textTransform: 'none', borderRadius: 2, fontSize: fontSize.sm, px: 3, fontWeight: fontWeight.semibold }}>New Perio Chart -</Button>
            <IconButton><SettingsIcon /></IconButton>
            <Button variant="contained" sx={{ bgcolor: '#003366', textTransform: 'none', fontSize: fontSize.sm, px: 3, fontWeight: fontWeight.semibold }}>Compare</Button>
          </Box>
        </Box>

        {/* 2. DIAGNOSTIC SECTION */}
        <DiagnosticHeader />

        {/* 3. TABS FOOTER */}
        <Box sx={{ mt: 4, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Tabs value={0} sx={{ minHeight: 0 }}>
            <Tab label="PERIO CHART" sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, minWidth: 100 }} />
            <Tab label="PERIO GRAPH" sx={{ fontSize: fontSize.xs, color: '#ccc', minWidth: 100 }} />
          </Tabs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
            <FormControlLabel 
              control={<Checkbox size="small" />} 
              label={<Typography variant="caption" color="textSecondary" sx={{ fontSize: fontSize.xs }}>Enable System Talk Back</Typography>} 
            />
            <Typography variant="caption" sx={{ color: '#4472c4', textDecoration: 'underline', cursor: 'pointer', fontSize: fontSize.xs }}>Voice Commands Guide</Typography>
            <Box sx={{ bgcolor: '#e3d5ca', p: 0.5, borderRadius: '50%' }}><MicIcon sx={{ color: 'white', fontSize: 20 }} /></Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default PeriodontalExamPage;