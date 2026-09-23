import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { EventBusy as EventBusyIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import { COLORS } from "../../../../constants/colors";
import InitialsAvatar from "../../../shared/InitialsAvatar";

const FamilyAppointmentsDueTab = ({ recareDueDates, patientId, familyMembers, patient, schedulingDate, schedulingRoomId, allAppointments }) => {
  const memberIds = [patientId, ...(familyMembers || []).map((m) => m.id || m._id)].filter(Boolean);

  // Helper: check if a procedure code is completed for a member (not just scheduled)
  const isAlreadyCompleted = (memberId, code) => {
    if (!allAppointments || !memberId) return false;
    return allAppointments.some((appt) => {
      const apptPatientId = appt.patientId;
      const apptId = typeof apptPatientId === 'string' ? apptPatientId : apptPatientId?._id || apptPatientId?.id;
      const status = String(appt.status || '').toLowerCase();
      return apptId === memberId && appt.procedures?.some((p) => (p.code || p.procedureCode || p.ProcCode) === code) && (status === 'completed' || status === 'checked_out_complete');
    });
  };

  // Filter to only procedures that are overdue and not completed
  const dueByMember = {};
  memberIds.forEach((mid) => {
    const codes = recareDueDates?.[mid] || {};
    const needSchedule = Object.entries(codes)
      .filter(([code, v]) => v?.dueDate && dayjs(v.dueDate).isBefore(dayjs().startOf('day')) && !isAlreadyCompleted(mid, code))
      .map(([code, v]) => ({ code, ...v }));
    if (needSchedule.length > 0) dueByMember[mid] = needSchedule;
  });

  const totalDue = Object.values(dueByMember).reduce((s, arr) => s + arr.length, 0);

  const getMemberName = (mid) => {
    if (mid === patientId) return `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim() || "Patient";
    const m = (familyMembers || []).find((x) => x.id === mid || x._id === mid);
    return m ? `${m.firstName} ${m.lastName}` : "Unknown";
  };

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

      {schedulingDate && (
        <Typography sx={{ fontSize: "12px", color: COLORS.TEXT_SECONDARY, mb: "8px" }}>
          Schedule on {dayjs(schedulingDate).format("MMM DD, YYYY")} · Room: {schedulingRoomId}
        </Typography>
      )}

      {totalDue > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 500, color: COLORS.TEXT_PRIMARY, mb: "4px" }}>
            Select the appointment to schedule
          </Typography>
          {memberIds.map((mid) => {
            const needSchedule = dueByMember[mid];
            if (!needSchedule || needSchedule.length === 0) return null;
            return (
              <Box key={mid} sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
                  {getMemberName(mid)}
                </Typography>
                {needSchedule.map((proc, i) => (
                  <Box
                    key={`${mid}-${proc.code}-${i}`}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      alignItems: "center",
                      gap: "12px",
                      p: "10px 16px",
                      borderRadius: "10px",
                      backgroundColor: COLORS.WHITE,
                      border: `1px solid ${COLORS.BORDER_LIGHT}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <InitialsAvatar name={getMemberName(mid)} size={36} fontSize={12} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: "13px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {proc.procedureName || proc.code}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: COLORS.TEXT_SECONDARY }}>
                        Due {dayjs(proc.dueDate).format("MMM DD, YYYY")}
                      </Typography>
</Box>
                     <Chip
                      label="Overdue"
                      size="small"
                      sx={{
                        backgroundColor: "#fde8e8",
                        color: "#d32f2f",
                        fontWeight: 600,
                        fontSize: "11px",
                        height: "22px",
                        borderRadius: "5px",
                      }}
                    />
                  </Box>
                ))}
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
