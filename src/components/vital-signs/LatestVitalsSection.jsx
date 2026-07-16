import React from 'react';
import {
  Card,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import {
  FavoriteBorder as HeartIcon,
  Thermostat as TempIcon,
  Speed as BPIcon,
  MonitorWeight as WeightIcon,
  LocalHospitalOutlined as MedicalIcon,
  Air as AirIcon,
} from '@mui/icons-material';
import SectionCard from '../shared/SectionCard';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

const VitalCard = ({ icon, topText, label, value, unit, badge }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: radius.md,
      borderColor: COLORS.BORDER,
      backgroundColor: COLORS.SURFACE_DEFAULT,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      minHeight: 140,
      flex: 1,
      minWidth: 0,
    }}
  >
    {icon ? (
      <Box sx={{ mb: 1, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </Box>
    ) : topText ? (
      <Typography sx={{ mb: 1, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter', fontSize: fontSize.xs, color: COLORS.TEXT_MUTED }}>
        {topText}
      </Typography>
    ) : (
      <Box sx={{ mb: 1, height: 24 }} />
    )}
    
    <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: COLORS.TEXT_SECONDARY, mb: 0.5, textAlign: 'center' }}>
      {label}
    </Typography>
    
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: badge ? 1 : 0 }}>
      <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.bold, fontSize: '15px', color: COLORS.TEXT_PRIMARY }}>
        {value}
      </Typography>
      {unit && (
        <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', color: COLORS.TEXT_MUTED }}>
          {unit}
        </Typography>
      )}
    </Box>
    
    {badge && (
      <Box sx={{ mt: 'auto' }}>
        <Chip
          label={badge.label}
          color={badge.color}
          size="small"
          sx={{ height: 22, fontSize: '10px', fontWeight: fontWeight.bold, '& .MuiChip-label': { px: 1 } }}
        />
      </Box>
    )}
  </Card>
);

const LatestVitalsSection = ({ latestVitals, formatDate, formatBloodPressure, bpCategory, bmiCategory }) => {
  if (!latestVitals) return null;

  return (
    <SectionCard icon={MedicalIcon} title={`Latest Vitals (${formatDate(latestVitals.recordedDate)})`} sx={{ mb: 0 }}>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: { xs: 1, md: 0 } }}>
        <VitalCard
          icon={<BPIcon color="primary" />}
          label="Blood Pressure"
          value={formatBloodPressure(latestVitals.bloodPressureSystolic, latestVitals.bloodPressureDiastolic)}
          badge={bpCategory}
        />
        <VitalCard
          icon={<HeartIcon color="error" />}
          label="Heart Rate"
          value={latestVitals.heartRate || '-'}
          unit="bpm"
        />
        <VitalCard
          icon={<TempIcon color="warning" />}
          label="Temperature"
          value={latestVitals.temperature || '-'}
          unit="°F"
        />
        <VitalCard
          icon={<WeightIcon color="info" />}
          label="Weight"
          value={latestVitals.weight || '-'}
          unit="lbs"
        />
        <VitalCard
          icon={<AirIcon color="success" />}
          label="SpO2"
          value={latestVitals.oxygenSaturation || '-'}
          unit="%"
        />
        <VitalCard
          topText="BMI"
          label="Body Mass Index"
          value={latestVitals.bmi || '-'}
          badge={bmiCategory}
        />
      </Box>
    </SectionCard>
  );
};

export default LatestVitalsSection;
