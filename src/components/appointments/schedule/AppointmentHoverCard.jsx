import { createPortal } from "react-dom";
import dayjs from "dayjs";
import { Box, Divider, Typography } from "@mui/material";
import {
  CalendarTodayOutlined, AccessTimeOutlined, PersonOutline, EmailOutlined, PhoneOutlined,
  LocalOfferOutlined, GppMaybeOutlined, MedicalServicesOutlined,
} from "@mui/icons-material";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight, radius, headingPrimarySx, headingSecondarySx } from "../../../constants/styles";

const CARD_WIDTH = 290;
const CARD_MAX_HEIGHT = 540;

/* ── 2-column info row ───────────────────────────────────── */
const InfoRow = ({ label, labelSuffix, children }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px", mb: "7px" }}>
    <Box sx={{ minWidth: "108px", flexShrink: 0 }}>
      <Typography component="span" sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_BODY }}>
        {label}
      </Typography>
      {labelSuffix && (
        <Typography component="span" sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
          {" "}{labelSuffix}
        </Typography>
      )}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {typeof children === "string"
        ? <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>{children}</Typography>
        : children}
    </Box>
  </Box>
);

/* ── status badge ────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const styles = {
    SCHEDULED:               { dot: "#64748b", bg: "#f1f5f9", color: "#475569" },
    UNCONFIRMED:             { dot: COLORS.STATUS_UNCONFIRMED, bg: "#fef3c7", color: COLORS.STATUS_UNCONFIRMED },
    PRECONFIRMED:            { dot: COLORS.STATUS_PRECONFIRMED, bg: "#ede9fe", color: COLORS.STATUS_PRECONFIRMED },
    CONFIRMED:               { dot: COLORS.STATUS_CONFIRMED, bg: "#dcfce7", color: COLORS.STATUS_CONFIRMED },
    ARRIVED:                 { dot: "#0284c7", bg: "#e0f2fe", color: "#0369a1" },
    READY_TO_BE_SEATED:      { dot: "#0891b2", bg: "#cffafe", color: "#0e7490" },
    SEATED:                  { dot: "#2563eb", bg: "#dbeafe", color: "#1d4ed8" },
    READY_FOR_DOCTOR:        { dot: "#7c3aed", bg: "#ede9fe", color: "#6d28d9" },
    IN_TREATMENT:            { dot: "#0d9488", bg: "#ccfbf1", color: "#0f766e" },
    READY_FOR_CHECKOUT:      { dot: "#16a34a", bg: "#dcfce7", color: "#15803d" },
    CHECKED_OUT_INCOMPLETE:  { dot: "#ea580c", bg: "#ffedd5", color: "#c2410c" },
    CHECKED_OUT_COMPLETE:    { dot: "#22c55e", bg: "#dcfce7", color: "#15803d" },
    COMPLETED:               { dot: "#22c55e", bg: "#dcfce7", color: "#15803d" },
    NO_SHOW:                 { dot: "#dc2626", bg: "#fee2e2", color: "#b91c1c" },
    CANCELLED:               { dot: "#dc2626", bg: "#fee2e2", color: "#b91c1c" },
    RESCHEDULED:             { dot: "#9333ea", bg: "#f3e8ff", color: "#7e22ce" },
    RUNNING_LATE:            { dot: "#d97706", bg: "#fef3c7", color: "#b45309" },
    LATE:                    { dot: "#d97706", bg: "#fef3c7", color: "#b45309" },
    CALL:                    { dot: "#2563eb", bg: "#dbeafe", color: "#1d4ed8" },
    LEFT_MESSAGE:            { dot: "#64748b", bg: "#f1f5f9", color: "#475569" },
    SENT_EMAIL_OR_TEXT:      { dot: "#0891b2", bg: "#cffafe", color: "#0e7490" },
  };
  const key = String(status || "").toUpperCase();
  const label = key
    ? key.toLowerCase().split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    : "Unknown";
  const s = styles[key] || { dot: "#64748b", bg: "#f1f5f9", color: "#475569" };
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: "5px", backgroundColor: s.bg, borderRadius: "20px", px: "8px", py: "2px" }}>
      <Box sx={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: s.dot, flexShrink: 0 }} />
      <Typography sx={{ fontSize: fontSize.sm, color: s.color }}>{label}</Typography>
    </Box>
  );
};

/* ── icon + text value ───────────────────────────────────── */
const IconValue = ({ icon, text, color }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <Box sx={{ color: color || COLORS.TEXT_MUTED, display: "flex", flexShrink: 0 }}>{icon}</Box>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {text}
    </Typography>
  </Box>
);

