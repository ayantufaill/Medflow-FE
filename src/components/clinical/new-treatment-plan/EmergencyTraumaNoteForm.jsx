import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Alert, Box, Button, Checkbox, Chip, CircularProgress, Divider,
  FormControl, FormControlLabel, Grid, IconButton, MenuItem, Paper, Radio, RadioGroup,
  Select, TextField, Typography
} from '@mui/material';
import {
  FormatBold, FormatItalic, FormatUnderlined,
  FormatListBulleted, FormatListNumbered,
  FormatIndentIncrease, FormatIndentDecrease
} from '@mui/icons-material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import dayjs from 'dayjs';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, standardFieldSx, radius, roundedSelectMenuProps } from '../../../constants/styles';
import { clinicalNoteService } from '../../../services/clinical-note.service';
import { selectProviderDropdownList } from '../../../store/slices/providerSlice';

const enhancedMenuProps = {
  ...roundedSelectMenuProps,
  style: { zIndex: 9999 },
  sx: { zIndex: 9999 },
};

export const TRAUMA_TEMPLATE_NAME = 'Exam - Emergency Trauma';

const EMPTY_FORM = {
  title: '', limitedExam: '', examType: '', presentedWith: [], presentedWithOther: '',
  medicalConditions: '', medicalConditionsOther: '', newMedicalConditions: '',
  medications: [], medicationsOther: '', vaccinesCurrent: '', allergies: [], allergiesOther: '',
  asaStatus: '', chiefComplaint: '', traumaHistory: '', painHistory: '',
  radiographExam: [], radiographExamOther: '', radiographsTaken: '',
  eoeIoeFindings: '', diagnosis: '', treatmentPlan: '', treatmentWith: '', treatmentWithOther: '',
  pharmacologicalIndications: [], pharmacologicalOther: '', referrals: [], referralsOther: '',
  recommendations: '', behavior: '', behaviorManagement: '', nextVisit: '', complete: false,
};

const PROMPTS = {
  limitedExam: 'Patient presents for:',
  traumaHistory: 'Trauma history:\nHistory of Accident:\nDate and time of injury:\nDescription of event:\nManaged prior to exam (hospital, other dentist, etc):\nLoss of consciousness/symptoms of concussion:\nOther bodily injuries:\nPhotos:\nSuspect of abuse:\n\nDiagnosis:',
  painHistory: 'Pain History:\nStarted:\nWhen does it hurt?\nAny medications to make it better?\nAnything making it worse?',
  radiographsTaken: 'Radiograph Type:\nTaken by:\nRadiographic Findings:',
  eoeIoeFindings: 'Document the extraoral exam, TMJ, soft tissue, and hard tissue findings.',
  treatmentPlan: 'Treatment plan and any discussion with the patient or guardian.',
  recommendations: 'Recommendations:\nPain management:\nOral hygiene:\nDiet:',
};

const FORMATTING_TOOLS = [
  ['Bold', FormatBold, '**', '**'],
  ['Italic', FormatItalic, '*', '*'],
  ['Underline', FormatUnderlined, '<u>', '</u>'],
  ['Numbered list', FormatListNumbered, '1. ', ''],
  ['Bulleted list', FormatListBulleted, '- ', ''],
  ['Indent', FormatIndentIncrease, '    ', ''],
  ['Outdent', FormatIndentDecrease, '', ''],
];

/* ── Multiline text field sx (matches EditNoteForm) ──────────────────────── */
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
  '& .MuiOutlinedInput-input': { fontSize: fontSize.base },
};

/* ── Reusable sub-components ─────────────────────────────────────────────── */

