import dayjs from "dayjs";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CallIcon from "@mui/icons-material/Call";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import EmergencyIcon from "@mui/icons-material/Emergency";

/**
 * AppointmentCard Component
 * Renders an individual appointment card with all its content and actions
 * @param {Object} props - Component props
 * @param {Object} props.appointment - Appointment data
 * @param {string} props.viewMode - 'day' or 'week'/'month'
 * @param {boolean} props.isShortAppointment - Duration <= 30 min
 * @param {boolean} props.isUltraCompact - Duration 40-60 min
 * @param {boolean} props.isCompactAppointment - Duration 70-80 min
 * @param {string} props.statusColor - Status color for the appointment
 * @param {number} props.topPx - Top position in pixels
 * @param {number} props.heightPx - Height in pixels
 * @param {number} props.finalHeight - Final calculated height
 * @param {Function} props.minutesSinceStart - Helper function
 * @param {Function} props.onAppointmentClick - Click handler
 */
const AppointmentCard = ({
  appointment,
  viewMode = "day",
  isShortAppointment,
  isUltraCompact,
  isCompactAppointment,
  statusColor,
  topPx,
  heightPx,
  finalHeight,
  minutesSinceStart,
  onAppointmentClick,
  isNewAppointment = false,
}) => {
  // Calculate responsive sizing values
  const sizing = {
    padding: isUltraCompact ? 0.3 : isCompactAppointment ? 0.5 : 1,
    iconSize: isShortAppointment ? 10 : isUltraCompact ? 11 : isCompactAppointment ? 12 : 14,
    fontSize: {
      patientName: isShortAppointment ? 8 : isUltraCompact ? 9 : isCompactAppointment ? 10 : 11,
      time: isShortAppointment ? 6.5 : isUltraCompact ? 7 : isCompactAppointment ? 8 : 9,
      status: isShortAppointment ? 5.5 : isUltraCompact ? 6 : isCompactAppointment ? 7 : 8,
      procedures: isShortAppointment ? 7 : isUltraCompact ? 8 : isCompactAppointment ? 9 : 10,
      tags: isShortAppointment ? 5.5 : isUltraCompact ? 6 : isCompactAppointment ? 7 : 8,
      note: isShortAppointment ? 6.5 : isUltraCompact ? 7 : isCompactAppointment ? 8 : 9,
    },
    spacing: {
      headerPx: isUltraCompact ? 0.4 : isCompactAppointment ? 0.6 : 0.75,
      headerPy: isUltraCompact ? 0.25 : isCompactAppointment ? 0.35 : 0.5,
      contentGap: isUltraCompact ? 0.2 : isCompactAppointment ? 0.3 : 0.5,
      contentMt: isUltraCompact ? 0.2 : isCompactAppointment ? 0.3 : 0.5,
      tagsGap: isUltraCompact ? 0.15 : isCompactAppointment ? 0.2 : 0.3,
      tagsMt: isUltraCompact ? 0.15 : isCompactAppointment ? 0.2 : 0.3,
      emergencyMt: isUltraCompact ? 0.2 : isCompactAppointment ? 0.3 : 0.5,
      emergencyMr: isUltraCompact ? 0.5 : isCompactAppointment ? 0.75 : 1,
      noteMt: isUltraCompact ? 0.1 : isCompactAppointment ? 0.15 : 0.2,
    },
    zebraHeight: isUltraCompact ? "12px" : isCompactAppointment ? "14px" : "16px",
    zebraMargin: isUltraCompact ? -0.3 : isCompactAppointment ? -0.5 : -1,
    actionColumnWidth: isUltraCompact ? 24 : isCompactAppointment ? 26 : 28,
    actionGap: isUltraCompact ? 0.1 : isCompactAppointment ? 0.15 : 0.2,
    actionPt: isUltraCompact ? 0.2 : isCompactAppointment ? 0.3 : 0.5,
  };

  return (
    <Paper
      elevation={2}
      onClick={(e) => {
        e.stopPropagation();
        onAppointmentClick && onAppointmentClick(appointment);
      }}
      sx={{
        position: "absolute",
        left: "5%",
        right: "5%",
        top: topPx + 2,
        height: finalHeight - 4,
        borderRadius: 1.5,
        bgcolor: "#ffffff",
        color: "#000000",
        p: 0,
        cursor: "pointer",
        transition: isNewAppointment 
          ? "transform 0.1s, box-shadow 0.1s, border 0.3s ease-out"
          : "transform 0.1s, box-shadow 0.1s",
        overflow: "hidden",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        },
        ...(isNewAppointment && {
          border: "3px solid #4CAF50",
          boxShadow: "0 0 20px rgba(76, 175, 80, 0.5), 0 0 40px rgba(76, 175, 80, 0.3)",
          animation: "pulse-green 2s ease-in-out infinite",
          "@keyframes pulse-green": {
            "0%": {
              boxShadow: "0 0 20px rgba(76, 175, 80, 0.5), 0 0 40px rgba(76, 175, 80, 0.3)",
            },
            "50%": {
              boxShadow: "0 0 30px rgba(76, 175, 80, 0.8), 0 0 60px rgba(76, 175, 80, 0.5)",
            },
            "100%": {
              boxShadow: "0 0 20px rgba(76, 175, 80, 0.5), 0 0 40px rgba(76, 175, 80, 0.3)",
            },
          },
        }),
        display: "flex",
        flexDirection: "row",
        border: isNewAppointment ? "none" : "none",
      }}
    >
      {/* Left Column - All Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppointmentHeader
          appointment={appointment}
          isShortAppointment={isShortAppointment}
          isUltraCompact={isUltraCompact}
          isCompactAppointment={isCompactAppointment}
          sizing={sizing}
        />

        <AppointmentStatusBand
          status={appointment.status}
          statusColor={statusColor}
          isUltraCompact={isUltraCompact}
          isCompactAppointment={isCompactAppointment}
          zebraHeight={sizing.zebraHeight}
          zebraMargin={sizing.zebraMargin}
        />

        <AppointmentContent
          appointment={appointment}
          isShortAppointment={isShortAppointment}
          isUltraCompact={isUltraCompact}
          isCompactAppointment={isCompactAppointment}
          statusColor={statusColor}
          sizing={sizing}
        />
      </Box>

      {/* Right Column - Action Icons */}
      <AppointmentActions
        isShortAppointment={isShortAppointment}
        isUltraCompact={isUltraCompact}
        isCompactAppointment={isCompactAppointment}
        sizing={sizing}
      />
    </Paper>
  );
};

