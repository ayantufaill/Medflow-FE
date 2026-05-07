import React, { useState } from 'react';
import { 
  Box, Typography, Button, Tabs, Tab, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Select, MenuItem, FormControl, InputLabel, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClinicalNavbar from '../../components/clinical/ClinicalNavbar';
import NewRX from '../../components/clinical/NewRX';

const RXPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    rxNum: '', description: '', startDate: '', duration: '',
    longTerm: '', refills: '', dose: '', prints: '', provider: '', notes: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ 
      rxNum: '', description: '', startDate: '', duration: '', 
      longTerm: '', refills: '', dose: '', prints: '', provider: '', notes: '' 
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setPrescriptions([...prescriptions, { ...formData, id: Date.now() }]);
    handleClose();
  };

  const tableHeaders = [
    'Rx #', 'Description', 'Start Date', 'Duration', 
    'Long Term', 'Refills', 'Dose', 'Prints', 'Provider', 'Notes'
  ];

  return (
    <Box>
      <ClinicalNavbar />
      
      <Box sx={{ mb: 3 }}>
        {/* Header Section */}
        <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.5rem', color: '#1a2735' }} gutterBottom>
          RX (Prescriptions)
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
          Prescription records and medication history
        </Typography>
      </Box>

      <Box sx={{ p: 3, backgroundColor: 'white', minHeight: '100%' }}>
        <Grid container spacing={4}>
          {/* Left Column: Prescription List */}
          <Grid item xs={12} md={7}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ '& .MuiTabs-indicator': { backgroundColor: '#2e3b84' } }}>
                <Tab label="Manual" sx={{ textTransform: 'none', fontSize: '0.85rem' }} />
                <Tab label="Electronic" sx={{ textTransform: 'none', fontSize: '0.85rem' }} />
              </Tabs>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontWeight: 'bold', color: '#2e3b84', fontSize: '1rem' }}>
                Prescription List
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                {tabValue === 1 && (
                  <>
                    <Button
                      variant="outlined"
                      sx={{ 
                        color: '#2e3b84', 
                        borderColor: '#2e3b84', 
                        borderRadius: '20px', 
                        textTransform: 'none', 
                        fontSize: '0.75rem',
                        px: 3,
                        '&:hover': { borderColor: '#1a2735', backgroundColor: 'rgba(46, 59, 132, 0.04)' }
                      }}
                    >
                      Generate
                    </Button>
                    <Select
                      size="small"
                      variant="standard"
                      displayEmpty
                      value=""
                      sx={{ 
                        fontSize: '0.75rem', 
                        minWidth: 120,
                        color: '#666',
                        '&:before': { borderBottom: '1px solid #ccc' },
                        '&:after': { borderBottom: '2px solid #2e3b84' }
                      }}
                    >
                      <MenuItem value="">Select Provider</MenuItem>
                      <MenuItem value="dr-sabour">Dr. Sabour</MenuItem>
                      <MenuItem value="dr-karl">Dr. Karl</MenuItem>
                    </Select>
                  </>
                )}
                <Button
                  variant="contained"
                  onClick={handleOpen}
                  startIcon={<AddIcon />}
                  sx={{ backgroundColor: '#2e3b84', borderRadius: '20px', textTransform: 'none', fontSize: '0.75rem', px: 3 }}
                >
                  Add
                </Button>
              </Stack>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 0 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                    {tableHeaders.map((header) => (
                      <TableCell key={header} sx={{ fontSize: '0.75rem', fontWeight: 'bold', borderRight: '1px solid #e0e0e0', py: 1 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4, color: '#9ca3af', fontStyle: 'italic' }}>
                        No prescriptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    prescriptions.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.rxNum}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.description}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.startDate}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.duration}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.longTerm}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.refills}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.dose}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.prints}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.provider}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{row.notes}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Right Column: Allergies Section */}
          <Grid item xs={12} md={3} sx={{ borderLeft: '1px solid #f1f1f1', pl: 3 }}>
            <Typography 
              sx={{ 
                color: '#2e3b84', 
                fontWeight: 'bold', 
                fontSize: '0.95rem',
                mb: 2 
              }}
            >
              Allergies & Adverse Reactions
            </Typography>
            {/* You can add allergy list content here */}
          </Grid>
        </Grid>
      </Box>

      {/* Add Prescription Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 0, p: 0 } }}
      >
        <NewRX onClose={handleClose} />
      </Dialog>
    </Box>
  );
};

export default RXPage;