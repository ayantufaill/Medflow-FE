import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Radio,
  RadioGroup,
  IconButton,
  Tabs,
  Tab,
  Switch,
  Select,
  MenuItem,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  KeyboardArrowDown as ExpandIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const RECARE_PROCEDURES = [
  { name: 'Polishing', intervals: '3,4,6,9,12', unit: 'Months', trigger: false },
  { name: 'Prophy', intervals: '3,4,6,9,12', unit: 'Months', trigger: true },
  { name: 'Exam', intervals: '6,9,12,18,24', unit: 'Months', trigger: false },
  { name: 'BW', intervals: '6,12,24,36', unit: 'Months', trigger: false },
  { name: 'Fluoride', intervals: '3,4,6,9,12', unit: 'Months', trigger: false },
  { name: 'Pano/Fmx', intervals: '12,24,36,48,60', unit: 'Months', trigger: false },
  { name: 'Scaling', intervals: '1,3,4,6,9,12', unit: 'Months', trigger: true },
  { name: 'PA', intervals: '6,12,24,36,48', unit: 'Months', trigger: false },
  { name: 'additional1 TDS Membership', intervals: '12', unit: 'Months', trigger: false },
  { name: 'additional2', intervals: '6,12,24,36,48', unit: 'Months', trigger: false },
  { name: 'additional3', intervals: '6,12,24,36,48', unit: 'Months', trigger: false },
  { name: 'additional4', intervals: '6,12,24,36,48', unit: 'Months', trigger: false },
  { name: 'additional5', intervals: '6,12,24,36,48', unit: 'Months', trigger: false },
];

const STAGING_PROCEDURES = [
  'Polishing', 'Prophy', 'Exam', 'BW', 'Fluoride', 'Pano/Fmx', 'Scaling', 'Maintenance', 'PA', 'TDS Membership', 'Additional2', 'Additional3'
];

const RecareConfiguration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(7); // "New Stage" as default in image
  const [autoCreate, setAutoCreate] = useState(true);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          onClick={() => navigate('/admin/clinical-management')}
          sx={{
            color: '#1a3a6b',
            fontSize: '0.85rem',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Clinical Management
        </Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem' }}>{'>'}</Typography>
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 500 }}>
          Recare Configuration
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: General Recare Configuration */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
            General Recare Configuration
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 1 }}>
            Automatically create recare plans using the default setting when needed, or uncheck it so recare plans are only created by you using the selected configuration.
          </Typography>
          <FormControlLabel
            control={<Checkbox size="small" checked={autoCreate} onChange={(e) => setAutoCreate(e.target.checked)} />}
            label={<Typography sx={{ fontSize: '0.75rem', color: '#666' }}>Automatically create recare plans</Typography>}
          />
          <Typography sx={{ fontSize: '0.75rem', color: '#666', mt: 2, mb: 1 }}>
            Configure and order the codes that you would like to include in your recare plan, the intervals used, and the procedures to trigger the reminders
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button variant="contained" sx={{ backgroundColor: '#e0e0e0', color: '#333', textTransform: 'none', fontSize: '0.7rem', py: 0.5 }}>
              Update Recall Dates For All Patients
            </Button>
            <Button variant="contained" sx={{ backgroundColor: '#a0aec0', color: '#fff', textTransform: 'none', fontSize: '0.7rem', py: 0.5 }}>
              Update Recare Plans For All Patients
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Typography sx={{ fontSize: '0.65rem', color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Drag and drop to rearrange <DragIcon sx={{ fontSize: '0.9rem' }} />
            </Typography>
          </Box>

          <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1a3a6b' }}>Name</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1a3a6b' }}>Intervals</TableCell>
                  <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1a3a6b' }}>Recall Trigger</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {RECARE_PROCEDURES.map((row, index) => (
                  <TableRow key={index} sx={{ '& td': { py: 1.5 } }}>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#333', fontWeight: 500 }}>{row.name}</TableCell>
                    <TableCell sx={{ width: 200 }}>
                      <TextField size="small" fullWidth value={row.intervals} sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5, backgroundColor: '#f8f9fa' } }} />
                      <RadioGroup row value={row.unit} sx={{ mt: 0.5 }}>
                        <FormControlLabel value="Days" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.65rem' }}>Days</Typography>} />
                        <FormControlLabel value="Months" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.65rem' }}>Months</Typography>} />
                      </RadioGroup>
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox size="small" checked={row.trigger} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DragIcon sx={{ fontSize: '0.9rem', color: '#ccc', cursor: 'grab' }} />
                        <IconButton size="small"><ExpandIcon sx={{ fontSize: '1.2rem', color: '#999', border: '1px solid #eee', borderRadius: '50%' }} /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Right Column: Configuring Staging */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '1rem' }}>
              Configuring Staging
            </Typography>
            <Button variant="contained" size="small" sx={{ backgroundColor: '#0c345d', color: '#fff', textTransform: 'none', fontSize: '0.75rem' }}>
              + Add Stage
            </Button>
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 0.5 }}>
            Customize the procedures and the intervals for each stage of periodontal disease (automatically calculated by Medflow)
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 2 }}>
            Create your own recare intervals and procedures for membership plans
          </Typography>

          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{ 
              minHeight: 32, 
              mb: 2,
              '& .MuiTab-root': { textTransform: 'none', fontSize: '0.7rem', minWidth: 60, minHeight: 32, p: 0.5, color: '#4a90e2' },
              '& .Mui-selected': { color: '#333 !important', backgroundColor: '#f0f0f0', borderRadius: '4px 4px 0 0' },
              '& .MuiTabs-indicator': { display: 'none' }
            }}
          >
            <Tab label="Stage 1" />
            <Tab label="Stage 2" />
            <Tab label="Stage 3" />
            <Tab label="Stage 4" />
            <Tab label="Maintenance" />
            <Tab label="Healthy" sx={{ color: '#48bb78 !important' }} />
            <Tab label="Membership Renewal" />
            <Tab label="New Stage" />
          </Tabs>

          <Box sx={{ backgroundColor: '#f8f9fa', p: 1.5, borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TextField placeholder="New Stage" size="small" sx={{ flex: 1, backgroundColor: '#fff', '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.5 } }} />
              <IconButton size="small"><DeleteIcon sx={{ fontSize: '1.1rem', color: '#ccc' }} /></IconButton>
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={<Typography sx={{ fontSize: '0.7rem', color: '#666' }}>Default</Typography>}
              />
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#333' }}>Procedure</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#333' }}>Frequency Interval</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {STAGING_PROCEDURES.map((proc, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: '0.75rem', color: '#333', fontWeight: 500 }}>{proc}</TableCell>
                      <TableCell sx={{ width: 100 }}>
                        <Select 
                          fullWidth 
                          size="small" 
                          variant="standard" 
                          value="Months"
                          sx={{ fontSize: '0.7rem', backgroundColor: '#fff', border: '1px solid #eee', px: 1 }}
                        >
                          <MenuItem value="Months">Months</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <Switch size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecareConfiguration;
