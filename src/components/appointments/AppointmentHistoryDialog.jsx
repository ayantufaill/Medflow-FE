import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
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
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { appointmentService } from "../../services/appointment.service";

const AppointmentHistoryDialog = ({ open, onClose, patient }) => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all, past, future
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // date, lastStatusChange

  const fetchHistory = useCallback(async () => {
    if (!patient) return;
    const pid = patient.id || patient._id;
    setLoading(true);
    try {
      const data = await appointmentService.getAppointmentsByPatient(pid);
      setAppointments(data || []);
    } catch (err) {
      console.error("Failed to fetch appointment history:", err);
    } finally {
      setLoading(true); // Small delay feel or keep loading for 500ms
      setTimeout(() => setLoading(false), 300);
    }
  }, [patient]);

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open, fetchHistory]);

  const filteredAndSortedAppointments = useMemo(() => {
    let result = [...appointments];

    // Filter by type
    if (filterType === "past") {
      result = result.filter(a => dayjs(a.appointmentDate).isBefore(dayjs(), 'day'));
    } else if (filterType === "future") {
      result = result.filter(a => dayjs(a.appointmentDate).isAfter(dayjs().subtract(1, 'day'), 'day'));
    }

    // Filter by Status
    if (statusFilter !== "all") {
      result = result.filter(a => a.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "date") {
        return dayjs(b.appointmentDate).diff(dayjs(a.appointmentDate)); // Newest first by default for history
      } else {
        // Last status change - using updatedAt as fallback if no specific field exists
        const dateA = a.updatedAt || a.createdAt;
        const dateB = b.updatedAt || b.createdAt;
        return dayjs(dateB).diff(dayjs(dateA));
      }
    });

    return result;
  }, [appointments, filterType, statusFilter, sortBy]);

  const uniqueStatuses = useMemo(() => {
    const statuses = appointments.map(a => a.status).filter(Boolean);
    return ["all", ...new Set(statuses)];
  }, [appointments]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          minHeight: "500px",
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
          color: "#fff",
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
          {patient?.firstName} {patient?.lastName} Appointments History
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
        {/* FILTERS & SORTING AREA */}
        <Box sx={{ p: 2, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>Filter by:</Typography>
                <RadioGroup 
                  row 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.8rem", color: "#64748b" } }}
                >
                  <FormControlLabel value="all" control={<Radio size="small" />} label="All" />
                  <FormControlLabel value="past" control={<Radio size="small" />} label="Past" />
                  <FormControlLabel value="future" control={<Radio size="small" />} label="Future" />
                </RadioGroup>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>Status:</Typography>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                  sx={{ height: 32, minWidth: 150, fontSize: "0.8rem", bgcolor: "#fff" }}
                >
                  {uniqueStatuses.map(s => (
                    <MenuItem key={s} value={s} sx={{ fontSize: "0.8rem", textTransform: "capitalize" }}>
                      {s === "all" ? "All Statuses" : s}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>Sort by:</Typography>
                <RadioGroup 
                  row 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.8rem", color: "#64748b" } }}
                >
                  <FormControlLabel value="date" control={<Radio size="small" />} label="Appointment Date" />
                  <FormControlLabel value="lastStatusChange" control={<Radio size="small" />} label="Last Status Change" />
                </RadioGroup>
              </Box>
              
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", fontStyle: "italic" }}>
                {filteredAndSortedAppointments.length} Record(s)
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* TABLE AREA */}
        <Box sx={{ flex: 1, overflow: "auto", p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
              <CircularProgress size={40} thickness={4} sx={{ color: "#5c7cbc" }} />
            </Box>
          ) : (
            <TableContainer component={Box}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ "& .MuiTableCell-root": { bgcolor: "#fff", fontWeight: 700, fontSize: "0.8rem", color: "#334155", py: 1.5 } }}>
                    <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Procedures</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Audit</TableCell>
                    <TableCell>Reminders</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAndSortedAppointments.length > 0 ? (
                    filteredAndSortedAppointments.map((appt, idx) => {
                      const providerName = appt.providerId?.providerCode || appt.providerId?.firstName?.charAt(0) + appt.providerId?.lastName?.charAt(0) || "SAB";
                      return (
                        <TableRow 
                          key={appt._id || idx} 
                          hover
                          sx={{ 
                            "& .MuiTableCell-root": { fontSize: "0.8rem", color: "#475569", py: 1.5, borderBottom: "1px solid #f1f5f9" },
                            "&:last-child .MuiTableCell-root": { borderBottom: "none" }
                          }}
                        >
                          <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{dayjs(appt.appointmentDate).format("MM/DD/YYYY")}</TableCell>
                          <TableCell>{dayjs(appt.startTime || appt.appointmentDate).format("hh:mm A")}</TableCell>
                          <TableCell>{appt.appointmentType?.name || "Recare"}</TableCell>
                          <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {appt.procedures || appt.note || "---"}
                          </TableCell>
                          <TableCell>{appt.duration || 60} mins</TableCell>
                          <TableCell>
                            <Box 
                              sx={{ 
                                display: "inline-block", 
                                px: 1, 
                                py: 0.25, 
                                bgcolor: "#dcfce7", 
                                color: "#166534", 
                                borderRadius: "4px", 
                                fontSize: "0.7rem", 
                                fontWeight: 700 
                              }}
                            >
                              {providerName}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500, color: appt.status?.toLowerCase() === 'cancelled' ? '#ef4444' : '#475569' }}>
                            {appt.status || "Unconfirmed"}
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: "0.75rem", color: "#3b82f6", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>show</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: "0.75rem", color: "#3b82f6", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>show</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 8, color: "#94a3b8", fontStyle: "italic" }}>
                        No appointment history found for this patient.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc", justifyContent: "flex-end", gap: 1.5 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            bgcolor: "#94a3b8", 
            "&:hover": { bgcolor: "#64748b" }, 
            textTransform: "none", 
            px: 3,
            fontWeight: 600,
            boxShadow: "none"
          }}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          startIcon={<PrintIcon />}
          sx={{ 
            bgcolor: "#f59e0b", 
            "&:hover": { bgcolor: "#d97706" }, 
            textTransform: "none", 
            px: 3,
            fontWeight: 600,
            boxShadow: "none"
          }}
          onClick={() => window.print()}
        >
          Print Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentHistoryDialog;
