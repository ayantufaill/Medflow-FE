import { createPortal } from "react-dom";
import { Box, Divider, Typography } from "@mui/material";
import {
  CalendarMonth, AccessTime, Person, Email, Phone,
  AcUnit, Tune, LocalOffer, Shield,
} from "@mui/icons-material";

const CARD_WIDTH = 290;
const CARD_MAX_HEIGHT = 540;

/* ── 2-column info row ───────────────────────────────────── */
const InfoRow = ({ label, labelSuffix, children }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: "8px", mb: "7px" }}>
    <Box sx={{ minWidth: "108px", flexShrink: 0 }}>
      <Typography component="span" sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#374151" }}>
        {label}
      </Typography>
      {labelSuffix && (
        <Typography component="span" sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
          {" "}{labelSuffix}
        </Typography>
      )}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {typeof children === "string"
        ? <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151" }}>{children}</Typography>
        : children}
    </Box>
  </Box>
);

/* ── status badge ────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const styles = {
    UNCONFIRMED:  { dot: "#d97706", bg: "#fef3c7", color: "#d97706", label: "Unconfirmed" },
    PRECONFIRMED: { dot: "#7c3aed", bg: "#ede9fe", color: "#7c3aed", label: "Preconfirmed" },
    CONFIRMED:    { dot: "#059669", bg: "#dcfce7", color: "#059669", label: "Confirmed" },
  };
  const s = styles[status] || styles.UNCONFIRMED;
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: "5px", backgroundColor: s.bg, borderRadius: "20px", px: "8px", py: "2px" }}>
      <Box sx={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: s.dot, flexShrink: 0 }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: s.color }}>{s.label}</Typography>
    </Box>
  );
};

/* ── icon + text value ───────────────────────────────────── */
const IconValue = ({ icon, text, color }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <Box sx={{ color: color || "#9aa3ae", display: "flex", flexShrink: 0 }}>{icon}</Box>
    <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
    date:        "07/15/2022",
    startTime:   appointment.time || "09:00 AM",
    endTime:     "10:30 AM",
    charge:      "$224.00",
    scheduledBy: "Jaylen Cuellar",
    notes:       "07/15/2022 : Pt to bring in their DL",
    dob:         "04/20/1990",
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
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e0e5eb",
        overflow: "hidden",
        zIndex: 2000,
      }}
    >
      {/* ── HEADER ── */}
      <Box sx={{ backgroundColor: "#f3f8fd", px: "16px", py: "12px", borderBottom: "1px solid #e8edf3" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "9px", fontWeight: 700, color: "#9aa3ae", letterSpacing: "0.8px", textTransform: "uppercase", mb: "3px" }}>
          Appointment Summary For
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 700, color: "#09121f" }}>
            {appointment.patientName}
          </Typography>
          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
            (pt #{apt.patientId})
          </Typography>
        </Box>
      </Box>

      {/* ── BODY ── */}
      <Box sx={{ px: "16px", py: "12px", maxHeight: CARD_MAX_HEIGHT - 110, overflowY: "auto" }}>

        {/* Appointment Information */}
        <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#09121f", mb: "10px" }}>
          Appointment Information
        </Typography>

        <InfoRow label="Provider:">
          <IconValue icon={<Phone sx={{ fontSize: "12px" }} />} text={apt.provider} color="#2262ef" />
        </InfoRow>

        <InfoRow label="Visit Type:">{apt.visitType}</InfoRow>

        <InfoRow label="Tags:">
          <Box sx={{ display: "flex", gap: "6px" }}>
            <TagCircle bg="#ccfbf1" icon={<AcUnit sx={{ fontSize: "13px", color: "#0d9488" }} />} />
            <TagCircle bg="#fef3c7" icon={<Tune sx={{ fontSize: "13px", color: "#d97706" }} />} />
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
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: "#09121f" }}>
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
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#374151", lineHeight: 1.5 }}>
            – {apt.notes}
          </Typography>
        </InfoRow>

        <Divider sx={{ my: "12px", borderColor: "#f0f2f5" }} />

        {/* Patient Information */}
        <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#09121f", mb: "10px" }}>
          Patient Information
        </Typography>

        <InfoRow label="D.O.B:">{apt.dob}</InfoRow>

        <InfoRow label="Mobile Phone:">
          <IconValue icon={<Phone sx={{ fontSize: "12px" }} />} text={apt.phone} color="#16a34a" />
        </InfoRow>

        <InfoRow label="Email:">
          <IconValue icon={<Email sx={{ fontSize: "12px" }} />} text={apt.email} color="#2262ef" />
        </InfoRow>

        <InfoRow label="Preferred DDS:">{apt.preferredDDS}</InfoRow>
        <InfoRow label="Preferred HYG:">{apt.preferredHYG}</InfoRow>

        <InfoRow label="Risk:">
          <IconValue icon={<Shield sx={{ fontSize: "12px" }} />} text={apt.risk} color="#f59e0b" />
        </InfoRow>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{
        backgroundColor: "#f8fafc",
        px: "16px", py: "10px",
        borderTop: "1px solid #f0f2f5",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderRadius: "0 0 16px 16px",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LocalOffer sx={{ fontSize: "13px", color: "#9aa3ae" }} />
          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
            Balance / Charge
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#16a34a" }}>
          {apt.balance}
        </Typography>
      </Box>
    </Box>,
    document.body,
  );
};

export default AppointmentHoverCard;
