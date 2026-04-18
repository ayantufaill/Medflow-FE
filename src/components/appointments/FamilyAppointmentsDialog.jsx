import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Print as PrintIcon,
  MailOutline as MailIcon,
  ChatBubbleOutline as ChatIcon,
  Check as CheckIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { appointmentService } from "../../services/appointment.service";

/**
 * ChecklistItem Component
 */
const ChecklistItem = ({ label, checked = false }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 0.5,
      px: 1,
      borderBottom: "1px solid #eee",
      "&:last-child": { borderBottom: "none" },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <KeyboardArrowDownIcon sx={{ fontSize: 14, color: "#999" }} />
      <Typography sx={{ fontSize: "0.75rem", color: "#666", fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
    {checked && <CheckIcon sx={{ fontSize: 14, color: "#b0b0b0" }} />}
  </Box>
);

/**
 * ScheduledAppointmentCard Component
 * Replicates the purple-header card with checklists.
 */
const ScheduledAppointmentCard = ({ appointment }) => {
  const [status, setStatus] = useState(appointment.status || "scheduled");

  const headerDate = dayjs(appointment.appointmentDate).isValid() 
    ? dayjs(appointment.appointmentDate).format("MM/DD/YYYY") 
    : dayjs(appointment.startTime).format("MM/DD/YYYY");
    
  const headerTime = dayjs(appointment.startTime || appointment.appointmentDate).isValid()
    ? dayjs(appointment.startTime || appointment.appointmentDate).format("hh:mm A")
    : "---";
    
  const type = appointment.appointmentType?.name || appointment.noteType || "RECARE";

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        overflow: "hidden",
        width: "260px",
        mb: 2,
      }}
    >
      {/* CARD HEADER */}
      <Box
        sx={{
          bgcolor: "#a26da1", // Purple header color
          p: 1,
          color: "#fff",
        }}
      >
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, textAlign: "center" }}>
          {type.toUpperCase()} {headerDate} @ {headerTime}
        </Typography>
      </Box>

      {/* CARD BODY */}
      <Box sx={{ p: 1.5 }}>
        <Stack spacing={1.5}>
          {/* Status and Provider */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              size="small"
              sx={{
                height: 32,
                fontSize: "0.8rem",
                "& .MuiSelect-select": { py: 0.5, pl: 1 },
                width: "130px",
                borderRadius: "4px",
              }}
            >
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="unconfirmed">Unconfirmed</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="rescheduled">Rescheduled</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
            <Typography sx={{ fontSize: "0.85rem", color: "#666", fontWeight: 600 }}>P1</Typography>
          </Box>

          {/* Icons Row */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <MailIcon sx={{ fontSize: 20, color: "#5c7cbc" }} />
            <ChatIcon sx={{ fontSize: 20, color: "#5c7cbc" }} />
          </Box>

          {/* Description Row */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#444" }}>
              {appointment.procedures || "Maintenance, fl"}
            </Typography>
            <Box
              sx={{
                bgcolor: "#d7ebd8",
                px: 0.8,
                py: 0.2,
                borderRadius: "2px",
                border: "1px solid #c0e0c1",
              }}
            >
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: "#478c4a" }}>
                SAB
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* CHECKLISTS SECTION */}
      <Box sx={{ borderTop: "1px solid #eee" }}>
        <ChecklistItem label="Pre-appt Checklist" checked />
        <ChecklistItem label="Check-in Checklist" checked />
        <ChecklistItem label="Check-out Checklist" checked />
      </Box>
    </Paper>
  );
};

/**
 * FamilyAppointmentsDialog
 */
