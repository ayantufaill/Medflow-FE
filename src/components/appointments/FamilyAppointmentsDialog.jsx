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
  Checkbox,
  Collapse,
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
import { useDispatch, useSelector } from "react-redux";
import { fetchFamilyAppointments, selectFamilyAppointmentsList, selectFamilyAppointmentsLoading, updateAppointmentThunk } from "../../store/slices/appointmentSlice";
import { fetchCurrentPracticeInfo } from "../../store/slices/practiceInfoSlice";

/**
 * ChecklistItem Component
 */
const CollapsibleChecklist = ({ title, items, selections, onToggleItem, open, onToggleOpen }) => {
  const doneCount = items.filter(item => selections[item]).length;
  const totalCount = items.length;

  return (
    <Box sx={{ borderBottom: "1px solid #eee" }}>
      <Box 
        onClick={(e) => {
          e.stopPropagation();
          onToggleOpen();
        }}
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          py: 0.5, 
          px: 1.5, 
          cursor: "pointer",
          bgcolor: "#fdfdfd",
          "&:hover": { bgcolor: "#f1f5f9" }
        }}
      >
        <Typography sx={{ fontSize: "0.75rem", color: "#334155", fontWeight: 600 }}>
          {title} ({doneCount}/{totalCount})
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {doneCount === totalCount && totalCount > 0 ? (
            <CheckIcon sx={{ fontSize: 14, color: "#10b981", fontWeight: 'bold' }} />
          ) : null}
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#64748b", transform: open ? "rotate(180deg)" : "none", transition: "0.2s" }} />
        </Box>
      </Box>
      <Collapse in={open}>
        <Box sx={{ pl: 3.5, pr: 1.5, py: 0.5, bgcolor: "#fff", display: "flex", flexDirection: "column", gap: 0.25 }}>
          {items.map(item => (
            <Box key={item} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.1 }} onClick={(e) => e.stopPropagation()}>
              <Typography sx={{ fontSize: "0.7rem", color: "#475569" }}>{item}</Typography>
              <Checkbox 
                size="small" 
                checked={!!selections[item]} 
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleItem(item);
                }}
                onClick={(e) => e.stopPropagation()}
                sx={{ p: 0.25 }}
              />
            </Box>
          ))}
          {items.length === 0 && (
            <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontStyle: "italic", py: 0.5 }}>
              No items configured
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

