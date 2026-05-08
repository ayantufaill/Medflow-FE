import React, { useState } from 'react';
import { 
  Box, Typography, Grid, TextField, Select, MenuItem, 
  Checkbox, FormControlLabel, Button, Stack, IconButton, Divider
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const NewRX = ({ onClose }) => {
  const [quantity, setQuantity] = useState('2');
  const [spelledQuantity, setSpelledQuantity] = useState('TWO');
  const [patientInstructions, setPatientInstructions] = useState('');
  const [rxInstructions, setRxInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [listeningField, setListeningField] = useState(null);
  const recognitionRef = React.useRef(null);

  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
        100% { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);
  
  const greyBg = '#f4f7fa';
  const labelCol = '#1a237e';
  const headerBg = '#e0e4e8'; 

  const handleVoiceInput = (setter, fieldId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    // Stop existing recognition if any
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListeningField(fieldId);
      console.log('Voice recognition started for:', fieldId);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setter(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please check browser permissions.');
      }
    };

    recognition.onend = () => {
      setListeningField(null);
      recognitionRef.current = null;
      console.log('Voice recognition ended.');
    };

    try {
      recognition.start();
    } catch (err) {
      console.error('Recognition start error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const InputRow = ({ children, sx }) => (
    <Grid container spacing={2} sx={{ mb: 1.5, ...sx }}>
      {children}
    </Grid>
  );

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', borderRadius: 0, p: 0, display: 'flex', flexDirection: 'column' }}>
      
      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexGrow: 1, minHeight: '600px' }}>
        
        {/* Left Section - New Rx Form */}
        <Box sx={{ width: '68%', p: 3, borderRight: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ bgcolor: headerBg, px: 2, py: 0.5, borderRadius: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#333' }}>New Rx</Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: '12px', color: '#5479b1', fontWeight: 600 }}>Add From Template:</Typography>
              <TextField 
                size="small" 
                placeholder="Template" 
                variant="standard"
                sx={{ width: 150, '& .MuiInputBase-input': { fontSize: '12px', p: 0 } }}
              />
            </Stack>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '12px', color: '#333', mb: 1 }}>Patient #: <Box component="span" sx={{ fontWeight: 700 }}>1259</Box></Typography>
            <Stack direction="row" spacing={1} alignItems="center">
               <Typography sx={{ fontSize: '12px', color: '#333' }}>Patient Name:</Typography>
               <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#1a237e' }}>WILLIAMS, JOHN</Typography>
            </Stack>
          </Box>

          {/* Line 1: Drug */}
          <InputRow>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 700, minWidth: 40 }}>Drug:</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="drug" 
                  variant="standard"
                  sx={{ '& .MuiInputBase-input': { fontSize: '12px', p: 0.5 } }}
                />
              </Stack>
            </Grid>
          </InputRow>

          {/* Line 2: Dose, Route, Forms */}
          <InputRow>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 700, minWidth: 40 }}>Dose:</Typography>
                <TextField size="small" placeholder="dose" variant="standard" sx={{ '& .MuiInputBase-input': { fontSize: '12px', p: 0.5 } }} />
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 700, minWidth: 40 }}>Route:</Typography>
                <Select size="small" variant="standard" sx={{ fontSize: '12px', flexGrow: 1 }} displayEmpty value="">
                   <MenuItem value="">Select</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 700, minWidth: 40 }}>Forms:</Typography>
                <Select size="small" variant="standard" sx={{ fontSize: '12px', flexGrow: 1 }} displayEmpty value="">
                   <MenuItem value="">Select</MenuItem>
                </Select>
              </Stack>
            </Grid>
          </InputRow>

          {/* Line 3: Frequency, Duration, Refills */}
          <InputRow>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 700, minWidth: 70 }}>Frequency:</Typography>
                <TextField size="small" variant="standard" sx={{ '& .MuiInputBase-input': { fontSize: '12px', p: 0.5 } }} />
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 700, minWidth: 60 }}>Duration:</Typography>
                <Select size="small" variant="standard" sx={{ fontSize: '12px', flexGrow: 1 }} displayEmpty value="" icon={<KeyboardArrowDownIcon />}>
                   <MenuItem value="">Select</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 700, minWidth: 40 }}>Refills:</Typography>
                <TextField size="small" variant="standard" sx={{ '& .MuiInputBase-input': { fontSize: '12px', p: 0.5 } }} />
              </Stack>
            </Grid>
          </InputRow>

          {/* Line 4: Quantity */}
          <InputRow>
            <Grid item xs={4}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 700, minWidth: 60 }}>Quantity:</Typography>
                <TextField 
                  size="small" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  variant="standard" 
                  sx={{ '& .MuiInputBase-input': { fontSize: '12px', p: 0.5 } }} 
                />
              </Stack>
            </Grid>
            <Grid item xs={8}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 700, minWidth: 120 }}>Spelled out quantity:</Typography>
                <TextField 
                  size="small" 
                  value={spelledQuantity} 
                  onChange={(e) => setSpelledQuantity(e.target.value)}
                  variant="standard" 
                  sx={{ flexGrow: 1, '& .MuiInputBase-input': { fontSize: '12px', p: 0.5 } }} 
                />
              </Stack>
            </Grid>
          </InputRow>

          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={4}>
              <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: '12px' }}>May substitute generic</Typography>} />
              <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: '12px' }}>Long Term</Typography>} />
            </Stack>
          </Box>

          {/* Patient Instructions */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, mb: 0.5 }}>Patient Instructions:</Typography>
            <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ width: '100%' }}>
              <Box sx={{ flexGrow: 1, border: '1px solid #999', p: 0.5, minHeight: 60 }}>
                 <TextField 
                   multiline 
                   fullWidth 
                   variant="standard" 
                   value={patientInstructions}
                   onChange={(e) => setPatientInstructions(e.target.value)}
                   InputProps={{ disableUnderline: true }}
                   sx={{ '& .MuiInputBase-input': { fontSize: '12px' } }}
                 />
              </Box>
              <IconButton 
                size="small" 
                onClick={() => handleVoiceInput(setPatientInstructions, 'patient')}
                sx={{ 
                  color: listeningField === 'patient' ? '#f44336' : '#00bcd4', 
                  border: `1.5px solid ${listeningField === 'patient' ? '#f44336' : '#00bcd4'}`, 
                  p: 0.2, borderRadius: 1,
                  animation: listeningField === 'patient' ? 'pulse 1.5s infinite' : 'none'
                }}
              >
                <MicIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Rx Instructions */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, mb: 0.5 }}>Rx Instructions:</Typography>
            <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ width: '100%' }}>
              <Box sx={{ flexGrow: 1, border: '1px solid #999', p: 0.5, minHeight: 60 }}>
                 <TextField 
                   multiline 
                   fullWidth 
                   variant="standard" 
                   value={rxInstructions}
                   onChange={(e) => setRxInstructions(e.target.value)}
                   InputProps={{ disableUnderline: true }}
                   sx={{ '& .MuiInputBase-input': { fontSize: '12px' } }}
                 />
              </Box>
              <IconButton 
                size="small" 
                onClick={() => handleVoiceInput(setRxInstructions, 'rx')}
                sx={{ 
                  color: listeningField === 'rx' ? '#f44336' : '#00bcd4', 
                  border: `1.5px solid ${listeningField === 'rx' ? '#f44336' : '#00bcd4'}`, 
                  p: 0.2, borderRadius: 1,
                  animation: listeningField === 'rx' ? 'pulse 1.5s infinite' : 'none'
                }}
              >
                <MicIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Start Date & Expiration Date */}
          <InputRow>
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 600, minWidth: 70 }}>Start Date:</Typography>
                <TextField size="small" variant="standard" fullWidth sx={{ '& .MuiInputBase-input': { fontSize: '12px', p: 0.5 } }} />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 600, minWidth: 100 }}>Expiration Date:</Typography>
                <TextField size="small" variant="standard" fullWidth sx={{ '& .MuiInputBase-input': { fontSize: '12px', p: 0.5 } }} />
              </Stack>
            </Grid>
          </InputRow>

          {/* Provider & DEA */}
          <InputRow>
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 600, minWidth: 70 }}>Provider:</Typography>
                <Select size="small" variant="standard" fullWidth sx={{ fontSize: '12px' }} displayEmpty value="">
                   <MenuItem value="">Select</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '12px', fontWeight: 600, minWidth: 40, textAlign: 'center' }}>DEA:</Typography>
                <TextField size="small" variant="standard" fullWidth disabled sx={{ '& .MuiInputBase-input': { fontSize: '12px', p: 0.5 } }} />
              </Stack>
            </Grid>
          </InputRow>

          {/* Notes */}
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, mb: 0.5 }}>Notes:</Typography>
            <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ width: '100%' }}>
              <Box sx={{ flexGrow: 1, border: '1px solid #999', p: 0.5, minHeight: 60 }}>
                 <TextField 
                   multiline 
                   fullWidth 
                   variant="standard" 
                   value={notes}
                   onChange={(e) => setNotes(e.target.value)}
                   InputProps={{ disableUnderline: true }}
                   sx={{ '& .MuiInputBase-input': { fontSize: '12px' } }}
                 />
              </Box>
              <IconButton 
                size="small" 
                onClick={() => handleVoiceInput(setNotes, 'notes')}
                sx={{ 
                  color: listeningField === 'notes' ? '#f44336' : '#00bcd4', 
                  border: `1.5px solid ${listeningField === 'notes' ? '#f44336' : '#00bcd4'}`, 
                  p: 0.2, borderRadius: 1,
                  animation: listeningField === 'notes' ? 'pulse 1.5s infinite' : 'none'
                }}
              >
                <MicIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        {/* Right Section - Active Rx / Allergies */}
        <Box sx={{ width: '32%', borderLeft: '1.5px solid #ff5252', p: 0 }}>
          <Box sx={{ p: 2 }}>
             <Box sx={{ bgcolor: headerBg, px: 2, py: 0.5, mb: 2, width: 'fit-content' }}>
               <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#333' }}>Active Rx</Typography>
             </Box>
             
             <Stack direction="row" sx={{ borderBottom: '1px solid #4caf50', pb: 0.5, mb: 2, px: 0.5 }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, flex: 1.5 }}>Rx</Typography>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, flex: 1 }}>Duration</Typography>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, flex: 1 }}>Dose</Typography>
             </Stack>
             
             <Box sx={{ minHeight: 120, mb: 4, px: 1 }}>
                <Typography sx={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>No active prescriptions</Typography>
             </Box>

             <Box sx={{ bgcolor: headerBg, px: 2, py: 0.5, mb: 2, width: '100%' }}>
               <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#333' }}>Allergies & Adverse Reactions</Typography>
             </Box>
             <Box sx={{ minHeight: 120, px: 1 }}>
                <Typography sx={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>No allergies recorded</Typography>
             </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer Actions */}
      <Divider />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, bgcolor: '#fff' }}>
        <Button variant="contained" sx={{ bgcolor: '#d4b78a', color: '#fff', textTransform: 'none', borderRadius: 1.5, px: 4, fontSize: '13px', fontWeight: 600, "&:hover": { bgcolor: '#c5a77a' } }}>
          Save
        </Button>
        <Stack direction="row" spacing={0} sx={{ bgcolor: '#d4b78a', borderRadius: 1.5, overflow: 'hidden' }}>
          <Button 
            onClick={handlePrint}
            sx={{ color: '#fff', textTransform: 'none', px: 3, fontSize: '13px', fontWeight: 600 }}
          >
            Print
          </Button>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
          <IconButton size="small" sx={{ color: '#fff', borderRadius: 0 }}>
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Button variant="contained" onClick={onClose} sx={{ bgcolor: '#aeb9c4', color: '#fff', textTransform: 'none', borderRadius: 1.5, px: 4, fontSize: '13px', fontWeight: 600 }}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default NewRX;
