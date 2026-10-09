import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentPatient } from '../../store/slices/patientSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../store/slices/providerSlice';
import {
  Box, Typography, Grid, TextField, Select, MenuItem,
  Checkbox, FormControlLabel, Button, Stack, IconButton, Divider, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer, CircularProgress
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, standardFieldSx, roundedSelectMenuProps } from '../../constants/styles';
import CardWrapper from '../admin/AddUserDrawer/CardWrapper';
import RxPrintPreviewDialog from './RxPrintPreviewDialog';
import { useMedicalHistory } from '../../hooks/redux/useMedicalHistory';
const Label = ({ children, required }) => (
  <Typography
    component="label"
    sx={{
      fontFamily: 'Inter',
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      color: COLORS.TEXT_SECONDARY,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
      display: 'block',
      mb: 0.5
    }}
  >
    {children} {required && <Box component="span" sx={{ color: COLORS.ACCENT, ml: 0.5, fontWeight: "bold" }}>*</Box>}
  </Typography>
);

const StyledTextField = (props) => (
  <TextField
    {...props}
    sx={{
      ...standardFieldSx,
      ...props.sx
    }}
  />
);

const StyledSelect = (props) => {
  const { displayEmpty, IconComponent, MenuProps, SelectProps, ...rest } = props;
  return (
    <TextField
      select
      {...rest}
      SelectProps={{
        displayEmpty,
        IconComponent,
        MenuProps: {
          ...roundedSelectMenuProps,
          sx: { zIndex: 1500, ...(roundedSelectMenuProps?.sx || {}) },
          ...MenuProps
        },
        ...SelectProps
      }}
      sx={{
        ...standardFieldSx,
        ...rest.sx
      }}
    />
  );
};


const parseQuestionOptions = (questionText) => {
  if (!questionText) return { cleanQuestion: '', options: null };
  const match = questionText.match(/\(Options:\s*(.*?)\)/);
  if (match) {
    const options = match[1].split(',').map(s => s.trim());
    const cleanQuestion = questionText.replace(/\s*\(Options:\s*.*?\)/, '');
    return { cleanQuestion, options };
  }
  return { cleanQuestion: questionText, options: null };
};

const numberToWords = (numStr) => {
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return '';

  const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];

  if (num === 0) return 'ZERO';

  let word = '';
  if (num >= 100) {
    word += ones[Math.floor(num / 100)] + ' HUNDRED ';
  }

  const remainder = num % 100;
  if (remainder >= 10 && remainder < 20) {
    word += teens[remainder - 10];
  } else {
    if (remainder >= 20) {
      word += tens[Math.floor(remainder / 10)] + (remainder % 10 !== 0 ? ' ' : '');
    }
    if (remainder % 10 > 0 && remainder >= 20) {
      word += ones[remainder % 10];
    } else if (remainder > 0 && remainder < 10) {
      word += ones[remainder];
    }
  }

  return word.trim();
};


