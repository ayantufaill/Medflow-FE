import React, { useRef, useState } from 'react';
import { Alert, Box, Button, Checkbox, Chip, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatListNumbered, FormatIndentIncrease, FormatIndentDecrease } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { clinicalNoteService } from '../../../services/clinical-note.service';

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

const fieldSx = { '& .MuiOutlinedInput-root': { bgcolor: COLORS.WHITE, borderRadius: 1 }, '& .MuiInputBase-input': { fontSize: 13 } };
const optionSx = { m: 0, mr: 1, '& .MuiFormControlLabel-label': { fontSize: 13, color: COLORS.TEXT_BODY }, '& .MuiSvgIcon-root': { fontSize: 19 } };
const sectionSx = { display: 'flex', flexDirection: 'column', gap: 2.5, p: { xs: 2, sm: 2.5 }, bgcolor: COLORS.SURFACE_INPUT, borderRadius: 1.5 };

const Field = ({ label, children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
    <Typography component="label" sx={{ fontSize: 13, fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>{label}</Typography>
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
  return <Field label={label}>
    <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: 1, overflow: 'hidden', bgcolor: COLORS.WHITE }}>
      {!readOnly && <Box role="toolbar" aria-label={`${label} formatting`} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 1, py: 0.5, borderBottom: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT }}>
        {FORMATTING_TOOLS.map(([name, ToolIcon, before, after]) => <Button key={name} aria-label={name} title={name} onClick={() => handleTool(name, before, after)} size="small" sx={{ minWidth: 29, p: 0.25, color: COLORS.TEXT_BODY }}>{React.createElement(ToolIcon, { sx: { fontSize: 18 } })}</Button>)}
      </Box>}
      <TextField inputRef={inputRef} fullWidth multiline minRows={3} maxRows={12} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} inputProps={{ 'aria-label': label }} disabled={readOnly} sx={{ ...fieldSx, '& fieldset': { border: 'none' }, '& textarea': { lineHeight: 1.6 } }} />
    </Box>
  </Field>;
};

const ChoiceField = ({ label, value, options, onChange, readOnly, otherValue, onOtherChange }) => <Field label={label}>
  <RadioGroup value={value} onChange={(event) => onChange(event.target.value)} sx={{ gap: 0.2 }}>
    {options.map((option) => <Box key={option} sx={{ display: 'flex', alignItems: 'center', minHeight: 30 }}>
      <FormControlLabel value={option} control={<Radio size="small" disabled={readOnly} />} label={option} sx={optionSx} />
      {option === 'Other' && onOtherChange && <TextField size="small" value={otherValue} onChange={(event) => onOtherChange(event.target.value)} aria-label={`${label} Other`} placeholder="Other" disabled={readOnly || value !== 'Other'} sx={{ ...fieldSx, maxWidth: 220, flex: 1 }} />}
    </Box>)}
  </RadioGroup>
</Field>;

const MultiField = ({ label, value, options, onChange, readOnly, otherValue, onOtherChange }) => <Field label={label}>
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 1, rowGap: 0.5 }}>
    {options.map((option) => <Box key={option} sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
      <FormControlLabel control={<Checkbox size="small" checked={value.includes(option)} disabled={readOnly} onChange={(event) => {
        if (!event.target.checked) return onChange(value.filter((item) => item !== option));
        const exclusive = ['None', 'None taken', 'N/A', 'No need for pharmacological management'];
        onChange(exclusive.includes(option) ? [option] : [...value.filter((item) => !exclusive.includes(item)), option]);
      }} />} label={option} sx={optionSx} />
      {option === 'Other' && onOtherChange && <TextField size="small" value={otherValue} onChange={(event) => onOtherChange(event.target.value)} aria-label={`${label} Other`} placeholder="Other" disabled={readOnly || !value.includes('Other')} sx={{ ...fieldSx, minWidth: 95, maxWidth: 180, flex: 1 }} />}
    </Box>)}
  </Box>
</Field>;

