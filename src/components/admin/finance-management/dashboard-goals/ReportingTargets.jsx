import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { reportingService } from '../../../../services/reporting.service';

const fields = [
  ['dentistHourlyGoal', 'Dentist production per hour ($)'],
  ['hygienistHourlyGoal', 'Hygienist production per hour ($)'],
  ['collectionPercentGoal', 'Collection target (%)'],
  ['totalVisitGoal', 'Total production per visit ($)'],
  ['dentistVisitGoal', 'Dentist production per visit ($)'],
  ['hygienistVisitGoal', 'Hygienist production per visit ($)'],
];

export default function ReportingTargets() {
  const [values, setValues] = useState(null);
  const [changed, setChanged] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const display = data => Object.fromEntries(fields.map(([key]) => [key,
    (data.configuredKeys ?? []).includes(key) ? String(data[key]) : '',
  ]));
  useEffect(() => {
    let active = true;
    reportingService.getDashboardGoals().then(data => { if (active) setValues(display(data)); })
      .catch(() => { if (active) setError('Unable to load reporting targets.'); });
    return () => { active = false; };
  }, []);
  const save = async () => {
    setBusy(true); setError(''); setSaved(false);
    try {
      const payload = {};
      for (const key of Object.keys(changed)) {
        const value = Number(values[key]);
        if (values[key].trim() === '' || !Number.isFinite(value) || value < 0 || (key === 'collectionPercentGoal' && value > 100)) {
          throw new Error('Enter a nonnegative amount; collection percentage must be between 0 and 100. Enter 0 to disable a target.');
        }
        payload[key] = value;
      }
      const data = await reportingService.updateDashboardGoals(payload);
      setValues(display(data)); setChanged({}); setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to save reporting targets.');
    } finally { setBusy(false); }
  };
  return <Box sx={{ mb: 4 }}>
    <Typography variant="h6">Reporting targets</Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>Used by the Reports Dashboard and appointment Productivity panel. Production targets use saved provider working hours. Blank means not configured; zero disables a target.</Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {saved && <Alert severity="success" sx={{ mb: 2 }}>Reporting targets saved.</Alert>}
    {!values && !error && <CircularProgress size={24} />}
    {values && <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {fields.map(([key, label]) => <TextField key={key} label={label} type="number" size="small"
          value={values[key]} placeholder="Not configured" disabled={busy}
          inputProps={{ min: 0, step: 'any', ...(key === 'collectionPercentGoal' ? { max: 100 } : {}) }}
          onChange={e => { setValues(prev => ({ ...prev, [key]: e.target.value })); setChanged(prev => ({ ...prev, [key]: true })); setSaved(false); }} />)}
      </Box>
      <Button sx={{ mt: 2 }} variant="contained" disabled={busy || !Object.keys(changed).length} onClick={save}>Save reporting targets</Button>
    </>}
  </Box>;
}
