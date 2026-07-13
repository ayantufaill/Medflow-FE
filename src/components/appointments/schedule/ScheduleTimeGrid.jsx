/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import dayjs from "dayjs";
import { useDroppable } from "@dnd-kit/core";
import {
  HOURS,
  HOUR_HEIGHT,
  TIME_LABEL_WIDTH,
  COLUMN_MIN_WIDTH,
  START_HOUR,
  END_HOUR,
  STATUS_COLORS,
  formatHour,
} from "./scheduleConstants";
import AppointmentCard from "./AppointmentCard";
import {
  useScheduleState,
  useAppointmentList,
  useDropdownData,
} from "../../../hooks/redux";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight } from "../../../constants/styles";

// Total height of the scrollable grid area — never changes.
const TOTAL_HEIGHT = HOURS.length * HOUR_HEIGHT;

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Maps a raw API appointment object to the shape AppointmentCard expects.
// Returns null for appointments that fall outside the visible hour range.
const providerDisplay = (provider) => {
  if (!provider) return "";
  if (typeof provider === "string") return "";
  return (
    provider.name ||
    provider.fullName ||
    `${provider.firstName || ""} ${provider.lastName || ""}`.trim() ||
    `${provider.userId?.firstName || ""} ${provider.userId?.lastName || ""}`.trim() ||
    provider.providerName ||
    provider.providerCode ||
    ""
  );
};

const formatProcedures = (procedures, fallback = "") => {
  if (Array.isArray(procedures)) {
    return procedures
      .map((procedure) => {
        if (typeof procedure === "string") return procedure;
        return (
          procedure.treatment ||
          procedure.name ||
          procedure.code ||
          procedure.ProcCode ||
          procedure.Descript ||
          ""
        );
      })
      .filter(Boolean)
      .join(", ");
  }

  return procedures || fallback;
};

