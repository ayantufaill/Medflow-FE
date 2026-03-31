import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  Send as SendIcon,
  Add as AddIcon
} from '@mui/icons-material';

const DentalTreatmentPlan = () => {
  // State management
  const [recareExpanded, setRecareExpanded] = useState(true);
  const [phase1Expanded, setPhase1Expanded] = useState(true);
  const [periodontalStage, setPeriodontalStage] = useState('');
  const [duration, setDuration] = useState('');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [billedFees, setBilledFees] = useState({
    office2025: true,
    office2026: true,
    tdsMembership: true
  });

  // Financial data state
  const [treatmentTotals, setTreatmentTotals] = useState({
    patientPortion: 0.00,
    insurancePortion: 0.00,
    totalBilledFee: 0.00
  });

  const [phase1Data, setPhase1Data] = useState({
    checked: false,
    patientPortion: 0.00,
    insurancePortion: 0.00,
    adjustment: 0.00,
    totalBilledFee: 0.00
  });

  // Handlers
  const handleToggleRecare = () => {
    setRecareExpanded(!recareExpanded);
  };

  const handleTogglePhase1 = () => {
    setPhase1Expanded(!phase1Expanded);
  };

  const handlePeriodontalStageChange = (event) => {
    setPeriodontalStage(event.target.value);
    console.log('Periodontal stage changed to:', event.target.value);
  };

  const handleComputeNextVisit = () => {
    console.log('Computing next visit with stage:', periodontalStage);
    // Add your computation logic here
    alert('Next visit computed based on Periodontal Stage');
  };

  const handleResetRecareReminders = () => {
    console.log('Resetting recare reminders');
    if (window.confirm('Are you sure you want to reset all recare reminders?')) {
      // Reset logic here
      setDuration('');
      setPeriodontalStage('');
    }
  };

  const handleAddNote = () => {
    setNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    console.log('Saving note:', noteText);
    // Save note logic here
    setNoteDialogOpen(false);
    setNoteText('');
  };

  const handleCancelNote = () => {
    setNoteDialogOpen(false);
    setNoteText('');
  };

  const handlePrint = () => {
    console.log('Printing treatment plan');
    window.print();
  };

  const handleSettings = () => {
    console.log('Opening settings');
    // Open settings dialog/modal
  };

  const handleSendToPatient = () => {
    console.log('Sending phase 1 to patient');
    if (window.confirm('Send Phase 1 treatment plan to patient?')) {
      // Send logic here
    }
  };

  const handleSort = () => {
    const orders = ['default', 'date', 'priority', 'cost'];
    const currentIndex = orders.indexOf(sortOrder);
    const nextIndex = (currentIndex + 1) % orders.length;
    setSortOrder(orders[nextIndex]);
    console.log('Sorting by:', orders[nextIndex]);
  };

  const handleBilledFeeToggle = (feeType) => {
    setBilledFees(prev => ({
      ...prev,
      [feeType]: !prev[feeType]
    }));
    console.log(`Toggled ${feeType}`);
  };

  const handlePhase1Check = () => {
    setPhase1Data(prev => ({
      ...prev,
      checked: !prev.checked
    }));
    console.log('Phase 1 checkbox toggled');
  };

  // Styles
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    bgcolor: '#f4f7fa',
    px: 2,
    py: 0.5,
    borderRadius: 1,
    mb: 1,
    minHeight: '40px'
  };

  const labelStyle = {
    color: '#4a6585',
    fontWeight: 600,
    fontSize: '0.85rem',
    minWidth: '110px'
  };

  const dataTextStyle = {
    color: '#4a6585',
    fontSize: '0.85rem',
    fontWeight: 500,
    mr: 3
  };

  return (
    <Box sx={{ p: 2, width: '100%', bgcolor: 'white' }}>
      {/* Header: Billed Fees Chips */}
      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mb: 2 }}>
        <Typography sx={{ alignSelf: 'center', fontSize: '0.8rem', color: '#555' }}>
          Billed Fees:
        </Typography>
        <Chip 
          label="Office Fees 2025" 
          size="small" 
          onClick={() => handleBilledFeeToggle('office2025')}
          sx={{ 
            bgcolor: billedFees.office2025 ? '#e1f0f7' : '#eeeeee', 
            color: billedFees.office2025 ? '#60a5c8' : '#999',
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }} 
        />
        <Chip 
          label="Office Fees 2026" 
          size="small" 
          onClick={() => handleBilledFeeToggle('office2026')}
          sx={{ 
            bgcolor: billedFees.office2026 ? '#e1f0f7' : '#eeeeee', 
            color: billedFees.office2026 ? '#60a5c8' : '#999',
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }} 
        />
        <Chip 
          label={<span>TDS Membership 2025 <i style={{ fontWeight: 400 }}>(Manual Fee)</i></span>} 
          size="small" 
          onClick={() => handleBilledFeeToggle('tdsMembership')}
          sx={{ 
            bgcolor: billedFees.tdsMembership ? '#e6f4ea' : '#eeeeee', 
            color: billedFees.tdsMembership ? '#2e7d32' : '#999',
            border: '1px solid #c3e6cb',
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }} 
        />
      </Stack>

      {/* Row 1: Recare Plan */}
      <Box sx={rowStyle}>
        <ExpandIcon 
          sx={{ 
            color: '#4a6585', 
            fontSize: '1.2rem', 
            mr: 1,
            transform: recareExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.3s'
          }} 
          onClick={handleToggleRecare}
        />
        <Typography sx={labelStyle}>Recare Plan</Typography>
        
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
          <HistoryIcon sx={{ color: '#4a6585', fontSize: '1.1rem' }} />
          <Typography sx={{ fontSize: '0.85rem' }}>Duration:</Typography>
          <input 
            type="text" 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ 
              border: 'none',
              borderBottom: '1px dashed #4a6585',
              background: 'transparent',
              fontSize: '0.85rem',
              color: '#4a6585',
              width: '40px',
              textAlign: 'center',
              outline: 'none',
              marginLeft: '4px'
            }}
          />
          <Typography sx={{ fontSize: '0.85rem' }}>min</Typography>
          
          <Typography 
            sx={{ 
              fontSize: '0.85rem', 
              color: '#1976d2', 
              cursor: 'pointer', 
              ml: 2,
              textDecoration: 'underline'
            }} 
            onClick={handleAddNote}
          >
            +add note
          </Typography>

          <Select
            displayEmpty
            size="small"
            value={periodontalStage}
            onChange={handlePeriodontalStageChange}
            sx={{ height: 28, fontSize: '0.8rem', minWidth: 150, ml: 2 }}
          >
            <MenuItem value="" disabled>
              <em>Periodontal Stage</em>
            </MenuItem>
            <MenuItem value={1}>Stage I</MenuItem>
            <MenuItem value={2}>Stage II</MenuItem>
            <MenuItem value={3}>Stage III</MenuItem>
            <MenuItem value={4}>Stage IV</MenuItem>
          </Select>

          <Button 
            variant="contained" 
            size="small" 
            onClick={handleComputeNextVisit}
            sx={{ bgcolor: '#e57373', '&:hover': { bgcolor: '#d32f2f' }, textTransform: 'none', height: 28, ml: 1 }}
          >
            Compute next visit
          </Button>
        </Stack>

        <Button 
          variant="contained" 
          size="small" 
          onClick={handleResetRecareReminders}
          sx={{ bgcolor: '#d7b38c', '&:hover': { bgcolor: '#c3a17a' }, textTransform: 'none', height: 28, mr: 1 }}
        >
          Reset recare reminders
        </Button>
        <SettingsIcon 
          sx={{ color: '#4a6585', fontSize: '1.2rem', mx: 0.5, cursor: 'pointer' }}
          onClick={handleSettings}
        />
        <PrintIcon 
          sx={{ color: '#4a6585', fontSize: '1.2rem', cursor: 'pointer' }}
          onClick={handlePrint}
        />
      </Box>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onClose={handleCancelNote}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            type="text"
            fullWidth
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelNote}>Cancel</Button>
          <Button onClick={handleSaveNote} variant="contained">Save Note</Button>
        </DialogActions>
      </Dialog>

      {/* Row 2: Treatment Plan Totals */}
      <Box sx={rowStyle}>
        <Typography sx={labelStyle}>Treatment Plan</Typography>
        <Typography sx={dataTextStyle}>PT. PORTION: ${treatmentTotals.patientPortion.toFixed(2)}</Typography>
        <Typography sx={dataTextStyle}>INS. PORTION: ${treatmentTotals.insurancePortion.toFixed(2)}</Typography>
        <Typography sx={dataTextStyle}>TOTAL BILLED FEE: ${treatmentTotals.totalBilledFee.toFixed(2)}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography 
          sx={{ fontSize: '0.85rem', color: '#4a6585', mr: 1, cursor: 'pointer', textTransform: 'capitalize' }}
          onClick={handleSort}
        >
          sort: {sortOrder}
        </Typography>
        <FilterIcon 
          sx={{ color: '#4a6585', fontSize: '1.2rem', cursor: 'pointer' }}
          onClick={handleSort}
        />
      </Box>

      {/* Row 3: Phase 1 */}
      <Box sx={rowStyle}>
        <input 
          type="checkbox" 
          style={{ marginRight: '8px', cursor: 'pointer' }}
          checked={phase1Data.checked}
          onChange={handlePhase1Check}
        />
        <Typography sx={labelStyle}>Phase 1</Typography>
        <Typography sx={dataTextStyle}>PT. PORTION: ${phase1Data.patientPortion.toFixed(2)}</Typography>
        <Typography sx={dataTextStyle}>INS. PORTION: ${phase1Data.insurancePortion.toFixed(2)}</Typography>
        <Typography sx={dataTextStyle}>ADJ: ${phase1Data.adjustment.toFixed(2)}</Typography>
        <Typography sx={dataTextStyle}>TOTAL BILLED FEE: ${phase1Data.totalBilledFee.toFixed(2)}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton 
          size="small"
          onClick={handleSendToPatient}
          sx={{ '&:hover': { bgcolor: 'rgba(74, 101, 133, 0.1)' } }}
        >
          <SendIcon sx={{ color: '#4a6585', fontSize: '1.1rem', transform: 'rotate(-45deg)' }} />
        </IconButton>
        <PrintIcon 
          sx={{ color: '#4a6585', fontSize: '1.2rem', cursor: 'pointer' }}
          onClick={handlePrint}
        />
      </Box>
    </Box>
  );
};

export default DentalTreatmentPlan;