const APPOINTMENT_STATUS_OPTIONS = [
  { value: "unconfirmed", label: "Unconfirmed" },
  { value: "preconfirmed", label: "Preconfirmed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "arrived", label: "Arrived" },
  { value: "ready_to_be_seated", label: "Ready To Be Seated" },
  { value: "seated", label: "Seated" },
  { value: "ready_for_doctor", label: "Ready For Doctor" },
  { value: "in_treatment", label: "In Treatment" },
  { value: "ready_for_checkout", label: "Ready For Checkout" },
  { value: "checked_out_incomplete", label: "Checked out incomplete" },
  { value: "checked_out_complete", label: "Checked out complete" },
  { value: "no_show", label: "No Show" },
  { value: "call", label: "Call" },
  { value: "left_message", label: "Left message" },
  { value: "running_late", label: "Running Late" },
  { value: "sent_email_or_text", label: "Sent Email Or Text" },
  { value: "late", label: "Late" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rescheduled", label: "Rescheduled" },
];

/**
 * ScheduledAppointmentCard Component
 * Replicates the purple-header card with checklists.
 */
const ScheduledAppointmentCard = ({ appointment }) => {
  const dispatch = useDispatch();
  const practiceData = useSelector((state) => state.practiceInfo.data);

  const preApptItems = practiceData?.scheduleConfig?.preApptChecklist || ["Import History", "Import Record", "Appt Reminder", "Verify Insurance Eligibility", "Share Consent Forms", "Deposit for treatment"];
  const checkInItems = practiceData?.scheduleConfig?.checkInChecklist || ["Review Records", "Review & sign Visit Plan", "Sign Consent Forms", "Verify Premed Taken"];
  const checkOutItems = practiceData?.scheduleConfig?.checkOutChecklist || ["Complete & Bill Procedures", "Purchase Products", "Share Clinical Reports", "Prescription", "Schedule Next Appt", "Send Lab Case"];

  const [preApptOpen, setPreApptOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const headerDate = dayjs(appointment.appointmentDate).isValid() 
    ? dayjs(appointment.appointmentDate).format("MM/DD/YYYY") 
    : dayjs(appointment.startTime).format("MM/DD/YYYY");
    
  const headerTime = dayjs(appointment.startTime || appointment.appointmentDate).isValid()
    ? dayjs(appointment.startTime || appointment.appointmentDate).format("hh:mm A")
    : "---";
    
  const type = appointment.appointmentType?.name || appointment.noteType || "RECARE";

  const checklistsState = appointment.checklists || { preAppt: {}, checkIn: {}, checkOut: {} };
  const currentStatus = appointment.status || "unconfirmed";
  const showAllChecklists = !["unconfirmed", "preconfirmed", "confirmed", "scheduled"].includes(currentStatus);

  const handleToggleItem = (category, item) => {
    const currentCategorySelections = checklistsState[category] || {};
    const updatedChecklists = {
      ...checklistsState,
      [category]: {
        ...currentCategorySelections,
        [item]: !currentCategorySelections[item]
      }
    };

    dispatch(updateAppointmentThunk({
      appointmentId: appointment._id || appointment.id,
      payload: { checklists: updatedChecklists }
    }));
  };

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
              value={currentStatus}
              onChange={(e) => {
                const newStatus = e.target.value;
                dispatch(updateAppointmentThunk({
                  appointmentId: appointment._id || appointment.id,
                  payload: { status: newStatus }
                }));
              }}
              size="small"
              sx={{
                height: 32,
                fontSize: "0.8rem",
                "& .MuiSelect-select": { py: 0.5, pl: 1 },
                width: "150px",
                borderRadius: "4px",
              }}
            >
              {APPOINTMENT_STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "0.8rem" }}>
                  {opt.label}
                </MenuItem>
              ))}
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
      <Box sx={{ borderTop: "1px solid #eee", bgcolor: "#f9f9f9" }}>
        <CollapsibleChecklist 
          title="Pre-appt Checklist" 
          items={preApptItems} 
          selections={checklistsState.preAppt || {}} 
          onToggleItem={(item) => handleToggleItem('preAppt', item)}
          open={preApptOpen}
          onToggleOpen={() => setPreApptOpen(!preApptOpen)}
        />
        {showAllChecklists && (
          <>
            <CollapsibleChecklist 
              title="Check-in Checklist" 
              items={checkInItems} 
              selections={checklistsState.checkIn || {}} 
              onToggleItem={(item) => handleToggleItem('checkIn', item)}
              open={checkInOpen}
              onToggleOpen={() => setCheckInOpen(!checkInOpen)}
            />
            <CollapsibleChecklist 
              title="Check-out Checklist" 
              items={checkOutItems} 
              selections={checklistsState.checkOut || {}} 
              onToggleItem={(item) => handleToggleItem('checkOut', item)}
              open={checkOutOpen}
              onToggleOpen={() => setCheckOutOpen(!checkOutOpen)}
            />
          </>
        )}
      </Box>
    </Paper>
  );
};

/**
 * FamilyAppointmentsDialog
 */
const FamilyAppointmentsDialog = ({ open, onClose, patient, familyMembers = [] }) => {
  const [tabValue, setTabValue] = useState(0); // Default to "Scheduled" for this task
  
  const dispatch = useDispatch();
  const allAppointments = useSelector(selectFamilyAppointmentsList);
  const loading = useSelector(selectFamilyAppointmentsLoading);

  const fetchFamilyAppointmentsData = useCallback(() => {
    if (!patient) return;
    const patientId = patient.id || patient._id;
    const familyIds = familyMembers.map((m) => m.id || m._id).filter((id) => id && id !== patientId);
    const allIds = [patientId, ...familyIds];

    dispatch(fetchFamilyAppointments(allIds));
  }, [patient, familyMembers, dispatch]);

  useEffect(() => {
    if (open) {
      fetchFamilyAppointmentsData();
      dispatch(fetchCurrentPracticeInfo(true));
    }
  }, [open, fetchFamilyAppointmentsData, dispatch]);

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

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", "@media print": { p: 0, '& .no-print': { display: 'none !important' } } }}>
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              .printable-content, .printable-content * { visibility: visible; }
              .printable-content { position: absolute; left: 0; top: 0; width: 100%; }
            }
          `}
        </style>
        <Box className="printable-content" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
            onClick={() => window.print()}
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
        </Box>
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
