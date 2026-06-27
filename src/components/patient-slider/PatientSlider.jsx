import { Box, Chip, Divider, IconButton, MenuItem, Select, Typography } from "@mui/material";
import {
  Close, ContentCopy, AttachMoney, Assignment, People, History,
  Refresh, Email, Phone, ChatBubbleOutline, FamilyRestroom,
  EventNote, MedicalServices,
} from "@mui/icons-material";

/* ── tiny label ─────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "9px", fontWeight: 700, color: "#9aa3ae", letterSpacing: "0.6px", mb: "4px" }}>
    {children}
  </Typography>
);

const InfoLine = ({ icon, text, color }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "3px" }}>
    {icon && <Box sx={{ color: color || "#9aa3ae", display: "flex", alignItems: "center" }}>{icon}</Box>}
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: color || "#374151" }}>{text}</Typography>
  </Box>
);

/* ── letter badge (P H T E D) ─────────────────────────── */
const LetterBadge = ({ letter, active }) => (
  <Box sx={{
    width: "18px", height: "18px", borderRadius: "4px",
    backgroundColor: active ? "#2262ef" : "#f1f5f9",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "9px", fontWeight: 700, color: active ? "#fff" : "#9aa3ae" }}>
      {letter}
    </Typography>
  </Box>
);

/* ── action icon button ────────────────────────────────── */
const ActionBtn = ({ icon, title, active }) => (
  <IconButton
    title={title}
    size="small"
    sx={{
      width: "24px", height: "24px", borderRadius: "5px", p: 0,
      color: active ? "#2262ef" : "#5c646f",
      backgroundColor: active ? "rgba(34, 98, 239, 0.10)" : "transparent",
      "& .MuiSvgIcon-root": { fontSize: "14px" },
      "&:hover": { backgroundColor: active ? "rgba(34, 98, 239, 0.15)" : "rgba(0,0,0,0.06)" },
    }}
  >
    {icon}
  </IconButton>
);

