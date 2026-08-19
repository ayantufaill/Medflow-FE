import React from "react";
import { Box, Typography } from "@mui/material";
import { CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import { COLORS } from "../../../../constants/colors";
import { fontWeight } from "../../../../constants/styles";
import AppointmentSummaryCard from "../../left-panel/AppointmentSummaryCard";
import AppointmentChecklist from "../../left-panel/AppointmentChecklist";

const FamilyAppointmentsScheduledTab = ({ allAppointments, groupedAppointments, getPatientName }) => {
  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Left sidebar: upcoming summary list */}
      <Box
        sx={{
          width: "220px",
          flexShrink: 0,
          borderRight: `1px solid ${COLORS.BORDER_LIGHT}`,
          p: "16px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: COLORS.WHITE,
          overflowY: "auto",
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: fontWeight.bold,
            color: COLORS.TEXT_SECONDARY,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            mb: "12px",
          }}
        >
          Upcoming Appointments
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {allAppointments
            .filter((appt) => dayjs(appt.appointmentDate).isAfter(dayjs().subtract(1, "day"), "day"))
            .sort((a, b) => dayjs(a.appointmentDate).diff(dayjs(b.appointmentDate)))
            .map((appt, i) => (
              <Box
                key={i}
                sx={{
                  p: "8px 10px",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_LIGHT}`,
                  backgroundColor: COLORS.SURFACE_TINT,
                  cursor: "pointer",
                  "&:hover": { borderColor: COLORS.ACCENT },
                }}
              >
                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: COLORS.ACCENT }}>
                  {getPatientName(appt)}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: COLORS.TEXT_SECONDARY, mt: "2px" }}>
                  {dayjs(appt.appointmentDate).isValid()
                    ? dayjs(appt.appointmentDate).format("ddd, MMM DD")
                    : "Date TBD"}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: COLORS.TEXT_MUTED }}>
                  @ {appt.time || (() => {
                    if (appt.startTime && typeof appt.startTime === 'string' && appt.startTime.includes(':')) {
                      const [h, m] = appt.startTime.split(':');
                      let hour = parseInt(h, 10);
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      hour = hour % 12 || 12;
                      return `${hour}:${m || '00'} ${ampm}`;
                    }
                    return dayjs(appt.startTime).isValid() ? dayjs(appt.startTime).format("h:mm A") : "--:--";
                  })()}
                </Typography>
              </Box>
            ))}
          {allAppointments.filter((appt) =>
            dayjs(appt.appointmentDate).isAfter(dayjs().subtract(1, "day"), "day")
          ).length === 0 && (
            <Typography sx={{ fontSize: "12px", color: COLORS.TEXT_MUTED, fontStyle: "italic" }}>
              No upcoming appointments
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right area: columns per family member */}
      <Box sx={{ flex: 1, overflowX: "hidden", overflowY: "auto", p: "20px 24px", minWidth: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
          {groupedAppointments.map((group, idx) => (
            <Box key={idx} sx={{ width: "100%", minWidth: 0, overflow: "hidden" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  mb: "12px",
                  pb: "8px",
                  borderBottom: `2px solid ${COLORS.ACCENT}`,
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: COLORS.ACCENT + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.ACCENT }}>
                    {group.name.charAt(0)}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: COLORS.TEXT_PRIMARY, fontSize: "13px" }}>
                  {group.name}
                </Typography>
              </Box>

              {group.appointments.length > 0 ? (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", minWidth: 0 }}>
                  {group.appointments.map((appt, i) => (
                    <Box key={appt._id || i} sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                      <AppointmentSummaryCard appointment={appt} />
                      <AppointmentChecklist 
                        patientId={appt.patientId?._id || appt.patientId?.id || appt.patientId?.PatNum || appt.patientId || appt.patient?._id || appt.patient?.id || appt.patient?.PatNum || appt.patient} 
                        appointment={appt}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    p: "20px",
                    textAlign: "center",
                    border: `1px dashed ${COLORS.BORDER_LIGHT}`,
                    borderRadius: "10px",
                    backgroundColor: COLORS.WHITE,
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 28, color: COLORS.BORDER, mb: 1 }} />
                  <Typography sx={{ fontSize: "12px", color: COLORS.TEXT_MUTED }}>
                    No upcoming appointments
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FamilyAppointmentsScheduledTab;
