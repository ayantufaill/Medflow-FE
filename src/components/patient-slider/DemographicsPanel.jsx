import { Box, Typography } from "@mui/material";
import { StarBorder } from "@mui/icons-material";
import { LetterBadge, NoteLine } from "./helpers";
import PremmedIcon from "../../assets/operatory icons/premmed.png";
import HeartIcon from "../../assets/operatory icons/heart.png";


const DemographicsPanel = ({ pt }) => (
  <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5" }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: "#09121f" }}>
      {pt.dob}
    </Typography>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280", mb: "10px" }}>
      Age {pt.age}
    </Typography>

    <Box sx={{ display: "flex", gap: "3px", mb: "12px" }}>
      {pt.badges.map((b) => <LetterBadge key={b} letter={b} />)}
    </Box>

    <NoteLine icon={<Box component="img" src={PremmedIcon} sx={{ width: "13px", height: "13px" }} />}  text="Premed not required" iconColor="#9aa3ae" />
    <NoteLine icon={<Box component="img" src={HeartIcon} sx={{ width: "13px", height: "13px", objectFit: "contain" }} />}  text="No medical alerts"   iconColor="#22c55e" />
    <NoteLine icon={<StarBorder   sx={{ fontSize: "13px" }} />}  text="No request sent"     iconColor="#f59e0b" />
  </Box>
);

export default DemographicsPanel;
