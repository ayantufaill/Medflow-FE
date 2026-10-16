import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { clinicalNoteService } from '../../../services/clinical-note.service';
import { progressNoteService } from '../../../services/progress-note.service';

const SOAP_FIELDS = [
  ['subjective', 'Subjective'],
  ['objective', 'Objective'],
  ['assessment', 'Assessment'],
  ['plan', 'Plan'],
];

const emptySoap = { chiefComplaint: '', subjective: '', objective: '', assessment: '', plan: '' };
const hasFieldValue = (value) => Array.isArray(value) ? value.length > 0 : typeof value === 'boolean' ? value : String(value ?? '').trim().length > 0;

const NotesDrawerComposer = ({ kind, note, template, patientId, providerId, onCancel, onSuccess }) => {
  const [soap, setSoap] = useState(emptySoap);
  const [fieldValues, setFieldValues] = useState({});
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const templateFields = useMemo(() => template?.templateStructure?.fields || note?.structuredData?.templateFields || [], [template, note]);
  const usesTemplateFields = templateFields.length > 0;

  useEffect(() => {
    const content = template?.defaultContent || {};
    setSoap(Object.fromEntries(Object.keys(emptySoap).map((key) => [key, note?.[key] || content[key] || ''])));
    setFieldValues(Object.fromEntries(templateFields.map((field) => [
      field.id,
      field.value ?? content[field.id] ?? field.defaultContent ?? (field.type === 'boolean' ? false : field.type === 'multiselect' ? [] : ''),
    ])));
    setDescription(note?.description || '');
    setError('');
  }, [kind, note, template, templateFields]);

  const save = async () => {
    if (!/^\d+$/.test(String(patientId || '')) || (!note && !/^\d+$/.test(String(providerId || '')))) {
      setError('A valid patient and provider are required to save this note.');
      return;
    }
    if (kind === 'general' && !description.trim()) {
      setError('Enter a note before saving.');
      return;
    }
    if (usesTemplateFields && templateFields.some((field) => field.required && !hasFieldValue(fieldValues[field.id]))) {
      setError('Complete the required template fields before saving.');
      return;
    }
    if (kind !== 'general' && !(usesTemplateFields
      ? Object.values(fieldValues).some(hasFieldValue)
      : Object.values(soap).some((value) => value.trim()))) {
      setError('Enter clinical note content before saving.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (kind === 'general') {
        if (note) {
          await progressNoteService.update(note.id, { description: description.trim(), category: 'General Notes' });
        } else {
          await progressNoteService.create({ patientId: String(patientId), providerId: String(providerId), category: 'General Notes', description: description.trim() });
        }
      } else {
        const existingProviderId = note?.providerId?._id || note?.providerId?.id || note?.providerId || providerId;
        const payload = {
          patientId: String(patientId),
          ...(/^\d+$/.test(String(existingProviderId || '')) ? { providerId: String(existingProviderId) } : {}),
          noteType: 'soap',
          ...(usesTemplateFields ? {
            templateId: String(template?._id || template?.id || note?.templateId || ''),
            structuredData: {
              templateName: template?.name || note?.structuredData?.templateName || 'Clinical Note',
              templateFields: templateFields.map((field) => ({ ...field, value: fieldValues[field.id] })),
            },
          } : Object.fromEntries(Object.entries(soap).map(([key, value]) => [key, value.trim()]))),
        };
        if (!payload.templateId) delete payload.templateId;
        if (note) {
          await clinicalNoteService.updateClinicalNote(note.id, payload);
        } else {
          await clinicalNoteService.createClinicalNote(payload);
        }
      }
      onSuccess();
    } catch (saveError) {
      setError(saveError?.response?.data?.error?.message || saveError?.response?.data?.message || 'Could not save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography sx={{ color: COLORS.TEXT_SECONDARY, fontSize: 13 }}>
        {kind === 'general' ? 'General note for this patient' : template?.name || 'Clinical note for this patient'}
      </Typography>
      {template?.missingContent && <Alert severity="info">No saved content is configured for this template. Enter the note details below.</Alert>}
      {kind === 'general' ? (
        <TextField label="Note" multiline minRows={7} fullWidth value={description} onChange={(event) => setDescription(event.target.value)} />
      ) : usesTemplateFields ? (
        templateFields.map((field) => field.type === 'boolean' ? (
          <FormControlLabel
            key={field.id}
            control={<Checkbox checked={Boolean(fieldValues[field.id])} onChange={(event) => setFieldValues((current) => ({ ...current, [field.id]: event.target.checked }))} />}
            label={field.label}
          />
        ) : field.type === 'select' || field.type === 'multiselect' ? (
          <TextField
            key={field.id}
            select
            label={field.label}
            fullWidth
            required={field.required}
            value={fieldValues[field.id] ?? (field.type === 'multiselect' ? [] : '')}
            onChange={(event) => setFieldValues((current) => ({ ...current, [field.id]: event.target.value }))}
            SelectProps={{ multiple: field.type === 'multiselect' }}
          >
            {(field.options || []).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
          </TextField>
        ) : (
          <TextField
            key={field.id}
            label={field.label}
            type={field.type === 'date' || field.type === 'number' ? field.type : 'text'}
            multiline={field.type === 'textarea'}
            minRows={field.type === 'textarea' ? 3 : undefined}
            fullWidth
            required={field.required}
            value={fieldValues[field.id] ?? ''}
            onChange={(event) => setFieldValues((current) => ({ ...current, [field.id]: event.target.value }))}
            InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
          />
        ))
      ) : (
        <>
          <TextField label="Chief complaint" fullWidth value={soap.chiefComplaint} onChange={(event) => setSoap((current) => ({ ...current, chiefComplaint: event.target.value }))} />
          {SOAP_FIELDS.map(([key, label]) => (
            <TextField key={key} label={label} multiline minRows={3} fullWidth value={soap[key]} onChange={(event) => setSoap((current) => ({ ...current, [key]: event.target.value }))} />
          ))}
        </>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={save} disabled={saving} sx={{ bgcolor: COLORS.ACCENT }}>
          {saving ? <CircularProgress size={20} color="inherit" /> : 'Save note'}
        </Button>
      </Box>
    </Box>
  );
};

export default NotesDrawerComposer;