const EMPTY_VALUE = "—";

const displayValue = (value) => value || EMPTY_VALUE;

const getTagLabel = (tag) => (typeof tag === "object" && tag !== null ? tag.label : tag);

const getTagStyle = (tag) => {
  if (typeof tag === "object" && tag !== null && tag.color) {
    return { bg: tag.color, color: tag.font || COLORS.WHITE, border: "none" };
  }

  const label = getTagLabel(tag);
  if (label === "EXM" || label === "Exm") return { bg: "#92400e", color: COLORS.WHITE, border: "none" };
  if (label === "Xray") return { bg: "#1f2937", color: COLORS.WHITE, border: "none" };
  return { bg: COLORS.WHITE, color: "#374151", border: "1px solid #d1d5db" };
};

const providerDisplay = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name
    || value.fullName
    || `${value.firstName || ""} ${value.lastName || ""}`.trim()
    || `${value.userId?.firstName || ""} ${value.userId?.lastName || ""}`.trim()
    || value.providerName
    || value.providerCode
    || "";
};

const formatProcedures = (procedures) => {
  if (Array.isArray(procedures)) {
    return procedures
      .map((procedure) => {
        if (typeof procedure === "string") return procedure;
        return procedure.treatment || procedure.name || procedure.code || procedure.ProcCode || procedure.Descript || "";
      })
      .filter(Boolean)
      .join(", ");
  }

  return procedures;
};

