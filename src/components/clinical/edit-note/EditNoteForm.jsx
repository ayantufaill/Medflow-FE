import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProviderDropdownList } from '../../../store/slices/providerSlice';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { 
  Box, Typography, IconButton, Chip, Checkbox, 
  FormControlLabel, TextField, Divider, Paper, Grid,
  FormControl, InputLabel, Select, MenuItem, Switch, Button, CircularProgress
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, standardFieldSx, roundedSelectMenuProps, radius } from '../../../constants/styles';
import { clinicalNoteService } from '../../../services/clinical-note.service';
import { providerService } from '../../../services/provider.service';

const enhancedMenuProps = {
  ...roundedSelectMenuProps,
  style: { zIndex: 9999 } // Fix dropdown appearing behind the drawer
};

const multilineFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: radius.md,
    backgroundColor: COLORS.SURFACE_CARD,
    fontFamily: 'Inter',
    '& fieldset': { borderWidth: '1.2px', borderColor: COLORS.BORDER },
    '&:hover fieldset': { borderColor: COLORS.TEXT_MUTED },
    '&.Mui-focused fieldset': { borderColor: COLORS.ACCENT, borderWidth: '1.2px' },
    '&.Mui-error fieldset': { borderColor: COLORS.STATUS_ERROR },
  },
  '& .MuiOutlinedInput-input': { fontSize: fontSize.base }
};

// Standard Mock Rich Text Editor
const MockRichTextEditor = React.forwardRef(({ placeholder, defaultValue, label, onChange, value }, ref) => {
  return (
    <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: 1, overflow: 'hidden', bgcolor: '#fff' }}>
      {label && <Box sx={{ p: 1.5, borderBottom: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT }}><Typography sx={{ fontSize: fontSize.sm, fontWeight: 400, color: COLORS.TEXT_SECONDARY }}>{label}</Typography></Box>}
      <Box sx={{ display: 'flex', gap: 1, p: 0.5, borderBottom: `1px solid ${COLORS.BORDER}` }}>
        <IconButton size="small"><FormatBoldIcon fontSize="small" sx={{ color: COLORS.TEXT_BODY }} /></IconButton>
        <IconButton size="small"><FormatItalicIcon fontSize="small" sx={{ color: COLORS.TEXT_BODY }} /></IconButton>
        <IconButton size="small"><FormatUnderlinedIcon fontSize="small" sx={{ color: COLORS.TEXT_BODY }} /></IconButton>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: COLORS.BORDER }} />
        <IconButton size="small"><FormatListNumberedIcon fontSize="small" sx={{ color: COLORS.TEXT_BODY }} /></IconButton>
        <IconButton size="small"><FormatListBulletedIcon fontSize="small" sx={{ color: COLORS.TEXT_BODY }} /></IconButton>
      </Box>
      <TextField 
        inputRef={ref}
        multiline 
        minRows={3} 
        fullWidth 
        placeholder={placeholder}
        value={value !== undefined ? value : (defaultValue || '')}
        onChange={onChange}
        variant="standard" 
        InputProps={{ disableUnderline: true, sx: { p: 2, fontSize: fontSize.base } }}
      />
    </Box>
  );
});

const defaultValues = {
  restorativeTreatment: '',
  techniqueUtilizedElevated: false,
  techniqueUtilizedHemostasis: false,
  extractionsDoneOnTeeth: '',
  personBringingInPatient: '',
  treatmentRequirementsNotes: '',
  healthHistory: '',
  behavior: '',
  inPain: false,
  painLevel: '',
  xraysNeeded: false,
  nitrousGiven: false,
  nitrousAmount: '',
  nitrousConsentNotes: '',
  anesthesiaUsed: false,
  articaineEpi1: false,
  lidocaineHcl2: false,
  anesthesiaNotes: '',
  procedureAccomplished: '',
  isolation: [],
  postOpInstructions: '',
  additionalPostOpNotes: '',
  dentalAssistant: '',
  treatmentCompletedBy: '',
  isComplete: false
};

