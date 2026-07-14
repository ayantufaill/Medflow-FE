import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import {
  fetchRooms,
  selectRoomList,
  selectRoomListLoading,
} from "../../../store/slices/roomSlice";
import { updateScheduleConfig } from "../../../store/slices/practiceInfoSlice";
import { roomService } from "../../../services/room.service";
import { fontSize, fontWeight } from "../../../constants/styles";

// ─── Constants ───────────────────────────────────────────────────────────────

const START_HOUR = 7;
const END_HOUR = 17;
const SLOT_H = 15; // 15-min slot height
const NAVY = "#1976d2";

const APPT_TYPES = {
  HYGIENE: { color: "#E7C7A3", label: "Hygiene" },
  HIGH_PROD: { color: "#AED0B9", label: "High Production" },
  NEW_PATIENT: { color: "#CBBDE0", label: "New Patient" },
  DELIVERY: { color: "#E7C7CD", label: "Delivery" },
  EMERGENCY: { color: "#E4D19E", label: "Emergency" },
  LUNCH: { color: "#E6F6FC", label: "Lunch", striped: true },
  MAINTENANCE: { color: "#cfcfe9", label: "Maintenance" },
  NEW_PATIENT_EXAM: { color: "#f0f0f0", label: "New Patient Exam" },
  MID_PROD: { color: "#A8D1CB", label: "Mid Production" },
};

const formatDayLabel = (date) =>
  date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

// ─── Component ───────────────────────────────────────────────────────────────

const SectionHeading = ({ children }) => (
  <Typography
    sx={{
      color: "#111928",
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "32px",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      mb: 2,
      mt: 1,
    }}
  >
    {children}
  </Typography>
);

const WizardActions = ({
  onFinishLater,
  onNext,
  nextLabel = "Next",
  loading = false,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 1.5,
      mt: 3,
      pt: 2,
    }}
  >
    <Button
      variant="outlined"
      onClick={onFinishLater}
      disabled={loading}
      sx={{
        borderColor: "#d1d5db",
        color: "#374151",
        textTransform: "none",
        borderRadius: "8px",
        px: 3,
        fontWeight: 600,
        "&:hover": { borderColor: "#9ca3af", bgcolor: "#f3f4f6" },
      }}
    >
      Finish Later
    </Button>
    <Button
      variant="contained"
      onClick={onNext}
      disabled={loading}
      sx={{
        bgcolor: "#3b82f6",
        textTransform: "none",
        borderRadius: "8px",
        px: 4,
        fontWeight: 600,
        boxShadow: "none",
        "&:hover": { bgcolor: "#2563eb", boxShadow: "none" },
      }}
      startIcon={
        loading ? <CircularProgress size={16} color="inherit" /> : null
      }
    >
      {loading ? "Saving..." : nextLabel}
    </Button>
  </Box>
);

