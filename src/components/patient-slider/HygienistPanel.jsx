import { Box, InputAdornment, MenuItem, Select, Typography } from "@mui/material";
import { PersonOutline, CalendarTodayOutlined, PendingActionsOutlined } from "@mui/icons-material";
import { ApptBlock, SL, selectSx } from "./helpers";

const HygienistPanel = ({ pt }) => (
  <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
    <Select size="small" displayEmpty value="" sx={selectSx}
      startAdornment={
        <InputAdornment position="start" sx={{ mr: 0 }}>
          <PersonOutline sx={{ fontSize: "14px", color: "#9aa3ae" }} />
        </InputAdornment>
      }
    >
      <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
        Select a preferred hygienist
      </MenuItem>
    </Select>

    <ApptBlock
      label="NEXT HYG APPT"
      date={pt.nextHygAppt.date}
      time={pt.nextHygAppt.time}
      provider={pt.nextHygAppt.provider}
      icon={<CalendarTodayOutlined sx={{ fontSize: "12px" }} />}
    />

    <Box sx={{ mt: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "3px", mb: "2px" }}>
        <PendingActionsOutlined sx={{ fontSize: "12px", color: "#f59e0b" }} />
        <SL>HYG DUE DATE</SL>
      </Box>
      <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#09121f" }}>
        {pt.hygQueDate}
      </Typography>
    </Box>
  </Box>
);

export default HygienistPanel;
