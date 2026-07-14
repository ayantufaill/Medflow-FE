import React, { useState } from "react";
import { Box, Typography, Button, Switch, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateOfficeTimings } from "../../../store/slices/practiceInfoSlice";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_HOURS = {
  Monday: {
    closed: false,
    fromHour: "09",
    fromMin: "00",
    fromPeriod: "AM",
    toHour: "05",
    toMin: "00",
    toPeriod: "PM",
  },
  Tuesday: {
    closed: false,
    fromHour: "09",
    fromMin: "00",
    fromPeriod: "AM",
    toHour: "05",
    toMin: "00",
    toPeriod: "PM",
  },
  Wednesday: {
    closed: false,
    fromHour: "09",
    fromMin: "00",
    fromPeriod: "AM",
    toHour: "05",
    toMin: "00",
    toPeriod: "PM",
  },
  Thursday: {
    closed: false,
    fromHour: "09",
    fromMin: "00",
    fromPeriod: "AM",
    toHour: "05",
    toMin: "00",
    toPeriod: "PM",
  },
  Friday: {
    closed: false,
    fromHour: "09",
    fromMin: "00",
    fromPeriod: "AM",
    toHour: "05",
    toMin: "00",
    toPeriod: "PM",
  },
  Saturday: {
    closed: true,
    fromHour: "09",
    fromMin: "00",
    fromPeriod: "AM",
    toHour: "05",
    toMin: "00",
    toPeriod: "PM",
  },
  Sunday: {
    closed: true,
    fromHour: "09",
    fromMin: "00",
    fromPeriod: "AM",
    toHour: "05",
    toMin: "00",
    toPeriod: "PM",
  },
};

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

const CustomSelect = ({ value, options, onChange }) => (
  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    <Box
      component="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#111827',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        cursor: 'pointer',
        pl: 1,
        pr: 2.5,
        outline: 'none',
        '&:focus': { outline: 'none' }
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </Box>
    <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: '#9CA3AF', position: 'absolute', right: 4, pointerEvents: 'none' }} />
  </Box>
);