const mapApiAppointmentToGridItem = (appt, providerMap = {}) => {
  if (!appt.startTime || !appt.endTime) return null;

  const [startHour, startMinute] = appt.startTime.split(":").map(Number);
  const [endHour, endMinute] = appt.endTime.split(":").map(Number);

  // Skip appointments that start before the grid or after the last visible hour
  if (startHour < START_HOUR || startHour >= END_HOUR) return null;

  const durationMinutes =
    endHour * 60 + endMinute - (startHour * 60 + startMinute);

  // patientId may be a populated Mongoose object or a bare string ID.
  const patientObj =
    appt.patientId && typeof appt.patientId === "object"
      ? appt.patientId
      : null;
  const topLevelPatientObj =
    appt.patient && typeof appt.patient === "object" ? appt.patient : null;
  const patientData = patientObj || topLevelPatientObj;
  const patientId = patientData
    ? patientData._id || patientData.id || patientData.PatNum
    : typeof appt.patientId === "string" || typeof appt.patientId === "number" || typeof appt.patientId === "bigint"
      ? String(appt.patientId)
      : null;
  const patientName = patientObj
    ? `${patientObj.firstName || ""} ${patientObj.lastName || ""}`.trim() ||
      "Patient"
    : topLevelPatientObj
      ? `${topLevelPatientObj.firstName || ""} ${topLevelPatientObj.lastName || ""}`.trim() ||
        "Patient"
      : appt.patientName || "Patient";

  const providerObj =
    appt.providerId && typeof appt.providerId === "object"
      ? appt.providerId
      : null;
  const providerId =
    typeof appt.providerId === "object"
      ? appt.providerId._id || appt.providerId.id
      : appt.providerId;
  const mappedProvider = providerId ? providerMap[String(providerId)] : null;
  const cf = appt.customFields || {};
  const customProviderId =
    cf.providerRows?.[0]?.providerId ||
    cf.providers?.[0]?.providerId ||
    cf.providers?.[0];
  const mappedCustomProvider = customProviderId
    ? providerMap[String(customProviderId)]
    : null;
  const providerName =
    providerDisplay(providerObj) ||
    providerDisplay(mappedProvider) ||
    providerDisplay(mappedCustomProvider) ||
    appt.providerName ||
    "";

  // Convert 24-hr "09:30" → "9:30 AM" for display in the card header.
  // Safari strict parsing fix: append seconds if missing
  const safeStartTime = appt.startTime?.length === 5 ? `${appt.startTime}:00` : appt.startTime;
  const safeEndTime = appt.endTime?.length === 5 ? `${appt.endTime}:00` : appt.endTime;
  const displayTime = dayjs(`2000-01-01T${safeStartTime}`).format("h:mm A");
  const displayEndTime = dayjs(`2000-01-01T${safeEndTime}`).format("h:mm A");
  const displayDate = appt.appointmentDate
    ? dayjs(appt.appointmentDate).format("MMM D, YYYY")
    : "";

  const statusKey = (appt.status || "unconfirmed").toLowerCase();

  let procString = formatProcedures(
    appt.procedures || appt.procedureCodes,
    appt.chiefComplaint ||
      appt.appointmentTypeName ||
      appt.type ||
      "EXAM, PROPHY",
  );
  let computedPrice = appt.totalAmount || 0;

  if (
    cf.procedures &&
    Array.isArray(cf.procedures) &&
    cf.procedures.length > 0
  ) {
    procString = formatProcedures(cf.procedures);
    computedPrice = cf.procedures.reduce((sum, p) => {
      const charge = String(p.charge || "0").replace(/[^0-9.]/g, "");
      return sum + (parseFloat(charge) || 0);
    }, 0);
  }

  const tagsArray =
    Array.isArray(cf.procedureTags) && cf.procedureTags.length > 0
      ? cf.procedureTags
      : Array.isArray(appt.tags) && appt.tags.length > 0
        ? appt.tags
        : [];
  const colorTagsArray =
    Array.isArray(cf.colorTags) && cf.colorTags.length > 0
      ? cf.colorTags
      : Array.isArray(appt.colorTags) && appt.colorTags.length > 0
        ? appt.colorTags
        : [];

  const priceStr = computedPrice > 0 ? `$${computedPrice.toFixed(2)}` : "$0.00";

  return {
    id: appt._id || appt.id,
    patientId: patientId,
    patientName,
    patientNumber:
      patientData?.patientCode ||
      patientData?.patientId ||
      patientData?.chartNumber ||
      "",
    patientDob: patientData?.dateOfBirth
      ? dayjs(patientData.dateOfBirth).format("MMM D, YYYY")
      : "",
    patientPhone:
      patientData?.phonePrimary ||
      patientData?.phone ||
      patientData?.mobilePhone ||
      "",
    patientEmail: patientData?.email || "",
    time: displayTime,
    endTime: displayEndTime,
    date: displayDate,
    status: statusKey.toUpperCase(),
    startHour,
    startMinute,
    durationMinutes,
    roomId: appt.roomId || null,
    provider: providerName,
    headerColor: STATUS_COLORS[statusKey] || "#2262ef",
    procedures: procString,
    description: appt.notes || appt.reason || "",
    tags: tagsArray,
    colorTags: colorTagsArray,
    visitType:
      cf.visitType ||
      appt.visitType ||
      appt.appointmentTypeName ||
      appt.type ||
      "",
    preferredDDS: cf.preferredDentist || "",
    preferredHYG: cf.preferredHygienist || "",
    scheduledBy:
      appt.createdBy?.name ||
      appt.scheduledBy?.name ||
      appt.createdByName ||
      "",
    price: priceStr,
  };
};

// Computes the absolute CSS position for a grid item inside the time grid.
// colIndex is the zero-based position of the matching room in the rooms array.
const getGridPosition = (gridItem, colIndex) => {
  const top =
    (gridItem.startHour - START_HOUR) * HOUR_HEIGHT +
    (gridItem.startMinute / 60) * HOUR_HEIGHT;
  const height = Math.max(
    (gridItem.durationMinutes / 60) * HOUR_HEIGHT - 4,
    24,
  ); // floor at 24 px
  const left = TIME_LABEL_WIDTH + colIndex * COLUMN_MIN_WIDTH + 3;
  const width = COLUMN_MIN_WIDTH - 6;
  return { top: top + 2, height, left, width };
};

// ─── Component ────────────────────────────────────────────────────────────────

