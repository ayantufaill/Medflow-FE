import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const FONT_XS = { fontSize: "0.75rem" };
const FONT_SM = { fontSize: "0.8125rem" };

const STATUS_OPTIONS = [
  { value: "unconfirmed", label: "Unconfirmed" },
  { value: "preconfirmed", label: "Pre-Confirmed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "seated", label: "Seated" },
  { value: "call", label: "Call" },
  { value: "checkout incomplete", label: "Checkout Incomplete" },
  { value: "checkout complete", label: "Checkout Complete" },
  { value: "no show", label: "No Show" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "cancelled", label: "Cancelled" },
];

const providerOptions = ["KIM", "DR", "JOHN", "SARAH", "Hygienist Kim"];

const AppointmentDetailsDialog = ({
  open,
  onClose,
  selectedAppointment,
  OPERATORY_COLUMNS,
  onStatusChange,
}) => {
  const [status, setStatus] = useState("unconfirmed");

  useEffect(() => {
    if (!selectedAppointment) return;
    const next = (selectedAppointment.status || "unconfirmed").toLowerCase();
    setStatus(STATUS_OPTIONS.some((o) => o.value === next) ? next : "unconfirmed");
  }, [selectedAppointment?.id, selectedAppointment?.status, open]);

  if (!selectedAppointment) return null;

  const start = dayjs(selectedAppointment.start);
  const end = dayjs(selectedAppointment.end);
  const durationMins = end.diff(start, "minute");
  const operatoryLabel =
    OPERATORY_COLUMNS?.find((c) => c.id === selectedAppointment.columnId)?.label || selectedAppointment.columnId || "—";

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (onStatusChange && selectedAppointment.id) {
      onStatusChange(selectedAppointment.id, newStatus);
    }
  };

  return (
    <Dialog
      open={open && Boolean(selectedAppointment)}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
          minHeight: 480,
        },
      }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
          bgcolor: "#2b6cb0",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontWeight: 600, ...FONT_SM }}>
          Appointment Details
        </Typography>
      </Box>
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        <Box sx={{ display: "flex", flex: 1, minHeight: 400 }}>
          {/* Left: Patient, date/time, visit type, procedures */}
          <Box sx={{ flex: 1, p: 2, overflow: "auto", borderRight: "1px solid #e2e8f0" }}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
                Patient
              </Typography>
              <Typography sx={{ fontWeight: 600, ...FONT_SM, color: "#1e293b" }}>
                {selectedAppointment.patientName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <EventNoteIcon sx={{ color: "#64748b", fontSize: 18 }} />
              <Typography sx={{ ...FONT_XS, color: "#475569" }}>
                {start.format("dddd, MMM D, YYYY")} @ {start.format("h:mm A")} – {end.format("h:mm A")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <LocationOnIcon sx={{ color: "#64748b", fontSize: 18 }} />
              <Typography sx={{ ...FONT_XS, color: "#475569" }}>
                {operatoryLabel}
              </Typography>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>
                Type of visit
              </Typography>
              <Typography sx={{ ...FONT_SM, color: "#334155" }}>
                Treatment
              </Typography>
            </Box>

            <Typography sx={{ ...FONT_XS, fontWeight: 600, color: "#334155", mb: 1 }}>
              Procedures
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ border: "1px solid #e2e8f0", borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    <TableCell sx={{ ...FONT_XS, fontWeight: 600, color: "#475569", py: 0.75 }}>Procedure</TableCell>
                    <TableCell sx={{ ...FONT_XS, fontWeight: 600, color: "#475569", py: 0.75 }}>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ ...FONT_XS, py: 0.75 }}>{selectedAppointment.title || "—"}</TableCell>
                    <TableCell sx={{ ...FONT_XS, py: 0.75 }}>{selectedAppointment.note || "—"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Right: Status, duration, provider, notes */}
          <Paper
            elevation={0}
            sx={{
              width: 300,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              borderRadius: 0,
              borderLeft: "1px solid #e2e8f0",
            }}
          >
            <FormControl size="small" fullWidth>
              <InputLabel sx={FONT_XS}>Appointment Status</InputLabel>
              <Select
                value={status}
                onChange={handleStatusChange}
                label="Appointment Status"
                sx={FONT_XS}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value} sx={FONT_XS}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>Appt Duration</Typography>
              <Typography sx={{ ...FONT_SM, color: "#334155" }}>{durationMins} mins</Typography>
            </Box>

            <Box>
              <Typography sx={{ ...FONT_XS, fontWeight: 600, color: "#334155", mb: 0.5 }}>Provider Time</Typography>
              <Typography sx={{ ...FONT_XS, color: "#64748b" }}>
                {providerOptions[0] || "—"} – {durationMins} mins
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ ...FONT_XS, color: "#475569", mb: 0.5 }}>Notes</Typography>
              <Typography sx={{ ...FONT_XS, color: "#334155" }}>
                {selectedAppointment.note || "—"}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid #eef2f6" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            bgcolor: "#1976d2",
            px: 3,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;