const Field = ({ label, children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
    <Typography component="label" sx={{ fontSize: fontSize.md, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const RichNarrative = ({ label, value, onChange, placeholder, readOnly }) => {
  const inputRef = useRef(null);
  const applyFormat = (before, after = before, prefix = '') => {
    const input = inputRef.current;
    if (!input || readOnly) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selected = value.slice(start, end);
    const replacement = prefix ? `${prefix}${selected}` : `${before}${selected}${after}`;
    onChange(`${value.slice(0, start)}${replacement}${value.slice(end)}`);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + (prefix || before).length, start + (prefix || before).length + selected.length);
    });
  };
  const handleTool = (name, before, after) => {
    if (name === 'Outdent') {
      const input = inputRef.current;
      const start = input.selectionStart;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      if (value.slice(lineStart).startsWith('    ')) onChange(`${value.slice(0, lineStart)}${value.slice(lineStart + 4)}`);
    } else if (['Numbered list', 'Bulleted list', 'Indent'].includes(name)) applyFormat('', '', before);
    else applyFormat(before, after);
  };
  return (
    <Field label={label}>
      <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: 1, overflow: 'hidden', bgcolor: COLORS.WHITE }}>
        {!readOnly && (
          <Box
            role="toolbar"
            aria-label={`${label} formatting`}
            sx={{ display: 'flex', gap: 1, p: 0.5, borderBottom: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT }}
          >
            {FORMATTING_TOOLS.map(([name, ToolIcon, before, after]) => (
              <IconButton
                key={name}
                aria-label={name}
                title={name}
                onClick={() => handleTool(name, before, after)}
                size="small"
              >
                {React.createElement(ToolIcon, { fontSize: 'small', sx: { color: COLORS.TEXT_BODY } })}
              </IconButton>
            ))}
          </Box>
        )}
        <TextField
          inputRef={inputRef}
          fullWidth
          multiline
          minRows={3}
          maxRows={12}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          inputProps={{ 'aria-label': label }}
          disabled={readOnly}
          variant="standard"
          InputProps={{ disableUnderline: true, sx: { p: 2, fontSize: fontSize.base, lineHeight: 1.6 } }}
        />
      </Box>
    </Field>
  );
};