const NewRX = ({ onClose, onSave }) => {
  const currentPatient = useSelector(selectCurrentPatient);
  const patientId = currentPatient?.chartNumber || currentPatient?.id || currentPatient?._id || 'N/A';
  const patientName = currentPatient ? `${currentPatient.lastName?.toUpperCase() || ''}, ${currentPatient.firstName?.toUpperCase() || ''}` : 'N/A';

  const providerList = useSelector(selectProviderDropdownList) || [];
  const dispatch = useDispatch();

  const { medicalHistory, fetch: fetchMedicalHistory, loading: medicalHistoryLoading } = useMedicalHistory();

  const patientDbId = currentPatient?._id || currentPatient?.id;

  React.useEffect(() => {
    if (patientDbId && patientDbId !== 'N/A') {
      fetchMedicalHistory(patientDbId);
    }
  }, [patientDbId, fetchMedicalHistory]);

  const allergyQuestionNumbers = [2, 12, 36, 41, 42];
  const activeAllergies = (medicalHistory?.sections || []).filter((section, index) => {
    const sectionNum = Number(section.number || index + 1);
    const isTarget = allergyQuestionNumbers.includes(sectionNum);
    const answerLower = (section.answer || '').toLowerCase();
    const isYes = answerLower !== 'no' && answerLower !== 'not answered' && answerLower !== '';
    return isTarget && isYes;
  });


  const [quantity, setQuantity] = useState('2');
  const [spelledQuantity, setSpelledQuantity] = useState('TWO');
  const [patientInstructions, setPatientInstructions] = useState('');
  const [rxInstructions, setRxInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [drugName, setDrugName] = useState('');
  const [dose, setDose] = useState('');
  const [refills, setRefills] = useState('');
  const [duration, setDuration] = useState('');
  const [listeningField, setListeningField] = useState(null);
  const [maySubstituteGeneric, setMaySubstituteGeneric] = useState(false);
  const [longTerm, setLongTerm] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [hasPrinted, setHasPrinted] = useState(false);
  const recognitionRef = React.useRef(null);

  React.useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

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

  const handleVoiceInput = (setter, fieldId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

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
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setter(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please check browser permissions.');
      }
    };

    recognition.onend = () => {
      setListeningField(null);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition already started or failed to start", err);
    }
  };

  const getProviderName = () => {
    const providerObj = providerList.find(p => (p._id || p.id) === selectedProvider);
    return providerObj
      ? (providerObj.name || `${providerObj.firstName || ''} ${providerObj.lastName || ''}`.trim())
      : '';
  };

  const getProviderDEA = () => {
    const providerObj = providerList.find(p => (p._id || p.id) === selectedProvider);
    return providerObj ? (providerObj.dea || providerObj.deaNumber || '') : '';
  };

  const handleOpenPrintPreview = () => {
    setPrintDialogOpen(true);
  };

  const handleSave = () => {
    if (onSave) {
      const providerObj = providerList.find(p => (p._id || p.id) === selectedProvider);

      onSave({
        rxNum: 'RX-' + Math.floor(Math.random() * 10000),
        description: drugName || 'New Prescription',
        startDate: new Date().toISOString(),
        duration: duration || '30 Days',
        longTerm: longTerm ? 'Yes' : 'No',
        maySubstituteGeneric,
        refills: refills || '0',
        dose: dose || '1',
        quantity,
        spelledQuantity,
        patientInstructions,
        rxInstructions,
        prints: hasPrinted ? 'Yes' : 'No',
        providerId: providerObj?._id || providerObj?.id || selectedProvider,
        provider: providerObj
          ? (providerObj.name || `${providerObj.firstName || ''} ${providerObj.lastName || ''}`.trim())
          : 'Unknown',
        notes: notes
      });
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', borderRadius: 0, p: 0, display: 'flex', flexDirection: 'column' }}>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '600px', p: 3, gap: 3 }}>

        {/* Top Section - New Rx Form */}
        <Box sx={{ width: '100%' }}>
          <CardWrapper title="New Rx">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography sx={{ fontSize: '13px', color: '#334155', mb: 0.5 }}>Patient #: <Box component="span" sx={{ fontWeight: 700 }}>{patientId}</Box></Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ fontSize: '13px', color: '#334155' }}>Patient Name:</Typography>
                  <Typography sx={{ fontSize: '13px', fontWeight: 700, color: COLORS.ACCENT }}>{patientName}</Typography>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Add From Template:</Typography>
                <StyledTextField
                  size="small"
                  placeholder="Select Template"
                  variant="outlined"
                  sx={{ width: 180 }}
                />
              </Stack>
            </Box>

            <Stack spacing={2}>
              {/* Row 1 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1.5 }}>
                  <Label required>Drug</Label>
                  <StyledTextField fullWidth size="small" placeholder="Enter drug name" variant="outlined" value={drugName} onChange={(e) => setDrugName(e.target.value)} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Label>Dose</Label>
                  <StyledTextField fullWidth size="small" placeholder="Enter dose" variant="outlined" value={dose} onChange={(e) => setDose(e.target.value)} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Label>Frequency</Label>
                  <StyledTextField fullWidth size="small" variant="outlined" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Label>Route</Label>
                  <StyledSelect size="small" fullWidth displayEmpty value="">
                    <MenuItem value="">Select</MenuItem>
                  </StyledSelect>
                </Box>
              </Box>

              {/* Row 2 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Label>Forms</Label>
                  <StyledSelect size="small" fullWidth displayEmpty value="">
                    <MenuItem value="">Select</MenuItem>
                  </StyledSelect>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Label>Duration</Label>
                  <StyledTextField fullWidth size="small" placeholder="e.g. 30 Days" variant="outlined" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </Box>
                <Box sx={{ flex: 1.5 }}>
                  <Label>Quantity</Label>
                  <StyledTextField
                    fullWidth size="small"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                      setSpelledQuantity(numberToWords(e.target.value));
                    }}
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 2 }}>
                  <Label>Spelled out quantity</Label>
                  <StyledTextField
                    fullWidth size="small"
                    value={spelledQuantity}
                    onChange={(e) => setSpelledQuantity(e.target.value)}
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Row 3 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Label>Refills</Label>
                  <StyledTextField fullWidth size="small" variant="outlined" value={refills} onChange={(e) => setRefills(e.target.value)} />
                </Box>
                <Box sx={{ flex: 3 }} /> {/* Empty space to align refills correctly */}
              </Box>
            </Stack>

            <Box sx={{ my: 2 }}>
              <Stack direction="row" spacing={4}>
                <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5 }} checked={maySubstituteGeneric} onChange={(e) => setMaySubstituteGeneric(e.target.checked)} />} label={<Typography sx={{ fontSize: '13px' }}>May substitute generic</Typography>} />
                <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5 }} checked={longTerm} onChange={(e) => setLongTerm(e.target.checked)} />} label={<Typography sx={{ fontSize: '13px' }}>Long Term</Typography>} />
              </Stack>
            </Box>

            <Stack spacing={2}>
              {/* Row 4 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Label>Patient Instructions</Label>
                  <StyledTextField
                    multiline
                    minRows={2}
                    fullWidth
                    variant="outlined"
                    value={patientInstructions}
                    onChange={(e) => setPatientInstructions(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-end', pb: 0, mb: -1, mr: -1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleVoiceInput(setPatientInstructions, 'patient')}
                            sx={{
                              p: 0.5,
                              animation: listeningField === 'patient' ? 'pulse 1.5s infinite' : 'none'
                            }}
                          >
                            <MicIcon sx={{ fontSize: 18, color: listeningField === 'patient' ? '#f44336' : COLORS.ACCENT }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Label>Rx Instructions</Label>
                  <StyledTextField
                    multiline
                    minRows={2}
                    fullWidth
                    variant="outlined"
                    value={rxInstructions}
                    onChange={(e) => setRxInstructions(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-end', pb: 0, mb: -1, mr: -1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleVoiceInput(setRxInstructions, 'rx')}
                            sx={{
                              p: 0.5,
                              animation: listeningField === 'rx' ? 'pulse 1.5s infinite' : 'none'
                            }}
                          >
                            <MicIcon sx={{ fontSize: 18, color: listeningField === 'rx' ? '#f44336' : COLORS.ACCENT }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Label>Start Date</Label>
                  <StyledTextField fullWidth size="small" variant="outlined" />
                </Box>
              </Box>

              {/* Row 5 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Label>Expiration Date</Label>
                  <StyledTextField fullWidth size="small" variant="outlined" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Label>Provider</Label>
                  <StyledSelect
                    size="small"
                    fullWidth
                    displayEmpty
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {providerList.map(prov => (
                      <MenuItem key={prov._id || prov.id} value={prov._id || prov.id}>
                        {prov.name || `${prov.firstName || ''} ${prov.lastName || ''}`.trim()}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Label>DEA</Label>
                  <StyledTextField fullWidth size="small" disabled variant="outlined" value={getProviderDEA()} />
                </Box>
              </Box>

              {/* Row 6 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Label>Notes</Label>
                  <StyledTextField
                    multiline
                    minRows={2}
                    fullWidth
                    variant="outlined"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-end', pb: 0, mb: -1, mr: -1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleVoiceInput(setNotes, 'notes')}
                            sx={{
                              p: 0.5,
                              animation: listeningField === 'notes' ? 'pulse 1.5s infinite' : 'none'
                            }}
                          >
                            <MicIcon sx={{ fontSize: 18, color: listeningField === 'notes' ? '#f44336' : COLORS.ACCENT }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </CardWrapper>
        </Box>

        {/* Bottom Section - Active Rx / Allergies */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CardWrapper title="Active Rx">
            <Stack direction="row" sx={{ borderBottom: `1px solid #000000`, pb: 1, mb: 2 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, flex: 3, color: '#4B5563' }}>Rx</Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, flex: 2, color: '#4B5563' }}>Duration</Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, flex: 2, color: '#4B5563' }}>Dose</Typography>
            </Stack>

            <Box sx={{ minHeight: 120, mb: 1 }}>
              <Typography sx={{ fontSize: '14px', color: '#9CA3AF', fontStyle: 'italic' }}>No active prescriptions</Typography>
            </Box>
          </CardWrapper>

            <CardWrapper title="Allergies & Adverse Reactions" noPadding>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#4B5563', borderBottom: '1px solid #E5E7EB' }}>Condition / Allergy</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4B5563', borderBottom: '1px solid #E5E7EB' }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicalHistoryLoading ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : activeAllergies.length > 0 ? (
                      activeAllergies.map((allergy, index) => {
                        const { cleanQuestion } = parseQuestionOptions(allergy.question);
                        const details = [
                          (allergy.answer || '').toLowerCase() !== 'yes' ? allergy.answer : '',
                          Array.isArray(allergy.additionalInfo) ? allergy.additionalInfo.join(', ') : allergy.additionalInfo,
                          Array.isArray(allergy.comment) ? allergy.comment.join(', ') : allergy.comment
                        ].map(s => String(s || '').trim()).filter(Boolean).join(' - ');
                        return (
                          <TableRow key={allergy.number || index} hover>
                            <TableCell sx={{ color: '#334155' }}>{cleanQuestion}</TableCell>
                            <TableCell sx={{ color: '#64748b' }}>{details || '—'}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 4, color: '#9CA3AF', fontStyle: 'italic' }}>
                          No allergies recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardWrapper>
        </Box>
      </Box>

      {/* Footer Actions */}
      <Box sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        p: 3,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1.5,
        bgcolor: '#fff',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            color: '#64748b',
            borderColor: '#cbd5e1',
            borderRadius: '8px',
            px: 3,
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'none',
            '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleOpenPrintPreview}
          variant="contained"
          sx={{
            bgcolor: COLORS.ACCENT,
            color: '#fff',
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            boxShadow: 'none',
            '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
          }}
        >
          Print
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            bgcolor: COLORS.ACCENT,
            color: '#fff',
            textTransform: 'none',
            borderRadius: '8px',
            px: 4,
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            boxShadow: 'none',
            '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
          }}
        >
          Save
        </Button>
      </Box>

      {/* Print Preview Dialog */}
      <RxPrintPreviewDialog
        open={printDialogOpen}
        onClose={() => setPrintDialogOpen(false)}
        onPrint={() => setHasPrinted(true)}
        patient={currentPatient}
        providerName={getProviderName()}
        providerDea={getProviderDEA()}
        data={{
          drugName,
          dose,
          quantity,
          spelledQuantity,
          refills,
          duration,
          patientInstructions,
          rxInstructions,
          notes,
          maySubstituteGeneric,
          longTerm,
        }}
      />
    </Box>
  );
};

export default NewRX;

