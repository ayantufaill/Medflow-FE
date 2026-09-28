import { Box, Button, IconButton, Typography } from "@mui/material";
import { CalendarMonthOutlined, AutoAwesome, Close, EventRepeatOutlined, ContentCopyOutlined, CheckCircleOutline } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

const AppointmentModalHeader = ({
  onCancel,
  onConvertToShortlist,
  onCopyToShortlist,
  isEditMode,
  isShortlistEditMode = false,
  patientDisplayName,
  apptDate,
  timeHours,
  timeMins,
  amPm,
  visitType,
  isRescheduling,
  onReschedule,
  isCopiedToShortlist = false,
  onDateChange,
  onTimeChange,
  onAmPmChange,
}) => {
  const formattedDate = apptDate ? (typeof apptDate.format === 'function' ? apptDate.format("MM/DD/YYYY") : apptDate) : "";
  const formattedTime = `${timeHours || ""}:${timeMins || ""} ${amPm || ""}`;

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  let formattedVisitType = capitalizeWords(visitType);
  if (formattedVisitType && !formattedVisitType.toLowerCase().includes("appointment")) {
    formattedVisitType += " Appointment";
  } else if (!formattedVisitType) {
    formattedVisitType = "Appointment";
  }

  const displayTitle = isEditMode
    ? `${patientDisplayName || "Unknown Patient"}; ${formattedVisitType} on ${formattedDate} @ ${formattedTime}`
    : "Add new patient appointment";

  const actionBtnStyle = {
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "row", padding: "0px 11.8px", borderWidth: "1px",
    fontFamily: "Inter", fontSize: "12px", fontWeight: 500,
    textTransform: "none", borderRadius: "20px",
    borderColor: "#e0e5eb", color: "#09121f", gap: "6px",
    px: "14px", py: "6px", bgcolor: "#fbfdfe",
    "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f9fafb" },
  };

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: "12px",
      px: "10px", py: "10px",
      borderBottom: "1px solid #e0e5eb", flexShrink: 0,
      backgroundColor: "#f3f8fd",
    }}>
      <Box sx={{
        width: "36px", height: "36px", borderRadius: "8px",
        backgroundColor: "#eff6ff",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <CalendarMonthOutlined sx={{ fontSize: "20px", color: "#2262ef" }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
        {isRescheduling ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Typography sx={{
              fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {patientDisplayName || "Unknown Patient"}
            </Typography>
            <DatePicker
              value={apptDate}
              onChange={onDateChange}
              views={["year", "month", "day"]}
              disablePast
              slotProps={{
                popper: { sx: { zIndex: 1400 } },
                textField: {
                  size: "small",
                  sx: {
                    width: "165px",
                    "& .MuiInputBase-root": {
                      fontFamily: "Inter",
                      fontSize: "13px",
                      borderRadius: "8px",
                      height: "40px",
                    },
                  },
                },
              }}
            />
            <TimePicker
              value={(() => {
                const h = parseInt(timeHours, 10);
                const m = parseInt(timeMins, 10);
                const hour24 =
                  amPm === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
                return dayjs().hour(hour24).minute(m).second(0);
              })()}
              onChange={(v) => {
                if (!v) return;
                onTimeChange(v.format("hh"), v.format("mm"));
                onAmPmChange(v.format("A"));
              }}
              minTime={
                apptDate && dayjs(apptDate).isSame(dayjs(), "day")
                  ? dayjs().startOf("minute")
                  : undefined
              }
              slotProps={{
                popper: { sx: { zIndex: 1400 } },
                textField: {
                  size: "small",
                  sx: {
                    width: "130px",
                    "& .MuiInputBase-root": {
                      fontFamily: "Inter",
                      fontSize: "13px",
                      borderRadius: "8px",
                      height: "40px",
                      paddingRight: "4px",
                    },
                    "& .MuiInputAdornment-positionStart": { display: "none" },
                  },
                },
                openPickerButton: {
                  sx: { color: "#9aa3ae", padding: "4px" },
                },
                openPickerIcon: {
                  sx: { fontSize: "16px" },
                },
              }}
            />
          </Box>
        ) : (
          <Typography sx={{
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {displayTitle}
          </Typography>
        )}

        {!isRescheduling && (
          <Typography sx={{
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            Schedule treatment or recare with smart conflict detection.
          </Typography>
        )}
      </Box>

      {isEditMode ? (
        <Box sx={{ display: 'flex', gap: '8px' }}>
          {!isRescheduling && (
            <Button
              variant="outlined"
              onClick={onReschedule}
              startIcon={<EventRepeatOutlined sx={{ fontSize: "14px" }} />}
              sx={actionBtnStyle}
            >
              Re-schedule
            </Button>
          )}
          {!isShortlistEditMode && (
            <>
              <Button
                variant="outlined"
                onClick={onConvertToShortlist}
                startIcon={<AutoAwesome sx={{ fontSize: "14px" }} />}
                sx={actionBtnStyle}
              >
                Convert to shortlist
              </Button>
              <Button
                variant="outlined"
                onClick={onCopyToShortlist}
                disabled={isCopiedToShortlist}
                startIcon={
                  isCopiedToShortlist
                    ? <CheckCircleOutline sx={{ fontSize: "14px" }} />
                    : <ContentCopyOutlined sx={{ fontSize: "14px" }} />
                }
                sx={{
                  ...actionBtnStyle,
                  ...(isCopiedToShortlist && {
                    borderColor: "#86efac",
                    color: "#16a34a",
                    bgcolor: "#f0fdf4",
                    "&:hover": { borderColor: "#86efac", backgroundColor: "#f0fdf4" },
                    "&.Mui-disabled": {
                      borderColor: "#86efac",
                      color: "#16a34a",
                      bgcolor: "#f0fdf4",
                      opacity: 1,
                    },
                  }),
                }}
              >
                {isCopiedToShortlist ? "Copied to shortlist" : "Copy to shortlist"}
              </Button>
            </>
          )}
        </Box>
      ) : (
        <Button
          variant="outlined"
          onClick={onConvertToShortlist}
          startIcon={<AutoAwesome sx={{ fontSize: "14px" }} />}
          sx={actionBtnStyle}
        >
          Convert to shortlist
        </Button>
      )}

      <IconButton onClick={onCancel} size="small" sx={{ color: "#6b7280", ml: 1 }}>
        <Close sx={{ fontSize: "18px" }} />
      </IconButton>
    </Box>
  );
};

export default AppointmentModalHeader;
