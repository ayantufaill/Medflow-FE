import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { EventBusy as EventBusyIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import { COLORS } from "../../../../constants/colors";

const STATUS_COLOR_MAP = {
  confirmed:              { bg: '#dcfce7', text: '#16a34a', label: 'Confirmed' },
  unconfirmed:            { bg: '#fef9c3', text: '#ca8a04', label: 'Unconfirmed' },
  preconfirmed:           { bg: '#dbeafe', text: '#2563eb', label: 'Preconfirmed' },
  seated:                 { bg: '#ede9fe', text: '#7c3aed', label: 'Seated' },
  no_show:                { bg: '#fee2e2', text: '#dc2626', label: 'No Show' },
  cancelled:              { bg: '#fee2e2', text: '#dc2626', label: 'Cancelled' },
  checked_out_complete:   { bg: '#dcfce7', text: '#16a34a', label: 'Checked Out' },
  checked_out_incomplete: { bg: '#fef9c3', text: '#ca8a04', label: 'Incomplete' },
};

const getStatusColor = (status) =>
  STATUS_COLOR_MAP[status] || { bg: COLORS.SURFACE_TINT, text: COLORS.TEXT_SECONDARY, label: status || 'Unknown' };

const FamilyAppointmentsDueTab = ({ dueAppointments, getPatientName }) => {
  return (
    <Box sx={{ flex: 1, p: "24px", overflowY: "auto" }}>
      <Typography
        sx={{
          fontSize: "13px",
          fontWeight: 600,
          color: COLORS.TEXT_SECONDARY,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          mb: "16px",
        }}
      >
        Due Appointments
      </Typography>

      {dueAppointments.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {dueAppointments.map((appt, i) => {
            const statusInfo = getStatusColor(appt.status);
            return (
              <Box
                key={appt._id || i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: COLORS.WHITE,
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: COLORS.ACCENT + "18",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: "13px", fontWeight: 700, color: COLORS.ACCENT }}>
                      {getPatientName(appt).charAt(0)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                      {getPatientName(appt)}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: COLORS.TEXT_SECONDARY }}>
                      {appt.visitType || "Appointment"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Typography sx={{ fontSize: "12px", color: COLORS.TEXT_SECONDARY }}>
                    {dayjs(appt.appointmentDate).format("MMM DD, YYYY")}
                  </Typography>
                  <Chip
                    label={statusInfo.label}
                    size="small"
                    sx={{
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.text,
                      fontWeight: 600,
                      fontSize: "11px",
                      height: "22px",
                      borderRadius: "5px",
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
            gap: "8px",
          }}
        >
          <EventBusyIcon sx={{ fontSize: 40, color: COLORS.BORDER }} />
          <Typography sx={{ fontSize: "13px", color: COLORS.TEXT_MUTED }}>
            No due appointments found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FamilyAppointmentsDueTab;
