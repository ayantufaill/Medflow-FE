/* eslint-disable no-unused-vars, no-empty */
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, Popover, List, ListItem, ListItemText, Typography, Select, MenuItem, Link, Menu, IconButton } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import dayjs from 'dayjs';
import ScheduleGridHeader from '../../components/appointments/schedule/ScheduleGridHeader';
import ScheduleCalendar from '../../components/appointments/schedule/ScheduleCalendar';
import WeekMonthCalendarView from '../../components/appointments/schedule/WeekMonthCalendarView';
import LeftPanel from '../../components/appointments/left-panel/LeftPanel';
import RightPanel from '../../components/appointments/right-panel/RightPanel';
import RightPanelCollapsed from '../../components/appointments/right-panel/RightPanelCollapsed';
import AddNewPatientAppointmentForm from '../../components/appointments/AddNewPatientAppointmentForm';
import { useDropdownData } from '../../hooks/redux/useDropdownData';
import { usePatients, usePatient, useScheduleState, useAppointmentList } from '../../hooks/redux';
import { fetchPatientById, fetchPatients } from '../../store/slices/patientSlice';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { COLORS } from '../../constants/colors';
import { radius } from '../../constants/styles';

import { patientService } from "../../services/patient.service";
import { useDispatch } from "react-redux";
import { setSelectedAppointmentId, fetchAppointments } from "../../store/slices/appointmentSlice";
import { setSelectedPatientId } from "../../store/slices/patientSlice";
import SendBulkTextDialog from "../../components/appointments/SendBulkTextDialog";
import ProgressNotesDialog from "../../components/appointments/schedule/progress-notes-modal/ProgressNotesDialog";
import RouteSlipDialog from "../../components/appointments/schedule/route-slip-modal/RouteSlipDialog";
import FamilyAppointmentsDialog from "../../components/appointments/schedule/family-appointments-modal/FamilyAppointmentsDialog";
import LabCasesDialog from "../../components/appointments/schedule/lab-cases-modal/LabCasesDialog";
import BlockSlotModal from "../../components/appointments/schedule/BlockSlotModal";
import AppointmentDetailModal from "../../components/appointments/schedule/appointment-detail-modal/AppointmentDetailModal";
import { scheduleBlockService } from "../../services/schedule-block.service";
import { shortlistService } from "../../services/shortlist.service";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core";

// Constants
const START_HOUR = 0;
const END_HOUR = 24;
const SLOT_MINUTES = 30;
const SLOT_HEIGHT = 40;

// Color palette for operatory columns (repeating)
const OPERATORY_COLORS = [
  "#7e57c2", "#26a69a", "#ef6c00", "#42a5f5", "#8d6e63",
  "#ab47bc", "#29b6f6", "#66bb6a", "#ffa726", "#ec407a",
];

// Status-based colors (background) for appointment cards
const STATUS_COLORS = {
  unconfirmed: "#9e9e9e",
  preconfirmed: "#5c6bc0",
  confirmed: "#1976d2",
  seated: "#00796b",
  call: "#6d4c41",
  checked_out_incomplete: "#f9a825",
  checked_out_complete: "#2e7d32",
  no_show: "#616161",
  rescheduled: "#6a1b9a",
  cancelled: "#c62828",
};

// Uses UUID-like format to satisfy common ID validators
const DUMMY_PROVIDER_ID = "01";

// Testing mode flag - bypasses provider validation
const IS_TESTING_MODE = import.meta.env.VITE_APP_ENV === "development" || import.meta.env.VITE_TESTING_MODE === "true";

const providerLabel = (p) => {
  if (!p) return "";
  const u = p.userId || p;
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return name || p.providerCode || `Provider ${p._id || p.id}`;
};

const getStatusColor = (status, fallback) => {
  if (!status) return fallback;
  const key = String(status).toLowerCase();
  return STATUS_COLORS[key] || fallback;
};