const DroppableCell = ({ hour, room, idx, activeCell, setActiveCell, onSlotClick, onBlockClick }) => {
  const roomId = room._id || room.id || room.roomCode || `op${idx + 1}`;
  
  // Create two droppable zones for the hour: top half (0 mins) and bottom half (30 mins)
  const { setNodeRef: setNodeRefTop, isOver: isOverTop } = useDroppable({
    id: `slot-${roomId}-${hour}-0`,
  });
  
  const { setNodeRef: setNodeRefBottom, isOver: isOverBottom } = useDroppable({
    id: `slot-${roomId}-${hour}-30`,
  });

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const isBottomHalf = y > HOUR_HEIGHT / 2;
        const mins = isBottomHalf ? 30 : 0;
        setActiveCell({
          hour,
          mins,
          roomId
        });
      }}
      sx={{
        width: COLUMN_MIN_WIDTH,
        flexShrink: 0,
        borderLeft: `1px solid ${COLORS.BORDER}`,
        position: "relative",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          backgroundColor: "rgba(34, 98, 239, 0.04)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          borderTop: "1px dashed #e8ecf0",
          pointerEvents: "none",
        },
      }}
    >
      <Box ref={setNodeRefTop} sx={{ flex: 1, backgroundColor: isOverTop ? "rgba(34, 98, 239, 0.1)" : "transparent" }} />
      <Box ref={setNodeRefBottom} sx={{ flex: 1, backgroundColor: isOverBottom ? "rgba(34, 98, 239, 0.1)" : "transparent" }} />
      {/* Active cell options popup */}
      {activeCell && activeCell.hour === hour && activeCell.roomId === roomId && (
        <Box
          sx={{
            position: 'absolute',
            top: activeCell.mins === 30 ? '50%' : 0,
            height: '50%',
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="small"
            variant="contained"
            disableElevation
            onClick={() => {
              if (onSlotClick) onSlotClick(activeCell.hour, activeCell.mins, activeCell.roomId);
              setActiveCell(null);
            }}
            sx={{ 
              fontSize: '10px', 
              fontWeight: fontWeight.semibold, 
              textTransform: 'none', 
              py: 0.5, 
              minWidth: '80%', 
              backgroundColor: COLORS.ACCENT, 
              borderRadius: '6px',
              '&:hover': { backgroundColor: COLORS.ACCENT_HOVER } 
            }}
          >
            Schedule Appointment
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if (onBlockClick) onBlockClick(activeCell.hour, activeCell.mins, activeCell.roomId);
              setActiveCell(null);
            }}
            sx={{ 
              fontSize: '10px', 
              fontWeight: fontWeight.semibold, 
              textTransform: 'none', 
              py: 0.5, 
              minWidth: '80%', 
              color: COLORS.TEXT_PRIMARY, 
              borderColor: COLORS.BORDER,
              borderRadius: '6px',
            }}
          >
            Block slot
          </Button>
        </Box>
      )}
    </Box>
  );
};

