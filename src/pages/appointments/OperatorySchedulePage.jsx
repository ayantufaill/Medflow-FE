import { useMemo, useState, useCallback, useEffect } from "react";
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
} from "@mui/material";
import { 
  PostAdd, Group, Science, Description, FilterAlt, 
  VisibilityOff, SpeakerNotesOff, Print, History, 
  Person, AttachMoney, MoreVert, CalendarMonth,
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
import { appointmentService } from "../../services/appointment.service";
import { patientService } from "../../services/patient.service";
import { useDropdownData } from "../../hooks/redux/useDropdownData";

// Constants
const START_HOUR = 0;
const END_HOUR = 24;
const SLOT_MINUTES = 30;
const SLOT_HEIGHT = 40;

const OPERATORY_COLUMNS = [
  { id: "op1", label: "Op 1", color: "#7e57c2" },
  { id: "op2", label: "Op 2", color: "#26a69a" },
  { id: "op3", label: "Op 3", color: "#ef6c00" },
  { id: "op4", label: "Op 4", color: "#42a5f5" },
  { id: "consult", label: "Hyg 1", color: "#8d6e63" },
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
  const { showSnackbar } = useSnackbar();
  const { providers } = useDropdownData({ providers: true });
  const [activeTab, setActiveTab] = useState(0); // 0: Patients, 1: Pending, 2: Search, 3: Productivity
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("day"); // 'day', 'week', 'month'
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [sidebarPatients, setSidebarPatients] = useState([]);
  const [loadingSidebarPatients, setLoadingSidebarPatients] = useState(false);
  const [creatingSidebarPatient, setCreatingSidebarPatient] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
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
  const [purchaseProductsDialogOpen, setPurchaseProductsDialogOpen] =
    useState(false);
  const [addAppointmentFormOpen, setAddAppointmentFormOpen] = useState(false);
  const [formPatients, setFormPatients] = useState([]);
  const [loadingFormPatients, setLoadingFormPatients] = useState(false);
  const [formSaving, setFormSaving] = useState(false);

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
    setAddAppointmentFormOpen(true);
  };

  const searchSidebarPatients = useCallback(async (search = "") => {
    try {
      setLoadingSidebarPatients(true);
      const result = await patientService.getAllPatients(
        1,
        20,
        search,
        "active",
      );
      setSidebarPatients(result.patients || []);
    } catch (err) {
      console.error("Error searching sidebar patients:", err);
      setSidebarPatients([]);
    } finally {
      setLoadingSidebarPatients(false);
    }
  }, []);

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
        const patient = await patientService.createPatient(payload);
        setSidebarPatients((prev) => [patient, ...prev]);
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
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to create patient. Please try again.";
        showSnackbar(msg, "error");
        throw err;
      } finally {
        setCreatingSidebarPatient(false);
      }
    },
    [showSnackbar],
  );

  const searchFormPatients = useCallback(async (search = "") => {
    try {
      setLoadingFormPatients(true);
      const result = await patientService.getAllPatients(
        1,
        20,
        search,
        "active",
      );
      setFormPatients(result.patients || []);
    } catch (err) {
      console.error("Error searching patients:", err);
      setFormPatients([]);
    } finally {
      setLoadingFormPatients(false);
    }
  }, []);

  useEffect(() => {
    if (addAppointmentFormOpen) searchFormPatients("");
  }, [addAppointmentFormOpen, searchFormPatients]);

  // Load initial patients on mount
  useEffect(() => {
    searchSidebarPatients("");
  }, []);

  // Auto-select first patient when sidebar patients are loaded
  useEffect(() => {
    if (sidebarPatients.length > 0 && !selectedPatientId) {
      const firstPatient = sidebarPatients[0];
      const patientId = firstPatient._id || firstPatient.id;
      const patientName = firstPatient.firstName && firstPatient.lastName
        ? `${firstPatient.firstName} ${firstPatient.lastName}`
        : firstPatient.name || "";
      
      setSelectedPatientId(patientId);
      setPatientQuery(patientName);
      
      console.log("Auto-selected first patient:", {
        id: patientId,
        name: patientName,
        totalPatients: sidebarPatients.length
      });
    }
  }, [sidebarPatients]);

  const initialFormDateTime = useMemo(
    () =>
      selectedDate
        .clone()
        .hour(START_HOUR === 0 ? 9 : START_HOUR)
        .minute(5),
    [selectedDate],
  );

  // Load real appointments for selected patient
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedPatientId) {
        setAppointments([]);
        return;
      }
      try {
        const result = await appointmentService.getAppointmentsByPatient(
          selectedPatientId,
          1,
          100,
        );
        const raw = Array.isArray(result) ? result : result?.appointments || [];
        const mapped = raw
          .filter((a) => a && a.appointmentDate)
          .map((a) => {
            try {
              const iso = String(a.appointmentDate || "");
              const dateOnly = iso.includes("T")
                ? iso.split("T")[0]
                : iso.slice(0, 10);
              if (!dateOnly) return null;

              const startObj = a.startTime
                ? dayjs(`${dateOnly}T${a.startTime}`)
                : null;
              if (!startObj || !startObj.isValid()) return null;

              const endObj = a.endTime
                ? dayjs(`${dateOnly}T${a.endTime}`)
                : startObj.add(a.durationMinutes || SLOT_MINUTES, "minute");
              if (!endObj.isValid()) return null;

              const fullName =
                (a.patientId &&
                  (a.patientId.firstName || a.patientId.lastName) &&
                  `${a.patientId.firstName || ""} ${
                    a.patientId.lastName || ""
                  }`.trim()) ||
                a.patientName ||
                "";
              const initials = fullName
                ? fullName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "PT";

              const mappedPatientId =
                (a.patientId && (a.patientId._id || a.patientId.id)) ||
                selectedPatientId;

              // Derive an operatory column from providerId (since API has no explicit operatory)
              const rawProviderId =
                a.providerId && (a.providerId._id || a.providerId.id);
              const providerNum = rawProviderId ? Number(rawProviderId) : NaN;
              const colIndex =
                Number.isFinite(providerNum) && providerNum > 0
                  ? (providerNum - 1) % OPERATORY_COLUMNS.length
                  : 0;
              const derivedColumnId = OPERATORY_COLUMNS[colIndex]?.id || "op1";
              
              // Use the operatoryId if available from the appointment, otherwise derive from provider
              const assignedColumnId = 
                a.operatoryId || 
                (formData?.operatoryId) ||
                derivedColumnId;

              return {
                id: a._id || a.id,
                appointmentDate: a.appointmentDate,
                date: dateOnly,
                patientId: mappedPatientId,
                columnId: assignedColumnId,
                title:
                  a.chiefComplaint ||
                  a.appointmentTypeId?.name ||
                  a.appointmentType ||
                  "Appointment",
                patientName: fullName || "Patient",
                patientInitials: initials,
                start: startObj.toISOString(),
                end: endObj.toISOString(),
                status: a.status || "scheduled",
                note: a.notes || "",
                color: "#1976d2",
              };
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        
        // Load local storage appointments and merge with backend appointments
        const localAppointments = JSON.parse(localStorage.getItem('localAppointments') || '[]');
        // Format local appointments to match calendar structure
        const formattedLocalAppointments = localAppointments.map(appt => ({
          ...appt,
          start: dayjs(`${appt.appointmentDate}T${appt.startTime}`).toISOString(),
          end: dayjs(`${appt.appointmentDate}T${appt.endTime}`).toISOString(),
        }));
        const mergedAppointments = [...mapped, ...formattedLocalAppointments];
        setAppointments(mergedAppointments);
      } catch (err) {
        console.error("Failed to load appointments for patient", err);
        showSnackbar("Failed to load appointments for this patient.", "error");
        
        // Still load local appointments even if backend fails
        const localAppointments = JSON.parse(localStorage.getItem('localAppointments') || '[]');
        // Format local appointments to match calendar structure
        const formattedLocalAppointments = localAppointments.map(appt => ({
          ...appt,
          start: dayjs(`${appt.appointmentDate}T${appt.startTime}`).toISOString(),
          end: dayjs(`${appt.appointmentDate}T${appt.endTime}`).toISOString(),
        }));
        setAppointments(formattedLocalAppointments);
      }
    };
    fetchAppointments();
  }, [selectedPatientId, showSnackbar]);

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
    
    // Generate a unique ID for the appointment
    const appointmentId = `appt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Testing mode bypass - always use dummy provider
    let providerId;
    if (IS_TESTING_MODE) {
      providerId = DUMMY_PROVIDER_ID;
    } else {
      const providerFromForm = formData.providerId;
      const resolvedProvider =
        providers?.find((p) => {
          const fullName =
            (p.firstName || p.lastName) &&
            `${p.firstName || ""} ${p.lastName || ""}`.trim();
          return (
            p._id === providerFromForm ||
            p.id === providerFromForm ||
            fullName === providerFromForm ||
            p.name === providerFromForm
          );
        }) || providers?.[0];
      providerId =
        (resolvedProvider && (resolvedProvider._id || resolvedProvider.id)) ||
        DUMMY_PROVIDER_ID;
    }
    
    // Create appointment object for localStorage
    const newAppointment = {
      id: appointmentId,
      patientId,
      patientName: formData.patientName || '',
      providerId,
      appointmentDate: start.format("YYYY-MM-DD"),
      startTime: start.format("HH:mm"),
      endTime: end.format("HH:mm"),
      durationMinutes: duration,
      chiefComplaint: "",
      notes: formData.notes || "",
      status: formData.status || "scheduled",
      isLocal: true, // Mark as local storage appointment
      createdAt: new Date().toISOString(),
      // Format for calendar display
      date: start.format("YYYY-MM-DD"),
      title: formData.chiefComplaint || "Appointment",
      patientInitials: (formData.patientName || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || "PT",
      // Use roomId from form as columnId, or default to first operatory
      columnId: formData.roomId || OPERATORY_COLUMNS[0]?.id || "op1",
      color: '#1976d2',
    };
    
    try {
      setFormSaving(true);
      
      // Store in localStorage instead of backend
      const existingAppointments = JSON.parse(localStorage.getItem('localAppointments') || '[]');
      existingAppointments.push(newAppointment);
      localStorage.setItem('localAppointments', JSON.stringify(existingAppointments));
      
      // Update local state to show the appointment immediately
      setAppointments((prev) => [...prev, newAppointment]);
      
      showSnackbar("Appointment created successfully (local storage)", "success");
      setAddAppointmentFormOpen(false);
    } catch (err) {
      const msg = err.message || "Failed to create appointment.";
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
      sidebarPatients.find((p) => (p._id || p.id) === selectedPatientId) ||
      null,
    [sidebarPatients, selectedPatientId],
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
      date: selectedDateKey,
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

  const handleGridClick = (columnId, minutesFromStart) => {
    // Grid click functionality disabled - appointments can only be created via the "Schedule Appointment" button
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
        { icon: <PostAdd /> },         // Form/Entry
        { icon: <Group /> },           // Patients/Group
        { icon: <Science /> },         // Lab
        { icon: <Description /> },     // Document
        { icon: <FilterAlt /> },       // Filter
        { icon: <VisibilityOff /> },   // Hide
        { icon: <SpeakerNotesOff /> }, // No Notes
        { icon: <Print /> },           // Print
        { icon: <History /> },         // History
        { icon: <Person /> },          // Profile
        { icon: <AttachMoney /> },     // Billing
        { icon: <MoreVert /> },        // More
        { icon: <CalendarMonth /> }    // Calendar
      ].map((item, idx) => (
        <IconButton
          key={idx}
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
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          patientQuery={patientQuery}
          setPatientQuery={setPatientQuery}
          patients={sidebarPatients}
          loadingPatients={loadingSidebarPatients || creatingSidebarPatient}
          onPatientSearch={searchSidebarPatients}
          onPatientSelect={(patient) =>
            setSelectedPatientId(patient?._id || patient?.id || null)
          }
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
        />

        <OperatoryScheduleGrid
          OPERATORY_COLUMNS={OPERATORY_COLUMNS}
          dayAppointments={dayAppointments}
          viewMode={viewMode}
          START_HOUR={START_HOUR}
          END_HOUR={END_HOUR}
          SLOT_MINUTES={SLOT_MINUTES}
          SLOT_HEIGHT={SLOT_HEIGHT}
          minutesSinceStart={minutesSinceStart}
          clamp={clamp}
          getStatusColor={getStatusColor}
          selectedDate={selectedDate}
          onSlotClick={(columnId, minutesFromStart) =>
            handleGridClick(columnId, minutesFromStart)
          }
          onScheduleAppointmentClick={handleScheduleAppointmentClick}
          onAppointmentClick={(appt) => {
            setSelectedAppointment(appt);
            setDetailsDialogOpen(true);
          }}
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
        onStatusChange={(appointmentId, newStatus) => {
          setAppointments((prev) =>
            prev.map((a) =>
              a.id === appointmentId ? { ...a, status: newStatus } : a,
            ),
          );
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

      <Dialog
        open={addAppointmentFormOpen}
        onClose={() => setAddAppointmentFormOpen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            maxWidth: 1200,
            height: "90vh",
            borderRadius: 2,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AddNewPatientAppointmentForm
            patients={formPatients}
            loadingPatients={loadingFormPatients}
            onPatientSearch={searchFormPatients}
            onSubmit={handleAddAppointmentSubmit}
            onCancel={() => setAddAppointmentFormOpen(false)}
            loading={formSaving}
            initialDateTime={initialFormDateTime}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OperatorySchedulePage;