const EmergencyTraumaNoteForm = ({ note, template, patientId, providerId, onCancel, onSuccess }) => {
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...note?.structuredData?.emergencyTrauma, complete: Boolean(note?.isSigned) }));
  const [savedId, setSavedId] = useState(note?._id || note?.id || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const readOnly = Boolean(note?.isSigned);
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const narrative = (key, label) => <RichNarrative label={label} value={form[key]} onChange={set(key)} placeholder={PROMPTS[key]} readOnly={readOnly} />;
  const textField = (key, label) => <Field label={label}><TextField size="small" fullWidth value={form[key]} onChange={(event) => set(key)(event.target.value)} inputProps={{ 'aria-label': label }} disabled={readOnly} sx={fieldSx} /></Field>;

  const save = async () => {
    if (!/^\d+$/.test(String(patientId || '')) || (!savedId && !/^\d+$/.test(String(providerId || '')))) {
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
        patientId: String(patientId),
        ...(providerId && /^\d+$/.test(String(providerId)) ? { providerId: String(providerId) } : {}),
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
      onSuccess();
    } catch (saveError) {
      setError(saveError?.response?.data?.error?.message || saveError?.response?.data?.message || saveError.message || 'Could not save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
    <Box sx={{ overflowY: 'auto', flex: 1, p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <TextField label="Note title" size="small" fullWidth value={form.title} onChange={(event) => set('title')(event.target.value)} disabled={readOnly} sx={fieldSx} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 1, alignItems: 'center' }}>
        <Typography sx={{ fontSize: 13, color: COLORS.TEXT_SECONDARY }}>Note Status</Typography><Chip label={readOnly ? 'Complete' : 'Incomplete'} size="small" sx={{ width: 'fit-content', bgcolor: readOnly ? '#dcfce7' : '#ffedd5', color: readOnly ? COLORS.STATUS_SUCCESS : COLORS.STATUS_WARNING }} />
        <Typography sx={{ fontSize: 13, color: COLORS.TEXT_SECONDARY }}>Tags</Typography><Chip label="Clinical" size="small" sx={{ width: 'fit-content', bgcolor: COLORS.ACCENT_BG, color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: 13, color: COLORS.TEXT_SECONDARY }}>Templates</Typography><Chip label={TRAUMA_TEMPLATE_NAME} size="small" sx={{ width: 'fit-content', maxWidth: '100%' }} />
      </Box>
      <Box sx={sectionSx}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>{TRAUMA_TEMPLATE_NAME}</Typography>
        {narrative('limitedExam', 'Limited Exam')}
        <ChoiceField label="Exam type" value={form.examType} options={['LOE', 'OV NC']} onChange={set('examType')} readOnly={readOnly} />
        <MultiField label="Patient presented with" value={form.presentedWith} options={['MOC', 'gFOC', 'FOC', 'Legal Guardian', 'GmOC', 'Other']} onChange={set('presentedWith')} readOnly={readOnly} otherValue={form.presentedWithOther} onOtherChange={set('presentedWithOther')} />
        <ChoiceField label="Reviewed medical history. Existing medical conditions" value={form.medicalConditions} options={['None', 'Other']} onChange={set('medicalConditions')} readOnly={readOnly} otherValue={form.medicalConditionsOther} onOtherChange={set('medicalConditionsOther')} />
        <ChoiceField label="Any new medical conditions?" value={form.newMedicalConditions} options={['Yes', 'No']} onChange={set('newMedicalConditions')} readOnly={readOnly} />
        <MultiField label="Current medications" value={form.medications} options={['None', 'Other']} onChange={set('medications')} readOnly={readOnly} otherValue={form.medicationsOther} onOtherChange={set('medicationsOther')} />
        <ChoiceField label="Pt is UTD on vaccines" value={form.vaccinesCurrent} options={['Yes', 'No']} onChange={set('vaccinesCurrent')} readOnly={readOnly} />
        <MultiField label="Allergies" value={form.allergies} options={['None', 'Other']} onChange={set('allergies')} readOnly={readOnly} otherValue={form.allergiesOther} onOtherChange={set('allergiesOther')} />
        <ChoiceField label="ASA Status" value={form.asaStatus} options={['I', 'II', 'III']} onChange={set('asaStatus')} readOnly={readOnly} />
        {textField('chiefComplaint', 'Chief Complaint')}
        {narrative('traumaHistory', 'Trauma History')}
        {narrative('painHistory', 'Pain History')}
        <MultiField label="Radiograph exam" value={form.radiographExam} options={['Occlusal/Periapical image indicated to evaluate for decay, periapical pathology, and/or root development', 'Panoramic taken to evaluate growth and development', 'Periapical image indicated to evaluate trauma', 'None taken', 'Other']} onChange={set('radiographExam')} readOnly={readOnly} otherValue={form.radiographExamOther} onOtherChange={set('radiographExamOther')} />
        {narrative('radiographsTaken', 'Radiographs taken')}
        {narrative('eoeIoeFindings', 'EOE/IOE Findings')}
        {textField('diagnosis', 'Diagnosis')}
        {narrative('treatmentPlan', 'Treatment plan')}
        <ChoiceField label="Treatment to be completed with" value={form.treatmentWith} options={['No nitrous or sedation', 'Nitrous oxide', 'IV sedation', 'N/A', 'Other']} onChange={set('treatmentWith')} readOnly={readOnly} otherValue={form.treatmentWithOther} onOtherChange={set('treatmentWithOther')} />
        <MultiField label="Indication for pharmacological management" value={form.pharmacologicalIndications} options={['No need for pharmacological management', 'Failed attempt with nitrous', 'Extent of treatment', 'N/A', 'Patient anxiety', 'Other', 'Medical necessity of treatment']} onChange={set('pharmacologicalIndications')} readOnly={readOnly} otherValue={form.pharmacologicalOther} onOtherChange={set('pharmacologicalOther')} />
        <MultiField label="Referrals" value={form.referrals} options={['None', 'Pitt Dental', 'Ortho', 'Pediatrician', 'Oral Surgery', 'ENT', 'Endo', 'Other']} onChange={set('referrals')} readOnly={readOnly} otherValue={form.referralsOther} onOtherChange={set('referralsOther')} />
        {narrative('recommendations', 'Recommendations')}
        {textField('behavior', 'Behavior')}
        <ChoiceField label="Behavior Management" value={form.behaviorManagement} options={['Yes', 'No']} onChange={set('behaviorManagement')} readOnly={readOnly} />
        {textField('nextVisit', 'Next visit')}
      </Box>
      <Box sx={sectionSx}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>Finalize</Typography>
        <Typography sx={{ fontSize: 13, color: COLORS.TEXT_SECONDARY }}>Mark this note as complete below.</Typography>
        <FormControlLabel control={<Checkbox size="small" checked={form.complete} onChange={(event) => set('complete')(event.target.checked)} disabled={readOnly} />} label="Complete" sx={optionSx} />
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
    <Box sx={{ p: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_FOOTER, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
      <Button variant="outlined" onClick={onCancel} disabled={saving} sx={{ minWidth: 110, textTransform: 'none' }}>{readOnly ? 'Close' : 'Cancel'}</Button>
      {!readOnly && <Button variant="contained" onClick={save} disabled={saving} aria-label="Save note" sx={{ minWidth: 110, textTransform: 'none', bgcolor: COLORS.ACCENT }}>{saving ? 'Saving...' : 'Save'}</Button>}
    </Box>
  </Box>;
};

export default EmergencyTraumaNoteForm;