const FamilyAppointmentsDialog = ({ open, onClose, patient, familyMembers = [] }) => {
  const [tabValue, setTabValue] = useState(0); // Default to "Scheduled" for this task
  const [loading, setLoading] = useState(false);
  const [allAppointments, setAllAppointments] = useState([]);

  const fetchFamilyAppointments = useCallback(async () => {
    if (!patient) return;

    setLoading(true);
    try {
      const patientId = patient.id || patient._id;
      const familyIds = familyMembers.map((m) => m.id || m._id).filter((id) => id && id !== patientId);
      const allIds = [patientId, ...familyIds];

      const appointmentPromises = allIds.map((id) =>
        appointmentService.getAppointmentsByPatient(id).catch(() => [])
      );

      const results = await Promise.all(appointmentPromises);
      const flattened = results.flat();

      setAllAppointments(flattened);
    } catch (err) {
      console.error("Failed to fetch family appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [patient, familyMembers]);

  useEffect(() => {
    if (open) {
      fetchFamilyAppointments();
    }
  }, [open, fetchFamilyAppointments]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Group appointments by patient name
  const groupedAppointments = patient
    ? [patient, ...familyMembers].filter(Boolean).map((member) => {
        const memberId = member.id || member._id;
        const memberName = `${member.firstName} ${member.lastName}`;
        const appointments = allAppointments.filter(
          (appt) => (appt.patientId?._id || appt.patientId) === memberId
        );

        return {
          name: memberName,
          appointments: appointments.filter((appt) =>
            dayjs(appt.appointmentDate).isAfter(dayjs().subtract(1, "day"), "day")
          ),
        };
      })
    : [];

  const dueAppointments = allAppointments.filter((appt) =>
    dayjs(appt.appointmentDate).isBefore(dayjs(), "day")
  );

  const getPatientName = (appt) => {
    if (appt.patientId?.firstName) {
      return `${appt.patientId.firstName} ${appt.patientId.lastName}`;
    }
    const allMembers = [patient, ...familyMembers].filter(Boolean);
    const found = allMembers.find((m) => (m.id || m._id) === (appt.patientId?._id || appt.patientId));
    if (found) return `${found.firstName} ${found.lastName}`;
    return "Unknown Patient";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "4px",
          minHeight: "600px",
          maxHeight: "90vh",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          bgcolor: "#5c7cbc",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
          Family Appointments of {patient?.firstName} {patient?.lastName}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        {/* TABS & PRINT */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
            px: 2,
          }}
        >
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ minHeight: "unset" }}>
            <Tab label="Scheduled" sx={{ textTransform: "none", py: 1.5, minHeight: "unset", fontWeight: 600 }} />
            <Tab label="Due" sx={{ textTransform: "none", py: 1.5, minHeight: "unset", fontWeight: 600 }} />
          </Tabs>

          <Button
            variant="contained"
            size="small"
            startIcon={<PrintIcon />}
            sx={{
              bgcolor: "#1a3353",
              "&:hover": { bgcolor: "#12263d" },
              textTransform: "none",
              borderRadius: "20px",
              px: 3,
              height: 32,
            }}
          >
            Print
          </Button>
        </Box>

        {/* CONTENT AREA */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : tabValue === 0 ? (
          /* SCHEDULED TAB - SPLIT VIEW */
          <Box sx={{ display: "flex", flex: 1, height: "100%", overflow: "hidden" }}>
            {/* Left Panel: Summary List */}
            <Box
              sx={{
                width: "240px",
                borderRight: "1px solid #eee",
                p: 2,
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fbfbfb",
              }}
            >
              <Typography sx={{ fontWeight: 700, color: "#1a3353", mb: 2, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Upcoming Appointments
              </Typography>
              
              {allAppointments.filter(appt => dayjs(appt.appointmentDate).isAfter(dayjs().subtract(1, "day"), "day")).length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {allAppointments
                    .filter(appt => dayjs(appt.appointmentDate).isAfter(dayjs().subtract(1, "day"), "day"))
                    .sort((a, b) => dayjs(a.appointmentDate).diff(dayjs(b.appointmentDate)))
                    .map((appt, i) => (
                      <Box key={i}>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#1976d2" }}>
                          {getPatientName(appt)}
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "#666" }}>
                          {dayjs(appt.appointmentDate).format("ddd, MMM DD")} @ {dayjs(appt.startTime || appt.appointmentDate).format("hh:mm A")}
                        </Typography>
                      </Box>
                    ))
                  }
                </Box>
              ) : (
                <Typography sx={{ fontSize: "0.8rem", color: "#999", fontStyle: "italic" }}>
                  no upcomming appointments
                </Typography>
              )}
            </Box>

            {/* Right Side: Detailed Columns */}
            <Box sx={{ p: 2, flex: 1, overflowX: "auto", overflowY: "auto" }}>
              <Typography variant="h6" sx={{ textAlign: "center", textDecoration: "underline", color: "#5c7cbc", fontWeight: 600, mb: 4, fontSize: "1.1rem" }}>
                Scheduled Appointments
              </Typography>
              
              <Box sx={{ display: "flex", gap: 5, minWidth: "max-content", justifyContent: "center" }}>
                {groupedAppointments.map((group, idx) => (
                  <Box key={idx} sx={{ width: "260px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 700, color: "#333", mb: 2, textAlign: "center", fontSize: "0.95rem" }}>
                      {group.name}
                    </Typography>
                    
                    {group.appointments.length > 0 ? (
                      group.appointments.map((appt, i) => (
                        <ScheduledAppointmentCard key={appt._id || i} appointment={appt} />
                      ))
                    ) : (
                      <Typography sx={{ fontSize: "0.85rem", color: "#444", mt: 1, textAlign: "center" }}>
                        no upcomming appointments
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          /* DUE TAB - TABLE BASED */
          <Box sx={{ p: 3 }}>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& .MuiTableCell-root": { fontWeight: 700, border: "none", fontSize: "0.85rem", color: "#333" } }}>
                    <TableCell sx={{ pl: 0 }}>Family Member</TableCell>
                    <TableCell align="right" sx={{ pr: 0 }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dueAppointments.length > 0 ? (
                    dueAppointments.map((appt, i) => (
                      <TableRow key={appt._id || i} sx={{ "& .MuiTableCell-root": { borderBottom: "1px solid #f0f0f0", py: 1.5, fontSize: "0.85rem" } }}>
                        <TableCell sx={{ pl: 0, fontWeight: 500, color: "#1976d2" }}>
                          {getPatientName(appt)}
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 0 }}>
                          {dayjs(appt.appointmentDate).format("MM/DD/YYYY")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center" sx={{ py: 4, color: "#999" }}>
                        No due appointments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: "#94a3b8", "&:hover": { bgcolor: "#64748b" }, textTransform: "none", px: 4 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FamilyAppointmentsDialog;
