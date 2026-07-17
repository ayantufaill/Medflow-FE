import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight, radius } from "../../../constants/styles";

const CompactAppointmentPoint = ({ appointment, onSlotClick }) => {
  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        if (onSlotClick) onSlotClick({ detail: appointment });
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 4px',
        backgroundColor: COLORS.SURFACE_CARD,
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: radius.md,
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        '&:hover': {
          backgroundColor: '#f8fafc',
          borderColor: COLORS.ACCENT,
        },
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      <Box
        sx={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: appointment.headerColor || COLORS.ACCENT,
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: fontWeight.bold,
          color: COLORS.TEXT_PRIMARY,
          lineHeight: 1,
        }}
      >
        {appointment.time.replace(/([ap]m)/i, (m) => m[0].toLowerCase())}
      </Typography>
      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: fontWeight.medium,
          color: COLORS.TEXT_SECONDARY,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1,
        }}
      >
        {appointment.patientName}
      </Typography>
    </Box>
  );
};

export default CompactAppointmentPoint;
