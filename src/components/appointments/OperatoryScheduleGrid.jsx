import dayjs from "dayjs";
import { useMemo, useRef, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import AppointmentCard from "./AppointmentCard";

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
  newlyCreatedAppointmentId,
  privacyMode = false,
  // Dynamic configuration for breaks (can be loaded from API/practice settings)
  BREAK_TIMES = [
    {
      label: "Lunch",
      startTime: "12:00", 
      endTime: "12:30",  
      color: "#b0cee0ff", 
      hoverColor: "#5e8298ff", 
      textColor: "#fffbf8ff",  
    }
  ],
}) => {
  const gridTotalMinutes = (END_HOUR - START_HOUR) * 60;
  const gridHeight = (gridTotalMinutes / SLOT_MINUTES) * SLOT_HEIGHT;

  // Helper function to convert time string (HH:mm) to minutes from midnight
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to get break times for a specific operatory
  const getBreakTimesForOperatory = (columnId) => {
    // Find the operatory column configuration
    const column = OPERATORY_COLUMNS.find(col => col.id === columnId);
    
    // Priority: operatory.breakTimes > global BREAK_TIMES > empty array
    if (column?.breakTimes && Array.isArray(column.breakTimes) && column.breakTimes.length > 0) {
      return column.breakTimes;
    }
    return BREAK_TIMES;
  };

  // Helper function to check if a slot falls within any break period
  const getBreakForSlot = (slotMinutes, breakTimes) => {
    for (const breakTime of breakTimes) {
      const startMin = timeToMinutes(breakTime.startTime);
      const endMin = timeToMinutes(breakTime.endTime);
      if (slotMinutes >= startMin && slotMinutes < endMin) {
        return breakTime;
      }
    }
    return null;
  };

  const SLOT_HEIGHT_WEEK_MONTH = 50;
  const timeAxisHeight = 48 * SLOT_HEIGHT_WEEK_MONTH;

  const currentDateColumnRef = useRef(null);
  const newAppointmentRef = useRef(null);
  const gridContainerRef = useRef(null);
  
  const newAppointment = useMemo(() => {
    if (!newlyCreatedAppointmentId) return null;
    return dayAppointments.find(appt => appt.id === newlyCreatedAppointmentId);
  }, [newlyCreatedAppointmentId, dayAppointments]);

  // Auto-scroll effects (unchanged)
  useEffect(() => {
    if (viewMode !== "day" && currentDateColumnRef.current) {
      setTimeout(() => {
        currentDateColumnRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }, 100);
    }
  }, [viewMode, selectedDate]);
  
  useEffect(() => {
    if (!newlyCreatedAppointmentId || !newAppointmentRef.current || !newAppointment) return;
    
    console.log('Auto-scrolling to new appointment:', newlyCreatedAppointmentId);
    console.log('New appointment data:', newAppointment);
    
    setTimeout(() => {
      const appointmentElement = newAppointmentRef.current;
      if (!appointmentElement) {
        console.warn('Appointment element not found');
        return;
      }
      
      const cardElement = appointmentElement.querySelector('.MuiPaper-root') || 
                         appointmentElement.firstChild?.querySelector?.('.MuiPaper-root') ||
                         appointmentElement.firstChild;
      
      if (!cardElement) {
        console.warn('Card element not found');
        return;
      }
      
      const startMin = minutesSinceStart(newAppointment.start);
      const endMin = minutesSinceStart(newAppointment.end);
      const duration = endMin - startMin;
      
      const isDayView = viewMode === 'day';
      const slotHeight = isDayView ? SLOT_HEIGHT : SLOT_HEIGHT_WEEK_MONTH;
      const currentGridTotalMinutes = isDayView ? gridTotalMinutes : 48 * 30;
      
      const clampedStartMin = clamp(startMin, 0, currentGridTotalMinutes);
      const appointmentTop = (clampedStartMin / SLOT_MINUTES) * slotHeight;
      
      const minCardHeight = duration <= 15 ? 72 : duration <= 30 ? 80 : 68;
      const clampedEndMin = clamp(endMin, 0, currentGridTotalMinutes);
      const heightPx = ((clampedEndMin - clampedStartMin) / SLOT_MINUTES) * slotHeight;
      const cardHeight = Math.max(minCardHeight, heightPx);
      
      let scrollContainer = null;
      
      // Find the scroll container
      let parent = appointmentElement.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (style.overflow === 'auto' || style.overflowY === 'auto') {
          scrollContainer = parent;
          break;
        }
        parent = parent.parentElement;
      }
      
      if (!scrollContainer && gridContainerRef.current) {
        const parentBox = gridContainerRef.current.parentElement;
        if (parentBox) {
          scrollContainer = parentBox;
        }
      }
      
      if (!scrollContainer) {
        const boxes = document.querySelectorAll('.MuiBox-root');
        for (const box of boxes) {
          if (box.scrollHeight > box.clientHeight) {
            scrollContainer = box;
            break;
          }
        }
      }
      
      if (!scrollContainer) {
        console.warn('Scroll container not found');
        return;
      }
      
      console.log('Found scroll container:', scrollContainer);
      console.log('Scroll container client dimensions:', scrollContainer.clientWidth, 'x', scrollContainer.clientHeight);
      console.log('Scroll container scroll dimensions:', scrollContainer.scrollWidth, 'x', scrollContainer.scrollHeight);
      console.log('Current scroll position:', scrollContainer.scrollLeft, ',', scrollContainer.scrollTop);
      
      const containerHeight = scrollContainer.clientHeight;
      const scrollTop = appointmentTop - (containerHeight / 2) + (cardHeight / 2);
      
      // For day view, also handle horizontal scrolling
      if (isDayView) {
        // Get the column index from the appointment's columnId
        const columnIndex = OPERATORY_COLUMNS.findIndex(col => col.id === newAppointment.columnId);
        console.log('Column ID:', newAppointment.columnId, 'Column Index:', columnIndex);
        
        if (columnIndex === -1) {
          console.warn('Column not found for appointment. Available columns:', OPERATORY_COLUMNS);
          return;
        }
        
        // Calculate the target scroll position based on column index
        const columnWidth = 360; // Each operatory column is 360px wide
        const timeAxisWidth = 80; // Time axis on the left is 80px
        
        // Calculate the center of the target column
        const columnCenterX = (columnIndex * columnWidth) + (columnWidth / 2);
        
        // Calculate where to scroll so the column is centered in the viewport
        const availableWidth = scrollContainer.clientWidth - timeAxisWidth;
        const targetScrollLeft = columnCenterX - (availableWidth / 2);
        
        console.log('Column center X:', columnCenterX);
        console.log('Available width:', availableWidth);
        console.log('Target scroll left:', targetScrollLeft);
        
        scrollContainer.scrollTo({
          top: Math.max(0, scrollTop),
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth'
        });
      } else {
        // For week/month view, only vertical scroll
        scrollContainer.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }
      
      console.log('Auto-scroll completed');
      console.log('Final scroll position:', scrollContainer.scrollLeft, ',', scrollContainer.scrollTop);
      
      // Clear the newly created appointment ID after scrolling completes
      setTimeout(() => {
        if (newlyCreatedAppointmentId) {
          // This will be handled by the parent component
          console.log('Clearing newlyCreatedAppointmentId');
        }
      }, 2000);
    }, 1000); // Increased delay further to ensure DOM is fully rendered
  }, [newlyCreatedAppointmentId, viewMode, newAppointment, minutesSinceStart, SLOT_HEIGHT, SLOT_MINUTES, gridTotalMinutes, clamp, OPERATORY_COLUMNS]);

  const timeLabels = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    timeLabels.push(dayjs().hour(h).minute(0).format("hA"));
  }

  const appointmentsByDate = useMemo(() => {
    const grouped = {};
    dayAppointments.forEach((appt) => {
      const dateKey = dayjs(appt.date).format("YYYY-MM-DD");
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(appt);
    });
    return grouped;
  }, [dayAppointments]);

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
      const startOfMonth = selectedDate.clone().startOf("month");
      const endOfMonth = selectedDate.clone().endOf("month");
      const start = startOfMonth.startOf("week");
      const end = endOfMonth.endOf("week");
      
      let current = start.clone();
      while (current.isSame(end, "day") || current.isBefore(end, "day")) {
        dates.push(current.clone());
        current = current.add(1, "day");
      }
    }
    
    return dates;
  }, [selectedDate, viewMode]);

  // DAY MODE - Unified scroll container
  if (viewMode === "day") {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid #eef2f6",
          bgcolor: "#fff",
          overflow: "hidden",
          width: "100%"
        }}
        ref={gridContainerRef}
      >
        {/* Single scrollable container for both header and body */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          height: 640,
          overflow: "auto"
        }}>
          {/* HEADER - Sticky at top */}
          <Box
            sx={{
              display: "flex",
              borderBottom: "2px solid #eef2f6",
              bgcolor: "#f8fafc",
              position: "sticky",
              top: 0,
              zIndex: 100,
              minWidth: `calc(80px + ${OPERATORY_COLUMNS.length} * 360px)`
            }}
          >
            <Box 
              sx={{ 
                p: 1.5, 
                borderRight: "1px solid #eef2f6", 
                bgcolor: '#f8fafc',
                width: "80px",
                flexShrink: 0,
                position: "sticky",
                left: 0,
                zIndex: 101
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                Time
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", flex: 1 }}>
              {OPERATORY_COLUMNS.map((col) => (
                <Box 
                  key={col.id} 
                  sx={{ 
                    p: 1.5,
                    borderLeft: "1px solid #eef2f6",
                    borderBottom: `3px solid ${col.color}20`,
                    minWidth: "360px",
                    flexShrink: 0
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    {col.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* BODY - Scrolls with header */}
          <Box sx={{ 
            display: "flex",
            height: gridHeight,
            minWidth: `calc(80px + ${OPERATORY_COLUMNS.length} * 360px)`
          }}>
            <Box
              sx={{
                position: "sticky",
                left: 0,
                zIndex: 20,
                borderRight: "1px solid #eef2f6",
                bgcolor: "#ffffff",
                height: gridHeight,
                flexShrink: 0,
                width: "80px"
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
            
            <Box sx={{ 
              display: "grid",
              gridTemplateColumns: `repeat(${OPERATORY_COLUMNS.length}, minmax(360px, 1fr))`,
              height: gridHeight
            }}>
              {OPERATORY_COLUMNS.map((col) => {
                const colAppointments = dayAppointments.filter(a => a.columnId === col.id);
                const operatoryBreakTimes = getBreakTimesForOperatory(col.id);
                
                return (
                  <Box 
                    key={col.id} 
                    sx={{ 
                      position: "relative",
                      borderLeft: "1px solid #eef2f6",
                      bgcolor: "#ffffff",
                    }}
                  >
                    {Array.from({ length: gridTotalMinutes / SLOT_MINUTES }).map((_, i) => {
                      const slotStartMinutes = i * SLOT_MINUTES;
                      const breakInfo = getBreakForSlot(slotStartMinutes, operatoryBreakTimes);
                      const isBreak = breakInfo !== null;
                      
                      return (
                        <Box
                          key={`${col.id}-slot-${i}`}
                          onClick={() => onSlotClick && onSlotClick(col.id, i * SLOT_MINUTES)}
                          sx={{
                            height: SLOT_HEIGHT,
                            borderBottom: "1px solid #f1f5f9",
                            cursor: isBreak ? "not-allowed" : "pointer",
                            transition: "background-color 0.1s",
                            backgroundColor: isBreak ? breakInfo.color : undefined,
                            backgroundImage: isBreak 
                              ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)'
                              : undefined,
                            "&:hover": { 
                              backgroundColor: isBreak ? breakInfo.hoverColor : "#f0f9ff" 
                            },
                          }}
                        >
                          {isBreak && slotStartMinutes === timeToMinutes(breakInfo.startTime) && (
                            <Typography
                              sx={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: breakInfo.textColor,
                                textAlign: "center",
                                py: 0.5,
                              }}
                            >
                              {breakInfo.icon} {breakInfo.label}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}

                    {colAppointments.map((a) => {
                      const startMin = minutesSinceStart(a.start);
                      const endMin = minutesSinceStart(a.end);
                      const duration = endMin - startMin;
                      const isShortAppointment = duration <= 30;
                      const isUltraCompact = duration <= 60;
                      const isCompactAppointment = duration <= 80;
                      
                      const topPx = (clamp(startMin, 0, gridTotalMinutes) / SLOT_MINUTES) * SLOT_HEIGHT;
                      const heightPx = ((clamp(endMin, 0, gridTotalMinutes) - clamp(startMin, 0, gridTotalMinutes)) / SLOT_MINUTES) * SLOT_HEIGHT;
                      const minCardHeight = duration <= 15 ? 72 : duration <= 30 ? 80 : 68;
                      const finalHeight = Math.max(minCardHeight, heightPx);
                      
                      const statusColor = getStatusColor ? getStatusColor(a.status, a.color) : a.color;
                      const isNewAppointment = a.id === newlyCreatedAppointmentId;
                      
                      return (
                        <div key={a.id} ref={isNewAppointment ? newAppointmentRef : null}>
                          <AppointmentCard
                            appointment={a}
                            viewMode="day"
                            isShortAppointment={isShortAppointment}
                            isUltraCompact={isUltraCompact}
                            isCompactAppointment={isCompactAppointment}
                            statusColor={statusColor}
                            topPx={topPx}
                            heightPx={heightPx}
                            finalHeight={finalHeight}
                            minutesSinceStart={minutesSinceStart}
                            onAppointmentClick={onAppointmentClick}
                            isNewAppointment={isNewAppointment}
                            privacyMode={privacyMode}
                          />
                        </div>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  }

  if (viewMode === "month") {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid #eef2f6",
          bgcolor: "#fff",
          overflow: "hidden",
          width: "100%",
          display: "flex", 
          flexDirection: "column",
          height: 640,
        }}
      >
        {/* Day Headers */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)",
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #eef2f6"
        }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <Box key={day} sx={{ p: 1, textAlign: "center", borderRight: "1px solid #eef2f6" }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>{day}</Typography>
            </Box>
          ))}
        </Box>

        {/* Calendar Grid */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)",
          flex: 1,
          overflowY: "auto",
          bgcolor: "#e2e8f0" // Grid line color
        }}>
          {dateRange.map((date) => {
            const dateStr = date.format("YYYY-MM-DD");
            const dateAppointments = appointmentsByDate[dateStr] || [];
            const isToday = date.isSame(dayjs(), "day");
            const isCurrentMonth = date.isSame(selectedDate, "month");

            return (
              <Box
                key={dateStr}
                sx={{
                  bgcolor: isCurrentMonth ? "#ffffff" : "#f1f5f9",
                  minHeight: "120px",
                  p: 0.5,
                  border: "0.5px solid #cbd5e1",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  overflow: "hidden"
                }}
              >
                <Typography sx={{ 
                  fontSize: 12, 
                  fontWeight: 700, 
                  color: isCurrentMonth ? (isToday ? "#1976d2" : "#334155") : "#94a3b8",
                  mb: 0.5,
                  textAlign: "right",
                  px: 0.5
                }}>
                  {date.date()}
                </Typography>
                <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 0.25 }}>
                  {dateAppointments.map((a) => (
                    <Box 
                      key={a.id} 
                      onClick={() => onAppointmentClick && onAppointmentClick(a)}
                      sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 0.5, 
                        px: 1, 
                        py: 0.2, 
                        bgcolor: "transparent",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#f1f5f9" }
                      }}
                    >
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#1976d2", flexShrink: 0 }} />
                      <Typography sx={{ fontSize: "10px", color: "#64748b", fontWeight: 500, whiteSpace: "nowrap" }}>
                        {dayjs(a.start).format("h:mma")}
                      </Typography>
                      <Typography sx={{ fontSize: "11px", color: "#1e293b", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {privacyMode 
                          ? (a.patientName?.includes('(') 
                              ? `•••••••• ${a.patientName.substring(a.patientName.indexOf('('))}`
                              : "••••••••")
                          : a.patientName}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>
    );
  }

  // WEEK MODE - Unified scroll container (matching day view structure)
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid #eef2f6",
        bgcolor: "#fff",
        overflow: "hidden",
        width: "100%"
      }}
      ref={gridContainerRef}
    >
      {/* Single scrollable container for both header and body */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        height: 640,
        overflowX: "auto",
        overflowY: "auto"
      }}>
        {/* HEADER - Sticky at top */}
        <Box
          sx={{
            display: "flex",
            borderBottom: "2px solid #eef2f6",
            bgcolor: "#f8fafc",
            position: "sticky",
            top: 0,
            zIndex: 999,
            minWidth: `calc(80px + ${dateRange.length * 200}px)`
          }}
        >
          <Box 
            sx={{ 
              p: 1.5, 
              borderRight: "1px solid #eef2f6", 
              bgcolor: '#f8fafc',
              width: "80px",
              flexShrink: 0,
              position: "sticky",
              left: 0,
              zIndex: 101
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
              Time
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", flex: 1 }}>
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
                    bgcolor: isToday ? "#e3f2fd" : isSelected ? "#bbdefb" : "transparent",
                    minWidth: "200px",
                    flexShrink: 0
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
        </Box>

        {/* BODY - Scrolls with header */}
        <Box sx={{ 
          display: "flex",
          height: timeAxisHeight,
          minWidth: `calc(80px + ${dateRange.length * 200}px)`
        }}>
          <Box
            sx={{
              position: "sticky",
              left: 0,
              zIndex: 20,
              borderRight: "1px solid #eef2f6",
              bgcolor: "#ffffff",
              height: timeAxisHeight,
              flexShrink: 0,
              width: "80px"
            }}
          >
            {Array.from({ length: 48 }).map((_, slotIdx) => {
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
                    <Typography sx={{ fontSize: 10, fontWeight: 500, color: "#94a3b8" }}>
                      {timeLabel}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
          
          <Box sx={{ display: "flex", flex: 1 }}>
            {dateRange.map((date) => {
              const dateStr = date.format("YYYY-MM-DD");
              const dateAppointments = appointmentsByDate[dateStr] || [];
              const isToday = date.isSame(dayjs(), "day");
              
              // For week/month view, use the break times from the first operatory
              // This provides a consistent reference point across all dates
              const operatoryBreakTimes = OPERATORY_COLUMNS.length > 0 
                ? getBreakTimesForOperatory(OPERATORY_COLUMNS[0].id)
                : BREAK_TIMES;
              
              return (
                <Box
                  key={dateStr}
                  ref={date.isSame(dayjs(), "day") ? currentDateColumnRef : null}
                  sx={{
                    position: "relative",
                    borderLeft: "1px solid #eef2f6",
                    bgcolor: isToday ? "#f5f9ff" : "#ffffff",
                    height: "100%",
                    minHeight: timeAxisHeight,
                    minWidth: "200px",
                    flexShrink: 0
                  }}
                >
                {Array.from({ length: 48 }).map((_, i) => {
                  const slotStartMinutes = i * 30;
                  const breakInfo = getBreakForSlot(slotStartMinutes, operatoryBreakTimes);
                  const isBreak = breakInfo !== null && breakInfo !== undefined;
                  
                  return (
                    <Box
                      key={`${dateStr}-slot-${i}`}
                      sx={{
                        position: "absolute",
                        top: i * SLOT_HEIGHT_WEEK_MONTH,
                        height: SLOT_HEIGHT_WEEK_MONTH,
                        left: 0,
                        right: 0,
                        borderBottom: i < 47 ? "1px solid #f1f5f9" : "none",
                        pointerEvents: "none",
                        backgroundColor: isBreak ? breakInfo?.color : undefined,
                        backgroundImage: isBreak 
                          ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)'
                          : undefined,
                      }}
                    >
                      {isBreak && slotStartMinutes === timeToMinutes(breakInfo.startTime) && (
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: breakInfo?.textColor || "#e65100",
                            textAlign: "center",
                            py: 0.5,
                            position: "relative",
                            zIndex: 10,
                          }}
                        >
                          {breakInfo?.icon || "🍽️"} {breakInfo?.label || "Break"}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
                
                {dateAppointments.map((a) => {
                  const startMin = minutesSinceStart(a.start);
                  const endMin = minutesSinceStart(a.end);
                  const duration = endMin - startMin;
                  const slotIndex = Math.floor(startMin / 30);
                  const slotHeight = (duration / 30) * SLOT_HEIGHT_WEEK_MONTH;
                  
                  const statusColor = getStatusColor ? getStatusColor(a.status, a.color) : a.color;
                  const isNewAppointment = a.id === newlyCreatedAppointmentId;
                  
                  return (
                    <div key={a.id} ref={isNewAppointment ? newAppointmentRef : null}>
                      <AppointmentCard
                        appointment={a}
                        viewMode={viewMode}
                        privacyMode={privacyMode}
                        isShortAppointment={false}
                        isUltraCompact={false}
                        isCompactAppointment={false}
                        statusColor={statusColor}
                        topPx={slotIndex * SLOT_HEIGHT_WEEK_MONTH}
                        heightPx={slotHeight}
                        finalHeight={Math.max(68, slotHeight)}
                        minutesSinceStart={minutesSinceStart}
                        onAppointmentClick={onAppointmentClick}
                        isNewAppointment={isNewAppointment}
                      />
                    </div>
                  );
                })}
              </Box>
            );
          })}
          </Box>
        </Box>
        </Box>
      </Paper>
  );
};

export default OperatoryScheduleGrid;