const TimeInput = ({ value, onChange, disabled }) => {
  const update = (field, val) => onChange({ ...value, [field]: val });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        height: 36,
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto'
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", pl: 1, pr: 0.5 }}>
        <CustomSelect 
          value={value.hour || "09"} 
          options={HOURS} 
          onChange={(val) => update("hour", val)} 
        />
        <Typography sx={{ color: '#9CA3AF', fontWeight: 600, mx: 0.5, fontSize: '0.85rem' }}>:</Typography>
        <CustomSelect 
          value={value.min || "00"} 
          options={MINUTES} 
          onChange={(val) => update("min", val)} 
        />
      </Box>

      {/* AM/PM Toggle */}
      <Box sx={{ display: 'flex', height: '100%', ml: 1, p: 0.5 }}>
        {["AM", "PM"].map((period) => {
          const isActive = value.period === period;
          return (
            <Box
              key={period}
              component="button"
              type="button"
              onClick={() => update("period", period)}
              sx={{
                width: '38.17px',
                height: '28px',
                border: "none",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                bgcolor: isActive ? "#2F5CF0" : "transparent",
                color: isActive ? "#FFFFFF" : "#9CA3AF",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 0
              }}
            >
              {period}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const OpeningHoursSetup = ({ onNext, onFinishLater, practiceInfoId }) => {
  const [schedule, setSchedule] = useState(DEFAULT_HOURS);
  const [saving, setSaving] = useState(false);
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleSaveAndNext = async () => {
    try {
      setSaving(true);
      if (practiceInfoId) {
        await dispatch(
          updateOfficeTimings({
            practiceInfoId,
            officeTimingsData: {
              openingHours: schedule,
              schedulingAppt: schedule,
            },
          })
        ).unwrap();
      }
      onNext();
    } catch (err) {
      showSnackbar(err || "Failed to save timings", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateDay = (day, field, val) =>
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: val } }));

  const updateTime = (day, which, updated) => {
    if (which === "from") {
      setSchedule((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          fromHour: updated.hour,
          fromMin: updated.min,
          fromPeriod: updated.period,
        },
      }));
    } else {
      setSchedule((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          toHour: updated.hour,
          toMin: updated.min,
          toPeriod: updated.period,
        },
      }));
    }
  };

  return (
    <Box sx={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: "1.1rem",
          mb: 1,
          color: "#111827",
        }}
      >
        Opening & Scheduling Hours
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#6B7280",
          mb: 3,
          fontSize: "0.875rem",
        }}
      >
        Your office opening and closing time including the hours reserved for
        administrative tasks such as morning huddle. This will update your
        opening and scheduling times
      </Typography>

      <Box
        sx={{
          bgcolor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          p: 3,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "#111827",
            mb: 3,
          }}
        >
          Weekday
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {DAYS.map((day, index) => {
            const row = schedule[day];
            const isLast = index === DAYS.length - 1;
            
            return (
              <Box
                key={day}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 2.5,
                  borderBottom: isLast ? "none" : "1px solid #F3F4F6",
                }}
              >
                {/* Left: Status Dot & Day */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, width: 140 }}>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: row.closed ? '#9CA3AF' : '#10B981',
                      mt: 0.75
                    }} 
                  />
                  <Box sx={{ opacity: row.closed ? 0.5 : 1 }}>
                    <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>
                      {day}
                    </Typography>
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.75rem", mt: -0.25 }}>
                      {row.closed ? "Closed" : "Open"}
                    </Typography>
                  </Box>
                </Box>

                {/* Middle: Time Pickers */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  {/* FROM */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 600, width: 40 }}>
                      FROM
                    </Typography>
                    <TimeInput
                      disabled={row.closed}
                      value={{
                        hour: row.fromHour,
                        min: row.fromMin,
                        period: row.fromPeriod,
                      }}
                      onChange={(updated) => updateTime(day, "from", updated)}
                    />
                  </Box>

                  {/* ARROW */}
                  <Typography sx={{ color: "#9CA3AF", mx: 1 }}>→</Typography>

                  {/* TO */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: 600, width: 25 }}>
                      TO
                    </Typography>
                    <TimeInput
                      disabled={row.closed}
                      value={{
                        hour: row.toHour,
                        min: row.toMin,
                        period: row.toPeriod,
                      }}
                      onChange={(updated) => updateTime(day, "to", updated)}
                    />
                  </Box>
                </Box>

                {/* Right: Toggle Switch */}
                <Switch
                  disableRipple
                  checked={!row.closed}
                  onChange={(e) => updateDay(day, "closed", !e.target.checked)}
                  sx={{
                    width: 38,
                    height: 22,
                    padding: 0,
                    '& .MuiSwitch-switchBase': {
                      padding: '2px',
                      '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                          opacity: 1,
                          backgroundColor: '#12B76A',
                          border: 0,
                        },
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      width: 18,
                      height: 18,
                      boxShadow: 'none',
                      backgroundColor: '#fff',
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 11,
                      opacity: 1,
                      backgroundColor: '#E5E7EB',
                      boxSizing: 'border-box',
                      transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Footer Navigation */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onFinishLater}
          disabled={saving}
          sx={{
            color: "#6B7280",
            borderColor: "#D1D5DB",
            textTransform: "none",
            borderRadius: "6px",
            px: 3,
            "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F3F4F6" },
          }}
        >
          Finish Later
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveAndNext}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            bgcolor: "#2362EF",
            "&:hover": { bgcolor: "#1D4ED8" },
            textTransform: "none",
            borderRadius: "6px",
            px: 4,
            fontWeight: 500,
            boxShadow: "none",
          }}
        >
          {saving ? "Saving..." : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default OpeningHoursSetup;
