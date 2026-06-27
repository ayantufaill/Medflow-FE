import { createPortal } from "react-dom";
import {
  Box, Chip, Divider, IconButton, InputAdornment,
  MenuItem, Select, Typography,
} from "@mui/material";
import {
  Close, AttachMoney, People, Refresh,
  NoteAlt, Sell, LocalHospital,
  Email, Phone, ChatBubbleOutline,
  KeyboardArrowDown, PlaceOutlined, AutoAwesome,
  RadioButtonUnchecked, LinkOutlined, MonitorHeart, StarBorder,
  PersonOutlined, CalendarMonth, WarningAmber,
} from "@mui/icons-material";

/* ── section label ──────────────────────────────────────── */
const SL = ({ children }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "9px", fontWeight: 700, color: "#9aa3ae", letterSpacing: "0.7px", mb: "4px", textTransform: "uppercase" }}>
    {children}
  </Typography>
);

/* ── action icon button in header ──────────────────────── */
const ActionBtn = ({ icon, title, active }) => (
  <IconButton title={title} size="small" sx={{
    width: "26px", height: "26px", borderRadius: "6px", p: 0,
    color: active ? "#2262ef" : "#6b7280",
    backgroundColor: active ? "rgba(34,98,239,0.10)" : "transparent",
    "& .MuiSvgIcon-root": { fontSize: "15px" },
    "&:hover": { backgroundColor: active ? "rgba(34,98,239,0.15)" : "rgba(0,0,0,0.06)" },
  }}>
    {icon}
  </IconButton>
);

/* ── letter badge ───────────────────────────────────────── */
const BADGE_STYLES = {
  P: { bg: "#dbeafe", text: "#2262ef" },
  H: { bg: "#dcfce7", text: "#16a34a" },
  T: { bg: "#fef3c7", text: "#d97706" },
};
const Badge = ({ letter }) => {
  const s = BADGE_STYLES[letter] || { bg: "#f1f5f9", text: "#64748b" };
  return (
    <Box sx={{
      px: "7px", height: "20px", borderRadius: "10px",
      backgroundColor: s.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Typography sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: s.text }}>
        {letter}
      </Typography>
    </Box>
  );
};

/* ── vertical divider for header ────────────────────────── */
const VDiv = () => (
  <Box sx={{ width: "1px", height: "22px", backgroundColor: "#dde1e7", flexShrink: 0, mx: "2px" }} />
);

/* ── note line with icon ────────────────────────────────── */
const NoteLine = ({ icon, text, iconColor }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "4px" }}>
    <Box sx={{ color: iconColor || "#9aa3ae", display: "flex", alignItems: "center", flexShrink: 0 }}>
      {icon}
    </Box>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>{text}</Typography>
  </Box>
);

/* ── contact info line ──────────────────────────────────── */
const ContactLine = ({ icon, text, color }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "4px", overflow: "hidden" }}>
    <Box sx={{ color: color || "#9aa3ae", display: "flex", flexShrink: 0 }}>{icon}</Box>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: color || "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {text}
    </Typography>
  </Box>
);

/* ── appointment block ──────────────────────────────────── */
const ApptBlock = ({ label, date, time, provider, icon }) => (
  <Box sx={{ flex: 1 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: "4px", mb: "3px" }}>
      {icon && <Box sx={{ color: "#9aa3ae", display: "flex", flexShrink: 0 }}>{icon}</Box>}
      <SL style={{ mb: 0 }}>{label}</SL>
    </Box>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#09121f" }}>
      {date} · {time}
    </Typography>
    {provider && (
      <Typography sx={{ fontFamily: "Inter", fontSize: "10px", color: "#9aa3ae", mt: "1px" }}>{provider}</Typography>
    )}
  </Box>
);

