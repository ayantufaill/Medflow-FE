import { Box, Typography } from "@mui/material";
import { Phone, GppGood, CalendarMonth } from "@mui/icons-material";
import InitialsAvatar from "../../../shared/InitialsAvatar";
import StatusBadge from "./StatusBadge";

const CurrentPatientCard = ({ patient }) => (
  <Box
    sx={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      backgroundColor: "#eff6ff",
      borderRadius: "10px",
      px: "12px", py: "10px",
      cursor: "pointer",
      "&:hover": { backgroundColor: "#dbeafe" },
    }}
  >
    <InitialsAvatar name={patient.name} size={40} fontSize={13} />

    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Row 1: name + CURRENT badge + status */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "3px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 700, color: "#09121f" }}>
            {patient.name}
          </Typography>
          {/* CURRENT pill — solid blue */}
          <Box sx={{ backgroundColor: "#2262ef", borderRadius: "20px", px: "8px", py: "1px" }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 700, color: "#fff" }}>
              CURRENT
            </Typography>
          </Box>
        </Box>
        <StatusBadge status={patient.status} />
      </Box>

      {/* Row 2: chart # · phone */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: "3px" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>
          pt #{patient.id}
        </Typography>
        <Box sx={{ width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "#c4cbd4" }} />
        <Phone sx={{ fontSize: "11px", color: "#9aa3ae" }} />
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>
          {patient.phone}
        </Typography>
      </Box>

      {/* Row 3: coverage · appointment */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <GppGood sx={{ fontSize: "12px", color: "#9aa3ae" }} />
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>
          {patient.coverage}
        </Typography>
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

export default CurrentPatientCard;
