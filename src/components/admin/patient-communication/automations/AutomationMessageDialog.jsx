import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Close as CloseIcon, ScheduleSendOutlined as AutomationIcon } from '@mui/icons-material';

import { standardFieldSx, roundedSelectMenuProps } from '../../../../constants/styles';
import { VariableButton } from '../templates/VariableButton';
import { CHANNELS, TIME_UNITS, MESSAGE_VARIABLES, toVariableToken } from './automationConfig';

const MAX_LENGTH = 1000;

const labelSx = { fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.75 };

const emptyForm = (category) => ({
  timingType: category.events.length ? 'event' : 'offset',
  event: category.events[0] ?? '',
  amount: '1',
  unit: 'Days',
  direction: category.directions[0],
  anchor: category.anchors[0],
  channel: 'Preferred',
  subject: '',
  body: '',
});

const formFromMessage = (category, message) => ({
  ...emptyForm(category),
  ...(message.timing.type === 'event'
    ? { timingType: 'event', event: message.timing.event }
    : {
        timingType: 'offset',
        amount: String(message.timing.amount),
        unit: message.timing.unit,
        direction: message.timing.direction,
        anchor: message.timing.anchor,
      }),
  channel: message.channel,
  subject: message.subject ?? '',
  body: message.body,
});

/**
 * Create/edit one automated message. Validation lives in the service;
 * `onSubmit` should resolve on success and throw an Error with its message.
 */
const AutomationMessageDialog = ({ open, category, message, onClose, onSubmit }) => {
  const [form, setForm] = useState(() => (message ? formFromMessage(category, message) : emptyForm(category)));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bodyRef = useRef(null);

  const isEdit = Boolean(message);
  const usesEmail = form.channel !== 'SMS';
  const set = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const insertVariable = (group, field) => {
    const token = toVariableToken(group, field);
    const input = bodyRef.current;
    const start = input?.selectionStart ?? form.body.length;
    const end = input?.selectionEnd ?? form.body.length;
    const body = `${form.body.slice(0, start)}${token}${form.body.slice(end)}`.slice(0, MAX_LENGTH);
    set('body', body);
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timing =
      form.timingType === 'event'
        ? { type: 'event', event: form.event }
        : { type: 'offset', amount: Number(form.amount), unit: form.unit, direction: form.direction, anchor: form.anchor };
    try {
      setSubmitting(true);
      await onSubmit({ timing, channel: form.channel, subject: usesEmail ? form.subject : '', body: form.body });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const select = (name, options, width) => (
    <TextField
      select
      size="small"
      value={form[name]}
      onChange={(e) => set(name, e.target.value)}
      disabled={submitting}
      SelectProps={{ MenuProps: roundedSelectMenuProps }}
      sx={{ ...standardFieldSx, width }}
    >
      {options.map((opt) => (
        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
      ))}
    </TextField>
  );

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      {/* The form must be a flex column so DialogContent scrolls and the action buttons stay visible on short screens. */}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: '1 1 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', px: '20px', py: '16px', borderBottom: '1px solid #e0e5eb', backgroundColor: '#f3f8fd' }}>
          <Box sx={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AutomationIcon sx={{ fontSize: '20px', color: '#2262ef' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 700, color: '#09121f' }}>
              {isEdit ? 'Edit Message' : 'New Message'}
            </Typography>
            <Typography sx={{ fontWeight: 400, color: '#5c646f', fontFamily: 'Inter', fontSize: '11px' }}>
              {category.label} automation
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={submitting} sx={{ color: '#6b7280', '&:hover': { color: '#111928', backgroundColor: '#e5e7eb' } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ py: 3, px: 4 }}>
          {/* Timing */}
          <Typography sx={labelSx}>When to send</Typography>
          {category.events.length > 0 && (
            <ToggleButtonGroup
              exclusive
              size="small"
              value={form.timingType}
              onChange={(_, value) => value && set('timingType', value)}
              disabled={submitting}
              sx={{ mb: 1.5, '& .MuiToggleButton-root': { textTransform: 'none', fontFamily: 'Inter', fontSize: '12px', px: 2 } }}
            >
              <ToggleButton value="event">On an event</ToggleButton>
              <ToggleButton value="offset">Scheduled</ToggleButton>
            </ToggleButtonGroup>
          )}
          {form.timingType === 'event' ? (
            <Box>{select('event', category.events, 340)}</Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
              <TextField
                size="small"
                type="number"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                disabled={submitting}
                inputProps={{ min: 1, max: 365 }}
                sx={{ ...standardFieldSx, width: 90 }}
              />
              {select('unit', TIME_UNITS, 120)}
              {category.directions.length > 1 ? select('direction', category.directions, 120) : (
                <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#5c646f', px: 0.5 }}>{form.direction.toLowerCase()}</Typography>
              )}
              {select('anchor', category.anchors, 240)}
            </Box>
          )}

          {/* Channel */}
          <Typography sx={{ ...labelSx, mt: 2.5 }}>Channel</Typography>
          {select('channel', CHANNELS, 200)}
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', color: '#9aa3ae', mt: 0.5 }}>
            Preferred sends via each patient’s preferred contact method.
          </Typography>

          {usesEmail && (
            <>
              <Typography sx={{ ...labelSx, mt: 2.5 }}>Email subject</Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. Your appointment is coming up"
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                disabled={submitting}
                sx={standardFieldSx}
              />
            </>
          )}

          {/* Message */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 2.5 }}>
            <Typography sx={labelSx}>Message</Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', color: '#9aa3ae' }}>
              {form.body.length}/{MAX_LENGTH}
            </Typography>
          </Box>
          <TextField
            multiline
            minRows={4}
            fullWidth
            inputRef={bodyRef}
            value={form.body}
            onChange={(e) => set('body', e.target.value.slice(0, MAX_LENGTH))}
            disabled={submitting}
            placeholder="Hi {Patient: Preferred Name}, ..."
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#fff', fontFamily: 'Inter', fontSize: '13px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' },
            }}
          />
          <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', color: '#5c646f', mt: 1.5, mb: 1 }}>
            Insert a variable at the cursor:
          </Typography>
          <Box>
            {MESSAGE_VARIABLES.filter(({ group }) => category.variableGroups.includes(group)).flatMap(({ group, fields }) =>
              fields.map((field) => (
                <VariableButton
                  key={`${group}-${field}`}
                  label={`${group} ${field}`}
                  onClick={() => !submitting && insertVariable(group, field)}
                />
              ))
            )}
          </Box>

          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#ef4444', mt: 1, minHeight: 18 }}>{error}</Typography>
        </DialogContent>

        <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
          <Button
            onClick={onClose}
            disabled={submitting}
            variant="outlined"
            sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, textTransform: 'none', borderRadius: '8px', border: '1px solid #d0d5dd', color: '#374151', px: '16px', py: '7px', '&:hover': { borderColor: '#9aa3ae', backgroundColor: '#f9fafb' } }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : null}
            sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, textTransform: 'none', borderRadius: '8px', backgroundColor: '#2262ef', color: '#fff', px: '20px', py: '7px', boxShadow: 'none', '&:hover': { backgroundColor: '#1a50cc', boxShadow: 'none' }, '&.Mui-disabled': { color: '#fff', opacity: 0.7 } }}
          >
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Message'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AutomationMessageDialog;
