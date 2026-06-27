import { Box, Typography } from "@mui/material";
import { Phone, GppGood, AttachMoney, CalendarMonth } from "@mui/icons-material";
import InitialsAvatar from "../../../shared/InitialsAvatar";
import StatusBadge from "./StatusBadge";

const Dot = () => (
  <Box sx={{ width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "#c4cbd4", flexShrink: 0 }} />
);

const PatientListCard = ({ patient, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      py: "10px", px: "12px", cursor: "pointer",
      "&:hover": { backgroundColor: "#f8fafc" },
    }}
  >
    <InitialsAvatar name={patient.name} size={40} fontSize={13} />

    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Row 1: name + status */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "3px" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#09121f" }}>
          {patient.name}
        </Typography>
        <StatusBadge status={patient.status} />
      </Box>

      {/* Row 2: chart # · phone */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: "3px" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>
          pt #{patient.id}
        </Typography>
        <Dot />
        <Phone sx={{ fontSize: "11px", color: "#9aa3ae" }} />
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>
          {patient.phone}
        </Typography>
      </Box>

      {/* Row 3: insurance · balance · appointment */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
        <GppGood sx={{ fontSize: "12px", color: "#9aa3ae" }} />
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>
          {patient.insurance}
        </Typography>

        {patient.balance && (
          <>
            <AttachMoney sx={{ fontSize: "12px", color: "#f59e0b" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#f59e0b" }}>
              ${patient.balance}
            </Typography>
          </>
        )}

        {patient.appt && (
          <>
            <CalendarMonth sx={{ fontSize: "12px", color: "#9aa3ae" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>
              {patient.appt}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  </Box>
);

export default PatientListCard;