/* ═══════════════════════════════════════════════════════════ */
const PatientSlider = ({ open, onClose, patient }) => {
  const pt = patient || {
    name: "Ali Tariq",
    id: "765",
    chartRef: "#K7007 · 4.3y",
    dob: "04/20/1990",
    age: 32,
    email: "jaylen@oryxdentalsoftware.com",
    phone: "+1 (855) 849-5255",
    familyMembersCount: 1,
    familyBalance: "$0.00",
    patientBalance: "$0.00",
    lastPatientPay: "No payment",
    lastInsPay: "No payment",
    location: "Riverside Dental · Operatory 2",
    nextTxAppt: { date: "01/17/2023", time: "10:00 AM", provider: "SMI" },
    nextHygAppt: { date: "01/17/2023", time: "10:00 AM", provider: "SMI" },
    hygQueDate: "01/15/2023",
    badges: ["P", "H", "T", "F", "D"],
    tags: [
      { label: "Hyg", bg: "#dcfce7", color: "#15803d", border: "#86efac" },
      { label: "Tx",  bg: "#eff6ff", color: "#2262ef", border: "#bfdbfe" },
    ],
  };

  const initials = pt.name
    ? pt.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "AT";

  const selectSx = {
    fontFamily: "Inter", fontSize: "11px", color: "#6b7280",
    borderRadius: "8px",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e5eb" },
    "& .MuiSelect-select": { py: "6px", pl: "8px", display: "flex", alignItems: "center", gap: "6px" },
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <Box onClick={onClose} sx={{
        position: "fixed", top: "65px", left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
        zIndex: 1300,
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.25s ease",
      }} />

      {/* Slider panel */}
      <Box sx={{
        position: "fixed", top: "65px", left: 0, right: 0,
        backgroundColor: "#fff",
        borderBottom: "2px solid #2262ef",
        borderRadius: "0 0 16px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        zIndex: 1301,
        transform: open ? "translateY(0)" : "translateY(-110%)",
        visibility: open ? "visible" : "hidden",
        transition: open
          ? "transform 0.28s cubic-bezier(0.4,0,0.2,1)"
          : "transform 0.28s cubic-bezier(0.4,0,0.2,1), visibility 0s linear 0.28s",
        overflowX: "auto",
      }}>

        {/* ── HEADER ROW ── */}
        <Box sx={{
          display: "flex", alignItems: "center", gap: "10px",
          px: "16px", py: "10px",
          borderBottom: "2px solid #2262ef",
          backgroundColor: "#f3f8fd",
        }}>
          {/* Avatar */}
          <Box sx={{
            width: "42px", height: "42px", borderRadius: "50%",
            backgroundColor: "#2262ef",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#fff" }}>
              {initials}
            </Typography>
          </Box>

          {/* Name + subtitle */}
          <Box sx={{ mr: "4px" }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 700, color: "#09121f" }}>
                {pt.name}
              </Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", fontWeight: 600 }}>
                pt #{pt.id}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>
              Selected family member
            </Typography>
          </Box>

          <VDiv />

          {/* Action icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <ActionBtn icon={<NoteAlt />}       title="Notes" />
            <ActionBtn icon={<AttachMoney />}    title="Billing" active />
            <ActionBtn icon={<Sell />}           title="Tags" />
            <ActionBtn icon={<People />}         title="Family" />
            <ActionBtn icon={<LocalHospital />}  title="Clinical" />
          </Box>

          <VDiv />

          {/* Refresh */}
          <Box onClick={() => {}} sx={{
            display: "flex", alignItems: "center", gap: "5px",
            borderRadius: "6px", px: "8px", py: "5px", cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
          }}>
            <Refresh sx={{ fontSize: "14px", color: "#6b7280" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 500, color: "#6b7280" }}>
              Refresh
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Tags */}
          <Box sx={{ display: "flex", gap: "5px" }}>
            {pt.tags.map((t) => (
              <Chip
                key={t.label}
                label={t.label}
                size="small"
                sx={{
                  backgroundColor: t.bg,
                  color: t.color,
                  border: `1px solid ${t.border}`,
                  fontFamily: "Inter", fontSize: "10px", fontWeight: 700,
                  height: "22px", borderRadius: "6px",
                  "& .MuiChip-label": { px: "7px" },
                }}
              />
            ))}
          </Box>

          <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
            <Close sx={{ fontSize: "16px" }} />
          </IconButton>
        </Box>

        {/* ── BODY ── */}
        <Box sx={{ display: "flex", backgroundColor: "#fff" }}>

          {/* Col 1 — Demographics */}
          <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5" }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#09121f" }}>
              {pt.dob}
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280", mb: "10px" }}>
              Age {pt.age}
            </Typography>

            <Box sx={{ display: "flex", gap: "3px", mb: "12px" }}>
              {pt.badges.map((b) => <Badge key={b} letter={b} />)}
            </Box>

            <NoteLine icon={<LinkOutlined sx={{ fontSize: "13px" }} />}   text="Premed not required" iconColor="#9aa3ae" />
            <NoteLine icon={<MonitorHeart sx={{ fontSize: "13px" }} />}   text="No medical alerts"   iconColor="#22c55e" />
            <NoteLine icon={<StarBorder   sx={{ fontSize: "13px" }} />}   text="No request sent"     iconColor="#f59e0b" />
          </Box>

          {/* Col 2 — Contact */}
          <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5", overflow: "hidden" }}>
            <ContactLine icon={<Email sx={{ fontSize: "13px" }} />}              text={pt.email}    color="#2262ef" />
            <ContactLine icon={<Phone sx={{ fontSize: "13px" }} />}              text={pt.phone}    color="#2262ef" />
            <ContactLine icon={<ChatBubbleOutline sx={{ fontSize: "13px" }} />}  text="Patient communication" />

            {/* Family members */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "12px" }}>
              <People sx={{ fontSize: "13px", color: "#9aa3ae", flexShrink: 0 }} />
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>
                {pt.familyMembersCount} family member{pt.familyMembersCount !== 1 ? "s" : ""}
              </Typography>
              <KeyboardArrowDown sx={{ fontSize: "14px", color: "#9aa3ae" }} />
            </Box>

            {/* Request review */}
            <Box sx={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              backgroundColor: "#2262ef", borderRadius: "8px",
              px: "12px", py: "6px", cursor: "pointer",
              "&:hover": { backgroundColor: "#1a50cc" },
            }}>
              <AutoAwesome sx={{ fontSize: "12px", color: "#fff" }} />
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#fff" }}>
                Request review
              </Typography>
            </Box>
          </Box>

          {/* Col 3 — Coverage & flags */}
          <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: "6px", mb: "4px" }}>
              <RadioButtonUnchecked sx={{ fontSize: "13px", color: "#9aa3ae", mt: "1px", flexShrink: 0 }} />
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#09121f" }}>
                Patient has no active coverage
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", cursor: "pointer", pl: "19px", "&:hover": { textDecoration: "underline" } }}>
              + Add insurance
            </Typography>

            <Divider sx={{ my: "10px", borderColor: "#f0f2f5" }} />

            <SL>Patient Flags</SL>
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
              + Add flags
            </Typography>
          </Box>

          {/* Col 4 — Balance */}
          <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "3px" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>Family Balance</Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 700, color: "#ef4444" }}>{pt.familyBalance}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "10px" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>Patient Balance</Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 700, color: "#ef4444" }}>{pt.patientBalance}</Typography>
            </Box>

            <Divider sx={{ mb: "8px", borderColor: "#f0f2f5" }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: "3px" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>Last patient pay</Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>{pt.lastPatientPay}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>Last ins pay</Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>{pt.lastInsPay}</Typography>
            </Box>
          </Box>

          {/* Col 5 — Doctor panel */}
          <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Select size="small" displayEmpty value="" sx={selectSx}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <PersonOutlined sx={{ fontSize: "14px", color: "#9aa3ae" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>Select a preferred dentist</MenuItem>
            </Select>

            <ApptBlock
              label="NEXT TX APPT"
              date={pt.nextTxAppt.date}
              time={pt.nextTxAppt.time}
              provider={pt.nextTxAppt.provider}
              icon={<CalendarMonth sx={{ fontSize: "12px" }} />}
            />

            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", cursor: "pointer", mt: "auto", "&:hover": { textDecoration: "underline" } }}>
              View Appt History →
            </Typography>
          </Box>

          {/* Col 6 — Hygienist panel */}
          <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Select size="small" displayEmpty value="" sx={selectSx}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <PersonOutlined sx={{ fontSize: "14px", color: "#9aa3ae" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>Select a preferred hygienist</MenuItem>
            </Select>

            <ApptBlock
              label="NEXT HYG APPT"
              date={pt.nextHygAppt.date}
              time={pt.nextHygAppt.time}
              provider={pt.nextHygAppt.provider}
              icon={<CalendarMonth sx={{ fontSize: "12px" }} />}
            />

            <Box sx={{ mt: "auto" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "3px", mb: "2px" }}>
                <WarningAmber sx={{ fontSize: "12px", color: "#f59e0b" }} />
                <SL>HYG DUE DATE</SL>
              </Box>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#f59e0b" }}>
                {pt.hygQueDate}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ── FOOTER ── */}
        <Box sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          px: "16px", py: "7px",
          borderTop: "1px solid #f0f2f5",
          backgroundColor: "#f8fafc",
          borderRadius: "0 0 16px 16px",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <PlaceOutlined sx={{ fontSize: "13px", color: "#9aa3ae" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>
              {pt.location}
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
            Last updated just now
          </Typography>
        </Box>
      </Box>
    </>,
    document.body,
  );
};

export default PatientSlider;