/**
 * AppointmentHeader Component
 * Renders the patient name and time section
 */
const AppointmentHeader = ({
  appointment,
  isShortAppointment,
  isUltraCompact,
  isCompactAppointment,
  sizing,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        mb: 0,
        pb: 0,
        borderBottom: "none",
        width: "100%",
      }}
    >
      {/* Patient Name Box */}
      <Box
        sx={{
          flex: "1 1 0",
          minWidth: 0,
          bgcolor: "#a67398",
          px: sizing.spacing.headerPx,
          py: sizing.spacing.headerPy,
          borderRadius: "4px 0 0 0",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: sizing.fontSize.patientName,
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#ebe2e7ff",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {appointment.patientName || "John Doe"}
        </Typography>
      </Box>

      {/* Time Box */}
      <Box
        sx={{
          flex: "1 1 0",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: sizing.spacing.headerGap || (isUltraCompact ? 0.15 : isCompactAppointment ? 0.2 : 0.3),
          bgcolor: "#a2b9d6",
          px: sizing.spacing.headerPx,
          py: sizing.spacing.headerPy,
          borderRadius: "0",
        }}
      >
        <AccessTimeIcon sx={{ fontSize: sizing.iconSize, color: "#ffffff" }} />
        <Typography
          sx={{
            fontSize: sizing.fontSize.time,
            opacity: 0.9,
            lineHeight: 1,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          {dayjs(appointment.start).format("h:mm A")}
        </Typography>
      </Box>
    </Box>
  );
};

/**
 * AppointmentStatusBand Component
 * Renders the animated zebra stripe band with status
 */
const AppointmentStatusBand = ({
  status,
  statusColor,
  isUltraCompact,
  isCompactAppointment,
  zebraHeight,
  zebraMargin,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        height: zebraHeight,
        mt: 0,
        mx: zebraMargin,
        mr: 0,
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
          fontSize: isUltraCompact ? 6 : isCompactAppointment ? 7 : 8,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "#ffffff",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {(status || "unconfirmed").toUpperCase()}
      </Typography>
    </Box>
  );
};

/**
 * AppointmentContent Component
 * Renders procedures, status indicators, tags, and notes
 */
const AppointmentContent = ({
  appointment,
  isShortAppointment,
  isUltraCompact,
  isCompactAppointment,
  statusColor,
  sizing,
}) => {
  return (
    <>
      {/* Disease/Procedure Names with Status Indicators */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: sizing.spacing.contentGap,
          mt: sizing.spacing.contentMt,
          px: sizing.padding,
        }}
      >
        <Typography
          sx={{
            fontSize: sizing.fontSize.procedures,
            lineHeight: 1.2,
            color: "#64748b",
            textTransform: "lowercase",
            flex: 1,
            minWidth: 0,
          }}
        >
          {appointment.procedures || appointment.diseases || "hygiene, periodic ex, fl"}
        </Typography>

        {/* Status & Action Indicators */}
        <Box sx={{ display: "flex", gap: 0, alignItems: "center", flexShrink: 0 }}>
          {/* Status Indicator (Solid Circle) */}
          <Box
            sx={{
              width: isUltraCompact ? 8 : isCompactAppointment ? 10 : 12,
              height: isUltraCompact ? 8 : isCompactAppointment ? 10 : 12,
              borderRadius: "50%",
              bgcolor: statusColor,
              flexShrink: 0,
              mr: isUltraCompact ? 0.15 : isCompactAppointment ? 0.2 : 0.3,
            }}
          />

          {/* Document/Note Icon */}
          <IconButton size="small" sx={{ p: isUltraCompact ? 0.1 : isCompactAppointment ? 0.15 : 0.2, minWidth: isUltraCompact ? 16 : isCompactAppointment ? 18 : 20, mx: 0 }}>
            <EventNoteIcon sx={{ fontSize: sizing.iconSize, color: "#757575" }} />
          </IconButton>

          {/* Dollar Sign Icon (Financial Status) */}
          <IconButton size="small" sx={{ p: isUltraCompact ? 0.1 : isCompactAppointment ? 0.15 : 0.2, minWidth: isUltraCompact ? 16 : isCompactAppointment ? 18 : 20, mx: 0 }}>
            <AttachMoneyIcon sx={{ fontSize: sizing.iconSize, color: "#4caf50" }} />
          </IconButton>

          {/* Tx Icon (Treatment Plan) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: isUltraCompact ? 16 : isCompactAppointment ? 18 : 20,
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.1)",
              },
              transition: "transform 0.2s",
            }}
          >
            <Typography
              sx={{
                fontSize: isUltraCompact ? 8 : isCompactAppointment ? 9 : 10,
                fontWeight: 700,
                color: "#1976d2",
                lineHeight: 1,
              }}
            >
              Tx
            </Typography>
          </Box>

          {/* Tooth Outline Icon (Charting) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: isUltraCompact ? 16 : isCompactAppointment ? 18 : 20,
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.1)",
              },
              transition: "transform 0.2s",
            }}
          >
            <Typography sx={{ fontSize: isUltraCompact ? 11 : isCompactAppointment ? 12 : 14 }}>
              🦷
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Appointment Status Tags */}
      <Box
        sx={{
          display: "flex",
          gap: sizing.spacing.tagsGap,
          mt: sizing.spacing.tagsMt,
          flexWrap: "wrap",
          alignItems: "center",
          px: sizing.padding,
        }}
      >
        <StatusTag label="EXM" bgColor="#fff3e0" borderColor="#ffe0b2" textColor="#e65100" fontSize={sizing.fontSize.tags} />
        <StatusTag label="HYG" bgColor="#e3f2fd" borderColor="#bbdefb" textColor="#1565c0" fontSize={sizing.fontSize.tags} />
        <StatusTag label="ASAP" bgColor="#ffebee" borderColor="#ffcdd2" textColor="#c62828" fontSize={sizing.fontSize.tags} bold />
        <StatusTag label="PRE" bgColor="#f3e5f5" borderColor="#e1bee7" textColor="#6a1b9a" fontSize={sizing.fontSize.tags} />
      </Box>

      {/* Emergency Icon Row */}
      <Box
        sx={{
          display: "flex",
          mt: sizing.spacing.emergencyMt,
          justifyContent: "flex-end",
          mr: sizing.spacing.emergencyMr,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: sizing.padding,
            py: isUltraCompact ? 0.1 : isCompactAppointment ? 0.15 : 0.2,
            bgcolor: "#e0f2f1",
            borderRadius: "4px",
            border: "1px solid #b2dfdb",
          }}
        >
          <EmergencyIcon sx={{ fontSize: isUltraCompact ? 12 : isCompactAppointment ? 14 : 16, color: "#00695c" }} />
        </Box>
      </Box>

      {/* Note (if exists) */}
      {appointment.note && (
        <Typography
          sx={{
            mt: sizing.spacing.noteMt,
            fontSize: sizing.fontSize.note,
            color: "#757575",
            display: "flex",
            alignItems: "center",
            gap: isUltraCompact ? 0.15 : isCompactAppointment ? 0.2 : 0.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            px: sizing.padding,
          }}
        >
          <EventNoteIcon sx={{ fontSize: sizing.fontSize.note }} />
          {appointment.note}
        </Typography>
      )}
    </>
  );
};

/**
 * StatusTag Component
 * Renders individual status tag badges
 */
const StatusTag = ({ label, bgColor, borderColor, textColor, fontSize, bold = false }) => {
  return (
    <Box
      sx={{
        px: 0.3,
        py: 0.05,
        bgcolor: bgColor,
        borderRadius: "2px",
        border: "1px solid borderColor",
      }}
    >
      <Typography
        sx={{
          fontSize: fontSize,
          fontWeight: bold ? 700 : 600,
          color: textColor,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

/**
 * AppointmentActions Component
 * Renders the right column action buttons
 */
const AppointmentActions = ({
  isShortAppointment,
  isUltraCompact,
  isCompactAppointment,
  sizing,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        pt: sizing.actionPt,
        gap: sizing.actionGap,
        width: sizing.actionColumnWidth,
        flexShrink: 0,
        bgcolor: "#b8d7f4ff",
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
        }}
        sx={{
          p: isUltraCompact ? 0.2 : isCompactAppointment ? 0.3 : 0.4,
          minWidth: isUltraCompact ? 20 : isCompactAppointment ? 22 : 24,
          height: isUltraCompact ? 20 : isCompactAppointment ? 22 : 24,
          bgcolor: "transparent",
          borderRadius: isUltraCompact ? 0.75 : isCompactAppointment ? 1 : 1.25,
          color: "#1976d2",
          "&:hover": {
            bgcolor: "rgba(25, 118, 210, 0.08)",
            transform: "scale(1.1)",
          },
          transition: "all 0.2s",
        }}
      >
        <CallIcon sx={{ fontSize: sizing.iconSize }} />
      </IconButton>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
        }}
        sx={{
          p: isUltraCompact ? 0.2 : isCompactAppointment ? 0.3 : 0.4,
          minWidth: isUltraCompact ? 20 : isCompactAppointment ? 22 : 24,
          height: isUltraCompact ? 20 : isCompactAppointment ? 22 : 24,
          bgcolor: "transparent",
          borderRadius: isUltraCompact ? 0.75 : isCompactAppointment ? 1 : 1.25,
          color: "#4a6da7",
          "&:hover": {
            bgcolor: "rgba(74, 109, 167, 0.08)",
            transform: "scale(1.1)",
          },
          transition: "all 0.2s",
        }}
      >
        <ScreenShareIcon sx={{ fontSize: sizing.iconSize }} />
      </IconButton>
    </Box>
  );
};

export default AppointmentCard;
