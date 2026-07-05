import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Paper,
  Typography,
  Chip,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Popover,
  Select,
  MenuItem,
  Menu,
  FormControl,
  Link,
  Tooltip,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import {
  PostAdd, Group, Science, Description, FilterAlt,
  VisibilityOff, Visibility, SpeakerNotesOff, Print, History,
  Person, PersonOff, AttachMoney, MoreVert, CalendarMonth,
  KeyboardArrowLeft, KeyboardArrowRight, EventNote
} from '@mui/icons-material';
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import OperatorySidebar from "../../components/appointments/OperatorySidebar";
import OperatoryScheduleGrid from "../../components/appointments/OperatoryScheduleGrid";
import CreateAppointmentDialog from "../../components/appointments/CreateAppointmentDialog";
import AppointmentDetailsDialog from "../../components/appointments/AppointmentDetailsDialog";
import CompleteProceduresDialog from "../../components/appointments/CompleteProceduresDialog";
import SelectProductsDialog from "../../components/appointments/SelectProductsDialog";
import AddNewPatientAppointmentForm from "../../components/appointments/AddNewPatientAppointmentForm";
import { useSnackbar } from "../../contexts/SnackbarContext";

import { patientService } from "../../services/patient.service";
import { useDropdownData } from "../../hooks/redux/useDropdownData";
import { useAppointmentList } from "../../hooks/redux/useAppointment";
import { usePatients } from "../../hooks/redux/usePatient";
import { useDispatch } from "react-redux";
import { setSelectedAppointmentId } from "../../store/slices/appointmentSlice";
import { setSelectedPatientId } from "../../store/slices/patientSlice";
import SendBulkTextDialog from "../../components/appointments/SendBulkTextDialog";
import ProgressNotesDialog from "../../components/appointments/ProgressNotesDialog";
import LabCasesDialog from "../../components/appointments/LabCasesDialog";
import BlockSlotDialog from "../../components/appointments/BlockSlotDialog";
import { scheduleBlockService } from "../../services/schedule-block.service";

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
  "checkout incomplete": "#f9a825",
  "checkout complete": "#2e7d32",
  "no show": "#616161",
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
  // Stable ref so useEffects can call showSnackbar without it being a dependency
  // (showSnackbar is not memoized in SnackbarContext, causing infinite loops if used in deps).
  const showSnackbarRef = useRef(showSnackbar);
  useEffect(() => { showSnackbarRef.current = showSnackbar; });

  const [activeTab, setActiveTab] = useState(0); // 0: Patients, 1: Pending, 2: Search, 3: Productivity
  const [pendingItems, setPendingItems] = useState([]);

  const [isCloseOpenDayMode, setIsCloseOpenDayMode] = useState(false);
  const [closedOperatories, setClosedOperatories] = useState({}); // Key: "YYYY-MM-DD:opId" -> boolean
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);

  const handleToggleOperatoryStatus = useCallback((dateStr, columnId) => {
    const key = `${dateStr}:${columnId}`;
    setClosedOperatories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const [printMenuAnchorEl, setPrintMenuAnchorEl] = useState(null);
  const [printingOrientation, setPrintingOrientation] = useState(null);

  const handlePrint = (orientation) => {
    setPrintingOrientation(orientation);
    setViewMode("day");
  };



  const handleDropOnPending = (dragData) => {
    if (dragData.isAppointment) {
      const appt = dragData.appointment;
      const apptId = dragData.appointmentId;
      if (pendingItems.some(item => item.id === apptId)) {
        showSnackbar("Appointment is already in the pending list", "info");
        return;
      }
      setPendingItems(prev => [...prev, {
        id: apptId,
        type: "appointment",
        data: appt
      }]);
      showSnackbar(`Moved ${appt.patientName}'s appointment to Pending`, "success");
      setActiveTab(1);
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
      setActiveTab(1);
    }
  };

  const handleRemovePending = (item) => {
    setPendingItems(prev => prev.filter(i => i.id !== item.id));
    showSnackbar("Restored item back to calendar", "info");
  };

  const handleDropReschedule = async (columnId, minutesFromStart, dragData) => {
    const isAppt = dragData.isAppointment || (dragData.isPendingItem && dragData.type === "appointment");
    const isBlock = dragData.isBlockSlot || (dragData.isPendingItem && dragData.type === "block");
    
    const itemData = dragData.isPendingItem ? dragData.originalData : (dragData.appointment || dragData.block);
    const itemId = dragData.isPendingItem ? dragData.id : (dragData.appointmentId || dragData.blockId);

    const start = selectedDate
      .clone()
      .startOf("day")
      .add(minutesFromStart, "minute");
    
    const duration = isAppt 
      ? (itemData.durationMinutes || 60) 
      : 30;
    
    let blockDuration = 30;
    if (isBlock && itemData.startTime && itemData.endTime) {
      const startMin = minutesSinceStart(dayjs(`${itemData.date}T${itemData.startTime}`));
      const endMin = minutesSinceStart(dayjs(`${itemData.date}T${itemData.endTime}`));
      blockDuration = endMin - startMin;
    }
    
    const end = start.clone().add(isAppt ? duration : blockDuration, "minute");

    if (isAppt) {
      try {
        setFormSaving(true);
        const roomId = columnId.startsWith("op") ? columnId.substring(2) : columnId;
        
        await updateAppointment(itemId, {
          appointmentDate: start.format("YYYY-MM-DD"),
          startTime: start.format("HH:mm"),
          endTime: end.format("HH:mm"),
          roomId: roomId
        }).unwrap();

        showSnackbar("Appointment rescheduled successfully", "success");
        setPendingItems(prev => prev.filter(i => i.id !== itemId));
        await refreshAppointments();
      } catch (err) {
        const msg = typeof err === "string" ? err : err.response?.data?.error?.message || err.message || "Failed to reschedule appointment";
        showSnackbar(msg, "error");
      } finally {
        setFormSaving(false);
      }
    } else if (isBlock) {
      try {
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

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("day"); // 'day', 'week', 'month'
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showConsult, setShowConsult] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [addAppointmentFormOpen, setAddAppointmentFormOpen] = useState(false);

  // Slot blocking and popover state
  const [customFormDateTime, setCustomFormDateTime] = useState(null);
  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [blockSlotDialogOpen, setBlockSlotDialogOpen] = useState(false);
  const [blockSlotDialogData, setBlockSlotDialogData] = useState(null);
  const [slotPopoverAnchorEl, setSlotPopoverAnchorEl] = useState(null);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);

  const fetchScheduleBlocks = useCallback(async () => {
    try {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const blocks = await scheduleBlockService.getBlocksForDate(dateStr);
      setScheduleBlocks(blocks);
    } catch (err) {
      console.error("Error fetching schedule blocks:", err);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchScheduleBlocks();
  }, [fetchScheduleBlocks]);

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
  const [formSaving, setFormSaving] = useState(false);

  const { providers, rooms, appointmentTypes } = useDropdownData({ 
    providers: true, 
    rooms: true, 
    appointmentTypes: true 
  });



  // Dynamically generate operatory columns from rooms
  const OPERATORY_COLUMNS = useMemo(() => {
    if (!rooms || rooms.length === 0) {
      // Fallback to default columns if no rooms available
      return [
        {
          id: "op1",
          label: "Op 1",
          color: "#7e57c2",
          breakTimes: [
            {
              label: "Lunch",
              icon: "🍽️",
              startTime: "12:00",
              endTime: "12:30",
              color: "#bbdefb",
              hoverColor: "#64b5f6",
              textColor: "#0d47a1",
            }
          ]
        },
        {
          id: "op2",
          label: "Op 2",
          color: "#26a69a",
          breakTimes: [
            {
              label: "Lunch",
              icon: "🍽️",
              startTime: "12:30",
              endTime: "13:00",
              color: "#bbdefb",
              hoverColor: "#64b5f6",
              textColor: "#0d47a1",
            }
          ]
        },
        {
          id: "op3",
          label: "Op 3",
          color: "#ef6c00",
          breakTimes: [
            {
              label: "Lunch",
              icon: "🍽️",
              startTime: "12:00",
              endTime: "12:30",
              color: "#bbdefb",
              hoverColor: "#64b5f6",
              textColor: "#0d47a1",
            }
          ]
        },
        {
          id: "op4",
          label: "Op 4",
          color: "#42a5f5",
          breakTimes: [] // No breaks for this operatory
        },
        {
          id: "consult",
          label: "Consult",
          color: "#8d6e63",
          breakTimes: [
            {
              label: "Lunch",
              icon: "🍽️",
              startTime: "12:00",
              endTime: "12:30",
              color: "#bbdefb",
              hoverColor: "#64b5f6",
              textColor: "#0d47a1",
            }
          ]
        },
      ];
    }

    const cols = rooms.map((room, index) => {
      // Generate staggered lunch breaks by default (each operatory gets 30 min different time)
      const totalMinutesOffset = index * 30;
      const defaultLunchStartMinutes = 12 * 60 + totalMinutesOffset;
      const defaultLunchEndMinutes = defaultLunchStartMinutes + 30;

      const startHours = Math.floor(defaultLunchStartMinutes / 60);
      const startMins = defaultLunchStartMinutes % 60;
      const endHours = Math.floor(defaultLunchEndMinutes / 60);
      const endMins = defaultLunchEndMinutes % 60;

      const startTime = `${String(startHours).padStart(2, '0')}:${String(startMins).padStart(2, '0')}`;
      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

      return {
        id: `op${room._id || room.id}`,
        label: room.name || `Op ${index + 1}`,
        color: OPERATORY_COLORS[index % OPERATORY_COLORS.length],
        breakTimes: room.breakTimes || [
          {
            label: "Lunch",
            icon: "🍽️",
            startTime,
            endTime,
            color: "#bbdefb",
            hoverColor: "#64b5f6",
            textColor: "#0d47a1",
          }
        ],
      };
    });

    if (showConsult) {
      cols.push({
        id: "consult",
        label: "Consult",
        color: "#8d6e63",
        breakTimes: []
      });
    }

    return cols;
  }, [rooms, showConsult]);

  useEffect(() => {
    if (printingOrientation && viewMode === "day") {
      const styleId = "print-orientation-style";
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = `
        @media print {
          @page { 
            size: ${printingOrientation}; 
            margin: 5mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
          }
          aside, 
          .no-print,
          button,
          .MuiIconButton-root,
          .MuiTooltip-root,
          .MuiTabs-root,
          .MuiPopover-root { 
            display: none !important; 
          }
          
          .print-scroll-container {
            height: auto !important;
            overflow: visible !important;
            max-height: none !important;
            width: 100% !important;
            min-width: 0 !important;
          }

          .print-header-container,
          .print-body-container {
            min-width: 0 !important;
            width: 100% !important;
          }

          .print-columns-grid {
            grid-template-columns: repeat(${OPERATORY_COLUMNS.length}, 1fr) !important;
            min-width: 0 !important;
            width: 100% !important;
          }

          .print-column-header {
            min-width: 0 !important;
            width: auto !important;
            flex: 1 !important;
          }

          .print-column {
            min-width: 0 !important;
          }

          body, #root {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }

          div[class*="MuiBox-root"] {
            box-shadow: none !important;
          }
        }
      `;

      const timer = setTimeout(() => {
        window.print();
        setPrintingOrientation(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [printingOrientation, viewMode, OPERATORY_COLUMNS.length]);


  const { patients: reduxPatients, fetch: fetchPatientsRedux, createPatient: createPatientRedux } = usePatients();

  const [loadingSidebarPatients, setLoadingSidebarPatients] = useState(false);
  const [creatingSidebarPatient, setCreatingSidebarPatient] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newlyCreatedAppointmentId, setNewlyCreatedAppointmentId] = useState(null); // Track newly created appointment for auto-scroll
  const [draft, setDraft] = useState({
    title: "",
    columnId: "op1",
    startIso: null,
    endIso: null,
  });

  // Pre-Appointment Checklist state management
  const [preAppointmentChecklist, setPreAppointmentChecklist] = useState({
    importHistory: null, // 'na' or 'checked' or null
    importRecord: null,
    apptReminder: null,
    verifyInsurance: null,
    premedicationReminder: null,
    labCaseReceived: null,
  });
  const [preAppointmentExpanded, setPreAppointmentExpanded] = useState(false);

  // Check-out Checklist state management
  const [checkOutChecklist, setCheckOutChecklist] = useState({
    completeAndBillProcedures: null,
    purchaseProducts: null,
    shareClinicalReports: null,
    prescription: null,
    scheduleNextAppt: null,
    sendLabCase: null,
  });
  const [checkOutExpanded, setCheckOutExpanded] = useState(false);
  const [completeBillDialogOpen, setCompleteBillDialogOpen] = useState(false);
  const [purchaseProductsDialogOpen, setPurchaseProductsDialogOpen] = useState(false);
  const [labCasesDialogOpen, setLabCasesDialogOpen] = useState(false);

  // Lab Filters Popover state
  const [labAnchorEl, setLabAnchorEl] = useState(null);
  const [labFilters, setLabFilters] = useState({
    providerId: 'all',
    visitTypeId: 'all'
  });

  // Ensure all dialogs are closed on mount to prevent any stale state
  useEffect(() => {
    setCreateDialogOpen(false);
    setDetailsDialogOpen(false);
    setCompleteBillDialogOpen(false);
    setPurchaseProductsDialogOpen(false);
    setAddAppointmentFormOpen(false);
    setBulkTextDialogOpen(false);
    setProgressNotesOpen(false);
  }, []);

  const handlePreAppointmentSelection = (item, selectionType) => {
    setPreAppointmentChecklist((prev) => ({
      ...prev,
      [item]: prev[item] === selectionType ? null : selectionType,
    }));
  };

  const handleCheckOutSelection = (item, selectionType) => {
    setCheckOutChecklist((prev) => ({
      ...prev,
      [item]: prev[item] === selectionType ? null : selectionType,
    }));
  };

  const handleCompleteBillClick = () => {
    setCompleteBillDialogOpen(true);
  };

  const handlePurchaseProductsClick = () => {
    setPurchaseProductsDialogOpen(true);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode) {
      setViewMode(newMode);
      // Automatically focus on current date when changing views
      const today = dayjs();
      setSelectedDate(today);

      // For week view, ensure we're viewing the week that contains today
      // For month view, ensure we're viewing the month that contains today
      // This is already handled by setting selectedDate to today
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleScheduleAppointmentClick = () => {
    // Close ALL other dialogs first to prevent stacking or background dialogs
    setCreateDialogOpen(false);
    setDetailsDialogOpen(false);
    setCompleteBillDialogOpen(false);
    setPurchaseProductsDialogOpen(false);

    // Force close CreateAppointmentDialog with a small delay to ensure it's fully closed
    setTimeout(() => {
      setAddAppointmentFormOpen(true);
    }, 0);
  };

  const searchSidebarPatients = useCallback(async (search = "") => {
    try {
      setLoadingSidebarPatients(true);
      await fetchPatientsRedux({ page: 1, limit: 20, search, status: "" });
    } catch (err) {
      console.error("Error searching sidebar patients:", err);
    } finally {
      setLoadingSidebarPatients(false);
    }
  }, [fetchPatientsRedux]);

  const handleCreateSidebarPatient = useCallback(
    async (data) => {
      try {
        setCreatingSidebarPatient(true);
        const payload = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : "",
          mobilePhone: data.mobilePhone || "",
          email: data.email || "",
          sendWelcomeEmail: !!data.sendWelcomeEmail,
          isNewPatient: !!data.isNewPatient,
        };
        const actionResult = await createPatientRedux(payload).unwrap();
        const patient = actionResult.patient || actionResult;
        setSelectedPatientId(patient._id || patient.id || null);
        setPatientQuery(
          patient.firstName && patient.lastName
            ? `${patient.firstName} ${patient.lastName}`
            : patient.name || "",
        );
        showSnackbar("Patient created successfully", "success");
        return patient;
      } catch (err) {
        const msg =
          typeof err === "string"
            ? err
            : err.response?.data?.error?.message ||
              err.response?.data?.message ||
              "Failed to create patient. Please try again.";
        showSnackbar(msg, "error");
        throw err;
      } finally {
        setCreatingSidebarPatient(false);
      }
    },
    [showSnackbar, createPatientRedux],
  );

  const searchFormPatients = useCallback(async (search = "") => {
    try {
      setLoadingFormPatients(true);
      await fetchPatientsRedux({ page: 1, limit: 20, search, status: "" });
    } catch (err) {
      console.error("Error searching patients:", err);
    } finally {
      setLoadingFormPatients(false);
    }
  }, [fetchPatientsRedux]);

  useEffect(() => {
    if (addAppointmentFormOpen) searchFormPatients("");
  }, [addAppointmentFormOpen, searchFormPatients]);

  // Load initial patients on mount removed for optimization
  // They will be loaded dynamically when the user searches
  // useEffect(() => {
  //   searchSidebarPatients("");
  // }, []);

  // No auto-selection — the search box should start empty so the user
  // can pick a patient manually. Auto-selecting was causing the first
  // patient's name to appear pre-filled in the sidebar search input.

  const initialFormDateTime = useMemo(() => {
    if (customFormDateTime) return customFormDateTime;
    return selectedDate
      .clone()
      .hour(START_HOUR === 0 ? 9 : START_HOUR)
      .minute(5);
  }, [selectedDate, customFormDateTime]);

  // Maps a raw appointment object from the API into the shape the grid expects
  const mapAppointment = (a) => {
    try {
      const iso = String(a.appointmentDate || "");
      const dateOnly = iso.includes("T") ? iso.split("T")[0] : iso.slice(0, 10);
      if (!dateOnly) {
        console.warn("mapAppointment dropped: missing dateOnly", a);
        return null;
      }

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

      return {
        id: a._id || a.id,
        appointmentDate: a.appointmentDate,
        date: dateOnly,
        patientId: (a.patientId && (a.patientId._id || a.patientId.id)) || "",
        columnId,
        roomId: a.roomId || "",
        startTime: a.startTime || "",
        endTime: a.endTime || "",
        title: a.chiefComplaint || a.appointmentTypeId?.name || a.appointmentType || "Appointment",
        patientName: fullName || "Patient",
        patientInitials: initials,
        start: startObj.toISOString(),
        end: endObj.toISOString(),
        status: a.status || "scheduled",
        note: a.notes || "",
        color: "#1976d2",
        providerName,
        providerId: (a.providerId && (a.providerId._id || a.providerId.id || a.providerId)) || "",
        operatoryLabel,
        durationMinutes: a.durationMinutes || dayjs(endObj).diff(startObj, "minute"),
        customFields: a.customFields,
        checklists: a.checklists,
      };
    } catch {
      return null;
    }
  };

  // Uses the new custom hook to automatically fetch and cache via Redux
  const fetchStartDate = selectedDate.startOf('month').format('YYYY-MM-DD');
  const fetchEndDate = selectedDate.endOf('month').format('YYYY-MM-DD');
  
  const { 
    appointments: reduxAppointments, 
    refresh: refreshAppointments,
    createAppointment: reduxCreateAppointment,
    updateAppointment,
  } = useAppointmentList({
    patientId: selectedPatientId || "", // Filter by selected patient, otherwise show all
    startDate: fetchStartDate,
    endDate: fetchEndDate,
    limit: 100, // required to see a full day's or week's schedule
  });

  // Derived state to map Redux appointments to the Grid format
  const mappedAppointments = useMemo(() => {
    if (!reduxAppointments) return [];
    console.log("Raw reduxAppointments:", reduxAppointments);
    const mapped = reduxAppointments.map(mapAppointment).filter(Boolean);
    console.log("Mapped appointments:", mapped);
    return mapped;
  }, [reduxAppointments]);

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
    if (!patientId) {
      showSnackbar("Please select a patient.", "warning");
      return;
    }
    const start =
      formData.appointmentDate && formData.startTime
        ? dayjs(`${formData.appointmentDate}T${formData.startTime}`)
        : dayjs();
    const duration = formData.durationMinutes || 30;
    const end = start.add(duration, "minute");

    try {
      setFormSaving(true);

      // Build the payload the backend expects.
      // The form already resolves IDs (providerId, roomId, appointmentTypeId).
      const payload = {
        patientId,
        providerId: formData.providerId,
        appointmentDate: start.format("YYYY-MM-DD"),
        startTime: start.format("HH:mm"),
        endTime: end.format("HH:mm"),
        durationMinutes: duration,
        chiefComplaint: formData.chiefComplaint || "",
        notes: formData.notes || "",
        // Backend accepts: scheduled | confirmed | checked_in | completed | cancelled | no_show
        status: formData.status || "scheduled",
        ...(formData.appointmentTypeId && { appointmentTypeId: formData.appointmentTypeId }),
        ...(formData.roomId && { roomId: formData.roomId }),
        ...(formData.customFields && { customFields: formData.customFields }),
      };

      const newAppt = await reduxCreateAppointment(payload).unwrap();
      const newApptId = newAppt?.data?._id || newAppt?.data?.id || newAppt?._id || newAppt?.id;

      showSnackbar("Appointment created successfully", "success");
      setAddAppointmentFormOpen(false);

      if (newApptId) {
        setNewlyCreatedAppointmentId(newApptId);
      }

      // Re-fetch via Redux hook to sync cache
      if (patientId) {
        await refreshAppointments();
      }
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to create appointment.";
      showSnackbar(msg, "error");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDropProcedure = async (columnId, minutesFromStart, dragData) => {
    const { code, treatment, duration, patientId, patientName, isRecareGroup, procedures } = dragData;
    if (!patientId) {
      showSnackbar("Please select a patient before dragging procedures.", "warning");
      return;
    }

    const start = selectedDate
      .clone()
      .startOf("day")
      .add(minutesFromStart, "minute");
    const end = start.clone().add(duration || 60, "minute");

    try {
      setFormSaving(true);
      
      let appointmentProcedures = [];
      let chiefComplaintText = "";
      
      if (isRecareGroup && Array.isArray(procedures)) {
        appointmentProcedures = procedures.map(p => ({
          code: p.code,
          treatment: p.treatment,
          charge: "$0.00"
        }));
        chiefComplaintText = `Recare: ${procedures.map(p => p.code).join(", ")}`;
      } else {
        appointmentProcedures = [{ code, treatment, charge: "$0.00" }];
        chiefComplaintText = `Recare: ${treatment}`;
      }

      const payload = {
        patientId,
        providerId: DUMMY_PROVIDER_ID,
        roomId: columnId.startsWith("op") ? columnId.substring(2) : columnId,
        appointmentDate: start.format("YYYY-MM-DD"),
        startTime: start.format("HH:mm"),
        endTime: end.format("HH:mm"),
        durationMinutes: duration || 60,
        notes: `Scheduled via drag-and-drop from Recare group`,
        status: "unconfirmed",
        chiefComplaint: chiefComplaintText,
        customFields: {
          procedures: appointmentProcedures,
          visitType: "recare"
        }
      };

      if (providers && providers.length > 0) {
        payload.providerId = providers[0]._id || providers[0].id;
      }

      const newAppt = await reduxCreateAppointment(payload).unwrap();
      const newApptId = newAppt?.data?._id || newAppt?.data?.id || newAppt?._id || newAppt?.id;

      showSnackbar(`Created appointment for ${patientName} with ${appointmentProcedures.length} procedures`, "success");
      
      if (newApptId) {
        setNewlyCreatedAppointmentId(newApptId);
      }

      await refreshAppointments();
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Failed to schedule appointment.";
      showSnackbar(msg, "error");
    } finally {
      setFormSaving(false);
    }
  };

  // Sample procedures data
  const [proceduresData, setProceduresData] = useState([
    {
      code: "D0150",
      site: "",
      treatment: "Comprehensive Evaluation",
      provider: "DR",
      charge: "$0.00",
    },
    {
      code: "D1110",
      site: "",
      treatment: "Prophylaxis",
      provider: "KIM",
      charge: "$0.00",
    },
    {
      code: "D0274",
      site: "",
      treatment: "Bitewing Four Xrays",
      provider: "DR",
      charge: "$0.00",
    },
  ]);

  // Treatment options
  const treatmentOptions = [
    "Comprehensive Evaluation",
    "Periodic Evaluation",
    "Limited Evaluation",
    "Emergency Evaluation",
    "Prophylaxis",
    "Scaling and Root Planing",
    "Gingivectomy",
    "Bitewing Two Xrays",
    "Bitewing Four Xrays",
    "Full Mouth Xrays",
    "Panoramic Xray",
    "Fluoride Treatment",
    "Sealant",
    "Amalgam Restoration",
    "Composite Restoration",
    "Crown",
    "Bridge",
    "Root Canal Therapy",
    "Extraction",
    "Surgical Extraction",
    "Denture",
    "Partial Denture",
    "Implant",
    "Bone Graft",
    "Periodontal Maintenance",
  ];

  // Provider options
  const providerOptions = ["DR", "KIM", "JOHN", "SARAH", "MIKE", "LISA"];

  const handleTreatmentChange = (index, value) => {
    setProceduresData((prev) =>
      prev.map((row, i) => (i === index ? { ...row, treatment: value } : row)),
    );
  };

  const handleProviderChange = (index, value) => {
    setProceduresData((prev) =>
      prev.map((row, i) => (i === index ? { ...row, provider: value } : row)),
    );
  };

  const handleAddProcedure = () => {
    setProceduresData((prev) => [
      ...prev,
      {
        code: "D0000",
        site: "",
        treatment: treatmentOptions[0] || "Comprehensive Evaluation",
        provider: providerOptions[0] || "DR",
        charge: "$0.00",
      },
    ]);
  };

  const handleCompleteAll = (procedures) => {
    // Mark all procedures as completed
    showSnackbar(`Completed ${procedures.length} procedure(s) successfully!`, "success");
    // You can add additional logic here such as:
    // - Updating the appointment status
    // - Saving to database
    // - Triggering checkout process
    setCompleteBillDialogOpen(false);
  };

  const selectedPatient = useMemo(
    () =>
      reduxPatients.find((p) => (p._id || p.id) === selectedPatientId) ||
      null,
    [reduxPatients, selectedPatientId],
  );

  // Filter appointments based on view mode
  const dayAppointments = useMemo(() => {
    if (viewMode === "day") {
      // For day view, only show appointments for selected date
      return appointments.filter((a) => {
        if (!a.date) return false;
        const apptKey = String(a.date).slice(0, 10);
        const selectedKey = selectedDate.format("YYYY-MM-DD");
        return apptKey === selectedKey;
      });
    } else if (viewMode === "week") {
      // For week view, show appointments for the entire week
      const weekStart = selectedDate.clone().startOf("week");
      const weekEnd = selectedDate.clone().endOf("week");
      return appointments.filter((a) => {
        if (!a.date) return false;
        const apptDate = dayjs(a.date);
        return (apptDate.isSame(weekStart, "day") || apptDate.isAfter(weekStart, "day")) &&
          (apptDate.isSame(weekEnd, "day") || apptDate.isBefore(weekEnd, "day"));
      });
    } else {
      // For month view, show appointments for the entire month
      const monthStart = selectedDate.clone().startOf("month");
      const monthEnd = selectedDate.clone().endOf("month");
      return appointments.filter((a) => {
        if (!a.date) return false;
        const apptDate = dayjs(a.date);
        return (apptDate.isSame(monthStart, "day") || apptDate.isAfter(monthStart, "day")) &&
          (apptDate.isSame(monthEnd, "day") || apptDate.isBefore(monthEnd, "day"));
      });
    }
  }, [appointments, selectedDate, viewMode]);

  const openCreateDialog = ({ columnId, startIso }) => {
    const start = dayjs(startIso);
    const end = start.add(SLOT_MINUTES, "minute");
    setDraft({
      title: "",
      columnId,
      startIso: start.toISOString(),
      endIso: end.toISOString(),
    });
    setCreateDialogOpen(true);
  };

  const createAppointment = () => {
    // kept only for local demo; real appointments now come from API
    if (!draft.startIso || !draft.endIso || !selectedPatientId) return;
    const patientName =
      (selectedPatient &&
        (selectedPatient.firstName && selectedPatient.lastName
          ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
          : selectedPatient.name)) ||
      "Patient";
    const initials = patientName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const newAppt = {
      id: `local-${Date.now()}`,
      date: selectedDate.format("YYYY-MM-DD"),
      patientId: selectedPatientId,
      columnId: draft.columnId,
      title: draft.title || "Appointment",
      patientName,
      patientInitials: initials || "PT",
      start: draft.startIso,
      end: draft.endIso,
      status: "scheduled",
      note: "",
      color:
        OPERATORY_COLUMNS.find((c) => c.id === draft.columnId)?.color ||
        "#1976d2",
    };
    setAppointments((prev) => [newAppt, ...prev]);
    setCreateDialogOpen(false);
  };

  const handleGridClick = (e, columnId, minutesFromStart) => {
    setSlotPopoverAnchorEl(e.currentTarget);
    setSelectedSlotInfo({ columnId, minutesFromStart });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 3 },
        background: "linear-gradient(135deg, #f8faff 0%, #f0f4fa 100%)",
      }}
    >
      {/* Header */}
      <Paper
        className="no-print"
        elevation={0}
        sx={{
          p: 1, // Compact padding
          mb: 3,
          borderRadius: 2,
          border: "1px solid #eef2f6",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 0.5 }}>

          {/* 1. Tabs Section */}
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ minHeight: '32px', flexShrink: 0 }}>
            {['Patients', 'Pending', 'Search', 'Productivity'].map((label) => (
              <Tab
                key={label}
                label={label}
                sx={{
                  minHeight: '32px', py: 0.5, px: 0.75, minWidth: 'auto',
                  textTransform: 'none', fontWeight: 600, fontSize: '0.7rem',
                }}
              />
            ))}
          </Tabs>

          {/* 2. Date Navigation Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
                sx={{ "& .MuiToggleButton-root": { px: 1, py: 0.2, fontSize: "11px", height: 32 } }}
              >
                <ToggleButton value="day">Day</ToggleButton>
                <ToggleButton value="week">Week</ToggleButton>
                <ToggleButton value="month">Month</ToggleButton>
              </ToggleButtonGroup>

              {/* Current System Time Display */}
              <Chip
                label={`Time: ${dayjs().format("h:mm A")}`}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: "11px",
                  height: 32,
                  px: 0.5,
                  bgcolor: "#e3f2fd",
                  color: "#1976d2"
                }}
              />
            </Box>

            <IconButton
              size="small"
              onClick={() => setSelectedDate(selectedDate.subtract(1, viewMode))}
              sx={{ width: 32, height: 32, border: "1px solid #cbd5e1" }}
            >
              <KeyboardArrowLeft fontSize="small" />
            </IconButton>

            <Chip
              label={
                viewMode === "day"
                  ? selectedDate.format("MMM D, YYYY")
                  : viewMode === "week"
                    ? `${selectedDate.clone().startOf('week').format('MMM D')} - ${selectedDate.clone().endOf('week').format('MMM D, YYYY')}`
                    : selectedDate.format("MMMM YYYY")
              }
              size="small"
              icon={<EventNote style={{ fontSize: 16 }} />}
              sx={{ fontWeight: 600, fontSize: "11px", height: 32, px: 0.5 }}
            />

            <IconButton
              size="small"
              onClick={() => setSelectedDate(selectedDate.add(1, viewMode))}
              sx={{ width: 32, height: 32, border: "1px solid #cbd5e1" }}
            >
              <KeyboardArrowRight fontSize="small" />
            </IconButton>
          </Box>

          {/* 3. Your Action Icons (Mapped from the image) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexGrow: 1, justifyContent: 'flex-end' }}>
            {[
              { icon: <PostAdd />, label: "Form Entry", onClick: () => setBulkTextDialogOpen(true) },
              { icon: <Group />, label: "Patients" },
              { icon: <Science />, label: "Lab Cases", onClick: () => setLabCasesDialogOpen(true) },
              { icon: <Description />, label: "Progress Notes", onClick: () => setProgressNotesOpen(true) },
              { icon: <FilterAlt />, label: "Filter Labs", onClick: (e) => setLabAnchorEl(e.currentTarget) },
              { icon: showConsult ? <Visibility /> : <VisibilityOff />, label: "Consult Column", onClick: () => setShowConsult(!showConsult) },
              { icon: <SpeakerNotesOff />, label: "No Notes" },
              { icon: <Print />, label: "Print", onClick: (e) => setPrintMenuAnchorEl(e.currentTarget) },
              // { icon: <History />, label: "History" },
              { icon: privacyMode ? <PersonOff /> : <Person />, label: "Privacy Mode", onClick: () => setPrivacyMode(!privacyMode) },
              { icon: <AttachMoney />, label: "Billing" },
              { icon: <MoreVert />, label: "More", onClick: (e) => setMoreMenuAnchorEl(e.currentTarget) },
              // { icon: <CalendarMonth />, label: "Calendar" }
            ].map((item, idx) => (
              <Tooltip key={idx} title={item.label} arrow>
                <IconButton
                  onClick={item.onClick}
                  sx={{
                    width: 30, // Extra slim to fit all
                    height: 30,
                    borderRadius: 1.5,
                    border: "1px solid #eef2f6",
                    color: "#001e3c", // Dark blue from your image
                    "& svg": { fontSize: 18 },
                    "&:hover": { bgcolor: "#f1f5f9" }
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Main Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          gap: 2.5,
          alignItems: "start",
          height: "fit-content",
        }}
      >
        <OperatorySidebar
          START_HOUR={START_HOUR}
          activeTab={activeTab} // Pass the active tab state
          providers={providers || []}
          rooms={rooms || []}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          patientQuery={patientQuery}
          setPatientQuery={setPatientQuery}
          patients={reduxPatients}
          loadingPatients={loadingSidebarPatients || creatingSidebarPatient}
          onPatientSearch={searchSidebarPatients}
          onPatientSelect={(patient) => {
            const pId = patient?._id || patient?.id || null;
            setSelectedPatientId(pId);
            dispatch(setSelectedPatientId(pId));
          }}
          onCreatePatient={handleCreateSidebarPatient}
          hasSelectedPatient={!!selectedPatientId}
          preAppointmentChecklist={preAppointmentChecklist}
          preAppointmentExpanded={preAppointmentExpanded}
          setPreAppointmentExpanded={setPreAppointmentExpanded}
          handlePreAppointmentSelection={handlePreAppointmentSelection}
          checkOutChecklist={checkOutChecklist}
          checkOutExpanded={checkOutExpanded}
          setCheckOutExpanded={setCheckOutExpanded}
          handleCheckOutSelection={handleCheckOutSelection}
          openCreateDialog={openCreateDialog}
          onScheduleAppointmentClick={handleScheduleAppointmentClick}
          onCompleteBillClick={handleCompleteBillClick}
          onPurchaseProductsClick={handlePurchaseProductsClick}
          getStatusColor={getStatusColor}
          appointments={appointments}
          pendingItems={pendingItems}
          onDropOnPending={handleDropOnPending}
          onRemovePending={handleRemovePending}
        />

        <OperatoryScheduleGrid
          OPERATORY_COLUMNS={OPERATORY_COLUMNS}
          dayAppointments={dayAppointments.filter(
            (appt) => !pendingItems.some((item) => item.id === appt.id)
          )}
          viewMode={viewMode}
          START_HOUR={START_HOUR}
          END_HOUR={END_HOUR}
          SLOT_MINUTES={SLOT_MINUTES}
          SLOT_HEIGHT={SLOT_HEIGHT}
          minutesSinceStart={minutesSinceStart}
          clamp={clamp}
          getStatusColor={getStatusColor}
          selectedDate={selectedDate}
          newlyCreatedAppointmentId={newlyCreatedAppointmentId}
          scheduleBlocks={scheduleBlocks.filter(
            (b) => !pendingItems.some((item) => item.id === b._id)
          )}
          onDeleteBlock={handleDeleteBlock}
          onSlotClick={(e, columnId, minutesFromStart) =>
            handleGridClick(e, columnId, minutesFromStart)
          }
          onScheduleAppointmentClick={handleScheduleAppointmentClick}
          onAppointmentClick={(appt) => {
            setSelectedAppointment(appt);
            setDetailsDialogOpen(true);
            dispatch(setSelectedAppointmentId(appt._id || appt.id));
            const pId = typeof appt.patientId === "string" ? appt.patientId : appt.patientId?._id || appt.patientId?.id;
            if (pId) {
              dispatch(setSelectedPatientId(pId));
            }
          }}
          privacyMode={privacyMode}
          onDropProcedure={handleDropProcedure}
          onDropReschedule={handleDropReschedule}
          isCloseOpenDayMode={isCloseOpenDayMode}
          closedOperatories={closedOperatories}
          onToggleOperatoryStatus={handleToggleOperatoryStatus}
        />
      </Box>

      <CreateAppointmentDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        DEMO_PATIENTS={[]}
        selectedPatient={selectedPatient}
        setSelectedPatientId={setSelectedPatientId}
        draft={draft}
        setDraft={setDraft}
        OPERATORY_COLUMNS={OPERATORY_COLUMNS}
        createAppointment={createAppointment}
      />

      <AppointmentDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        selectedAppointment={selectedAppointment}
        OPERATORY_COLUMNS={OPERATORY_COLUMNS}
        onStatusChange={async (appointmentId, newStatus) => {
          try {
            await updateAppointment(appointmentId, { status: newStatus }).unwrap();
            showSnackbar("Status updated successfully", "success");
            await refreshAppointments();
          } catch (err) {
            const msg = typeof err === 'string' ? err : err?.response?.data?.error?.message || err?.message || "Failed to update status";
            showSnackbar(msg, "error");
          }
        }}
        onReschedule={async (appointmentId, updates) => {
          const { date, time } = updates;
          const start = dayjs(`${date}T${time}`);
          const duration = selectedAppointment?.end ? dayjs(selectedAppointment.end).diff(dayjs(selectedAppointment.start), "minute") : 60;
          const end = start.add(duration, "minute");

          try {
            await updateAppointment(appointmentId, {
              appointmentDate: date,
              startTime: time,
              endTime: end.format("HH:mm"),
            }).unwrap();

            showSnackbar("Appointment rescheduled successfully", "success");
            setDetailsDialogOpen(false);
            await refreshAppointments();
          } catch (err) {
            const msg = typeof err === 'string' ? err : err?.response?.data?.error?.message || err?.message || "Failed to reschedule appointment";
            showSnackbar(msg, "error");
          }
        }}
      />

      <CompleteProceduresDialog
        open={completeBillDialogOpen}
        onClose={() => setCompleteBillDialogOpen(false)}
        proceduresData={proceduresData}
        treatmentOptions={treatmentOptions}
        providerOptions={providerOptions}
        handleTreatmentChange={handleTreatmentChange}
        handleProviderChange={handleProviderChange}
        onAddProcedure={handleAddProcedure}
        onCompleteAll={handleCompleteAll}
      />

      <SelectProductsDialog
        open={purchaseProductsDialogOpen}
        onClose={() => setPurchaseProductsDialogOpen(false)}
      />

      {/* AddNewPatientAppointmentForm has its own Dialog wrapper */}
      <AddNewPatientAppointmentForm
        open={addAppointmentFormOpen}
        patients={reduxPatients}
        loadingPatients={loadingFormPatients}
        saving={formSaving}
        onSearchPatients={searchFormPatients}
        onSubmit={handleAddAppointmentSubmit}
        onCancel={() => setAddAppointmentFormOpen(false)}
        loading={formSaving}
        initialDateTime={initialFormDateTime}
        initialPatient={selectedPatient}
        providers={providers || []}
        rooms={rooms || []}
        appointmentTypes={appointmentTypes || []}
        appointments={appointments || []}
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

      <BlockSlotDialog
        open={blockSlotDialogOpen}
        onClose={() => setBlockSlotDialogOpen(false)}
        initialData={blockSlotDialogData}
        onSave={handleSaveBlock}
      />

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
                setCustomFormDateTime(start);
                // Also set the sidebar patient query if needed, otherwise just open form
                setAddAppointmentFormOpen(true);
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

      {/* Lab Filters Popover (Matching Screenshot) */}
      <Popover
        open={Boolean(labAnchorEl)}
        anchorEl={labAnchorEl}
        onClose={() => setLabAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            mt: 0.5,
            p: 2,
            width: 170, // Further reduced width as requested
            borderRadius: '4px',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid #e1e4e8'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Provider Section */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 1, color: '#333' }}>
              Provider:
            </Typography>
            <Select
              fullWidth
              size="small"
              value={labFilters.providerId}
              onChange={(e) => setLabFilters(prev => ({ ...prev, providerId: e.target.value }))}
              sx={{
                height: '32px',
                fontSize: '0.85rem',
                '& .MuiSelect-select': { py: 0.5 }
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {providers && providers.length > 0 && providers.map(p => (
                <MenuItem key={p._id || p.id} value={p._id || p.id}>
                  {/* Handling nested userId structure found in ProvidersListPage.jsx */}
                  {p.userId?.firstName || p.firstName || ''} {p.userId?.lastName || p.lastName || ''}
                </MenuItem>
              ))}
            </Select>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: '#1976d2',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                +Add
              </Link>
            </Box>
          </Box>

          {/* Visit Type Section */}
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mb: 1, color: '#333' }}>
              Visit Type:
            </Typography>
            <Select
              fullWidth
              size="small"
              value={labFilters.visitTypeId}
              onChange={(e) => setLabFilters(prev => ({ ...prev, visitTypeId: e.target.value }))}
              sx={{
                height: '32px',
                fontSize: '0.85rem',
                '& .MuiSelect-select': { py: 0.5 }
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {appointmentTypes && appointmentTypes.length > 0 && appointmentTypes.map(at => (
                <MenuItem key={at._id || at.id} value={at._id || at.id}>
                  {at.name || at.title || 'Unknown'}
                </MenuItem>
              ))}
            </Select>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: '#1976d2',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                +Add
              </Link>
            </Box>
          </Box>

          {/* Bottom Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                setLabFilters({ providerId: 'all', visitTypeId: 'all' });
                setLabAnchorEl(null);
              }}
              sx={{
                color: '#f44336',
                fontSize: '0.8rem',
                textDecoration: 'none',
                opacity: 0.8,
                '&:hover': { opacity: 1, textDecoration: 'underline' }
              }}
            >
              clear filter
            </Link>
          </Box>
        </Box>
      </Popover>
      <LabCasesDialog
        open={labCasesDialogOpen}
        onClose={() => setLabCasesDialogOpen(false)}
      />

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
            setShowConsult(true);
            setMoreMenuAnchorEl(null);
          }}
          sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
        >
          Show all columns
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
            handlePrint("portrait");
            setPrintMenuAnchorEl(null);
          }}
          sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
        >
          Portrait
        </MenuItem>
        <MenuItem
          onClick={() => {
            handlePrint("landscape");
            setPrintMenuAnchorEl(null);
          }}
          sx={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}
        >
          Landscape
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default OperatorySchedulePage;
