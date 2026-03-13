import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Checkbox,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const StyledDateCalendar = ({ value, onChange }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateCalendar
      value={value}
      onChange={onChange}
      sx={{
        width: "100%",
        "& .MuiPickersCalendarHeader-root": {
          paddingLeft: "16px",
          paddingRight: "16px",
          marginTop: "8px",
        },
        "& .MuiPickersCalendarHeader-label": {
          fontSize: "14px",
          fontWeight: 600,
          color: "#2c3e50",
        },
        "& .MuiDayCalendar-weekDayLabel": {
          fontSize: "12px",
          fontWeight: 500,
          color: "#7f8c8d",
          width: "36px",
          height: "36px",
        },
        "& .MuiPickersDay-root": {
          fontSize: "13px",
          fontWeight: 400,
          width: "36px",
          height: "36px",
          "&:hover": {
            backgroundColor: "#e3f2fd",
          },
          "&.Mui-selected": {
            backgroundColor: "#1976d2",
            color: "#ffffff",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          },
          "&.MuiPickersDay-today": {
            border: "2px solid #1976d2",
            backgroundColor: "#e3f2fd",
            fontWeight: 700,
            color: "#1976d2",
          },
        },
        "& .MuiDayCalendar-header": {
          justifyContent: "space-around",
          marginBottom: "4px",
        },
        "& .MuiDayCalendar-weekContainer": {
          justifyContent: "space-around",
          margin: "2px 0",
        },
      }}
    />
  </LocalizationProvider>
);

