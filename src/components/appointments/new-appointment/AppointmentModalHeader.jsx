import { Box, Button, IconButton, Typography } from "@mui/material";
import { CalendarMonthOutlined, AutoAwesome, Close, EventRepeatOutlined, ContentCopyOutlined } from "@mui/icons-material";

const AppointmentModalHeader = ({ 
  onCancel, 
  onConvertToShortlist, 
  onCopyToShortlist,
  isEditMode,
  patientDisplayName,
  apptDate,
  timeHours,
  timeMins,
  amPm,
  visitType,
  isRescheduling,
  onReschedule
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

  // Use full name if available, otherwise just what we have. Mock up the format exactly like screenshot
  const displayTitle = isEditMode
    ? `${patientDisplayName || "Unknown Patient"}; ${formattedVisitType} on ${formattedDate} @ ${formattedTime}`
    : "Add new patient appointment";

  const actionBtnStyle = {
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "row", padding: "0px 11.8px", borderWidth: "1px",
    fontFamily: "Inter", fontSize: "12px", fontWeight: 500,
    textTransform: "none", borderRadius: "20px",
    borderColor: "#e0e5eb", color: "#09121f", gap: "12px",
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
        <Typography sx={{
          display: "flex", flexDirection: "column", justifyContent: "flex-start",
          alignItems: "flex-start", height: "24px", padding: "0px",
          fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {displayTitle}
        </Typography>
        
        <Typography sx={{
          fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
          textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
        }}>
          Schedule treatment or recare with smart conflict detection.
        </Typography>
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
            startIcon={<ContentCopyOutlined sx={{ fontSize: "14px" }} />}
            sx={actionBtnStyle}
          >
            Copy to shortlist
          </Button>
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
