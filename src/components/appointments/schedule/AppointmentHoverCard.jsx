import { createPortal } from "react-dom";
import { Box, Divider, Typography } from "@mui/material";
import {
  CalendarMonth, AccessTime, Person, Email, Phone,
  AcUnit, Tune, LocalOffer, Shield,
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
    UNCONFIRMED:  { dot: COLORS.STATUS_UNCONFIRMED,  bg: "#fef3c7", color: COLORS.STATUS_UNCONFIRMED,  label: "Unconfirmed" },
    PRECONFIRMED: { dot: COLORS.STATUS_PRECONFIRMED, bg: "#ede9fe", color: COLORS.STATUS_PRECONFIRMED, label: "Preconfirmed" },
    CONFIRMED:    { dot: COLORS.STATUS_CONFIRMED,    bg: "#dcfce7", color: COLORS.STATUS_CONFIRMED,    label: "Confirmed" },
  };
  const s = styles[status] || styles.UNCONFIRMED;
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: "5px", backgroundColor: s.bg, borderRadius: "20px", px: "8px", py: "2px" }}>
      <Box sx={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: s.dot, flexShrink: 0 }} />
      <Typography sx={{ fontSize: fontSize.sm, color: s.color }}>{s.label}</Typography>
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

/* ── tag circle ──────────────────────────────────────────── */
const TagCircle = ({ icon, bg }) => (
  <Box sx={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {icon}
  </Box>
);

/* ═══════════════════════════════════════════════════════════ */
const AppointmentHoverCard = ({ appointment, anchorRect, onMouseEnter, onMouseLeave }) => {
  /* Position: prefer right, fall back to left, clamp top */
  const spaceRight = window.innerWidth - anchorRect.right;
  const left = spaceRight >= CARD_WIDTH + 16
    ? anchorRect.right + 8
    : anchorRect.left - CARD_WIDTH - 8;
  const top = Math.max(8, Math.min(anchorRect.top, window.innerHeight - CARD_MAX_HEIGHT - 8));

  /* Derive display values from appointment + mock patient data */
  const apt = {
    patientId:   "765",
    provider:    "Sharon Smith",
    visitType:   "Recare",
    date:        "Jul 15, 2022",
    startTime:   appointment.time || "09:00 AM",
    endTime:     "10:30 AM",
    charge:      "$224.00",
    scheduledBy: "Jaylen Cuellar",
    notes:       "Jul 15, 2022 : Pt to bring in their DL",
    dob:         "Apr 20, 1990",
    phone:       "+1 855 849 5255",
    email:       "jaylen@oryxdentalsoftware.c",
    preferredDDS: "—",
    preferredHYG: "—",
    risk:        "—",
    procedures:  appointment.procedures || "comp ex, hygiene, fl, BW4, PA1",
    balance:     appointment.price || "$224.00 / $224.00",
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
            {appointment.patientName}
          </Typography>
          <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
            (pt #{apt.patientId})
          </Typography>
        </Box>
      </Box>

      {/* ── BODY ── */}
      <Box sx={{ px: "16px", py: "12px", maxHeight: CARD_MAX_HEIGHT - 110, overflowY: "auto" }}>

        {/* Appointment Information */}
        <Typography sx={{ ...headingSecondarySx, fontWeight: fontWeight.bold, mb: "10px" }}>
          Appointment Information
        </Typography>

        <InfoRow label="Provider:">
          <IconValue icon={<Phone sx={{ fontSize: "12px" }} />} text={apt.provider} color={COLORS.ACCENT} />
        </InfoRow>

        <InfoRow label="Visit Type:">{apt.visitType}</InfoRow>

        <InfoRow label="Tags:">
          <Box sx={{ display: "flex", gap: "6px" }}>
            <TagCircle bg="#ccfbf1" icon={<AcUnit sx={{ fontSize: "13px", color: "#0d9488" }} />} />
            <TagCircle bg="#fef3c7" icon={<Tune sx={{ fontSize: "13px", color: COLORS.STATUS_UNCONFIRMED }} />} />
          </Box>
        </InfoRow>

        <InfoRow label="Procedures:">{apt.procedures}</InfoRow>

        <InfoRow label="Date:">
          <IconValue icon={<CalendarMonth sx={{ fontSize: "12px" }} />} text={apt.date} />
        </InfoRow>

        <InfoRow label="Start time:">
          <IconValue icon={<AccessTime sx={{ fontSize: "12px" }} />} text={apt.startTime} />
        </InfoRow>

        <Box sx={{ my: "8px" }} />

        <InfoRow label="End time:">{apt.endTime}</InfoRow>

        <InfoRow label="Charge:">
          <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
            {apt.charge}
          </Typography>
        </InfoRow>

        <InfoRow label="Status:">
          <StatusBadge status={appointment.status} />
        </InfoRow>

        <InfoRow label="Scheduled By:">
          <IconValue icon={<Person sx={{ fontSize: "13px" }} />} text={apt.scheduledBy} />
        </InfoRow>

        <InfoRow label="Notes" labelSuffix="(latest):">
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY, lineHeight: 1.5 }}>
            – {apt.notes}
          </Typography>
        </InfoRow>

        <Divider sx={{ my: "12px", borderColor: COLORS.BORDER_LIGHT }} />

        {/* Patient Information */}
        <Typography sx={{ ...headingSecondarySx, fontWeight: fontWeight.bold, mb: "10px" }}>
          Patient Information
        </Typography>

        <InfoRow label="D.O.B:">{apt.dob}</InfoRow>

        <InfoRow label="Mobile Phone:">
          <IconValue icon={<Phone sx={{ fontSize: "12px" }} />} text={apt.phone} color={COLORS.STATUS_SUCCESS} />
        </InfoRow>

        <InfoRow label="Email:">
          <IconValue icon={<Email sx={{ fontSize: "12px" }} />} text={apt.email} color={COLORS.ACCENT} />
        </InfoRow>

        <InfoRow label="Preferred DDS:">{apt.preferredDDS}</InfoRow>
        <InfoRow label="Preferred HYG:">{apt.preferredHYG}</InfoRow>

        <InfoRow label="Risk:">
          <IconValue icon={<Shield sx={{ fontSize: "12px" }} />} text={apt.risk} color="#f59e0b" />
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
          <LocalOffer sx={{ fontSize: "13px", color: COLORS.TEXT_MUTED }} />
          <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
            Balance / Charge
          </Typography>
        </Box>
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.bold, color: COLORS.PRICE_TEXT }}>
          {apt.balance}
        </Typography>
      </Box>
    </Box>,
    document.body,
  );
};

export default AppointmentHoverCard;
