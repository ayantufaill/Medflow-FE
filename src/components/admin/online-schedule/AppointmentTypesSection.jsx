import React from 'react';
import {
  Box, Typography, Checkbox, FormControlLabel, Grid, Paper
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SectionHeader from './SectionHeader';

const appointmentTypes = [
  'Exam', 'Emergency', 'Cleaning', 'Treatment', 'Other',
  'Online Consult', 'Custom1', 'Custom2', 'Custom3',
  'Custom4', 'Custom5', 'Custom6', 'Custom7',
  'Custom8', 'Custom9', 'Custom10'
];

const AppointmentTypesSection = ({ enabledTypes, onToggleType }) => (
  <Paper
    elevation={0}
    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
  >
    <SectionHeader
      number={2}
      icon={LocalOfferIcon}
      title="Appointment Types Setup"
      subtitle="Choose which visit types patients can book online"
    />

    <Box sx={{ px: 3, py: 2.5 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {appointmentTypes.slice(0, 8).map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    size="small"
                    checked={enabledTypes.includes(type)}
                    onChange={() => onToggleType(type)}
                    sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }}
                  />
                }
                label={<Typography variant="body2">{type}</Typography>}
                sx={{ my: -0.2 }}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {appointmentTypes.slice(8).map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    size="small"
                    checked={enabledTypes.includes(type)}
                    onChange={() => onToggleType(type)}
                    sx={{ color: '#2563eb', '&.Mui-checked': { color: '#2563eb' } }}
                  />
                }
                label={<Typography variant="body2">{type}</Typography>}
                sx={{ my: -0.2 }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Paper>
);

export default AppointmentTypesSection;