// Utility functions
const minutesSinceStart = (iso, startHour = START_HOUR) => {
  const t = dayjs(iso);
  return t.diff(t.startOf("day").hour(startHour).minute(0), "minute");
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Main Component
const OperatorySchedulePage = () => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  // ── Dropdown data (providers, rooms, appointment types) ──────────
  const { providers, rooms, appointmentTypes } = useDropdownData({
    providers: true,
    rooms: true,
    appointmentTypes: true,
  });

  // ── Patients (for the new appointment form's patient search) ─────
  const { patients: formPatients } = usePatients();
  const { currentPatient } = usePatient();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const [activeDragData, setActiveDragData] = useState(null);
  const [pendingItems, setPendingItems] = useState([]);

  // Dynamically derive operatory columns from the rooms list.
  const OPERATORY_COLUMNS = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      return [{ id: "op1", label: "Op 1", color: OPERATORY_COLORS[0] }];
    }
    return rooms.map((room, idx) => ({
      id: `op${room._id || room.id}`,
      label: room.name || room.roomName || room.label || `Op ${idx + 1}`,
      color: OPERATORY_COLORS[idx % OPERATORY_COLORS.length],
    }));
  }, [rooms]);

  const [isCloseOpenDayMode, setIsCloseOpenDayMode] = useState(false);
  const [viewMyColumn, setViewMyColumn] = useState(false);
  const [hideBlocks, setHideBlocks] = useState(false);
  const [showGhosted, setShowGhosted] = useState(false);
  const [closedOperatories, setClosedOperatories] = useState({}); // Key: "YYYY-MM-DD:opId" -> boolean
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);

  const { frontendFilters, calendarView, setRouteSlipDialogOpen, selectedDate: reduxSelectedDate } = useScheduleState();
  const selectedDate = useMemo(() => reduxSelectedDate ? dayjs(reduxSelectedDate) : dayjs(), [reduxSelectedDate]);



  const [printMenuAnchorEl, setPrintMenuAnchorEl] = useState(null);
  const [scheduleMenuAnchorEl, setScheduleMenuAnchorEl] = useState(null);
  const [printingOrientation, setPrintingOrientation] = useState(null);

  const handlePrint = (orientation) => {
    setPrintingOrientation(orientation);
    setTimeout(() => {
      window.print();
      setPrintingOrientation(null);
    }, 100);
  };



  const handleDropOnPending = async (dragData) => {
    if (dragData.isAppointment) {
      const appt = dragData.appointment;
      const apptId = dragData.appointmentId;
      try {
        await updateAppointment(apptId, { status: "pending", roomId: null });
        showSnackbar(`Moved ${appt.patientName}'s appointment to Pending`, "success");
      } catch (err) {
        showSnackbar("Failed to move appointment to pending", "error");
      }
    } else if (dragData.isBlockSlot) {
      const block = dragData.block;
      const blockId = dragData.blockId;
      if (pendingItems.some(item => item.id === blockId)) {
        showSnackbar("Block is already in the pending list", "info");
        return;
      }
      setPendingItems(prev => [...prev, {
        id: blockId,
        type: "block",
        data: block
      }]);
      showSnackbar(`Moved calendar block to Pending`, "success");
    }
  };

  const handleRemovePending = (item) => {
    setPendingItems(prev => prev.filter(i => i.id !== item.id));
    showSnackbar("Restored item back to calendar", "info");
  };

  const handleDropReschedule = async (columnId, minutesFromStart, dragData) => {
    const isAppt = dragData.isAppointment || (dragData.isPendingItem && dragData.type === "appointment");
    const isBlock = dragData.isBlockSlot || (dragData.isPendingItem && dragData.type === "block");
    const isShortlist = dragData.isShortlistItem;

    const itemData = dragData.isPendingItem || isShortlist ? dragData.originalData : (dragData.appointment || dragData.block);
    const itemId = dragData.isPendingItem || isShortlist ? dragData.id : (dragData.appointmentId || dragData.blockId);

    const start = selectedDate
      .clone()
      .startOf("day")
      .add(minutesFromStart, "minute");

    const duration = isAppt || isShortlist
      ? (itemData.durationMinutes || itemData.DurationMins || 60)
      : 30;

    let blockDuration = 30;
    if (isBlock && itemData.startTime && itemData.endTime) {
      const startMin = minutesSinceStart(dayjs(`${itemData.date}T${itemData.startTime}`));
      const endMin = minutesSinceStart(dayjs(`${itemData.date}T${itemData.endTime}`));
      blockDuration = endMin - startMin;
    }

    const end = start.clone().add(isAppt || isShortlist ? duration : blockDuration, "minute");

    if (isShortlist) {
      try {
        setFormSaving(true);
        const roomId = columnId.startsWith("op") ? columnId.substring(2) : columnId;
        const patientId = itemData.patientId || itemData.PatNum;
        const providerId = itemData.providerId || itemData.ProvNum;

        // Create new appointment from shortlist data
        await reduxCreateAppointment({
          patientId: String(patientId),
          providerId: String(providerId || DUMMY_PROVIDER_ID),
          appointmentDate: start.format('YYYY-MM-DD'),
          startTime: start.format('HH:mm'),
          endTime: end.format('HH:mm'),
          durationMinutes: duration,
          notes: itemData.notes || itemData.Notes || '',
          status: 'scheduled',
          roomId: roomId,
          customFields: itemData.customFields || itemData.CustomFields || {},
        });

        // Optionally delete from shortlist
        if (itemId) {
          try {
            await shortlistService.deleteShortlistItem(itemId);
            window.dispatchEvent(new Event('shortlist-updated'));
          } catch (e) { }
        }

        // Refresh calendar appointments with correct dates and limit
        const viewUnit = calendarView === "day" ? "day" : calendarView;
        const sDate = selectedDate.startOf(viewUnit).format("YYYY-MM-DD");
        const eDate = selectedDate.endOf(viewUnit).format("YYYY-MM-DD");
        dispatch(fetchAppointments({ startDate: sDate, endDate: eDate, limit: 200 }));

        showSnackbar("Shortlist appointment scheduled successfully", "success");
      } catch (err) {
        if (err.response?.status === 409) {
          const conflictMsg = err.response.data?.error?.message;
          showSnackbar(conflictMsg || 'This time slot is no longer available.', 'error');
        } else {
          const msg = typeof err === "string" ? err : err.response?.data?.error?.message || err.message || "Failed to schedule shortlist appointment";
          showSnackbar(msg, "error");
        }
      } finally {
        setFormSaving(false);
      }
    } else if (isAppt) {
      try {
        setFormSaving(true);
        const roomId = columnId.startsWith("op") ? columnId.substring(2) : columnId;

        await updateAppointment(itemId, {
          appointmentDate: start.format("YYYY-MM-DD"),
          startTime: start.format("HH:mm"),
          endTime: end.format("HH:mm"),
          roomId: roomId,
          status: "scheduled"
        });

        showSnackbar("Appointment rescheduled successfully", "success");
      } catch (err) {
        if (err.response?.status === 409) {
          const conflictMsg = err.response.data?.error?.message;
          showSnackbar(conflictMsg || 'This time slot is no longer available.', 'error');
        } else {
          const msg = typeof err === "string" ? err : err.response?.data?.error?.message || err.message || "Failed to reschedule appointment";
          showSnackbar(msg, "error");
        }
      } finally {
        setFormSaving(false);
      }
    } else if (isBlock) {
      try {
        // Always delete the old block, even if it's coming from pending, 
        // because we don't delete it when moving it TO pending (to prevent data loss on refresh)
        if (itemId && !String(itemId).startsWith("temp-")) {
          await scheduleBlockService.deleteBlock(itemId);
        }

        const roomId = columnId.startsWith("op") ? columnId.substring(2) : columnId;
        const newBlockData = {
          roomId: roomId,
          date: start.format("YYYY-MM-DD"),
          startTime: start.format("HH:mm"),
          endTime: end.format("HH:mm"),
          notes: itemData.notes || "Blocked Slot",
          color: itemData.color || "#ffe082"
        };

        await scheduleBlockService.createBlock(newBlockData);
        showSnackbar("Calendar block rescheduled successfully", "success");
        setPendingItems(prev => prev.filter(i => i.id !== itemId));
        fetchScheduleBlocks();
      } catch (err) {
        const msg = typeof err === "string" ? err : err.response?.data?.error?.message || err.message || "Failed to reschedule calendar block";
        showSnackbar(msg, "error");
      }
    }
  };


  const [viewMode, setViewMode] = useState("day"); // 'day', 'week', 'month'
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showConsult, setShowConsult] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  // Slot blocking and popover state
  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [blockSlotDialogOpen, setBlockSlotDialogOpen] = useState(false);
  const [blockSlotDialogData, setBlockSlotDialogData] = useState(null);
  const [slotPopoverAnchorEl, setSlotPopoverAnchorEl] = useState(null);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    const handleApptDoubleClick = (e) => {
      setEditingAppointment(e.detail);
      setDetailModalOpen(true);
    };
    window.addEventListener('appointment-card-double-clicked', handleApptDoubleClick);

    const handleBlockClick = (e) => {
      const { block } = e.detail;
      setBlockSlotDialogData({
        ...block,
        roomId: block.roomId ? String(block.roomId).replace(/^op/, "") : undefined
      });
      setBlockSlotDialogOpen(true);
    };
    window.addEventListener('block-card-clicked', handleBlockClick);

    return () => {
      window.removeEventListener('appointment-card-double-clicked', handleApptDoubleClick);
      window.removeEventListener('block-card-clicked', handleBlockClick);
    };
  }, []);

  const fetchScheduleBlocks = useCallback(async () => {
    try {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const blocks = await scheduleBlockService.getBlocksForDate(dateStr);
      setScheduleBlocks(blocks);

      // Parse closed days from blocks
      const closedOps = {};
      blocks.forEach(block => {
        if (block.notes === "CLOSED_DAY") {
          const roomId = block.roomId ? String(block.roomId).replace(/^op/, "") : "";
          if (roomId) {
            closedOps[`${dateStr}:op${roomId}`] = true;
          }
        }
      });
      setClosedOperatories(closedOps);
    } catch (err) {
      console.error("Error fetching schedule blocks:", err);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchScheduleBlocks();
  }, [fetchScheduleBlocks]);

  const handleToggleOperatoryStatus = useCallback(async (dateStr, columnId) => {
    const key = `${dateStr}:${columnId}`;
    const isCurrentlyClosed = closedOperatories[key];
    const roomIdStr = columnId.replace(/^op/, "");

    try {
      if (isCurrentlyClosed) {
        // OPEN it by deleting the block
        const blockToDelete = scheduleBlocks.find(b => b.notes === "CLOSED_DAY" && String(b.roomId).replace(/^op/, "") === roomIdStr);
        if (blockToDelete) {
          await scheduleBlockService.deleteBlock(blockToDelete._id || blockToDelete.id);
        }
        setClosedOperatories(prev => ({ ...prev, [key]: false }));
      } else {
        // CLOSE it by creating a full-day block
        await scheduleBlockService.createBlock({
          roomId: roomIdStr,
          date: dateStr,
          startTime: '00:00',
          endTime: '23:59',
          notes: 'CLOSED_DAY',
          color: '#e5e7eb'
        });
        setClosedOperatories(prev => ({ ...prev, [key]: true }));
      }
      // Re-fetch to ensure sync with backend
      fetchScheduleBlocks();
    } catch (err) {
      console.error("Failed to toggle operatory status:", err);
      showSnackbar("Failed to update operatory status", "error");
    }
  }, [closedOperatories, scheduleBlocks, fetchScheduleBlocks, showSnackbar]);

  const handleSaveBlock = async (blockData) => {
    try {
      await scheduleBlockService.createBlock(blockData);
      showSnackbar("Block created successfully", "success");
      setBlockSlotDialogOpen(false);
      fetchScheduleBlocks();
    } catch (err) {
      const msg = typeof err === "string" ? err : err.response?.data?.error?.message || err.message || "Failed to block slot";
      showSnackbar(msg, "error");
    }
  };

  const handleDeleteBlock = async (blockId) => {
    try {
      await scheduleBlockService.deleteBlock(blockId);
      showSnackbar("Block deleted successfully", "success");
      setBlockSlotDialogOpen(false);
      fetchScheduleBlocks();
    } catch (err) {
      const msg = typeof err === "string" ? err : err.response?.data?.error?.message || err.message || "Failed to delete block";
      showSnackbar(msg, "error");
    }
  };

  // Dialogs
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [completeProceduresOpen, setCompleteProceduresOpen] = useState(false);
  const [selectProductsOpen, setSelectProductsOpen] = useState(false);
  const [bulkTextDialogOpen, setBulkTextDialogOpen] = useState(false);
  const [progressNotesOpen, setProgressNotesOpen] = useState(false);
  const [loadingFormPatients, setLoadingFormPatients] = useState(false);

  const searchFormPatients = useCallback(async (search = '') => {
    try {
      setLoadingFormPatients(true);
      await dispatch(fetchPatients({ page: 1, limit: 20, search, status: '' }));
    } catch (err) {
      console.error('Error searching patients:', err);
    } finally {
      setLoadingFormPatients(false);
    }
  }, [dispatch]);

  // ── Modal state ───────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [formSaving, setFormSaving] = useState(false);

  useEffect(() => {
    if (formOpen) searchFormPatients('');
  }, [formOpen, searchFormPatients]);

  const [initialFormDateTime, setInitialFormDateTime] = useState(null);
  const [initialFormRoomId, setInitialFormRoomId] = useState(null);
  const [initialShortlistData, setInitialShortlistData] = useState(null);
  const [showExtendedOptions, setShowExtendedOptions] = useState(false);

  const handleOpenForm = (dateTime, roomId, extendedOptions = false) => {
    const baseDate = selectedDate ? dayjs(selectedDate) : dayjs();
    setInitialFormDateTime(dateTime || baseDate.hour(9).minute(0));
    setInitialFormRoomId(roomId || null);
    setInitialShortlistData(null);
    setShowExtendedOptions(extendedOptions);
    setFormOpen(true);
  };

  const handleOpenFormRef = useRef(handleOpenForm);
  useEffect(() => {
    handleOpenFormRef.current = handleOpenForm;
  }, [handleOpenForm]);

  useEffect(() => {
    const handleEditShortlistItem = (e) => {
      const data = e.detail;
      setInitialShortlistData(data);
      setFormOpen(true);
    };
    const handleOpenNewAppointmentModal = (e) => {
      const isFromPatientCard = e?.detail?.isFromPatientCard || false;
      handleOpenFormRef.current(null, null, isFromPatientCard);
    };
    
    window.addEventListener('edit-shortlist-item', handleEditShortlistItem);
    window.addEventListener('open-new-appointment-modal', handleOpenNewAppointmentModal);
    
    return () => {
      window.removeEventListener('edit-shortlist-item', handleEditShortlistItem);
      window.removeEventListener('open-new-appointment-modal', handleOpenNewAppointmentModal);
    };
  }, []);

  // ── Appointments (for conflict detection inside the form) ─────────
  const { createAppointment } = useAppointmentList();

  // Maps a raw appointment object from the API into the shape the grid expects
  const mapAppointment = (a) => {
    try {
      const iso = String(a.appointmentDate || "");
      if (!iso) {
        console.warn("mapAppointment dropped: missing appointmentDate", a);
        return null;
      }

      // Parse the ISO string to the local timezone to avoid shifting days
      const dateOnly = dayjs(iso).format("YYYY-MM-DD");

      const startObj = a.startTime ? dayjs(`${dateOnly}T${a.startTime}`) : null;
      if (!startObj || !startObj.isValid()) {
        console.warn("mapAppointment dropped: invalid startObj", a);
        return null;
      }

      const endObj = a.endTime
        ? dayjs(`${dateOnly}T${a.endTime}`)
        : startObj.add(a.durationMinutes || SLOT_MINUTES, "minute");
      if (!endObj.isValid()) {
        console.warn("mapAppointment dropped: invalid endObj", a);
        return null;
      }

      const fullName =
        (a.patientId &&
          (a.patientId.firstName || a.patientId.lastName) &&
          `${a.patientId.firstName || ""} ${a.patientId.lastName || ""}`.trim()) ||
        a.patientName ||
        "";
      const initials = fullName
        ? fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
        : "PT";

      // Map roomId to operatory column
      let columnId = "op1";
      const apptTitle = (a.chiefComplaint || a.appointmentTypeId?.name || a.appointmentType || "").toLowerCase();
      const isConsultation =
        apptTitle.includes("consult") ||
        apptTitle.includes("evaluation") ||
        apptTitle.includes("cleaning") ||
        apptTitle.includes("exam") ||
        apptTitle.includes("hygiene");

      if (isConsultation && showConsult) {
        columnId = "consult";
      } else if (a.roomId) {
        // Match the column ID format used in OPERATORY_COLUMNS generation
        columnId = `op${a.roomId}`;

        // Verify this column exists in OPERATORY_COLUMNS, otherwise fallback
        if (!OPERATORY_COLUMNS.some(col => col.id === columnId)) {
          // Fallback: distribute based on room number modulo
          const roomNum = Number(a.roomId);
          if (Number.isFinite(roomNum) && roomNum > 0) {
            const mappedColIndex = (roomNum - 1) % OPERATORY_COLUMNS.length;
            columnId = OPERATORY_COLUMNS[mappedColIndex]?.id || "op1";
          }
        }
      } else {
        // Fallback: Distribute appointments across operatory columns based on providerId index
        const rawProviderId = a.providerId && (a.providerId._id || a.providerId.id);
        const providerNum = rawProviderId ? Number(rawProviderId) : NaN;
        const colIndex =
          Number.isFinite(providerNum) && providerNum > 0
            ? (providerNum - 1) % OPERATORY_COLUMNS.length
            : 0;
        columnId = OPERATORY_COLUMNS[colIndex]?.id || "op1";
      }

      // Resolve provider name
      const rawProvider = a.providerId;
      let providerName = "";
      if (rawProvider) {
        if (typeof rawProvider === "object") {
          const u = rawProvider.userId || rawProvider;
          providerName = [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || rawProvider.providerCode || "";
        } else {
          const matched = providers?.find(p => String(p._id || p.id) === String(rawProvider));
          if (matched) {
            providerName = providerLabel(matched);
          }
        }
      }

      // Resolve operatory room label
      const operatoryLabel =
        OPERATORY_COLUMNS?.find((c) => c.id === columnId)?.label || columnId || "—";

      const patientData = (a.patientId && typeof a.patientId === 'object') ? a.patientId : (a.patient && typeof a.patient === 'object' ? a.patient : null);
      const patientNumber = patientData?.patientCode || patientData?.patientId || patientData?.chartNumber || "";
      const patientPhone = patientData?.phonePrimary || patientData?.phone || patientData?.mobilePhone || "";
      const patientEmail = patientData?.email || "";
      const cf = a.customFields || {};
      const visitType = cf.visitType || a.visitType || a.appointmentTypeName || a.type || "";
      const scheduledBy = a.createdBy?.name || a.scheduledBy?.name || a.createdByName || "";
      
      const safeStartTime = a.startTime?.length === 5 ? `${a.startTime}:00` : a.startTime;
      const displayTime = safeStartTime ? dayjs(`2000-01-01T${safeStartTime}`).format("h:mm A") : "";

      let rawProcs = cf.procedures && Array.isArray(cf.procedures) && cf.procedures.length > 0
        ? cf.procedures 
        : (a.workspace?.procedures || a.procedures || a.procedureCodes || []);
      let procString = "";
      if (Array.isArray(rawProcs) && rawProcs.length > 0) {
        procString = rawProcs.map(p => typeof p === 'string' ? p : (p.treatment || p.name || p.code || p.ProcCode || p.Descript || "")).filter(Boolean).join(", ");
      }
      if (!procString) {
        procString = a.chiefComplaint || a.appointmentTypeName || a.type || "EXAM, PROPHY";
      }

      return {
        id: a._id || a.id,
        appointmentDate: a.appointmentDate,
        date: dateOnly,
        patientId: String((a.patientId && typeof a.patientId === 'object' ? (a.patientId._id || a.patientId.id || a.patientId.PatNum) : a.patientId) || ""),
        columnId,
        roomId: a.roomId || "",
        startTime: a.startTime || "",
        endTime: a.endTime || "",
        time: displayTime,
        title: a.chiefComplaint || a.appointmentTypeId?.name || a.appointmentType || "Appointment",
        patientName: fullName || "Patient",
        patientInitials: initials,
        patientNumber,
        patientPhone,
        patientEmail,
        visitType,
        scheduledBy,
        start: startObj.toISOString(),
        end: endObj.toISOString(),
        status: a.status || "scheduled",
        note: a.notes || "",
        description: a.notes || a.reason || "",
        color: "#1976d2",
        providerName,
        provider: providerName,
        providerId: (a.providerId && (a.providerId._id || a.providerId.id || a.providerId)) || "",
        operatoryLabel,
        durationMinutes: a.durationMinutes || dayjs(endObj).diff(startObj, "minute"),
        customFields: a.customFields,
        checklists: a.checklists,
        procedures: procString,
      };
    } catch {
      return null;
    }
  };

  // Uses the new custom hook to automatically fetch and cache via Redux
  const fetchStartDate = selectedDate.startOf('month').format('YYYY-MM-DD');
  // Add 1 day to the end date so the backend's "less than" filter safely includes the entire final day of the month
  const fetchEndDate = selectedDate.endOf('month').add(1, 'day').format('YYYY-MM-DD');

  const {
    appointments: reduxAppointments,
    refresh: refreshAppointments,
    loading: apptsLoading,
    updateAppointment,
  } = useAppointmentList({
    patientId: selectedPatientId || "",
    startDate: fetchStartDate,
    endDate: fetchEndDate,
    limit: 200,
  });

  // Derived state to map Redux appointments to the Grid format
  const mappedAppointments = useMemo(() => {
    if (!reduxAppointments) return [];

    const { providerId, visitType } = frontendFilters || { providerId: 'All', visitType: 'All' };

    const mapped = reduxAppointments
      .filter(a => {
        const status = String(a.status).toLowerCase();
        if (status === 'pending') return false;
        if (!showGhosted && (status === 'cancelled' || status === 'no_show' || status === 'no show' || status === 'broken')) return false;
        return true;
      })
      .filter(a => {
        if (providerId !== 'All') {
          const aProviderId = String(a.providerId && (a.providerId._id || a.providerId.id || a.providerId));
          if (aProviderId !== String(providerId)) return false;
        }
        if (visitType !== 'All') {
          const apptVisitType = String(a.visitType || a.customFields?.visitType || "").toLowerCase();
          if (apptVisitType !== visitType.toLowerCase()) return false;
        }
        return true;
      })
      .map(mapAppointment)
      .filter(Boolean);

    console.log("Filters applied:", { providerId, visitType }, "Resulting appointments:", mapped.length);
    return mapped;
  }, [reduxAppointments, frontendFilters]);

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setAppointments(mappedAppointments);
  }, [mappedAppointments]);

  // Add sample consult appointments when showConsult is toggled on (for demo)
  useEffect(() => {
    if (showConsult && appointments.length > 0) {
      const today = selectedDate.format("YYYY-MM-DD");
      const consultAppts = [
        {
          id: "consult-1",
          columnId: "consult",
          title: "Huddle-Oksana account review. I did not fix so everyone can learn",
          patientName: "Consult Note",
          start: `${today}T08:00:00`,
          end: `${today}T08:45:00`,
          status: "confirmed",
          note: "Huddle-Oksana account review. I did not fix so everyone can learn",
          color: "#6b6b6b",
        },
        {
          id: "consult-2",
          columnId: "consult",
          title: "8AM interview inperson",
          patientName: "Consult Note",
          start: `${today}T09:00:00`,
          end: `${today}T09:30:00`,
          status: "confirmed",
          note: "8AM interview inperson",
          color: "#6b6b6b",
        },
        {
          id: "consult-3",
          columnId: "consult",
          title: "send x-rays What's going on with these x-rays? 3rd day on the schedule i cant figure out how to export them",
          patientName: "Consult Note",
          start: `${today}T10:00:00`,
          end: `${today}T11:00:00`,
          status: "confirmed",
          note: "send x-rays What's going on with these x-rays? 3rd day on the schedule i cant figure out how to export them",
          color: "#6b6b6b",
        },
        {
          id: "consult-4",
          columnId: "consult",
          title: "Week of April 7--let's not open 4/6 for hygiene, lots of availability on Tu-Th that week",
          patientName: "Consult Note",
          start: `${today}T11:15:00`,
          end: `${today}T12:00:00`,
          status: "confirmed",
          note: "Week of April 7--let's not open 4/6 for hygiene, lots of availability on Tu-Th that week",
          color: "#6b6b6b",
        }
      ];

      setAppointments(prev => {
        const filtered = prev.filter(a => !String(a.id).startsWith("consult-"));
        return [...filtered, ...consultAppts];
      });
    } else if (!showConsult) {
      setAppointments(prev => prev.filter(a => !String(a.id).startsWith("consult-")));
    }
  }, [showConsult, selectedDate]);

  const handleAddAppointmentSubmit = async (formData) => {
    const patientId = formData.patientId;
    const providerId = formData.providerId;
    if (!patientId || !providerId) {
      showSnackbar("Please select a patient and provider.", "warning");
      return;
    }
    const start = formData.appointmentDate && formData.startTime
      ? dayjs(`${formData.appointmentDate}T${formData.startTime}`)
      : dayjs();
    const duration = formData.durationMinutes || 30;
    const end = start.clone().add(duration, "minute");

    try {
      setFormSaving(true);
      await createAppointment({
        patientId: formData.patientId,
        providerId: formData.providerId,
        appointmentDate: start.format("YYYY-MM-DD"),
        startTime: start.format("HH:mm"),
        endTime: end.format("HH:mm"),
        durationMinutes: duration,
        chiefComplaint: formData.chiefComplaint || '',
        notes: formData.notes || "",
        status: formData.status || "scheduled",
        ...(formData.appointmentTypeId && { appointmentTypeId: formData.appointmentTypeId }),
        ...(formData.roomId && { roomId: formData.roomId }),
        ...(formData.customFields && { customFields: formData.customFields }),
      });
      showSnackbar('Appointment created successfully', 'success');
      setFormOpen(false);
    } catch (err) {
      if (err.status === 409 || err.response?.status === 409) {
        const conflictMsg = err.response?.data?.error?.message || err.response?.data?.message;
        showSnackbar(conflictMsg || 'This time slot is no longer available.', 'error');
      } else {
        const msg = err.message || err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create appointment.';
        showSnackbar(msg, 'error');
      }
    } finally {
      setFormSaving(false);
    }
  };

  useEffect(() => {
    const handleAddShortlistToSchedule = async (e) => {
      const data = e.detail;
      const apptDateStr = data.AppointmentDate || data.appointmentDate;
      const startTimeStr = data.StartTime || data.startTime;
      const roomIdStr = data.RoomId || data.roomId;
      
      if (!apptDateStr || !startTimeStr || !roomIdStr) {
        showSnackbar("Please edit this shortlist item to specify an exact Date, Time, and Operatory first.", "warning");
        return;
      }
      
      const startObj = dayjs(`${apptDateStr}T${startTimeStr}`);
      const duration = data.DurationMins || data.durationMinutes || 60;
      const endObj = startObj.clone().add(duration, 'minute');
      
      if (startObj.isBefore(dayjs())) {
        showSnackbar("The specified time for this shortlist item has already passed.", "error");
        return;
      }
      
      const patientId = data.PatNum || data.patientId;
      const providerId = data.ProvNum || data.providerId;
      
      if (!patientId || !providerId) {
        showSnackbar("Please edit this shortlist item to specify a Provider first.", "warning");
        return;
      }
      
      try {
        setFormSaving(true);
        await createAppointment({
          patientId: String(patientId),
          providerId: String(providerId),
          appointmentDate: apptDateStr,
          startTime: startTimeStr,
          endTime: endObj.format('HH:mm'),
          durationMinutes: duration,
          chiefComplaint: '',
          notes: data.Notes || data.notes || '',
          status: 'scheduled',
          roomId: roomIdStr,
          customFields: data.CustomFields || data.customFields || {},
        });
        
        // Delete from shortlist
        const shortlistId = data.ShortlistNum || data.id || data._id;
        if (shortlistId) {
          try {
            await shortlistService.deleteShortlistItem(shortlistId);
            window.dispatchEvent(new Event('shortlist-updated'));
          } catch (deleteErr) {
            console.error("Failed to delete shortlist item:", deleteErr);
          }
        }
        showSnackbar('Shortlist item successfully added to schedule!', 'success');
      } catch (err) {
        if (err.status === 409 || err.response?.status === 409) {
          const conflictMsg = err.response?.data?.error?.message || err.response?.data?.message;
          showSnackbar(conflictMsg || 'This time slot is no longer available.', 'error');
        } else {
          const msg = err.message || err.response?.data?.error?.message || err.response?.data?.message || 'Failed to add to schedule.';
          showSnackbar(msg, 'error');
        }
      } finally {
        setFormSaving(false);
      }
    };

    window.addEventListener('add-shortlist-to-schedule', handleAddShortlistToSchedule);
    return () => window.removeEventListener('add-shortlist-to-schedule', handleAddShortlistToSchedule);
  }, [createAppointment]);

  const handleDragStart = (event) => {
    setActiveDragData(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragData(null);
    if (!over) return;

    const dragData = active.data.current;
    if (!dragData) return;

    // Dropped on Pending Reschedules
    if (over.id === "pending-tab") {
      handleDropOnPending(dragData);
      return;
    }

    // Dropped on Schedule Grid Time Slot
    // Expecting over.id format: `slot-${roomId}-${hour}-${mins}`
    if (String(over.id).startsWith("slot-")) {
      const parts = String(over.id).split('-');
      if (parts.length >= 4) {
        const roomId = parts[1];
        const hour = parseInt(parts[2], 10);
        const mins = parseInt(parts[3], 10);
        const minutesFromStart = (hour - START_HOUR) * 60 + mins;
        handleDropReschedule(roomId, minutesFromStart, dragData);
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 65px)', gap: '8px', p: '8px', backgroundColor: COLORS.SURFACE_PAGE, boxSizing: 'border-box', overflow: 'hidden' }}>

        {printingOrientation && (
          <style>
            {`
            @media print {
              @page {
                size: ${printingOrientation};
                margin: 5mm;
              }
              body * {
                visibility: hidden;
              }
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background-color: white !important;
              }
              .no-print, .no-print * {
                display: none !important;
                visibility: hidden !important;
              }
              /* Make the center panel take up the full printed page */
              .print-container, .print-container * {
                visibility: visible;
              }
              .print-container {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: auto !important;
                box-shadow: none !important;
                border: none !important;
              }
            }
          `}
          </style>
        )}

        {/* LEFT PANEL — Static Width */}
        <Box className="no-print" sx={{ flex: '0 0 280px', width: '280px', minWidth: '280px', maxWidth: '280px', height: '100%', backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, overflow: 'hidden' }}>
          <LeftPanel />
        </Box>

        {/* CENTER PANEL — Dynamic Width */}
        <Box className="print-container" sx={{ flex: 1, minWidth: 0, height: '100%', backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box className="no-print">
            <ScheduleGridHeader onNewAppointment={() => handleOpenForm(null, null)} onPrintClick={(e) => setPrintMenuAnchorEl(e.currentTarget)} onMoreClick={(e) => setMoreMenuAnchorEl(e.currentTarget)} privacyMode={privacyMode} setPrivacyMode={setPrivacyMode} hideBlocks={hideBlocks} setHideBlocks={setHideBlocks} showGhosted={showGhosted} setShowGhosted={setShowGhosted} />
            {isCloseOpenDayMode && (
              <Box sx={{ width: '100%', bgcolor: '#fef3c7', color: '#92400e', py: 1, textAlign: 'center', fontWeight: 600, fontSize: '13px', borderBottom: '1px solid #fde68a' }}>
                Select operatory for opening or closing it
              </Box>
            )}
          </Box>
          {calendarView === 'day' || calendarView === 'week' ? (
            <ScheduleCalendar
              scheduleBlocks={hideBlocks ? [] : scheduleBlocks.filter(b => b.notes !== "CLOSED_DAY")}
              privacyMode={privacyMode}
              showGhosted={showGhosted}
              isCloseOpenDayMode={isCloseOpenDayMode}
              closedOperatories={closedOperatories}
              viewMyColumn={viewMyColumn}
              onToggleOperatoryStatus={(columnId) => {
                const dateStr = selectedDate ? (typeof selectedDate.format === 'function' ? selectedDate.format('YYYY-MM-DD') : new Date(selectedDate).toISOString().split('T')[0]) : dayjs().format('YYYY-MM-DD');
                handleToggleOperatoryStatus(dateStr, columnId);
              }}
              onSlotClick={(hour, mins, roomId) => {
                if (isCloseOpenDayMode || closedOperatories[`${selectedDate.format("YYYY-MM-DD")}:${roomId}`]) return;
                const baseDate = selectedDate ? dayjs(selectedDate) : dayjs();
                handleOpenForm(baseDate.hour(hour).minute(mins), roomId);
              }}
              onBlockClick={(hour, mins, roomId) => {
                if (isCloseOpenDayMode || closedOperatories[`${selectedDate.format("YYYY-MM-DD")}:${roomId}`]) return;
                const baseDate = selectedDate ? dayjs(selectedDate) : dayjs();
                const start = baseDate.clone().startOf("day").hour(hour).minute(mins);
                const end = start.clone().add(30, "minute");

                setBlockSlotDialogData({
                  roomId: String(roomId).replace(/^op/, ""),
                  date: baseDate.format("YYYY-MM-DD"),
                  startTime: start.format("HH:mm"),
                  endTime: end.format("HH:mm")
                });
                setBlockSlotDialogOpen(true);
              }}
            />
          ) : (
            <WeekMonthCalendarView
              calendarView={calendarView}
              selectedDate={selectedDate}
              appointments={mappedAppointments}
              onSlotClick={(e) => {
                const appt = e.detail;
                window.dispatchEvent(new CustomEvent('appointment-card-clicked', {
                  detail: { ...appt },
                }));
                if (appt.patientId) {
                  const pId = typeof appt.patientId === 'object' 
                    ? appt.patientId._id || appt.patientId.id || appt.patientId.PatNum 
                    : appt.patientId;
                  if (pId) dispatch(fetchPatientById(pId));
                }
              }}
            />
          )}
        </Box>

        {/* RIGHT PANEL — Static Width */}
        {rightPanelOpen ? (
          <Box className="no-print" sx={{ flex: '0 0 320px', width: '320px', minWidth: '320px', maxWidth: '320px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <IconButton onClick={() => setRightPanelOpen(false)} sx={{ color: COLORS.TEXT_SECONDARY, p: 0, '&:hover': { color: COLORS.ACCENT } }}>
                <KeyboardDoubleArrowRightIcon fontSize="small" />
              </IconButton>
            </Box>
            <RightPanel />
          </Box>
        ) : (
          <Box className="no-print" sx={{ height: '100%', flexShrink: 0 }}>
            <RightPanelCollapsed onExpand={() => setRightPanelOpen(true)} />
          </Box>
        )}

        {/* Add New Appointment Modal */}
        <AddNewPatientAppointmentForm
          open={formOpen}
          onCancel={() => { setFormOpen(false); setShowExtendedOptions(false); }}
          onSubmit={handleAddAppointmentSubmit}
          loading={formSaving}
          initialDateTime={initialFormDateTime}
          initialRoomId={initialFormRoomId}
          initialPatient={currentPatient || null}
          initialShortlistData={initialShortlistData}
          providers={providers || []}
          rooms={rooms || []}
          appointmentTypes={appointmentTypes || []}
          appointments={appointments || []}
          scheduleBlocks={scheduleBlocks || []}
          patients={formPatients || []}
          loadingPatients={loadingFormPatients}
          onPatientSearch={searchFormPatients}
          showExtendedOptions={showExtendedOptions}
        />

        <AppointmentDetailModal
          open={detailModalOpen}
          appointment={editingAppointment}
          onClose={() => setDetailModalOpen(false)}
          onSave={async (updatedData) => {
            if (!editingAppointment) return;
            try {
              await updateAppointment(editingAppointment.id, updatedData);
              showSnackbar("Appointment updated", "success");
              setDetailModalOpen(false);
            } catch (e) {
              console.error("Failed to update appointment", e);
              if (e.status === 409 || e.response?.status === 409) {
                const conflictMsg = e.response?.data?.error?.message || e.response?.data?.message;
                showSnackbar(conflictMsg || 'This time slot is no longer available.', 'error');
              } else {
                const msg = e.message || e.response?.data?.error?.message || e.response?.data?.message || 'Failed to update appointment';
                showSnackbar(msg, "error");
              }
            }
          }}
        />

        <SendBulkTextDialog
          open={bulkTextDialogOpen}
          onClose={() => setBulkTextDialogOpen(false)}
          selectedDate={selectedDate}
          providers={providers || []}
        />

        <ProgressNotesDialog
          open={progressNotesOpen}
          onClose={() => setProgressNotesOpen(false)}
          providers={providers || []}
        />

        {/* Block Slot Modal */}
        {blockSlotDialogOpen && (
          <BlockSlotModal
            open={blockSlotDialogOpen}
            onClose={() => setBlockSlotDialogOpen(false)}
            initialData={blockSlotDialogData}
            onSave={handleSaveBlock}
            onDelete={handleDeleteBlock}
          />
        )}

        <Popover
          open={Boolean(slotPopoverAnchorEl)}
          anchorEl={slotPopoverAnchorEl}
          onClose={() => setSlotPopoverAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              mt: 0.5,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid #e1e4e8',
              borderRadius: 1.5,
            }
          }}
        >
          <List size="small" disablePadding sx={{ py: 0.5 }}>
            <ListItem
              button
              onClick={() => {
                setSlotPopoverAnchorEl(null);
                if (selectedSlotInfo) {
                  const start = selectedDate
                    .clone()
                    .startOf("day")
                    .add(selectedSlotInfo.minutesFromStart, "minute");
                  // The columnId is the operatory room ID (e.g., 'op1', 'op2', or MongoDB ID)
                  const roomId = selectedSlotInfo.columnId.startsWith("op")
                    ? selectedSlotInfo.columnId.substring(2)
                    : selectedSlotInfo.columnId;
                  handleOpenForm(start, roomId);
                }
              }}
              sx={{ px: 2, py: 1, cursor: "pointer", "&:hover": { bgcolor: "#f1f5f9" } }}
            >
              <ListItemText
                primary="Schedule Appointment"
                primaryTypographyProps={{ sx: { fontSize: "13px", fontWeight: 600, color: "#334155" } }}
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setSlotPopoverAnchorEl(null);
                if (selectedSlotInfo) {
                  const start = selectedDate
                    .clone()
                    .startOf("day")
                    .add(selectedSlotInfo.minutesFromStart, "minute");
                  const end = start.clone().add(30, "minute"); // default 30 min block

                  setBlockSlotDialogData({
                    roomId: selectedSlotInfo.columnId.replace("op", ""),
                    date: selectedDate.format("YYYY-MM-DD"),
                    startTime: start.format("HH:mm"),
                    endTime: end.format("HH:mm")
                  });
                  setBlockSlotDialogOpen(true);
                }
              }}
              sx={{ px: 2, py: 1, cursor: "pointer", "&:hover": { bgcolor: "#f1f5f9" } }}
            >
              <ListItemText
                primary="Block Slot"
                primaryTypographyProps={{ sx: { fontSize: "13px", fontWeight: 600, color: "#334155" } }}
              />
            </ListItem>
          </List>
        </Popover>


        {/* More Options Menu */}
        <Menu
          anchorEl={moreMenuAnchorEl}
          open={Boolean(moreMenuAnchorEl)}
          onClose={() => setMoreMenuAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 0.5,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid #e1e4e8',
              borderRadius: 1.5,
            }
          }}
        >
          <MenuItem
            onClick={() => {
              setViewMyColumn(prev => !prev);
              setMoreMenuAnchorEl(null);
            }}
            sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
          >
            {viewMyColumn ? "Show all columns" : "View my column"}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsCloseOpenDayMode(prev => !prev);
              setMoreMenuAnchorEl(null);
            }}
            sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
          >
            {isCloseOpenDayMode ? "Exit Close/Open a day" : "Close/Open a day"}
          </MenuItem>
        </Menu>

        {/* Print Options Menu */}
        <Menu
          anchorEl={printMenuAnchorEl}
          open={Boolean(printMenuAnchorEl)}
          onClose={() => setPrintMenuAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 0.5,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid #e1e4e8',
              borderRadius: 1.5,
            }
          }}
        >
          <MenuItem
            onClick={() => {
              setRouteSlipDialogOpen(true);
              setPrintMenuAnchorEl(null);
            }}
            sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
          >
            Route Slip
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              setScheduleMenuAnchorEl(e.currentTarget);
            }}
            sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
          >
            Schedule
          </MenuItem>
        </Menu>

        {/* Nested Schedule Menu */}
        <Menu
          anchorEl={scheduleMenuAnchorEl}
          open={Boolean(scheduleMenuAnchorEl)}
          onClose={() => {
            setScheduleMenuAnchorEl(null);
            setPrintMenuAnchorEl(null);
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              mt: -1,
              ml: 1,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid #e1e4e8',
              borderRadius: 1.5,
            }
          }}
        >
          <MenuItem
            onClick={() => {
              handlePrint("portrait");
              setScheduleMenuAnchorEl(null);
              setPrintMenuAnchorEl(null);
            }}
            sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
          >
            Portrait
          </MenuItem>
          <MenuItem
            onClick={() => {
              handlePrint("landscape");
              setScheduleMenuAnchorEl(null);
              setPrintMenuAnchorEl(null);
            }}
            sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
          >
            Landscape
          </MenuItem>
        </Menu>

        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {activeDragData ? (
            <Box sx={{
              p: 1.5,
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: `1px solid ${COLORS.BORDER}`,
              borderRadius: radius.md,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              width: '200px',
              opacity: 0.9,
              cursor: 'grabbing'
            }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                {activeDragData.appointment?.patientName || activeDragData.originalData?.patientId?.firstName || "Dragging Item"}
              </Typography>
              <Typography sx={{ fontSize: '11px', color: COLORS.TEXT_SECONDARY }}>
                {activeDragData.appointment?.visitType || "Appointment"}
              </Typography>
            </Box>
          ) : null}
        </DragOverlay>

      </Box>
      {/* Route Slip Modal */}
      <RouteSlipDialog />
      <FamilyAppointmentsDialog />

    </DndContext>
  );
};

export default OperatorySchedulePage;