const OperatorySidebar = ({
  START_HOUR,
  selectedDate,
  onDateChange,
  patientQuery,
  setPatientQuery,
  patients = [],
  loadingPatients = false,
  onPatientSearch,
  onPatientSelect,
  onCreatePatient,
  hasSelectedPatient,
  preAppointmentChecklist,
  preAppointmentExpanded,
  setPreAppointmentExpanded,
  handlePreAppointmentSelection,
  checkOutChecklist,
  checkOutExpanded,
  setCheckOutExpanded,
  handleCheckOutSelection,
  openCreateDialog,
  onScheduleAppointmentClick,
  onCompleteBillClick,
  onPurchaseProductsClick,
}) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [checkInChecklist, setCheckInChecklist] = useState({
    patientArrived: null,
    copayCollected: null,
    formsCompleted: null,
    insuranceVerified: null,
  });
  const [checkInExpanded, setCheckInExpanded] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);

  const handleCheckInSelection = (item, selectionType) => {
    setCheckInChecklist((prev) => ({
      ...prev,
      [item]: prev[item] === selectionType ? null : selectionType,
    }));
  };

  useEffect(() => {
    // Don't hide the create form if user is actively filling it out
    if (isCreatingPatient) return;
    
    // Only show quick create if there's a query and no results
    if (!patientQuery?.trim()) {
      setShowQuickCreate(false);
      setIsCreatingPatient(false);
      return;
    }
    
    if (!loadingPatients && (!patients || patients.length === 0)) {
      setShowQuickCreate(true);
    } else if (patients && patients.length > 0) {
      setShowQuickCreate(false);
    }
  }, [patientQuery, loadingPatients, patients, isCreatingPatient]);

  const handleCreatePatientClick = async () => {
    if (!onCreatePatient) return;
    const payload = {
      firstName: newFirstName || patientQuery || "",
      lastName: newLastName || "",
      dateOfBirth: newDob || "",
      mobilePhone: newPhone || "",
      email: newEmail || "",
      sendWelcomeEmail,
      isNewPatient,
    };
    await onCreatePatient(payload);
    setNewFirstName("");
    setNewLastName("");
    setNewDob("");
    setNewPhone("");
    setNewEmail("");
  };

  return (
    <Box
      component="aside"
      sx={{
        borderRadius: 2,
        border: "1px solid #eef2f6",
        bgcolor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Patient Search */}
      <Box sx={{ p: 2, bgcolor: "#fafcff" }}>
        <Autocomplete
          size="small"
          options={patients}
          loading={loadingPatients}
          value={selectedPatient}
          getOptionLabel={(o) =>
            o?.firstName && o?.lastName
              ? `${o.firstName} ${o.lastName}`
              : o?.name || ""
          }
          onChange={(_, value) => {
            setSelectedPatient(value);
            onPatientSelect?.(value || null);
            if (value) {
              setPatientQuery(
                value.firstName && value.lastName
                  ? `${value.firstName} ${value.lastName}`
                  : value.name || ""
              );
            }
          }}
          inputValue={patientQuery}
          onInputChange={(_, value, reason) => {
            // Only trigger search on 'input' reason, not on 'blur' or 'reset'
            if (reason === 'input') {
              setPatientQuery(value);
              onPatientSearch?.(value);
            } else if (reason === 'clear') {
              setPatientQuery('');
              setSelectedPatient(null);
              onPatientSearch?.('');
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search patients..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Box>

      {showQuickCreate && (
        <Box
          sx={{ px: 2, pb: 2, pt: 1.5 }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 0.5 }}>
            no match found
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="First Name"
            value={newFirstName}
            onChange={(e) => {
              setNewFirstName(e.target.value);
              setIsCreatingPatient(true);
            }}
            onBlur={() => setIsCreatingPatient(false)}
            sx={{ mb: 0.75 }}
          />
          <TextField
            fullWidth
            size="small"
            label="Last Name"
            value={newLastName}
            onChange={(e) => {
              setNewLastName(e.target.value);
              setIsCreatingPatient(true);
            }}
            onBlur={() => setIsCreatingPatient(false)}
            sx={{ mb: 0.75 }}
          />
          <TextField
            fullWidth
            size="small"
            label="Date of Birth"
            type="date"
            value={newDob}
            onChange={(e) => {
              setNewDob(e.target.value);
              setIsCreatingPatient(true);
            }}
            onBlur={() => setIsCreatingPatient(false)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 0.75 }}
          />
          <TextField
            fullWidth
            size="small"
            label="Mobile Phone"
            value={newPhone}
            onChange={(e) => {
              setNewPhone(e.target.value);
              setIsCreatingPatient(true);
            }}
            onBlur={() => setIsCreatingPatient(false)}
            sx={{ mb: 0.75 }}
          />
          <TextField
            fullWidth
            size="small"
            label="Email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setIsCreatingPatient(true);
            }}
            onBlur={() => setIsCreatingPatient(false)}
            sx={{ mb: 0.75 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Checkbox
              size="small"
              checked={sendWelcomeEmail}
              onChange={(e) => setSendWelcomeEmail(e.target.checked)}
            />
            <Typography sx={{ fontSize: 12, color: "#475569" }}>
              send welcome email
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Checkbox
              size="small"
              checked={isNewPatient}
              onChange={(e) => setIsNewPatient(e.target.checked)}
            />
            <Typography sx={{ fontSize: 12, color: "#475569" }}>
              new patient
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={() => {
              setIsCreatingPatient(false);
              handleCreatePatientClick();
            }}
            sx={{
              textTransform: "none",
              bgcolor: "#e0a15a",
              "&:hover": { bgcolor: "#cf8f49" },
            }}
          >
            Create New Patient
          </Button>
        </Box>
      )}

      {hasSelectedPatient && (
        <>
      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          startIcon={<EventNoteIcon />}
          onClick={() =>
            onScheduleAppointmentClick
              ? onScheduleAppointmentClick()
              : openCreateDialog({
                  columnId: "op1",
                  startIso: selectedDate
                    .startOf("day")
                    .hour(START_HOUR)
                    .toISOString(),
                })
          }
          sx={{
            textTransform: "none",
            borderRadius: 2,
            bgcolor: "#1976d2",
            mb: 2,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Schedule Appointment
        </Button>

        {/* Pre-Appointment Checklist */}
        <Box sx={{ mb: 2 }}>
          <Box
            onClick={() => setPreAppointmentExpanded(!preAppointmentExpanded)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
              px: 1.5,
              borderRadius: 1.5,
              bgcolor: "#f8fafc",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#f59e0b",
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Pre-Appointment Checklist
              </Typography>
            </Box>
            <Box
              sx={{
                transform: preAppointmentExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                color: "#64748b",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Box>
          </Box>

          {preAppointmentExpanded && (
            <Box sx={{ pt: 1 }}>
              {[
                { key: "importHistory", label: "Import History", naColor: "#ef4444" },
                { key: "importRecord", label: "Import Record", naColor: "#ef4444" },
                { key: "apptReminder", label: "Appt Reminder", naColor: "#ef4444" },
                {
                  key: "verifyInsurance",
                  label: "Verify Insurance Eligibility",
                  naColor: "#ef4444",
                },
                {
                  key: "premedicationReminder",
                  label: "Premedication Reminder",
                  naColor: "#ef4444",
                },
                {
                  key: "labCaseReceived",
                  label: "Lab Case Received",
                  naColor: "#ef4444",
                },
              ].map((item) => (
                <Box
                  key={item.key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.75,
                    px: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "#475569" }}>
                    {item.label}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label="N/A"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreAppointmentSelection(item.key, "na");
                      }}
                      sx={{
                        minWidth: 48,
                        height: 28,
                        fontSize: 11,
                        fontWeight: 500,
                        borderRadius: "14px",
                        bgcolor:
                          preAppointmentChecklist[item.key] === "na"
                            ? item.naColor
                            : "#f1f5f9",
                        color:
                          preAppointmentChecklist[item.key] === "na"
                            ? "#ffffff"
                            : "#64748b",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor:
                            preAppointmentChecklist[item.key] === "na"
                              ? item.naColor
                              : "#e2e8f0",
                        },
                        cursor: "pointer",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreAppointmentSelection(item.key, "checked");
                      }}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor:
                          preAppointmentChecklist[item.key] === "checked"
                            ? "#10b981"
                            : "#cbd5e1",
                        bgcolor:
                          preAppointmentChecklist[item.key] === "checked"
                            ? "#10b981"
                            : "transparent",
                        color: "#ffffff",
                        padding: 0,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#10b981",
                          bgcolor:
                            preAppointmentChecklist[item.key] === "checked"
                              ? "#059669"
                              : "#f1f5f9",
                        },
                        cursor: "pointer",
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Check-out Checklist */}
        <Box sx={{ mb: 2 }}>
          <Box
            onClick={() => setCheckOutExpanded(!checkOutExpanded)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
              px: 1.5,
              borderRadius: 1.5,
              bgcolor: "#f8fafc",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#8b5cf6",
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Check-out Checklist
              </Typography>
            </Box>
            <Box
              sx={{
                transform: checkOutExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                color: "#64748b",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Box>
          </Box>

          {checkOutExpanded && (
            <Box sx={{ pt: 1 }}>
              {[
                {
                  key: "completeAndBillProcedures",
                  label: "Complete & Bill Procedures",
                  naColor: "#ef4444",
                },
                { key: "purchaseProducts", label: "Purchase Products", naColor: "#ef4444" },
                { key: "shareClinicalReports", label: "Share Clinical Reports", naColor: "#ef4444" },
                { key: "prescription", label: "Prescription", naColor: "#ef4444" },
                { key: "scheduleNextAppt", label: "Schedule Next Appt", naColor: "#ef4444" },
                { key: "sendLabCase", label: "Send Lab Case", naColor: "#ef4444" },
              ].map((item) => (
                <Box
                  key={item.key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.75,
                    px: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#475569",
                      ...((item.key === "completeAndBillProcedures" && onCompleteBillClick) ||
                      (item.key === "purchaseProducts" && onPurchaseProductsClick)
                        ? {
                            cursor: "pointer",
                            "&:hover": { color: "#1976d2" },
                          }
                        : {}),
                    }}
                    onClick={(e) => {
                      if (item.key === "completeAndBillProcedures" && onCompleteBillClick) {
                        e.stopPropagation();
                        onCompleteBillClick();
                      }
                      if (item.key === "purchaseProducts" && onPurchaseProductsClick) {
                        e.stopPropagation();
                        onPurchaseProductsClick();
                      }
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label="N/A"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckOutSelection(item.key, "na");
                      }}
                      sx={{
                        minWidth: 48,
                        height: 28,
                        fontSize: 11,
                        fontWeight: 500,
                        borderRadius: "14px",
                        bgcolor:
                          checkOutChecklist[item.key] === "na"
                            ? item.naColor
                            : "#f1f5f9",
                        color:
                          checkOutChecklist[item.key] === "na"
                            ? "#ffffff"
                            : "#64748b",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor:
                            checkOutChecklist[item.key] === "na"
                              ? item.naColor
                              : "#e2e8f0",
                        },
                        cursor: "pointer",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckOutSelection(item.key, "checked");
                      }}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor:
                          checkOutChecklist[item.key] === "checked"
                            ? "#10b981"
                            : "#cbd5e1",
                        bgcolor:
                          checkOutChecklist[item.key] === "checked"
                            ? "#10b981"
                            : "transparent",
                        color: "#ffffff",
                        padding: 0,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#10b981",
                          bgcolor:
                            checkOutChecklist[item.key] === "checked"
                              ? "#059669"
                              : "#f1f5f9",
                        },
                        cursor: "pointer",
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Check-in Checklist */}
        <Box sx={{ mb: 2 }}>
          <Box
            onClick={() => setCheckInExpanded(!checkInExpanded)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
              px: 1.5,
              borderRadius: 1.5,
              bgcolor: "#f8fafc",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#10b981",
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Check-in Checklist
              </Typography>
            </Box>
            <Box
              sx={{
                transform: checkInExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                color: "#64748b",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </Box>
          </Box>

          {checkInExpanded && (
            <Box sx={{ pt: 1 }}>
              {[
                { key: "patientArrived", label: "Patient Arrived", naColor: "#ef4444" },
                { key: "copayCollected", label: "Co-payment Collected", naColor: "#ef4444" },
                { key: "formsCompleted", label: "Forms Completed", naColor: "#ef4444" },
                { key: "insuranceVerified", label: "Insurance Card Verified", naColor: "#ef4444" },
              ].map((item) => (
                <Box
                  key={item.key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.75,
                    px: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "#475569" }}>
                    {item.label}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label="N/A"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckInSelection(item.key, "na");
                      }}
                      sx={{
                        minWidth: 48,
                        height: 28,
                        fontSize: 11,
                        fontWeight: 500,
                        borderRadius: "14px",
                        bgcolor:
                          checkInChecklist[item.key] === "na"
                            ? item.naColor
                            : "#f1f5f9",
                        color:
                          checkInChecklist[item.key] === "na"
                            ? "#ffffff"
                            : "#64748b",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor:
                            checkInChecklist[item.key] === "na"
                              ? item.naColor
                              : "#e2e8f0",
                        },
                        cursor: "pointer",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckInSelection(item.key, "checked");
                      }}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor:
                          checkInChecklist[item.key] === "checked"
                            ? "#10b981"
                            : "#cbd5e1",
                        bgcolor:
                          checkInChecklist[item.key] === "checked"
                            ? "#10b981"
                            : "transparent",
                        color: "#ffffff",
                        padding: 0,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#10b981",
                          bgcolor:
                            checkInChecklist[item.key] === "checked"
                              ? "#059669"
                              : "#f1f5f9",
                        },
                        cursor: "pointer",
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: 13 }}>ReAppointment</InputLabel>
            <Select
              label="ReAppointment"
              defaultValue=""
              sx={{ borderRadius: 1.5, fontSize: 13 }}
            >
              <MenuItem value="" disabled>
                Schedule follow-up
              </MenuItem>
              <MenuItem value="1week" sx={{ fontSize: 13 }}>
                In 1 Week
              </MenuItem>
              <MenuItem value="2weeks" sx={{ fontSize: 13 }}>
                In 2 Weeks
              </MenuItem>
              <MenuItem value="1month" sx={{ fontSize: 13 }}>
                In 1 Month
              </MenuItem>
              <MenuItem value="3months" sx={{ fontSize: 13 }}>
                In 3 Months
              </MenuItem>
              <MenuItem value="6months" sx={{ fontSize: 13 }}>
                In 6 Months
              </MenuItem>
              <MenuItem value="1year" sx={{ fontSize: 13 }}>
                In 1 Year
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: 13 }}>Recare</InputLabel>
            <Select
              label="Recare"
              defaultValue=""
              sx={{ borderRadius: 1.5, fontSize: 13 }}
            >
              <MenuItem value="" disabled>
                Set recare interval
              </MenuItem>
              <MenuItem value="3months" sx={{ fontSize: 13 }}>
                Every 3 Months
              </MenuItem>
              <MenuItem value="4months" sx={{ fontSize: 13 }}>
                Every 4 Months
              </MenuItem>
              <MenuItem value="6months" sx={{ fontSize: 13 }}>
                Every 6 Months
              </MenuItem>
              <MenuItem value="9months" sx={{ fontSize: 13 }}>
                Every 9 Months
              </MenuItem>
              <MenuItem value="12months" sx={{ fontSize: 13 }}>
                Every 12 Months
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: 13 }}>Family Appointment</InputLabel>
            <Select
              label="Family Appointment"
              defaultValue=""
              sx={{ borderRadius: 1.5, fontSize: 13 }}
            >
              <MenuItem value="" disabled>
                Schedule family members
              </MenuItem>
              <MenuItem value="add" sx={{ fontSize: 13 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 16, color: "#64748b" }} />
                  Add Family Member
                </Box>
              </MenuItem>
              <MenuItem value="scheduleTogether" sx={{ fontSize: 13 }}>
                Schedule Together
              </MenuItem>
              <MenuItem value="backToBack" sx={{ fontSize: 13 }}>
                Back-to-Back Appointments
              </MenuItem>
              <Divider />
              <MenuItem disabled sx={{ fontSize: 12, color: "#94a3b8" }}>
                Family Members:
              </MenuItem>
              <MenuItem value="richard" sx={{ fontSize: 13, pl: 3 }}>
                Richard Chen
              </MenuItem>
              <MenuItem value="william" sx={{ fontSize: 13, pl: 3 }}>
                William Taylor
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Divider />

      {/* Calendar */}
      <Box sx={{ p: 2, bgcolor: "#fafcff" }}>
        <StyledDateCalendar
          value={selectedDate}
          onChange={(v) => {
            if (v && onDateChange) {
              onDateChange(v);
            }
          }}
        />
      </Box>
        </>
      )}
    </Box>
  );
};

export default OperatorySidebar;

