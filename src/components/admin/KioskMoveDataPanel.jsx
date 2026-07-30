import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Dialog,
  IconButton,
} from '@mui/material';
import { MenuBook as MenuBookIcon, Close as CloseIcon } from '@mui/icons-material';
import { standardFieldSx, radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

const MOVE_DATA_FIELDS = [
  'Medical And Dental History',
  'Notes',
  'Insurance',
  'Billing',
  'Treatment Plan',
  'Exam',
];

const KioskMoveDataPanel = ({ open, onClose }) => {
  const [fromPatient, setFromPatient] = useState('');
  const [toPatient, setToPatient] = useState('');
  const [checkedFields, setCheckedFields] = useState({});
  const [fromProvider, setFromProvider] = useState('');
  const [toProvider, setToProvider] = useState('');

  const toggleField = (field) =>
    setCheckedFields((prev) => ({ ...prev, [field]: !prev[field] }));

  const providers = []; // Provide your mock or real providers here

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 1305 }}
      PaperProps={{
        sx: {
          borderRadius: radius.xl,
          border: `1px solid ${COLORS.BORDER}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: `1px solid ${COLORS.BORDER}`, backgroundColor: COLORS.SURFACE_TINT }}>
        <Typography variant="h6" fontWeight={700} color={COLORS.TEXT_PRIMARY}>
          Move Kiosk Data
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_MUTED }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 4, backgroundColor: '#fff' }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>
              Move Patient Data
            </Typography>

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              From patient:
            </Typography>
            <TextField
              placeholder="From Patient"
              value={fromPatient}
              onChange={(e) => setFromPatient(e.target.value)}
              fullWidth
              sx={{ ...standardFieldSx, mb: 2 }}
            />

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              To patient:
            </Typography>
            <TextField
              placeholder="To Patient"
              value={toPatient}
              onChange={(e) => setToPatient(e.target.value)}
              fullWidth
              sx={{ ...standardFieldSx, mb: 2 }}
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
              disableElevation
              sx={{
                textTransform: 'none',
                borderRadius: radius.md,
                fontFamily: 'Inter',
                fontSize: fontSize.base,
                fontWeight: fontWeight.semibold,
                backgroundColor: COLORS.ACCENT,
                '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
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
            <TextField
              select
              value={fromProvider}
              onChange={(e) => setFromProvider(e.target.value)}
              fullWidth
              sx={{ ...standardFieldSx, mb: 2 }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: { sx: { zIndex: 1400 } }
              }}
            >
              <MenuItem value=""><em>Select provider</em></MenuItem>
              {providers.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              To provider:
            </Typography>
            <TextField
              select
              value={toProvider}
              onChange={(e) => setToProvider(e.target.value)}
              fullWidth
              sx={{ ...standardFieldSx, mb: 3 }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: { sx: { zIndex: 1400 } }
              }}
            >
              <MenuItem value=""><em>Select provider</em></MenuItem>
              {providers.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  textTransform: 'none',
                  borderRadius: radius.md,
                  fontFamily: 'Inter',
                  fontSize: fontSize.base,
                  fontWeight: fontWeight.semibold,
                  backgroundColor: COLORS.ACCENT,
                  '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
                }}
              >
                Move Provider Data
              </Button>
              <MenuBookIcon sx={{ color: 'text.secondary', fontSize: '1.5rem', mt: 1 }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default KioskMoveDataPanel;