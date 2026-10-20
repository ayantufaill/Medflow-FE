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

export const HYGIENE_TEMPLATE_NAME = 'Exam - Hygiene';

const EMPTY_FORM = {
  title: 'Exam - Hygiene',
  appt: '',
  apptOther: '',
  exam: '',
  appointmentTime: '',
  ptAge: '',
  ptGender: '',
  patientPresentsWith: [],
  patientPresentsWithOther: '',
  healthHistory: '',
  procedure: [],
  radiographs: [],
  radiographsOther: '',
  radiographicFindings: [],
  radiographicFindingsOther: '',
  panoramicXrayTaken: '',
  frequencyOfBrushing: '',
  whoBrushes: [],
  habits: [],
  habitsOther: '',
  oralHygieneStatus: '',
  gingivalStatus: '',
  hardTissueExam: '',
  // Extraoral & Soft Tissue
  softTissueExtraoral: '',
  tmj: '',
  tmjOther: '',
  faceNeck: '',
  faceNeckOther: '',
  facialSymmetry: '',
  facialSymmetryOther: '',
  lymphNodes: '',
  lymphNodesOther: '',
  tonsils: '',
  tonsilsOther: '',
  mucosa: '',
  mucosaOther: '',
  lips: '',
  lipsOther: '',
  // Occlusion & Orthodontic Evaluation
  occlusion: '',
  profile: '',
  occlusionDeferred: [],
  rightMolar: '',
  leftMolar: '',
  rightCanine: '',
  leftCanine: '',
  overjet: '',
  overjetOther: '',
  overbite: '',
  overbiteOther: '',
  openBite: '',
  anteriorCrossbite: '',
  posteriorRightCrossbite: '',
  posteriorLeftCrossbite: '',
  maxillaryCrowding: '',
  mandibularCrowding: '',
  functionalShift: '',
  tongueThrust: '',
  // Prevention & Caries Risk
  prevention: '',
  recommendations: [],
  cariesRisk: '',
  cariesRiskOther: '',
  // Treatment & Follow-up
  treatmentNotes: '',
  fluorideVarnish: '',
  sealants: '',
  oralHygieneInstructions: '',
  referrals: [],
  referralsOther: '',
  nextVisit: '',
  complete: false,
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

const ChoiceField = ({ label, value, options, onChange, readOnly, otherValue, onOtherChange, row = false }) => (
  <Field label={label}>
    <RadioGroup row={row} value={value} onChange={(event) => onChange(event.target.value)} sx={{ gap: row ? 3 : 0.2 }}>
      {options.map((option) => {
        const isOther = option === 'Other';
        return (
          <Box
            key={option}
            sx={{
              display: 'flex',
              flexDirection: isOther && !row ? 'column' : 'row',
              alignItems: isOther && !row ? 'flex-start' : 'center',
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
              <Box sx={{ width: '100%', maxWidth: row ? 220 : 300, mt: row ? 0 : 0.75, pl: row ? 0 : 3.5 }}>
                <TextField
                  size="small"
                  fullWidth={!row}
                  value={otherValue}
                  onChange={(event) => onOtherChange(event.target.value)}
                  aria-label={`${label} Other`}
                  placeholder="Other"
                  disabled={readOnly || value !== 'Other'}
                  sx={{ ...standardFieldSx, ...(row ? { maxWidth: 220, flex: 1 } : {}) }}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </RadioGroup>
  </Field>
);

const MultiField = ({ label, value, options, columns, onChange, readOnly, otherValue, onOtherChange }) => {
  const renderItem = (option) => {
    const isOther = option === 'Other';
    const isLong = typeof option === 'string' && option.length > 80;
    return (
      <Box
        key={option}
        sx={{
          display: 'flex',
          flexDirection: isOther ? 'column' : 'row',
          alignItems: isOther ? 'flex-start' : isLong ? 'flex-start' : 'center',
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
                mt: isLong ? -0.25 : 0,
                '&.Mui-checked': { color: COLORS.ACCENT },
              }}
            />
          }
          label={<Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY, lineHeight: 1.4 }}>{option}</Typography>}
          sx={{
            m: 0,
            mr: 1,
            alignItems: isLong ? 'flex-start' : 'center',
          }}
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
  };

  return (
    <Field label={label}>
      {columns ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 2, alignItems: 'start' }}>
          {columns.map((colOptions, colIdx) => (
            <Box key={colIdx} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {colOptions.map(renderItem)}
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 1, rowGap: 0.5 }}>
          {options.map(renderItem)}
        </Box>
      )}
    </Field>
  );
};

const HygieneNoteForm = ({
  note,
  template,
  patientId,
  patientName,
  providerId,
  appointmentId,
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
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...note?.structuredData?.hygiene, complete: Boolean(note?.isSigned) }));
  const [savedId, setSavedId] = useState(note?._id || note?.id || null);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const readOnly = Boolean(note?.isSigned);
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const narrative = (key, label, placeholder) => <RichNarrative label={label} value={form[key]} onChange={set(key)} placeholder={placeholder} readOnly={readOnly} />;
  const textField = (key, label, placeholder) => (
    <Field label={label}>
      <TextField
        size="small"
        fullWidth
        value={form[key]}
        onChange={(event) => set(key)(event.target.value)}
        inputProps={{ 'aria-label': label }}
        placeholder={placeholder}
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
        setForm({ ...EMPTY_FORM, ...freshNote?.structuredData?.hygiene, complete: Boolean(freshNote?.isSigned) });
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [note?._id, note?.id]);

  /* Auto-populate patient info on create */
  useEffect(() => {
    if (note) return;
    const resolvedName = patientName || `${currentPatient?.firstName || currentPatient?.FName || ''} ${currentPatient?.lastName || currentPatient?.LName || ''}`.trim() || 'Patient';
    const dobVal = currentPatient?.dateOfBirth || currentPatient?.dob;
    let ageStr = '';
    let dobStr = '';
    if (dobVal) {
      const dobDate = new Date(dobVal);
      dobStr = dobDate.toLocaleDateString();
      const ageDiffMs = Date.now() - dobDate.getTime();
      const ageDate = new Date(ageDiffMs);
      ageStr = `${Math.abs(ageDate.getUTCFullYear() - 1970)} Years`;
    }
    const gender = currentPatient?.gender || '';
    setForm((current) => ({
      ...current,
      title: current.title || HYGIENE_TEMPLATE_NAME,
      exam: current.exam || `Patient, ${resolvedName} presents for dental appointment at Falcon Pediatric Dentistry (11555 Meridian Market View, Peyton, CO 80831-8241)`,
      ptAge: current.ptAge || (dobStr ? `${dobStr}${ageStr ? `, ${ageStr}` : ''}` : ''),
      ptGender: current.ptGender || (gender ? (gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()) : ''),
    }));
  }, [note, patientName, currentPatient]);

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
      const noteTitle = form.title?.trim() || HYGIENE_TEMPLATE_NAME;
      const payload = {
        patientId: String(effectivePatientId),
        ...(effectiveProviderId ? { providerId: String(effectiveProviderId) } : {}),
        ...(appointmentId && /^\d+$/.test(String(appointmentId)) ? { appointmentId: String(appointmentId) } : {}),
        noteType: 'soap',
        chiefComplaint: form.appt || form.title || HYGIENE_TEMPLATE_NAME,
        subjective: form.exam || undefined,
        ...(template?._id || template?.id ? { templateId: String(template._id || template.id) } : {}),
        structuredData: {
          formType: 'hygiene',
          templateName: HYGIENE_TEMPLATE_NAME,
          schemaVersion: 1,
          hygiene: { ...form, title: noteTitle },
        },
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
      console.error('Failed to save hygiene note:', saveError);
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Note Status</Typography>
              <Chip
                label={readOnly ? 'Completed' : 'Incomplete'}
                size="small"
                sx={{
                  fontWeight: fontWeight.medium,
                  bgcolor: readOnly ? '#dcfce7' : '#ffedd5',
                  color: readOnly ? '#15803d' : '#c2410c',
                }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Tags</Typography>
              <Chip label="Clinical" size="small" color="primary" variant="outlined" sx={{ fontWeight: fontWeight.medium }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Templates</Typography>
              <Chip label={HYGIENE_TEMPLATE_NAME} size="small" sx={{ fontWeight: fontWeight.medium }} />
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <Typography sx={{ fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY, mb: 0.5 }}>Provider</Typography>
              <FormControl size="small" sx={{ minWidth: 200, ...standardFieldSx }}>
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
            </Box>
          </Box>
        </Paper>

        {/* ── Note Title ───────────────────────────────────────────────── */}
        <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2 }}>
          {HYGIENE_TEMPLATE_NAME}
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

        {/* ── Section 1: Appointment & Patient Info ─────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Appointment &amp; Patient Info
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <ChoiceField
                label="Appt"
                value={form.appt}
                options={['Comprehensive exam', 'Periodic exam', 'Limited exam', 'Infant exam (Under 3 years old)', 'Other']}
                onChange={set('appt')}
                readOnly={readOnly}
                otherValue={form.apptOther}
                onOtherChange={set('apptOther')}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              {narrative('exam', 'Exam', 'Patient presents for dental appointment...')}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {textField('appointmentTime', 'Appointment time', 'Enter appointment time')}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {narrative('ptAge', 'Pt age', 'DOB, Age')}
            </Grid>

            <Grid size={{ xs: 12 }}>
              {narrative('ptGender', 'Pt gender', 'Gender')}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MultiField
                label="Patient presents with"
                value={form.patientPresentsWith}
                columns={[
                  ['MOC', 'FOC'],
                  ['LG', 'Other'],
                ]}
                onChange={set('patientPresentsWith')}
                readOnly={readOnly}
                otherValue={form.patientPresentsWithOther}
                onOtherChange={set('patientPresentsWithOther')}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 2: Health History ─────────────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Health History
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <ChoiceField
                label="Health History"
                value={form.healthHistory}
                options={['No Changes in Health Hx', 'Health Hx has changed, see updated Hx', 'New Health Hx']}
                onChange={set('healthHistory')}
                readOnly={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 3: Procedure ─────────────────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Procedure
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <MultiField
                label="Procedure"
                value={form.procedure}
                columns={[
                  ['Prophylaxis', 'Toothbrush prophy'],
                  ['Examination', 'Fluoride or Hydroxyapatite Varnish'],
                ]}
                onChange={set('procedure')}
                readOnly={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 4: Radiographs ───────────────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Radiographs
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <MultiField
                label="Radiographs"
                value={form.radiographs}
                columns={[
                  [
                    'None, no clinical indications',
                    'None, unable due to behavior',
                    '2BW',
                    '4BW',
                    'PANO',
                    '1PA',
                    '4PA',
                    '20CC',
                  ],
                  [
                    'Declined. A thorough explanation of the benefits and risks associated with the taking of digital x-rays was verbally discussed with the parent. Despite my recommendations to have x-rays taken, the parent refused to give permission to take x-rays.',
                    'None. Reviewed xrays from referring provider',
                    'Intraoral photos taken',
                    'Other',
                  ],
                ]}
                onChange={set('radiographs')}
                readOnly={readOnly}
                otherValue={form.radiographsOther}
                onOtherChange={set('radiographsOther')}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 0.5 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MultiField
                label="Radiographic findings"
                value={form.radiographicFindings}
                columns={[
                  [
                    'Interproximal radiolucencies suggestive of caries noted as charted',
                    'Coronal radiolucencies suggestive of caries noted as charted',
                  ],
                  [
                    'No interproximal radiolucencies suggestive of caries noted',
                    'Furcal or periapical radiolucency noted as charted',
                    'Other',
                  ],
                ]}
                onChange={set('radiographicFindings')}
                readOnly={readOnly}
                otherValue={form.radiographicFindingsOther}
                onOtherChange={set('radiographicFindingsOther')}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <ChoiceField
                label="Was a Panoramic Xray taken?"
                value={form.panoramicXrayTaken}
                options={['Yes', 'No']}
                row
                onChange={set('panoramicXrayTaken')}
                readOnly={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 5: Oral Hygiene & Habits ─────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Oral Hygiene &amp; Habits
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {textField('frequencyOfBrushing', 'Frequency of Brushing Teeth', 'e.g., Twice daily')}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MultiField
                label="Who brushes?"
                value={form.whoBrushes}
                columns={[
                  ['Self'],
                  ['Parent'],
                ]}
                onChange={set('whoBrushes')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MultiField
                label="Habits?"
                value={form.habits}
                columns={[
                  ['None', 'Sippy cup', 'Thumb/finger sucking', 'Nail biting'],
                  ['Bottle of milk/juice at night', 'Grinding', 'Pacifier use', 'Other'],
                ]}
                onChange={set('habits')}
                readOnly={readOnly}
                otherValue={form.habitsOther}
                onOtherChange={set('habitsOther')}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 6: Soft Tissue & Extraoral Exam ──────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Soft Tissue &amp; Extraoral Exam
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {narrative('softTissueExtraoral', 'Soft tissue - Extraoral', 'Soft tissue - Extraoral')}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="TMJ:"
                value={form.tmj}
                options={['WNL', 'Other']}
                onChange={set('tmj')}
                readOnly={readOnly}
                otherValue={form.tmjOther}
                onOtherChange={set('tmjOther')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Face/Neck"
                value={form.faceNeck}
                options={['WNL', 'Other']}
                onChange={set('faceNeck')}
                readOnly={readOnly}
                otherValue={form.faceNeckOther}
                onOtherChange={set('faceNeckOther')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Facial Symmetry"
                value={form.facialSymmetry}
                options={['WNL', 'Other']}
                onChange={set('facialSymmetry')}
                readOnly={readOnly}
                otherValue={form.facialSymmetryOther}
                onOtherChange={set('facialSymmetryOther')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Lymph Nodes"
                value={form.lymphNodes}
                options={['WNL', 'Other']}
                onChange={set('lymphNodes')}
                readOnly={readOnly}
                otherValue={form.lymphNodesOther}
                onOtherChange={set('lymphNodesOther')}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <ChoiceField
                label="Tonsils"
                value={form.tonsils}
                options={['<25%', '25-50%', '>50%', 'Unable to assess', 'Other']}
                row
                onChange={set('tonsils')}
                readOnly={readOnly}
                otherValue={form.tonsilsOther}
                onOtherChange={set('tonsilsOther')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Mucosa"
                value={form.mucosa}
                options={['WNL', 'Other']}
                onChange={set('mucosa')}
                readOnly={readOnly}
                otherValue={form.mucosaOther}
                onOtherChange={set('mucosaOther')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Lips?"
                value={form.lips}
                options={['WNL', 'Other']}
                onChange={set('lips')}
                readOnly={readOnly}
                otherValue={form.lipsOther}
                onOtherChange={set('lipsOther')}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              {narrative('oralHygieneStatus', 'Oral Hygiene Status', 'Document oral hygiene findings...')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('gingivalStatus', 'Gingival Status', 'Document gingival findings...')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('hardTissueExam', 'Hard Tissue Exam', 'Document hard tissue findings...')}
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 7: Occlusion & Orthodontic Evaluation ──────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Occlusion &amp; Orthodontic Evaluation
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {narrative('occlusion', 'Occlusion', 'Occlusion')}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <ChoiceField
                label="Profile"
                value={form.profile}
                options={['Convex', 'Flat', 'Concave']}
                row
                onChange={set('profile')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MultiField
                label="Was occlusion deferred?"
                value={form.occlusionDeferred}
                columns={[
                  ['Yes', 'No'],
                  ['Due to age', 'Due to behavior'],
                ]}
                onChange={set('occlusionDeferred')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Right molar"
                value={form.rightMolar}
                options={['Class 1', 'Class 2', 'Class 3', 'Mesial step', 'Flush terminal plane', 'Distal step']}
                onChange={set('rightMolar')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Left Molar"
                value={form.leftMolar}
                options={['Class 1', 'Class 2', 'Class 3', 'Mesial step', 'Flush terminal plane', 'Distal step']}
                onChange={set('leftMolar')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Right Canine"
                value={form.rightCanine}
                options={['Class 1', 'Class 2', 'Class 3']}
                onChange={set('rightCanine')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Left Canine"
                value={form.leftCanine}
                options={['Class 1', 'Class 2', 'Class 3']}
                onChange={set('leftCanine')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Overjet (mm)"
                value={form.overjet}
                options={['-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', 'Other']}
                onChange={set('overjet')}
                readOnly={readOnly}
                otherValue={form.overjetOther}
                onOtherChange={set('overjetOther')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Overbite"
                value={form.overbite}
                options={['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%', '110%', 'Other']}
                onChange={set('overbite')}
                readOnly={readOnly}
                otherValue={form.overbiteOther}
                onOtherChange={set('overbiteOther')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Open bite?"
                value={form.openBite}
                options={['Yes', 'No']}
                row
                onChange={set('openBite')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Anterior Crossbite?"
                value={form.anteriorCrossbite}
                options={['Yes', 'No']}
                row
                onChange={set('anteriorCrossbite')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Posterior Right Crossbite?"
                value={form.posteriorRightCrossbite}
                options={['Yes', 'No']}
                row
                onChange={set('posteriorRightCrossbite')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Posterior Left Crossbite?"
                value={form.posteriorLeftCrossbite}
                options={['Yes', 'No']}
                row
                onChange={set('posteriorLeftCrossbite')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Maxillary Crowding"
                value={form.maxillaryCrowding}
                options={['None', 'Mild', 'Moderate', 'Severe']}
                onChange={set('maxillaryCrowding')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Mandibular Crowding"
                value={form.mandibularCrowding}
                options={['None', 'Mild', 'Moderate', 'Severe']}
                onChange={set('mandibularCrowding')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Functional Shift?"
                value={form.functionalShift}
                options={['Yes', 'No']}
                row
                onChange={set('functionalShift')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ChoiceField
                label="Tongue Thrust?"
                value={form.tongueThrust}
                options={['Yes', 'No']}
                row
                onChange={set('tongueThrust')}
                readOnly={readOnly}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 8: Prevention & Caries Risk ─────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Prevention &amp; Caries Risk
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {narrative('prevention', 'Prevention', 'Prevention')}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MultiField
                label="Recommendations"
                value={form.recommendations}
                columns={[
                  ['Maintain optimal oral hygiene', 'Improve oral hygiene', 'Floss regularly'],
                  ['Parent needs to brush', 'Parent needs to supervise'],
                ]}
                onChange={set('recommendations')}
                readOnly={readOnly}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <ChoiceField
                label="Caries Risk"
                value={form.cariesRisk}
                options={[
                  'Low (optimal fluoride, brushing, regular dental care, no caries)',
                  'Moderate (SHCN, recent immigrant)',
                  'High (active caries, suboptimal fluoride, frequent snacking, appliances)',
                  'Other',
                ]}
                onChange={set('cariesRisk')}
                readOnly={readOnly}
                otherValue={form.cariesRiskOther}
                onOtherChange={set('cariesRiskOther')}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 9: Treatment ─────────────────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Treatment
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {narrative('treatmentNotes', 'Treatment Notes', 'Treatment performed and notes...')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('fluorideVarnish', 'Fluoride / Varnish', 'Fluoride application details...')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              {narrative('sealants', 'Sealants', 'Sealant placement details...')}
            </Grid>
          </Grid>
        </Paper>

        {/* ── Section 10: Follow-up ────────────────────────────────────── */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${COLORS.BORDER}`, borderRadius: 2 }}>
          <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, mb: 2.5 }}>
            Follow-up
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {narrative('oralHygieneInstructions', 'Oral Hygiene Instructions', 'Oral hygiene instructions given to patient/parent...')}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <MultiField
                label="Referrals"
                value={form.referrals}
                columns={[
                  ['None', 'Pitt Dental', 'Ortho', 'Pediatrician'],
                  ['Oral Surgery', 'ENT', 'Endo', 'Other'],
                ]}
                onChange={set('referrals')}
                readOnly={readOnly}
                otherValue={form.referralsOther}
                onOtherChange={set('referralsOther')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              {textField('nextVisit', 'Next visit', 'e.g., 6 months')}
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

export default HygieneNoteForm;
