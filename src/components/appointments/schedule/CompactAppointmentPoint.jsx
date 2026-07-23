import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight, radius } from "../../../constants/styles";

const STATUS_COLORS = {
  unconfirmed: "#9e9e9e",
  preconfirmed: "#5c6bc0",
  confirmed: "#1976d2",
  seated: "#00796b",
  call: "#6d4c41",
  checked_out_incomplete: "#f9a825",
  checked_out_complete: "#2e7d32",
  no_show: "#616161",
  left_message: "#8d6e63",
  scheduled: "#0284c7"
};

const CompactAppointmentPoint = ({ appointment, onSlotClick }) => {
  const statusStr = String(appointment.status || '').toLowerCase();
  const isGhosted = statusStr === 'cancelled' || statusStr === 'no_show' || statusStr === 'no show' || statusStr === 'broken';
  
  const bgColor = STATUS_COLORS[statusStr] || appointment.headerColor || COLORS.ACCENT;

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
        padding: '2px 6px',
        backgroundColor: bgColor,
        borderRadius: radius.md,
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        opacity: isGhosted ? 0.7 : 1,
        '&:hover': {
          opacity: 0.85,
        },
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        height: '100%',
        width: '100%',
      }}
    >
      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: fontWeight.bold,
          color: COLORS.WHITE,
          lineHeight: 1,
        }}
      >
        {appointment.time.replace(/([ap]m)/i, (m) => m[0].toLowerCase())}
      </Typography>
      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: fontWeight.medium,
          color: COLORS.WHITE,
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
