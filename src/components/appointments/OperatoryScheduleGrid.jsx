import dayjs from "dayjs";
import { useMemo, useRef, useEffect } from "react";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import NotesIcon from "@mui/icons-material/Notes";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CallIcon from "@mui/icons-material/Call";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import EmergencyIcon from "@mui/icons-material/Emergency";

const OperatoryScheduleGrid = ({
  OPERATORY_COLUMNS,
  dayAppointments,
  viewMode = "day",
  selectedDate,
  START_HOUR,
  END_HOUR,
  SLOT_MINUTES,
  SLOT_HEIGHT,
  minutesSinceStart,
  clamp,
  getStatusColor,
  onSlotClick,
  onAppointmentClick,
}) => {
  const gridTotalMinutes = (END_HOUR - START_HOUR) * 60;
  const gridHeight = (gridTotalMinutes / SLOT_MINUTES) * SLOT_HEIGHT;

  // Calculate time axis height for week/month views
  const SLOT_HEIGHT_WEEK_MONTH = 50; // Increased from 20 to 50
  const timeAxisHeight = 48 * SLOT_HEIGHT_WEEK_MONTH; // 48 slots * 50px per slot

  // Ref for scrolling to current date in week/month view
  const currentDateColumnRef = useRef(null);

  // Auto-scroll to current date column in week/month view
  useEffect(() => {
    if (viewMode !== "day" && currentDateColumnRef.current) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        currentDateColumnRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }, 100);
    }
  }, [viewMode, selectedDate]);

  const timeLabels = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    timeLabels.push(dayjs().hour(h).minute(0).format("hA"));
  }

  // Group appointments by date for week/month views
  const appointmentsByDate = useMemo(() => {
    const grouped = {};
    dayAppointments.forEach((appt) => {
      const dateKey = dayjs(appt.date).format("YYYY-MM-DD");
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(appt);
    });
    return grouped;
  }, [dayAppointments]);

  // Generate date range for week/month views
  const dateRange = useMemo(() => {
    const dates = [];
    
    if (viewMode === "day") {
      dates.push(selectedDate.clone());
    }
    
    if (viewMode === "week") {
      const start = selectedDate.clone().startOf("week");
      for (let i = 0; i < 7; i++) {
        dates.push(start.add(i, "day"));
      }
    }
    
    if (viewMode === "month") {
      const start = selectedDate.clone().startOf("month");
      const end = selectedDate.clone().endOf("month");
      
      let current = start.clone();
      while (current.isSame(end, "day") || current.isBefore(end, "day")) {
        dates.push(current.clone());
        current = current.add(1, "day");
      }
    }
    
    return dates;
  }, [selectedDate, viewMode]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid #eef2f6",
        bgcolor: "#fff",
        overflow: "hidden"
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        {/* HEADER - Sticky Top */}
        {viewMode === "day" ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `80px repeat(${OPERATORY_COLUMNS.length},1fr)`,
              borderBottom: "2px solid #eef2f6",
              bgcolor: "#f8fafc",
              minWidth: 1800,
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}
          >
            <Box sx={{ p: 1.5, borderRight: "1px solid #eef2f6", position: 'sticky', left: 0, bgcolor: '#f8fafc', zIndex: 11 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                Time
              </Typography>
            </Box>
            
            {OPERATORY_COLUMNS.map((col) => (
              <Box 
                key={col.id} 
                sx={{ 
                  p: 1.5,
                  borderLeft: "1px solid #eef2f6",
                  borderBottom: `3px solid ${col.color}20`,
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                  {col.label}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `80px repeat(${dateRange.length},1fr)`,
              borderBottom: "2px solid #eef2f6",
              bgcolor: "#f8fafc",
              minWidth: Math.max(1800, dateRange.length * 300),
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}
          >
            <Box sx={{ p: 1.5, borderRight: "1px solid #eef2f6", position: 'sticky', left: 0, bgcolor: '#f8fafc', zIndex: 11 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                Time
              </Typography>
            </Box>
            
            {dateRange.map((date) => {
              const isToday = date.isSame(dayjs(), "day");
              const isSelected = date.isSame(selectedDate, "day");
              
              return (
                <Box
                  key={date.format("YYYY-MM-DD")}
                  sx={{
                    p: 1.5,
                    borderLeft: "1px solid #eef2f6",
                    borderBottom: isSelected ? "3px solid #1976d2" : "3px solid transparent",
                    bgcolor: isToday ? "#e3f2fd" : isSelected ? "#bbdefb" : "transparent"
                  }}
                >
                  <Typography sx={{ 
                    textAlign: "center", 
                    fontSize: 12,
                    fontWeight: isSelected || isToday ? 700 : 600,
                    color: isSelected || isToday ? "#1976d2" : "#64748b",
                  }}>
                    {date.format("ddd")}
                  </Typography>
                  
                  <Typography sx={{ 
                    textAlign: "center", 
                    fontWeight: 700,
                    fontSize: 16,
                    color: isSelected || isToday ? "#1976d2" : "#334155",
                    mt: 0.5
                  }}>
                    {date.format("D")}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {/* BODY GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              viewMode === "day"
                ? `80px 1fr`
                : `80px repeat(${dateRange.length},1fr)`,
            height: 640,
            minWidth: viewMode === "day" ? 1800 : Math.max(1800, dateRange.length * 300),
          }}
        >
          {/* TIME AXIS - Sticky Left Column */}
          <Box
            sx={{
              position: "sticky",
              left: 0,
              top: 0,
              zIndex: 20,
              borderRight: "1px solid #eef2f6",
              bgcolor: "#ffffff",
              height: viewMode === "day" ? gridHeight : timeAxisHeight,
            }}
          >
            {viewMode === "day" && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  height: gridHeight,
                }}
              >
                {timeLabels.map((t, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: "absolute",
                      top: (idx * 2 * SLOT_HEIGHT) - 0.5,
                      left: 0,
                      right: 0,
                      px: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>
                      {t}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            
            {viewMode !== "day" && Array.from({ length: 48 }).map((_, slotIdx) => {
              const hour = START_HOUR + Math.floor(slotIdx / 2);
              const minute = (slotIdx % 2) * 30;
              const timeLabel = dayjs().hour(hour).minute(minute).format("h:mm A");
              const showLabel = slotIdx % 2 === 0;
              
              return (
                <Box
                  key={`timeslot-${slotIdx}`}
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: slotIdx * SLOT_HEIGHT_WEEK_MONTH,
                    height: SLOT_HEIGHT_WEEK_MONTH,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: slotIdx < 47 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  {showLabel && (
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: "#94a3b8",
                      }}
                    >
                      {timeLabel}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* DAY VIEW */}
          {viewMode === "day" ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${OPERATORY_COLUMNS.length},1fr)`,
                height: gridHeight
              }}
            >
              {OPERATORY_COLUMNS.map((col) => {
                const colAppointments = dayAppointments.filter(a => a.columnId === col.id);
                
                return (
                  <Box 
                    key={col.id} 
                    sx={{ 
                      position: "relative",
                      borderLeft: "1px solid #eef2f6",
                      bgcolor: "#ffffff",
                    }}
                  >
                    {/* Time Slots */}
                    {Array.from({
                      length: gridTotalMinutes / SLOT_MINUTES,
                    }).map((_, i) => (
                      <Box
                        key={`${col.id}-slot-${i}`}
                        onClick={() =>
                          onSlotClick && onSlotClick(col.id, i * SLOT_MINUTES)
                        }
                        sx={{
                          height: SLOT_HEIGHT,
                          borderBottom: "1px solid #f1f5f9",
                          cursor: "pointer",
                          transition: "background-color 0.1s",
                          "&:hover": {
                            bgcolor: "#f0f9ff",
                          },
                        }}
                      />
                    ))}

                    {/* Appointments */}
                    {colAppointments.map((a) => {
                      const startMin = minutesSinceStart(a.start);
                      const endMin = minutesSinceStart(a.end);
                      const duration = endMin - startMin;
                      const isShortAppointment = duration <= 30;
                      
                      const topPx = (clamp(startMin, 0, gridTotalMinutes) / SLOT_MINUTES) * SLOT_HEIGHT;
                      const heightPx = ((clamp(endMin, 0, gridTotalMinutes) - clamp(startMin, 0, gridTotalMinutes)) / SLOT_MINUTES) * SLOT_HEIGHT;
                      
                      const minCardHeight = duration <= 15 ? 72 : duration <= 30 ? 80 : 68;
                      const finalHeight = Math.max(minCardHeight, heightPx);
                      
                      const statusColor = getStatusColor ? getStatusColor(a.status, a.color) : a.color;
                      
                      return (
                        <Paper
                          key={a.id}
                          elevation={2}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick && onAppointmentClick(a);
                          }}
                          sx={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: topPx + 2,
                            height: finalHeight - 4,
                            borderRadius: 0,
                            bgcolor: "#ffffff",
                            color: "#000000",
                            p: 1,
                            cursor: "pointer",
                            transition: "transform 0.1s, box-shadow 0.1s",
                            overflow: "hidden",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            },
                            display: "flex",
                            flexDirection: "row",
                            gap: 0.75,
                            border: "none",
                          }}
                        >
                          {/* Left Column - All Content */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* Header with Patient Name and Time */}
                            <Box sx={{ 
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "center", 
                              mb: 0.5,
                              pb: 0.5,
                              borderBottom: "1px solid #e0e0e0",
                            }}>
                              <Typography
                                sx={{
                                  fontSize: isShortAppointment ? 10 : 11,
                                  fontWeight: 700,
                                  lineHeight: 1.2,
                                  color: "#212121",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flex: 1,
                                  minWidth: 0,
                                }}
                              >
                                {a.patientName || "John Doe"}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                                <AccessTimeIcon sx={{ fontSize: isShortAppointment ? 9 : 11, color: "#757575" }} />
                                <Typography sx={{ fontSize: isShortAppointment ? 8 : 9, opacity: 0.9, lineHeight: 1, color: "#424242" }}>
                                  {dayjs(a.start).format("h:mm A")}
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Animated Zebra Stripe Band with Status */}
                            <Box
                              sx={{
                                position: "relative",
                                height: "16px",
                                background: `repeating-linear-gradient(
                                  90deg,
                                  ${statusColor} 0px,
                                  ${statusColor} 12px,
                                  ${statusColor} 12px,
                                  ${statusColor} 24px
                                )`,
                                animation: "slide 1s linear infinite",
                                "@keyframes slide": {
                                  "0%": { backgroundPosition: "0 0" },
                                  "100%": { backgroundPosition: "24px 0" },
                                },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: `repeating-linear-gradient(
                                    90deg,
                                    transparent 0px,
                                    transparent 12px,
                                    rgba(255, 255, 255, 0.15) 12px,
                                    rgba(255, 255, 255, 0.15) 24px
                                  )`,
                                  animation: "slide 1s linear infinite",
                                  "@keyframes slide": {
                                    "0%": { backgroundPosition: "0 0" },
                                    "100%": { backgroundPosition: "24px 0" },
                                  },
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: isShortAppointment ? 7 : 8,
                                  fontWeight: 700,
                                  letterSpacing: 0.5,
                                  textTransform: "uppercase",
                                  color: "#ffffff",
                                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                  position: "relative",
                                }}
                              >
                                {(a.status || "unconfirmed").toUpperCase()}
                              </Typography>
                            </Box>
                            
                            {/* Disease/Procedure Names with Status Indicators */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                              <Typography
                                sx={{
                                  fontSize: isShortAppointment ? 9 : 10,
                                  lineHeight: 1.2,
                                  color: "#64748b",
                                  textTransform: "lowercase",
                                  flex: 1,
                                  minWidth: 0,
                                }}
                              >
                                {a.procedures || a.diseases || "hygiene, periodic ex, fl"}
                              </Typography>
                              
                              {/* Status & Action Indicators */}
                              <Box sx={{ display: "flex", gap: 0, alignItems: "center", flexShrink: 0 }}>
                                {/* Status Indicator (Solid Circle) */}
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    bgcolor: statusColor,
                                    flexShrink: 0,
                                    mr: 0.3,
                                  }}
                                />
                                
                                {/* Document/Note Icon */}
                                <IconButton size="small" sx={{ p: 0.2, minWidth: 20, mx: 0 }}>
                                  <EventNoteIcon sx={{ fontSize: isShortAppointment ? 12 : 14, color: "#757575" }} />
                                </IconButton>
                                
                                {/* Dollar Sign Icon (Financial Status) */}
                                <IconButton size="small" sx={{ p: 0.2, minWidth: 20, mx: 0 }}>
                                  <AttachMoneyIcon sx={{ fontSize: isShortAppointment ? 12 : 14, color: "#4caf50" }} />
                                </IconButton>
                                
                                {/* Tx Icon (Treatment Plan) */}
                                <Box 
                                  sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    minWidth: 20,
                                    cursor: "pointer",
                                    "&:hover": {
                                      transform: "scale(1.1)",
                                    },
                                    transition: "transform 0.2s",
                                  }}
                                >
                                  <Typography sx={{ 
                                    fontSize: isShortAppointment ? 9 : 10, 
                                    fontWeight: 700,
                                    color: "#1976d2",
                                    lineHeight: 1,
                                  }}>
                                    Tx
                                  </Typography>
                                </Box>
                                
                                {/* Tooth Outline Icon (Charting) - Using Teeth Emoji */}
                                <Box 
                                  sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    minWidth: 20,
                                    cursor: "pointer",
                                    "&:hover": {
                                      transform: "scale(1.1)",
                                    },
                                    transition: "transform 0.2s",
                                  }}
                                >
                                  <Typography sx={{ fontSize: isShortAppointment ? 12 : 14 }}>
                                    🦷
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            
                            {/* Appointment Status Tags */}
                            <Box sx={{ display: "flex", gap: 0.3, mt: 0.3, flexWrap: "wrap", alignItems: "center" }}>
                              {/* EXM / Xray Tag */}
                              <Box
                                sx={{
                                  px: 0.5,
                                  py: 0.1,
                                  bgcolor: "#fff3e0",
                                  borderRadius: "2px",
                                  border: "1px solid #ffe0b2",
                                }}
                              >
                                <Typography sx={{ fontSize: isShortAppointment ? 7 : 8, fontWeight: 600, color: "#e65100", lineHeight: 1 }}>
                                  EXM
                                </Typography>
                              </Box>
                              
                              {/* HYG / DR Tag */}
                              <Box
                                sx={{
                                  px: 0.5,
                                  py: 0.1,
                                  bgcolor: "#e3f2fd",
                                  borderRadius: "2px",
                                  border: "1px solid #bbdefb",
                                }}
                              >
                                <Typography sx={{ fontSize: isShortAppointment ? 7 : 8, fontWeight: 600, color: "#1565c0", lineHeight: 1 }}>
                                  HYG
                                </Typography>
                              </Box>
                              
                              {/* ASAP Tag */}
                              <Box
                                sx={{
                                  px: 0.5,
                                  py: 0.1,
                                  bgcolor: "#ffebee",
                                  borderRadius: "2px",
                                  border: "1px solid #ffcdd2",
                                }}
                              >
                                <Typography sx={{ fontSize: isShortAppointment ? 7 : 8, fontWeight: 700, color: "#c62828", lineHeight: 1 }}>
                                  ASAP
                                </Typography>
                              </Box>
                              
                              {/* PRE Tag (Pre-authorization) */}
                              <Box
                                sx={{
                                  px: 0.5,
                                  py: 0.1,
                                  bgcolor: "#f3e5f5",
                                  borderRadius: "2px",
                                  border: "1px solid #e1bee7",
                                }}
                              >
                                <Typography sx={{ fontSize: isShortAppointment ? 7 : 8, fontWeight: 600, color: "#6a1b9a", lineHeight: 1 }}>
                                  PRE
                                </Typography>
                              </Box>
                            </Box>
                            
                            {/* Emergency Icon Row */}
                            <Box sx={{ display: "flex", mt: 0.5, justifyContent: "flex-end" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  px: 0.5,
                                  py: 0.2,
                                  bgcolor: "#e0f2f1",
                                  borderRadius: "4px",
                                  border: "1px solid #b2dfdb",
                                }}
                              >
                                <EmergencyIcon sx={{ fontSize: 16, color: "#00695c" }} />
                              </Box>
                            </Box>
                            
                            {a.note && (
                              <Typography
                                sx={{
                                  mt: 0.2,
                                  fontSize: isShortAppointment ? 8 : 9,
                                  color: "#757575",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.3,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <EventNoteIcon sx={{ fontSize: isShortAppointment ? 8 : 9 }} />
                                {a.note}
                              </Typography>
                            )}
                          </Box>

                          {/* Right Column - Action Icons */}
                          <Box sx={{ 
                            display: "flex", 
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            pt: 0.5,
                            gap: 0.25,
                            width: 36,
                            flexShrink: 0,
                            bgcolor: "#f5f5f5",
                            borderLeft: "1px solid #e0e0e0",
                          }}>
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              sx={{ 
                                p: 0.5, 
                                minWidth: 32,
                                height: 32,
                                bgcolor: "transparent",
                                borderRadius: 1.5,
                                color: "#1976d2",
                                "&:hover": { 
                                  bgcolor: "rgba(25, 118, 210, 0.08)",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s",
                              }}
                            >
                              <CallIcon sx={{ fontSize: isShortAppointment ? 14 : 16 }} />
                            </IconButton>
                            
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              sx={{ 
                                p: 0.5, 
                                minWidth: 32,
                                height: 32,
                                bgcolor: "transparent",
                                borderRadius: 1.5,
                                color: "#4a6da7",
                                "&:hover": { 
                                  bgcolor: "rgba(74, 109, 167, 0.08)",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s",
                              }}
                            >
                              <ScreenShareIcon sx={{ fontSize: isShortAppointment ? 14 : 16 }} />
                            </IconButton>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          ) : (
            /* WEEK / MONTH VIEW */
            <Box
              sx={{
                position: "relative",
                height: timeAxisHeight,
                gridColumn: "2 / -1"
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${dateRange.length},1fr)`,
                  height: "100%"
                }}
              >
                {dateRange.map((date) => {
                  const dateStr = date.format("YYYY-MM-DD");
                  const dateAppointments = appointmentsByDate[dateStr] || [];
                  const isToday = date.isSame(dayjs(), "day");
                  
                  return (
                    <Box
                      key={dateStr}
                      ref={date.isSame(dayjs(), "day") ? currentDateColumnRef : null}
                      sx={{
                        position: "relative",
                        borderLeft: "1px solid #eef2f6",
                        bgcolor: isToday ? "#f5f9ff" : "#ffffff",
                        height: "100%",
                      }}
                    >
                      {/* Background Grid Lines */}
                      {Array.from({ length: 48 }).map((_, i) => (
                        <Box
                          key={`${dateStr}-slot-${i}`}
                          sx={{
                            position: "absolute",
                            top: i * SLOT_HEIGHT_WEEK_MONTH,
                            height: SLOT_HEIGHT_WEEK_MONTH,
                            left: 0,
                            right: 0,
                            borderBottom: i < 47 ? "1px solid #f1f5f9" : "none",
                            pointerEvents: "none"
                          }}
                        />
                      ))}
                      
                      {/* Appointments */}
                      {dateAppointments.map((a) => {
                        const startMin = minutesSinceStart(a.start);
                        const endMin = minutesSinceStart(a.end);
                        const duration = endMin - startMin;
                        const slotIndex = Math.floor(startMin / 30);
                        const slotHeight = (duration / 30) * SLOT_HEIGHT_WEEK_MONTH;
                        
                        const statusColor = getStatusColor ? getStatusColor(a.status, a.color) : a.color;
                        
                        return (
                          <Paper
                            key={a.id}
                            elevation={2}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentClick && onAppointmentClick(a);
                            }}
                            sx={{
                              position: "absolute",
                              top: slotIndex * SLOT_HEIGHT_WEEK_MONTH + 2,
                              left: 0,
                              right: 0,
                              height: Math.max(68, slotHeight - 2),
                              borderRadius: 0,
                              bgcolor: "#ffffff",
                              color: "#000000",
                              p: 0.75,
                              cursor: "pointer",
                              transition: "transform 0.1s, box-shadow 0.1s",
                              overflow: "hidden",
                              border: "none",
                              zIndex: 1,
                              "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              },
                              display: "flex",
                              flexDirection: "row",
                              gap: 0.5,
                            }}
                          >
                            {/* Left Column - All Content */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              {/* Header with Patient Name and Time */}
                              <Box sx={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center", 
                                mb: 0.5,
                                pb: 0.3,
                                borderBottom: "1px solid #e0e0e0",
                              }}>
                                <Typography
                                  sx={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                    color: "#212121",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  {a.patientName || "Jane Smith"}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                                  <AccessTimeIcon sx={{ fontSize: 10, color: "#757575" }} />
                                  <Typography sx={{ fontSize: 8.5, opacity: 0.9, lineHeight: 1, color: "#424242" }}>
                                    {dayjs(a.start).format("h:mm A")}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              {/* Animated Zebra Stripe Band with Status */}
                              <Box
                                sx={{
                                  position: "relative",
                                  height: "16px",
                                  background: `repeating-linear-gradient(
                                    90deg,
                                    ${statusColor} 0px,
                                    ${statusColor} 12px,
                                    ${statusColor} 12px,
                                    ${statusColor} 24px
                                  )`,
                                  animation: "slide 1s linear infinite",
                                  "@keyframes slide": {
                                    "0%": {
                                      backgroundPosition: "0 0",
                                    },
                                    "100%": {
                                      backgroundPosition: "24px 0",
                                    },
                                  },
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `repeating-linear-gradient(
                                      90deg,
                                      transparent 0px,
                                      transparent 12px,
                                      rgba(255, 255, 255, 0.15) 12px,
                                      rgba(255, 255, 255, 0.15) 24px
                                    )`,
                                    animation: "slide 1s linear infinite",
                                    "@keyframes slide": {
                                      "0%": {
                                        backgroundPosition: "0 0",
                                      },
                                      "100%": {
                                        backgroundPosition: "24px 0",
                                      },
                                    },
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: 7,
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                    textTransform: "uppercase",
                                    color: "#ffffff",
                                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                    position: "relative",
                                  }}
                                >
                                  {(a.status || "unconfirmed").toUpperCase()}
                                </Typography>
                              </Box>
                              
                              {/* Disease/Procedure Names with Status Indicators */}
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                                <Typography
                                  sx={{
                                    fontSize: 8,
                                    lineHeight: 1.2,
                                    color: "#64748b",
                                    textTransform: "lowercase",
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  {a.procedures || a.diseases || "hygiene, periodic ex, fl"}
                                </Typography>
                                
                                {/* Status & Action Indicators */}
                                <Box sx={{ display: "flex", gap: 0, alignItems: "center", flexShrink: 0 }}>
                                  {/* Status Indicator (Solid Circle) */}
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: "50%",
                                      bgcolor: statusColor,
                                      flexShrink: 0,
                                      mr: 0.3,
                                    }}
                                  />
                                  
                                  {/* Document/Note Icon */}
                                  <IconButton size="small" sx={{ p: 0.15, minWidth: 18, mx: 0 }}>
                                    <EventNoteIcon sx={{ fontSize: 12, color: "#757575" }} />
                                  </IconButton>
                                  
                                  {/* Dollar Sign Icon (Financial Status) */}
                                  <IconButton size="small" sx={{ p: 0.15, minWidth: 18, mx: 0 }}>
                                    <AttachMoneyIcon sx={{ fontSize: 12, color: "#4caf50" }} />
                                  </IconButton>
                                  
                                  {/* Tx Icon (Treatment Plan) */}
                                  <Box 
                                    sx={{ 
                                      display: "flex", 
                                      alignItems: "center", 
                                      justifyContent: "center",
                                      minWidth: 18,
                                      cursor: "pointer",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                      transition: "transform 0.2s",
                                    }}
                                  >
                                    <Typography sx={{ 
                                      fontSize: 8, 
                                      fontWeight: 700,
                                      color: "#1976d2",
                                      lineHeight: 1,
                                    }}>
                                      Tx
                                    </Typography>
                                  </Box>
                                  
                                  {/* Tooth Outline Icon (Charting) - Using Teeth Emoji */}
                                  <Box 
                                    sx={{ 
                                      display: "flex", 
                                      alignItems: "center", 
                                      justifyContent: "center",
                                      minWidth: 18,
                                      cursor: "pointer",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                      transition: "transform 0.2s",
                                    }}
                                  >
                                    <Typography sx={{ fontSize: 12 }}>
                                      🦷
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              
                              {/* Appointment Status Tags */}
                              <Box sx={{ display: "flex", gap: 0.2, mt: 0.2, flexWrap: "wrap", alignItems: "center" }}>
                                {/* EXM / Xray Tag */}
                                <Box
                                  sx={{
                                    px: 0.4,
                                    py: 0.1,
                                    bgcolor: "#fff3e0",
                                    borderRadius: "2px",
                                    border: "1px solid #ffe0b2",
                                  }}
                                >
                                  <Typography sx={{ fontSize: 6.5, fontWeight: 600, color: "#e65100", lineHeight: 1 }}>
                                    EXM
                                  </Typography>
                                </Box>
                                
                                {/* HYG / DR Tag */}
                                <Box
                                  sx={{
                                    px: 0.4,
                                    py: 0.1,
                                    bgcolor: "#e3f2fd",
                                    borderRadius: "2px",
                                    border: "1px solid #bbdefb",
                                  }}
                                >
                                  <Typography sx={{ fontSize: 6.5, fontWeight: 600, color: "#1565c0", lineHeight: 1 }}>
                                    HYG
                                  </Typography>
                                </Box>
                                
                                {/* ASAP Tag */}
                                <Box
                                  sx={{
                                    px: 0.4,
                                    py: 0.1,
                                    bgcolor: "#ffebee",
                                    borderRadius: "2px",
                                    border: "1px solid #ffcdd2",
                                  }}
                                >
                                  <Typography sx={{ fontSize: 6.5, fontWeight: 700, color: "#c62828", lineHeight: 1 }}>
                                    ASAP
                                  </Typography>
                                </Box>
                                
                                {/* PRE Tag (Pre-authorization) */}
                                <Box
                                  sx={{
                                    px: 0.4,
                                    py: 0.1,
                                    bgcolor: "#f3e5f5",
                                    borderRadius: "2px",
                                    border: "1px solid #e1bee7",
                                  }}
                                >
                                  <Typography sx={{ fontSize: 6.5, fontWeight: 600, color: "#6a1b9a", lineHeight: 1 }}>
                                    PRE
                                  </Typography>
                                </Box>
                                
                                {/* Gift Icon (New Patient Special) */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 14 }}>
                                  <Typography sx={{ fontSize: 10 }}>
                                    🎁
                                  </Typography>
                                </Box>
                                
                                {/* Botox/Syringe Icon */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 14 }}>
                                  <Typography sx={{ fontSize: 10 }}>
                                    💉
                                  </Typography>
                                </Box>
                              </Box>
                              
                              {/* Emergency Icon Row */}
                              <Box sx={{ display: "flex", mt: 0.5, justifyContent: "flex-end" }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    px: 0.4,
                                    py: 0.15,
                                    bgcolor: "#e0f2f1",
                                    borderRadius: "4px",
                                    border: "1px solid #b2dfdb",
                                  }}
                                >
                                  <EmergencyIcon sx={{ fontSize: 14, color: "#00695c" }} />
                                </Box>
                              </Box>
                              
                              {/* Note (if exists) */}
                              {a.note && (
                                <Typography
                                  sx={{
                                    mt: 0.2,
                                    fontSize: 8,
                                    color: "#757575",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <EventNoteIcon sx={{ fontSize: 8 }} />
                                  {a.note}
                                </Typography>
                              )}
                            </Box>

                            {/* Right Column - Action Icons */}
                            <Box sx={{ 
                              display: "flex", 
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              pt: 0.25,
                              gap: 0.2,
                              width: 32,
                              flexShrink: 0,
                              bgcolor: "#f5f5f5",
                              borderLeft: "1px solid #e0e0e0",
                            }}>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                sx={{ 
                                  p: 0.4, 
                                  minWidth: 28,
                                  height: 28,
                                  bgcolor: "transparent",
                                  borderRadius: 1.25,
                                  color: "#1976d2",
                                  "&:hover": { 
                                    bgcolor: "rgba(25, 118, 210, 0.08)",
                                    transform: "scale(1.1)",
                                  },
                                  transition: "all 0.2s",
                                }}
                              >
                                <CallIcon sx={{ fontSize: 12 }} />
                              </IconButton>
                              
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                sx={{ 
                                  p: 0.4, 
                                  minWidth: 28,
                                  height: 28,
                                  bgcolor: "transparent",
                                  borderRadius: 1.25,
                                  color: "#4a6da7",
                                  "&:hover": { 
                                    bgcolor: "rgba(74, 109, 167, 0.08)",
                                    transform: "scale(1.1)",
                                  },
                                  transition: "all 0.2s",
                                }}
                              >
                                <ScreenShareIcon sx={{ fontSize: 12 }} />
                              </IconButton>
                            </Box>
                          </Paper>
                        );
                      })}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default OperatoryScheduleGrid;