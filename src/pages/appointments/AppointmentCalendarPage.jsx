import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Autocomplete,
  TextField,
  Grid,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Event as EventIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { appointmentService } from "../../services/appointment.service";
import { providerService } from "../../services/provider.service";

const AppointmentCalendarPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const calendarRef = useRef(null);
  const fetchingRef = useRef(false); // Prevent concurrent fetches
  const lastFetchedRangeRef = useRef({
    startDate: "",
    endDate: "",
    providerId: "",
  }); // Track last fetched range
  const slotsFetchTimeoutRef = useRef(null); // For debouncing slot fetches
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState({}); // { date: [slots] }
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [providerDialogOpen, setProviderDialogOpen] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProviderData, setSelectedProviderData] = useState(null);
  const [providerSearchText, setProviderSearchText] = useState('');
  const providerSearchTimerRef = useRef(null);

  const searchProviders = useCallback(async (search = "") => {
    try {
      setLoadingProviders(true);
      const result = await providerService.getAllProviders(
        1,
        20,
        search,
        true,
        ''
      );
      setProviders(result.providers || []);
    } catch (err) {
      console.error("Error searching providers:", err);
    } finally {
      setLoadingProviders(false);
    }
  }, []);

  useEffect(() => {
    searchProviders("");
  }, [searchProviders]);


  const handleProviderSearchChange = (event, newInputValue) => {
    setProviderSearchText(newInputValue);
    if (providerSearchTimerRef.current) {
      clearTimeout(providerSearchTimerRef.current);
    }
    providerSearchTimerRef.current = setTimeout(() => {
      searchProviders(newInputValue);
    }, 300);
  };


  const fetchCalendarData = useCallback(async () => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return;

    try {
      const calendarApi = calendarRef.current?.getApi();
      let startDate, endDate;

      if (calendarApi) {
        startDate = dayjs(calendarApi.view.activeStart).format("YYYY-MM-DD");
        endDate = dayjs(calendarApi.view.activeEnd).format("YYYY-MM-DD");
      } else {
        startDate = dayjs(currentDate).startOf("month").format("YYYY-MM-DD");
        endDate = dayjs(currentDate).endOf("month").format("YYYY-MM-DD");
      }

      const providerId = selectedProvider || "";

      // Check if we need to fetch (range or provider changed)
      const lastRange = lastFetchedRangeRef.current;
      if (
        lastRange.startDate === startDate &&
        lastRange.endDate === endDate &&
        lastRange.providerId === providerId
      ) {
        // Same range and provider, no need to fetch
        return;
      }

      fetchingRef.current = true;
      setLoading(true);
      setError("");

      // Update last fetched range
      lastFetchedRangeRef.current = { startDate, endDate, providerId };

      const providerIds = selectedProvider ? [selectedProvider] : [];
      const result = await appointmentService.getCalendarSchedule(
        startDate,
        endDate,
        providerIds
      );

      setEvents(result.events || []);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Failed to load calendar data. Please try again.";
      setError(errorMessage);
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider, currentDate]); // Removed showSnackbar to prevent infinite loop

  useEffect(() => {
    fetchCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider, currentDate]); // Use direct dependencies instead of callback

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (slotsFetchTimeoutRef.current) {
        clearTimeout(slotsFetchTimeoutRef.current);
      }
    };
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const handleProviderChange = async (event, newValue) => {
    const value = newValue ? newValue._id || newValue.id : "";
    setSelectedProvider(value);
    setSelectedProviderData(newValue);

    setAvailableSlots({});

    if (value) {
      setTimeout(() => {
        fetchAvailableSlotsForProvider(value);
      }, 300);
    }
  };

  const isWithinWorkingHours = (date, time) => {
    if (!selectedProviderData || !selectedProviderData.workingHours)
      return true;

    const dayOfWeek = dayjs(date).day();
    const workingHours = selectedProviderData.workingHours;
    const daySchedule = workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

    if (!daySchedule || !daySchedule.isAvailable) return false;

    const [slotHours, slotMinutes] = time.split(":").map(Number);
    const slotTotalMinutes = slotHours * 60 + slotMinutes;

    const [startHours, startMinutes] = daySchedule.startTime
      .split(":")
      .map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;

    const [endHours, endMinutes] = daySchedule.endTime.split(":").map(Number);
    const endTotalMinutes = endHours * 60 + endMinutes;

    return (
      slotTotalMinutes >= startTotalMinutes &&
      slotTotalMinutes < endTotalMinutes
    );
  };

  const isPastDate = (date) => {
    const now = dayjs();
    const slotDate = dayjs(date);
    return slotDate.isBefore(now, "minute");
  };

  // Fetch available slots for a provider across the visible date range
  const fetchAvailableSlotsForProvider = useCallback(async (providerId) => {
    if (!providerId) return;

    try {
      setLoadingSlots(true);
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;

      const startDate = dayjs(calendarApi.view.activeStart);
      const endDate = dayjs(calendarApi.view.activeEnd);
      const slotsMap = {};

      // Limit the date range to prevent too many requests (max 7 days ahead)
      const maxDays = 7;
      const daysDiff = endDate.diff(startDate, "day");
      const daysToFetch = Math.min(daysDiff, maxDays);
      const limitedEndDate = startDate.add(daysToFetch, "day");

      // Fetch available slots for each day with rate limiting
      let currentDay = startDate;
      let requestCount = 0;
      const maxRequestsPerSecond = 2; // Limit to 2 requests per second
      const delayBetweenRequests = 1000 / maxRequestsPerSecond;

      while (
        currentDay.isBefore(limitedEndDate) ||
        currentDay.isSame(limitedEndDate, "day")
      ) {
        const dateStr = currentDay.format("YYYY-MM-DD");

        // Add delay between requests to prevent rate limiting
        if (requestCount > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenRequests)
          );
        }

        try {
          const result = await appointmentService.getAvailableSlots(
            providerId,
            dateStr,
            30 // Default duration
          );
          slotsMap[dateStr] = result.availableSlots || [];
          requestCount++;
        } catch (err) {
          // Handle 429 (Too Many Requests) error gracefully
          if (err.response?.status === 429) {
            console.warn(
              `Rate limited for ${dateStr}, skipping remaining dates`
            );
            // Stop fetching if we hit rate limit
            break;
          }
          console.error(`Error fetching slots for ${dateStr}:`, err);
          slotsMap[dateStr] = [];
        }
        currentDay = currentDay.add(1, "day");
      }

      setAvailableSlots(slotsMap);
    } catch (err) {
      console.error("Error fetching available slots:", err);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Check if a time slot is available for the selected provider
  const isSlotAvailable = (date, time) => {
    if (!selectedProvider) return true; // If no provider selected, allow all slots

    const dateStr = dayjs(date).format("YYYY-MM-DD");
    if (!(dateStr in availableSlots)) return true;

    const slots = availableSlots[dateStr] || [];

    // Check if the time slot is in the available slots list
    return slots.includes(time);
  };

  const getSlotLaneClassNames = useCallback(
    (arg) => {
      const slotDate = arg.date;
      const time = dayjs(slotDate).format("HH:mm");

      const isDisabled =
        isPastDate(slotDate) ||
        (selectedProvider
          ? !isWithinWorkingHours(slotDate, time) ||
            !isSlotAvailable(slotDate, time)
          : false);

      if (isDisabled) {
        return ["mf-slot-disabled"];
      }

      if (selectedProvider && isWithinWorkingHours(slotDate, time) && isSlotAvailable(slotDate, time)) {
        return ["mf-slot-available"];
      }

      return [];
    },
    [selectedProvider, selectedProviderData, availableSlots]
  );

  const handleViewChange = (event) => {
    const newView = event.target.value;
    setCurrentView(newView);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newView);
    }
  };

  const handleDatesSet = useCallback(
    (dateInfo) => {
      const newDate = dateInfo.start;
      const newStartDate = dayjs(dateInfo.start).format("YYYY-MM-DD");
      const newEndDate = dayjs(dateInfo.end).format("YYYY-MM-DD");

      // Update current date
      setCurrentDate(newDate);

      // Reset the lastFetchedRangeRef to force refetch when dates change
      const lastRange = lastFetchedRangeRef.current;
      if (lastRange.startDate !== newStartDate || lastRange.endDate !== newEndDate) {
        lastFetchedRangeRef.current = { startDate: "", endDate: "", providerId: "" };
      }

      // Debounce available slots fetching to prevent too many requests
      // Only refetch if provider is selected and we're not already loading
      if (selectedProvider && !loadingSlots) {
        // Clear any existing timeout
        if (slotsFetchTimeoutRef.current) {
          clearTimeout(slotsFetchTimeoutRef.current);
        }

        // Use setTimeout to debounce the request (500ms delay)
        slotsFetchTimeoutRef.current = setTimeout(() => {
          fetchAvailableSlotsForProvider(selectedProvider);
        }, 500);
      }
    },
    [selectedProvider, fetchAvailableSlotsForProvider, loadingSlots]
  );

  const handleDateSelect = (selectInfo) => {
    const startDate = dayjs(selectInfo.start).format("YYYY-MM-DD");
    const startTime = dayjs(selectInfo.start).format("HH:mm");
    const endTime = dayjs(selectInfo.end).format("HH:mm");

    if (isPastDate(selectInfo.start)) {
      showSnackbar("Cannot book appointments in the past", "warning");
      return;
    }

    if (!selectedProvider) {
      setProviderDialogOpen(true);
      return;
    }

    if (!isWithinWorkingHours(selectInfo.start, startTime)) {
      showSnackbar(
        "This time slot is outside the provider's working hours",
        "warning"
      );
      return;
    }

    if (!isSlotAvailable(selectInfo.start, startTime)) {
      showSnackbar(
        "This time slot is not available for the selected provider",
        "warning"
      );
      return;
    }

    const params = new URLSearchParams({
      date: startDate,
      startTime: startTime,
      endTime: endTime,
    });

    params.append("providerId", selectedProvider);

    navigate(`/appointments/new?${params.toString()}`);
  };

  const handleSelectAllow = (selectInfo) => {
    if (isPastDate(selectInfo.start)) return false;

    if (!selectedProvider) return true;

    const startTime = dayjs(selectInfo.start).format("HH:mm");
    if (!isWithinWorkingHours(selectInfo.start, startTime)) return false;

    return isSlotAvailable(selectInfo.start, startTime);
  };

  // Professional color palette consistent with Material-UI design system
  const getStatusColor = (status) => {
    const statusColors = {
      scheduled: "#1976d2",      // Primary blue
      confirmed: "#1565c0",      // Darker blue for confirmed
      checked_in: "#f57c00",      // Orange for checked in
      in_progress: "#7b1fa2",    // Purple for in progress
      completed: "#2e7d32",      // Green for completed
      cancelled: "#c62828",       // Dark red for cancelled
      no_show: "#616161",        // Gray for no show
    };
    return statusColors[status] || "#1976d2";
  };

  // Professional colors for appointment types
  const getAppointmentTypeColor = (appointmentTypeName) => {
    if (!appointmentTypeName) return null;
    
    const typeName = appointmentTypeName.toLowerCase();
    
    // Map common appointment types to professional colors
    const typeColors = {
      // Consultation types - use blue shades
      'initial consultation': '#1976d2',      // Primary blue
      'consultation': '#1976d2',
      'new patient': '#1976d2',
      'initial visit': '#1976d2',
      
      // Follow-up types - use teal/cyan shades (more professional than bright cyan)
      'follow-up visit': '#00897b',           // Professional teal
      'follow up': '#00897b',
      'followup': '#00897b',
      'follow-up': '#00897b',
      'return visit': '#00897b',
      'routine visit': '#00897b',
      
      // Procedure types - use indigo
      'procedure': '#3949ab',
      'surgery': '#3949ab',
      'minor procedure': '#3949ab',
      
      // Emergency/Urgent - use red-orange
      'emergency': '#d84315',
      'urgent': '#d84315',
      
      // Check-up types - use green
      'check-up': '#388e3c',
      'checkup': '#388e3c',
      'wellness visit': '#388e3c',
      'annual exam': '#388e3c',
      
      // Therapy/Treatment - use purple
      'therapy': '#7b1fa2',
      'treatment': '#7b1fa2',
      'physical therapy': '#7b1fa2',
    };
    
    // Check for exact match first
    if (typeColors[typeName]) {
      return typeColors[typeName];
    }
    
    // Check for partial matches
    for (const [key, color] of Object.entries(typeColors)) {
      if (typeName.includes(key) || key.includes(typeName)) {
        return color;
      }
    }
    
    // Default: use a professional blue-gray for unknown types
    return null;
  };

  const formattedEvents = events.map((event) => {
    // Priority: appointment type color > status color > default
    const appointmentTypeColor = getAppointmentTypeColor(
      event.extendedProps?.appointmentTypeName || event.title
    );
    const statusColor = getStatusColor(event.extendedProps?.status);
    
    // Use appointment type color if available, otherwise use status color
    const color = appointmentTypeColor || event.backgroundColor || statusColor;
    
    return {
      ...event,
      backgroundColor: color,
      borderColor: color,
      // Add subtle opacity for better visual hierarchy
      classNames: ['appointment-event'],
    };
  });

  const handleEventClick = (clickInfo) => {
    const eventData = clickInfo.event.extendedProps;
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      ...eventData,
    });
    setEventDialogOpen(true);
  };

  const handleCloseEventDialog = () => {
    setEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleViewAppointment = () => {
    if (selectedEvent?.appointmentId) {
      navigate(`/appointments/${selectedEvent.appointmentId}`);
    }
    handleCloseEventDialog();
  };

  const handleEditAppointment = () => {
    if (selectedEvent?.appointmentId) {
      navigate(`/appointments/${selectedEvent.appointmentId}/edit`);
    }
    handleCloseEventDialog();
  };

  const getStatusChipColor = (status) => {
    const statusColors = {
      scheduled: "primary",
      confirmed: "info",
      checked_in: "warning",
      in_progress: "secondary",
      completed: "success",
      cancelled: "error",
      no_show: "default",
    };
    return statusColors[status] || "default";
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getProviderName = (provider) => {
    if (!provider) return "";
    const user = provider.userId || {};
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const code = provider.providerCode || "";
    return `${firstName} ${lastName}${code ? ` (${code})` : ""}`.trim();
  };

  const getProviderSpecialties = (provider) => {
    if (!provider || !provider.specialty) return "";
    const specialties = Array.isArray(provider.specialty) 
      ? provider.specialty 
      : [provider.specialty];
    return specialties.filter(Boolean).join(", ");
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Appointment Calendar
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage appointments. Click on empty slots to create new
            appointments.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/appointments/new")}
          >
            New Appointment
          </Button> */}
        </Box>
      </Box>

      <Dialog
        open={!!error}
        onClose={() => setError("")}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" color="error">
              Error
            </Typography>
            <IconButton size="small" onClick={() => setError("")}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setError("")}
            variant="contained"
            color="error"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box>
          <Grid container spacing={2}>
            <Grid size={9}>
              <Autocomplete
                options={providers}
                value={selectedProviderData}
                onChange={handleProviderChange}
                onInputChange={handleProviderSearchChange}
                getOptionLabel={(option) => getProviderName(option)}
                getOptionKey={(option) => option._id || option.id}
                isOptionEqualToValue={(option, value) =>
                  (option._id || option.id) === (value._id || value.id)
                }
                loading={loadingProviders}
                filterOptions={(x) => x}
                noOptionsText={loadingProviders ? 'Searching...' : 'No providers found'}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="search providers..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingProviders ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option._id || option.id}>
                    <Box>
                      <Typography variant="body1">
                        {getProviderName(option)}
                      </Typography>
                      {getProviderSpecialties(option) && (
                        <Typography variant="caption" color="text.secondary">
                          {getProviderSpecialties(option)}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
              />
            </Grid>
            <Grid size={2}>
              <FormControl fullWidth>
                <InputLabel>View</InputLabel>
                <Select
                  value={currentView}
                  label="View"
                  onChange={handleViewChange}
                >
                  <MenuItem value="timeGridDay">Day</MenuItem>
                  <MenuItem value="timeGridWeek">Week</MenuItem>
                  <MenuItem value="dayGridMonth">Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={1}>
              {/* {selectedProvider && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    setSelectedProvider("");
                    setSelectedProviderData(null);
                    setAvailableSlots({});
                  }}
                >
                  Clear Filter
                </Button>
              )} */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  height: "100%"
                }}
              >
                <Tooltip title="Refresh calender">
                  <span>
                    <IconButton
                      onClick={fetchCalendarData}
                      disabled={loading}
                      color="primary"
                    >
                      <RefreshIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {loading && events.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="600px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={(theme) => ({
              ".fc": {
                fontFamily: "inherit",
                color: theme.palette.text.primary,
              },
              ".fc-theme-standard td, .fc-theme-standard th": {
                borderColor: theme.palette.divider,
              },
              ".fc-toolbar-title": {
                fontSize: "1.25rem !important",
                fontWeight: 600,
              },
              ".fc-button": {
                textTransform: "capitalize !important",
                fontWeight: 500,
                boxShadow: "none",
              },
              ".fc .fc-button-primary": {
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
              },
              ".fc .fc-button-primary:hover": {
                backgroundColor: theme.palette.primary.dark,
                borderColor: theme.palette.primary.dark,
              },
              ".fc .fc-button-primary:disabled": {
                backgroundColor: theme.palette.action.disabledBackground,
                borderColor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
              ".fc .fc-button-primary:not(:disabled).fc-button-active": {
                backgroundColor: theme.palette.primary.dark,
                borderColor: theme.palette.primary.dark,
              },
              ".fc .fc-col-header-cell": {
                backgroundColor: theme.palette.background.paper,
              },
              ".fc-event": {
                cursor: "pointer",
                borderRadius: "6px",
                borderWidth: "2px",
                fontWeight: 500,
                fontSize: "0.875rem",
              },
              ".fc-timegrid-slot": {
                height: "40px",
              },
              ".fc-timegrid-event": {
                borderRadius: "6px",
                borderWidth: "2px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              },
              ".appointment-event": {
                opacity: 0.95,
                "&:hover": {
                  opacity: 1,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.16)",
                },
              },
              ".fc-timegrid-slot-lane.mf-slot-disabled": {
                backgroundColor: theme.palette.action.disabledBackground,
                cursor: "not-allowed",
              },
              ".fc-timegrid-slot-lane.mf-slot-disabled *": {
                cursor: "not-allowed",
              },
              ".fc-timegrid-slot-lane.mf-slot-available": {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(46, 125, 50, 0.15)' 
                  : 'rgba(46, 125, 50, 0.08)',
              },
            })}
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              events={formattedEvents}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              select={handleDateSelect}
              selectAllow={handleSelectAllow}
              slotLaneClassNames={getSlotLaneClassNames}
              eventClick={handleEventClick}
              datesSet={handleDatesSet}
              slotMinTime="00:00:00"
              slotMaxTime="23:59:00"
              slotDuration="00:15:00"
              slotLabelInterval="01:00:00"
              allDaySlot={false}
              height="auto"
              aspectRatio={1.8}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
              nowIndicator={true}
              eventDisplay="block"
            />
          </Box>
        )}
      </Paper>

      <Dialog
        open={providerDialogOpen}
        onClose={() => setProviderDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningIcon color="warning" />
            <Typography variant="h6">Provider Required</Typography>
          </Box>
          <IconButton onClick={() => setProviderDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Please select a provider before booking an appointment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setProviderDialogOpen(false)}
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={eventDialogOpen}
        onClose={handleCloseEventDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Appointment Details</Typography>
          <IconButton onClick={handleCloseEventDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEvent && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={selectedEvent.status?.replace("_", " ").toUpperCase()}
                  color={getStatusChipColor(selectedEvent.status)}
                  size="small"
                />
                <Chip
                  label={selectedEvent.insuranceVerified ? "Insurance ✓" : "Insurance ✗"}
                  color={selectedEvent.insuranceVerified ? "success" : "warning"}
                  size="small"
                  variant={selectedEvent.insuranceVerified ? "filled" : "outlined"}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Patient
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.patientName || "N/A"}
                    {selectedEvent.patientCode &&
                      ` (${selectedEvent.patientCode})`}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Provider
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.providerName || "N/A"}
                    {selectedEvent.providerCode &&
                      ` (${selectedEvent.providerCode})`}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Time
                  </Typography>
                  <Typography variant="body1">
                    {formatTime(selectedEvent.startTime)} -{" "}
                    {formatTime(selectedEvent.endTime)}
                    {selectedEvent.durationMinutes &&
                      ` (${selectedEvent.durationMinutes} min)`}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EventIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Appointment Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.appointmentTypeName || "N/A"}
                  </Typography>
                </Box>
              </Box>

              {/* Insurance & Copay Info */}
              <Box sx={{ 
                p: 1.5, 
                bgcolor: selectedEvent.insuranceVerified ? 'success.50' : 'warning.50', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: selectedEvent.insuranceVerified ? 'success.light' : 'warning.light'
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Insurance Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="medium">
                    {selectedEvent.insuranceVerified ? '✓ Verified' : '✗ Not Verified'}
                  </Typography>
                  {selectedEvent.copayCollected > 0 && (
                    <Chip 
                      label={`Copay: $${selectedEvent.copayCollected}`} 
                      size="small" 
                      color="success"
                    />
                  )}
                </Box>
              </Box>

              {selectedEvent.chiefComplaint && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Chief Complaint
                  </Typography>
                  <Typography variant="body1">
                    {selectedEvent.chiefComplaint}
                  </Typography>
                </Box>
              )}

              {selectedEvent.notes && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">{selectedEvent.notes}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEventDialog}>Close</Button>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={handleViewAppointment}
          >
            View
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditAppointment}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentCalendarPage;
