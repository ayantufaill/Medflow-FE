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
import { selectCurrentPatient } from "../../../../store/slices/patientSlice";
import { COLORS } from "../../../../constants/colors";

import AppointmentHistoryFilters from './AppointmentHistoryFilters';
import AppointmentHistoryTable, { getAppointmentRowKey } from './AppointmentHistoryTable';
import medflowLogo from '../../../../assets/medflow-logo.png';

const AppointmentHistoryDialog = ({ open, onClose, patient }) => {
  const dispatch = useDispatch();
  const appointments = useSelector(selectPatientHistoryList);
  const loading = useSelector(selectPatientHistoryLoading);
  const currentPatient = useSelector(selectCurrentPatient);

  // Enrich patient name: if caller only passed { _id, id }, pull name from Redux
  const patientName = patient?.firstName
    ? `${patient.firstName} ${patient.lastName}`
    : currentPatient
      ? `${currentPatient.firstName || ''} ${currentPatient.lastName || ''}`.trim()
      : '';

  const [filterType, setFilterType] = useState("all"); // all, past, future
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // date, lastStatusChange

  const [selected, setSelected] = useState([]);

  const fetchHistoryData = useCallback(() => {
    if (!patient) return;
    const pid = patient.id || patient._id;
    dispatch(fetchPatientHistory(pid));
  }, [patient, dispatch]);

  useEffect(() => {
    if (open) {
      fetchHistoryData();
    } else {
      setSelected([]);
      setFilterType("all");
      setStatusFilter("all");
      setSortBy("date");
    }
  }, [open, fetchHistoryData]);

  const filteredAndSortedAppointments = useMemo(() => {
    let result = [...appointments];

    // Filter by type
    if (filterType === "past") {
      result = result.filter(a => {
        const d = dayjs(a.date || a.appointmentDate);
        const time = a.startTime ? a.startTime.split(':') : [0,0];
        return d.hour(parseInt(time[0])).minute(parseInt(time[1])).isBefore(dayjs());
      });
    } else if (filterType === "future") {
      result = result.filter(a => {
        const d = dayjs(a.date || a.appointmentDate);
        const time = a.startTime ? a.startTime.split(':') : [0,0];
        return d.hour(parseInt(time[0])).minute(parseInt(time[1])).isAfter(dayjs());
      });
    }

    // Filter by Status
    if (statusFilter !== "all") {
      result = result.filter(a => a.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "date") {
        return dayjs(b.appointmentDate || b.date).diff(dayjs(a.appointmentDate || a.date));
      } else {
        const timeA = a.updatedAt || a.createdAt || a.date;
        const timeB = b.updatedAt || b.createdAt || b.date;
        return dayjs(timeB).diff(dayjs(timeA));
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
      setSelected(filteredAndSortedAppointments.map(getAppointmentRowKey));
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
          Appointment History{patientName ? ` — ${patientName}` : ""}
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
              @page { size: landscape; margin: 10mm; }
              .printable-content .MuiTableCell-paddingCheckbox { display: none !important; }
              .printable-content .MuiTableHead-root th:nth-of-type(9),
              .printable-content .MuiTableHead-root th:nth-of-type(10),
              .printable-content .MuiTableBody-root td:nth-of-type(9),
              .printable-content .MuiTableBody-root td:nth-of-type(10) { display: none !important; }
              .printable-content .MuiTable-root { font-size: 0.75rem; table-layout: auto; width: 100%; }
            }
          `}
        </style>
        <Box className="printable-content" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'none', '@media print': { display: 'flex', justifyContent: 'center', mb: 3, pt: 2 } }}>
            <img src={medflowLogo} alt="Medflow" style={{ height: 40 }} />
          </Box>
          <Box className="no-print">
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
          </Box>

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