/* ═══════════════════════════════════════════════════════════ */
const AppointmentHoverCard = ({
  appointment,
  anchorRect,
  onMouseEnter,
  onMouseLeave,
  privacyMode,
}) => {
  /* Position: prefer right, fall back to left, clamp top */
  const spaceRight = window.innerWidth - anchorRect.right;
  const left = spaceRight >= CARD_WIDTH + 16
    ? anchorRect.right + 8
    : anchorRect.left - CARD_WIDTH - 8;
  const top = Math.max(8, Math.min(anchorRect.top, window.innerHeight - CARD_MAX_HEIGHT - 8));

  const noteText = appointment.description || appointment.notes || "";
  const appointmentDate = appointment.date || (appointment.appointmentDate ? dayjs(appointment.appointmentDate).format("MMM D, YYYY") : "");
  const tags = Array.isArray(appointment.tags) ? appointment.tags : [];
  const provider = providerDisplay(appointment.provider || appointment.providerId);

  const apt = {
    patientId:    appointment.patientNumber,
    patientName:  appointment.patientName,
    provider,
    visitType:    appointment.visitType,
    date:         appointmentDate,
    startTime:    appointment.time,
    endTime:      appointment.endTime,
    charge:       appointment.price,
    scheduledBy:  appointment.scheduledBy,
    notes:        noteText,
    dob:          appointment.patientDob,
    phone:        appointment.patientPhone,
    email:        appointment.patientEmail,
    preferredDDS: providerDisplay(appointment.preferredDDS),
    preferredHYG: providerDisplay(appointment.preferredHYG),
    risk:         appointment.risk,
    procedures:   formatProcedures(appointment.procedures),
    balance:      appointment.price,
  };

  return createPortal(
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        position: "fixed", top, left,
        width: CARD_WIDTH,
        backgroundColor: COLORS.SURFACE_CARD,
        borderRadius: radius.xl,
        boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
        border: `1px solid ${COLORS.BORDER}`,
        overflow: "hidden",
        zIndex: 2000,
      }}
    >
      {/* ── HEADER ── */}
      <Box sx={{ backgroundColor: COLORS.SURFACE_TINT, px: "16px", py: "12px", borderBottom: `1px solid #e8edf3` }}>
        <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: COLORS.TEXT_MUTED, letterSpacing: "0.8px", textTransform: "uppercase", mb: "3px" }}>
          Appointment Summary For
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <Typography sx={{ ...headingPrimarySx }}>
            {privacyMode ? "•••• ••••" : appointment.patientName}
          </Typography>
          {apt.patientId && (
            <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
              (pt #{privacyMode ? "****" : apt.patientId})
            </Typography>
          )}
        </Box>
      </Box>

      {/* ── BODY ── */}
      <Box sx={{ px: "16px", py: "12px", maxHeight: CARD_MAX_HEIGHT - 110, overflowY: "auto" }}>

        {/* Appointment Information */}
        <Typography sx={{ ...headingSecondarySx, fontWeight: fontWeight.bold, mb: "10px" }}>
          Appointment Information
        </Typography>

        <InfoRow label="Provider:">
          <IconValue icon={<MedicalServicesOutlined sx={{ fontSize: "12px" }} />} text={displayValue(apt.provider)} color={COLORS.ACCENT} />
        </InfoRow>

        <InfoRow label="Visit Type:">{displayValue(apt.visitType)}</InfoRow>

        <InfoRow label="Tags:">
          <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {tags.length > 0 ? tags.map((tag, i) => {
              const { bg, color, border } = getTagStyle(tag);
              return (
                <Box key={i} sx={{ px: "8px", py: "3px", borderRadius: "4px", backgroundColor: bg, border }}>
                  <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color }}>
                    {getTagLabel(tag)}
                  </Typography>
                </Box>
              );
            }) : (
              <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY }}>{EMPTY_VALUE}</Typography>
            )}
          </Box>
        </InfoRow>

        <InfoRow label="Procedures:">{displayValue(apt.procedures)}</InfoRow>

        <InfoRow label="Date:">
          <IconValue icon={<CalendarTodayOutlined sx={{ fontSize: "12px" }} />} text={displayValue(apt.date)} />
        </InfoRow>

        <InfoRow label="Start time:">
          <IconValue icon={<AccessTimeOutlined sx={{ fontSize: "12px" }} />} text={displayValue(apt.startTime)} />
        </InfoRow>

        <Box sx={{ my: "8px" }} />

        <InfoRow label="End time:">{displayValue(apt.endTime)}</InfoRow>

        <InfoRow label="Charge:">
          <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
            {displayValue(apt.charge)}
          </Typography>
        </InfoRow>

        <InfoRow label="Status:">
          <StatusBadge status={appointment.status} />
        </InfoRow>

        <InfoRow label="Scheduled By:">
          <IconValue icon={<PersonOutline sx={{ fontSize: "13px" }} />} text={displayValue(apt.scheduledBy)} />
        </InfoRow>

        <InfoRow label="Notes" labelSuffix="(latest):">
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY, lineHeight: 1.5 }}>
            {displayValue(apt.notes)}
          </Typography>
        </InfoRow>

        <Divider sx={{ my: "12px", borderColor: COLORS.BORDER_LIGHT }} />

        {/* Patient Information */}
        <Typography sx={{ ...headingSecondarySx, fontWeight: fontWeight.bold, mb: "10px" }}>
          Patient Information
        </Typography>

        <InfoRow label="Patient:">{privacyMode ? "•••• ••••" : displayValue(apt.patientName)}</InfoRow>

        <InfoRow label="D.O.B:">{privacyMode ? "•••• ••••" : displayValue(apt.dob)}</InfoRow>

        <InfoRow label="Mobile Phone:">
          <IconValue icon={<PhoneOutlined sx={{ fontSize: "12px" }} />} text={privacyMode ? "••••••••••" : displayValue(apt.phone)} color={COLORS.STATUS_SUCCESS} />
        </InfoRow>

        <InfoRow label="Email:">
          <IconValue icon={<EmailOutlined sx={{ fontSize: "12px" }} />} text={privacyMode ? "••••••••••" : displayValue(apt.email)} color={COLORS.ACCENT} />
        </InfoRow>

        <InfoRow label="Preferred DDS:">{displayValue(apt.preferredDDS)}</InfoRow>
        <InfoRow label="Preferred HYG:">{displayValue(apt.preferredHYG)}</InfoRow>

        <InfoRow label="Risk:">
          <IconValue icon={<GppMaybeOutlined sx={{ fontSize: "12px" }} />} text={displayValue(apt.risk)} color="#f59e0b" />
        </InfoRow>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{
        backgroundColor: COLORS.SURFACE_FOOTER,
        px: "16px", py: "10px",
        borderTop: `1px solid ${COLORS.BORDER_LIGHT}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderRadius: `0 0 ${radius.xl} ${radius.xl}`,
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LocalOfferOutlined sx={{ fontSize: "13px", color: COLORS.TEXT_MUTED }} />
          <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
            Balance / Charge
          </Typography>
        </Box>
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.bold, color: COLORS.PRICE_TEXT }}>
          {displayValue(apt.balance)}
        </Typography>
      </Box>
    </Box>,
    document.body,
  );
};

export default AppointmentHoverCard;
