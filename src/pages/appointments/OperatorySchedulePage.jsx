import { useMemo, useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Dialog,
  DialogContent,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
  const [selectedDate, setSelectedDate] = useState(dayjs());
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
          dateOfBirth: data.dateOfBirth || "",
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
        const raw = Array.isArray(result)
          ? result
          : result?.appointments || [];
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
              const providerNum = rawProviderId
                ? Number(rawProviderId)
                : NaN;
              const colIndex =
                Number.isFinite(providerNum) && providerNum > 0
                  ? (providerNum - 1) % OPERATORY_COLUMNS.length
                  : 0;
              const derivedColumnId = OPERATORY_COLUMNS[colIndex]?.id || "op1";

              return {
                id: a._id || a.id,
                appointmentDate: a.appointmentDate,
                date: dateOnly,
                patientId: mappedPatientId,
                columnId: derivedColumnId,
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
        setAppointments(mapped);
      } catch (err) {
        console.error("Failed to load appointments for patient", err);
        showSnackbar(
          "Failed to load appointments for this patient.",
          "error",
        );
        setAppointments([]);
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
    const provider = providers?.find(
      (p) =>
        (p.firstName &&
          p.lastName &&
          `${p.firstName} ${p.lastName}` === formData.providerId) ||
        p._id === formData.providerId,
    );
    const effectiveProvider = provider || (providers && providers[0]);
    const payload = {
      patientId,
      providerId: effectiveProvider?._id,
      appointmentDate: start.format("YYYY-MM-DD"),
      startTime: start.format("HH:mm"),
      endTime: end.format("HH:mm"),
      durationMinutes: duration,
      chiefComplaint: "",
      notes: formData.notes || "",
      roomId: undefined,
      requiresInterpreter: false,
      interpreterLanguage: "",
      insuranceVerified: false,
      copayCollected: 0,
      reminderSent: false,
      customFields: {},
      status: formData.status || "scheduled",
    };
    try {
      setFormSaving(true);
      await appointmentService.createAppointment(payload);
      showSnackbar("Appointment created successfully", "success");
      setAddAppointmentFormOpen(false);
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to create appointment.";
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

  const selectedPatient = useMemo(
    () =>
      sidebarPatients.find(
        (p) => (p._id || p.id) === selectedPatientId,
      ) || null,
    [sidebarPatients, selectedPatientId],
  );

  const dayAppointments = useMemo(
    () =>
      appointments.filter((a) => {
        if (!a.date) return false;
        const apptKey = String(a.date).slice(0, 10);
        const selectedKey = selectedDate.format("YYYY-MM-DD");
        return apptKey === selectedKey;
      }),
    [appointments, selectedDate],
  );

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
        ((selectedPatient.firstName && selectedPatient.lastName
          ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
          : selectedPatient.name))) ||
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
    const start = selectedDate
      .startOf("day")
      .hour(START_HOUR)
      .minute(0)
      .add(minutesFromStart, "minute");
    openCreateDialog({ columnId, startIso: start.toISOString() });
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
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          borderRadius: 2,
          border: "1px solid #eef2f6",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <EventNoteIcon sx={{ color: "#1976d2", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Schedule Overview
          </Typography>
          <Chip
            icon={<AccessTimeIcon />}
            label="30 min slots"
            size="small"
            variant="outlined"
            sx={{ ml: 1, borderColor: "#cbd5e1", color: "#475569" }}
          />
        </Box>
        <Chip
          label={selectedDate.format("dddd, MMMM D, YYYY")}
          icon={<EventNoteIcon />}
          sx={{
            bgcolor: "#e3f2fd",
            color: "#1976d2",
            fontWeight: 500,
            px: 1,
            "& .MuiChip-icon": { color: "#1976d2" },
          }}
        />
      </Paper>

      {/* Main Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "360px 1fr" },
          gap: 2.5,
          alignItems: "start",
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
        />

        <OperatoryScheduleGrid
          OPERATORY_COLUMNS={OPERATORY_COLUMNS}
          dayAppointments={dayAppointments}
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
