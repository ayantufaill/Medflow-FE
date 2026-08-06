/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import dayjs from "dayjs";
import { useDroppable } from "@dnd-kit/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientById } from "../../../store/slices/patientSlice";
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
  usePatient,
} from "../../../hooks/redux";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight } from "../../../constants/styles";
import CompactAppointmentPoint from "./CompactAppointmentPoint";

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
  const fName = patientData?.firstName || patientData?.FName || "";
  const lName = patientData?.lastName || patientData?.LName || "";
  const patientName = `${fName} ${lName}`.trim() || patientData?.name || patientData?.fullName || appt.patientName || "Patient";

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

// ─── 10-Minute Portion Sub-Component ──────────────────────────────────────────

const PORTION_MINUTES = [0, 10, 20, 30, 40, 50];

const PortionDroppableZone = ({ hour, mins, roomId, onSlotClick, setActiveCell, isWeek, isClosed, isCloseOpenDayMode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${roomId}-${hour}-${mins}`,
  });

  return (
    <Box
      ref={setNodeRef}
      onClick={(e) => {
        if (isCloseOpenDayMode || isClosed) return;
        e.stopPropagation();
        if (isWeek) {
          if (onSlotClick) onSlotClick(hour, mins, roomId);
        } else {
          setActiveCell({ hour, mins, roomId });
        }
      }}
      sx={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        backgroundColor: isOver ? 'rgba(34, 98, 239, 0.15)' : 'transparent',
        borderBottom: mins !== 50 ? '1px dashed transparent' : 'none',
        '.droppable-cell-container:hover &': {
          borderBottom: mins !== 50 ? '1px dashed rgba(203, 213, 225, 0.8)' : 'none',
        },
        '&:hover': {
          backgroundColor: isCloseOpenDayMode || isClosed ? 'transparent' : 'rgba(34, 98, 239, 0.1)',
        },
      }}
    />
  );
};

const DroppableCell = ({ hour, room, idx, activeCell, setActiveCell, onSlotClick, onBlockClick, isClosed, isCloseOpenDayMode, isWeek }) => {
  const roomId = room._id || room.id || room.roomCode || `op${idx + 1}`;

  return (
    <Box
      className="droppable-cell-container"
      sx={{
        width: COLUMN_MIN_WIDTH,
        height: HOUR_HEIGHT,
        flexShrink: 0,
        borderLeft: `1px solid ${COLORS.BORDER}`,
        position: "relative",
        cursor: isCloseOpenDayMode ? "default" : (isClosed ? "not-allowed" : "pointer"),
        display: "flex",
        flexDirection: "column",
        backgroundColor: isClosed ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        backgroundImage: isClosed ? 'repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.02) 75%, rgba(0,0,0,0.02)), repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.02) 75%, rgba(0,0,0,0.02))' : 'none',
        backgroundPosition: '0 0, 10px 10px',
        backgroundSize: '20px 20px',
        "&:hover": {
          backgroundColor: isCloseOpenDayMode 
            ? (isClosed ? 'rgba(0, 0, 0, 0.05)' : 'transparent') 
            : "rgba(34, 98, 239, 0.02)",
        },
      }}
    >
      {PORTION_MINUTES.map((mins) => (
        <PortionDroppableZone
          key={mins}
          hour={hour}
          mins={mins}
          roomId={roomId}
          onSlotClick={onSlotClick}
          setActiveCell={setActiveCell}
          isWeek={isWeek}
          isClosed={isClosed}
          isCloseOpenDayMode={isCloseOpenDayMode}
        />
      ))}

      {/* Active cell options popup */}
      {activeCell && activeCell.hour === hour && activeCell.roomId === roomId && (
        <Box
          sx={{
            position: 'absolute',
            top: `${(activeCell.mins / 60) * 100}%`,
            left: '4px',
            right: '4px',
            zIndex: 20,
            backgroundColor: 'rgba(255,255,255,0.98)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            py: '8px',
            px: '8px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            border: `1px solid ${COLORS.ACCENT}`,
            transform: activeCell.mins >= 40 ? 'translateY(-75%)' : 'none',
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
              width: '100%', 
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
              width: '100%', 
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

const ScheduleTimeGrid = ({ rooms: propRooms, onSlotClick, onBlockClick, scheduleBlocks, privacyMode, showGhosted, isCloseOpenDayMode, closedOperatories = {}, compactMode = false }) => {
  const dispatch = useDispatch();
  const [activeCell, setActiveCell] = useState(null);
  const { calendarView, selectedDate, frontendFilters } = useScheduleState();
  const rawAppointments = useSelector((state) => state.appointment.list);
  const loading = useSelector((state) => state.appointment.listLoading);
  const dayjsDate = dayjs(selectedDate);
  const viewUnit = calendarView === "day" ? "day" : calendarView;
  const startDate = dayjsDate.startOf(viewUnit).format("YYYY-MM-DD");
  const endDate = dayjsDate.endOf(viewUnit).add(1, 'day').format("YYYY-MM-DD");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeCell) setActiveCell(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeCell]);

  const { currentPatient } = usePatient();

  // We fetch standard lists from Redux
  const { rooms: fetchedRooms, providers } = useDropdownData({
    rooms: !propRooms,
    providers: true,
  });

  const rooms = propRooms || fetchedRooms;

  const isWeek = calendarView === 'week';

  const weekColumns = useMemo(() => {
    if (!isWeek) return [];
    const cols = [];
    const baseDate = dayjsDate.startOf('week');
    for (let i = 0; i < 7; i++) {
      const d = baseDate.add(i, 'day');
      cols.push({ id: d.format('YYYY-MM-DD'), label: d.format('ddd') });
    }
    return cols;
  }, [isWeek, selectedDate]);

  const activeColumns = isWeek ? weekColumns : rooms;

  // Build a column-index lookup for fast position calculation.
  const colIndexMap = useMemo(() => {
    const map = {};
    activeColumns.forEach((col, idx) => {
      const id = String(col._id || col.id);
      if (id) {
        map[`op${id}`] = idx;
        map[id] = idx; // Fallback
      }
    });
    return map;
  }, [activeColumns]);

  const providerMap = useMemo(() => {
    const map = {};
    providers?.forEach((provider) => {
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
    const weekStart = dayjsDate.startOf('week').format("YYYY-MM-DD");
    const weekEnd = dayjsDate.endOf('week').format("YYYY-MM-DD");
    const { providerId, visitType } = frontendFilters || { providerId: 'All', visitType: 'All' };

    const appts = rawAppointments
      .filter((appt) => {
        const apptDate = appt.appointmentDate
          ? String(appt.appointmentDate).slice(0, 10)
          : null;
        
        const isDateValid = isWeek 
          ? (apptDate >= weekStart && apptDate <= weekEnd)
          : (apptDate === targetDate);

        const statusStr = String(appt.status).toLowerCase();
        if (statusStr === 'pending') return false;
        if (!showGhosted && (statusStr === 'cancelled' || statusStr === 'no_show' || statusStr === 'no show' || statusStr === 'broken')) return false;
        if (!isDateValid) return false;

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
      
      const blockDate = dayjs(block.date).format("YYYY-MM-DD");
      const isBlockDateValid = isWeek 
        ? (blockDate >= weekStart && blockDate <= weekEnd)
        : (blockDate === targetDate);

      if (!isBlockDateValid) return null;

      const startH = parseInt(block.startTime.split(':')[0], 10);
      const startM = parseInt(block.startTime.split(':')[1], 10);
      const endH = parseInt(block.endTime.split(':')[0], 10);
      const endM = parseInt(block.endTime.split(':')[1], 10);
      
      if (startH >= END_HOUR || endH <= START_HOUR) return null;

      const durationMinutes = (endH - startH) * 60 + (endM - startM);

      // In week view, blocks should probably only apply to the current target date if they are one-off?
      // For now, if block date doesn't match week days, we could ignore. 
      // But blocks usually don't have a specific date in this simple mock. We'll leave them on all columns or column 0 for week view.

      return {
        id: block._id || block.id,
        roomId: block.roomId || "1",
        date: block.date || targetDate, // use targetDate if no date specified
        startHour: startH,
        startMinute: startM,
        endHour: endH,
        durationMinutes,
        type: "block",
        title: block.notes || "Blocked Slot",
        color: block.color,
        ...block
      };
    }).filter(Boolean);

    return [...appts, ...blocks];
  }, [rawAppointments, selectedDate, providerMap, scheduleBlocks, frontendFilters, isWeek]);

  // Total grid width grows with the number of active columns.
  const totalWidth = TIME_LABEL_WIDTH + (activeColumns.length || 1) * COLUMN_MIN_WIDTH;

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

          {/* One cell per column */}
          {activeColumns.map((col, idx) => {
            const roomId = `op${col._id || col.id}`;
            const dateStr = selectedDate ? (typeof selectedDate.format === 'function' ? selectedDate.format('YYYY-MM-DD') : new Date(selectedDate).toISOString().split('T')[0]) : dayjs().format('YYYY-MM-DD');
            const isClosed = closedOperatories[`${dateStr}:${roomId}`];

            return (
              <DroppableCell 
                key={col._id || col.id || idx}
                hour={hour}
                room={col}
                idx={idx}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                onSlotClick={onSlotClick}
                onBlockClick={onBlockClick}
                isClosed={isClosed}
                isCloseOpenDayMode={isCloseOpenDayMode}
                isWeek={isWeek}
              />
            );
          })}
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
      {(() => {
        if (isWeek) {
          const weekGroups = {};
          visibleAppointments.forEach((gridItem) => {
            const apptDateStr = dayjs(gridItem.date).format('YYYY-MM-DD');
            const colIndex = colIndexMap[apptDateStr] ?? 0;
            const pos = getGridPosition(gridItem, colIndex);
            
            // Group by the exact top position (or 30 min block)
            const blockIndex = Math.floor(pos.top / (HOUR_HEIGHT / 2));
            const key = `${colIndex}-${blockIndex}`;
            
            if (!weekGroups[key]) {
              weekGroups[key] = {
                colIndex,
                blockIndex,
                top: blockIndex * (HOUR_HEIGHT / 2),
                left: pos.left,
                width: pos.width,
                appointments: []
              };
            }
            weekGroups[key].appointments.push(gridItem);
          });
          
          return Object.values(weekGroups).map((group, i) => (
            <Box
              key={`week-group-${i}`}
              sx={{
                position: "absolute",
                top: group.top + 2,
                left: group.left,
                width: group.width,
                zIndex: 2,
                maxHeight: '80px', // Roughly 3 appointments
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                pointerEvents: 'auto',
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' }
              }}
            >
              {group.appointments.map((appt, j) => (
                <Box key={appt.id || j} sx={{ height: '24px', flexShrink: 0 }}>
                  <CompactAppointmentPoint 
                    appointment={appt} 
                    onSlotClick={(e) => {
                      const detailAppt = e.detail;
                      window.dispatchEvent(new CustomEvent('appointment-card-clicked', {
                        detail: { ...detailAppt },
                      }));
                      if (detailAppt.patientId) {
                        const pId = typeof detailAppt.patientId === 'object' 
                          ? detailAppt.patientId._id || detailAppt.patientId.id || detailAppt.patientId.PatNum 
                          : detailAppt.patientId;
                        if (pId) dispatch(fetchPatientById(pId));
                      }
                    }} 
                  />
                </Box>
              ))}
            </Box>
          ));
        }

        // DAY VIEW
        return visibleAppointments.map((gridItem, i) => {
          const colIndex = colIndexMap[gridItem.roomId] ?? 0;
          const pos = getGridPosition(gridItem, colIndex);
          const statusStr = String(gridItem.status || '').toLowerCase();
          const isGhosted = statusStr === 'cancelled' || statusStr === 'no_show' || statusStr === 'no show' || statusStr === 'broken';

          if (isGhosted) {
            pos.left = pos.left + pos.width / 2;
            pos.width = pos.width / 2;
          }

          return (
            <Box
              key={gridItem.id + i}
              sx={{
                position: "absolute",
                top: pos.top,
                height: pos.height,
                left: pos.left,
                width: pos.width,
                zIndex: isGhosted ? 3 : 2,
              }}
            >
              <AppointmentCard appointment={gridItem} privacyMode={privacyMode} />
            </Box>
          );
        });
      })()}
    </Box>
  );
};

export default ScheduleTimeGrid;