const ChoiceField = ({ label, value, options, onChange, readOnly, otherValue, onOtherChange }) => (
  <Field label={label}>
    <RadioGroup value={value} onChange={(event) => onChange(event.target.value)} sx={{ gap: 0.2 }}>
      {options.map((option) => {
        const isOther = option === 'Other';
        return (
          <Box
            key={option}
            sx={{
              display: 'flex',
              flexDirection: isOther ? 'column' : 'row',
              alignItems: isOther ? 'flex-start' : 'center',
              minHeight: 30,
              minWidth: 0,
            }}
          >
            <FormControlLabel
              value={option}
              control={<Radio size="small" disabled={readOnly} sx={{ '&.Mui-checked': { color: COLORS.ACCENT } }} />}
              label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>{option}</Typography>}
              sx={{ m: 0, mr: 1 }}
            />
            {isOther && onOtherChange && (
              <Box sx={{ width: '100%', maxWidth: 300, mt: 0.75, pl: 3.5 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={otherValue}
                  onChange={(event) => onOtherChange(event.target.value)}
                  aria-label={`${label} Other`}
                  placeholder="Other"
                  disabled={readOnly || value !== 'Other'}
                  sx={standardFieldSx}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </RadioGroup>
  </Field>
);

const MultiField = ({ label, value, options, onChange, readOnly, otherValue, onOtherChange }) => {
  const isLong = (opt) => typeof opt === 'string' && opt.length > 80;
  return (
    <Field label={label}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 1, rowGap: 0.5 }}>
        {options.map((option) => {
          const isOther = option === 'Other';
          const long = isLong(option);
          return (
            <Box
              key={option}
              sx={{
                display: 'flex',
                flexDirection: isOther ? 'column' : 'row',
                alignItems: isOther ? 'flex-start' : long ? 'flex-start' : 'center',
                minWidth: 0,
                py: 0.25,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={value.includes(option)}
                    disabled={readOnly}
                    onChange={(event) => {
                      if (!event.target.checked) {
                        onChange(value.filter((item) => item !== option));
                      } else {
                        onChange([...value.filter((item) => item !== option), option]);
                      }
                    }}
                    sx={{
                      p: 0.5,
                      mr: 0.5,
                      mt: long ? -0.25 : 0,
                      '&.Mui-checked': { color: COLORS.ACCENT },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY, lineHeight: 1.4 }}>{option}</Typography>}
                sx={{ m: 0, mr: 1, alignItems: long ? 'flex-start' : 'center' }}
              />
              {isOther && onOtherChange && (
                <Box sx={{ width: '100%', maxWidth: 300, mt: 0.75, pl: 3.5 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={otherValue}
                    onChange={(event) => onOtherChange(event.target.value)}
                    aria-label={`${label} Other`}
                    placeholder="Other"
                    disabled={readOnly || !value.includes('Other')}
                    sx={standardFieldSx}
                  />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Field>
  );
};

/* ── Main Component ──────────────────────────────────────────────────────── */

const EmergencyTraumaNoteForm = ({
  note,
  template,
  patientId,
  providerId,
  currentPatient,
  selectedProcedures = [],
  providersList: propProvidersList = [],
  onCancel,
  onSuccess,
  onOpenActions,
}) => {
  const reduxProviders = useSelector(selectProviderDropdownList) || [];
  const providersList = propProvidersList.length > 0 ? propProvidersList : reduxProviders;

  const procProvider = (selectedProcedures || []).find((p) => p.provider && p.provider !== '-')?.provider;

  const initialProviderId = (() => {
    if (providerId && /^\d+$/.test(String(providerId))) return String(providerId);
    const noteProv = note?.providerId?._id || note?.providerId?.id || note?.providerId;
    if (noteProv && /^\d+$/.test(String(noteProv))) return String(noteProv);
    if (procProvider) {
      const match = providersList.find((p) =>
        String(p.providerCode || '') === String(procProvider) ||
        String(p._id || '') === String(procProvider) ||
        `${p.userId?.firstName || p.firstName || ''} ${p.userId?.lastName || p.lastName || ''}`.trim() === String(procProvider)
      );
      if (match?._id || match?.id) return String(match._id || match.id);
      if (/^\d+$/.test(String(procProvider))) return String(procProvider);
    }
    const patientProv = currentPatient?.PriProv || currentPatient?.primaryProviderId || currentPatient?.preferredDentistId;
    if (patientProv && /^\d+$/.test(String(patientProv))) return String(patientProv);
    if (providersList.length > 0) {
      const firstId = providersList[0]?._id || providersList[0]?.id || providersList[0]?.ProvNum;
      if (firstId && /^\d+$/.test(String(firstId))) return String(firstId);
    }
    return '';
  })();

  const [selectedProviderId, setSelectedProviderId] = useState(initialProviderId);

  useEffect(() => {
    if (!selectedProviderId && providersList.length > 0) {
      const fallback = (providerId && /^\d+$/.test(String(providerId)))
        ? String(providerId)
        : String(providersList[0]?._id || providersList[0]?.id || providersList[0]?.ProvNum || '');
      if (fallback) setSelectedProviderId(fallback);
    } else if (!selectedProviderId && providerId && /^\d+$/.test(String(providerId))) {
      setSelectedProviderId(String(providerId));
    }
  }, [providerId, providersList, selectedProviderId]);

  const activeProviderName = (() => {
    const targetId = selectedProviderId || providerId;
    if (targetId) {
      const match = providersList.find((p) =>
        String(p._id || p.id || p.ProvNum) === String(targetId) ||
        String(p.providerCode || '') === String(targetId) ||
        `${p.prefix || ''} ${p.firstName || ''} ${p.lastName || ''}`.trim() === String(targetId)
      );
      if (match) {
        const full = `${match.prefix || ''} ${match.firstName || ''} ${match.lastName || ''}`.trim();
        return full || match.providerCode || 'Provider';
      }
    }
    if (procProvider) {
      const match = providersList.find((p) =>
        String(p._id || p.id || p.ProvNum) === String(procProvider) ||
        String(p.providerCode || '') === String(procProvider) ||
        `${p.prefix || ''} ${p.firstName || ''} ${p.lastName || ''}`.trim() === String(procProvider)
      );
      if (match) {
        const full = `${match.prefix || ''} ${match.firstName || ''} ${match.lastName || ''}`.trim();
        return full || match.providerCode || 'Provider';
      }
      return String(procProvider);
    }
    if (providersList.length > 0) {
      const first = providersList[0];
      const full = `${first.prefix || ''} ${first.firstName || ''} ${first.lastName || ''}`.trim();
      return full || first.providerCode || 'Provider';
    }
    return 'Provider';
  })();

  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...note?.structuredData?.emergencyTrauma, complete: Boolean(note?.isSigned) }));
  const [savedId, setSavedId] = useState(note?._id || note?.id || null);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const readOnly = Boolean(note?.isSigned);
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const narrative = (key, label) => <RichNarrative label={label} value={form[key]} onChange={set(key)} placeholder={PROMPTS[key]} readOnly={readOnly} />;
  const textField = (key, label) => (
    <Field label={label}>
      <TextField
        size="small"
        fullWidth
        value={form[key]}
        onChange={(event) => set(key)(event.target.value)}
        inputProps={{ 'aria-label': label }}
        disabled={readOnly}
        sx={standardFieldSx}
      />
    </Field>
  );

  /* Load fresh data from backend when editing an existing note */
  useEffect(() => {
    const noteId = note?._id || note?.id;
    if (!noteId) return;
    let cancelled = false;
    setIsLoading(true);
    clinicalNoteService.getClinicalNoteById(noteId)
      .then((freshNote) => {
        if (cancelled) return;
        setForm({ ...EMPTY_FORM, ...freshNote?.structuredData?.emergencyTrauma, complete: Boolean(freshNote?.isSigned) });
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [note?._id, note?.id]);

  const save = async () => {
    const effectivePatientId = (() => {
      const candidates = [
        patientId,
        currentPatient?.PatNum,
        currentPatient?._id,
        currentPatient?.id,
        currentPatient?.patientId,
      ];
      for (const c of candidates) {
        if (/^\d+$/.test(String(c || ''))) return String(c);
      }
      return null;
    })();

    const effectiveProviderId = (() => {
      const candidates = [
        selectedProviderId,
        providerId,
        note?.providerId?._id || note?.providerId?.id || note?.providerId,
        currentPatient?.PriProv,
        currentPatient?.primaryProviderId,
        currentPatient?.preferredDentistId,
        providersList[0]?._id || providersList[0]?.id || providersList[0]?.ProvNum,
      ];
      for (const c of candidates) {
        if (!c) continue;
        const rawId = typeof c === 'object' ? c._id || c.id || c.ProvNum : c;
        if (/^\d+$/.test(String(rawId || ''))) return String(rawId);
      }
      return null;
    })();

    if (!effectivePatientId || (!savedId && !effectiveProviderId)) {
      setError('A valid patient and provider are required to save this note.');
      return;
    }
    const hasContent = Object.entries(form).some(([key, value]) => key !== 'complete' && key !== 'title' && (Array.isArray(value) ? value.length > 0 : String(value).trim().length > 0));
    if (!hasContent) {
      setError('Enter clinical note content before saving.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        patientId: String(effectivePatientId),
        ...(effectiveProviderId ? { providerId: String(effectiveProviderId) } : {}),
        noteType: 'soap',
        ...(template?._id || template?.id ? { templateId: String(template._id || template.id) } : {}),
        structuredData: { formType: 'emergencyTrauma', templateName: TRAUMA_TEMPLATE_NAME, schemaVersion: 1, emergencyTrauma: form },
      };
      let id = savedId;
      if (id) {
        await clinicalNoteService.updateClinicalNote(id, payload);
      } else {
        const created = await clinicalNoteService.createClinicalNote(payload);
        id = created?._id || created?.id;
        if (id) setSavedId(id);
      }
      if (form.complete) {
        if (!id) throw new Error('The note was saved, but its ID was missing. Reopen it to complete signing.');
        await clinicalNoteService.signClinicalNote(id);
      }
      if (onSuccess) onSuccess();
    } catch (saveError) {
      setError(saveError?.response?.data?.error?.message || saveError?.response?.data?.message || saveError.message || 'Could not save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading state ──────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box sx={{ overflowY: 'auto', flex: 1, p: { xs: 2, sm: 3 } }}>

        {/* ── Metadata Header Card ─────────────────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
              {dayjs().format('MMMM D, YYYY')}
            </Typography>
            <Box>
              <IconButton size="small"><NotificationsNoneIcon sx={{ color: COLORS.TEXT_SECONDARY }} /></IconButton>
              <IconButton size="small" aria-label="Note actions" onClick={onOpenActions} disabled={!onOpenActions}><MoreVertIcon sx={{ color: COLORS.TEXT_SECONDARY }} /></IconButton>
            </Box>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Note Status</Typography>
              <Chip
                label={readOnly ? 'Completed' : 'Draft'}
                size="small"
                sx={{
                  fontWeight: fontWeight.medium,
                  bgcolor: readOnly ? '#dcfce7' : '#ffedd5',
                  color: readOnly ? '#15803d' : '#c2410c',
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Tags</Typography>
              <Chip label="Clinical" size="small" color="primary" variant="outlined" sx={{ fontWeight: fontWeight.medium }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Template</Typography>
              <Chip label={TRAUMA_TEMPLATE_NAME} size="small" sx={{ fontWeight: fontWeight.medium, maxWidth: '100%' }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Provider</Typography>
              <FormControl size="small" fullWidth sx={{ ...standardFieldSx }}>
                <Select
                  value={selectedProviderId || ''}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  disabled={readOnly}
                  displayEmpty
                  sx={{ height: 32, fontSize: fontSize.sm }}
                  MenuProps={enhancedMenuProps}
                >
                  {providersList.map((p) => {
                    const id = String(p._id || p.id || p.ProvNum || '');
                    const name = `${p.prefix || ''} ${p.firstName || ''} ${p.lastName || ''}`.trim() || p.providerCode || `Provider #${id}`;
                    return <MenuItem key={id} value={id}>{name}</MenuItem>;
                  })}
                  {(!providersList || providersList.length === 0) && selectedProviderId && (
                    <MenuItem value={selectedProviderId}>{`Provider #${selectedProviderId}`}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* ── Note Title ───────────────────────────────────────────────── */}
        <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2 }}>
          {TRAUMA_TEMPLATE_NAME}
        </Typography>

        <TextField
          label="Note title"
          size="small"
          fullWidth
          value={form.title}
          onChange={(event) => set('title')(event.target.value)}
          disabled={readOnly}
          sx={{ ...standardFieldSx, mb: 3 }}
        />

        {/* ── Section 1: Patient Information ───────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Patient Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {narrative('limitedExam', 'Limited Exam')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ChoiceField label="Exam type" value={form.examType} options={['LOE', 'OV NC']} onChange={set('examType')} readOnly={readOnly} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <MultiField label="Patient presented with" value={form.presentedWith} options={['MOC', 'gFOC', 'FOC', 'Legal Guardian', 'GmOC', 'Other']} onChange={set('presentedWith')} readOnly={readOnly} otherValue={form.presentedWithOther} onOtherChange={set('presentedWithOther')} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 0.5 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <ChoiceField label="Reviewed medical history. Existing medical conditions" value={form.medicalConditions} options={['None', 'Other']} onChange={set('medicalConditions')} readOnly={readOnly} otherValue={form.medicalConditionsOther} onOtherChange={set('medicalConditionsOther')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ChoiceField label="Any new medical conditions?" value={form.newMedicalConditions} options={['Yes', 'No']} onChange={set('newMedicalConditions')} readOnly={readOnly} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <MultiField label="Current medications" value={form.medications} options={['None', 'Other']} onChange={set('medications')} readOnly={readOnly} otherValue={form.medicationsOther} onOtherChange={set('medicationsOther')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ChoiceField label="Pt is UTD on vaccines" value={form.vaccinesCurrent} options={['Yes', 'No']} onChange={set('vaccinesCurrent')} readOnly={readOnly} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <MultiField label="Allergies" value={form.allergies} options={['None', 'Other']} onChange={set('allergies')} readOnly={readOnly} otherValue={form.allergiesOther} onOtherChange={set('allergiesOther')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ChoiceField label="ASA Status" value={form.asaStatus} options={['I', 'II', 'III']} onChange={set('asaStatus')} readOnly={readOnly} />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 2: Chief Complaint & History ─────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Chief Complaint &amp; History
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {textField('chiefComplaint', 'Chief Complaint')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('traumaHistory', 'Trauma History')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('painHistory', 'Pain History')}
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 3: Examination ──────────────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Examination
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <MultiField label="Radiograph exam" value={form.radiographExam} options={['Occlusal/Periapical image indicated to evaluate for decay, periapical pathology, and/or root development', 'Panoramic taken to evaluate growth and development', 'Periapical image indicated to evaluate trauma', 'None taken', 'Other']} onChange={set('radiographExam')} readOnly={readOnly} otherValue={form.radiographExamOther} onOtherChange={set('radiographExamOther')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('radiographsTaken', 'Radiographs taken')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('eoeIoeFindings', 'EOE/IOE Findings')}
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 4: Diagnosis & Treatment ────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Diagnosis &amp; Treatment
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {textField('diagnosis', 'Diagnosis')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('treatmentPlan', 'Treatment plan')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ChoiceField label="Treatment to be completed with" value={form.treatmentWith} options={['No nitrous or sedation', 'Nitrous oxide', 'IV sedation', 'N/A', 'Other']} onChange={set('treatmentWith')} readOnly={readOnly} otherValue={form.treatmentWithOther} onOtherChange={set('treatmentWithOther')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <MultiField label="Indication for pharmacological management" value={form.pharmacologicalIndications} options={['No need for pharmacological management', 'Failed attempt with nitrous', 'Extent of treatment', 'N/A', 'Patient anxiety', 'Other', 'Medical necessity of treatment']} onChange={set('pharmacologicalIndications')} readOnly={readOnly} otherValue={form.pharmacologicalOther} onOtherChange={set('pharmacologicalOther')} />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 5: Follow-up ────────────────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Follow-up
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <MultiField label="Referrals" value={form.referrals} options={['None', 'Pitt Dental', 'Ortho', 'Pediatrician', 'Oral Surgery', 'ENT', 'Endo', 'Other']} onChange={set('referrals')} readOnly={readOnly} otherValue={form.referralsOther} onOtherChange={set('referralsOther')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('recommendations', 'Recommendations')}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {textField('behavior', 'Behavior')}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField label="Behavior Management" value={form.behaviorManagement} options={['Yes', 'No']} onChange={set('behaviorManagement')} readOnly={readOnly} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {textField('nextVisit', 'Next visit')}
            </Grid>
          </Grid>
        </Paper>

        {/* ── Finalize ────────────────────────────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 1, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2, bgcolor: COLORS.SURFACE_TINT }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 0.5 }}>
            Finalize
          </Typography>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 2 }}>
            Each responsible provider should mark this note as complete below.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.complete}
                onChange={(event) => set('complete')(event.target.checked)}
                disabled={readOnly}
                sx={{ '&.Mui-checked': { color: COLORS.ACCENT } }}
              />
            }
            label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>{activeProviderName} Complete</Typography>}
          />
        </Paper>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <Divider sx={{ borderColor: COLORS.BORDER }} />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5, bgcolor: '#fff', flexShrink: 0 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={saving}
          sx={{
            textTransform: 'none',
            borderColor: COLORS.BORDER,
            color: COLORS.ACCENT,
            fontWeight: fontWeight.regular,
            px: 3,
            py: 0.75,
            borderRadius: '6px',
          }}
        >
          {readOnly ? 'Close' : 'Cancel'}
        </Button>
        {!readOnly && (
          <Button
            variant="contained"
            onClick={save}
            disabled={saving}
            aria-label="Save note"
            sx={{
              textTransform: 'none',
              bgcolor: COLORS.ACCENT,
              boxShadow: 'none',
              fontWeight: fontWeight.regular,
              px: 3,
              py: 0.75,
              borderRadius: '6px',
              '&:hover': { bgcolor: COLORS.ACCENT_HOVER },
              '&.Mui-disabled': { bgcolor: COLORS.TEXT_MUTED, color: '#fff' },
            }}
          >
            {saving ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EmergencyTraumaNoteForm;
