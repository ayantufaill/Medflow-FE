import React, { useState } from "react";
import { Box, Typography, Checkbox, Collapse, Button, Divider } from "@mui/material";
import { CalendarToday as CalendarTodayIcon, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import dayjs from "dayjs";
import { COLORS } from "../../../../constants/colors";
import { fontWeight } from "../../../../constants/styles";
import AppointmentSummaryCard from "../../left-panel/AppointmentSummaryCard";
import AppointmentChecklist from "../../left-panel/AppointmentChecklist";

const ProcedureSelectionBlock = ({ memberId, memberName, dueProcedures, selectedProcedures, setSelectedProcedures }) => {
  const [open, setOpen] = useState(true);
  const selectedForMember = selectedProcedures[memberId] || [];

  const handleToggleProcedure = (proc) => {
    setSelectedProcedures(prev => {
      const current = prev[memberId] || [];
      const exists = current.find(p => p.code === proc.code);
      let updated;
      if (exists) {
        updated = current.filter(p => p.code !== proc.code);
      } else {
        updated = [...current, proc];
      }
      return { ...prev, [memberId]: updated };
    });
  };

  const durationLabel = selectedForMember.length > 0 
    ? `${30 + (selectedForMember.length - 1) * 15} min` 
    : '-- min';

  return (
    <Box sx={{ backgroundColor: COLORS.SURFACE_CARD, border: `1px solid ${COLORS.BORDER}`, borderRadius: "8px", overflow: 'hidden' }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '12px',
          py: '10px',
          cursor: 'pointer',
          backgroundColor: open ? '#f8fafc' : 'transparent',
          borderBottom: open ? `1px solid ${COLORS.BORDER}` : 'none',
          '&:hover': { backgroundColor: '#f1f5f9' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {open ? <KeyboardArrowUp sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} /> : <KeyboardArrowDown sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />}
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
            {memberName} (Due)
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "13px", color: COLORS.TEXT_MUTED }}>
          {durationLabel}
        </Typography>
      </Box>

      <Collapse in={open}>
        <Box sx={{ p: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {dueProcedures.map((proc, idx) => {
            const isSelected = selectedForMember.some(p => p.code === proc.code);
            return (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: '8px', pl: '12px' }}>
                <Checkbox 
                  size="small" 
                  checked={isSelected} 
                  onChange={() => handleToggleProcedure(proc)} 
                  sx={{ padding: 0 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_BODY }}>
                    {proc.procedureName || proc.code}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_MUTED }}>
                    Due {dayjs(proc.dueDate).format('MM/DD/YYYY')}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

const FamilyAppointmentsScheduledTab = ({ 
  allAppointments, 
  groupedAppointments, 
  getPatientName,
  isScheduling,
  selectedProcedures,
  setSelectedProcedures,
  recareDueDates,
  patientId,
  familyMembers,
  patient,
  onClose,
  onSubmit
}) => {
  const memberIds = [patientId, ...(familyMembers || []).map((m) => m.id || m._id)].filter(Boolean);

  const INACTIVE_STATUSES = new Set([
    'cancelled',
    'canceled',
    'broken',
    'deleted',
    'no show',
    'noshow',
  ]);

  const isAlreadyScheduled = (memberId, code) => {
    if (!allAppointments || !memberId) return false;

    return allAppointments.some((appt) => {
      const apptPatientId = appt.patientId;
      const apptId =
        typeof apptPatientId === 'string'
          ? apptPatientId
          : apptPatientId?._id || apptPatientId?.id;

      const status = String(appt.status || '').toLowerCase();

      return (
        apptId === memberId &&
        !INACTIVE_STATUSES.has(status) &&
        appt.procedures?.some(
          (p) => (p.code || p.procedureCode || p.ProcCode) === code
        )
      );
    });
  };

  const dueByMember = {};
  if (isScheduling) {
    memberIds.forEach((mid) => {
      const codes = recareDueDates?.[mid] || {};
      const needSchedule = Object.entries(codes)
        .filter(([code, v]) => v?.dueDate && dayjs(v.dueDate).isBefore(dayjs().startOf('day')) && !isAlreadyScheduled(mid, code))
        .map(([code, v]) => ({ code, ...v }));
      if (needSchedule.length > 0) dueByMember[mid] = needSchedule;
    });
  }

  const getMemberName = (mid) => {
    if (mid === patientId) return `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim() || "Patient";
    const m = (familyMembers || []).find((x) => x.id === mid || x._id === mid);
    return m ? `${m.firstName} ${m.lastName}` : "Unknown";
  };

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
          
          {isScheduling && Object.keys(dueByMember).length > 0 && (
            <Box sx={{ mb: "16px" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: COLORS.TEXT_PRIMARY, mb: "12px", borderBottom: `2px solid ${COLORS.ACCENT}`, pb: "8px" }}>
                Select a visit from each family member that you would like to schedule back-to-back
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {Object.entries(dueByMember).map(([mid, procs]) => (
                  <ProcedureSelectionBlock
                    key={mid}
                    memberId={mid}
                    memberName={getMemberName(mid)}
                    dueProcedures={procs}
                    selectedProcedures={selectedProcedures}
                    setSelectedProcedures={setSelectedProcedures}
                  />
                ))}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "12px", mt: "16px" }}>
                <Button
                  onClick={onClose}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
                    textTransform: "none", borderRadius: "8px",
                    border: "1px solid #d0d5dd", color: "#374151",
                    px: "16px", py: "7px",
                    "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={onSubmit}
                  variant="contained"
                  size="small"
                  disabled={!Object.values(selectedProcedures).some(procs => procs && procs.length > 0)}
                  sx={{
                    fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
                    textTransform: "none", borderRadius: "8px",
                    backgroundColor: Object.values(selectedProcedures).some(procs => procs && procs.length > 0) ? COLORS.ACCENT : "#b0b0b0",
                    color: COLORS.WHITE,
                    px: "16px", py: "7px",
                    "&:hover": { backgroundColor: Object.values(selectedProcedures).some(procs => procs && procs.length > 0) ? COLORS.ACCENT_HOVER : "#c0c0c0" },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          )}

          {isScheduling && Object.keys(dueByMember).length > 0 && (
            <>
              <Divider sx={{ mb: "16px", borderColor: COLORS.BORDER_LIGHT }} />
              <Typography sx={{ textAlign: "center", fontSize: "14px", fontWeight: 700, color: COLORS.TEXT_PRIMARY, mb: "16px", pb: "8px" }}>
                Scheduled
              </Typography>
            </>
          )}

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
