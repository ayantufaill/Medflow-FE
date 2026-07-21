import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { MenuBook as MenuBookIcon } from '@mui/icons-material';

const MOVE_DATA_FIELDS = [
  'Medical And Dental History',
  'Notes',
  'Insurance',
  'Billing',
  'Treatment Plan',
  'Exam',
];

const KioskMoveDataPanel = () => {
  const [fromPatient, setFromPatient] = useState('');
  const [toPatient, setToPatient] = useState('');
  const [checkedFields, setCheckedFields] = useState({});
  const [fromProvider, setFromProvider] = useState('');
  const [toProvider, setToProvider] = useState('');

  const toggleField = (field) =>
    setCheckedFields((prev) => ({ ...prev, [field]: !prev[field] }));

  const providers = [];

  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 3, mb: 3 }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>
            Move Patient Data
          </Typography>

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            From patient:
          </Typography>
          <TextField
            size="small"
            placeholder="From Patient"
            value={fromPatient}
            onChange={(e) => setFromPatient(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            To patient:
          </Typography>
          <TextField
            size="small"
            placeholder="To Patient"
            value={toPatient}
            onChange={(e) => setToPatient(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mb: 2.5 }}>
            {MOVE_DATA_FIELDS.map((field) => (
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    size="small"
                    checked={!!checkedFields[field]}
                    onChange={() => toggleField(field)}
                    sx={{ py: 0.25 }}
                  />
                }
                label={<Typography variant="body2">{field}</Typography>}
                sx={{ m: 0 }}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            size="small"
            sx={{
              textTransform: 'none',
              backgroundColor: '#b8960c',
              '&:hover': { backgroundColor: '#9a7a0a' },
            }}
          >
            Move Patient Data
          </Button>
        </Grid>

        <Grid item xs={12} md="auto" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'stretch' }}>
          <Divider orientation="vertical" flexItem />
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            Move Provider Future Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            (future appointments & procedures, preferred DDS, etc.)
          </Typography>

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            From provider:
          </Typography>
          <FormControl size="small" fullWidth sx={{ mb: 2 }}>
            <Select value={fromProvider} onChange={(e) => setFromProvider(e.target.value)} displayEmpty>
              <MenuItem value=""><em>Select provider</em></MenuItem>
              {providers.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            To provider:
          </Typography>
          <FormControl size="small" fullWidth sx={{ mb: 3 }}>
            <Select value={toProvider} onChange={(e) => setToProvider(e.target.value)} displayEmpty>
              <MenuItem value=""><em>Select provider</em></MenuItem>
              {providers.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: 'none',
                backgroundColor: '#b8960c',
                '&:hover': { backgroundColor: '#9a7a0a' },
              }}
            >
              Move Provider Data
            </Button>
            <MenuBookIcon sx={{ color: 'text.secondary', fontSize: '1.5rem' }} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default KioskMoveDataPanel;