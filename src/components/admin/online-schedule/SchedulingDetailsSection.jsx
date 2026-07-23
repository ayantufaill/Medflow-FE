import React from 'react';
import {
  Box, Typography, Switch, TextField, Checkbox, FormControlLabel, Paper
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SectionHeader from './SectionHeader';

const SchedulingDetailsSection = ({ settings, onSettingsChange, onRuleChange }) => (
  <Paper
    elevation={0}
    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
  >
    <SectionHeader
      number={1}
      icon={CalendarMonthIcon}
      title="Scheduling Details"
      subtitle="Booking windows, card requirements, and patient facing rules"
    />

    <Box sx={{ px: 3, py: 2.5 }}>
      {/* Enable online scheduling */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" fontWeight={500}>Enable online scheduling</Typography>
        <Switch
          checked={settings.enableOnlineScheduling}
          onChange={(e) => onSettingsChange('enableOnlineScheduling', e.target.checked)}
          color="primary"
        />
      </Box>

      {/* Booking restrictions */}
      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        <Typography variant="body2">Do not allow patients to book less than</Typography>
        <TextField
          variant="outlined"
          size="small"
          value={settings.bookLessThanHours}
          onChange={(e) => onSettingsChange('bookLessThanHours', e.target.value)}
          sx={{ width: 50, '& input': { textAlign: 'center', py: 0.5, fontSize: '0.85rem' } }}
        />
        <Typography variant="body2">hours before an appointment</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Typography variant="body2">Do not allow patients to book appointments more than</Typography>
        <TextField
          variant="outlined"
          size="small"
          value={settings.bookMoreThanDays}
          onChange={(e) => onSettingsChange('bookMoreThanDays', e.target.value)}
          sx={{ width: 50, '& input': { textAlign: 'center', py: 0.5, fontSize: '0.85rem' } }}
        />
        <Typography variant="body2">days in advance</Typography>
      </Box>

      {/* Card on File */}
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>Card on File</Typography>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={settings.requireCreditCard}
            onChange={(e) => onSettingsChange('requireCreditCard', e.target.checked)}
            sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }}
          />
        }
        label={<Typography variant="body2">Require Credit Card for New Patients (for Online Booking)</Typography>}
        sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
      />

      {/* Rules & Restrictions */}
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>Rules & Restrictions</Typography>
      {settings.rules.map((rule, i) => (
        <Box
          key={i}
          sx={{
            mb: 2.5,
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          {/* Rule checkbox label */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 0.5, minWidth: 80 }}>
            <Checkbox
              size="small"
              checked={rule.enabled}
              onChange={(e) => onRuleChange(i, 'enabled', e.target.checked)}
              sx={{
                color: '#2563eb',
                '&.Mui-checked': { color: '#2563eb' },
                p: 0.5,
              }}
            />
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Rule {i + 1}
            </Typography>
          </Box>

          {/* Rule content */}
          <Box flex={1}>
            <TextField
              fullWidth
              size="small"
              value={rule.title}
              onChange={(e) => onRuleChange(i, 'title', e.target.value)}
              placeholder="Rule title"
              sx={{ mb: 1, '& .MuiInputBase-input': { fontWeight: 600, fontSize: '0.85rem' } }}
            />
            <TextField
              fullWidth
              size="small"
              value={rule.body}
              onChange={(e) => onRuleChange(i, 'body', e.target.value)}
              placeholder="Rule description"
              sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  </Paper>
);

export default SchedulingDetailsSection;
