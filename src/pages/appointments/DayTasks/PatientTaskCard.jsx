import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useState } from 'react';
import { COLORS } from '../../../constants/colors';
import { radius } from '../../../constants/styles';
import InitialsAvatar from '../../../components/shared/InitialsAvatar';
import PatientTaskRow from './PatientTaskRow';

const PatientTaskCard = ({ patient }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <Box sx={{ 
      border: `1px solid ${COLORS.BORDER}`, 
      borderRadius: radius.lg,
      bgcolor: COLORS.SURFACE_CARD,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      opacity: isRefreshing ? 0.6 : 1,
      transition: 'opacity 0.2s',
      pointerEvents: isRefreshing ? 'none' : 'auto'
    }}>
      {/* Patient Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        bgcolor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <InitialsAvatar name={patient.name} size={28} fontSize={11} bg={COLORS.PRIMARY} />
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
            {patient.name} <span style={{ color: COLORS.TEXT_SECONDARY, fontWeight: 500 }}>({patient.patientId})</span>
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: COLORS.TEXT_SECONDARY }} onClick={handleRefresh}>
          {isRefreshing ? <CircularProgress size={16} color="inherit" /> : <Refresh fontSize="small" />}
        </IconButton>
      </Box>

      {/* Card Body - List of tasks */}
      <Box sx={{ px: 2, py: 0.5, flex: 1 }}>
        {patient.tasks.map((task, idx) => (
          <PatientTaskRow key={idx} task={task} />
        ))}
      </Box>
    </Box>
  );
};

export default PatientTaskCard;
