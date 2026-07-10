import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import {
  Close as CloseIcon,
  Print as PrintIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientHistory, selectPatientHistoryList, selectPatientHistoryLoading } from "../../../../store/slices/appointmentSlice";
import { COLORS } from "../../../../constants/colors";

import AppointmentHistoryFilters from './AppointmentHistoryFilters';
import AppointmentHistoryTable from './AppointmentHistoryTable';

const AppointmentHistoryDialog = ({ open, onClose, patient }) => {
  const dispatch = useDispatch();
  const appointments = useSelector(selectPatientHistoryList);
  const loading = useSelector(selectPatientHistoryLoading);

  const [filterType, setFilterType] = useState("all"); // all, past, future
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // date, lastStatusChange

  const [selected, setSelected] = useState([]);

  // Reset selection when filters or modal changes
  useEffect(() => {
    setSelected([]);
  }, [filterType, statusFilter, sortBy, open]);

  const fetchHistoryData = useCallback(() => {
    if (!patient) return;
    const pid = patient.id || patient._id;
    dispatch(fetchPatientHistory(pid));
  }, [patient, dispatch]);

  useEffect(() => {
    if (open) {
      fetchHistoryData();
    }
  }, [open, fetchHistoryData]);

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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredAndSortedAppointments.map((appt, idx) => appt._id || idx));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: "14px",
          minHeight: "500px",
          maxHeight: "90vh",
        },
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <HistoryIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Appointment History{patient ? ` — ${patient.firstName} ${patient.lastName}` : ""}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
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
          
          <AppointmentHistoryFilters 
            filterType={filterType}
            setFilterType={setFilterType}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            uniqueStatuses={uniqueStatuses}
            filteredCount={filteredAndSortedAppointments.length}
          />

          <AppointmentHistoryTable 
            loading={loading}
            appointments={filteredAndSortedAppointments}
            selected={selected}
            handleSelectAll={handleSelectAll}
            handleSelectOne={handleSelectOne}
          />
          
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${COLORS.BORDER_LIGHT}`, bgcolor: COLORS.WHITE, justifyContent: "flex-end", gap: 1.5 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit"
          sx={{ 
            color: '#64748b', 
            borderColor: '#cbd5e1', 
            '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
            textTransform: "none", 
            px: 3,
            borderRadius: "8px",
            fontWeight: 600,
            boxShadow: "none"
          }}
        >
          Close
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          startIcon={<PrintIcon sx={{ fontSize: '14px' }} />}
          sx={{ 
            textTransform: "none", 
            px: 2,
            height: 30,
            fontSize: "12px",
            borderRadius: "8px",
            fontWeight: 600,
          }}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentHistoryDialog;
