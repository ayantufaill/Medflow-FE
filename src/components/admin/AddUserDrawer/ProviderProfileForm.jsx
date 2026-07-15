import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Switch, FormControlLabel, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Controller } from 'react-hook-form';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const ProviderProfileForm = ({ register, control, workingHours, updateDay, PROVIDER_TITLES }) => {
  return (
    <>
    <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="NPI Number" fullWidth size="small" placeholder="National Provider ID"
            {...register('npiNumber')} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="License Number" fullWidth size="small" placeholder="State license"
            {...register('licenseNumber')} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Title</InputLabel>
            <Select label="Title" defaultValue="" {...register('providerTitle')}>
              <MenuItem value=""><em>None</em></MenuItem>
              {PROVIDER_TITLES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Specialty" fullWidth size="small" placeholder="e.g. General Dentistry"
            {...register('specialty')} />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Buffer (mins)" fullWidth size="small" type="number"
            inputProps={{ min: 0 }} helperText="Appointment buffer"
            {...register('appointmentBufferMinutes', { min: 0 })} />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Max Daily Appts" fullWidth size="small" type="number"
            inputProps={{ min: 0 }}
            {...register('maxDailyAppointments', { min: 0 })} />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Consultation Fee ($)" fullWidth size="small" type="number"
            inputProps={{ min: 0, step: '0.01' }}
            {...register('consultationFee', { min: 0 })} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller name="isAcceptingNewPatients" control={control} render={({ field }) => (
            <FormControlLabel
              label={<Typography variant="body2">Accepting new patients</Typography>}
              control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
            />
          )} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller name="telehealthEnabled" control={control} render={({ field }) => (
            <FormControlLabel
              label={<Typography variant="body2">Telehealth enabled</Typography>}
              control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
            />
          )} />
        </Grid>
      </Grid>

      {/* Working Hours / Schedule */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
        Working Hours
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Toggle a day off to mark it as unavailable. Mon–Fri default to 9 AM – 5 PM.
      </Typography>

      <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: 110 }}>Day</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', width: 80 }}>Available</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Start</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workingHours.map((row) => (
              <TableRow key={row.dayOfWeek} sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell>
                  <Typography variant="body2" fontWeight={row.isAvailable ? 600 : 400} color={row.isAvailable ? 'text.primary' : 'text.disabled'}>
                    {row.label}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Switch
                    size="small"
                    checked={row.isAvailable}
                    onChange={(e) => updateDay(row.dayOfWeek, 'isAvailable', e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  {row.isAvailable ? (
                    <TimePicker
                      value={row.startTime}
                      onChange={(v) => updateDay(row.dayOfWeek, 'startTime', v)}
                      slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.disabled">—</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {row.isAvailable ? (
                    <TimePicker
                      value={row.endTime}
                      onChange={(v) => updateDay(row.dayOfWeek, 'endTime', v)}
                      slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.disabled">—</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default ProviderProfileForm;