const ScheduleSetup = ({ onNext, onFinishLater, practiceInfoId }) => {
  const { showSnackbar } = useSnackbar();
  const rooms = useSelector(selectRoomList);
  const loading = useSelector(selectRoomListLoading);
  const [savingConfig, setSavingConfig] = useState(false);
  const [addingRoom, setAddingRoom] = useState(false);
  const [savingRoom, setSavingRoom] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2022, 6, 15)); // Default to July 15, 2022 to match mockup

  const dispatch = useDispatch();

  const handleSaveAndNext = async () => {
    try {
      setSavingConfig(true);
      if (practiceInfoId) {
        await dispatch(
          updateScheduleConfig({
            practiceInfoId,
            scheduleConfigData: scheduleData,
          }),
        ).unwrap();
      }
      onNext();
    } catch (err) {
      showSnackbar(err || "Failed to save schedule config", "error");
    } finally {
      setSavingConfig(false);
    }
  };

  // DRAG & DROP STATE (Aligned with the mockup)
  const [scheduleData, setScheduleData] = useState({
    op1: [],
    op2: [
      { id: "2-1", type: "HYGIENE", start: 8, end: 10.75, label: "Contai...\n\nHygiene" },
      { id: "2-4", type: "LUNCH", start: 12, end: 13, label: "Lunch" },
    ],
    op3: [
      { id: "3-1", type: "HIGH_PROD", start: 8, end: 9.5, label: "High Production" },
      { id: "3-2", type: "DELIVERY", start: 9.5, end: 11.5, label: "Delivery" },
      { id: "3-3", type: "EMERGENCY", start: 11.5, end: 12, label: "Emergency" },
      { id: "3-4", type: "LUNCH", start: 12, end: 13, label: "Lunch" },
    ],
    op4: [
      { id: "4-1", type: "NEW_PATIENT", start: 8, end: 10, label: "New Patient" },
      { id: "4-2", type: "MID_PROD", start: 10, end: 11, label: "Mid Production" },
      { id: "4-3", type: "HIGH_PROD", start: 11, end: 12, label: "High Production" },
      { id: "4-4", type: "LUNCH", start: 12, end: 13, label: "Lunch" },
    ],
  });

  const [activeDrag, setActiveDrag] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    dispatch(fetchRooms({ page: 1, limit: 50 }));
  }, [dispatch]);

  const [displayRooms, setDisplayRooms] = useState([
    { id: "op1", name: "Operatory 01", type: "op" },
    { id: "op2", name: "Operatory 02", type: "op" },
    { id: "op3", name: "Operatory 03", type: "op" },
    { id: "op4", name: "Operatory 04", type: "op" },
  ]);

  const handleAddRoom = async () => {
    const nextNum = displayRooms.length + 1;
    const newId = `op${nextNum}`;
    const newName = `Operatory ${nextNum < 10 ? "0" + nextNum : nextNum}`;
    
    setDisplayRooms((prev) => [...prev, { id: newId, name: newName, type: "op" }]);
    setScheduleData((prev) => ({ ...prev, [newId]: [] }));
  };

  const timeSlots = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === END_HOUR && m > 0) break;
      timeSlots.push({
        label: m === 0 ? `${h > 12 ? h - 12 : h}${h < 12 ? "AM" : "PM"}` : "",
        hour: h,
        min: m,
        key: `${h}:${m}`,
      });
    }
  }

  const prevDay = () =>
    setSelectedDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() - 1);
      return n;
    });
  const nextDay = () =>
    setSelectedDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + 1);
      return n;
    });

  // DRAG HANDLERS
  const handleMouseDown = (e, roomId, appt) => {
    e.preventDefault();
    const rect = gridRef.current.getBoundingClientRect();
    const colWidth = (rect.width - 60) / displayRooms.length;
    setActiveDrag({
      roomId,
      apptId: appt.id,
      initialY: e.clientY,
      initialX: e.clientX,
      initialStart: appt.start,
      initialEnd: appt.end,
      colWidth,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!activeDrag) return;

      const deltaY = e.clientY - activeDrag.initialY;
      const deltaHours = deltaY / (4 * SLOT_H);

      const deltaX = e.clientX - activeDrag.initialX;
      const colShift = Math.round(deltaX / activeDrag.colWidth);

      setScheduleData((prev) => {
        const newData = { ...prev };
        const currentRoomAppts = prev[activeDrag.roomId] || [];
        const appt = currentRoomAppts.find((a) => a.id === activeDrag.apptId);
        if (!appt) return prev;

        let newStart = activeDrag.initialStart + deltaHours;
        let newEnd = activeDrag.initialEnd + deltaHours;

        newStart = Math.round(newStart * 4) / 4;
        newEnd = Math.round(newEnd * 4) / 4;

        if (newStart < START_HOUR) {
          const diff = START_HOUR - newStart;
          newStart += diff;
          newEnd += diff;
        }
        if (newEnd > END_HOUR + 0.75) {
          const diff = newEnd - (END_HOUR + 0.75);
          newStart -= diff;
          newEnd -= diff;
        }

        const updatedAppt = { ...appt, start: newStart, end: newEnd };

        const currentIdx = displayRooms.findIndex(
          (r) => r.id === activeDrag.roomId,
        );
        let targetIdx = currentIdx + colShift;
        targetIdx = Math.max(0, Math.min(displayRooms.length - 1, targetIdx));
        const targetRoomId = displayRooms[targetIdx].id;

        if (targetRoomId !== activeDrag.roomId) {
          newData[activeDrag.roomId] = currentRoomAppts.filter(
            (a) => a.id !== activeDrag.apptId,
          );
          newData[targetRoomId] = [
            ...(newData[targetRoomId] || []),
            updatedAppt,
          ];
          setActiveDrag({
            ...activeDrag,
            roomId: targetRoomId,
            initialX:
              activeDrag.initialX +
              (targetIdx - currentIdx) * activeDrag.colWidth,
          });
        } else {
          newData[activeDrag.roomId] = currentRoomAppts.map((a) =>
            a.id === activeDrag.apptId ? updatedAppt : a,
          );
        }

        return newData;
      });
    };

    const handleMouseUp = () => {
      setActiveDrag(null);
    };

    if (activeDrag) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeDrag, displayRooms]);

  return (
    <Box sx={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <SectionHeading>Schedule Setup</SectionHeading>

      <Box
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          bgcolor: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Box sx={{ width: 150 }} /> {/* Spacer */}
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={prevDay} size="small" sx={{ color: "#6B7280" }}>
              <KeyboardArrowLeftIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#111928", minWidth: 150, textAlign: "center", fontSize: "0.9rem" }}
            >
              {formatDayLabel(selectedDate)}
            </Typography>
            <IconButton onClick={nextDay} size="small" sx={{ color: "#6B7280" }}>
              <KeyboardArrowRightIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleAddRoom}
            size="small"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              bgcolor: "#3b82f6",
              color: "#fff",
              px: 2,
              py: 0.7,
              fontSize: "0.85rem",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { bgcolor: "#2563eb", boxShadow: "none" },
            }}
          >
            + Add Operatory
          </Button>
        </Box>

        <Box
          ref={gridRef}
          sx={{
            maxHeight: 500, // Show enough height
            overflowY: "auto",
            overflowX: "hidden", // Prevent horizontal scroll to keep grid aligned
            position: "relative",
            cursor: activeDrag ? "grabbing" : "default",
            userSelect: "none",
          }}
        >
          {/* STICKY HEADER */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              display: "grid",
              gridTemplateColumns: `60px repeat(${displayRooms.length}, 1fr)`,
              borderBottom: "1px solid #E5E7EB",
              bgcolor: "#fff",
            }}
          >
            <Box />
            {displayRooms.map((room) => (
              <Box
                key={room.id}
                sx={{
                  py: 2,
                  px: 2,
                  textAlign: "left",
                  borderLeft: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#3b82f6",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "#111928", fontSize: "0.85rem" }}
                >
                  {room.name}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ position: "relative" }}>
            {timeSlots.map((slot, idx) => (
              <Box
                key={slot.key}
                sx={{
                  display: "grid",
                  gridTemplateColumns: `60px repeat(${displayRooms.length}, 1fr)`,
                  height: SLOT_H,
                  borderBottom: slot.min === 45 ? "1px solid #E5E7EB" : "1px dotted #E5E7EB",
                  position: "relative",
                  boxSizing: "border-box",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  {slot.min === 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: "-8px",
                        right: "12px",
                        color: "#6B7280",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                      }}
                    >
                      {slot.label}
                    </Typography>
                  )}
                </Box>
                {displayRooms.map((room) => (
                  <Box
                    key={`${room.id}-${slot.key}`}
                    sx={{ borderLeft: "1px solid #E5E7EB", boxSizing: "border-box" }}
                  />
                ))}
              </Box>
            ))}

            {/* APPOINTMENT OVERLAY GRID */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "grid",
                gridTemplateColumns: `60px repeat(${displayRooms.length}, 1fr)`,
                pointerEvents: "none", // Let clicks pass through to grid (if needed)
              }}
            >
              <Box /> {/* 60px spacer for timeline */}
              {displayRooms.map((room, colIdx) => (
                <Box key={`overlay-${room.id}`} sx={{ position: "relative" }}>
                  {(scheduleData[room.id] || []).map((appt) => {
                    const top = (appt.start - START_HOUR) * 4 * SLOT_H;
                    const height = (appt.end - appt.start) * 4 * SLOT_H;
                    const config = APPT_TYPES[appt.type] || {};
                    const isDragging = activeDrag?.apptId === appt.id;

                    return (
                      <Box
                        key={appt.id}
                        onMouseDown={(e) => handleMouseDown(e, room.id, appt)}
                        sx={{
                          position: "absolute",
                          top: top,
                          left: "1px", // Avoid overlapping the left border
                          right: 0,
                          height: height,
                          bgcolor: appt.customColor || config.color,
                          boxSizing: "border-box",
                          zIndex: isDragging ? 100 : 2,
                          p: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          cursor: isDragging ? "grabbing" : "grab",
                          opacity: isDragging ? 0.9 : 1,
                          pointerEvents: "auto", // Re-enable pointer events for dragging
                          boxShadow: isDragging
                            ? "0 8px 16px rgba(0,0,0,0.2)"
                            : "none",
                          transition: isDragging ? "none" : "all 0.1s ease",
                          ...(config.striped && {
                            background:
                              "repeating-linear-gradient(90deg, #CEEEFA, #CEEEFA 6px, #E7F6FC 6px, #E7F6FC 12px)",
                          }),
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            color: "#111928",
                            lineHeight: 1.3,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {appt.label || config.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <WizardActions
          onFinishLater={onFinishLater}
          onNext={handleSaveAndNext}
          loading={savingConfig}
        />
      </Box>
    </Box>
  );
};

export default ScheduleSetup;