/* ── appointment info block ────────────────────────────── */
const ApptBlock = ({ label, date, time, provider }) => (
  <Box>
    <SectionLabel>{label}</SectionLabel>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#09121f" }}>
      {date}
    </Typography>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>
      {time}
    </Typography>
    {provider && (
      <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>{provider}</Typography>
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
    location: "Riverside Dental - Operatory 2",
    nextTxAppt: { date: "01/17/2023", time: "10:00 AM", provider: "SMI" },
    nextHygAppt: { date: "01/17/2023", time: "10:00 AM", provider: "SMI" },
    hygQueDate: "01/15/2023",
    badges: ["P", "H", "T", "E", "D"],
    notes: ["Premed not required", "No medical alerts", "No request sent"],
    tags: [
      { label: "Hyg", color: "#16a34a" },
      { label: "Tx",  color: "#2262ef" },
    ],
  };

  const initials = pt.name
    ? pt.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "AT";

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(2px)",
          zIndex: 1100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Slider panel */}
      <Box
        sx={{
          position: "fixed", top: "64px", left: 0, right: 0,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e5eb",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          zIndex: 1101,
          transform: open ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* ── HEADER ROW ── */}
        <Box sx={{
          display: "flex", alignItems: "center", gap: "12px",
          px: "16px", py: "10px",
          borderBottom: "1px solid #f0f2f5",
          backgroundColor: "#f8fafc",
        }}>
          {/* Avatar */}
          <Box sx={{
            width: "40px", height: "40px", borderRadius: "50%",
            backgroundColor: "#0d9488",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#fff" }}>
              {initials}
            </Typography>
          </Box>

          {/* Name block */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 700, color: "#09121f" }}>
                {pt.name}
              </Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", fontWeight: 600 }}>
                pt #{pt.id}
              </Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
                {pt.chartRef}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>
              Selected family member
            </Typography>
          </Box>

          {/* Action icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "3px", ml: "8px" }}>
            <ActionBtn icon={<ContentCopy />} title="Copy" />
            <ActionBtn icon={<AttachMoney />}  title="Billing" active />
            <ActionBtn icon={<Assignment />}   title="Chart" />
            <ActionBtn icon={<People />}       title="Family" />
            <ActionBtn icon={<History />}      title="History" />
          </Box>

          <Box
            sx={{
              display: "flex", alignItems: "center", gap: "4px",
              border: "1px solid #e0e5eb", borderRadius: "6px",
              px: "8px", py: "4px", cursor: "pointer",
              "&:hover": { backgroundColor: "#f1f5f9" },
            }}
          >
            <Refresh sx={{ fontSize: "12px", color: "#6b7280" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 500, color: "#374151" }}>
              Refresh
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Tags */}
          <Box sx={{ display: "flex", gap: "4px" }}>
            {pt.tags.map((t) => (
              <Chip
                key={t.label}
                label={t.label}
                size="small"
                sx={{
                  backgroundColor: t.color, color: "#fff",
                  fontFamily: "Inter", fontSize: "10px", fontWeight: 700,
                  height: "20px", borderRadius: "4px",
                  "& .MuiChip-label": { px: "6px" },
                }}
              />
            ))}
          </Box>

          <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280", ml: "4px" }}>
            <Close sx={{ fontSize: "16px" }} />
          </IconButton>
        </Box>

        {/* ── BODY ── */}
        <Box sx={{ display: "flex", px: "16px", py: "12px", gap: "0px" }}>

          {/* Col 1 — Demographics & medical flags */}
          <Box sx={{ minWidth: "160px", pr: "16px", borderRight: "1px solid #f0f2f5" }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#09121f" }}>
              {pt.dob}
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280", mb: "8px" }}>
              Age {pt.age}
            </Typography>

            <Box sx={{ display: "flex", gap: "3px", mb: "10px" }}>
              {pt.badges.map((b) => <LetterBadge key={b} letter={b} />)}
            </Box>

            {pt.notes.map((n) => (
              <Box key={n} sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "3px" }}>
                <Box sx={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#d1d5db", flexShrink: 0 }} />
                <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>{n}</Typography>
              </Box>
            ))}
          </Box>

          {/* Col 2 — Contact */}
          <Box sx={{ minWidth: "220px", px: "16px", borderRight: "1px solid #f0f2f5" }}>
            <InfoLine icon={<Email sx={{ fontSize: "12px" }} />} text={pt.email} color="#2262ef" />
            <InfoLine icon={<Phone sx={{ fontSize: "12px" }} />} text={pt.phone} />
            <InfoLine icon={<ChatBubbleOutline sx={{ fontSize: "12px" }} />} text="Patient communication" />
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "10px" }}>
              <FamilyRestroom sx={{ fontSize: "12px", color: "#9aa3ae" }} />
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>
                {pt.familyMembersCount} family member{pt.familyMembersCount !== 1 ? "s" : ""}
              </Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "10px", color: "#2262ef", cursor: "pointer" }}>›</Typography>
            </Box>

            <Box
              sx={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                backgroundColor: "#2262ef", borderRadius: "6px",
                px: "10px", py: "5px", cursor: "pointer",
                "&:hover": { backgroundColor: "#1a50cc" },
              }}
            >
              <MedicalServices sx={{ fontSize: "12px", color: "#fff" }} />
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#fff" }}>
                Request review
              </Typography>
            </Box>
          </Box>

          {/* Col 3 — Coverage & flags */}
          <Box sx={{ minWidth: "160px", px: "16px", borderRight: "1px solid #f0f2f5" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "6px" }}>
              <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", border: "1.5px solid #9aa3ae", flexShrink: 0 }} />
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>
                Patient has no active coverage
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", cursor: "pointer", mb: "14px", "&:hover": { textDecoration: "underline" } }}>
              + Add insurance
            </Typography>

            <SectionLabel>PATIENT FLAGS</SectionLabel>
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
              + Add flags
            </Typography>
          </Box>

          {/* Col 4 — Balance */}
          <Box sx={{ minWidth: "160px", px: "16px", borderRight: "1px solid #f0f2f5" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: "2px" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>Family Balance</Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#ef4444" }}>{pt.familyBalance}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: "10px" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>Patient Balance</Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#374151" }}>{pt.patientBalance}</Typography>
            </Box>

            <Divider sx={{ mb: "8px" }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: "2px" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>Last patient pay</Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>{pt.lastPatientPay}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>Last ins pay</Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>{pt.lastInsPay}</Typography>
            </Box>
          </Box>

          {/* Col 5 — Preferred providers */}
          <Box sx={{ minWidth: "180px", px: "16px", borderRight: "1px solid #f0f2f5", display: "flex", flexDirection: "column", gap: "8px" }}>
            <Box>
              <SectionLabel>PREFERRED DENTIST</SectionLabel>
              <Select
                size="small" displayEmpty fullWidth
                value=""
                sx={{ fontFamily: "Inter", fontSize: "11px", borderRadius: "6px", "& .MuiSelect-select": { py: "4px" } }}
              >
                <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>Select a preferred dentist</MenuItem>
              </Select>
            </Box>
            <Box>
              <SectionLabel>PREFERRED HYGIENIST</SectionLabel>
              <Select
                size="small" displayEmpty fullWidth
                value=""
                sx={{ fontFamily: "Inter", fontSize: "11px", borderRadius: "6px", "& .MuiSelect-select": { py: "4px" } }}
              >
                <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>Select a preferred hygienist</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Col 6 — Appointments */}
          <Box sx={{ flex: 1, px: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <ApptBlock
              label="NEXT TX APPT"
              date={pt.nextTxAppt.date}
              time={pt.nextTxAppt.time}
              provider={pt.nextTxAppt.provider}
            />
            <ApptBlock
              label="NEXT HYG APPT"
              date={pt.nextHygAppt.date}
              time={pt.nextHygAppt.time}
              provider={pt.nextHygAppt.provider}
            />
            <Box>
              <SectionLabel>HYG QUE DATE</SectionLabel>
              <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#f59e0b" }}>
                {pt.hygQueDate}
              </Typography>
            </Box>

            <Typography
              sx={{ fontFamily: "Inter", fontSize: "11px", color: "#2262ef", cursor: "pointer", "&:hover": { textDecoration: "underline" }, mt: "auto" }}
            >
              View Appt History →
            </Typography>
          </Box>
        </Box>

        {/* ── FOOTER ── */}
        <Box sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          px: "16px", py: "6px",
          borderTop: "1px solid #f0f2f5",
          backgroundColor: "#f8fafc",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <EventNote sx={{ fontSize: "12px", color: "#9aa3ae" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>
              {pt.location}
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
            Last updated just now
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default PatientSlider;