const ISOLATION_OPTIONS = ['Dryshield (XP)', 'Dryshield (M)', 'Dryshield (P)', 'Dryshield (L)', 'Dryshield (S)', 'Mouth prop'];

const EditNoteForm = ({ noteId, view, patientId, appointmentId, providerId, currentPatient, selectedProcedures, onCancel, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const providersList = useSelector(selectProviderDropdownList) || [];

  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: view === 'create' ? defaultValues : {}
  });

  const inPain = watch('inPain');
  const nitrousGiven = watch('nitrousGiven');
  const anesthesiaUsed = watch('anesthesiaUsed');
  const isolation = watch('isolation') || [];

  const getProviderName = (providerId) => {
    if (!providerId) return '-';
    if (providerId === 'CB') return 'CB'; 
    const provider = providersList.find(p => p._id === providerId || p.providerCode === providerId);
    if (!provider) return providerId;
    const first = provider.userId?.firstName || provider.firstName || provider.FName || '';
    const last = provider.userId?.lastName || provider.lastName || provider.LName || '';
    const name = `${first} ${last}`.trim();
    if (name) return name;
    return provider.providerCode || provider._id || 'Unknown';
  };

  const generateNoteDefaults = () => {
    let defaults = { ...defaultValues };
    
    if (currentPatient) {
      const patientGender = currentPatient.gender || 'Unknown';
      
      // Calculate age if dob exists
      let patientAge = '';
      let patientDob = 'Unknown DOB';
      const dobVal = currentPatient.dateOfBirth || currentPatient.dob;
      if (dobVal) {
         const dobDate = new Date(dobVal);
         patientDob = dobDate.toLocaleDateString();
         const ageDiffMs = Date.now() - dobDate.getTime();
         const ageDate = new Date(ageDiffMs);
         patientAge = `${Math.abs(ageDate.getUTCFullYear() - 1970)} Years`;
      }
      
      let providerName = '';
      let proceduresText = '';
      let extractionsTeeth = [];

      if (selectedProcedures && selectedProcedures.length > 0) {
        const validProcWithProvider = selectedProcedures.find(p => p.provider && p.provider !== '-');
        if (validProcWithProvider) {
          providerName = getProviderName(validProcWithProvider.provider);
        }
        
        proceduresText = selectedProcedures.map(p => {
          if (p.site && p.site !== '-') {
             // Extract just the tooth number/letter
             const cleanSite = p.site.replace(/[^0-9A-Z]/g, '');
             if (cleanSite) extractionsTeeth.push(cleanSite);
          }
          return `- ${p.code}: ${p.description} ${p.site && p.site !== '-' ? `(Tooth ${p.site})` : ''}`;
        }).join('\n');
      }

      // Filter out empty teeth and join uniquely
      extractionsTeeth = [...new Set(extractionsTeeth.filter(t => t))].join(', ');

      defaults.restorativeTreatment = `Restorative treatment at clinic${providerName ? ` with ${providerName}` : ''}.\n${patientDob}${patientAge ? `, ${patientAge}` : ''}\n${patientGender}`;
      
      if (proceduresText) {
        defaults.procedureAccomplished = `The following procedures were accomplished:\n${proceduresText}`;
      }

      if (extractionsTeeth) {
        defaults.extractionsDoneOnTeeth = extractionsTeeth;
      }
      
      if (providerName) {
        defaults.treatmentCompletedBy = providerName;
      }
    }
    
    return defaults;
  };

  useEffect(() => {
    if (view === 'edit' && noteId) {
      loadNote();
    } else if (view === 'create') {
      reset(generateNoteDefaults());
    }
  }, [view, noteId, currentPatient, selectedProcedures, providersList]);

  const loadNote = async () => {
    try {
      setIsLoading(true);
      const note = await clinicalNoteService.getClinicalNoteById(noteId);
      if (note && note.structuredData) {
        // Merge the backend saved JSON payload into the react hook form
        reset({ ...defaultValues, ...note.structuredData });
      } else {
        reset(defaultValues);
      }
    } catch (error) {
      console.error('Failed to load note:', error);
      reset(defaultValues);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIsolationToggle = (option) => {
    if (isolation.includes(option)) {
      setValue('isolation', isolation.filter(item => item !== option));
    } else {
      setValue('isolation', [...isolation, option]);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      
      // Determine the actual provider ID from the selected procedures
      let actualProviderId = providerId && providerId !== "1" ? providerId : "1";
      if (selectedProcedures && selectedProcedures.length > 0) {
        const validProcWithProvider = selectedProcedures.find(p => p.provider && p.provider !== '-');
        if (validProcWithProvider) {
          actualProviderId = validProcWithProvider.provider;
        }
      }
      
      const notePayload = {
        patientId: patientId || "1",
        providerId: actualProviderId,
        noteType: 'progress',
        structuredData: data
      };
      
      // Only include appointmentId if it's a real appointment, to avoid the unique conflict error
      if (appointmentId && appointmentId !== "1") {
        notePayload.appointmentId = appointmentId;
      }

      if (view === 'create') {
        await clinicalNoteService.createClinicalNote(notePayload);
      } else {
        await clinicalNoteService.updateClinicalNote(noteId, notePayload);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to save note:', error);
      alert(error.response?.data?.error?.message || 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>{dayjs().format('MMMM D, YYYY')}</Typography>
            <Box>
              <IconButton size="small"><NotificationsNoneIcon sx={{ color: COLORS.TEXT_SECONDARY }} /></IconButton>
              <IconButton size="small"><MoreVertIcon sx={{ color: COLORS.TEXT_SECONDARY }} /></IconButton>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
               <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Note Status</Typography>
               <Chip label={view === 'create' ? "Draft" : "Saved"} size="small" sx={{ fontWeight: fontWeight.medium, bgcolor: '#ffedd5', color: '#c2410c' }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
               <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Tags</Typography>
               <Chip label="Clinical" size="small" color="primary" variant="outlined" sx={{ fontWeight: fontWeight.medium }} />
            </Grid>
          </Grid>
        </Paper>

        <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2, mt: 2 }}>Restorative - Extractions</Typography>
        
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="restorativeTreatment"
                control={control}
                render={({ field }) => <MockRichTextEditor label="Restorative Treatment" {...field} />}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
               <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Technique Utilized</Typography>
               <Controller
                 name="techniqueUtilizedElevated"
                 control={control}
                 render={({ field }) => (
                   <FormControlLabel control={<Checkbox size="small" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} sx={{ '&.Mui-checked': { color: COLORS.ACCENT } }} />} label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>Tooth elevated with periosteal and 301 elevator and luxated with forceps. Adequate hemostasis</Typography>} />
                 )}
               />
               <Controller
                 name="techniqueUtilizedHemostasis"
                 control={control}
                 render={({ field }) => (
                   <FormControlLabel control={<Checkbox size="small" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} sx={{ '&.Mui-checked': { color: COLORS.ACCENT } }} />} label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>achieved from gauze pressure for 5 minutes.</Typography>} />
                 )}
               />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Extractions done on teeth #(s)</Typography>
              <Controller
                name="extractionsDoneOnTeeth"
                control={control}
                render={({ field }) => <TextField fullWidth placeholder="Extractions done on teeth #(s)" {...field} sx={standardFieldSx} />}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Person bringing in patient</Typography>
              <Controller
                name="personBringingInPatient"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth sx={standardFieldSx}>
                    <Select {...field} displayEmpty MenuProps={enhancedMenuProps}>
                      <MenuItem value=""><em>Select...</em></MenuItem>
                      <MenuItem value="MOC">MOC</MenuItem>
                      <MenuItem value="Guardian">Guardian</MenuItem>
                      <MenuItem value="FOC">FOC</MenuItem>
                      <MenuItem value="Foster Parent">Foster Parent</MenuItem>
                      <MenuItem value="Grandmother">Grandmother</MenuItem>
                      <MenuItem value="Grandfather">Grandfather</MenuItem>
                      <MenuItem value="Other">Other...</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Treatment Requirements Notes</Typography>
              <Controller
                name="treatmentRequirementsNotes"
                control={control}
                render={({ field }) => <TextField multiline minRows={2} fullWidth placeholder="Treatment Requirements Notes" {...field} sx={multilineFieldSx} />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Health History</Typography>
              <Controller
                name="healthHistory"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth sx={standardFieldSx}>
                    <Select {...field} displayEmpty MenuProps={enhancedMenuProps}>
                      <MenuItem value=""><em>Select...</em></MenuItem>
                      <MenuItem value="updated">History updated and reviewed by Doctor</MenuItem>
                      <MenuItem value="reviewed">History reviewed, no changes made</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Behavior</Typography>
              <Controller
                name="behavior"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth sx={standardFieldSx}>
                    <Select {...field} displayEmpty MenuProps={enhancedMenuProps}>
                      <MenuItem value=""><em>Select...</em></MenuItem>
                      <MenuItem value="+,+">+,+</MenuItem>
                      <MenuItem value="+,-">+,-</MenuItem>
                      <MenuItem value="-,+">-,+</MenuItem>
                      <MenuItem value="-,-">-,-</MenuItem>
                      <MenuItem value="Age Appropriate">Age Appropriate</MenuItem>
                      <MenuItem value="Condition appropriate">Condition appropriate</MenuItem>
                      <MenuItem value="Needs TLC">Needs TLC</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: 1, p: 2, height: '100%', bgcolor: '#fff' }}>
                <Controller
                  name="inPain"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel 
                      control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.ACCENT }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.ACCENT } }} />} 
                      label={<Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>Patient in pain?</Typography>} 
                    />
                  )}
                />
                
                {inPain && (
                  <Controller
                    name="painLevel"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ mt: 2, ...standardFieldSx }}>
                        <Select {...field} displayEmpty MenuProps={enhancedMenuProps}>
                          <MenuItem value=""><em>Select...</em></MenuItem>
                          <MenuItem value="Mild">Mild</MenuItem>
                          <MenuItem value="Moderate">Moderate</MenuItem>
                          <MenuItem value="Severe">Severe</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: 1, p: 2, height: '100%', bgcolor: '#fff' }}>
                <Controller
                  name="xraysNeeded"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel 
                      control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.ACCENT }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.ACCENT } }} />} 
                      label={<Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>X-rays needed today?</Typography>} 
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
               <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Nitrous Use</Typography>
               <MockRichTextEditor defaultValue="Nitrous administered:" />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: 1, p: 2, height: '100%', bgcolor: '#fff' }}>
                <Controller
                  name="nitrousGiven"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel 
                      control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.ACCENT }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.ACCENT } }} />} 
                      label={<Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>Nitrous given?</Typography>} 
                    />
                  )}
                />
                {nitrousGiven && (
                  <Controller
                    name="nitrousAmount"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ mt: 2, ...standardFieldSx }}>
                        <Select {...field} displayEmpty MenuProps={enhancedMenuProps}>
                          <MenuItem value=""><em>Select...</em></MenuItem>
                          <MenuItem value="15 minutes">50% O2/50% N2O; 15 minutes</MenuItem>
                          <MenuItem value="30 minutes">50% O2/50% N2O; 30 minutes</MenuItem>
                          <MenuItem value="45 minutes">50% O2/50% N2O; 45 minutes</MenuItem>
                          <MenuItem value="1 hour">50% O2/50% N2O; 1 hour</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Nitrous Consent Notes</Typography>
              <Controller
                name="nitrousConsentNotes"
                control={control}
                render={({ field }) => <TextField multiline minRows={3} fullWidth placeholder="Nitrous Consent Notes" {...field} sx={multilineFieldSx} />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
               <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1, mt: 1 }}>Local Anesthesia</Typography>
               <Controller
                 name="anesthesiaUsed"
                 control={control}
                 render={({ field }) => (
                   <FormControlLabel 
                      control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.ACCENT }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.ACCENT } }} />} 
                      label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>Local anesthesia used?</Typography>} 
                    />
                 )}
               />
               
                {anesthesiaUsed && (
                  <Grid container spacing={2} sx={{ mt: 1, ml: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="articaineEpi1"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel control={<Checkbox size="small" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} sx={{ '&.Mui-checked': { color: COLORS.ACCENT } }} />} label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>Articaine, 4% w/ epi 1:100k - 1 carpule</Typography>} />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="lidocaineHcl2"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel control={<Checkbox size="small" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} sx={{ '&.Mui-checked': { color: COLORS.ACCENT } }} />} label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>Lidocaine HCL, 2% w/ epi 1:100k - 2 carpules</Typography>} />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Anesthesia Notes</Typography>
              <Controller
                name="anesthesiaNotes"
                control={control}
                render={({ field }) => <TextField multiline minRows={2} fullWidth placeholder="Anesthesia Notes" {...field} sx={multilineFieldSx} />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="procedureAccomplished"
                control={control}
                render={({ field }) => <MockRichTextEditor label="Procedure Accomplished" {...field} />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
               <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Isolation</Typography>
               <Grid container spacing={1}>
                  {ISOLATION_OPTIONS.map(iso => (
                     <Grid size={{ xs: 12, sm: 4, md: 3 }} key={iso}>
                       <FormControlLabel 
                         control={
                           <Checkbox 
                             size="small" 
                             checked={isolation.includes(iso)}
                             onChange={() => handleIsolationToggle(iso)}
                             sx={{ '&.Mui-checked': { color: COLORS.ACCENT } }} 
                           />
                         } 
                         label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>{iso}</Typography>} 
                       />
                     </Grid>
                  ))}
               </Grid>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="postOpInstructions"
                control={control}
                render={({ field }) => <MockRichTextEditor label="Post-op Instructions" {...field} />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Additional Post-op Notes</Typography>
              <Controller
                name="additionalPostOpNotes"
                control={control}
                render={({ field }) => <TextField multiline minRows={2} fullWidth placeholder="Additional Post-op Notes" {...field} sx={multilineFieldSx} />}
              />
            </Grid>



            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ fontSize: fontSize.md, fontWeight: 400, color: COLORS.TEXT_PRIMARY, mb: 1 }}>Dental Assistant</Typography>
              <Controller
                name="dentalAssistant"
                control={control}
                render={({ field }) => <TextField fullWidth placeholder="Dental Assistant" {...field} sx={standardFieldSx} />}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Controller
                name="treatmentCompletedBy"
                control={control}
                render={({ field }) => <MockRichTextEditor label="Treatment completed by and signed by" {...field} />}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper elevation={0} sx={{ p: 3, mb: 1, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2, bgcolor: COLORS.SURFACE_TINT }}>
           <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 0.5 }}>Finalize</Typography>
           <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 2 }}>Each responsible provider should mark this note as complete below.</Typography>
           <Controller
             name="isComplete"
             control={control}
             render={({ field }) => (
                <FormControlLabel control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} sx={{ '&.Mui-checked': { color: COLORS.ACCENT } }} />} label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>{watch('treatmentCompletedBy') || 'Provider'} Complete</Typography>} />
             )}
           />
        </Paper>
      </Box>

      {/* Footer */}
      <Divider sx={{ borderColor: COLORS.BORDER }} />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, bgcolor: '#fff', flexShrink: 0 }}>
        <Button 
          variant="outlined" 
          disabled={isSaving}
          onClick={onCancel} 
          sx={{ 
            textTransform: 'none', 
            borderColor: COLORS.BORDER, 
            color: COLORS.ACCENT, 
            fontWeight: 400, 
            px: 3, 
            py: 0.75,
            borderRadius: '6px'
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          disabled={isSaving}
          onClick={handleSubmit(onSubmit)}
          sx={{ 
            textTransform: 'none', 
            bgcolor: COLORS.ACCENT, 
            boxShadow: 'none', 
            fontWeight: 400, 
            px: 3, 
            py: 0.75, 
            borderRadius: '6px',
            '&:hover': { bgcolor: COLORS.ACCENT_HOVER },
            '&.Mui-disabled': { bgcolor: COLORS.TEXT_MUTED, color: '#fff' }
          }}
        >
          {isSaving ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default EditNoteForm;