const ScheduleTimeGrid = ({ onSlotClick, onBlockClick, scheduleBlocks, privacyMode }) => {
  const [activeCell, setActiveCell] = useState(null);
  const { calendarView, selectedDate, frontendFilters } = useScheduleState();
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Very basic outside click handler
      if (activeCell) setActiveCell(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeCell]);

  const { rooms, providers } = useDropdownData({
    rooms: true,
    providers: true,
  });

  // Convert the ISO date string to a dayjs object for date arithmetic.
  const dayjsDate = dayjs(selectedDate);

  // Derive the API query date range from the current view and selected date.
  // Day view: a single day. Week/month views bracket the full period.
  const viewUnit = calendarView === "day" ? "day" : calendarView;
  const startDate = dayjsDate.startOf(viewUnit).format("YYYY-MM-DD");
  const endDate = dayjsDate.endOf(viewUnit).format("YYYY-MM-DD");

  // Auto-fetches on mount using the current date range as initialFilters.
  // The thunk condition prevents concurrent requests so the double-fire from
  // the re-fetch effect below is harmless on mount.
  const {
    appointments: rawAppointments,
    fetch: fetchAppts,
    loading,
  } = useAppointmentList({ startDate, endDate, limit: 200 });

  // Re-fetch when the user navigates to a different date or switches view.
  useEffect(() => {
    fetchAppts({ startDate, endDate, limit: 200 });
  }, [startDate, endDate]); // fetchAppts is a stable useCallback; startDate/endDate are strings

  // Build a roomId → column-index lookup for fast position calculation.
  const roomIndexMap = useMemo(() => {
    const map = {};
    rooms.forEach((room, idx) => {
      const id = room._id || room.id;
      if (id) map[id] = idx;
    });
    return map;
  }, [rooms]);

  const providerMap = useMemo(() => {
    const map = {};
    providers.forEach((provider) => {
      [
        provider._id,
        provider.id,
        provider.userId?._id,
        provider.userId?.id,
      ].forEach((id) => {
        if (id) map[String(id)] = provider;
      });
    });
    return map;
  }, [providers]);

  // Filter to the selected date (guards against stale list state during navigation)
  // then convert each API record to the AppointmentCard shape.
  const visibleAppointments = useMemo(() => {
    const targetDate = dayjsDate.format("YYYY-MM-DD");
    const { providerId, visitType } = frontendFilters || { providerId: 'All', visitType: 'All' };

    const appts = rawAppointments
      .filter((appt) => {
        const apptDate = appt.appointmentDate
          ? String(appt.appointmentDate).slice(0, 10)
          : null;
        const isTargetDate = apptDate === targetDate;
        const isNotPending = String(appt.status).toLowerCase() !== 'pending';
        if (!isTargetDate || !isNotPending) return false;

        // Apply visual frontend filters
        if (providerId !== 'All') {
          const aProviderId = String(appt.providerId && (appt.providerId._id || appt.providerId.id || appt.providerId));
          if (aProviderId !== String(providerId)) return false;
        }
        if (visitType !== 'All') {
          const apptVisitType = String(appt.visitType || appt.customFields?.visitType || "").toLowerCase();
          if (apptVisitType !== visitType.toLowerCase()) return false;
        }
        return true;
      })
      .map((appt) => mapApiAppointmentToGridItem(appt, providerMap))
      .filter(Boolean); // remove nulls from appointments outside the hour range

    const blocks = scheduleBlocks.map(block => {
      if (!block.startTime || !block.endTime) return null;
      
      const startH = parseInt(block.startTime.split(':')[0], 10);
      const startM = parseInt(block.startTime.split(':')[1], 10);
      const endH = parseInt(block.endTime.split(':')[0], 10);
      const endM = parseInt(block.endTime.split(':')[1], 10);
      
      if (startH >= END_HOUR || endH <= START_HOUR) return null;

      const durationMinutes = (endH - startH) * 60 + (endM - startM);

      return {
        id: block._id || block.id,
        roomId: block.roomId || "1",
        startHour: startH,
        startMinute: startM,
        endHour: endH,
        durationMinutes,
        type: "block",
        title: block.notes || "Blocked",
        color: block.color,
        ...block
      };
    }).filter(Boolean);

    return [...appts, ...blocks];
  }, [rawAppointments, selectedDate, providerMap, scheduleBlocks, frontendFilters]);

  // Total grid width grows with the number of rooms.
  const totalWidth = TIME_LABEL_WIDTH + (rooms.length || 1) * COLUMN_MIN_WIDTH;

  return (
    <Box sx={{ position: "relative", height: TOTAL_HEIGHT, width: totalWidth }}>
      {/* ── Hour rows — grid background ─────────────────────────────────────── */}
      {HOURS.map((hour) => (
        <Box
          key={hour}
          sx={{
            position: "absolute",
            top: (hour - START_HOUR) * HOUR_HEIGHT,
            left: 0,
            width: totalWidth,
            height: HOUR_HEIGHT,
            display: "flex",
            borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
          }}
        >
          {/* Time gutter label */}
          <Box
            sx={{
              width: TIME_LABEL_WIDTH,
              flexShrink: 0,
              pt: "6px",
              pr: "10px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <Typography
              sx={{
                fontSize: fontSize.sm,
                fontWeight: fontWeight.medium,
                color: COLORS.TEXT_MUTED,
              }}
            >
              {formatHour(hour)}
            </Typography>
          </Box>

          {/* One cell per operatory column */}
          {rooms.map((room, idx) => (
            <DroppableCell 
              key={room._id || room.id || idx}
              hour={hour}
              room={room}
              idx={idx}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
              onSlotClick={onSlotClick}
              onBlockClick={onBlockClick}
            />
          ))}
        </Box>
      ))}

      {/* ── Loading overlay — shown while fetching ───────────────────────────── */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            pt: "60px",
            backgroundColor: "rgba(255,255,255,0.6)",
            zIndex: 10,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}

      {/* ── Appointment cards — absolutely positioned in the grid ──────────── */}
      {visibleAppointments.map((gridItem) => {
        // Resolve column index from the roomId; unmatched rooms fall to column 0.
        const colIndex = roomIndexMap[gridItem.roomId] ?? 0;
        const pos = getGridPosition(gridItem, colIndex);

        return (
          <Box
            key={gridItem.id}
            sx={{
              position: "absolute",
              top: pos.top,
              height: pos.height,
              left: pos.left,
              width: pos.width,
              zIndex: 2,
            }}
          >
            <AppointmentCard appointment={gridItem} privacyMode={privacyMode} />
          </Box>
        );
      })}
    </Box>
  );
};

export default ScheduleTimeGrid;
